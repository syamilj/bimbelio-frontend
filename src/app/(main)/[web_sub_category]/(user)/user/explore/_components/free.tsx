'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { CardGrid, EmptyState, SkeletonGrid } from '@/components/ds';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import type { Category, Document, Subcategory } from '@/types/database';
import { Gift, SearchX, Sparkles } from 'lucide-react';
import Card from '../../_components/card';

type DocWithRelations = Document & { category: Category; subCategory: Subcategory };

export default function Free() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: datas, isLoading } = useGet<DocWithRelations[]>('/document/getFreeDocument');

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: mainColor }}
        >
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900">Coba Gratis</h2>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Mulai belajar dengan materi gratis pilihan terbaik
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
          color="blue"
          title="Belum ada materi gratis"
          description="Materi gratis akan tersedia di sini"
        />
      )}

      {isLoading && (
        <SkeletonGrid count={8} cardHeight="h-[200px]" cols={{ sm: 2, lg: 3, xl: 4 }} scrollOnMobile={false} />
      )}
    </div>
  );
}
