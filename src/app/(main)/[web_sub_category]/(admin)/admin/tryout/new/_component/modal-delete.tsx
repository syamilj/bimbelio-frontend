'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

const ModalDeleteSession = ({ deleteSession }: any) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="w-full">
        <div
          className="w-full cursor-pointer rounded-3xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 text-center duration-300 hover:bg-red-100 active:bg-red-200 transition-colors"
          onClick={() => setOpen(true)}
        >
          Hapus Sesi
        </div>
      </DialogTrigger>
      <DialogContent className="w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold mb-2">
            Konfirmasi Hapus
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center text-center">
          <p>
            Apakah Kamu yakin akan <br />{' '}
            <span className="text-red-700">menghapus try out</span> ini?
          </p>
          <div className="grid w-full grid-cols-2 gap-[.5rem] pt-8 text-[.9rem]">
            <div
              className="w-full shrink-0 cursor-pointer rounded-3xl bg-red-100 py-[.8rem] font-medium text-red-700 duration-300 md:hover:bg-red-200 md:active:bg-red-100"
              onClick={() => {
                deleteSession();
                setOpen(false);
              }}
            >
              Hapus sesi
            </div>
            <div
              className="w-full shrink-0 cursor-pointer rounded-3xl py-[.8rem] font-medium text-main-gray-text duration-300 md:hover:text-black"
              onClick={() => setOpen(false)}
            >
              Batalkan
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteSession;
