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
import { useMutation } from '@/lib/fetch-helper/useMutation';

import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PostUpTagProps {
  refetchTags: () => void;
}

function PostUpTag({ refetchTags }: PostUpTagProps) {
  const [tag, setTag] = useState('');

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
  };

  // const { isPending: isTagLoading, mutateAsync: addTag } =
  //   api.blog.addTag.useMutation();

  const { mutate: addTag, isLoading: isTagLoading } = useMutation(
    '/blog/addTag',
    'post',
    {
      payload: {
        title: tag,
      },
      onSuccess() {
        refetchTags();
      },
    },
  );

  const uploadTag = async () => {
    if (!tag) {
      toaster({
        title: 'Gagal',
        description: 'Harap masukkan nama kategori.',
        condition: 'warning',
      });
      return;
    }

    await addTag();
  };

  return (
    <>
      <div className="my-6 flex justify-end">
        <Dialog>
          <DialogTrigger>
            <div className={cn(buttonVariants())}>Tambah Tag</div>
          </DialogTrigger>
          <DialogContent hideClose={true}>
            <DialogHeader>
              <DialogTitle>
                <p className="mb-4 text-center text-xl">Tambahkan Tag</p>
              </DialogTitle>
              <div>
                <Input
                  value={tag}
                  onChange={onTextChange}
                  placeholder={tag ? '' : 'Tag'}
                  className="w-full"
                />
              </div>

              <div>
                <Button
                  disabled={!tag || isTagLoading}
                  className="mt-4 w-full"
                  onClick={uploadTag}
                >
                  {isTagLoading && <Spinner />}
                  Kirim
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default PostUpTag;
