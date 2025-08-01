'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DialogWebCategory } from './dialog-web-category';

export default function ChooseWebCategory({
  minimizeSidebar,
}: {
  minimizeSidebar: boolean;
}) {
  const { web_sub_category } = useParams<{ web_sub_category: string }>();
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();
  const [isClient, setIsClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'relative overflow-hidden rounded-xl bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700 p-3 text-white shadow-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.01] active:scale-[0.99]',
          minimizeSidebar ? 'hidden' : 'w-full',
        )}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-semibold text-base">
            {websiteSubCategory?.name || 'Pilih Kategori'}
          </span>
          <ChevronDown className="w-4 h-4 opacity-80" />
        </div>
        {/* Elemen dekoratif */}
        <div className="absolute -right-2 -top-2 w-8 h-8 bg-white/10 rounded-full blur-[1px]" />
        <div className="absolute -right-4 -bottom-4 w-10 h-10 bg-white/5 rounded-full blur-[1px]" />
      </div>

      <DialogWebCategory
        items={webCategoryData}
        value={websiteSubCategory?.id}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSelect={(item) => {
          localStorage.setItem('website_sub_category_id', item?.id);
          const pathname = window.location.pathname;
          const pathnameArray = pathname.split('/');
          let newPathname = '';
          pathnameArray.forEach((pItem, index) => {
            if (index > 1) {
              newPathname += `/${pItem}`;
            }
          });
          window.location.pathname = `/${item.id}${newPathname}`;
          setIsDialogOpen(false);
        }}
      />
    </>
  );
}
