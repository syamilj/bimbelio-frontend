'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useState } from 'react';

const ModalDeleteSubChapter = ({
  deleteSubChapter,
}: {
  deleteSubChapter: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSubChapter();
      setOpen(false);
    } catch (error) {
      console.error('Error deleting sub chapter:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="h-4 w-4" />
          Hapus Sub Chapter
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Hapus Sub Chapter?
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Tindakan ini tidak dapat dibatalkan. Sub chapter dan semua konten
            yang terkait akan dihapus permanen.
          </DialogDescription>
        </DialogHeader>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Yang akan dihapus:
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Semua konten dalam sub chapter</li>
              <li>• File video/dokumen yang terupload</li>
              <li>• Soal dan jawaban (jika ada)</li>
              <li>• Progress belajar siswa</li>
            </ul>
          </CardContent>
        </Card>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteSubChapter;
