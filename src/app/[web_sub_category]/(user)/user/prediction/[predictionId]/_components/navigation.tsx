import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  School,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { validateSubtest } from '../../_provider/helper';
import { useProvider } from '../../_provider/provider';
import SubmitPrediction from './submit-prediction';

export default function Navigation() {
  const session = useSession();
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    selectedPrograms,
    utbkScores,
    simakScores,
    useScoreUtbk: { utbkAvg },
    useScoreSimak: { simakScoreSNBT, simakAvgSNBT },
    useParams: { predictionId },
    isFinish,
  } = useProvider();

  const nextStep = () => {
    // if (currentStep === 3) {
    //   return;
    // }
    if (currentStep < STEPS.length) {
      router.replace(`${window.location.pathname}?step=${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      router.replace(`${window.location.pathname}?step=${currentStep - 1}`);
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return !!selectedPrograms;
      case 2:
        const isScoreInvalid = !utbkScores.some(
          (utbk) => isNaN(utbk.score) || utbk.score < 100 || utbk.score > 1000,
        );
        return isScoreInvalid;
      case 3:
        const valid = simakScores.every((item) =>
          validateSubtest(item.value, item.total_question),
        );
        return valid;
      default:
        return true;
    }
  };

  if (predictionId !== 'step') return null;

  return (
    <div
      className={cn(
        'flex justify-between items-center mt-12 pt-8 border-t',
        isFinish && 'justify-end',
      )}
    >
      {!isFinish && (
        <>
          <Link
            href={`${window.location.pathname}?step=${currentStep - 1}`}
            className={cn(currentStep === 1 && 'pointer-events-none')}
          >
            <Button
              variant="outline"
              // onClick={prevStep}
              disabled={currentStep === 1}
              className="h-11 px-6"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Sebelumnya
            </Button>
          </Link>

          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">
              Langkah {currentStep} dari {STEPS.length}
            </p>
          </div>
        </>
      )}

      {!isFinish ? (
        <>
          {currentStep !== 3 ? (
            <Link
              href={`${window.location.pathname}?step=${currentStep + 1}`}
              className={cn(!canProceedToNextStep() && 'pointer-events-none')}
            >
              <Button
                // onClick={nextStep}
                disabled={!canProceedToNextStep()}
                className="h-11 px-6 bg-main hover:bg-main/90"
              >
                Selanjutnya <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <SubmitPrediction>
              <Button className="h-11 px-6 bg-main hover:bg-main/90">
                Lihat Hasil <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </SubmitPrediction>
          )}
        </>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(1)}
            className="h-11 px-6"
          >
            Mulai Baru
          </Button>
          <SubmitPrediction>
            <Button
              variant="outline"
              className="h-11 px-6"
            >
              Save
            </Button>
          </SubmitPrediction>
        </div>
      )}
    </div>
  );
}

const STEPS = [
  {
    id: 1,
    title: 'Pilih Jurusan',
    description: 'Pilih maksimal 3 jurusan yang diinginkan',
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
