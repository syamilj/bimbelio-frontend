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

interface ModalEditSubKategoriProps {
  id: string;
  categoryId: string;
  name: string;
  open: boolean;
  setOpen: any;
  refetchSubCategories: () => void;
}

function ModalEditSubKategori({
  refetchSubCategories,
  id,
  name,
  open,
  setOpen,
  categoryId,
}: ModalEditSubKategoriProps) {
  const [kategori, setKategori] = useState('');

  // const [open, setOpen] = useState(openValue);
  const closeModal = (value: boolean) => {
    setOpen({ id: '', name: '', open: value });
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKategori(e.target.value);
  };

  // const { isPending: isKategoriUploading, mutateAsync: editSubKategori } =
  //   api.subcategory.editSubcategory.useMutation();

  const [isKategoriUploading, setIsKategoriUploading] =
    useState<boolean>(false);
  const editSubKategori = async ({
    id,
    name,
    categoryId,
  }: {
    id: string;
    name: string;
    categoryId: string;
  }) => {
    await mutateGeneral('/category/editSubcategory', {
      payload: { id, name, categoryId },
      type: 'put',
      setLoading: setIsKategoriUploading,
      onSuccess: () => {
        closeModal(false);
        setKategori('');
        refetchSubCategories();
      },
    });
  };

  const uploadKategori = async () => {
    if (!kategori) {
      toaster({
        title: 'Error',
        description: 'Harap masukkan nama SubKategori.',
        condition: 'warning',
      });
      return;
    }
    await editSubKategori({ id, name: kategori, categoryId });
  };

  useLayoutEffect(() => {
    setKategori(name);
  }, [name]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
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

export default ModalEditSubKategori;
