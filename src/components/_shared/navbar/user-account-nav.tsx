// import { useAppContext } from "@/components/provider/provider-app";
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
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut } from 'lucide-react';
// import { User } from "next-auth";
// import { signOut } from "next-auth/react";
import Link from 'next/link';
import { useState } from 'react';

type User = any;

interface UserAccountNavProps {
  user: Pick<User, 'name' | 'image' | 'email'>;
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {
  const { data: session } = useSession();
  // const { setTransactionHistory } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const { websiteSubCategory } = useWebsiteSubCategory();

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-main/50 ring-offset-2 ring-offset-background transition-all hover:ring-4 focus:ring-4"
        >
          <motion.div
            animate={isOpen ? { scale: 0.9 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.image || ''}
                alt={user.name || ''}
              />
              <AvatarFallback className="text-main-foreground bg-gradient-to-br from-main to-secondary text-sm font-bold">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 p-2"
        align="end"
        forceMount
        sideOffset={8}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-2 flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8 ring-1 ring-main/90">
              <AvatarImage
                src={user.image ?? ''}
                alt={user.name ?? ''}
              />
              <AvatarFallback className="text-main-foreground bg-gradient-to-br from-main to-secondary text-sm font-bold">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold leading-none">{user.name}</p>
              <p className="max-w-[160px] truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </motion.div>
        <DropdownMenuSeparator />
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <DropdownMenuItem
            asChild
            className="cursor-pointer"
          >
            <Link
              href={`/${website_sub_category_id}/user/try-out`}
              className="flex items-center gap-2 rounded-xl px-1 py-1.5 transition-colors hover:bg-main/10"
            >
              <LayoutDashboard className="h-4 w-4 text-main" />
              <span className="text-sm">Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </motion.div>
        {session?.user?.role == 'ADMIN' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <DropdownMenuItem
              asChild
              className="cursor-pointer"
            >
              <Link
                href={`/${website_sub_category_id}/admin`}
                className="flex items-center gap-2 rounded-xl px-1 py-1.5 transition-colors hover:bg-main/10"
              >
                <LayoutDashboard className="h-4 w-4 text-main" />
                <span className="text-sm">Admin</span>
              </Link>
            </DropdownMenuItem>
          </motion.div>
        )}
        {/* <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          onClick={() => {
            setTransactionHistory(true);
          }}
        >
          <DropdownMenuItem asChild className="cursor-pointer">
            <div className="flex items-center gap-2 rounded-xl px-1 py-1.5 transition-colors hover:bg-main/10">
              <Settings className="h-4 w-4 text-main" />
              <span className="text-sm">Setting</span>
            </div>
          </DropdownMenuItem>
        </motion.div> */}

        <DropdownMenuSeparator />
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={(event) => {
              event.preventDefault();
              signOut({ callbackUrl: '/' });
            }}
          >
            <div className="flex w-full items-center gap-2 rounded-xl px-1 py-1 transition-colors hover:bg-destructive/5">
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Keluar</span>
            </div>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
