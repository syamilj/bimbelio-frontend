'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import LoaderEyeAnimation from '@/components/ui/loading/loading-bounce';
import LoadingPageWithText from '@/components/ui/spinner';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  website_sub_category_id,
  website_sub_category_id_params,
} from '@/hooks/use-web-sub-category-id';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { getDateString, getHoursDetail } from '@/lib/utils';
import { GenderEnum } from '@/types/database';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calculator,
  Clock,
  FileText,
  Sparkles,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';
import { TryoutDataType } from '../../page';
import CountdownResult from '../countdown-result';
import { AnalisisTab } from './_component/analisis-tab';
import { ReviewTab } from './_component/review-tab';
import { RingkasanTab } from './_component/ringkasan-tab';

export interface SessionOptionsProps {
  id: string;
  name: string;
  TryoutCategory: string;
  TryoutSubCategory: string;
}

interface Props {
  sessionData: NonNullable<TryoutDataType>['TryoutSession'];
  tryoutId: string;
  sessionOptions: SessionOptionsProps[];
  resultDate: Date;
}

export interface ResultDataProps {
  userScore: number;
  totalParticipants: number;
  summaryTryout: SummaryTryout;
  choiceAnalisis: ChoiceAnalisis;
  TryoutSession: {
    userScore: number;
    totalParticipants: number;
  }[];
}

interface SummaryTryout {
  userScore: number;
  sessionResult: {
    id: string;
    category: string;
    subCategory: string;
    correctAnswers: number;
    wrongAnswers: number;
    totalQuestions: number;
    score: number;
    totalParticipants: number;
    ranking: number;
  }[];
  Result: {
    category: string;
    data: {
      id: string;
      title: string;
      correctAnswers: number;
      wrongAnswers: number;
      totalQuestions: number;
      score: number;
      totalParticipants: number;
      ranking: number;
    }[];
  }[];
}

interface ChoiceAnalisis {
  userScore: number;
  rankingTryout: number;
  tryoutPersentage: number;
  rankingUniv: number;
  rankingMajor: number;
  university: {
    univ: string;
    univAverageScore: number;
    major: string;
    majorAverageScore: number;
    univRanking: number;
    univPercentage: number;
    univTotalAplicants: number;
    majorRanking: number;
    majorPercentage: number;
    majorTotalAplicants: number;
  }[];
}

type TabsProps = 'ringkasan' | 'review' | 'analisis';

export type TryoutAccountType =
  | {
      gender: GenderEnum;
      age: number;
      phone: string;
      kabupaten: string;
      provinsi: string;
      channel: string;
      website_sub_category_id: string;
      id: string;
      userTryOutId: string;
      targetValue: number | null;
      univChoiceOne: string | null;
      univStudyChoiceOne: string | null;
      univChoiceTwo: string | null;
      univStudyChoiceTwo: string | null;
    }
  | undefined;

export default function TryoutResult({
  sessionData,
  tryoutId,
  sessionOptions,
  resultDate,
}: Props) {
  const { volumeId } = useParams<{ volumeId: string }>();
  const pathname = usePathname();

  const mode = pathname.toLocaleLowerCase().includes('try-out')
    ? 'try-out'
    : 'quiz';

  const isTesting = pathname?.toLowerCase().includes('testing') || false;
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') as TabsProps;

  // Get dynamic colors - mengikuti pattern dari tryout.tsx
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const currentDate = new Date();

  const [tabs, setTabs] = useState<TabsProps>('review');
  const [resultIndex, setResultIndex] = useState<number>(0);

  const [TestAgainTryoutLoading, setTestAgainTryoutLoading] =
    useState<boolean>(false);

  const currentSession = sessionData[resultIndex];

  const sessionId =
    sessionData && sessionData.length > 0 ? sessionData[resultIndex].id : '';

  const TestAgainTryout = async (payload: {
    userId: string;
    tryoutId: string;
  }) => {
    await mutateGeneral('/tryout/testAgain', {
      payload,
      type: 'post',
      onSuccess() {
        setTestAgainTryoutLoading(false);
        router.push(`/${website_sub_category_id}/admin/tryout/testing/try-out`);
      },
      onError() {
        setTestAgainTryoutLoading(false);
      },
    });
  };

  const [unlockTryoutDbs, setUnlockTryoutDbs] = useState<any>();
  const [unlockTryoutIsLoading, setUnlockTryoutIsLoading] =
    useState<boolean>(true);
  const [unlockTryoutIsError, setUnlockTryoutIsError] =
    useState<boolean>(false);

  useEffect(() => {
    if (mode === 'try-out') {
      getGeneral(
        `/tryout/getTryoutUnlockByTryoutId?userId=${session?.user.id}&tryoutId=${tryoutId}`,
        {
          setData: setUnlockTryoutDbs,
          setLoading: setUnlockTryoutIsLoading,
          onError() {
            setUnlockTryoutIsError(true);
          },
        },
      );
    } else {
      setUnlockTryoutDbs(true);
      setUnlockTryoutIsLoading(false);
    }
  }, [session, tryoutId, mode]);

  const unlockTryout =
    session && session.user.role !== 'USER' ? true : unlockTryoutDbs || false;

  const [sessionResult, setSessionResult] = useState<any>();
  const [sessionResultIsLoading, setSessionResultIsLoading] =
    useState<boolean>(true);
  const [sessionResultIsError, setSessionResultIsError] =
    useState<boolean>(false);

  useEffect(() => {
    getGeneral(
      `/tryoutSession/getTryoutSessionResult?userId=${session?.user.id}&sessionId=${sessionId}`,
      {
        setData: setSessionResult,
        setLoading: setSessionResultIsLoading,
        onError() {
          setSessionResultIsError(true);
        },
      },
    );
  }, [session, sessionId]);

  const [ResultData, setResultData] = useState<any>();
  const [ResultDataIsLoading, setResultDataIsLoading] = useState<boolean>(true);
  const [ResultDataIsError, setResultDataIsError] = useState<boolean>(false);

  useEffect(() => {
    getGeneral(
      `/tryout/getAnalisisByTryoutId?userId=${session?.user.id}&tryoutId=${tryoutId}`,
      {
        setData: setResultData,
        setLoading: setResultDataIsLoading,
        onError() {
          setResultDataIsError(true);
        },
      },
    );
  }, [session, tryoutId]);

  console.log({ ResultData });

  // Update URL without causing re-render using replaceState
  useEffect(() => {
    const newUrl = !isTesting
      ? mode === 'try-out'
        ? `/${website_sub_category_id}/user/bimarena/try-out/${tryoutId}?tab=${tabs}`
        : `/${website_sub_category_id}/user/bimarena/quiz/${volumeId}/${tryoutId}?tab=${tabs}`
      : `/${website_sub_category_id}/admin/tryout/testing/try-out/${tryoutId}?tab=${tabs}`;
    window.history.replaceState(null, '', newUrl);
  }, [tabs, isTesting, mode, tryoutId, volumeId]);

  useEffect(() => {
    if (tab) {
      setTabs(tab);
    }
  }, []);

  const [tryoutAccount, setTryoutAccount] = useState<TryoutAccountType>();

  const getUserTryout = async () => {
    getGeneral(`/user/getUserTryOut?userId=${session?.user.id}`, {
      setData: setTryoutAccount,
    });
  };

  useEffect(() => {
    getUserTryout();
  }, []);

  // Direct navigation for back button (tryout is done, no confirmation needed)
  const handleExit = () => {
    router.push(
      `/${website_sub_category_id}/user/bimarena/${mode === 'try-out' ? 'try-out' : 'quiz'}`,
    );
  };

  if (currentDate < resultDate && !isTesting) {
    return <CoundowntShowResult resultDate={resultDate} />;
  }

  if (ResultDataIsError || sessionResultIsError || unlockTryoutIsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg max-w-md mx-4"
        >
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <FileText
                className="w-8 h-8"
                style={{ color: mainColor }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Gagal Memuat Hasil
            </h2>
            <p className="text-gray-600">
              Terjadi kesalahan saat memuat hasil {mode}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (
    sessionResultIsLoading ||
    !sessionResult ||
    ResultDataIsLoading ||
    !ResultData ||
    unlockTryoutIsLoading ||
    unlockTryout === undefined
  )
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <LoaderEyeAnimation />
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Memproses Hasil {mode === 'quiz' ? 'Quiz' : 'Try Out'}
            </h3>
            <p className="text-gray-600">
              Mohon tunggu sebentar, kami sedang menyiapkan hasil Kamu...
            </p>
          </div>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Header Info */}
            <div className="flex items-center gap-3">
              {/* Exit Button */}
              <Button
                variant="ghost"
                onClick={handleExit}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 p-2 rounded-3xl hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>

              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-3xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Trophy
                  className="w-5 h-5 md:w-6 md:h-6"
                  style={{ color: mainColor }}
                />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-black text-slate-900">
                  Hasil {mode === 'quiz' ? 'Quiz' : 'Try Out'}
                </h1>
                <p className="text-xs md:text-sm text-slate-600">
                  Review dan analisis performa Kamu
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              {(session?.user.role === 'ADMIN' ||
                session?.user.role === 'SUPER_ADMIN') && (
                <Button
                  onClick={() => {
                    setTestAgainTryoutLoading(true);
                    TestAgainTryout({ tryoutId, userId: session.user.id });
                  }}
                  variant="outline"
                  className="rounded-3xl border text-xs md:text-sm"
                  style={{ borderColor: `${mainColor}30` }}
                >
                  Test Again
                </Button>
              )}

              {website_sub_category_id_params === 'simak-ui' && (
                <Button
                  className="rounded-3xl font-black text-white shadow-sm text-xs md:text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                  asChild
                >
                  <Link
                    href={`/${website_sub_category_id_params}/user/prediction/step?tryoutId=${tryoutId}&step=new`}
                  >
                    <Calculator className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">
                      Prediksi Tryout ini
                    </span>
                    <span className="sm:hidden">Prediksi</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-4 md:py-6">
        {website_sub_category_id_params === 'simak-ui' && <PopUpPrediction />}
        <LoadingPageWithText
          loading={TestAgainTryoutLoading}
          heading="Mereset Data Tryout..."
        />

        {/* Main Content with Tabs at Top */}
        <Tabs
          value={tabs}
          onValueChange={(value) => setTabs(value as TabsProps)}
          className="w-full"
        >
          {/* Tabs Navigation */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3 md:mb-4">
              <div className="flex items-center gap-2">
                <Trophy
                  className="w-5 h-5"
                  style={{ color: mainColor }}
                />
                <h2 className="text-lg md:text-xl font-black text-slate-900">
                  Hasil {mode === 'quiz' ? 'Quiz' : 'Try Out'}
                </h2>
              </div>

              {/* Quick Stats Summary */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right">
                  <div
                    className="text-xl md:text-2xl font-black"
                    style={{ color: mainColor }}
                  >
                    {ResultData?.userScore?.toFixed(0) || '0'}
                  </div>
                  <div className="text-[10px] md:text-xs text-slate-600 font-medium">
                    Total Skor
                  </div>
                </div>
                {unlockTryout && ResultData?.choiceAnalisis?.rankingTryout && (
                  <>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="text-right">
                      <div className="text-lg md:text-xl font-black text-green-600">
                        #{ResultData.choiceAnalisis.rankingTryout}
                      </div>
                      <div className="text-[10px] md:text-xs text-slate-600 font-medium">
                        Peringkat
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tabs List */}
            <div
              className="inline-flex items-center rounded-3xl p-1 gap-1 bg-slate-100 border border-slate-200 shadow-sm overflow-x-auto no-scrollbar"
              role="tablist"
            >
              <button
                onClick={() => setTabs('ringkasan')}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-3xl text-xs md:text-sm font-black whitespace-nowrap transition-all duration-200 ${
                  tabs === 'ringkasan'
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor:
                    tabs === 'ringkasan' ? mainColor : 'transparent',
                }}
                role="tab"
                aria-selected={tabs === 'ringkasan'}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Ringkasan</span>
                </div>
              </button>

              <button
                onClick={() => setTabs('review')}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-3xl text-xs md:text-sm font-black whitespace-nowrap transition-all duration-200 ${
                  tabs === 'review'
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor:
                    tabs === 'review' ? mainColor : 'transparent',
                }}
                role="tab"
                aria-selected={tabs === 'review'}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Review Soal</span>
                </div>
              </button>

              {false && (
                <button
                  onClick={() => setTabs('analisis')}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-3xl text-xs md:text-sm font-black whitespace-nowrap transition-all duration-200 ${
                    tabs === 'analisis'
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  style={{
                    backgroundColor:
                      tabs === 'analisis' ? mainColor : 'transparent',
                  }}
                  role="tab"
                  aria-selected={tabs === 'analisis'}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Analisis</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Tab Contents - Using forceMount to prevent re-mounting */}
          <TabsContent
            value="ringkasan"
            className="mt-0"
            forceMount
          >
            <div className={tabs === 'ringkasan' ? 'block' : 'hidden'}>
              <RingkasanTab
                ResultData={ResultData}
                unlockTryout={unlockTryout}
              />
            </div>
          </TabsContent>
          <TabsContent
            value="review"
            className="mt-0"
            forceMount
          >
            <div className={tabs === 'review' ? 'block' : 'hidden'}>
              <ReviewTab
                participantId={
                  currentSession.TryoutSessionParticipant?.id || ''
                }
                sessionResult={sessionResult}
                setResultIndex={setResultIndex}
                resultIndex={resultIndex}
                sessionOptions={sessionOptions}
              />
            </div>
          </TabsContent>
          <TabsContent
            value="analisis"
            className="mt-0"
            forceMount
          >
            <div className={tabs === 'analisis' ? 'block' : 'hidden'}>
              <AnalisisTab
                tryoutId={tryoutId}
                ResultData={ResultData}
                unlockTryout={unlockTryout}
                tryoutAccount={tryoutAccount}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface CoundowntShowResultProps {
  resultDate: Date;
}

const CoundowntShowResult = ({ resultDate }: CoundowntShowResultProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const pathname = usePathname();
  const router = useRouter();
  const mode = pathname.toLocaleLowerCase().includes('try-out')
    ? 'try-out'
    : 'quiz';

  const handleExit = () => {
    router.push(
      `/${website_sub_category_id}/user/bimarena/${mode === 'try-out' ? 'try-out' : 'quiz'}`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header serupa dengan tryout.tsx */}
      <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Exit Button */}
            <Button
              variant="ghost"
              onClick={handleExit}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2 rounded-3xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>

            <div
              className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Clock
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                Hasil Belum Tersedia
              </h1>
              <p className="text-sm text-gray-600">
                Menunggu waktu pengumuman hasil
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center min-h-[70vh]"
        >
          <Card
            className="max-w-md mx-auto border-2 rounded-3xl shadow-xl overflow-hidden"
            style={{
              borderColor: `${mainColor}20`,
              backgroundColor: `${mainColor}05`,
            }}
          >
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Clock className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Hasil Segera Tersedia
              </h2>
              <p className="text-gray-600 mb-6">
                Penilaian dapat dilihat dalam
              </p>

              <div className="space-y-4">
                <div
                  className="text-3xl font-mono font-bold p-4 rounded-3xl shadow-sm"
                  style={{
                    color: mainColor,
                    backgroundColor: `${mainColor}10`,
                  }}
                >
                  <CountdownResult targetDate={resultDate} />
                </div>
                <p className="text-sm text-gray-500">
                  {getDateString(resultDate)} - {getHoursDetail(resultDate)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const PopUpPrediction = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent
        className="bg-transparent border-none shadow-none md:max-w-lg"
        hideClose
      >
        <DialogTitle className="sr-only">Prediksi Kelulusan UI</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-0 rounded-3xl overflow-hidden shadow-2xl">
            <div
              className="relative p-8 text-white"
              style={{
                background: `linear-gradient(135deg, ${websiteSubCategory?.main_color}, ${websiteSubCategory?.secondary_color})`,
              }}
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
                <Calculator className="w-32 h-32" />
              </div>
              <div className="absolute inset-0 bg-[url('/sparkle.svg')] bg-cover opacity-10" />

              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-4">
                    🚀 Mulai Prediksi Kelulusanmu!
                  </h2>
                  <p className="text-lg mb-6 opacity-90">
                    Gabungkan nilai UTBK & SIMAK UI, dan lihat seberapa besar
                    peluangmu masuk UI!
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href={`/${website_sub_category_id_params}/user/prediction/step?step=new`}
                  >
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
                      🎯 Mulai Sekarang
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
