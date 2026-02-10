'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { ChevronRight, Stars } from 'lucide-react';

interface WebCategorySelectorProps {
  onClick: () => void;
  compact?: boolean;
}

export function WebCategorySelector({
  onClick,
  compact = false,
}: WebCategorySelectorProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  if (!websiteSubCategory && compact) return null;

  return (
    <button
      className="w-full flex items-center justify-between p-2.5 rounded-3xl bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left group shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 w-full overflow-hidden">
        <div
          className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-3xl flex items-center justify-center shrink-0 border border-slate-100`}
          style={{ backgroundColor: `${mainColor}10` }}
        >
          <Stars
            className={compact ? 'w-4 h-4' : 'w-5 h-5'}
            style={{ color: mainColor }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`${compact ? 'text-sm font-bold' : 'text-sm font-black'} text-slate-800 truncate mb-0.5`}
          >
            {websiteSubCategory?.name || 'Pilih Kategori'}
          </p>
          <p className="text-[10px] font-semibold text-slate-500 truncate">
            {websiteSubCategory ? 'Platform Belajar' : 'Pilih tujuan belajar'}
          </p>
        </div>
        <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
        </div>
      </div>
    </button>
  );
}
