'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useLayoutEffect, useState } from 'react';

interface ModalEditKategoriProps {
  id: string;
  name: string;
  open: boolean;
  setOpen: any;
  refetchCategories: () => void;
}

function ModalEditKategori({
  refetchCategories,
  id,
  name,
  open,
  setOpen,
}: ModalEditKategoriProps) {
  const [kategori, setKategori] = useState('');

  // const [open, setOpen] = useState(openValue);
  const closeModal = (value: boolean) => {
    setOpen({ id: '', name: '', open: value });
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKategori(e.target.value);
  };

  // const { isPending: isKategoriUploading, mutateAsync: editKategori } =
  //   api.category.editCategory.useMutation();

  const [isKategoriUploading, setIsKategoriUploading] =
    useState<boolean>(false);
  const editKategori = async ({ id, name }: { id: string; name: string }) => {
    await mutateGeneral('/category/editCategory', {
      payload: { id, name },
      type: 'put',
      setLoading: setIsKategoriUploading,
      onSuccess: () => {
        closeModal(false);
        setKategori('');
        refetchCategories();
      },
    });
  };

  const uploadKategori = async () => {
    if (!kategori) {
      toaster({
        title: 'Error',
        description: 'Harap masukkan nama kategori.',
        condition: 'warning',
      });
      return;
    }
    await editKategori({ id, name: kategori });
  };

  useLayoutEffect(() => {
    setKategori(name);
  }, [name]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => closeModal(open)}
    >
      <DialogContent hideClose={true}>
        <DialogHeader>
          <DialogTitle>
            <p className="mb-4 text-center text-xl">Edit Kategori</p>
          </DialogTitle>
          <div>
            <Input
              value={kategori}
              onChange={onTextChange}
              placeholder={kategori ? '' : 'Tryout'}
              className="w-full"
            />
          </div>

          <div>
            <Button
              disabled={!kategori || isKategoriUploading}
              className="mt-4 w-full"
              onClick={uploadKategori}
            >
              {isKategoriUploading ? <Spinner /> : 'Kirim'}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ModalEditKategori;
