// src/app/(user)/layout.tsx (SERVER layout)
import LayoutUserClient from '@/components/layout/layoutUser';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Belajar',
  description: 'Siswa belajar di Bimbelio',
  openGraph: {
    title: 'Belajar',
    description: 'Siswa belajar di Bimbelio',
  },
};

export default function LayoutUser({ children }: { children: ReactNode }) {
  return (
    <div className={cn('min-h-screen bg-gray-50 font-sans antialiased')}>
      <TooltipProvider>
        <LayoutUserClient>{children}</LayoutUserClient>
        {/* <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="w-full">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider> */}
      </TooltipProvider>
    </div>
  );
}

// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];
