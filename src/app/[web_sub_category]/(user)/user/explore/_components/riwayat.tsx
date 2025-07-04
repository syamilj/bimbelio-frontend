'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import type { Category, Subcategory } from '@/types/database';
import { History, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Card from '../../_components/card';
import CardNotFound from '../../_components/card-not-found';

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState<any>([]);
  const { data: session } = useSession();

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

  useEffect(() => {
    getGeneral('/document/getHistoryByUser', {
      params: { userId: session?.user.id },
      setData: setDatas,
      setLoading: setIsLoading,
    });
  }, []);

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
      <div className="flex items-center gap-3 pb-2">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-500 rounded-xl shadow-lg">
          <History className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Riwayat Terakhir
            <RotateCcw className="w-5 h-5 text-purple-500" />
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Lanjutkan pembelajaran dari materi yang terakhir Anda akses
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CardNotFound />
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_: any, i: number) => (
            <Skeleton
              key={i}
              className="h-[200px] rounded-xl bg-gradient-to-br from-purple-100 to-pink-100"
            />
          ))}
        </div>
      )}
    </div>
  );
}
