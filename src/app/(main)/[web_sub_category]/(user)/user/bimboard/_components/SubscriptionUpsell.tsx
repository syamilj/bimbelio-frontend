'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, Crown } from 'lucide-react';
import Link from 'next/link';

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
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  if (!isPremium) return null;

  return (
    <section className="w-full">
      <div
        className="relative overflow-hidden rounded-[2rem] p-5 text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${mainColor}cc)`,
        }}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-5 rounded-full -ml-8 -mb-8 blur-2xl"></div>

        <div className="relative z-10 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm">
              <Crown className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">{planName}</h3>
              {planExpiresAt && (
                <p className="text-xs text-white/90 font-medium mt-0.5">
                  Berlaku hingga {planExpiresAt}
                </p>
              )}
            </div>
          </div>
          <Badge className="bg-emerald-500 text-white border-0 text-xs px-2.5 py-1 rounded-full shadow-sm font-bold">
            <Check className="w-3 h-3 mr-1" /> Aktif
          </Badge>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          <div className="bg-black/10 backdrop-blur-sm rounded-3xl p-3 text-center border border-white/10 hover:bg-black/20 transition-colors">
            <div className="w-8 h-8 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-1">
              <span className="text-xs font-bold">TO</span>
            </div>
            <div className="text-lg font-black">
              {usageStats.tryoutsUsed}/
              {usageStats.tryoutsLimit === -1 ? '∞' : usageStats.tryoutsLimit}
            </div>
            <p className="text-[10px] text-white/80 font-medium uppercase tracking-wide">
              TryOut
            </p>
          </div>
          <div className="bg-black/10 backdrop-blur-sm rounded-3xl p-3 text-center border border-white/10 hover:bg-black/20 transition-colors">
            <div className="w-8 h-8 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-1">
              <span className="text-xs font-bold">CS</span>
            </div>
            <div className="text-lg font-black">
              {usageStats.coursesUsed}/
              {usageStats.coursesLimit === -1 ? '∞' : usageStats.coursesLimit}
            </div>
            <p className="text-[10px] text-white/80 font-medium uppercase tracking-wide">
              Course
            </p>
          </div>
          <div className="bg-black/10 backdrop-blur-sm rounded-3xl p-3 text-center border border-white/10 hover:bg-black/20 transition-colors">
            <div className="w-8 h-8 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-1">
              <span className="text-xs font-bold">AI</span>
            </div>
            <div className="text-lg font-black">
              {usageStats.aiChatsUsed}/
              {usageStats.aiChatsLimit === -1 ? '∞' : usageStats.aiChatsLimit}
            </div>
            <p className="text-[10px] text-white/80 font-medium uppercase tracking-wide">
              AI Chat
            </p>
          </div>
        </div>

        <Link
          href={`/${webSubCategory}/user/subscription`}
          className="relative z-10 block mt-5"
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full bg-white text-primary text-xs font-bold h-10 rounded-3xl shadow-md hover:bg-slate-50 hover:scale-[1.02] transition-all"
            style={{ color: mainColor }}
          >
            Lihat Detail Langganan <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
