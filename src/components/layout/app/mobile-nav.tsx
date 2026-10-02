'use client';

import { useAppContext } from '@/components/provider/provider-app';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavActive, mobileTabs } from './app-nav';
import { AppNavList, UpgradeCard } from './app-sidebar';
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
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigasi aplikasi Bimbelio
          </SheetDescription>
        </SheetHeader>
        <TrackSwitcher />
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-ink-muted">Paket & koin</span>
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
  const pathname = usePathname();
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
                  'flex h-full flex-col items-center justify-center gap-1 text-xs font-semibold',
                  active ? 'text-brand-strong' : 'text-ink-muted',
                )}
              >
                <Icon
                  className="size-5"
                  aria-hidden
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
            className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-semibold text-ink-muted"
          >
            <Menu
              className="size-5"
              aria-hidden
            />
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}
