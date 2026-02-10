'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface ChipItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface ScrollableChipBarProps {
  items: ChipItem[];
  selected: string;
  onSelect: (id: string) => void;
  className?: string;
}

/**
 * Horizontal scrollable chip/pill filter bar for secondary filters.
 * Active chip: dark solid background. Inactive: white with subtle border.
 */
export function ScrollableChipBar({
  items,
  selected,
  onSelect,
  className,
}: ScrollableChipBarProps) {
  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto pb-1',
        className,
      )}
      style={
        { scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties
      }
    >
      {items.map((item) => {
        const isActive = selected === item.id;
        const ItemIcon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              'px-3.5 py-2 rounded-3xl text-xs font-bold transition-all flex-shrink-0 border',
              'flex items-center gap-1.5',
              isActive
                ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            {ItemIcon && <ItemIcon className="w-3.5 h-3.5" />}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
