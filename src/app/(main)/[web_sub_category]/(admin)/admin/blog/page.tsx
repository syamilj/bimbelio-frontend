'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';

import { cn, getDateString } from '@/lib/utils';
import { BlogPost } from '@/types/database';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Fragment, SetStateAction, useState } from 'react';

const BlogAdmin = () => {
  const {
    data: blogs,
    isLoading,
    refetch,
  } = useGet<BlogPost[]>('/blog/getBlogsAdmin');

  const [open, setOpen] = useState<boolean>(false);
  const [blogId, setBlogId] = useState<string>('');

  const { mutate: deleteBlog, isLoading: isDeleting } = useMutation(
    '/blog/deleteBlog',
    'delete',
    {
      params: { id: blogId },
      onSuccess() {
        setBlogId('');
        refetch();
      },
      onError() {
        setBlogId('');
      },
    },
  );

  const handleDeleteBlog = () => {
    if (blogId !== '') {
      deleteBlog();
    }
  };

  return (
    <Fragment>
      <ModalDeleteBlog
        isLoading={isDeleting}
        onClick={handleDeleteBlog}
        open={open}
        setOpen={setOpen}
      />
      <div className="mt-4 flex flex-col gap-8">
        <div className="flex flex-col gap-8">
          <div
            id="head"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="w-[300px] rounded-[.8rem] border border-transparent px-4 py-[.5rem] text-[.9rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
                placeholder="Cari blog.."
              />
              <div className="flex h-full items-center justify-center rounded-[.8rem] bg-white px-8 py-[.5rem] text-[.9rem] text-main-gray-text outline-none duration-300 md:hover:shadow-default">
                Filter
              </div>

              <Link
                href={`/${website_sub_category_id}/admin/blog/tag`}
                className="flex cursor-pointer items-center justify-center rounded-[.8rem] bg-main px-4 py-[.6rem] text-white duration-300 md:hover:bg-main-hover"
              >
                Tambah tag
              </Link>
            </div>
            <div className="flex items-center gap-4 text-[.9rem]">
              <div className="flex h-full cursor-pointer items-center justify-center px-4 font-medium text-main-gray-text duration-300 md:hover:text-black">
                Export CSV
              </div>
              <Link
                href={`/${website_sub_category_id}/admin/blog/add`}
                className="flex cursor-pointer items-center justify-center rounded-[.8rem] bg-main px-4 py-[.6rem] text-white duration-300 md:hover:bg-main-hover"
              >
                Tambah blog
              </Link>
            </div>
          </div>
          <div
            id="table"
            className="w-full"
          >
            <table className="w-full rounded-[.8rem]">
              <thead>
                <tr>
                  <th className="rounded-tl-[.8rem] bg-white py-4 text-center">
                    No
                  </th>
                  <th className="bg-white py-4 text-start">Judul</th>
                  <th className="bg-white py-4 text-center">Publish</th>
                  <th className="bg-white py-4 text-center">Views</th>
                  <th className="bg-white py-4 text-center">Status</th>
                  <th className="rounded-tr-[.8rem] bg-white py-4 text-start">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs?.map((item, i: number) => (
                  <tr key={i}>
                    <td
                      className={cn(
                        'border-t bg-white px-[.5rem] py-4 text-center text-[.9rem] text-main-gray-text',
                        i === blogs.length - 1 && 'rounded-bl-[.8rem]',
                      )}
                    >
                      {i + 1}
                    </td>
                    <td className="border-t bg-white px-[.5rem] py-4 text-start text-[.9rem] text-main-gray-text">
                      {item.title}
                    </td>
                    <td className="border-t bg-white px-[.5rem] py-4 text-center text-[.9rem] text-main-gray-text">
                      {item.publishedAt ? getDateString(item.publishedAt) : '-'}
                    </td>
                    <td className="border-t bg-white px-[.5rem] py-4 text-center text-[.9rem] text-main-gray-text">
                      {item.views}
                    </td>
                    <td className="border-t bg-white px-[.5rem] py-4 text-center text-[.9rem] text-main-gray-text">
                      {item.status}
                    </td>
                    <td
                      className={cn(
                        'border-t bg-white px-[.5rem] py-4 text-start text-[.9rem] text-main-gray-text',
                        i === blogs.length - 1 && 'rounded-br-[.8rem]',
                      )}
                    >
                      <div className="flex w-full items-center justify-center gap-[.5rem]">
                        <Link
                          href={`/${website_sub_category_id}/admin/blog/edit/${item.id}`}
                          className="rounded-[.5rem] bg-main px-4 py-[.5rem] text-white duration-300 md:hover:bg-main-hover"
                        >
                          Edit
                        </Link>
                        <button
                          className="rounded-[.5rem] bg-red-100 px-4 py-[.5rem] font-medium text-red-700 duration-300 md:hover:bg-red-200"
                          onClick={() => {
                            setOpen(true);
                            setBlogId(item.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isLoading && (
              <div className="flex justify-center items-center h-full w-full">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BlogAdmin;

interface Props {
  onClick: () => void;
  open: boolean;
  isLoading: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteBlog = ({ onClick, open, setOpen, isLoading }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="w-[360px]">
        <div className="flex flex-col items-center justify-center text-center">
          <p>
            Apakah Kamu yakin akan <br />{' '}
            <span className="text-red-700">menghapus blog</span> ini?
          </p>
          <div className="h-[80px] w-full">
            {!isLoading ? (
              <div className="grid w-full grid-cols-2 gap-[.5rem] pt-8 text-[.9rem]">
                <div
                  className="w-full shrink-0 cursor-pointer rounded-[.8rem] bg-red-100 py-[.8rem] font-medium text-red-700 duration-300 md:hover:bg-red-200 md:active:bg-red-100"
                  onClick={() => {
                    onClick();
                    setOpen(false);
                  }}
                >
                  Hapus Blog
                </div>
                <div
                  className="w-full shrink-0 cursor-pointer rounded-[.8rem] py-[.8rem] font-medium text-main-gray-text duration-300 md:hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  Batalkan
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center pt-8">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
