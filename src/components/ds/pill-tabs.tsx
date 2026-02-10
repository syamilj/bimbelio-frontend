'use client';

import { cn } from '@/lib/utils';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import type { LucideIcon } from 'lucide-react';

export interface PillTab {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

export interface PillTabsProps {
  tabs: PillTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  /** Make tabs sticky at top with backdrop blur. Default: false */
  sticky?: boolean;
  className?: string;
}

/**
 * Rounded pill tab navigation using tenant colors.
 * Extracted from BimArena Try-Out tab pattern.
 *
 * Mobile: horizontal scroll with hidden scrollbar.
 * Desktop: flex with equal-width tabs.
 */
export function PillTabs({
  tabs,
  activeTab,
  onTabChange,
  sticky = false,
  className,
}: PillTabsProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  return (
    <div
      className={cn(
        sticky && 'sticky top-0 z-30 bg-slate-50/80 backdrop-blur-xl py-2',
        className,
      )}
    >
      <div
        className={cn(
          'flex gap-1.5 p-1 bg-white rounded-3xl',
          'border border-slate-200/80 shadow-sm overflow-x-auto',
        )}
        style={
          { scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties
        }
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex items-center gap-1.5 px-4 py-2.5 rounded-3xl',
                'font-bold text-xs md:text-sm transition-all',
                'whitespace-nowrap flex-1 justify-center min-w-0',
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
              )}
            >
              {/* Active background */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: mainColor }}
                />
              )}

              {/* Content */}
              <div className="relative z-10 flex items-center gap-1.5">
                {TabIcon && (
                  <TabIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                )}
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={cn(
                      'text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none',
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
