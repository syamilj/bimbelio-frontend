'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { cn } from '@/lib/utils';
import { Globe, Layers, Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ScrollWrapper } from '@/components/ui/scroll-wrapper';
import CourseSummary from './course-summary';
import CourseTabAll from './course-tab-all';
import CourseTabUpsell from './course-tab-upsell';

type TabId = 'modul' | 'lainnya';

export default function BimCoursePage() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const platformName = websiteSubCategory?.name || 'Modul Saya';

  const [activeTab, setActiveTab] = useState<TabId>('modul');
  const [lainnyaCount, setLainnyaCount] = useState<number | null>(null);

  const onModulCount = useCallback((_count: number) => {
    // not used for display but kept for API compat
  }, []);
  const onLainnyaCount = useCallback((count: number) => {
    setLainnyaCount(count);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Summary Stats */}
      <div className="p-4 md:p-6">
        <CourseSummary />
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl py-2">
          {/* Tab Pills */}
          <ScrollWrapper
            className="flex gap-1.5 p-1 rounded-3xl overflow-x-auto"
            style={{
              background: `color-mix(in srgb, ${mainColor} 8%, white)`,
              scrollbarWidth: 'none',
            }}
          >
            {/* Tab: current platform */}
            <button
              onClick={() => setActiveTab('modul')}
              className={cn(
                'relative flex items-center gap-2 px-5 py-2.5 rounded-3xl font-bold text-sm transition-all whitespace-nowrap flex-1 justify-center',
                activeTab === 'modul'
                  ? 'text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {activeTab === 'modul' && (
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: mainColor }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{platformName}</span>
              </div>
            </button>

            {/* Tab: other platforms */}
            <button
              onClick={() => setActiveTab('lainnya')}
              className={cn(
                'relative flex items-center gap-2 px-5 py-2.5 rounded-3xl font-bold text-sm transition-all whitespace-nowrap flex-1 justify-center',
                activeTab === 'lainnya'
                  ? 'text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {activeTab === 'lainnya' && (
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: mainColor }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Platform Lainnya</span>
                {lainnyaCount !== null && lainnyaCount > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none',
                      activeTab === 'lainnya'
                        ? 'bg-white/25 text-white'
                        : 'bg-white text-slate-500 shadow-sm',
                    )}
                  >
                    {lainnyaCount}
                  </span>
                )}
                {activeTab !== 'lainnya' && (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                )}
              </div>
            </button>
          </ScrollWrapper>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mt-2">
          <div className={cn(activeTab !== 'modul' && 'hidden')}>
            <CourseTabAll onCountReady={onModulCount} />
          </div>
          <div className={cn(activeTab !== 'lainnya' && 'hidden')}>
            <CourseTabUpsell onCountReady={onLainnyaCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
