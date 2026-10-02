'use client';

import { BrandMark, Logo } from '@/components/brand/logo';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { appPath, useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buildAppNav, isNavActive, type AppNavItem } from './app-nav';
import { TrackSwitcher } from './track-picker';

/** Navigasi utama siswa (dipakai sidebar desktop & menu mobile). */
export function AppNavList({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const trackId = useTrackId();
  const sections = buildAppNav(trackId);

  return (
    <nav
      aria-label="Navigasi aplikasi"
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
          {section.items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isNavActive(pathname, item.href)}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}

function NavLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: AppNavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-md text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
        collapsed ? 'mx-auto size-10 justify-center' : 'h-10 px-3',
        active
          ? 'bg-brand-soft text-brand-strong'
          : 'text-ink-muted hover:bg-ink/5 hover:text-ink',
      )}
    >
      <Icon
        className="size-[1.125rem] shrink-0"
        aria-hidden
      />
      {collapsed ? (
        <span className="sr-only">{item.label}</span>
      ) : (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.tag && (
            <Badge
              variant={item.tag === 'Baru' ? 'success' : 'secondary'}
              className="px-1.5"
            >
              {item.tag}
            </Badge>
          )}
        </>
      )}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

/** Kartu ajakan berlangganan untuk akun gratis. */
export function UpgradeCard({ onAction }: { onAction?: () => void }) {
  const { data: session } = useSession();
  const { openUpgrade } = useAppContext();
  if (!session || session.user.tier) return null;
  return (
    <div className="flex flex-col gap-2 rounded-md bg-marker-soft p-3">
      <p className="text-sm font-semibold text-ink">Akunmu masih gratis</p>
      <p className="text-xs text-ink-muted">
        Pilih paket untuk membuka materi dan try out premium.
      </p>
      <Button
        variant="marker"
        size="sm"
        onClick={() => {
          onAction?.();
          openUpgrade();
        }}
      >
        Lihat paket belajar
      </Button>
    </div>
  );
}

/** Sidebar desktop (lg ke atas). Dapat diciutkan menjadi ikon saja. */
export function AppSidebar() {
  const { minimizeSidebar: collapsed, setMinimizeSidebar } = useAppContext();
  const trackId = useTrackId();
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 lg:flex',
        collapsed ? 'w-[4.5rem]' : 'w-64',
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
            href={appPath(trackId, 'bimboard')}
            aria-label="Bimbelio — BimBoard"
            className="mr-auto"
          >
            <Logo />
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
          'flex-1 scrollbar-thin overflow-y-auto pb-4',
          collapsed ? 'px-2' : 'px-3',
        )}
      >
        <AppNavList collapsed={collapsed} />
      </div>

      {!collapsed && (
        <div className="px-4 pb-4">
          <UpgradeCard />
        </div>
      )}
    </aside>
  );
}
