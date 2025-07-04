'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import type { Category, Document, Subcategory } from '@/types/database';
import { Gift, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import Card from '../../_components/card';
import CardNotFound from '../../_components/card-not-found';

export default function Free() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [datas, setDatas] = useState<
    (Document & {
      category: Category;
      subCategory: Subcategory;
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  useEffect(() => {
    getGeneral('/document/getFreeDocument', {
      setData: setDatas,
      setLoading: setIsLoading,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="relative">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: mainColor }}
          >
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Coba Gratis
              </h2>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Mulai belajar dengan materi gratis pilihan terbaik
            </p>
          </div>
        </div>

        {/* Decorative gradient line */}
        <div
          className="absolute left-6 top-14 w-0.5 h-8 rounded-full opacity-20"
          style={{ backgroundColor: mainColor }}
        />
      </div>

      {/* Content */}
      {!isLoading && datas?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card
            data={datas}
            href={`${website_sub_category_id}/user/workspace`}
            noCategory={true}
          />
        </div>
      )}

      {!isLoading && datas?.length === 0 && (
        <div className="flex justify-center">
          <CardNotFound />
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_: any, i: number) => (
            <div
              key={i}
              className="relative"
            >
              <Skeleton className="h-[200px] rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100" />
              <div
                className="absolute top-3 right-3 w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: mainColor }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
