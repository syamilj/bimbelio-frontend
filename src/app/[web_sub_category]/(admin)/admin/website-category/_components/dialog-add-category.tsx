'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mutateGeneral } from '@/lib/fetch-helper';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAdminWebCategory } from '../provider';

interface Props {
  children: React.ReactNode;
}

export function DialogAddCategory({ children }: Props) {
  const { getData } = useAdminWebCategory();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [mainColor, setMainColor] = useState('#FFFFFF');
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateGeneral('/website-category/createCategory', {
      payload: {
        name,
        main_color: mainColor,
        secondary_color: secondaryColor,
      },
      type: 'post',
      onSuccess: async () => {
        setOpen(false);
        setMainColor('#FFFFFF');
        setSecondaryColor('#FFFFFF');
        await getData();
      },
      setLoading: setIsLoading,
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
          <DialogTitle>Add Web Category</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="main-color">Main Color</Label>

            <ColorPicker
              value={mainColor}
              onChange={setMainColor}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="secondary-color">Secondary Color</Label>
            <ColorPicker
              value={secondaryColor}
              onChange={setSecondaryColor}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Save Category'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
