'use client';

import { Logo } from '@/components/brand/logo';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appPath, useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationMenu as NavPrimitive } from 'radix-ui';
import { useState } from 'react';
import { MobileMenu } from './mobile-menu';
import { SITE_NAV, type SiteNavGroup } from './site-nav';
import { UserMenu } from './user-menu';

const isActive = (pathname: string, href?: string) =>
  !!href &&
  !href.includes('#') &&
  (pathname === href || pathname.startsWith(`${href}/`));

/** Header situs publik: logo, navigasi, dan aksi akun. */
export function SiteHeader() {
  const pathname = usePathname();
  const trackId = useTrackId();
  const { status, data: session } = useSession();
  const { useAuth } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const openLogin = () =>
    useAuth.setShowAuth({ open: true, redirect: appPath(trackId, 'bimboard') });

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Bimbelio — beranda"
          className="rounded-sm focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          <Logo />
        </Link>

        <NavPrimitive.Root
          className="relative hidden lg:block"
          delayDuration={100}
        >
          <NavPrimitive.List className="flex items-center gap-1">
            {SITE_NAV.map((group) => (
              <NavPrimitive.Item key={group.label}>
                {group.sections ? (
                  <NavDropdown
                    group={group}
                    active={isActive(pathname, group.href)}
                  />
                ) : (
                  <NavPrimitive.Link
                    asChild
                    active={isActive(pathname, group.href)}
                  >
                    <Link
                      href={group.href!}
                      className={navItemClassName}
                    >
                      {group.label}
                      {group.badge && (
                        <Badge
                          variant="highlight"
                          className="px-1.5"
                        >
                          {group.badge}
                        </Badge>
                      )}
                    </Link>
                  </NavPrimitive.Link>
                )}
              </NavPrimitive.Item>
            ))}
          </NavPrimitive.List>
          <div className="absolute top-full left-0 pt-2">
            <NavPrimitive.Viewport className="h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) overflow-hidden rounded-md border border-line bg-surface shadow-overlay transition-[width,height] duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          </div>
        </NavPrimitive.Root>

        <div className="ml-auto flex items-center gap-2">
          {status === 'loading' ? (
            <div
              className="h-10 w-36"
              aria-hidden
            />
          ) : session ? (
            <>
              <Button
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href={appPath(trackId, 'bimboard')}>Ke dashboard</Link>
              </Button>
              <UserMenu
                user={session.user}
                trackId={trackId}
              />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={openLogin}
              >
                Masuk
              </Button>
              <Button
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href="/price">Lihat program</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        onLogin={openLogin}
        session={session}
        trackId={trackId}
      />
    </header>
  );
}

const navItemClassName =
  'text-ink-muted hover:text-ink data-[active]:text-ink focus-visible:ring-brand inline-flex h-9 items-center gap-1.5 rounded-sm px-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none data-[state=open]:text-ink';

function NavDropdown({
  group,
  active,
}: {
  group: SiteNavGroup;
  active: boolean;
}) {
  const wide = (group.sections?.length ?? 0) > 1;
  return (
    <>
      <NavPrimitive.Trigger
        data-active={active || undefined}
        className={cn(navItemClassName, 'group')}
      >
        {group.label}
        <ChevronDown
          className="size-3.5 transition-transform duration-150 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </NavPrimitive.Trigger>
      <NavPrimitive.Content
        className={cn(
          'grid gap-6 p-5',
          wide ? 'w-[34rem] grid-cols-2' : 'w-64 grid-cols-1',
        )}
      >
        {group.sections!.map((section) => (
          <div
            key={section.title}
            className="flex flex-col gap-1"
          >
            <p className="px-2 pb-1 text-xs font-semibold text-ink-muted">
              {section.title}
            </p>
            {section.links.map((link) => (
              <NavPrimitive.Link
                key={link.href}
                asChild
              >
                <Link
                  href={link.href}
                  className="flex flex-col gap-0.5 rounded-sm px-2 py-2 hover:bg-paper focus-visible:bg-paper focus-visible:outline-none"
                >
                  <span className="text-sm font-semibold text-ink">
                    {link.label}
                  </span>
                  {link.description && (
                    <span className="text-sm leading-snug text-ink-muted">
                      {link.description}
                    </span>
                  )}
                </Link>
              </NavPrimitive.Link>
            ))}
          </div>
        ))}
      </NavPrimitive.Content>
    </>
  );
}
