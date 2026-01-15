'use client';

import LogoMinimize from '@/_assets/logo-minimize.png';
import test from '@/_assets/logo.png';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { Separator } from '@/components/ui/separator';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  LogOut,
  Settings,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import SidebarRoute from './sidebar-route';

const Sidebar = () => {
  const { minimizeSidebar, setMinimizeSidebar } = useAppContext();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="flex h-full flex-col bg-white shadow-2xl border-r border-gray-100 relative">
      {/* Header Section */}
      <div
        className={cn(
          'relative overflow-hidden border-b border-gray-100 transition-all duration-300',
          !minimizeSidebar ? 'p-6' : 'p-4',
        )}
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div className="relative z-10">
          {!minimizeSidebar ? (
            <div className="flex items-center justify-between">
              <Logo href={`/${website_sub_category_id}/admin`} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMinimizeSidebar(true)}
                className="w-8 h-8 rounded-3xl hover:bg-white/50 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMinimizeSidebar(false)}
                className="w-10 h-10 rounded-3xl hover:bg-white/50 transition-all duration-200 mb-3"
              >
                <Image
                  src={LogoMinimize}
                  alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
                  className="w-6 h-6"
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMinimizeSidebar(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/50 transition-all duration-200"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div
          className="absolute -right-4 -top-4 w-12 h-12 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute -left-2 -bottom-2 w-8 h-8 rounded-full opacity-10"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      {/* Admin Badge */}
      {!minimizeSidebar && (
        <div className="px-6 py-4">
          <div
            className="flex items-center gap-3 p-4 rounded-3xl shadow-sm border border-gray-100"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <div className="w-10 h-10 rounded-3xl bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm">Admin Panel</div>
              <div className="text-white/80 text-xs">Dashboard Kontrol</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div
        className={cn(
          'flex-1 overflow-y-auto scrollbar-hide',
          !minimizeSidebar ? 'px-3' : 'px-2',
        )}
      >
        <div className="py-4">
          <SidebarRoute />
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        {!minimizeSidebar ? (
          <div className="p-4 space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <Avatar className="w-10 h-10 ring-2 ring-offset-2 ring-gray-200">
                <AvatarImage
                  src={session?.user?.image || test.src}
                  alt={session?.user?.name || 'Admin'}
                />
                <AvatarFallback
                  className="text-white font-bold"
                  style={{ backgroundColor: mainColor }}
                >
                  {session?.user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {session?.user?.name || 'Admin'}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Crown className="w-3 h-3 text-yellow-500" />
                  <span className="text-gray-500">Administrator</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-3xl border-gray-200 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex-1 rounded-3xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-2 flex flex-col items-center gap-2">
            {/* Minimized User Avatar */}
            <Avatar className="w-8 h-8 ring-2 ring-offset-1 ring-gray-200">
              <AvatarImage
                src={session?.user?.image || test.src}
                alt={session?.user?.name || 'Admin'}
              />
              <AvatarFallback
                className="text-white font-bold text-xs"
                style={{ backgroundColor: mainColor }}
              >
                {session?.user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>

            <Separator className="w-6" />

            {/* Minimized Action Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-lg hover:bg-gray-100"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Hover Expansion Trigger for Minimized Sidebar */}
      {minimizeSidebar && (
        <div
          className="absolute right-0 top-0 w-4 h-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
          onMouseEnter={() => setMinimizeSidebar(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
