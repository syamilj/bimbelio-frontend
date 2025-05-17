/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PostUpCategoryModalProps {
  refetchCategories: () => void;
}

function PostUpCategoryModal({ refetchCategories }: PostUpCategoryModalProps) {
  const [kategori, setKategori] = useState('');

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKategori(e.target.value);
  };

  // const { isPending: isKategoriUploading, mutateAsync: addKategori } =
  //   api.category.addCategory.useMutation();

  const [isKategoriUploading, setIsKategoriUploading] =
    useState<boolean>(false);
  const addKategori = async ({ name }: { name: string }) => {
    await mutateGeneral('/category/addCategory', {
      payload: { name },
      type: 'post',
      setLoading: setIsKategoriUploading,
      onSuccess: () => {
        closeModal();
        setKategori('');
        refetchCategories();
      },
    });
  };

  const uploadKategori = async () => {
    if (!kategori) {
      toaster({
        title: 'Gagal',
        description: 'Harap masukkan nama kategori.',
        condition: 'warning',
      });
      return;
    }
    await addKategori({ name: kategori });
  };

  return (
    <>
      <div className="my-6 flex justify-end">
        <Dialog>
          <DialogTrigger>
            <div className={cn(buttonVariants())}>Tambah Kategori</div>
          </DialogTrigger>
          <DialogContent hideClose={true}>
            <DialogHeader>
              <DialogTitle>
                <p className="mb-4 text-center text-xl">Tambahkan Kategori</p>
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
      </div>
    </>
  );
}

export default PostUpCategoryModal;
