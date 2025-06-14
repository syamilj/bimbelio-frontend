'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Award,
  BookOpen,
  Calculator,
  Check,
  School,
  Target,
} from 'lucide-react';
import { useProvider } from '../_provider/provider';
import Navigation from './_components/navigation';
import PredictionStep1 from './_main-components/prediction-step-1';
import PredictionStep2 from './_main-components/prediction-step-2';
import PredictionStep3 from './_main-components/prediction-step-3';
import PredictionStep4 from './_main-components/prediction-step-4';

export default function UTBKSIMAKPredictor() {
  const {
    currentStep,
    setCurrentStep,
    useParams: { predictionId },
    isFinish,
  } = useProvider();

  console.log({ predictionId });

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-main rounded-2xl mb-6">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistem Prediksi Kelulusan
            </h1>
            <h2 className="text-lg text-main font-semibold mb-4">
              UTBK + SIMAK UI
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hitung kemungkinan kelulusan seleksi masuk UI dengan menggabungkan
              nilai UTBK (50%) dan SIMAK UI (50%)
            </p>
          </div>

          {!isFinish && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  {STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                      <div
                        key={step.id}
                        className="flex flex-col items-center relative flex-1"
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all duration-200 mb-3',
                            isActive
                              ? 'bg-main text-white'
                              : isCompleted
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-500',
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <StepIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="text-center">
                          <p
                            className={cn(
                              'text-sm font-medium mb-1',
                              isActive ? 'text-main' : 'text-gray-600',
                            )}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-500 max-w-20">
                            {step.description}
                          </p>
                        </div>
                        {index < STEPS.length - 1 && (
                          <div className="absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 bg-gray-200">
                            <div
                              className="h-full bg-green-600 transition-all duration-500"
                              style={{ width: isCompleted ? '100%' : '0%' }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Progress
                  value={(currentStep / STEPS.length) * 100}
                  className="h-2"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-8">
              {!isFinish && (
                <>
                  {currentStep === 1 && <PredictionStep1 />}

                  {currentStep === 2 && <PredictionStep2 />}

                  {currentStep === 3 && <PredictionStep3 />}

                  {currentStep === 4 && <PredictionStep4 />}
                </>
              )}
              {isFinish && (
                <>
                  <PredictionStep4 />
                  {/* <Tabs
                    defaultValue="hasil"
                    className="space-y-4"
                  >
                    <TabsList>
                      <TabsTrigger
                        className="text-sm rounded-3xl px-4 py-2"
                        value="hasil"
                      >
                        Hasil
                      </TabsTrigger>
                      <TabsTrigger
                        className="text-sm rounded-3xl px-4 py-2"
                        value="simak_ui"
                      >
                        Nilai Simak UI
                      </TabsTrigger>
                      <TabsTrigger
                        className="text-sm rounded-3xl px-4 py-2"
                        value="utbk"
                      >
                        Nilai UTBK
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="hasil">
                      <PredictionStep4 />
                    </TabsContent>
                    <TabsContent value="simak_ui">
                      <PredictionStep3 />
                    </TabsContent>
                    <TabsContent value="utbk">
                      <PredictionStep2 />
                    </TabsContent>
                  </Tabs> */}
                </>
              )}

              <Navigation />
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

const STEPS = [
  {
    id: 1,
    title: 'Pilih Jurusan',
    description: 'Pilih jurusan yang diinginkan',
    icon: School,
  },
  {
    id: 2,
    title: 'Input UTBK',
    description: 'Masukkan nilai 7 subtes UTBK',
    icon: BookOpen,
  },
  {
    id: 3,
    title: 'Input SIMAK',
    description: 'Masukkan hasil Try Out SIMAK UI',
    icon: Target,
  },
  {
    id: 4,
    title: 'Hasil Prediksi',
    description: 'Lihat prediksi kelulusan per jurusan',
    icon: Award,
  },
];
