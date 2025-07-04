'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import type { Category, Subcategory } from '@/types/database';
import { History, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Card from '../../_components/card';
import CardNotFound from '../../_components/card-not-found';

export default function Riwayat() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [riwayat, setRiwayat] = useState<any>([]);

  const [datas, setDatas] = useState<{
    today: {
      document: Document & {
        category: Category;
        subCategory: Subcategory;
      };
    }[];
    yesterday: {
      document: Document & {
        category: Category;
        subCategory: Subcategory;
      };
    }[];
  }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  useEffect(() => {
    getGeneral('/document/getHistoryByUser', {
      params: { userId: session?.user.id },
      setData: setDatas,
      setLoading: setIsLoading,
    });
  }, [session?.user.id]);

  useEffect(() => {
    if (datas) {
      const today = datas?.today.map((item) => {
        return {
          ...item.document,
        };
      });
      const yesterday = datas?.yesterday.map((item) => {
        return {
          ...item.document,
        };
      });
      const riwayatData = [...today, ...yesterday];
      setRiwayat([...riwayatData]);
    }
  }, [datas]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <History className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Riwayat Terakhir
              </h2>
              <RotateCcw className="w-6 h-6 text-purple-500" />
              <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded-full">
                Lanjutkan
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Lanjutkan pembelajaran dari materi yang terakhir Anda akses
            </p>
          </div>
        </div>

        {/* Decorative gradient line */}
        <div className="absolute left-6 top-14 w-0.5 h-8 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600 opacity-20" />
      </div>

      {/* Content */}
      {!isLoading && riwayat?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card
            data={riwayat}
            href={`${website_sub_category_id}/user/workspace`}
            noCategory={true}
          />
        </div>
      )}

      {!isLoading && riwayat?.length === 0 && (
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
              <Skeleton className="h-[200px] rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100" />
              <div className="absolute top-3 left-3 w-5 h-5 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 animate-pulse" />
              <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
