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
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
          <History className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900">
              Riwayat Terakhir
            </h2>
            <RotateCcw className="w-5 h-5 text-purple-500" />
            <div className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
              Lanjutkan
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Lanjutkan pembelajaran dari materi yang terakhir Kamu akses
          </p>
        </div>
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
            <Skeleton
              key={i}
              className="h-[200px] rounded-2xl"
            />
          ))}
        </div>
      )}
    </div>
  );
}
