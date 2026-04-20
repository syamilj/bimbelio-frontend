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
import { MultiSelectVisibleAt } from '@/components/ui/multi-select-visibleAt';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface PostUpSubCategoryModalProps {
  refetchSubCategories: () => void;
}

function PostUpSubCategoryModal({
  refetchSubCategories,
}: PostUpSubCategoryModalProps) {
  const [visibleAtWebSubIds, setVisibleAtWebSubIds] = useState<string[]>([]);
  const [kategori, setKategori] = useState<string>('');
  const [subKategori, setSubKategori] = useState<string>('');
  const [open, setOpen] = useState(false);

  const closeModal = () => setOpen(false);

  // const {
  //   data: categories,
  //   isLoading: categoriesLoading,
  //   error: categoriesError,
  // } = api.category.getAllCategoriesAdmin.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  const [categories, setCategories] = useState<
    {
      name: string;
      id: string;
      total: number;
    }[]
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<boolean>(false);

  const fetchCategories = async () => {
    await getGeneral('/category/getAllCategoriesAdmin', {
      setData: setCategories,
      setLoading: setCategoriesLoading,
      onError() {
        setCategoriesError(true);
      },
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // const { isPending: isSubKategoriUploading, mutateAsync: addSubkategori } =
  //   api.subcategory.addSubcategory.useMutation();

  const [isSubKategoriUploading, setIsSubKategoriUploading] =
    useState<boolean>(false);
  const addSubkategori = async ({
    categoryId,
    name,
  }: {
    categoryId: string;
    name: string;
  }) => {
    await mutateGeneral('/category/addSubcategory', {
      payload: { categoryId, name, visibleAtWebSubIds },
      type: 'post',
      setLoading: setIsSubKategoriUploading,
      onSuccess: () => {
        closeModal();
        setKategori('');
        setSubKategori('');
        refetchSubCategories();
      },
    });
  };

  const uploadSubkategori = async () => {
    if (!subKategori || !kategori) {
      toaster({
        title: 'Gagal',
        description: 'Silakan masukkan kategori dan subkategori.',
        condition: 'warning',
      });
      return;
    }
    await addSubkategori({ name: subKategori, categoryId: kategori });
  };

  if (categoriesLoading) return <Spinner />;
  if (categoriesError) return <div>Error loading categories.</div>;

  return (
    <div className="my-6 flex justify-end">
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger>
          <div className={cn(buttonVariants())}>Tambah SubKategori</div>
        </DialogTrigger>
        <DialogContent hideClose={true}>
          <DialogHeader>
            <DialogTitle>
              <p className="mb-4 text-center text-xl">Tambahkan Subkategori</p>
            </DialogTitle>
            <div className="flex flex-col gap-4">
              <label> Kategori</label>
              <Select
                value={kategori}
                onValueChange={setKategori}
              >
                <SelectTrigger className="w-full px-3">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      onSelect={() => {
                        setKategori(category.id);
                      }}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label> Subkategori</label>
              <Input
                value={subKategori}
                onChange={(e) => setSubKategori(e.target.value)}
                placeholder="Subkategori"
              />
              <MultiSelectVisibleAt
                value={visibleAtWebSubIds}
                onValuesChange={setVisibleAtWebSubIds}
              />
            </div>

            <div>
              <Button
                className="mt-4 w-full"
                onClick={uploadSubkategori}
                disabled={!subKategori || isSubKategoriUploading}
              >
                {isSubKategoriUploading ? <Spinner /> : 'Submit'}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default PostUpSubCategoryModal;
