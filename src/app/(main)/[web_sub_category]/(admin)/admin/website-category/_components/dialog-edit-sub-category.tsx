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
import { env } from '@/env.mjs';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { storage } from '@/storageClient';
import {
  WebsiteCategory,
  WebsiteSubCategory,
  WebsiteSubCategoryTypeEnum,
} from '@/types/database';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAdminWebCategory } from '../provider';

interface Props {
  children: React.ReactNode;
  subCategory: WebsiteSubCategory | null;
  categories: WebsiteCategory[];
  subCategories: WebsiteSubCategory[];
}

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Ganti karakter spesial dengan dash
    .replace(/^-|-$/g, ''); // Hapus dash di awal/akhir
};
export function DialogEditSubCategory({
  subCategory,
  categories,
  children,
  subCategories,
}: Props) {
  const { getData } = useAdminWebCategory();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<WebsiteSubCategoryTypeEnum>('GENERAL');
  const [mainColor, setMainColor] = useState('#0062FA');
  const [secondaryColor, setSecondaryColor] = useState('#0091FF');
  const [sharingWebSubIds, setSharingWebSubIds] = useState<string[]>([]);

  console.log({ subCategory });

  useEffect(() => {
    if (subCategory) {
      setName(subCategory.name);
      setCategoryId(subCategory.website_category_id);
      setMainColor(subCategory.main_color);
      setSecondaryColor(subCategory.secondary_color);
      setType(subCategory.type);
      setSharingWebSubIds(subCategory.sharing_website_sub_category_ids);
      setImgUrl(subCategory.image || undefined);
    }
  }, [subCategory]);

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
    if (subCategory) {
      setIsLoading(true);
      let imgUrl: undefined | string = undefined;
      const filePath = `website-sub-category/${sanitizeFileName(name)}`;
      if (image) {
        await storage
          .from('img')
          .remove([
            `website-sub-category/${sanitizeFileName(subCategory?.name)}`,
          ]);
        const { data, error } = await storage
          .from('img')
          .upload(filePath, image);
        if (data) {
          imgUrl = `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/${filePath}`;
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
      } else {
        await storage
          .from('img')
          .move(
            `website-sub-category/${sanitizeFileName(subCategory?.name)}`,
            filePath,
          );
      }
      await mutateGeneral('/website-category/editSubCategory', {
        payload: {
          id: subCategory.id,
          name,
          main_color: mainColor,
          secondary_color: secondaryColor,
          type,
          sharing_website_sub_category_ids:
            sharingWebSubIds.length > 0 ? sharingWebSubIds : undefined,
          image: imgUrl,
        },
        type: 'put',
        onSuccess: async () => {
          setOpen(false);
          setMainColor('#FFFFFF');
          setSecondaryColor('#FFFFFF');
          await getData();
        },
        setLoading: setIsLoading,
      });
    }
  };

  return (
    <Dialog
      open={isLoading ? true : open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Sub Web Category</DialogTitle>
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
              preview={imgUrl}
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
              'Save Changes'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
