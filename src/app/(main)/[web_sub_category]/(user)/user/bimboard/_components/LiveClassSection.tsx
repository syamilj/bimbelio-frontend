"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, ChevronRight, Clock, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface LiveClass {
  id: string;
  title: string;
  scheduleTime: string;
  thumbnail: string | null;
  instructorName: string;
  isPremium: boolean;
}

interface LiveClassSectionProps {
  liveClasses: LiveClass[];
}

function isValidImageUrl(url?: string | null): boolean {
  if (!url || url.trim() === "") return false;
  try {
    if (url.startsWith("/")) return true;
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function LiveClassSection({ liveClasses }: LiveClassSectionProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const params = useParams();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";
  const webSubId = (params?.web_sub_category as string) || "snbt";

  if (liveClasses.length === 0) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4" style={{ color: mainColor }} />
          <h2 className="font-semibold text-sm text-gray-900">Live Class</h2>
          <Badge
            className="text-[10px] px-1.5 py-0"
            style={{ backgroundColor: `${mainColor}15`, color: mainColor }}
          >
            {liveClasses.length}
          </Badge>
        </div>
        <Link href={`/${webSubId}/user/bimlive`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            style={{ color: mainColor }}
          >
            Semua <ChevronRight className="w-3 h-3 ml-0.5" />
          </Button>
        </Link>
      </div>

      {/* Cards - Horizontal Scroll */}
      <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <div className="overflow-x-auto scrollbar-hidden" style={{ maxWidth: '100%' }}>
          <div className="flex gap-3 pb-2">
          {liveClasses.map((lc) => (
            <Link
              key={lc.id}
              href={`/${webSubId}/user/bimlive`}
              className="flex-shrink-0 group first:ml-0"
            >
              <div className="w-64 md:w-72 bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-md transition-all">
                {/* Thumbnail */}
                <div className="relative h-36 md:h-40 bg-gray-100">
                  {isValidImageUrl(lc.thumbnail) ? (
                    <Image
                      src={lc.thumbnail!}
                      alt={lc.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <PlayCircle className="w-10 h-10" style={{ color: mainColor }} />
                    </div>
                  )}

                  {/* Live Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5 animate-pulse font-bold">
                      LIVE
                    </Badge>
                  </div>

                  {/* Premium Badge */}
                  {lc.isPremium && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-amber-500 text-white text-[10px] px-2 py-0.5 font-bold">
                        <Crown className="w-3 h-3 mr-0.5" />
                        PRO
                      </Badge>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                    {lc.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate">{lc.instructorName}</span>
                    <span className="flex items-center gap-1 flex-shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      {formatDate(lc.scheduleTime)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
