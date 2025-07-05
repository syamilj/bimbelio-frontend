'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronUp,
  Crown,
  FileText,
  Home,
  Lock,
  MessageCircle,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMedia } from 'use-media';

// Data dummy untuk menu sidebar
const navItems = [
  {
    title: 'Dashboard',
    url: (subCategoryId: string) => `/${subCategoryId}/user/dashboard`,
    icon: Home,
    description: 'Overview & Statistics',
  },
  {
    title: 'Belajar',
    url: (subCategoryId: string) => `/${subCategoryId}/user/course`,
    icon: BookOpen,
    badge: 'Soon!',
    isLocked: true,
    description: 'Materi Pembelajaran',
  },
  {
    title: 'Telusuri',
    url: (subCategoryId: string) => `/${subCategoryId}/user/explore`,
    icon: Search,
    badge: 'Soon!',
    isLocked: true,
    description: 'Cari Materi',
    isHighlighted: true,
  },
  {
    title: 'Material',
    url: (subCategoryId: string) => `/${subCategoryId}/user/workspace`, // Base URL for Material
    icon: FileText,
    description: 'Bank Soal',
    isCollapsible: true, // Indicates this item has sub-categories
  },
  {
    title: 'Try Out',
    url: (subCategoryId: string) => `/${subCategoryId}/user/try-out`,
    icon: Trophy,
    description: 'Simulasi Ujian',
    isNew: true,
    isCollapsible: false,
    isLocked: false,
  },
  {
    title: 'Peringkat',
    url: (subCategoryId: string) => `/${subCategoryId}/user/leaderboard`,
    icon: Crown,
    description: 'Leaderboard',
  },
  {
    title: 'Prediksi',
    url: (subCategoryId: string) => `/${subCategoryId}/user/prediction`,
    icon: Calculator,
    description: 'Prediksi Nilai',
    showForCategory: 'simak-ui', // Only show for 'simak-ui'
  },
  {
    title: 'Chat',
    url: (subCategoryId: string) => `/${subCategoryId}/user/chat`,
    icon: MessageCircle,
    badge: 'AI',
    isAI: true,
    description: 'AI Assistant',
    isHighlighted: true,
  },
];

const SidebarRoute = ({
  category,
  minimizeSidebar,
  setMinimizeSidebar,
  categoryColors,
}: any) => {
  const pathname = usePathname();
  const [showMaterialSub, setShowMaterialSub] = useState<boolean>(false);
  const { setSidebarMobile } = useAppContext();

  useEffect(() => {
    if (pathname?.includes('workspace')) {
      setShowMaterialSub(true);
    }
  }, [pathname]);

  const isMobile = useMedia({ maxWidth: '768px' });

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarMobile(false);
    }
  };

  // Extract category colors
  const { mainColor = '#0091FF', secondaryColor = '#5aa4dd' } =
    categoryColors || {};

  return (
    <TooltipProvider>
      <div
        className={cn('flex flex-col gap-1', minimizeSidebar ? 'px-1' : 'px-2')}
      >
        {navItems.map((item) => {
          const isActive = pathname?.includes(
            item.url(website_sub_category_id ?? '').split('/user/')[1],
          );
          const showItem =
            !item.showForCategory ||
            item.showForCategory === website_sub_category_id;

          if (!showItem) return null;

          return (
            <div
              key={item.title}
              className="relative"
            >
              {item.isCollapsible ? (
                // Collapsible Material Section
                <div
                  className={cn(
                    'flex items-center cursor-pointer font-semibold transition-all duration-300 ease-in-out group',
                    minimizeSidebar
                      ? 'justify-center p-2'
                      : 'justify-between mx-1 px-3 py-2.5 rounded-xl',
                    isActive
                      ? minimizeSidebar
                        ? ''
                        : 'text-white shadow-md scale-[1.02]'
                      : minimizeSidebar
                        ? ''
                        : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground',
                  )}
                  style={{
                    backgroundColor:
                      isActive && !minimizeSidebar ? mainColor : 'transparent',
                  }}
                  onClick={() => {
                    if (!minimizeSidebar) {
                      setShowMaterialSub(!showMaterialSub);
                    } else {
                      setShowMaterialSub(true);
                      setMinimizeSidebar(false);
                    }
                  }}
                >
                  {minimizeSidebar ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            'w-10 h-10 rounded-xl text-white shadow-lg transition-all duration-300 p-0 hover:shadow-xl hover:scale-105 flex items-center justify-center',
                            isActive
                              ? ''
                              : 'bg-gray-200 dark:bg-gray-700 text-muted-foreground hover:bg-gray-300 dark:hover:bg-gray-600',
                          )}
                          style={{
                            backgroundColor: isActive ? mainColor : undefined,
                          }}
                        >
                          <item.icon className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div className="text-sm">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-300',
                            isActive
                              ? 'bg-white/20 shadow-lg'
                              : 'bg-transparent',
                          )}
                        >
                          <item.icon
                            className={cn(
                              'w-4 h-4',
                              isActive
                                ? 'text-white'
                                : 'text-muted-foreground group-hover:text-foreground',
                            )}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div
                            className={cn(
                              'font-semibold text-sm',
                              isActive ? 'text-white' : '',
                            )}
                          >
                            {item.title}
                          </div>
                          <div
                            className={cn(
                              'text-xs opacity-80',
                              isActive
                                ? 'text-white/80'
                                : 'text-muted-foreground',
                            )}
                          >
                            {item.description}
                          </div>
                        </div>
                      </div>
                      {showMaterialSub ? (
                        <ChevronUp
                          className={cn(
                            'w-4 h-4',
                            isActive ? 'text-white' : 'text-muted-foreground',
                          )}
                        />
                      ) : (
                        <ChevronDown
                          className={cn(
                            'w-4 h-4',
                            isActive ? 'text-white' : 'text-muted-foreground',
                          )}
                        />
                      )}
                    </>
                  )}
                </div>
              ) : (
                // Regular Menu Item
                <Link
                  href={item.url(website_sub_category_id ?? '')}
                  passHref
                  onClick={handleLinkClick}
                >
                  <div
                    className={cn(
                      'flex items-center cursor-pointer font-semibold transition-all duration-300 ease-in-out group',
                      minimizeSidebar
                        ? 'justify-center p-2'
                        : 'gap-3 mx-1 px-3 py-2.5 rounded-xl',
                      isActive
                        ? minimizeSidebar
                          ? ''
                          : 'text-white shadow-md scale-[1.02]'
                        : item.isHighlighted
                          ? minimizeSidebar
                            ? ''
                            : 'border border-opacity-30 hover:shadow-md'
                          : minimizeSidebar
                            ? ''
                            : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground hover:scale-[1.01]',
                    )}
                    style={{
                      backgroundColor:
                        isActive && !minimizeSidebar
                          ? mainColor
                          : item.isHighlighted && !minimizeSidebar
                            ? `${mainColor}08`
                            : 'transparent',
                      borderColor:
                        item.isHighlighted && !minimizeSidebar
                          ? `${mainColor}30`
                          : 'transparent',
                    }}
                  >
                    {minimizeSidebar ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              'w-10 h-10 rounded-xl shadow-lg transition-all duration-300 p-0 hover:shadow-xl hover:scale-105 flex items-center justify-center',
                              isActive
                                ? 'text-white'
                                : item.isHighlighted
                                  ? 'text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-muted-foreground hover:bg-gray-300 dark:hover:bg-gray-600',
                            )}
                            style={{
                              backgroundColor: isActive
                                ? mainColor
                                : item.isHighlighted
                                  ? `${mainColor}80`
                                  : undefined,
                            }}
                          >
                            <item.icon className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{item.title}</p>
                              {item.badge && (
                                <Badge className="text-xs px-2 py-0.5 rounded-full border-0 font-medium shadow-sm bg-orange-500 text-white">
                                  {item.isAI && (
                                    <Sparkles className="w-3 h-3 mr-1" />
                                  )}
                                  {item.badge}
                                </Badge>
                              )}
                              {item.isNew && (
                                <div
                                  className="w-2 h-2 rounded-full animate-pulse"
                                  style={{ backgroundColor: mainColor }}
                                />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                            {item.isLocked && (
                              <p className="text-xs text-red-400 mt-1">
                                🔒 Coming Soon
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <>
                        <div
                          className={cn(
                            'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300',
                            isActive
                              ? 'bg-white/20 shadow-lg'
                              : item.isHighlighted
                                ? 'shadow-sm'
                                : 'bg-transparent group-hover:bg-accent/50',
                          )}
                          style={{
                            backgroundColor:
                              item.isHighlighted && !isActive
                                ? `${mainColor}20`
                                : isActive
                                  ? 'rgba(255,255,255,0.2)'
                                  : 'transparent',
                          }}
                        >
                          <item.icon
                            className={cn(
                              'w-4 h-4 transition-transform duration-300 group-hover:scale-110',
                              isActive
                                ? 'text-white'
                                : item.isHighlighted
                                  ? ''
                                  : 'text-muted-foreground group-hover:text-foreground',
                            )}
                            style={{
                              color:
                                item.isHighlighted && !isActive
                                  ? mainColor
                                  : undefined,
                            }}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div
                            className={cn(
                              'font-semibold text-sm',
                              isActive ? 'text-white' : '',
                            )}
                          >
                            {item.title}
                          </div>
                          <div
                            className={cn(
                              'text-xs opacity-80',
                              isActive
                                ? 'text-white/80'
                                : 'text-muted-foreground',
                            )}
                          >
                            {item.description}
                          </div>
                        </div>
                        {/* Badges and indicators */}
                        <div className="flex items-center gap-1">
                          {item.isNew && (
                            <div
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ backgroundColor: mainColor }}
                            />
                          )}
                          {item.badge && (
                            <Badge className="text-xs px-2 py-0.5 rounded-full border-0 font-medium shadow-sm bg-orange-500 text-white">
                              {item.isAI && (
                                <Sparkles className="w-3 h-3 mr-1" />
                              )}
                              {item.badge}
                            </Badge>
                          )}
                          {item.isLocked && (
                            <Lock className="w-3 h-3 text-muted-foreground/60" />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </Link>
              )}

              {/* Sub-items for Material */}
              {item.isCollapsible && showMaterialSub && !minimizeSidebar && (
                <div className="mt-1 flex w-full flex-col items-end gap-1">
                  {category?.map((subItem: any) => (
                    <Link
                      key={subItem.id}
                      href={`/${website_sub_category_id}/user/workspace/${subItem.id}`}
                      className={cn(
                        'ml-12 mr-1 flex cursor-pointer items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 w-[calc(100%-3rem)]',
                        pathname?.includes(`workspace/${subItem.id}`)
                          ? 'text-white shadow-sm'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                      )}
                      style={{
                        backgroundColor: pathname?.includes(
                          `workspace/${subItem.id}`,
                        )
                          ? `${mainColor}cc`
                          : 'transparent',
                      }}
                      onClick={handleLinkClick}
                    >
                      <ArrowRight className="w-3 h-3" />
                      <p className="capitalize">{subItem.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default SidebarRoute;
