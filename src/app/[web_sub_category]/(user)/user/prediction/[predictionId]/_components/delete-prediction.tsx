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
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { useProvider } from '../../_provider/provider';

export default function DeletePrediction({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const {
    useParams: { predictionId },
  } = useProvider();
  const { mutate, isLoading } = useMutation(
    '/prediction/deletePrediction',
    'delete',
    {
      params: { id: predictionId },
      onSuccess() {
        router.push(`/${website_sub_category_id_params}/user/prediction`);
      },
    },
  );

  return (
    <>
      <LoadingPageWithText
        loading={isLoading}
        heading="Deleting Prediction..."
      />
      <VerificationAlert onClick={mutate}>{children}</VerificationAlert>
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
          <AlertDialogTitle>Hapus riwayat prediksi</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin menghapus prediksi ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-red-100 hover:bg-red-500"
            onClick={() => {
              onClick();
              setOpen(false);
            }}
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
