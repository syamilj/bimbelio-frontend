'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Loader2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SidebarUpgradeButtonProps {
  /** Icon-only mode for minimized sidebar */
  iconOnly?: boolean;
  /** Close mobile sheet after click */
  onCloseMobile?: () => void;
}

export function SidebarUpgradeButton({
  iconOnly = false,
  onCloseMobile,
}: SidebarUpgradeButtonProps) {
  const router = useRouter();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleClick = () => {
    if (isUpgrading) return;
    setIsUpgrading(true);
    router.push('/price');
    onCloseMobile?.();
  };

  if (iconOnly) {
    return (
      <div className="flex justify-center mb-3 px-2">
        <button
          onClick={handleClick}
          disabled={isUpgrading}
          style={{ backgroundColor: `${mainColor}15` }}
          className="w-10 h-10 rounded-3xl flex items-center justify-center hover:opacity-80 transition-all shadow-sm group relative disabled:opacity-70 disabled:cursor-not-allowed"
          title="Upgrade Plan"
        >
          {isUpgrading ? (
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: mainColor }}
            />
          ) : (
            <ShoppingBag
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              style={{ color: mainColor }}
            />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 mb-3">
      <button
        onClick={handleClick}
        disabled={isUpgrading}
        style={{ backgroundColor: `${mainColor}15`, color: mainColor }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-3xl text-sm font-bold hover:opacity-80 transition-all group disabled:opacity-70 disabled:cursor-not-allowed text-left"
      >
        {isUpgrading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
        )}
        <span>Upgrade Plan</span>
      </button>
    </div>
  );
}
