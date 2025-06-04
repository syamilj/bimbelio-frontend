import { Button } from '@/components/ui/button';
import {
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  School,
  Target,
} from 'lucide-react';
import { validateSubtest } from '../../_provider/helper';
import { useProvider } from '../../_provider/provider';

export default function Navigation() {
  const {
    currentStep,
    setCurrentStep,
    selectedPrograms,
    utbkScores,
    simakScores,
  } = useProvider();
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
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
        console.log({ isScoreInvalid });
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
  return (
    <div className="flex justify-between items-center mt-12 pt-8 border-t">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 1}
        className="h-11 px-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Sebelumnya
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-500 font-medium">
          Langkah {currentStep} dari {STEPS.length}
        </p>
      </div>

      {currentStep < STEPS.length ? (
        <Button
          onClick={nextStep}
          disabled={!canProceedToNextStep()}
          className="h-11 px-6 bg-main hover:bg-main/90"
        >
          Selanjutnya <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="h-11 px-6"
        >
          Mulai Baru
        </Button>
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
