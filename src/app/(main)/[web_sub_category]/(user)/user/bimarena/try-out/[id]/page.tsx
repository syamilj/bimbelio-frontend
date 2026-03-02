'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { SpinnerPageCentered } from '@/components/ui/spinner';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { QuestionTypeEnum, TryoutStatusEnum } from '@/types/database';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Shield } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import RestTime from './_components/rest-time';
import StartTryout from './_components/start-tryout';
import Tryout from './_components/tryout';
import TryoutResult from './_components/tryout-result';

export interface TryoutPageProps {
  params: Promise<{ id: string }>;
}

const TryoutPage = ({ params }: TryoutPageProps) => {
  const { volumeId } = useParams<{ volumeId: string }>();
  const pathname = usePathname();
  const mode = pathname.toLocaleLowerCase().includes('try-out')
    ? 'try-out'
    : 'quiz';

  const isTesting = pathname?.toLowerCase().includes('testing') || false;

  const { data: sessionUser } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const { id: tryoutId } = use(params);

  const { data: session } = useSession();

  const featureQuiz = session?.user?.feature.quiz;

  const isQuizLocked =
    featureQuiz !== 'ALLOW' &&
    !(!!featureQuiz && featureQuiz.includes(volumeId || ''));

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  // const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [loading, setLoading] = useState<boolean>(true);
  const [tryoutData, setTryoutData] = useState<TryoutDataType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTryoutById = async () => {
    if (!sessionUser) return;

    const volumeParam = volumeId ? `&volumeId=${volumeId}` : '';

    getGeneral(
      `/tryout/getTryoutById?userId=${sessionUser?.user.id}&tryoutId=${tryoutId}${volumeParam}`,
      {
        setData: setTryoutData,
        setLoading: setIsLoading,
      },
    );
  };

  useEffect(() => {
    getTryoutById();
  }, [sessionUser, tryoutId]);

  console.log({ tryoutData });

  // const FinishTryOutLate = async (payload: {
  //   userId: string;
  //   sessionId: string;
  //   answer: any[];
  // }) => {
  //   await mutateGeneral(`/tryoutSession/finishSessionLate`, {
  //     payload,
  //     type: 'post',
  //     onSuccess() {
  //       getTryoutById();
  //       window.location.reload();
  //     },
  //   });
  // };

  const getIsTryoutDone = () => {
    let done = true;
    tryoutData?.TryoutSession.forEach((item) => {
      if (
        item.TryoutSessionParticipant === null ||
        !item.TryoutSessionParticipant.isDone
      ) {
        done = false;
      }
    });
    return done;
  };

  const getIsTryoutStarted = () => {
    if (tryoutData) {
      const startDate = new Date(tryoutData?.startDate);
      const currentDate = new Date();
      if (currentDate > startDate) return true;
      return false;
    }
    return false;
  };

  const getIsRegistered = () => {
    if (tryoutData && tryoutData.TryoutRegistration.length > 0) {
      return true;
    }
    return false;
  };

  const sessionLength = tryoutData?.TryoutSession.length || 0;
  const isTryoutStarted = getIsTryoutStarted() || false;
  const isRegistered = getIsRegistered() || false;

  const isTryoutEnded = (() => {
    if (tryoutData) {
      const endDate = new Date(tryoutData.endDate);
      const currentDate = new Date();
      return currentDate > endDate;
    }
    return true;
  })();

  const [currentIndexSession, setCurrentIndexSession] = useState<number>(0);

  const currentSession = tryoutData?.TryoutSession[currentIndexSession];

  const isSessionDone =
    tryoutData &&
    tryoutData?.TryoutSession[currentIndexSession] &&
    tryoutData?.TryoutSession[currentIndexSession].TryoutSessionParticipant
      ? tryoutData?.TryoutSession[currentIndexSession].TryoutSessionParticipant
          .isDone
      : false;

  const isTryoutDone = getIsTryoutDone();

  useEffect(() => {
    if (tryoutData) {
      setLoading(false);
    }
  }, [tryoutData]);

  useEffect(() => {
    if (tryoutData) {
      tryoutData.TryoutSession.forEach((item, i: number) => {
        if (
          item.TryoutSessionParticipant &&
          item.TryoutSessionParticipant.isDone
        ) {
          setCurrentIndexSession(i + 1);
        }
      });
    }
  }, [tryoutData]);

  useEffect(() => {
    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Tryout Detail',
        content_type: 'page',
        content_id: `tryout_detail_${tryoutId}`,
      },
      user: sessionUser?.user
        ? {
            email: sessionUser.user.email,
            phone: sessionUser.user.phone || undefined,
            userId: sessionUser.user.id,
            firstName: sessionUser.user.name?.split(' ')[0],
            lastName: sessionUser.user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    });
  }, [sessionUser, tryoutId]);

  if (isLoading || loading) return <SpinnerPageCentered />;

  if (!tryoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg max-w-md mx-4"
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <AlertTriangle
                className="w-8 h-8"
                style={{ color: mainColor }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Try Out Tidak Ditemukan
            </h2>
            <p className="text-gray-600">
              Terjadi kesalahan saat memuat data try out
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isTryoutStarted && !isTesting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg max-w-md mx-4"
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Clock
                className="w-8 h-8"
                style={{ color: mainColor }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {mode === 'try-out' ? 'Try Out' : 'Quiz'} Belum Dimulai
            </h2>
            <p className="text-gray-600 mb-4">
              {mode === 'try-out' ? 'Try Out' : 'Quiz'} akan dimulai sesuai
              jadwal yang telah ditentukan
            </p>
            <div className="text-sm text-gray-500">
              Mulai: {new Date(tryoutData.startDate).toLocaleString('id-ID')}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isRegistered && isTryoutStarted && mode === 'try-out') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg max-w-md mx-4"
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Shield
                className="w-8 h-8"
                style={{ color: mainColor }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Akses Ditolak
            </h2>
            <p className="text-gray-600">
              Kamu tidak terdaftar untuk mengikuti try out ini
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const isResult = currentIndexSession >= sessionLength;

  console.log({
    mode,
    isQuizLocked,
    isTryoutStarted,
    isResult,
    volumeId,
  });

  if (
    mode === 'quiz' &&
    isQuizLocked &&
    isTryoutStarted &&
    !isResult &&
    tryoutData.isFirstQuizInVolume !== true
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg max-w-md mx-4"
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Shield
                className="w-8 h-8"
                style={{ color: mainColor }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Akses Ditolak
            </h2>
            <p className="text-gray-600">
              Kamu tidak terdaftar untuk mengikuti quiz ini
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (mode === 'quiz' && isTryoutEnded && !isResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg max-w-md mx-4"
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Clock
                className="w-8 h-8"
                style={{ color: mainColor }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Quiz ini Telah Berakhir
            </h2>
            <p className="text-gray-600 mb-4">
              Quiz ini telah berakhir sesuai jadwal yang telah ditentukan
            </p>
            <div className="text-sm text-gray-500">
              Berakhir: {new Date(tryoutData.endDate).toLocaleString('id-ID')}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const question =
    tryoutData?.TryoutSession[currentIndexSession] &&
    tryoutData?.TryoutSession[currentIndexSession].TryoutQuestion.map(
      (item) => {
        return {
          ...item,
          createAt: new Date(item.createAt),
          updateAt: new Date(item.updateAt),
        };
      },
    );

  const sessionData = tryoutData?.TryoutSession.map((session) => ({
    ...session,
    TryoutCategory: {
      ...session.TryoutCategory,
      createAt: new Date(session.TryoutCategory.createAt),
      updateAt: new Date(session.TryoutCategory.updateAt),
    },
    TryoutSessionParticipant: session.TryoutSessionParticipant,
  }));

  if (
    !isTryoutDone &&
    currentSession &&
    currentSession.TryoutSessionParticipant
  ) {
    if (!isSessionDone) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Tryout
            questions={question as any}
            sessionId={sessionData[currentIndexSession].id}
            sessionData={sessionData[currentIndexSession]}
            isSessionDone={isSessionDone}
            numberSession={currentIndexSession + 1}
            tryoutData={tryoutData}
          />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg max-w-md mx-4"
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Shield
                className="w-8 h-8"
                style={{ color: mainColor }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Sesi Telah Selesai
            </h2>
            <p className="text-gray-600">Kamu telah menyelesaikan sesi ini</p>
          </div>
        </motion.div>
      </div>
    );
  } else if (currentIndexSession === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StartTryout
          tryoutName={tryoutData?.title}
          sessionData={sessionData}
          currentIndexSession={currentIndexSession}
          tryoutData={tryoutData}
        />
      </div>
    );
  } else if (currentIndexSession >= sessionLength) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TryoutResult
          sessionData={sessionData}
          tryoutId={tryoutData?.id}
          sessionOptions={tryoutData.TryoutSession.map((session) => {
            return {
              id: session.id,
              name: session.name,
              TryoutCategory: session.TryoutCategory.name,
              TryoutSubCategory: session.TryoutSubCategory.name,
            };
          })}
          resultDate={new Date(tryoutData.resultDate)}
        />
      </div>
    );
  } else {
    const getRestTime = () => {
      const prevSession =
        currentIndexSession > 0 ? sessionData[currentIndexSession - 1] : null;
      const restTimeInSecond = tryoutData.restTime * 60;

      if (prevSession) {
        const endSessionDate = prevSession.TryoutSessionParticipant?.endSession;
        if (endSessionDate) {
          const endSession = new Date(endSessionDate).getTime();
          const currentDate = new Date().getTime();
          const diffInSeconds = Math.floor((currentDate - endSession) / 1000);

          const diffRestTime = restTimeInSecond - diffInSeconds;

          return diffRestTime > 0 ? diffRestTime : 0;
        } else {
          return restTimeInSecond;
        }
      }
      return restTimeInSecond;
    };

    return (
      <RestTime
        tryoutData={tryoutData}
        sessionData={sessionData}
        currentIndexSession={currentIndexSession}
        restTime={getRestTime()}
      />
    );
  }
};

export default TryoutPage;

export type TryoutDataType =
  | ({
      TryoutSession: ({
        TryoutCategory: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          createAt: Date;
          updateAt: Date;
          image: string | null;
        };
        TryoutSubCategory: {
          id: string;
          categoryId: string;
          name: string;
        };
        TryoutQuestion: ({
          TryoutAnswers: {
            id: string;
            questionId: string;
            answer: string;
            value: number;
          }[];
        } & {
          number: number;
          id: string;
          createAt: Date;
          updateAt: Date;
          image: string | null;
          sessionId: string;
          question: string;
          type: QuestionTypeEnum;
          explanation: string | null;
          a_discrimination: number | null;
          b_difficulty: number | null;
          c_guessing: number | null;
          subCategory: string | null;
          subSubCategory: string | null;
        })[];
        TryoutSessionParticipant: {
          id: string;
          userId: string;
          sessionId: string;
          startSession: Date;
          endSession: Date | null;
          isDone: boolean;
        } | null;
      } & {
        number: number;
        id: string;
        tryoutId: string;
        categoryId: string;
        subCategoryId: string;
        documentId: string | null;
        name: string;
        slug: string;
        description: string | null;
        duration: number;
        assessmentType: string;
        thresholdValue: number | null;
        createAt: Date;
        updateAt: Date;
      })[];
      TryoutRegistration: {
        id: string;
        tryoutId: string;
        userTryOutId: string;
      }[];
    } & {
      id: string;
      createAt: Date;
      updateAt: Date;
      title: string;
      quizOrder: number | null;
      isFirstQuizInVolume?: boolean | null;
      restTime: number;
      status: TryoutStatusEnum;
      startDate: Date;
      endDate: Date;
      resultDate: Date;
      image: string | null;
    })
  | null;
