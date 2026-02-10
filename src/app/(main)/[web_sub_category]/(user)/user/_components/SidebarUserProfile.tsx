'use client';

import { useState } from 'react';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import {
  Coins,
  Crown,
  History,
  LayoutDashboardIcon,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';

interface SidebarUserProfileProps {
  minimizeSidebar: boolean;
  onCloseMobile?: () => void;
}

export function SidebarUserProfile({
  minimizeSidebar,
  onCloseMobile,
}: SidebarUserProfileProps) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    setTransactionPopUp,
    setPagesSetting,
  } = useAppContext();

  const [openMenu, setOpenMenu] = useState(false);

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const userImage = session?.user.image || null;

  const handleMenuAction = (action: () => void) => {
    action();
    onCloseMobile?.();
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-3xl hover:bg-slate-100 transition-colors',
        minimizeSidebar && 'justify-center',
      )}
    >
      <Avatar
        className="h-10 w-10 border-2"
        style={{ borderColor: mainColor }}
      >
        <AvatarImage
          src={userImage || '/placeholder.svg'}
          alt={session?.user.name || 'User'}
        />
        <AvatarFallback
          className="text-white font-black"
          style={{ backgroundColor: mainColor }}
        >
          {session?.user.name ? session?.user.name[0].toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      {!minimizeSidebar && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 truncate">
              {session?.user.name}
            </p>
            <p className="text-xs text-gray-500 truncate font-medium">
              {session?.user.email}
            </p>
          </div>
          <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={onCloseMobile ? 'outline' : 'ghost'}
                size={onCloseMobile ? 'default' : 'icon'}
                className={cn(
                  'rounded-3xl',
                  onCloseMobile
                    ? 'w-full justify-start font-bold border-2'
                    : 'h-8 w-8',
                )}
              >
                <Settings className="w-4 h-4 mr-2" />
                {onCloseMobile && 'Menu'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={onCloseMobile ? 'start' : 'end'}
              className="w-56 border-2 border-gray-100 rounded-3xl shadow-sm"
            >
              {(session?.user.role === 'ADMIN' ||
                session?.user.role === 'SUPER_ADMIN' ||
                session?.user.role === 'FINANCE') && (
                <Link href={`/${website_sub_category_id_params}/admin`}>
                  <DropdownMenuItem>
                    <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuItem
                onClick={() => handleMenuAction(() => setPagesSetting('account'))}
                className="font-bold"
              >
                <User className="w-4 h-4 mr-2" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleMenuAction(() => setPagesSetting('installment'))
                }
              >
                <Coins className="w-4 h-4 mr-2" />
                Cicilan
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleMenuAction(() => setPagesSetting('history'))
                }
                className="font-bold"
              >
                <History className="w-4 h-4 mr-2" />
                Riwayat Pembelian
              </DropdownMenuItem>
              {!session?.user.tier && (
                <>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    onClick={() =>
                      handleMenuAction(() => setTransactionPopUp(true))
                    }
                    className="font-bold"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem
                className="text-red-600 font-bold"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}


