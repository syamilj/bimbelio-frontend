'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MultiSelectVisibleAt } from '@/components/ui/multi-select-visibleAt';
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
  visibleAtWebSubIdsData: string[];
}

function ModalEditSubKategori({
  refetchSubCategories,
  id,
  name,
  open,
  setOpen,
  categoryId,
  visibleAtWebSubIdsData,
}: ModalEditSubKategoriProps) {
  const [visibleAtWebSubIds, setVisibleAtWebSubIds] = useState<string[]>([]);
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
      payload: { id, name, categoryId, visibleAtWebSubIds },
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
    setVisibleAtWebSubIds(visibleAtWebSubIdsData || []);
  }, [name, visibleAtWebSubIdsData]);

  console.log({ visibleAtWebSubIds });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent hideClose={true}>
        <DialogHeader>
          <DialogTitle>
            <p className="mb-4 text-center text-xl">Edit Sub Kategori</p>
          </DialogTitle>
          <div>
            <Input
              value={kategori}
              onChange={onTextChange}
              placeholder={kategori ? '' : 'Tryout'}
              className="w-full"
            />
            <MultiSelectVisibleAt
              value={visibleAtWebSubIds}
              onValuesChange={setVisibleAtWebSubIds}
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
