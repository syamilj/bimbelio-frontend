'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ActiveLinkProps {
  icon: LucideIcon;
  href: string;
  label: string;
  description?: string;
  isActive?: boolean;
  minimized?: boolean;
}

const ActiveLink = ({
  icon: Icon,
  href,
  label,
  description,
  isActive = false,
  minimized = false,
}: ActiveLinkProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const linkContent = (
    <Link
      href={href}
      className={cn(
        'group relative flex items-center gap-3 rounded-3xl transition-all duration-200',
        minimized ? 'justify-center p-2.5 mx-1' : 'p-2.5 mx-1',
        isActive
          ? 'text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      )}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
          : undefined,
      }}
    >
      {/* Icon */}
      <Icon
        className={cn(
          'shrink-0 transition-all duration-200',
          minimized ? 'w-5 h-5' : 'w-5 h-5',
          isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-900',
        )}
        style={isActive ? {} : {}}
      />

      {/* Label and Description - Only show when not minimized */}
      {!minimized && (
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              'font-bold text-xs leading-tight transition-colors duration-200',
              isActive ? 'text-white' : 'text-slate-900',
            )}
          >
            {label}
          </div>
          {description && (
            <div
              className={cn(
                'text-[10px] leading-tight mt-0.5 transition-colors duration-200 font-medium',
                isActive ? 'text-white/80' : 'text-slate-500',
              )}
            >
              {description}
            </div>
          )}
        </div>
      )}
    </Link>
  );

  // Wrap with tooltip when minimized
  if (minimized) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-white shadow-lg border border-slate-200 rounded-3xl p-2.5"
          >
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-900">{label}</div>
              {description && (
                <div className="text-[10px] text-slate-600 font-medium">
                  {description}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return linkContent;
};

export default ActiveLink;
