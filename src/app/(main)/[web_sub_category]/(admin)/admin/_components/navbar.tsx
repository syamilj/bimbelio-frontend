'use client';

import Link from 'next/link';

import UserAccountNav from '@/components/_shared/navbar/user-account-nav';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Bell, Menu, Settings, Shield } from 'lucide-react';
import NextBreadcrumb from './next-breadcrumb';

export default function Navbar() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { minimizeSidebar, setSidebarMobile } = useAppContext();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  return (
    <nav
      className={cn(
        'fixed left-2 md:left-0 right-2 md:right-2 top-2 z-40 h-14 md:h-16 bg-white/95 backdrop-blur-lg border rounded-3xl border-gray-200 shadow-sm transition-all duration-300',
        !minimizeSidebar ? 'md:left-[18rem]' : 'md:left-[6rem]'
      )}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarMobile(true)}
            className="md:hidden h-9 w-9 rounded-3xl hover:bg-slate-100 flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop Admin Panel Info */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-2xl"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Shield className="w-4 h-4" style={{ color: mainColor }} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-600">Admin Panel</span>
            </div>
          </div>

          {/* Breadcrumb - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2 flex-1 min-w-0">
            <Separator orientation="vertical" className="h-5" />
            <NextBreadcrumb />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-3xl hover:bg-slate-100"
            >
              <Bell className="w-4 h-4 text-slate-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-3xl hover:bg-slate-100"
            >
              <Settings className="w-4 h-4 text-slate-600" />
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden md:block h-5" />

          {/* User Account */}
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <Button asChild size="sm">
              <Link href="/auth/login">Masuk</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
