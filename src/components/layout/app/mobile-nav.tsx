'use client';

import { useAppContext } from '@/components/provider/provider-app';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useRoutePathname, useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { isNavActive, mobileTabs } from './app-nav';
import { AppNavList, NavBubble, UpgradeCard } from './app-sidebar';
import { CourseSearch } from './course-search';
import { PlanMenu } from './plan-menu';
import { TrackSwitcher } from './track-picker';

/** Menu lengkap untuk layar kecil (dibuka dari topbar atau tab "Menu"). */
export function MobileAppMenu() {
  const { sidebarMobile, setSidebarMobile } = useAppContext();
  const close = () => setSidebarMobile(false);

  return (
    <Sheet
      open={sidebarMobile}
      onOpenChange={setSidebarMobile}
    >
      <SheetContent
        side="left"
        className="gap-5 px-4"
      >
        <SheetHeader>
          <SheetTitle className="font-mono text-xs font-medium text-ink-muted lowercase">
            Menu
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigasi aplikasi Bimbelio
          </SheetDescription>
        </SheetHeader>
        <TrackSwitcher />
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-medium text-ink-muted lowercase">
            Paket & koin
          </span>
          <PlanMenu />
        </div>
        <CourseSearch className="md:hidden" />
        <AppNavList onNavigate={close} />
        <div className="mt-auto">
          <UpgradeCard onAction={close} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Tab bar bawah di layar kecil: empat tujuan utama + Menu. */
export function MobileTabBar() {
  const pathname = useRoutePathname('app');
  const trackId = useTrackId();
  const { setSidebarMobile } = useAppContext();

  return (
    <nav
      aria-label="Navigasi cepat"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid h-16 grid-cols-5">
        {mobileTabs(trackId).map(({ label, href, icon: Icon }) => {
          const active = isNavActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex h-full flex-col items-center justify-center gap-0.5 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none focus-visible:ring-inset',
                  active ? 'text-ink' : 'text-ink-muted',
                )}
              >
                <NavBubble
                  icon={Icon}
                  active={active}
                  size="sm"
                />
                {label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => setSidebarMobile(true)}
            className="group flex h-full w-full flex-col items-center justify-center gap-0.5 text-xs font-semibold text-ink-muted focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none focus-visible:ring-inset"
          >
            <NavBubble
              icon={Menu}
              active={false}
              size="sm"
            />
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}
