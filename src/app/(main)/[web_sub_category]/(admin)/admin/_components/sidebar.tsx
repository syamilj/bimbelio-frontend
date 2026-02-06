'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  Sidebar as SidebarUI,
} from '@/components/ui/sidebar';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import {
  ChevronsLeft,
  ChevronsRight,
  Crown,
  LogOut,
  Settings,
  Shield,
  X,
} from 'lucide-react';
import { Dispatch, Fragment, SetStateAction } from 'react';
import SidebarRoute from './sidebar-route';

interface SidebarProps {
  isMobileSidebarOpen?: boolean;
  setIsMobileSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({
  isMobileSidebarOpen = false,
  setIsMobileSidebarOpen,
}: SidebarProps = {}) => {
  const { minimizeSidebar, setMinimizeSidebar } = useAppContext();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <Fragment>
      {/* Desktop Sidebar */}
      <SidebarUI
        variant="floating"
        collapsible="icon"
        className="hidden md:flex z-[50] rounded-3xl [&_[data-sidebar=sidebar]]:overflow-visible"
        style={
          {
            '--sidebar-width': '18rem',
            '--sidebar-width-icon': '4.5rem',
          } as React.CSSProperties
        }
      >
        {/* Header Section */}
        <SidebarHeader className="h-16 flex items-center justify-center pt-2 rounded-3xl">
          <div
            className={cn(
              'flex items-center justify-between gap-2 w-full px-2',
              minimizeSidebar && 'justify-center',
            )}
          >
            {!minimizeSidebar && (
              <Logo href={`/${website_sub_category_id}/admin`} />
            )}
            <button
              onClick={() => setMinimizeSidebar(!minimizeSidebar)}
              className="flex items-center justify-center h-9 w-9 rounded-3xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-95"
            >
              {minimizeSidebar ? (
                <ChevronsRight className="w-5 h-5" />
              ) : (
                <ChevronsLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="flex flex-col gap-0 overflow-x-visible">
          {/* Admin Badge */}
          {!minimizeSidebar && (
            <div className="px-3 pt-2 pb-1">
              <div
                className="flex items-center gap-3 p-3 rounded-3xl shadow-sm border border-slate-100"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <div className="w-10 h-10 rounded-3xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm">
                    Admin Panel
                  </div>
                  <div className="text-white/80 text-xs">Dashboard Kontrol</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Routes */}
          <div className="flex-1 px-2 pt-1 pb-4">
            <SidebarRoute minimizeSidebar={minimizeSidebar} />
          </div>
        </SidebarContent>

        {/* User Section */}
        <SidebarFooter className="pt-2 pb-4">
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
                src={session?.user?.image || '/placeholder.svg'}
                alt={session?.user?.name || 'Admin'}
              />
              <AvatarFallback
                className="text-white font-black"
                style={{ backgroundColor: mainColor }}
              >
                {session?.user?.name
                  ? session?.user.name[0].toUpperCase()
                  : 'A'}
              </AvatarFallback>
            </Avatar>
            {!minimizeSidebar && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">
                    {session?.user?.name || 'Admin'}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <Crown className="w-3 h-3 text-yellow-500" />
                    <span className="text-gray-500 font-medium">
                      Administrator
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-3xl hover:bg-slate-200"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="h-8 w-8 rounded-3xl hover:bg-red-50 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </SidebarFooter>
      </SidebarUI>

      {/* Mobile Sidebar */}
      <Sheet
        open={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
      >
        <SheetContent
          side="left"
          className="w-[285px] p-0 border-r-2 border-slate-200/50"
        >
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <div className="flex h-full flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50/50">
              <Logo href={`/${website_sub_category_id}/admin`} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileSidebarOpen?.(false)}
                className="h-8 w-8 rounded-xl hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Admin Badge */}
            <div className="px-4 pt-4 pb-2">
              <div
                className="flex items-center gap-3 p-3 rounded-3xl shadow-sm border border-slate-100"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <div className="w-10 h-10 rounded-3xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm">
                    Admin Panel
                  </div>
                  <div className="text-white/80 text-xs">Dashboard Kontrol</div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 px-2 pt-2 pb-4 overflow-y-auto">
              <SidebarRoute minimizeSidebar={false} />
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  className="h-10 w-10 border-2"
                  style={{ borderColor: mainColor }}
                >
                  <AvatarImage
                    src={session?.user?.image || '/placeholder.svg'}
                    alt={session?.user?.name || 'Admin'}
                  />
                  <AvatarFallback
                    className="text-white font-black"
                    style={{ backgroundColor: mainColor }}
                  >
                    {session?.user?.name
                      ? session?.user.name[0].toUpperCase()
                      : 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">
                    {session?.user?.name || 'Admin'}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <Crown className="w-3 h-3 text-yellow-500" />
                    <span className="text-gray-500 font-medium">
                      Administrator
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-3xl"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex-1 rounded-3xl text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default Sidebar;
