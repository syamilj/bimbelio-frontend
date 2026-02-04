"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import {
  FileText,
  PlayCircle,
  BookOpen,
  MessageSquare,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface QuickActionsProps {
  upcomingTryoutCount: number;
  upcomingLiveClassCount: number;
}

export default function QuickActions({
  upcomingTryoutCount,
  upcomingLiveClassCount,
}: QuickActionsProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const params = useParams();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";
  const webSubId = (params?.web_sub_category as string) || "snbt";

  const actions = [
    {
      icon: FileText,
      label: "Try Out",
      badge: upcomingTryoutCount > 0 ? upcomingTryoutCount : null,
      href: `/${webSubId}/user/bimarena/try-out`,
      colors: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "text-purple-500", hover: "hover:bg-purple-100" }
    },
    {
      icon: PlayCircle,
      label: "Live Class",
      badge: upcomingLiveClassCount > 0 ? upcomingLiveClassCount : null,
      href: `/${webSubId}/user/bimlive`,
       colors: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", icon: "text-rose-500", hover: "hover:bg-rose-100" }
    },
    {
      icon: BookOpen,
      label: "Materi",
      badge: null,
      href: `/${webSubId}/user/bimcourse`,
       colors: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-500", hover: "hover:bg-blue-100" }
    },
    {
      icon: MessageSquare,
      label: "AI Tutor",
      badge: null,
      href: `/${webSubId}/user/bimbot`,
       colors: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "text-emerald-500", hover: "hover:bg-emerald-100" }
    },
    {
      icon: Trophy,
      label: "Leaderboard",
      badge: null,
      href: `/${webSubId}/user/bimarena/leaderboard`,
       colors: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "text-amber-500", hover: "hover:bg-amber-100" }
    },
  ];

  return (
    <div style={{ maxWidth: '100%' }}>
      {/* Scrollable Container with Negative Margins */}
      <div
        className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.quick-actions-scroll::-webkit-scrollbar { display: none; }`}</style>

        <div className="quick-actions-scroll flex gap-2.5 min-w-max">
          {actions.map((action) => (
            <Link key={action.label} href={action.href} className="flex-shrink-0">
              <div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-3xl border ${action.colors.bg} ${action.colors.border} ${action.colors.hover} transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className={`p-1 rounded-full bg-white/50`}>
                   <action.icon className={`w-3.5 h-3.5 ${action.colors.icon}`} />
                </div>
                <span className={`text-xs font-bold ${action.colors.text} whitespace-nowrap`}>
                  {action.label}
                </span>
                {action.badge && (
                  <span
                    className="flex items-center justify-center min-w-[18px] h-[18px] text-[10px] px-1.5 rounded-full text-white font-bold shadow-sm"
                    style={{ backgroundColor: mainColor }}
                  >
                    {action.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
