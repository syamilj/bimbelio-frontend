'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { InputImage } from '@/components/ui/input-image';
import { Label } from '@/components/ui/label';
import { MultiSelectVisibleAt } from '@/components/ui/multi-select-visibleAt';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { storage } from '@/supabaseClient';
import { useLayoutEffect, useState } from 'react';

interface ModalEditSubKategoriProps {
  id: string;
  categoryId: string;
  name: string;
  image: string | null;
  open: boolean;
  setOpen: any;
  refetchSubCategories: () => void;
  visibleAtWebSubIdsData: string[];
}

function ModalEditSubKategori({
  refetchSubCategories,
  id,
  name,
  image,
  open,
  setOpen,
  categoryId,
  visibleAtWebSubIdsData,
}: ModalEditSubKategoriProps) {
  const [visibleAtWebSubIds, setVisibleAtWebSubIds] = useState<string[]>([]);
  const [kategori, setKategori] = useState('');
  const [fileImage, setFileImage] = useState<File | null>(null);

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
    image,
  }: {
    id: string;
    name: string;
    categoryId: string;
    image: string | null;
  }) => {
    await mutateGeneral('/category/editSubcategory', {
      payload: { id, name, categoryId, visibleAtWebSubIds, image },
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
    setIsKategoriUploading(true);

    const oldFilename = `${name}`;
    const newFilename = `${kategori}`;
    const imageNow = image;
    const linkUrl =
      fileImage || imageNow
        ? `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/subcategory/${newFilename}`
        : null;

    if (imageNow && fileImage && newFilename === oldFilename) {
      const update = await storage
        .from('img')
        .update(`subcategory/${oldFilename}`, fileImage);
      if (update?.error) {
        toaster({
          title: 'Error',
          description:
            update?.error?.message ||
            'Terjadi kesalahan saat mengupload gambar.',
          condition: 'warning',
        });
        setIsKategoriUploading(false);
        return;
      }
    } else if (imageNow && fileImage && newFilename !== oldFilename) {
      await storage.from('img').remove([`subcategory/${oldFilename}`]);
      const upload = await storage
        .from('img')
        .upload(`subcategory/${newFilename}`, fileImage);
      if (upload?.error) {
        toaster({
          title: 'Error',
          description:
            upload?.error?.message ||
            'Terjadi kesalahan saat mengupload gambar.',
          condition: 'warning',
        });
        setIsKategoriUploading(false);
        return;
      }
    } else if (imageNow && !fileImage && newFilename !== oldFilename) {
      const move = await storage
        .from('img')
        .move(`subcategory/${oldFilename}`, `subcategory/${newFilename}`);
      if (move?.error) {
        toaster({
          title: 'Error',
          description:
            move?.error?.message ||
            'Terjadi kesalahan saat mengubah nama file gambar.',
          condition: 'warning',
        });
        setIsKategoriUploading(false);
        return;
      }
    } else if (!imageNow && fileImage) {
      const upload = await storage
        .from('img')
        .upload(`subcategory/${newFilename}`, fileImage);
      if (upload?.error) {
        toaster({
          title: 'Error',
          description:
            upload?.error?.message ||
            'Terjadi kesalahan saat mengupload gambar.',
          condition: 'warning',
        });
        setIsKategoriUploading(false);
        return;
      }
    }

    await editSubKategori({ id, name: kategori, categoryId, image: linkUrl });
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
            <div className="mt-4 flex flex-col gap-2">
              <Label>
                Upload Thumbnail{' '}
                <span className="text-gray-400 text-sm">(Optional)</span>
              </Label>

              <InputImage
                preview={image ? image : undefined}
                onChange={async (image) => {
                  if (image) {
                    setFileImage(image);
                  }
                }}
              />
            </div>
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
