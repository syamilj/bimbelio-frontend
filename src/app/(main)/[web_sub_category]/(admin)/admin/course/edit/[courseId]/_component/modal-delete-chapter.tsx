'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import React, { SetStateAction } from 'react';

interface Props {
  onClick: () => void;
  open: boolean;
  isLoading: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteChapter = ({ onClick, open, setOpen, isLoading }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="md:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <DialogTitle>Hapus Chapter?</DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Chapter dan semua sub chapter
            yang terkait akan dihapus permanen.
          </DialogDescription>
        </DialogHeader>

        {!isLoading ? (
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={onClick}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Ya, Hapus Chapter
            </Button>
          </DialogFooter>
        ) : (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteChapter;

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
//             <DialogContent className="w-[360px]">
//                 {children}
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default ModalDeleteTryout;
