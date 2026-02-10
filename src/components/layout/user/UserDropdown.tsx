'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { useUserLimitation } from '@/components/provider/provider-limitation';
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
import {
  Brain,
  ChevronDown,
  Crown,
  Eye,
  FileText,
  LayoutDashboardIcon,
  MessageSquare,
  Settings,
  Trophy,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { LimitationItem } from './LimitationDisplay';
import type { LimitationItemData } from './layout-user-types';

// ─── Build limitations array ────────────────────────────────────

function useLimitations(): LimitationItemData[] {
  const { userLimitation } = useUserLimitation();
  return [
    {
      icon: MessageSquare,
      label: 'Chat',
      remaining: Math.max(
        0,
        (userLimitation?.chatLimit || 0) - (userLimitation?.chat || 0),
      ),
      total: userLimitation?.chatLimit || 0,
      color: '#10b981',
    },
    {
      icon: Eye,
      label: 'Vision',
      remaining: Math.max(
        0,
        (userLimitation?.visionLimit || 0) - (userLimitation?.vision || 0),
      ),
      total: userLimitation?.visionLimit || 0,
      color: '#06b6d4',
    },
    {
      icon: FileText,
      label: 'Notes',
      remaining: Math.max(
        0,
        (userLimitation?.notesLimit || 0) - (userLimitation?.notes || 0),
      ),
      total: userLimitation?.notesLimit || 0,
      color: '#f59e0b',
    },
    {
      icon: Brain,
      label: 'Quiz',
      remaining: Math.max(
        0,
        (userLimitation?.quizLimit || 0) - (userLimitation?.quiz || 0),
      ),
      total: userLimitation?.quizLimit || 0,
      color: '#8b5cf6',
    },
    {
      icon: Trophy,
      label: 'Tryout',
      remaining: Math.max(
        0,
        (userLimitation?.tryoutLimit || 0) - (userLimitation?.tryout || 0),
      ),
      total: userLimitation?.tryoutLimit || 0,
      color: '#ef4444',
    },
  ];
}

// ─── UserDropdown ───────────────────────────────────────────────

export function UserDropdown({ isMobile }: { isMobile: boolean }) {
  const { data: userSession } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { setTransactionPopUp, setPagesSetting } = useAppContext();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  const userTier = userSession?.user.tier;
  const limitations = useLimitations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2.5 h-10 px-2 pr-3 rounded-3xl hover:bg-gray-50 transition-all duration-200 shrink-0 border border-gray-100"
        >
          <Avatar className="w-7 h-7 ring-2 ring-offset-1 ring-gray-100">
            <AvatarImage
              src={userSession?.user.image || '/placeholder.svg'}
              alt={userSession?.user.name || 'User'}
            />
            <AvatarFallback
              className="text-white font-bold text-xs"
              style={{ backgroundColor: mainColor }}
            >
              {userSession?.user.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isMobile && (
            <>
              <span className="text-sm font-semibold text-gray-700 max-w-24 truncate">
                {userSession?.user.name?.split(' ')[0]}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <div className="px-3 py-2 border-b">
          <p className="text-sm font-medium">{userSession?.user.name}</p>
          <p className="text-xs text-gray-500">{userSession?.user.email}</p>
        </div>

        {/* Mobile Limitations with Countdown Format */}
        {isMobile && (
          <>
            <div className="px-3 py-2 space-y-2">
              <Link
                href={`/${website_sub_category_id_params}/user/subscription`}
                className="md:hidden"
              >
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-3xl text-white text-sm font-bold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <Crown className="w-4 h-4" />
                  <span>Premium</span>
                </div>
              </Link>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Sisa Penggunaan
              </p>
              <div className="space-y-1">
                {limitations.map((limitation, index) => (
                  <LimitationItem
                    key={index}
                    icon={limitation.icon}
                    label={limitation.label}
                    remaining={limitation.remaining}
                    total={limitation.total}
                    color={limitation.color}
                  />
                ))}
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {(userSession?.user.role === 'ADMIN' ||
          userSession?.user.role === 'SUPER_ADMIN' ||
          userSession?.user.role === 'FINANCE') && (
          <Link href={`/${website_sub_category_id_params}/admin`}>
            <DropdownMenuItem>
              <LayoutDashboardIcon className="w-4 h-4 mr-2" />
              Admin Panel
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem
          onClick={() => {
            setPagesSetting('account');
          }}
        >
          <User className="w-4 h-4 mr-2" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setPagesSetting('account');
          }}
        >
          <Settings className="w-4 h-4 mr-2" />
          Pengaturan
        </DropdownMenuItem>
        {!userTier && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTransactionPopUp(true)}>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Premium
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => {
            signOut({ callbackUrl: '/' });
          }}
        >
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
