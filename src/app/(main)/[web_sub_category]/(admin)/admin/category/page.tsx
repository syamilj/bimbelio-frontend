'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteGeneral, getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { Category, Subcategory } from '@/types/database';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PostUpCategoryModal from './_components/modal-category';
import ModalEditKategori from './_components/modal-edit-category';
import ModalEditSubKategori from './_components/modal-edit-sub-category';
import PostUpSubCategoryModal from './_components/modal-sub-category';

export default function Kategori() {
  const {
    type: { isCore },
    sharingWebSubIds,
  } = useWebsiteSubCategory();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [editKategoriData, setEditKategoriData] = useState<{
    id: string;
    name: string;
    open: boolean;
    image: string | null;
    visibleAtWebSubIds: string[];
  }>({ id: '', name: '', open: false, image: null, visibleAtWebSubIds: [] });

  const [editSubKategoriData, setEditSubKategoriData] = useState<{
    id: string;
    name: string;
    open: boolean;
    categoryId: string;
    image: string | null;
    visibleAtWebSubIds: string[];
  }>({
    id: '',
    name: '',
    open: false,
    categoryId: '',
    image: null,
    visibleAtWebSubIds: [],
  });

  // const {
  //   data: categories,
  //   isLoading: isCategoriesLoading,
  //   refetch: refetchCategories,
  // } = api.category.getAllCategoriesAdmin.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  // const { data: subcategories, refetch: refetchSubCategories } =
  //   api.subcategory.getAllSubcategories.useQuery(undefined, {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   });

  // const deleteCategoryMutation = api.category.deleteCategory.useMutation();
  // const deleteSubCategoryMutation =
  //   api.subcategory.deleteSubcategory.useMutation();

  const [categories, setCategories] = useState<
    {
      name: string;
      image: string | null;
      id: string;
      total: number;
      visibleAtWebSubIds: string[];
    }[]
  >([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    await getGeneral('/category/getAllCategoriesAdmin', {
      setData: setCategories,
      setLoading: setIsCategoriesLoading,
    });
  };

  const [subcategories, setSubcategories] = useState<
    (Subcategory & { category: Category; image: string | null })[]
  >([]);

  const fetchSubCategories = async () => {
    await getGeneral('/category/getAllSubcategories?isAdmin=true', {
      setData: setSubcategories,
    });
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    if (selectedCategoryId) {
      try {
        // await deleteCategoryMutation.mutateAsync({ id: selectedCategoryId });
        // refetchSubCategories();
        // refetchCategories();
        await deleteGeneral(
          `/category/deleteCategory?id=${selectedCategoryId}`,
          {
            setLoading: setIsDeleting,
            onSuccess() {
              fetchCategories();
              fetchSubCategories();
            },
          },
        );
      } catch (error) {
        console.error(error);
      }
      closeAndClear();
    }
  };

  const handleDeleteSub = async () => {
    if (selectedSubCategoryId) {
      try {
        // await deleteSubCategoryMutation.mutateAsync({
        //   id: selectedSubCategoryId,
        // });
        // refetchSubCategories();
        await deleteGeneral(
          `/category/deleteSubcategory?id=${selectedSubCategoryId}`,
          {
            setLoading: setIsDeleting,
            onSuccess() {
              fetchSubCategories();
            },
          },
        );
      } catch (error) {
        console.error(error);
      }
      closeAndClear();
    }
  };

  const closeAndClear = () => {
    setIsOpen(false);
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
  };

  if (isCategoriesLoading) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kategori</h1>
        <span className="flex gap-3">
          <PostUpCategoryModal
            refetchCategories={async () => {
              fetchCategories();
              fetchSubCategories();
            }}
          />
          <PostUpSubCategoryModal refetchSubCategories={fetchSubCategories} />
          <ModalEditKategori
            refetchCategories={async () => {
              fetchCategories();
              fetchSubCategories();
            }}
            image={editKategoriData.image}
            id={editKategoriData.id}
            name={editKategoriData.name}
            visibleAtWebSubIdsData={editKategoriData.visibleAtWebSubIds}
            open={editKategoriData.open}
            setOpen={setEditKategoriData}
          />
          <ModalEditSubKategori
            refetchSubCategories={fetchSubCategories}
            image={editSubKategoriData.image}
            id={editSubKategoriData.id}
            name={editSubKategoriData.name}
            open={editSubKategoriData.open}
            categoryId={editSubKategoriData.categoryId}
            setOpen={setEditSubKategoriData}
            visibleAtWebSubIdsData={editSubKategoriData.visibleAtWebSubIds}
          />
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Kategori</TableHead>
            {isCore && (
              <TableHead className="text-center">Visible At</TableHead>
            )}
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories?.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{category.name}</TableCell>
              {isCore && (
                <TableCell className="text-center">
                  {category.visibleAtWebSubIds.length > 0
                    ? category.visibleAtWebSubIds.join(', ')
                    : sharingWebSubIds.join(',')}
                </TableCell>
              )}
              <TableCell className="text-right">
                <button
                  className="p-1 duration-300 ease-in-out active:scale-110"
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setIsOpen(true);
                  }}
                >
                  <Trash2
                    size={20}
                    color="red"
                  />
                </button>

                <button
                  className="p-1 duration-300 ease-in-out active:scale-110"
                  onClick={() => {
                    setEditKategoriData({
                      id: category.id,
                      name: category.name,
                      visibleAtWebSubIds: category.visibleAtWebSubIds,
                      image: category.image,
                      open: true,
                    });
                  }}
                >
                  <Edit
                    size={20}
                    color="blue"
                  />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h1 className="mt-12 text-3xl font-bold">Subkategori</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Subkategori</TableHead>
            {isCore && (
              <TableHead className="text-center">Visible At</TableHead>
            )}
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategories?.map((cat, index) => (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{cat.category.name}</TableCell>
              <TableCell>{cat.name}</TableCell>
              {isCore && (
                <TableCell className="text-center">
                  {cat.visibleAtWebSubIds.length > 0
                    ? cat.visibleAtWebSubIds.join(', ')
                    : sharingWebSubIds.join(',')}
                </TableCell>
              )}
              <TableCell className="text-right">
                <button
                  className="p-1 duration-300 ease-in-out active:scale-110"
                  onClick={() => {
                    setSelectedSubCategoryId(cat.id);
                    setIsOpen(true);
                  }}
                >
                  <Trash2
                    size={20}
                    color="red"
                  />
                </button>
                <button
                  className="p-1 duration-300 ease-in-out active:scale-110"
                  onClick={() => {
                    console.log({ cat });
                    setEditSubKategoriData({
                      id: cat.id,
                      name: cat.name,
                      image: cat.image,
                      open: true,
                      categoryId: cat.categoryId,
                      visibleAtWebSubIds: cat.visibleAtWebSubIds,
                    });
                  }}
                >
                  <Edit
                    size={20}
                    color="blue"
                  />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-75">
          <div className="flex flex-col items-center rounded-3xl bg-white p-6 shadow-lg">
            <p>Are you sure you want to delete this category?</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <button
                className="w-full rounded bg-neutral-300 px-4 py-2 text-black hover:bg-gray-300"
                onClick={closeAndClear}
              >
                Batal
              </button>
              <button
                className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700 flex justify-center items-center"
                disabled={isDeleting}
                onClick={() => {
                  if (selectedCategoryId) {
                    handleDelete();
                  } else {
                    handleDeleteSub();
                  }
                }}
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
