'use client';

import { isStaff, UserAvatar } from '@/components/layout/site/user-menu';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth-helper';
import { adminPath, useTrackId } from '@/lib/track';
import {
  CreditCard,
  History,
  LogOut,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';

/** Menu akun siswa: pengaturan profil, langganan, panel admin, keluar. */
export function AccountMenu() {
  const { data: session } = useSession();
  const { setPagesSetting, openUpgrade } = useAppContext();
  const trackId = useTrackId();
  if (!session) return null;
  const { user } = session;

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
        <DropdownMenuItem onSelect={() => setPagesSetting('account')}>
          <UserRound />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setPagesSetting('target')}>
          <Target />
          Target kampus
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setPagesSetting('installment')}>
          <CreditCard />
          Cicilan
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setPagesSetting('history')}>
          <History />
          Riwayat pembelian
        </DropdownMenuItem>
        {!user.tier && (
          <DropdownMenuItem onSelect={openUpgrade}>
            <Sparkles />
            Lihat paket belajar
          </DropdownMenuItem>
        )}
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
