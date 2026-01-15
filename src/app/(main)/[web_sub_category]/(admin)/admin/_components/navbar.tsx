'use client';

import Link from 'next/link';

import UserAccountNav from '@/components/_shared/navbar/user-account-nav';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, Settings, Shield } from 'lucide-react';
import NextBreadcrumb from './next-breadcrumb';

export default function Navbar() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  return (
    <div className="flex h-full items-center justify-between border-b bg-white/95 backdrop-blur-lg p-4 pr-6 shadow-sm border-gray-200">
      {/* Left Section - Breadcrumb */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <NextBreadcrumb />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Admin Badge */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-3xl text-white text-sm font-semibold shadow-sm"
          style={{ backgroundColor: mainColor }}
        >
          <Shield className="w-4 h-4" />
          <span>Admin Panel</span>
        </div>

        <Separator
          orientation="vertical"
          className="h-6"
        />

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-3xl hover:bg-gray-100"
          >
            <Bell className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-3xl hover:bg-gray-100"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        <Separator
          orientation="vertical"
          className="h-6"
        />

        {/* User Account */}
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Button asChild>
            <Link href="/auth/login">Masuk</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
