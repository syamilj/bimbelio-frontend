'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import React, { SetStateAction } from 'react';

interface Props {
  onClick: () => void;
  open: boolean;
  isLoading: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteTryout = ({ onClick, open, setOpen, isLoading }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold mb-2">
            Hapus Tryout
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center text-center">
          <p>
            Apakah Kamu yakin akan <br />{' '}
            <span className="text-red-700">menghapus try out</span> ini?
          </p>
          <div className="h-[80px] w-full">
            {!isLoading ? (
              <div className="grid w-full grid-cols-2 gap-[.5rem] pt-8 text-[.9rem]">
                <div
                  className="w-full shrink-0 cursor-pointer rounded-[.8rem] bg-red-100 py-[.8rem] font-medium text-red-700 duration-300 md:hover:bg-red-200 md:active:bg-red-100"
                  onClick={() => {
                    onClick();
                    setOpen(false);
                  }}
                >
                  Hapus Tryout
                </div>
                <div
                  className="w-full shrink-0 cursor-pointer rounded-[.8rem] py-[.8rem] font-medium text-main-gray-text duration-300 md:hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  Batalkan
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center pt-8">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteTryout;

// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog-2"
// import { Spinner } from "@/components/ui/spinner";
// import React, { SetStateAction, useState } from "react"

// interface Props {
//     open: boolean,
//     setOpen: React.Dispatch<SetStateAction<boolean>>,
//     children: any
// }

// const ModalDeleteTryout = ({ open, setOpen, children }: Props) => {

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogContent className="w-[360px]">
//                 {children}
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default ModalDeleteTryout;
