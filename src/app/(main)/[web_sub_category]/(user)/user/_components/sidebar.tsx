'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { DialogWebCategory } from '@/components/ui/choose-web-category/dialog-web-category';
import Logo from '@/components/ui/logo';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  Sidebar as SidebarUI,
} from '@/components/ui/sidebar';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import SidebarRoute from './sidebar-route';
import { SidebarUpgradeButton } from './SidebarUpgradeButton';
import { SidebarUserProfile } from './SidebarUserProfile';
import { WebCategorySelector } from './WebCategorySelector';

// Main Sidebar Component
const SidebarUser = ({
  category,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}: {
  category: any;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();
  const [isWebCategoryDialogOpen, setIsWebCategoryDialogOpen] = useState(false);
  const {
    minimizeSidebar,
    setMinimizeSidebar,
    transactionPopUp,
    pagesSetting,
  } = useAppContext();

  // Handle body overflow based on pop-ups
  useEffect(() => {
    if (transactionPopUp || pagesSetting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [transactionPopUp, pagesSetting]);

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  const closeMobile = () => setIsMobileSidebarOpen(false);

  return (
    <Fragment>
      {/* ── Desktop Sidebar ── */}
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
        <SidebarHeader className="h-16 flex items-center justify-center pt-2 rounded-3xl">
          <div
            className={cn(
              'flex items-center justify-between gap-2 w-full px-2',
              minimizeSidebar && 'justify-center',
            )}
          >
            {!minimizeSidebar && (
              <Logo href={`/${website_sub_category_id}/user/bimboard`} />
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

        <SidebarContent className="flex flex-col gap-0 overflow-x-visible">
          {!minimizeSidebar && (
            <div className="px-3 pt-2 pb-1">
              <WebCategorySelector
                onClick={() => setIsWebCategoryDialogOpen(true)}
              />
            </div>
          )}
          <div className="flex-1 px-2 pt-1 pb-4">
            <SidebarRoute
              category={category}
              minimizeSidebar={minimizeSidebar}
              setMinimizeSidebar={setMinimizeSidebar}
              categoryColors={{ mainColor, secondaryColor }}
            />
          </div>
        </SidebarContent>

        <SidebarFooter className="pt-2 pb-4">
          {!session?.user.tier && minimizeSidebar && (
            <SidebarUpgradeButton iconOnly />
          )}
          {!session?.user.tier && !minimizeSidebar && (
            <SidebarUpgradeButton />
          )}
          <SidebarUserProfile minimizeSidebar={minimizeSidebar} />
        </SidebarFooter>
        <SidebarRail />
      </SidebarUI>

      {/* ── Mobile Sidebar ── */}
      <Sheet
        open={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
      >
        <SheetContent
          side="left"
          className="w-80 bg-white backdrop-blur-xl border-r border-slate-200/60"
        >
          <SheetTitle className="sr-only">Menu Mobile</SheetTitle>
          <div className="flex flex-col h-full gap-0">
            <div className="pb-4 border-b-2 border-slate-200/50">
              <Logo href={`/${website_sub_category_id}/user/bimboard`} />
            </div>

            {websiteSubCategory && (
              <div className="px-3 py-4">
                <WebCategorySelector
                  compact
                  onClick={() => {
                    setIsWebCategoryDialogOpen(true);
                    closeMobile();
                  }}
                />
              </div>
            )}

            <div className="flex-1 px-2 py-4 overflow-y-auto">
              <SidebarRoute
                category={category}
                minimizeSidebar={false}
                setMinimizeSidebar={setMinimizeSidebar}
                categoryColors={{ mainColor, secondaryColor }}
              />
            </div>

            {!session?.user.tier && (
              <SidebarUpgradeButton onCloseMobile={closeMobile} />
            )}

            <div className="border-t-2 border-slate-200/50 p-4">
              <SidebarUserProfile
                minimizeSidebar={false}
                onCloseMobile={closeMobile}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Web Category Dialog ── */}
      <DialogWebCategory
        items={webCategoryData}
        value={websiteSubCategory?.id}
        isOpen={isWebCategoryDialogOpen}
        onOpenChange={setIsWebCategoryDialogOpen}
        onSelect={(item) => {
          localStorage.setItem('website_sub_category_id', item?.id);
          const pathname = window.location.pathname;
          const pathnameArray = pathname.split('/');
          let newPathname = '';
          pathnameArray.forEach((pItem, index) => {
            if (index > 1) {
              newPathname += `/${pItem}`;
            }
          });
          window.location.pathname = `/${item.id}${newPathname}`;
          setIsWebCategoryDialogOpen(false);
        }}
      />
    </Fragment>
  );
};

export default SidebarUser;
