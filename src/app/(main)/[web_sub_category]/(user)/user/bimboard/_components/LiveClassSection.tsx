'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, Crown, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  if (!url || url.trim() === '') return false;
  try {
    if (url.startsWith('/')) return true;
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function LiveClassSection({
  liveClasses,
}: LiveClassSectionProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const params = useParams();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const webSubId = (params?.web_sub_category as string) || 'snbt';

  if (liveClasses.length === 0) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PlayCircle
            className="w-4 h-4"
            style={{ color: mainColor }}
          />
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
      <div className="w-full relative">
        <div
          className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.live-class-scroll::-webkit-scrollbar { display: none; }`}</style>

          <div className="live-class-scroll flex gap-4 min-w-max md:min-w-0">
            {liveClasses.map((lc) => (
              <Link
                key={lc.id}
                href={`/${webSubId}/user/bimlive`}
                className="flex-shrink-0 group first:ml-0 snap-start"
              >
                <div className="w-[280px] md:w-[300px] aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1 bg-slate-900 border border-slate-100">
                  {/* Full Background Image */}
                  {isValidImageUrl(lc.thumbnail) ? (
                    <Image
                      src={lc.thumbnail!}
                      alt={lc.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center opacity-20"
                      style={{ backgroundColor: mainColor }}
                    >
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  )}

                  {/* Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 z-10">
                    {lc.isPremium && (
                      <Badge className="bg-amber-400 text-white text-[10px] px-2 py-0.5 font-bold border-0 shadow-sm flex items-center gap-1 backdrop-blur-sm">
                        <Crown className="w-3 h-3" />
                        Premium
                      </Badge>
                    )}
                  </div>

                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-rose-500/90 text-white text-[10px] px-2 py-0.5 font-bold border-0 shadow-sm backdrop-blur-sm animate-pulse">
                      LIVE
                    </Badge>
                  </div>

                  {/* Content Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    {/* Instructor Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 overflow-hidden relative">
                        {/* Placeholder for instructor avatar if not available, using Initial */}
                        <span className="text-[10px] font-bold text-white uppercase">
                          {lc.instructorName[0]}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/80 font-medium leading-none">
                          Tentor
                        </span>
                        <span className="text-xs font-bold text-white truncate shadow-black drop-shadow-md max-w-[120px]">
                          {lc.instructorName}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-white text-sm line-clamp-2 leading-tight mb-3 drop-shadow-md">
                      {lc.title}
                    </h3>

                    {/* Schedule / CTA */}
                    <Button
                      size="sm"
                      className="w-full h-8 rounded-full text-xs font-bold bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/30 backdrop-blur-md transition-all"
                    >
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      {formatDate(lc.scheduleTime)}
                    </Button>
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
