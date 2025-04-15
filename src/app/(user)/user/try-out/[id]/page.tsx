'use client';

import { use } from 'react';

import { SpinnerPageCentered } from '@/components/ui/spinner';
import { api } from '@/trpc/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from './_components/header';
import RestTime from './_components/rest-time';
import StartTryout from './_components/start-tryout';
import Tryout from './_components/tryout';
import TryoutResult from './_components/tryout-result';

export interface TryoutPageProps {
  params: Promise<{ id: string }>;
}
const TryoutPage = ({ params }: TryoutPageProps) => {
  const pathname = usePathname();
  const isTesting = pathname?.toLowerCase().includes('testing') || false;

  // const { id } = router.query;
  // const searchParams = useSearchParams();
  // const id = searchParams?.get('id');

  // const tryoutId = params.id || '';
  const { id: tryoutId } = use(params);

  console.log({ tryoutId, params });

  const [loading, setLoading] = useState<boolean>(true);
  const trpc = api.useUtils();

  const { data: tryoutData, isLoading } = api.tryout.getTryoutById.useQuery(
    { tryoutId },
    { refetchOnWindowFocus: false },
  );

  const { mutateAsync: FinishTryOutLate } =
    api.tryoutSession.finishSessionLate.useMutation({
      onSuccess() {
        trpc.tryout.getTryoutById.refetch();
        window.location.reload();
      },
    });

  const getIsTryoutDone = () => {
    let done = true;
    tryoutData?.TryoutSession.forEach((item) => {
      if (
        item.TryoutSessionParticipant.length === 0 ||
        !item.TryoutSessionParticipant[0].isDone
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

  const [currentIndexSession, setCurrentIndexSession] = useState<number>(0);

  const currentSession = tryoutData?.TryoutSession[currentIndexSession];

  const isSessionDone =
    tryoutData &&
    tryoutData?.TryoutSession[currentIndexSession] &&
    tryoutData?.TryoutSession[currentIndexSession].TryoutSessionParticipant
      .length > 0
      ? tryoutData?.TryoutSession[currentIndexSession]
          .TryoutSessionParticipant[0].isDone
      : false;

  const isTryoutDone = getIsTryoutDone();

  useEffect(() => {
    if (tryoutData) {
      const getIsDone = (data: any) => {
        const endDate = new Date(data.endDate);
        const currentDate = new Date();
        return endDate < currentDate;
      };

      const isDone = getIsDone(tryoutData);

      if (isDone) {
        const check = async () => {
          const sessionPromises = tryoutData.TryoutSession.map(
            async (session) => {
              if (session.TryoutSessionParticipant.length < 1) {
                const sessionAnswer = session.TryoutQuestion?.map((item) => {
                  return {
                    number: item.number,
                    questionId: item.id,
                    answerId: '',
                    answer: '',
                    type: item.type,
                    notSure: false,
                  };
                });

                await FinishTryOutLate({
                  sessionId: session.id,
                  answer: sessionAnswer,
                });
              }
            },
          );

          await Promise.all(sessionPromises);
          let count = 0;
          tryoutData.TryoutSession.forEach((session) => {
            if (session.TryoutSessionParticipant.length > 0) {
              count = count + 1;
            }
          });
          if (count === tryoutData.TryoutSession.length) {
            setLoading(false);
          }
        };

        check();
      } else {
        setLoading(false);
      }
    }
  }, [tryoutData]);

  console.log('currentIndexSession', currentIndexSession);
  console.log('tryoutData', tryoutData);
  console.log('isSessionDone', isSessionDone);
  console.log('isTryoutDone', isTryoutDone);

  // useEffect(() => {
  //   if (tryoutData && getIsTryoutDone()) {
  //     setCurrentIndexSession(sessionLength + 1)
  //   }
  // }, [])

  useEffect(() => {
    if (tryoutData) {
      tryoutData.TryoutSession.forEach((item, i: number) => {
        if (
          item.TryoutSessionParticipant.length > 0 &&
          item.TryoutSessionParticipant[0].isDone
        ) {
          setCurrentIndexSession(i + 1);
        }
      });
    }
  }, [tryoutData]);

  if (isLoading || loading) return <SpinnerPageCentered />;

  if (!tryoutData) {
    return <div>Error....</div>;
  }

  if (!isTryoutStarted && !isTesting) {
    return (
      <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-white font-medium">
        <p>Tryout Belum Dimulai</p>
      </div>
    );
  }

  if (!isRegistered && isTryoutStarted) {
    return (
      <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-white font-medium">
        <p>Kamu tidak terdaftar</p>
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
    TryoutSessionParticipant: {
      ...session.TryoutSessionParticipant,
    },
  }));
  console.log('sessionData', sessionData);

  if (
    !isTryoutDone &&
    currentSession &&
    currentSession.TryoutSessionParticipant.length > 0
  ) {
    if (!isSessionDone) {
      return (
        <div className="fixed left-0 top-0 h-full w-full bg-workspace">
          <Tryout
            questions={question}
            sessionId={sessionData[currentIndexSession].id}
            sessionData={sessionData[currentIndexSession]}
            isSessionDone={isSessionDone}
            numberSession={currentIndexSession + 1}
          />
        </div>
      );
    }
    return (
      <div className="fixed left-0 top-0 h-full w-full bg-workspace">
        <Header
          current={0}
          total={-1}
          name={''}
        />
        <div className="absolute left-0 top-[0] flex h-full w-full items-center justify-center pt-[1rem]">
          Kamu Telah mengerjakan sesi ini
        </div>
      </div>
    );
  } else if (currentIndexSession === 0) {
    return (
      <div className="fixed left-0 top-0 h-full w-full bg-workspace">
        <StartTryout
          tryoutName={tryoutData?.title}
          restTime={tryoutData?.restTime}
          sessionData={sessionData}
          currentIndexSession={currentIndexSession}
        />
      </div>
    );
  } else if (currentIndexSession >= sessionLength) {
    return (
      <div className="fixed left-0 top-0 h-full w-full overflow-y-auto bg-workspace">
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
          resultDate={tryoutData.resultDate}
        />
      </div>
    );
  } else {
    return (
      <RestTime
        tryoutName={tryoutData?.title}
        restTime={tryoutData?.restTime}
        sessionData={sessionData}
        currentIndexSession={currentIndexSession}
      />
    );
  }
};

export default TryoutPage;
