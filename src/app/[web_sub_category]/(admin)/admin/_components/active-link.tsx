'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ActiveLinkProps {
  icon: ReactNode;
  href: string;
  label: string;
  description?: string;
  isActive?: boolean;
  minimized?: boolean;
}

const ActiveLink = ({
  icon,
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
        'group relative flex items-center gap-3 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
        minimized ? 'justify-center p-3 mx-1' : 'p-4 mx-3',
        isActive
          ? 'text-white shadow-lg scale-105'
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
      )}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
          : undefined,
      }}
    >
      {/* Icon Container */}
      <div
        className={cn(
          'flex items-center justify-center rounded-xl transition-all duration-300',
          minimized ? 'w-8 h-8' : 'w-10 h-10',
          isActive
            ? 'bg-white/20 shadow-inner'
            : 'bg-gray-100 group-hover:bg-gray-200',
        )}
      >
        {icon}
      </div>

      {/* Label and Description - Only show when not minimized */}
      {!minimized && (
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              'font-semibold text-sm leading-tight transition-colors duration-200',
              isActive ? 'text-white' : 'text-gray-900',
            )}
          >
            {label}
          </div>
          {description && (
            <div
              className={cn(
                'text-xs leading-tight mt-0.5 transition-colors duration-200',
                isActive ? 'text-white/80' : 'text-gray-500',
              )}
            >
              {description}
            </div>
          )}
        </div>
      )}

      {/* Active Indicator */}
      {isActive && !minimized && (
        <div className="w-1 h-8 bg-white/30 rounded-full" />
      )}

      {/* Hover Effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none',
          !isActive && 'bg-gray-900',
        )}
      />

      {/* Shimmer Effect for Active State */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-shimmer" />
        </div>
      )}
    </Link>
  );

  // Wrap with tooltip when minimized
  if (minimized) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-white shadow-lg border border-gray-200 rounded-xl p-3"
          >
            <div className="space-y-1">
              <div className="font-semibold text-sm text-gray-900">{label}</div>
              {description && (
                <div className="text-xs text-gray-600">{description}</div>
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
