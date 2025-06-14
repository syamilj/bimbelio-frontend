import { useSession } from '@/components/provider/provider-session-auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import LoadingPageWithText from '@/components/ui/spinner';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { useProvider } from '../../_provider/provider';

export default function SubmitPrediction({
  children,
}: {
  children: ReactNode;
}) {
  const session = useSession();
  const router = useRouter();
  const {
    selectedPrograms,
    utbkScores,
    simakScores,
    useScoreUtbk: { utbkAvg },
    useScoreSimak: { simakAvgSNBT },
    useSelectTryouts: { tryoutId },
  } = useProvider();
  const { mutate, isLoading, success } = useMutation<{
    userId: string;
    tryoutId: string | null;
    university: string;
    study: string;
    fakultas: string;
    id: string;
    websiteSubCategoryId: string;
  }>('/prediction/createPrediction', 'post', {
    onSuccess({ data }) {
      if (data?.id) {
        router.push(`${data.id}`);
      }
    },
  });

  const savePrediction = async () => {
    const data = {
      userId: session.data?.user.id,
      tryoutId: tryoutId,
      university: 'Universitas Indonesia',
      study: selectedPrograms?.study,
      fakultas: selectedPrograms?.fakultas,
      PredictionScore: [
        {
          finalScore: utbkAvg,
          type: 'UTBK',
          PredictionScoreDetail: utbkScores.map((usItem) => ({
            category: 'UTBK',
            subCategory: usItem.label,
            score: usItem.score,
          })),
        },
        {
          finalScore: simakAvgSNBT,
          type: 'SIMAK_UI',
          PredictionScoreDetail: simakScores.map((ssItem) => {
            const benar = ssItem.value.benar;
            const salah = ssItem.value.salah;
            const score = benar * 4 + salah * -1;
            return {
              category: ssItem.type.name,
              subCategory: ssItem.name,
              true: ssItem.value.benar,
              false: ssItem.value.salah,
              empty: ssItem.value.kosong,
              score,
              totalQuestions: ssItem.total_question,
            };
          }),
        },
      ],
    };
    mutate({ payload: { ...data } });
  };
  return (
    <>
      <LoadingPageWithText
        loading={isLoading}
        heading="Saving Prediction..."
      />
      <VerificationAlert onClick={savePrediction}>{children}</VerificationAlert>
    </>
  );
}

const VerificationAlert = ({
  onClick,
  children,
}: {
  onClick: () => any;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Simpan hasil prediksi</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin menyimpan prediksi ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onClick();
              setOpen(false);
            }}
          >
            Simpan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
