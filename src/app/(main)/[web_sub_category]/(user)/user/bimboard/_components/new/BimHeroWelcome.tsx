"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BimArena, BimCourse } from "@/components/ui/bim-brand";
import { Crown, Zap, TrendingUp, Flame } from "lucide-react";
import Link from "next/link";
import { website_sub_category_id } from "@/hooks/use-web-sub-category-id";
import { DecorativePatterns } from "./DecorativePatterns";

interface BimHeroWelcomeProps {
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
    tier: string;
    streak: number;
  };
  stats: {
    studyHoursThisWeek: number;
    rank: number;
    tryoutsCompleted: number;
  };
  subscription: {
    isPremium: boolean;
    planName: string;
    planExpiresAt: string | null;
    daysLeft: number | null;
  };
}

export default function BimHeroWelcome({ user, stats, subscription }: BimHeroWelcomeProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";
  const secondaryColor = websiteSubCategory?.secondary_color || "#5aa4dd";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 md:p-8"
      style={{
        background: `linear-gradient(135deg, ${mainColor}15 0%, ${secondaryColor}10 100%)`,
      }}
    >
      {/* Decorative Background Patterns */}
      <DecorativePatterns.GradientMesh colors={[mainColor, secondaryColor]} />
      <DecorativePatterns.DotPattern />
      {subscription.isPremium && <DecorativePatterns.Sparkles />}

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Side - User Info */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-white shadow-lg">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
              <AvatarFallback
                className="text-2xl font-black text-white"
                style={{ backgroundColor: mainColor }}
              >
                {user.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Premium Badge */}
            {subscription.isPremium && (
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                style={{ backgroundColor: mainColor }}
              >
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Streak Badge */}
            {user.streak > 0 && (
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg bg-orange-500">
                <Flame className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800">
                {getGreeting()}, {user.name.split(" ")[0]}!
              </h1>
            </div>
            <p className="text-sm md:text-base text-slate-600 font-medium">
              Siap untuk belajar hari ini?
            </p>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {subscription.isPremium && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: mainColor }}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>{subscription.planName}</span>
                  {subscription.daysLeft && subscription.daysLeft < 30 && (
                    <span className="opacity-90">{subscription.daysLeft} hari</span>
                  )}
                </div>
              )}

              {stats.rank > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-xs font-bold shadow-sm border border-slate-200">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-700">Peringkat #{stats.rank}</span>
                </div>
              )}

              {stats.studyHoursThisWeek > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-xs font-bold shadow-sm border border-slate-200">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-slate-700">{stats.studyHoursThisWeek}j minggu ini</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - CTAs */}
        <div className="flex flex-col gap-2 md:items-end">
          {/* Only show button if NOT premium */}
          {!subscription.isPremium && (
            <Link
              href={`/${website_sub_category_id}/user/subscription`}
              className="px-6 py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-amber-400 to-orange-500 text-white"
            >
              Upgrade Premium
            </Link>
          )}

          <div className="flex gap-2">
            <Link
              href={`/${website_sub_category_id}/user/bimarena/try-out`}
              className="px-4 py-2 rounded-full text-xs font-bold border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all hover:scale-105 shadow-sm"
            >
              <BimArena />
            </Link>
            <Link
              href={`/${website_sub_category_id}/user/bimcourse`}
              className="px-4 py-2 rounded-full text-xs font-bold border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all hover:scale-105 shadow-sm"
            >
              <BimCourse />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
