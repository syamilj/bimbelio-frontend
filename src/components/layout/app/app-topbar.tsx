'use client';

import { BrandMark } from '@/components/brand/logo';
import { useAppContext } from '@/components/provider/provider-app';
import { Button } from '@/components/ui/button';
import { appPath, useTrackId } from '@/lib/track';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { AccountMenu } from './account-menu';
import { CourseSearch } from './course-search';
import { NotificationMenu } from './notification-menu';
import { PlanMenu } from './plan-menu';

export function AppTopbar() {
  const { setSidebarMobile } = useAppContext();
  const trackId = useTrackId();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 lg:hidden"
          aria-label="Buka menu"
          onClick={() => setSidebarMobile(true)}
        >
          <Menu className="size-5" />
        </Button>
        <Link
          href={appPath(trackId, 'bimboard')}
          className="text-brand-strong lg:hidden"
          aria-label="Bimbelio — BimBoard"
        >
          <BrandMark
            title=""
            className="size-7"
          />
        </Link>

        <CourseSearch className="hidden w-full max-w-sm md:flex" />

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:block">
            <PlanMenu />
          </div>
          <NotificationMenu />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
