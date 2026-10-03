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

/** Header situs publik: logo, navigasi, dan aksi akun (brand book hlm. 103). */
export function SiteHeader() {
  const pathname = usePathname();
  const trackId = useTrackId();
  const { status, data: session } = useSession();
  const { useAuth } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const openLogin = () =>
    useAuth.setShowAuth({ open: true, redirect: appPath(trackId, 'bimboard') });

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-16 w-full max-w-[75rem] items-center gap-6 px-5 sm:px-8 lg:h-[4.5rem] lg:gap-10">
        <Link
          href="/"
          aria-label="Bimbelio — beranda"
          className="shrink-0 rounded-sm focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:outline-none"
        >
          <Logo
            title=""
            className="h-7 lg:h-8"
          />
        </Link>

        <NavPrimitive.Root
          className="relative hidden lg:block"
          delayDuration={100}
        >
          <NavPrimitive.List className="flex items-center gap-0.5">
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
                          className="px-2"
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
          <div className="absolute top-full left-0 pt-3">
            <NavPrimitive.Viewport className="h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) overflow-hidden rounded-lg border border-line bg-surface shadow-float transition-[width,height] duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          </div>
        </NavPrimitive.Root>

        <div className="ml-auto flex items-center gap-2">
          {status === 'loading' ? (
            <div
              className="h-11 w-40"
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
                variant="outline"
                size="sm"
                className="sm:h-11 sm:px-5"
                onClick={openLogin}
              >
                Masuk
              </Button>
              <Button
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href="/tryout">Ikut tryout</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 lg:hidden"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-6" />
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

// Item aktif = teks Tinta + bubble terisi kecil di bawahnya (bubble = "dipilih").
const navItemClassName =
  'relative inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none data-[active]:text-ink data-[state=open]:bg-ink/5 data-[state=open]:text-ink after:absolute after:bottom-0 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-brand after:opacity-0 data-[active]:after:opacity-100';

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
          wide ? 'w-[36rem] grid-cols-2' : 'w-72 grid-cols-1',
        )}
      >
        {group.sections!.map((section) => (
          <div
            key={section.title}
            className="flex flex-col gap-1"
          >
            <p className="px-3 pb-1 font-mono text-xs font-medium text-ink-muted lowercase">
              {section.title}
            </p>
            {section.links.map((link) => (
              <NavPrimitive.Link
                key={link.href}
                asChild
              >
                <Link
                  href={link.href}
                  className="flex flex-col gap-0.5 rounded-sm px-3 py-2 hover:bg-paper focus-visible:bg-paper focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
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
