'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { CardGrid, EmptyState, SkeletonGrid } from '@/components/ds';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import type { Category, Subcategory } from '@/types/database';
import { FlameIcon as Fire, SearchX, TrendingUp } from 'lucide-react';
import Card from '../../_components/card';

type DocWithRelations = Document & { category: Category; subCategory: Subcategory };

export default function Trending() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: datas, isLoading } = useGet<DocWithRelations[]>('/document/getPopularDocuments');

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
      {!isLoading && datas && datas.length > 0 && (
        <CardGrid cols={{ sm: 2, lg: 3, xl: 4 }} scrollOnMobile={false} className="gap-6">
          <Card
            data={datas}
            href={`${website_sub_category_id}/user/workspace`}
            noCategory={true}
          />
        </CardGrid>
      )}

      {!isLoading && (!datas || datas.length === 0) && (
        <EmptyState
          icon={SearchX}
          color="orange"
          title="Belum ada materi trending"
          description="Materi populer akan muncul di sini"
        />
      )}

      {isLoading && (
        <SkeletonGrid count={8} cardHeight="h-[200px]" cols={{ sm: 2, lg: 3, xl: 4 }} scrollOnMobile={false} />
      )}
    </div>
  );
}
