"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronRight,
  FileText,
  PlayCircle,
  Sparkles,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ContentItem {
  id: string;
  src: string;
  title: string;
  hasVideo?: boolean;
}

interface ContentSectionProps {
  tryouts: ContentItem[];
  materials: ContentItem[];
  recordings: ContentItem[];
}

function isValidImageUrl(url?: string): boolean {
  if (!url || url.trim() === "") return false;
  try {
    if (url.startsWith("/")) return true;
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function ContentRow({
  items,
  title,
  icon: Icon,
  href,
  mainColor,
  showPlayIcon = false,
  isWide = false,
  isFullWide = false,
}: {
  items: ContentItem[];
  title: string;
  icon: React.ElementType;
  href: string;
  mainColor: string;
  showPlayIcon?: boolean;
  isWide?: boolean;
  isFullWide?: boolean;
}) {
  if (items.length === 0) return null;

  // Card sizes based on isWide prop - Materi much wider
  const cardWidth = isFullWide ? "w-64 md:w-72" : isWide ? "w-44 md:w-48" : "w-28 md:w-32";
  const imageHeight = isFullWide ? "h-52 md:h-56" : isWide ? "h-52 md:h-56" : "h-36 md:h-40";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className="w-4 h-4" style={{ color: mainColor }} />
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <Badge
            className="text-[10px] px-1.5 py-0"
            style={{ backgroundColor: `${mainColor}15`, color: mainColor }}
          >
            {items.length}
          </Badge>
        </div>
        <Link href={href}>
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
      <div className="w-full overflow-x-auto scrollbar-hidden">
        <div className="flex gap-3 pb-2 pr-4 md:pr-0">
          {items.map((item) => (
            <Link key={item.id} href={href} className="flex-shrink-0 group">
              <div className={`${cardWidth} bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all`}>
                {/* Image Container - Fixed height */}
                <div className={`relative bg-gray-100 ${imageHeight}`}>
                  {isValidImageUrl(item.src) ? (
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}10` }}
                    >
                      <Icon
                        className="w-8 h-8 opacity-30"
                        style={{ color: mainColor }}
                      />
                    </div>
                  )}

                  {/* Video play icon */}
                  {(showPlayIcon || item.hasVideo) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <PlayCircle
                          className="w-6 h-6"
                          style={{ color: mainColor }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Title - Outside image, fixed 2 lines height */}
                <div className="p-2">
                  <h4 className="font-medium text-gray-900 text-xs leading-tight line-clamp-2 h-8">
                    {item.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ContentSection({
  tryouts,
  materials,
  recordings,
}: ContentSectionProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const params = useParams();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";
  const webSubId = (params?.web_sub_category as string) || "snbt";

  // Check if we have any content
  const hasContent = tryouts.length > 0 || materials.length > 0 || recordings.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Header */}
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-4 h-4" style={{ color: mainColor }} />
        <h2 className="font-semibold text-sm text-gray-900">Konten Terbaru</h2>
      </div>

      {/* Rows */}
      <div className="space-y-4">
        {tryouts.length > 0 && (
          <ContentRow
            items={tryouts}
            title="Try Out"
            icon={FileText}
            href={`/${webSubId}/user/try-out`}
            mainColor={mainColor}
            isWide
          />
        )}

        {materials.length > 0 && (
          <ContentRow
            items={materials}
            title="Materi"
            icon={BookOpen}
            href={`/${webSubId}/user/course`}
            mainColor={mainColor}
            isFullWide
          />
        )}

        {recordings.length > 0 && (
          <ContentRow
            items={recordings}
            title="Video Rekaman"
            icon={Video}
            href={`/${webSubId}/user/course`}
            mainColor={mainColor}
            showPlayIcon
          />
        )}
      </div>
    </div>
  );
}
