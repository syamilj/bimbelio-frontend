'use client';

import type { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { signOut } from '@/lib/auth-helper';
import { adminPath, appPath } from '@/lib/track';
import {
  LayoutDashboard,
  LogOut,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useContact } from './contact';
import { SITE_NAV } from './site-nav';
import { isStaff, UserAvatar } from './user-menu';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
  session: ReturnType<typeof useSession>['data'];
  trackId: string | null;
};

/** Menu navigasi untuk layar kecil (di bawah lg). */
export function MobileMenu({
  open,
  onOpenChange,
  onLogin,
  session,
  trackId,
}: Props) {
  const { openContact } = useContact();
  const close = () => onOpenChange(false);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="right"
        className="gap-6"
      >
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigasi situs Bimbelio
          </SheetDescription>
        </SheetHeader>

        {session && (
          <div className="flex items-center gap-3 rounded-md border border-line p-3">
            <UserAvatar
              user={session.user}
              className="size-10"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-ink">
                {session.user.name}
              </span>
              <span className="truncate text-xs text-ink-muted">
                {session.user.email}
              </span>
            </div>
          </div>
        )}

        <nav
          aria-label="Navigasi utama"
          className="flex flex-col gap-5"
        >
          {SITE_NAV.map((group) => (
            <div
              key={group.label}
              className="flex flex-col gap-1"
            >
              {group.href ? (
                <Link
                  href={group.href}
                  onClick={close}
                  className="flex items-center gap-2 rounded-sm px-2 py-2 text-base font-bold text-ink hover:bg-paper"
                >
                  {group.label}
                  {group.badge && <Badge variant="highlight">{group.badge}</Badge>}
                </Link>
              ) : (
                <p className="px-2 py-2 text-base font-bold text-ink">
                  {group.label}
                </p>
              )}
              {group.sections?.flatMap((section) =>
                section.links
                  .filter((link) => link.href !== group.href)
                  .map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      className="rounded-sm px-2 py-1.5 text-sm font-medium text-ink-muted hover:bg-paper hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  )),
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              close();
              openContact();
            }}
            className="flex items-center gap-2 rounded-sm px-2 py-2 text-left text-base font-bold text-ink hover:bg-paper"
          >
            <MessageCircle
              className="size-4"
              aria-hidden
            />
            Konsultasi gratis
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          {session ? (
            <>
              <Button asChild>
                <Link
                  href={appPath(trackId, 'bimboard')}
                  onClick={close}
                >
                  <LayoutDashboard />
                  Ke dashboard
                </Link>
              </Button>
              {isStaff(session.user.role) && (
                <Button
                  asChild
                  variant="outline"
                >
                  <Link
                    href={adminPath(trackId)}
                    onClick={close}
                  >
                    <ShieldCheck />
                    Panel admin
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut />
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  close();
                  onLogin();
                }}
              >
                Masuk dengan Google
              </Button>
              <Button
                asChild
                variant="outline"
              >
                <Link
                  href="/price"
                  onClick={close}
                >
                  Lihat program
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
