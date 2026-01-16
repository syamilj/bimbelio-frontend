'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteGeneral } from '@/lib/fetch-helper/fetch-helper';
import { storage } from '@/storageClient';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAdminWebCategory } from '../provider';

interface Props {
  children: React.ReactNode;
  id: string;
  name?: string;
  title: string;
  description: string;
  type: 'category' | 'sub-category';
}

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Ganti karakter spesial dengan dash
    .replace(/^-|-$/g, ''); // Hapus dash di awal/akhir
};

export function DialogDelete({
  id,
  description,
  name,
  title,
  type,
  children,
}: Props) {
  const { getData } = useAdminWebCategory();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = async () => {
    if (name) {
      await storage
        .from('img')
        .remove([`website-sub-category/${sanitizeFileName(name)}`]);
    }
    await deleteGeneral(
      `/website-category/${
        type === 'category' ? 'deleteCategory' : 'deleteSubCategory'
      }?id=${id}`,
      {
        setLoading: setIsLoading,
        onSuccess: async () => {
          setOpen(false);
          await getData();
        },
      },
    );
  };

  return (
    <Dialog
      open={isLoading ? true : open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={handleConfirm}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
