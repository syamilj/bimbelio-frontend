'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { CardGrid, EmptyState, SkeletonGrid } from '@/components/ds';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import type { Category, Subcategory } from '@/types/database';
import { History, RotateCcw, SearchX } from 'lucide-react';
import { useMemo } from 'react';
import Card from '../../_components/card';

type DocWithRelations = Document & { category: Category; subCategory: Subcategory };
type HistoryData = {
  today: { document: DocWithRelations }[];
  yesterday: { document: DocWithRelations }[];
};

export default function Riwayat() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const { data: datas, isLoading } = useGet<HistoryData>(
    '/document/getHistoryByUser',
    {
      params: { userId: session?.user.id },
      enabled: !!session?.user.id,
      useEffectDependencies: [session?.user.id],
    },
  );

  const riwayat = useMemo(() => {
    if (!datas) return [];
    const today = datas.today.map((item) => item.document);
    const yesterday = datas.yesterday.map((item) => item.document);
    return [...today, ...yesterday];
  }, [datas]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
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
        <CardGrid cols={{ sm: 2, lg: 3, xl: 4 }} scrollOnMobile={false} className="gap-6">
          <Card
            data={riwayat}
            href={`${website_sub_category_id}/user/workspace`}
            noCategory={true}
          />
        </CardGrid>
      )}

      {!isLoading && riwayat?.length === 0 && (
        <EmptyState
          icon={SearchX}
          color="purple"
          title="Belum ada riwayat"
          description="Mulai pelajari materi untuk melihat riwayat terakhir di sini"
        />
      )}

      {isLoading && (
        <SkeletonGrid count={8} cardHeight="h-[200px]" cols={{ sm: 2, lg: 3, xl: 4 }} scrollOnMobile={false} />
      )}
    </div>
  );
}
