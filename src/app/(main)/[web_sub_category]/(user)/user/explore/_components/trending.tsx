'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import type { Category, Subcategory } from '@/types/database';
import { FlameIcon as Fire, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Card from '../../_components/card';
import CardNotFound from '../../_components/card-not-found';

export default function Trending() {
  const [datas, setDatas] = useState<
    (Document & {
      category: Category;
      subCategory: Subcategory;
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get dynamic colors
  // const mainColor = websiteSubCategory?.main_color || '#0066FF';

  useEffect(() => {
    getGeneral('/document/getPopularDocuments', {
      setData: setDatas,
      setLoading: setIsLoading,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900">Trending</h2>
            <Fire className="w-5 h-5 text-orange-500" />
            <div className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
              🔥 Hot
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Materi paling populer dan banyak dipelajari saat ini
          </p>
        </div>
      </div>

      {/* Content */}
      {!isLoading && datas?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card data={datas} />
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
            <Skeleton
              key={i}
              className="h-[200px] rounded-3xl"
            />
          ))}
        </div>
      )}
    </div>
  );
}
