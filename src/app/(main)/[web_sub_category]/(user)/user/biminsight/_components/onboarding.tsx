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
import { cn } from '@/lib/utils';
import {
  Activity,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LineChart,
  Rocket,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  InsightCourseIllustration,
  InsightPredictionIllustration,
  InsightTryoutIllustration,
  InsightWelcomeIllustration,
} from './onboarding-illustrations';

const TOTAL_STEPS = 4;

interface StepConfig {
  title: string;
  description: string;
  emoji: string;
  Illustration: React.FC<{ color: string }>;
  features: { icon: React.ElementType; label: string; desc: string }[];
}

const steps: StepConfig[] = [
  {
    title: 'Selamat Datang di Insight!',
    description:
      'Pusat analitik belajar personal kamu. Pantau semua perkembangan belajarmu dalam satu layar interaktif.',
    emoji: '📈',
    Illustration: InsightWelcomeIllustration,
    features: [
      { icon: BarChart3, label: 'Overview', desc: 'Ringkasan performa' },
      { icon: Zap, label: 'Real-time', desc: 'Data selalu update' },
      { icon: Activity, label: 'Interaktif', desc: 'Dashboard dinamis' },
    ],
  },
  {
    title: 'Evaluasi Pembelajaran',
    description:
      'Lihat tingkat penyelesaian materi dan ketajaman pemahamanmu secara mendalam dari tiap sub-topik.',
    emoji: '📚',
    Illustration: InsightCourseIllustration,
    features: [
      { icon: BookOpen, label: 'Progress', desc: 'Track materi belajar' },
      { icon: Target, label: 'Akurasi', desc: 'Pemahaman kuis' },
      { icon: Sparkles, label: 'Fokus', desc: 'Area prioritas' },
    ],
  },
  {
    title: 'Analisis Try Out',
    description:
      'Pantau fluktuasi skormu dari waktu ke waktu dan temukan area yang masih perlu kamu tingkatkan.',
    emoji: '🎯',
    Illustration: InsightTryoutIllustration,
    features: [
      { icon: LineChart, label: 'Trend', desc: 'Grafik Skor TO' },
      { icon: BarChart3, label: 'Detail', desc: 'Skor per subtes' },
      { icon: Activity, label: 'Evaluasi', desc: 'Materi terlemah' },
    ],
  },
  {
    title: 'Prediksi Kelulusan',
    description:
      'Bandingkan skormu secara real-time dengan passing grade Universitas dan Jurusan impianmu.',
    emoji: '🎓',
    Illustration: InsightPredictionIllustration,
    features: [
      { icon: GraduationCap, label: 'Kampus', desc: 'Peluang lulus PTN' },
      { icon: Target, label: 'Rasional', desc: 'Status persaingan' },
      { icon: Sparkles, label: 'Simulasi', desc: 'Skor & Kuota riil' },
    ],
  },
];

export default function BimInsightOnboarding() {
  const { userOnBoarding, handleAddUserOnBoarding } = useUserOnBoarding();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#4C94FF';

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const finishOnboarding = useCallback(() => {
    handleAddUserOnBoarding(
      Array.from({ length: 5 }).map((_, i) => ({
        type: 'INSIGHT' as const,
        step: i + 1,
      })),
    );
  }, [handleAddUserOnBoarding]);

  const goToStep = useCallback(
    (step: number, dir: 'left' | 'right') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(dir);
      setCurrentStep(step);
      setTimeout(() => setIsAnimating(false), 300);
    },
    [isAnimating],
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentStep < TOTAL_STEPS - 1) {
        goToStep(currentStep + 1, 'right');
      } else if (diff < 0 && currentStep > 0) {
        goToStep(currentStep - 1, 'left');
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }, [currentStep, goToStep]);

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      goToStep(currentStep + 1, 'right');
    } else {
      finishOnboarding();
    }
  }, [currentStep, goToStep, finishOnboarding]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) goToStep(currentStep - 1, 'left');
  }, [currentStep, goToStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentStep < TOTAL_STEPS - 1) {
        goToStep(currentStep + 1, 'right');
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        goToStep(currentStep - 1, 'left');
      } else if (e.key === 'Enter' && currentStep === TOTAL_STEPS - 1) {
        finishOnboarding();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, goToStep, finishOnboarding]);

  const step = steps[currentStep];
  const StepIllustration = step.Illustration;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  if (typeof window === 'undefined') return null;

  return (
    <Dialog open={!userOnBoarding.INSIGHT}>
      <DialogHeader hidden>
        <DialogTitle>Welcome to Insight!</DialogTitle>
      </DialogHeader>
      <DialogContent
        className="max-w-sm md:max-w-md p-0 overflow-hidden rounded-3xl border-0 gap-0"
        hideClose
      >
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress bar */}
          <div className="h-1 bg-slate-100">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%`,
                background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
              }}
            />
          </div>

          {/* Header with Step & Skip */}
          <div className="flex items-center justify-between px-4 pt-4">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${mainColor}15`,
                color: mainColor,
              }}
            >
              {currentStep + 1} / {TOTAL_STEPS}
            </span>
            {!isLastStep && (
              <button
                onClick={finishOnboarding}
                className="text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Lewati
              </button>
            )}
          </div>

          {/* Illustration Section */}
          <div
            className="px-4 pt-2 pb-3"
            style={{
              background: `linear-gradient(180deg, ${mainColor}04 0%, ${mainColor}08 100%)`,
            }}
          >
            <div
              className={cn(
                'flex justify-center transition-all duration-300',
                isAnimating &&
                  direction === 'right' &&
                  'translate-x-3 opacity-0',
                isAnimating &&
                  direction === 'left' &&
                  '-translate-x-3 opacity-0',
              )}
            >
              <StepIllustration color={mainColor} />
            </div>

            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    goToStep(i, i > currentStep ? 'right' : 'left')
                  }
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === currentStep
                      ? 'w-4 h-1.5'
                      : 'w-1.5 h-1.5 hover:scale-125',
                  )}
                  style={{
                    backgroundColor:
                      i === currentStep ? mainColor : `${mainColor}30`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="px-4 pt-3 pb-2">
            <div
              className={cn(
                'transition-all duration-300 text-center',
                isAnimating && 'opacity-0 translate-y-1',
              )}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-lg">{step.emoji}</span>
                <h2 className="text-base font-bold text-slate-800">
                  {step.title}
                </h2>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                {step.description}
              </p>
            </div>

            {/* Features - Grid layout */}
            <div
              className={cn(
                'grid grid-cols-3 gap-2 mt-4 transition-all duration-300',
                isAnimating && 'opacity-0',
              )}
            >
              {step.features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="rounded-3xl p-2.5 text-center border"
                    style={{
                      backgroundColor: `${mainColor}05`,
                      borderColor: `${mainColor}10`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-3xl flex items-center justify-center mx-auto mb-1"
                      style={{ backgroundColor: `${mainColor}12` }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <p className="text-[11px] font-bold text-slate-700">
                      {feature.label}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="px-4 pb-4 pt-3">
            {isLastStep ? (
              <Button
                onClick={handleNext}
                className="w-full h-10 rounded-3xl text-sm font-bold gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Rocket className="w-4 h-4" />
                Mulai Sekarang!
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="w-9 h-9 rounded-3xl text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 h-10 rounded-3xl text-sm font-bold gap-1 transition-all hover:opacity-90 active:scale-[0.99]"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  Lanjut
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
