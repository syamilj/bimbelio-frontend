// import { useAppContext } from "@/components/provider/provider-app";
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut } from 'lucide-react';
// import { User } from "next-auth";
// import { signOut } from "next-auth/react";
import Link from 'next/link';
import { useState } from 'react';

type User = any;

interface UserAccountNavProps {
  user: Pick<User, 'name' | 'image' | 'email'>;
  compact?: boolean; // For compact mode in combined button
}

const UserAccountNav = ({ user, compact = false }: UserAccountNavProps) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'relative overflow-hidden p-0 transition-all duration-300',
            compact
              ? 'h-7 w-7 rounded-none hover:brightness-110 ring-0 hover:ring-0 focus:ring-0'
              : 'h-10 w-10 rounded-full ring-2 hover:ring-4 hover:shadow-lg focus:ring-4',
          )}
          style={
            compact
              ? {
                  backgroundColor: 'transparent',
                }
              : ({
                  '--tw-ring-color': `${mainColor}30`,
                  backgroundColor: `${mainColor}05`,
                } as React.CSSProperties)
          }
        >
          <motion.div
            animate={
              isOpen ? { scale: 0.9, rotate: 5 } : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.2, type: 'spring' }}
            className="relative"
          >
            <Avatar className={compact ? 'h-7 w-7' : 'h-10 w-10'}>
              <AvatarImage
                src={user.image || ''}
                alt={user.name || ''}
                className="object-cover"
              />
              <AvatarFallback
                className={cn(
                  'text-white font-bold shadow-inner',
                  compact ? 'text-xs' : 'text-sm',
                )}
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator - hide in compact mode */}
            {!compact && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </motion.div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 p-0 border-2 shadow-2xl rounded-3xl overflow-hidden"
        align="end"
        forceMount
        sideOffset={16}
        style={{
          borderColor: `${mainColor}20`,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, type: 'spring' }}
        >
          {/* Header with gradient */}
          <div
            className="p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
            }}
          >
            {/* Decorative elements */}
            <div
              className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10"
              style={{ backgroundColor: mainColor }}
            />
            <div
              className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full opacity-15"
              style={{ backgroundColor: secondaryColor }}
            />

            <div className="relative z-10 flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-14 w-14 ring-3 ring-white shadow-lg">
                  <AvatarImage
                    src={user.image ?? ''}
                    alt={user.name ?? ''}
                  />
                  <AvatarFallback
                    className="text-white text-lg font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-base font-bold leading-none text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-600 truncate mt-1.5">
                  {user.email}
                </p>
                <div className="mt-2">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: mainColor }}
                  >
                    ● Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="p-2">
          {/* Navigation Items */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <DropdownMenuItem
              asChild
              className="cursor-pointer p-0 mb-2"
            >
              <Link
                href={`/${website_sub_category_id}/user/dashboard`}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 hover:shadow-md group"
                style={
                  {
                    backgroundColor: 'transparent',
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor =
                    `${mainColor}08`;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor =
                    'transparent';
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <LayoutDashboard
                    className="h-5 w-5"
                    style={{ color: mainColor }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    Dashboard
                  </p>
                  <p className="text-xs text-gray-500">Akses panel utama</p>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </DropdownMenuItem>
          </motion.div>

          {(session?.user?.role == 'ADMIN' ||
            session?.user?.role == 'SUPER_ADMIN') && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              <DropdownMenuItem
                asChild
                className="cursor-pointer p-0 mb-2"
              >
                <Link
                  href={`/${website_sub_category_id}/admin`}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 hover:shadow-md group"
                  style={
                    {
                      backgroundColor: 'transparent',
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor =
                      `${mainColor}08`;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor =
                      'transparent';
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <LayoutDashboard
                      className="h-5 w-5"
                      style={{ color: mainColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Admin Panel
                    </p>
                    <p className="text-xs text-gray-500">Kelola sistem</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              </DropdownMenuItem>
            </motion.div>
          )}

          {/* Divider */}
          <div className="my-2 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-700 p-0"
              onSelect={(event) => {
                event.preventDefault();
                signOut({ callbackUrl: '/' });
              }}
            >
              <div className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-red-50 hover:shadow-md group">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-700">Keluar</p>
                  <p className="text-xs text-red-500">Logout dari akun</p>
                </div>
              </div>
            </DropdownMenuItem>
          </motion.div>
        </div>

        {/* Footer accent */}
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
