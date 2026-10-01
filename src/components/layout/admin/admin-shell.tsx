'use client';

import { BrandMark, Logo } from '@/components/brand/logo';
import { UserMenu } from '@/components/layout/site/user-menu';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { adminPath, appPath, useRoutePathname, useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  ExternalLink,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { SubscriptionChecks } from '../app/subscription-checks';
import { TrackSwitcher } from '../app/track-picker';
import {
  ADMIN_NAV,
  adminItemHref,
  isAdminItemActive,
  visibleAdminNav,
} from './admin-nav';

/** Pratinjau pengerjaan try out tampil layar penuh, seperti yang dilihat siswa. */
const isBareAdminRoute = (pathname: string) =>
  /\/admin\/tryout\/testing\/try-out\/[^/]+/.test(pathname);

function AdminNavList({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRoutePathname('admin');
  const trackId = useTrackId();
  const { data: session } = useSession();
  const { type } = useWebsiteSubCategory();
  const sections = visibleAdminNav(session?.user.role, type.isCore);

  return (
    <nav
      aria-label="Navigasi admin"
      className="flex flex-col gap-5"
    >
      {sections.map((section) => (
        <div
          key={section.title}
          className="flex flex-col gap-0.5"
        >
          {collapsed ? (
            <span
              className="mx-auto mb-1 h-px w-6 bg-line"
              aria-hidden
            />
          ) : (
            <p className="px-3 pb-1 text-xs font-semibold text-ink-subtle">
              {section.title}
            </p>
          )}
          {section.items.map((item) => {
            const href = adminItemHref(trackId, item);
            const active = isAdminItemActive(pathname, href, item.path === '');
            const Icon = item.icon;
            const link = (
              <Link
                key={item.path}
                href={href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-md text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
                  collapsed ? 'mx-auto size-10 justify-center' : 'h-9 px-3',
                  active
                    ? 'bg-brand-soft text-brand-strong'
                    : 'text-ink-muted hover:bg-ink/5 hover:text-ink',
                )}
              >
                <Icon
                  className="size-4 shrink-0"
                  aria-hidden
                />
                {collapsed ? (
                  <span className="sr-only">{item.label}</span>
                ) : (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
            return collapsed ? (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <Fragment key={item.path}>{link}</Fragment>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

const SEGMENT_LABELS: Record<string, string> = Object.fromEntries(
  ADMIN_NAV.flatMap((s) => s.items).map((item) => [
    item.path.split('/')[0],
    item.label,
  ]),
);
const ACTION_LABELS: Record<string, string> = {
  new: 'Baru',
  create: 'Baru',
  add: 'Baru',
  edit: 'Ubah',
  analytics: 'Analitik',
  participants: 'Peserta',
  buttons: 'Tombol',
  irt: 'Penilaian IRT',
  testing: 'Uji coba',
  tag: 'Tag',
  user: 'Pengguna',
  online: 'Online',
};

/** Breadcrumb dari URL admin. Hanya halaman daftar yang ditautkan. */
function AdminBreadcrumb() {
  const pathname = useRoutePathname('admin');
  const trackId = useTrackId();
  const segments = pathname.split('/').filter(Boolean).slice(2); // buang track & 'admin'
  if (segments.length === 0) {
    return <span className="text-sm font-semibold text-ink">Dashboard</span>;
  }
  const crumbs = segments.map((seg, i) => {
    const label =
      i === 0
        ? (SEGMENT_LABELS[seg] ?? seg)
        : (ACTION_LABELS[seg] ??
          (seg.length > 16 ? 'Detail' : decodeURIComponent(seg)));
    return { label, href: i === 0 ? adminPath(trackId, seg) : null };
  });
  // Detail berurutan (mis. edit/123) cukup ditampilkan sekali.
  const compact = crumbs.filter(
    (c, i) => !(c.label === 'Detail' && crumbs[i - 1]?.label === 'Ubah'),
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className="min-w-0"
    >
      <ol className="flex items-center gap-1.5 text-sm">
        <li>
          <Link
            href={adminPath(trackId)}
            className="text-ink-muted hover:text-ink"
          >
            Dashboard
          </Link>
        </li>
        {compact.map((crumb, i) => (
          <li
            key={i}
            className="flex min-w-0 items-center gap-1.5"
          >
            <ChevronRight
              className="size-3.5 shrink-0 text-ink-subtle"
              aria-hidden
            />
            {crumb.href && i < compact.length - 1 ? (
              <Link
                href={crumb.href}
                className="truncate text-ink-muted hover:text-ink"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className="truncate font-semibold text-ink"
                aria-current={i === compact.length - 1 ? 'page' : undefined}
              >
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Kerangka panel admin. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = useRoutePathname('admin');
  const trackId = useTrackId();
  const { data: session } = useSession();
  const {
    minimizeSidebar: collapsed,
    setMinimizeSidebar,
    sidebarMobile,
    setSidebarMobile,
  } = useAppContext();

  if (isBareAdminRoute(pathname)) return <>{children}</>;

  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <div className="flex min-h-dvh">
      <aside
        className={cn(
          'sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 lg:flex',
          collapsed ? 'w-[4.5rem]' : 'w-60',
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center gap-2',
            collapsed ? 'justify-center' : 'px-4',
          )}
        >
          {!collapsed && (
            <Link
              href={adminPath(trackId)}
              className="mr-auto flex items-center gap-2"
            >
              <Logo />
              <span className="text-xs font-semibold text-ink-muted">
                Admin
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMinimizeSidebar((v) => !v)}
            aria-label={collapsed ? 'Lebarkan sidebar' : 'Ciutkan sidebar'}
          >
            {collapsed ? (
              <BrandMark
                title=""
                className="size-6 text-brand-strong"
              />
            ) : (
              <ToggleIcon />
            )}
          </Button>
        </div>
        <div className={cn('pb-4', collapsed ? 'px-3' : 'px-4')}>
          <TrackSwitcher compact={collapsed} />
        </div>
        <div
          className={cn(
            'flex-1 scrollbar-thin overflow-y-auto pb-6',
            collapsed ? 'px-2' : 'px-3',
          )}
        >
          <AdminNavList collapsed={collapsed} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 lg:hidden"
              aria-label="Buka menu admin"
              onClick={() => setSidebarMobile(true)}
            >
              <Menu className="size-5" />
            </Button>
            <AdminBreadcrumb />
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href={appPath(trackId, 'bimboard')}>
                  <ExternalLink />
                  Tampilan siswa
                </Link>
              </Button>
              {session && (
                <UserMenu
                  user={session.user}
                  trackId={trackId}
                />
              )}
            </div>
          </div>
        </header>
        <main
          id="konten"
          className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
        </main>
      </div>

      <Sheet
        open={sidebarMobile}
        onOpenChange={setSidebarMobile}
      >
        <SheetContent
          side="left"
          className="gap-5 px-4"
        >
          <SheetHeader>
            <SheetTitle>Panel admin</SheetTitle>
            <SheetDescription className="sr-only">
              Navigasi panel admin
            </SheetDescription>
          </SheetHeader>
          <TrackSwitcher />
          <AdminNavList onNavigate={() => setSidebarMobile(false)} />
        </SheetContent>
      </Sheet>
      <SubscriptionChecks />
    </div>
  );
}
