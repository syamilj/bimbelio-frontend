import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
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
} from './alert-dialog';

export const ModalVerification = ({
  onClick,
  children,
  title,
  description,
  submitTitle,
  isLoading,
  type,
}: {
  onClick: () => any;
  children: React.ReactNode;
  title?: string;
  description?: string;
  submitTitle?: string;
  isLoading?: boolean;
  type: 'delete' | 'submit';
}) => {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog
      open={isLoading ? true : open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title
              ? title
              : type === 'delete'
                ? 'Hapus data ini'
                : type === 'submit'
                  ? 'Submit'
                  : null}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description
              ? description
              : type === 'delete'
                ? 'Apakah kamu yakin ingin menghapus data ini?'
                : type === 'submit'
                  ? 'Apakah kamu yakin?'
                  : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              type === 'delete' && 'bg-red-600 text-red-100 hover:bg-red-500',
              type === 'submit' && 'bg-main text-white hover:bg-main/90',
            )}
            onClick={() => {
              onClick();
              setOpen(false);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <>
                {submitTitle
                  ? submitTitle
                  : type === 'delete'
                    ? 'Hapus'
                    : type === 'submit'
                      ? 'Submit'
                      : null}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
