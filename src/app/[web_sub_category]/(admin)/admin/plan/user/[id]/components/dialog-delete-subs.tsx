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
import { Input } from '@/components/ui/input';
import { deleteGeneral } from '@/lib/fetch-helper/fetch-helper';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  children: React.ReactNode;
  id: string;
  title: string;
  name: string;
  email: string;
  subs: string;
  description: string;
  getData: () => Promise<any>;
}

export function DialogDeleteSubs({
  id,
  description,
  title,
  name,
  email,
  subs,
  children,
  getData,
}: Props) {
  const [open, setOpen] = useState(false);

  const [pasteId, setPasteId] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = async () => {
    await deleteGeneral(`/plan/deleteSub?id=${id}`, {
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
      onOpenChange={(open) => {
        setOpen(open);
        setPasteId('');
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description} <br />
            Name: <strong>{name}</strong>
            <br /> Email: <strong>{email}</strong>
            <br /> Subscription: <strong>{subs}</strong>
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Salin subscription id <strong>{id}</strong> untuk menghapus
          subscription.
        </p>
        <Input
          placeholder="Paste id disini"
          value={pasteId}
          onChange={(e) => setPasteId(e.target.value)}
        />
        <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading || pasteId !== id}
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
