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
import { InputImage } from '@/components/ui/input-image';
import { Label } from '@/components/ui/label';
import { MultiSelectWebsub } from '@/components/ui/multi-select-websub';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { supabase } from '@/supabaseClient';
import {
  WebsiteSubCategory,
  WebsiteSubCategoryTypeEnum,
} from '@/types/database';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAdminWebCategory } from '../provider';

type WebsiteCategory = {
  id: string;
  name: string;
  main_color: string;
  secondary_color: string;
  createdAt: Date;
  updatedAt: Date;
};

interface Props {
  children: React.ReactNode;
  categories: WebsiteCategory[];
  subCategories: WebsiteSubCategory[];
}

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Ganti karakter spesial dengan dash
    .replace(/^-|-$/g, ''); // Hapus dash di awal/akhir
};

export function DialogAddSubCategory({
  categories,
  children,
  subCategories,
}: Props) {
  const { getData } = useAdminWebCategory();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<WebsiteSubCategoryTypeEnum>('GENERAL');
  const [mainColor, setMainColor] = useState('#0062FA');
  const [secondaryColor, setSecondaryColor] = useState('#0091FF');
  const [sharingWebSubIds, setSharingWebSubIds] = useState<string[]>([]);

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    const category = categories.find((c) => c.id === value);
    if (category) {
      setMainColor(category.main_color);
      setSecondaryColor(category.secondary_color);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let imgUrl: undefined | string = undefined;
    const filePath = `website-sub-category/${sanitizeFileName(name)}`;
    if (image) {
      const { data, error } = await supabase.storage
        .from('img')
        .upload(filePath, image);
      if (data) {
        imgUrl = supabase.storage.from('img').getPublicUrl(filePath)
          .data.publicUrl;
      }
      if (error) {
        toaster({
          title: 'Error',
          description: `Failed to upload image: ${error.message}`,
          condition: 'warning',
          duration: 3000,
        });
        console.error('Error uploading image:', error.message);
        setIsLoading(false);
        return;
      }
    }
    await mutateGeneral('/website-category/createSubCategory', {
      payload: {
        name,
        website_category_id: categoryId,
        main_color: mainColor,
        secondary_color: secondaryColor,
        type,
        sharing_website_sub_category_ids:
          sharingWebSubIds.length > 0 ? sharingWebSubIds : undefined,
        image: imgUrl,
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
          <DialogTitle>Add Sub Web Category</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="sub-name">Name</Label>
            <Input
              id="sub-name"
              placeholder="Sub category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sub-name">Image (optional)</Label>
            <InputImage
              placeholder="Input image"
              // onChange={(e) => setName(e.target.value)}
              onChange={(file) => {
                if (file) setImage(file);
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="web-category">Web Category</Label>
            <Select
              value={categoryId}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="web-category">Type</Label>
            <Select
              value={type}
              onValueChange={(value: WebsiteSubCategoryTypeEnum) =>
                setType(value)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {(['GENERAL', 'CORE'] as WebsiteSubCategoryTypeEnum[]).map(
                  (type) => (
                    <SelectItem
                      key={type}
                      value={type}
                    >
                      {type}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          {type === 'CORE' && (
            <div className="grid gap-2">
              <Label htmlFor="web-category">Web Category</Label>
              <MultiSelectWebsub
                value={sharingWebSubIds}
                onValuesChange={setSharingWebSubIds}
                optionsData={subCategories}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="sub-main-color">Main Color</Label>
            <ColorPicker
              value={mainColor}
              onChange={setMainColor}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sub-secondary-color">Secondary Color</Label>
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
              'Save Sub Category'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
