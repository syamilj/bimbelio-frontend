'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

const ModalDeleteSubChapter = ({
  deleteSubChapter,
}: {
  deleteSubChapter: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger>
        <div
          className="shrink-0 cursor-pointer rounded-[.8rem] bg-red-100 px-[1rem] py-[.8rem] font-medium text-red-700 duration-300 md:hover:bg-red-200 md:active:bg-red-100"
          onClick={() => setOpen(true)}
        >
          Hapus sub chapter
        </div>
      </DialogTrigger>
      <DialogContent className="w-[360px]">
        <div className="flex flex-col items-center justify-center text-center">
          <p>
            Apakah Kamu yakin akan <br />{' '}
            <span className="text-red-700">menghapus sub chapter</span> ini?
          </p>
          <div className="grid w-full grid-cols-2 gap-[.5rem] pt-[2rem] text-[.9rem]">
            <div
              className="w-full shrink-0 cursor-pointer rounded-[.8rem] bg-red-100 py-[.8rem] font-medium text-red-700 duration-300 md:hover:bg-red-200 md:active:bg-red-100"
              onClick={() => {
                deleteSubChapter();
                setOpen(false);
              }}
            >
              Hapus sub chapter
            </div>
            <div
              className="w-full shrink-0 cursor-pointer rounded-[.8rem] py-[.8rem] font-medium text-main-gray-text duration-300 md:hover:text-black"
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

export default ModalDeleteSubChapter;
