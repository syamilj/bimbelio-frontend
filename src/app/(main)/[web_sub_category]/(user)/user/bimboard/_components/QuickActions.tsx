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
    },
    {
      icon: PlayCircle,
      label: "Live Class",
      badge: upcomingLiveClassCount > 0 ? upcomingLiveClassCount : null,
      href: `/${webSubId}/user/bimlive`,
    },
    {
      icon: BookOpen,
      label: "Materi",
      badge: null,
      href: `/${webSubId}/user/bimcourse`,
    },
    {
      icon: MessageSquare,
      label: "AI Tutor",
      badge: null,
      href: `/${webSubId}/user/bimbot`,
    },
    {
      icon: Trophy,
      label: "Leaderboard",
      badge: null,
      href: `/${webSubId}/user/bimarena/leaderboard`,
    },
  ];

  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <div className="overflow-x-auto scrollbar-hidden" style={{ maxWidth: '100%' }}>
        <div className="flex gap-2 pb-1">
        {actions.map((action) => (
          <Link key={action.label} href={action.href} className="flex-shrink-0">
            <div
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-full border border-gray-200 bg-white hover:shadow-sm transition-all"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = mainColor;
                e.currentTarget.style.backgroundColor = `${mainColor}08`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              <action.icon className="w-4 h-4 text-gray-500" />
              <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
                {action.label}
              </span>
              {action.badge && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
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
