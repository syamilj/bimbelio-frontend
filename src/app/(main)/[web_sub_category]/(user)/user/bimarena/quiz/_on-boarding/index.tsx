'use client';

import { useUserOnBoarding } from '@/components/provider/provider-on-boarding';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Trophy,
} from 'lucide-react';
import { RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuizProvider } from './dummy-data/useQuizProvider';
import { QuizCardList } from './quiz-card-list';
import { QuizLeaderboard } from './quiz-leaderboard';
import { QuizProgress } from './quiz-progress';
import { QuizStats } from './quiz-stats';
import { QuizSummary } from './quiz-summary';

export default function OnBoardingQuizPage() {
  const { userOnBoarding } = useUserOnBoarding();

  // return <BimArenaQuizPageMain />;

  return (
    <Dialog open={!userOnBoarding.QUIZ}>
      <DialogHeader hidden>
        <DialogTitle>Welcome to BimArena Quiz!</DialogTitle>
      </DialogHeader>
      <DialogContent className="w-[400px]">
        <BimArenaQuizPageMain />
      </DialogContent>
    </Dialog>
  );
}

const MobileView = ({
  children,
  iframeRef,
}: {
  children: React.ReactNode;
  iframeRef: RefObject<HTMLIFrameElement | null>;
}) => {
  const [contentRef, setContentRef] = useState(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;

      // 1. Salin semua stylesheet (Tailwind) dari halaman utama ke dalam iframe
      const head = document.head.cloneNode(true);
      (iframeDoc as any).head.innerHTML = (head as any).innerHTML;

      // 2. Set target render React ke dalam body iframe
      setContentRef((iframeDoc as any).body);
    }
  }, []);

  return (
    <div className="flex justify-center bg-gray-100">
      <iframe
        ref={iframeRef}
        title="Mobile Preview"
        className="min-w-[300px] w-full h-[600px] border-[10px] border-black rounded-[2rem] shadow-2xl bg-white"
      >
        {/* Render konten React di sini menggunakan Portal */}
        {contentRef && createPortal(children, contentRef)}
      </iframe>
    </div>
  );
};

function BimArenaQuizPageMain() {
  const { handleAddUserOnBoarding } = useUserOnBoarding();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const {
    useVolume: { selectedVolumeId },
    useUserStatistic: { UserStatistic },
  } = useQuizProvider();
  const userTarget = UserStatistic?.userTarget;
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [activeTab, setActiveTab] = useState('library');

  const tabItems = [
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'leaderboard', label: 'Peringkat', icon: Trophy },
    // { id: 'prediction', label: 'Prediksi', icon: Target },
    // { id: 'rewards', label: 'Hadiah', icon: Gift },
  ];

  const [step, setStep] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const scrollToId = (id: string) => {
    const iframeDoc = iframeRef.current?.contentDocument;
    const doc = iframeDoc?.getElementById(id);
    doc?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      if (prevStep === 2) {
        scrollToId('quiz-list');
        setActiveTab('library');
      }
      if (prevStep === 3) {
        scrollToId('quiz-progress');
        setActiveTab('progress');
      }
      if (prevStep === 4) {
        scrollToId('quiz-leaderboard');
        setActiveTab('leaderboard');
      }
    }
  };

  const handleNext = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep === 2) {
      scrollToId('quiz-list');
      setActiveTab('library');
    }
    if (nextStep === 3) {
      scrollToId('quiz-progress');
      setActiveTab('progress');
    }
    if (nextStep === 4) {
      scrollToId('quiz-leaderboard');
      setActiveTab('leaderboard');
    }
    if (nextStep === 5) {
      handleAddUserOnBoarding(
        Array.from({ length: 5 }).map((_, i) => ({
          type: 'QUIZ' as const,
          step: i + 1,
        })),
      );
    }
  };

  return (
    <div className="flex flex-col">
      <MobileView iframeRef={iframeRef}>
        <div className="min-h-screen bg-slate-50/50 pb-12">
          {/* Hero Section */}
          <div className="p-4 md:p-6">
            <QuizSummary />
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
            {/* Target University Banner */}
            {userTarget && (
              <div
                className="relative overflow-hidden rounded-3xl md:rounded-3xl p-3 md:p-4 border-2 cursor-pointer hover:shadow-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}08 0%, ${secondaryColor}05 100%)`,
                  borderColor: `${mainColor}20`,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                  {/* Left: University Info */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className="w-11 h-11 md:w-14 md:h-14 rounded-3xl md:rounded-3xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      }}
                    >
                      <GraduationCap className="w-5 h-5 md:w-7 md:h-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Target Kamu
                      </p>
                      <h3 className="font-black text-slate-800 text-sm md:text-base truncate">
                        {userTarget.univChoiceOne}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-500 font-medium truncate">
                        {userTarget.univStudyChoiceOne}
                      </p>
                    </div>
                  </div>
                  {/* Right: Stats - Horizontal scroll on mobile */}
                  <div className="relative">
                    <div
                      className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                      }}
                    >
                      <div className="flex items-center gap-3 md:gap-5 min-w-max">
                        <div className="text-center flex-shrink-0">
                          <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">
                            Target Nilai
                          </p>
                          <p
                            className="text-lg md:text-xl font-black"
                            style={{ color: mainColor }}
                          >
                            {userTarget.targetValue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedVolumeId && <QuizStats />}

            {selectedVolumeId && (
              <div className="bg-white rounded-3xl border border-slate-200 p-1.5 md:p-2">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList
                    className="w-full h-auto flex justify-start gap-1 bg-transparent p-0 overflow-x-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {tabItems.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className={cn(
                            'flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-3xl font-bold text-[11px] md:text-sm transition-all whitespace-nowrap',
                            isActive
                              ? 'text-white shadow-md'
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                          )}
                          style={
                            isActive
                              ? {
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                }
                              : {}
                          }
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>
              </div>
            )}

            {selectedVolumeId && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {activeTab === 'library' && <QuizCardList />}

                {activeTab === 'progress' && <QuizProgress />}

                {activeTab === 'leaderboard' && <QuizLeaderboard />}

                {/* {activeTab === 'prediction' && false && (
              <QuizPrediction
                userStats={userStats}
                targetUniversities={TARGET_UNIVERSITIES}
                subjectPerformance={subjectPerformance}
              />
            )} */}

                {/* {activeTab === 'rewards' && false && (
              <QuizRewards
                userStats={userStats}
                rewards={REWARDS}
                achievements={ACHIEVEMENTS}
              />
            )} */}
              </div>
            )}
          </div>
        </div>
      </MobileView>

      {/* Navigation Buttons */}
      <div className="flex flex-col gap-2 items-end mt-6">
        <div className="flex w-full">
          <span className="text-sm font-medium text-slate-600">
            Langkah {step} :{' '}
            {step === 1
              ? 'Scroll ke bawah'
              : step === 2
                ? 'Lihat list Quiz'
                : step === 3
                  ? 'Cek Progress Kamu'
                  : 'Lihat Peringkat Kamu'}
          </span>
        </div>
        <div className="flex justify-end items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center gap-2 text-sm h-[unset] px-4 py-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
            className="flex items-center gap-2 text-white hover:opacity-90 text-sm h-[unset] px-4 py-2"
          >
            {step === 4 ? 'Selesai' : 'Selanjutnya'}
            {step === 4 ? null : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
