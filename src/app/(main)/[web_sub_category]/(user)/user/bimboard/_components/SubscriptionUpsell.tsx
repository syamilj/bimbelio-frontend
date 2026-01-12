"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Crown, Check } from "lucide-react";
import Link from "next/link";

interface SubscriptionUpsellProps {
  isPremium: boolean;
  planName: string;
  planExpiresAt?: string;
  usageStats: {
    tryoutsUsed: number;
    tryoutsLimit: number;
    coursesUsed: number;
    coursesLimit: number;
    aiChatsUsed: number;
    aiChatsLimit: number;
  };
  webSubCategory: string;
}

export default function SubscriptionUpsell({
  isPremium,
  planName,
  planExpiresAt,
  usageStats,
  webSubCategory,
}: SubscriptionUpsellProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";

  if (!isPremium) return null;

  return (
    <section className="w-full">
      <div
        className="rounded-3xl p-4 text-white"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${mainColor}dd)`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{planName}</h3>
              {planExpiresAt && (
                <p className="text-xs opacity-80">Berlaku hingga {planExpiresAt}</p>
              )}
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-0 text-xs">
            <Check className="w-3 h-3 mr-1" /> Aktif
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-lg font-bold">
              {usageStats.tryoutsUsed}/
              {usageStats.tryoutsLimit === -1 ? "∞" : usageStats.tryoutsLimit}
            </div>
            <p className="text-[10px] opacity-80">Try Out</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-lg font-bold">
              {usageStats.coursesUsed}/
              {usageStats.coursesLimit === -1 ? "∞" : usageStats.coursesLimit}
            </div>
            <p className="text-[10px] opacity-80">Course</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-lg font-bold">
              {usageStats.aiChatsUsed}/
              {usageStats.aiChatsLimit === -1 ? "∞" : usageStats.aiChatsLimit}
            </div>
            <p className="text-[10px] opacity-80">AI Chat</p>
          </div>
        </div>

        <Link href={`/${webSubCategory}/user/subscription`} className="block mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-white/90 hover:text-white hover:bg-white/10 text-xs"
          >
            Lihat Detail <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
