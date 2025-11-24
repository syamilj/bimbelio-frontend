'use client';

import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { BlogTags } from '@/types/database';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import PostUpTag from './modalTag';

export default function BlogTag() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // const {
  //   data: tags,
  //   isLoading: isTagsLoading,
  //   refetch: refetchTags,
  // } = api.blog.getTags.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  const {
    data: tags,
    isLoading: isTagsLoading,
    refetch: refetchTags,
  } = useGet<BlogTags[]>('/blog/getTags');

  // const deleteTagMutation = api.blog.deleteTag.useMutation();

  const { mutate: deleteTag, isLoading: isDeleting } = useMutation(
    '/blog/deleteTag',
    'delete',
    {
      params: { id: selectedCategoryId },
      onSuccess() {
        refetchTags();
        closeAndClear();
      },
    },
  );

  // const handleDelete = async () => {
  //   if (selectedCategoryId) {
  //     try {
  //       await deleteTagMutation.mutateAsync({ id: selectedCategoryId });
  //       refetchTags();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     closeAndClear();
  //   }
  // };

  const closeAndClear = () => {
    setIsOpen(false);
    setSelectedCategoryId(null);
  };

  if (isTagsLoading) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tags</h1>
        <span className="flex gap-3">
          <PostUpTag refetchTags={refetchTags} />
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags?.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{category.title}</TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="flex flex-col items-center rounded-xl bg-white p-6 shadow-lg">
            <p>Are you sure you want to delete this tag?</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <button
                className="w-full rounded bg-neutral-300 px-4 py-2 text-black hover:bg-gray-300"
                onClick={closeAndClear}
              >
                Cancel
              </button>
              <button
                className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                disabled={isDeleting}
                onClick={() => {
                  deleteTag();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
