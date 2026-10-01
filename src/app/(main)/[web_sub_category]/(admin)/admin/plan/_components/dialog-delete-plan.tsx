'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteGeneral } from '@/lib/fetch-helper/fetch-helper';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  children: React.ReactNode;
  id: string;
  title: string;
  description: string;
  getData: () => Promise<void>;
}

export function DialogDelete({
  id,
  description,
  title,
  children,
  getData,
}: Props) {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = async () => {
    await deleteGeneral(`/plan/deletePlan?id=${id}`, {
      setLoading: setIsLoading,
      onSuccess: async () => {
        setOpen(false);
        await getData();
      },
    });
  };

  return (
    <Dialog
      open={isLoading ? true : open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={handleConfirm}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
