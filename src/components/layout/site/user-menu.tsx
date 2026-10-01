'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth-helper';
import { STAFF_ROLES } from '@/lib/auth/access';
import { adminPath, appPath } from '@/lib/track';
import { LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export type MenuUser = {
  name: string;
  email: string;
  image: string | null;
  role: string;
};

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

export const isStaff = (role: string) =>
  (STAFF_ROLES as readonly string[]).includes(role);

export function UserAvatar({
  user,
  className,
}: {
  user: MenuUser;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      {user.image && (
        <AvatarImage
          src={user.image}
          alt=""
        />
      )}
      <AvatarFallback className="bg-brand-soft text-xs font-bold text-brand-strong">
        {initials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}

/** Menu akun di header publik: dashboard, panel admin (staf), keluar. */
export function UserMenu({
  user,
  trackId,
}: {
  user: MenuUser;
  trackId: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu akun"
        className="rounded-full focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <UserAvatar
          user={user}
          className="size-9"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64"
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
          <span className="truncate text-sm font-semibold text-ink">
            {user.name}
          </span>
          <span className="truncate text-xs text-ink-muted">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={appPath(trackId, 'bimboard')}>
            <LayoutDashboard />
            Dashboard
          </Link>
        </DropdownMenuItem>
        {isStaff(user.role) && (
          <DropdownMenuItem asChild>
            <Link href={adminPath(trackId)}>
              <ShieldCheck />
              Panel admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
