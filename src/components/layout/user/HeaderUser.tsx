'use client';

import { useState } from 'react';
import useMedia from 'use-media';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, Search as SearchIcon } from 'lucide-react';

import { Notification } from '@/components/_shared/notification';
import { BadgeSubsInfo } from '@/components/_shared/subs/badge-subs-info';
import {
  DesktopLimitationsDropdown,
  MobileLimitationsDropdown,
} from './LimitationDisplay';
import { MobileSearchOverlay, SearchBar } from './SearchBar';
import { UserDropdown } from './UserDropdown';

// ─── HeaderUser ─────────────────────────────────────────────────

export function HeaderUser() {
  const { data: userSession } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { minimizeSidebar, setSidebarMobile } = useAppContext();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const isMobile = useMedia({ maxWidth: '768px' });
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header
      className={cn(
        'fixed left-2 md:left-0 right-2 md:right-2 top-2 z-40 h-14 md:h-16 bg-white/95 backdrop-blur-lg border rounded-3xl border-gray-200 shadow-sm transition-all duration-300',
        !minimizeSidebar ? 'md:left-[18rem]' : 'md:left-[6rem]',
      )}
    >
      <div className="flex items-center justify-between h-full px-3 md:px-6 gap-2">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-9 h-9 rounded-3xl shrink-0 hover:bg-gray-100 border border-gray-200"
            onClick={() => setSidebarMobile(true)}
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </Button>

          {/* Desktop Greeting */}
          <div className="hidden md:flex items-center gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <span className="text-lg">👋</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  Selamat datang kembali!
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Halo,{' '}
                  <span style={{ color: mainColor }} className="font-semibold">
                    {userSession?.user.name?.split(' ')[0]}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile - Compact Greeting */}
          <div className="md:hidden flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-base">👋</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                Halo,{' '}
                <span style={{ color: mainColor }}>
                  {userSession?.user.name?.split(' ')[0]}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          {/* Mobile Search Icon */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9 rounded-3xl hover:bg-gray-100 border border-gray-200"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <SearchIcon className="w-4 h-4 text-gray-600" />
            </Button>
          )}

          {/* Mobile Limitations Dropdown */}
          {isMobile && <MobileLimitationsDropdown />}

          {/* Desktop Search */}
          <SearchBar isMobile={isMobile} />

          {/* Desktop Limitations Dropdown */}
          {!isMobile && <DesktopLimitationsDropdown />}

          {/* Status Badge */}
          <BadgeSubsInfo />

          {/* Notification Icon */}
          <Notification />

          {/* User Profile Dropdown */}
          <UserDropdown isMobile={isMobile} />
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobile && (
        <MobileSearchOverlay
          showMobileSearch={showMobileSearch}
          onClose={() => setShowMobileSearch(false)}
        />
      )}
    </header>
  );
}
