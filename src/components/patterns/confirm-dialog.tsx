'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

export type ConfirmOptions = {
  title: string;
  description?: React.ReactNode;
  /** Label tombol konfirmasi; sebutkan aksinya, mis. "Hapus voucher". */
  confirmLabel: string;
  cancelLabel?: string;
  /** Aksi destruktif memakai tombol merah. */
  destructive?: boolean;
  /**
   * Bila diisi, dialog tetap terbuka dan menampilkan loading sampai promise
   * selesai. Bila gagal, dialog tetap terbuka agar pengguna bisa mencoba lagi.
   */
  onConfirm?: () => Promise<unknown> | unknown;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/** `const confirm = useConfirm(); if (await confirm({...})) {...}` */
export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx)
    throw new Error('useConfirm harus berada di dalam <ConfirmProvider>');
  return ctx;
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [pending, setPending] = useState(false);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((next) => {
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setOptions(null);
    setPending(false);
  };

  const handleConfirm = async () => {
    if (!options?.onConfirm) return close(true);
    setPending(true);
    try {
      await options.onConfirm();
      close(true);
    } catch {
      setPending(false);
    }
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog
        open={!!options}
        onOpenChange={(open) => !open && !pending && close(false)}
      >
        {options && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{options.title}</AlertDialogTitle>
              {options.description && (
                <AlertDialogDescription>
                  {options.description}
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pending}>
                {options.cancelLabel ?? 'Batal'}
              </AlertDialogCancel>
              <Button
                variant={options.destructive ? 'destructive' : 'default'}
                loading={pending}
                onClick={handleConfirm}
              >
                {options.confirmLabel}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}
