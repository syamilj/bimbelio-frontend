'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import React, { SetStateAction } from 'react';

interface ExitTryoutProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  done: boolean;
}

const ExitTryout: React.FC<ExitTryoutProps> = ({ open, setOpen, done }) => {
  const router = useRouter();

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex flex-col gap-2">
            {!done ? (
              <>
                <p className="text-xl">Keluar Tryout</p>
                <p className="text-main-gray-text">
                  Apa kamu yakin ingin keluar try out?
                </p>
                <p className="text-main-gray-text">
                  <span className="text-red-700">
                    Waktu akan tetap berjalan.
                  </span>{' '}
                  Namun tak perlu khawatir, progressmu akan tetap tersimpan.
                </p>
              </>
            ) : (
              <>
                <p className="text-xl">Keluar</p>
                <p className="text-main-gray-text">
                  Apa kamu yakin ingin keluar?
                </p>
              </>
            )}
          </div>
          <div className="h-20 w-full">
            <div className="grid w-full grid-cols-2 gap-2 pt-8 text-sm">
              <button
                className="w-full shrink-0 cursor-pointer rounded-xl py-3 font-medium text-main-gray-text transition-colors duration-300 hover:text-black"
                onClick={() => {
                  router.push('/user/try-out');
                }}
              >
                {!done ? 'Keluar tryout' : 'Keluar'}
              </button>
              <button
                className="w-full shrink-0 cursor-pointer rounded-xl bg-main py-3 font-medium text-white transition-colors duration-300 hover:bg-main-hover active:bg-main"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitTryout;
