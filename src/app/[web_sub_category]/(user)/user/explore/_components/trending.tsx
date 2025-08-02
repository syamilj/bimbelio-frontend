'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import type { Category, Subcategory } from '@/types/database';
import { FlameIcon as Fire, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Card from '../../_components/card';
import CardNotFound from '../../_components/card-not-found';

export default function Trending() {
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
    getGeneral('/document/getPopularDocuments', {
      setData: setDatas,
      setLoading: setIsLoading,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Trending
              </h2>
              <Fire className="w-6 h-6 text-orange-500" />
              <div className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full animate-pulse">
                🔥 Hot
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Materi paling populer dan banyak dipelajari saat ini
            </p>
          </div>
        </div>

        {/* Decorative gradient line */}
        <div className="absolute left-6 top-14 w-0.5 h-8 rounded-full bg-linear-to-b from-orange-500 to-red-500 opacity-20" />
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
              <Skeleton className="h-[200px] rounded-2xl bg-linear-to-br from-orange-100 to-red-100" />
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-linear-to-br from-orange-400 to-red-400 animate-pulse" />
              <div className="absolute top-3 left-3 text-orange-500 animate-bounce">
                🔥
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
