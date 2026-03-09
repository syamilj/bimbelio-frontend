'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BimBrand } from '@/components/ui/bim-brand';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { BookOpen, Bot, Medal, MonitorPlay, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function BimQuickAccessMenu() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const quickActions = [
    {
      suffix: 'Course',
      icon: BookOpen,
      href: `/${website_sub_category_id}/user/bimcourse`,
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      suffix: 'Live',
      icon: MonitorPlay,
      href: `/${website_sub_category_id}/user/bimlive`,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      suffix: 'Arena',
      label: 'Try Out',
      icon: Medal,
      href: `/${website_sub_category_id}/user/bimarena/try-out`,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      suffix: 'Arena',
      label: 'Peringkat',
      icon: Trophy,
      href: `/${website_sub_category_id}/user/bimarena/leaderboard`,
      gradient: 'from-yellow-500 to-amber-600',
    },
    {
      suffix: 'Bot',
      icon: Bot,
      href: `/${website_sub_category_id}/user/bimbot`,
      gradient: 'from-violet-500 to-violet-600',
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-black text-slate-800 mb-4">Akses Cepat</h2>

      {/* Desktop: Flex Wrap */}
      <div className="hidden md:flex flex-wrap gap-2">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              href={action.href}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border-2 border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              {/* Icon with gradient background */}
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>

              {/* Title */}
              <span className="font-bold text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                <BimBrand suffix={action.suffix} />
                {action.label ? ` - ${action.label}` : ''}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              href={action.href}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border-2 border-slate-100 shadow-sm flex-shrink-0 snap-start"
            >
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-slate-700 whitespace-nowrap">
                <BimBrand suffix={action.suffix} />
                {action.label ? ` - ${action.label}` : ''}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
