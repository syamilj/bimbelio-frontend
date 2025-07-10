'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { Badge } from '@/components/ui/badge';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Crown,
  FileText,
  Home,
  Lock,
  MessageCircle,
  Search,
  TrendingUp,
  Trophy,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMedia } from 'use-media';

// Enhanced menu data with better icons and descriptions
const navItems = [
  {
    title: 'Dashboard',
    url: (subCategoryId: string) => `/${subCategoryId}/user/dashboard`,
    icon: Home,
    description: 'Overview & Analytics',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    title: 'Belajar',
    url: (subCategoryId: string) => `/${subCategoryId}/user/course`,
    icon: BookOpen,
    badge: 'Soon!',
    isLocked: true,
    description: 'Materi Pembelajaran',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Telusuri',
    url: (subCategoryId: string) => `/${subCategoryId}/user/explore`,
    icon: Search,
    badge: 'Soon!',
    isLocked: true,
    description: 'Cari Materi',
    isHighlighted: true,
    gradient: 'from-orange-500 to-red-600',
  },
  {
    title: 'Material',
    url: (subCategoryId: string) => `/${subCategoryId}/user/workspace`,
    icon: FileText,
    description: 'Bank Soal & Materi',
    isCollapsible: true,
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    title: 'Try Out',
    url: (subCategoryId: string) => `/${subCategoryId}/user/try-out`,
    icon: Trophy,
    description: 'Simulasi Ujian',
    isNew: true,
    isCollapsible: false,
    isLocked: false,
    gradient: 'from-yellow-500 to-orange-600',
  },
  {
    title: 'Live Class',
    url: (subCategoryId: string) => `/${subCategoryId}/user/live-class`,
    icon: Video,
    description: 'Kelas Langsung',
    isNew: true,
    isCollapsible: false,
    isLocked: false,
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    title: 'Peringkat',
    url: (subCategoryId: string) => `/${subCategoryId}/user/leaderboard`,
    icon: Crown,
    description: 'Leaderboard Global',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Prediksi',
    url: (subCategoryId: string) => `/${subCategoryId}/user/prediction`,
    icon: TrendingUp,
    description: 'Prediksi Nilai AI',
    showForCategory: 'simak-ui',
    isAI: true,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Chat',
    url: (subCategoryId: string) => `/${subCategoryId}/user/chat`,
    icon: MessageCircle,
    badge: 'AI',
    isAI: true,
    description: 'AI Assistant',
    isHighlighted: true,
    gradient: 'from-green-500 to-emerald-600',
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
    <div
      className={cn('flex flex-col gap-2', minimizeSidebar ? 'px-2' : 'px-3')}
    >
      {navItems.map((item, index) => {
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
            className="relative group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {item.isCollapsible ? (
              // Enhanced Collapsible Material Section
              <div
                className={cn(
                  'flex items-center cursor-pointer font-semibold transition-all duration-200 ease-out group/item',
                  minimizeSidebar
                    ? 'justify-center p-2'
                    : 'justify-between mx-1 px-4 py-3 rounded-2xl',
                  isActive
                    ? minimizeSidebar
                      ? ''
                      : 'text-white shadow-xl bg-gradient-to-r border border-white/20'
                    : minimizeSidebar
                      ? ''
                      : 'text-slate-700 hover:bg-white/80 hover:text-slate-900 hover:shadow-lg bg-white/40 backdrop-blur-sm border border-slate-200/50',
                )}
                style={{
                  background:
                    isActive && !minimizeSidebar
                      ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                      : undefined,
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
                  <button
                    className={cn(
                      'w-12 h-12 rounded-2xl text-white shadow-xl transition-all duration-200 p-0 hover:shadow-2xl  flex items-center justify-center bg-gradient-to-br border border-white/20',
                      isActive
                        ? ''
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600',
                    )}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                        : undefined,
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ',
                          isActive
                            ? 'bg-white/20 shadow-xl backdrop-blur-sm'
                            : 'bg-slate-100/80 group-hover:bg-white shadow-sm',
                        )}
                      >
                        <item.icon
                          className={cn(
                            'w-5 h-5 transition-all duration-200',
                            isActive
                              ? 'text-white'
                              : 'text-slate-600 group-hover:text-slate-800',
                          )}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div
                          className={cn(
                            'font-bold text-sm transition-colors duration-200',
                            isActive
                              ? 'text-white'
                              : 'group-hover:text-slate-900',
                          )}
                        >
                          {item.title}
                        </div>
                        <div
                          className={cn(
                            'text-xs opacity-90 transition-colors duration-200',
                            isActive
                              ? 'text-white/90'
                              : 'text-slate-500 group-hover:text-slate-600',
                          )}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {showMaterialSub ? (
                        <ChevronUp
                          className={cn(
                            'w-5 h-5 transition-all duration-200',
                            isActive ? 'text-white' : 'text-slate-500',
                          )}
                        />
                      ) : (
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 transition-all duration-200',
                            isActive ? 'text-white' : 'text-slate-500',
                          )}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Enhanced Regular Menu Item
              <Link
                href={item.url(website_sub_category_id ?? '')}
                passHref
                onClick={handleLinkClick}
              >
                <div
                  className={cn(
                    'flex items-center cursor-pointer font-semibold transition-all duration-200 ease-out group/item',
                    minimizeSidebar
                      ? 'justify-center p-2'
                      : 'gap-4 mx-1 px-4 py-3 rounded-2xl',
                    isActive
                      ? minimizeSidebar
                        ? ''
                        : 'text-white shadow-xl bg-gradient-to-r border border-white/20'
                      : item.isHighlighted
                        ? minimizeSidebar
                          ? ''
                          : 'border border-slate-200/60 hover:shadow-xl hover:border-slate-300/60 bg-gradient-to-r from-white/60 to-slate-50/80 backdrop-blur-sm'
                        : minimizeSidebar
                          ? ''
                          : 'text-slate-700 hover:bg-white/80 hover:text-slate-900 hover:shadow-lg bg-white/40 backdrop-blur-sm border border-slate-200/50',
                  )}
                  style={{
                    background:
                      isActive && !minimizeSidebar
                        ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                        : item.isHighlighted && !minimizeSidebar && !isActive
                          ? `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`
                          : undefined,
                  }}
                >
                  {minimizeSidebar ? (
                    <button
                      className={cn(
                        'w-12 h-12 rounded-2xl shadow-xl transition-all duration-200 p-0 hover:shadow-2xl  flex items-center justify-center bg-gradient-to-br border border-white/20',
                        isActive
                          ? 'text-white'
                          : item.isHighlighted
                            ? 'text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600',
                      )}
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                          : item.isHighlighted
                            ? `linear-gradient(135deg, ${mainColor}80, ${secondaryColor}80)`
                            : undefined,
                      }}
                    >
                      <item.icon className="w-5 h-5" />
                    </button>
                  ) : (
                    <>
                      <div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
                          isActive
                            ? 'bg-white/20 shadow-xl backdrop-blur-sm'
                            : item.isHighlighted
                              ? 'shadow-lg backdrop-blur-sm'
                              : 'bg-slate-100/80 group-hover:bg-white shadow-sm',
                        )}
                        style={{
                          background:
                            item.isHighlighted && !isActive
                              ? `${mainColor}25`
                              : isActive
                                ? 'rgba(255,255,255,0.2)'
                                : undefined,
                        }}
                      >
                        <item.icon
                          className={cn(
                            'w-5 h-5 transition-all duration-200 ',
                            isActive
                              ? 'text-white'
                              : item.isHighlighted
                                ? ''
                                : 'text-slate-600 group-hover:text-slate-800',
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
                            'font-bold text-sm transition-colors duration-200',
                            isActive
                              ? 'text-white'
                              : 'group-hover:text-slate-900',
                          )}
                        >
                          {item.title}
                        </div>
                        <div
                          className={cn(
                            'text-xs opacity-90 transition-colors duration-200',
                            isActive
                              ? 'text-white/90'
                              : 'text-slate-500 group-hover:text-slate-600',
                          )}
                        >
                          {item.description}
                        </div>
                      </div>
                      {/* Enhanced Badges and indicators */}
                      <div className="flex items-center gap-2">
                        {item.isNew && (
                          <div className="relative">
                            <div
                              className="w-3 h-3 rounded-full animate-pulse bg-gradient-to-r shadow-sm"
                              style={{
                                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                              }}
                            />
                            <div
                              className="absolute inset-0 w-3 h-3 rounded-full animate-ping bg-gradient-to-r opacity-75"
                              style={{
                                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                              }}
                            />
                          </div>
                        )}
                        {item.badge && (
                          <Badge className="text-xs px-2 py-1 rounded-xl border-0 font-bold shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white transition-all duration-200 ">
                            {item.isAI && <Brain className="w-3 h-3 mr-1" />}
                            {item.badge}
                          </Badge>
                        )}
                        {item.isLocked && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Link>
            )}

            {/* Enhanced Sub-items for Material */}
            {item.isCollapsible && showMaterialSub && !minimizeSidebar && (
              <div className="mt-2 flex w-full flex-col items-end gap-1 animate-in slide-in-from-top-2 duration-200">
                {category?.map((subItem: any, subIndex: number) => (
                  <Link
                    key={subItem.id}
                    href={`/${website_sub_category_id}/user/workspace/${subItem.id}`}
                    className={cn(
                      'ml-14 mr-1 flex cursor-pointer items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 w-[calc(100%-3.5rem)] group/sub backdrop-blur-sm border',
                      pathname?.includes(`workspace/${subItem.id}`)
                        ? 'text-white shadow-lg bg-gradient-to-r border-white/20'
                        : 'text-slate-600 hover:bg-white/80 hover:text-slate-800 hover:shadow-md bg-white/50 border-slate-200/50',
                    )}
                    style={{
                      background: pathname?.includes(`workspace/${subItem.id}`)
                        ? `linear-gradient(135deg, ${mainColor}dd, ${secondaryColor}dd)`
                        : undefined,
                      animationDelay: `${subIndex * 50}ms`,
                    }}
                    onClick={handleLinkClick}
                  >
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/20 transition-transform duration-200">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                    <p className="capitalize flex-1">{subItem.name}</p>
                    <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarRoute;
