'use client';

import { Clock, MonitorPlay } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface LiveClassProgressCardProps {
  liveClass: {
    id: string;
    title: string;
    scheduleTime: string;
    duration: number;
    thumbnail: string | null;
    instructorName: string;
    instructorAvatar: string | null;
    isPremium: boolean;
    isRegistered: boolean;
  };
  webSubCategoryId: string;
  mainColor: string;
}

export function LiveClassProgressCard({
  liveClass,
  webSubCategoryId,
  mainColor,
}: LiveClassProgressCardProps) {
  return (
    <Link
      href={`/${webSubCategoryId}/user/bimlive/${liveClass.id}`}
      className="group relative rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-slate-900 border border-slate-100 flex-shrink-0 w-[280px] md:w-auto aspect-[4/5]"
    >
      {/* Full Background Image */}
      {liveClass.thumbnail ? (
        <Image
          src={liveClass.thumbnail}
          alt={liveClass.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center opacity-20"
          style={{ backgroundColor: mainColor }}
        >
          <MonitorPlay className="w-16 h-16 text-white" />
        </div>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Top Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
        {liveClass.isPremium && (
          <div className="px-2 py-0.5 rounded-3xl bg-amber-400 text-white text-[10px] font-bold shadow-sm">
            PRO
          </div>
        )}
      </div>

      <div className="absolute top-3 left-3 z-10">
        <div className="bg-rose-500 text-white text-[10px] px-2 py-0.5 font-bold rounded-3xl animate-pulse shadow-sm">
          LIVE
        </div>
      </div>

      {/* Content Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
        {/* Instructor Info */}
        <div className="flex items-center gap-2 mb-2">
          {liveClass.instructorAvatar ? (
            <Image
              src={liveClass.instructorAvatar}
              alt={liveClass.instructorName}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover border border-white/30"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <span className="text-[10px] font-bold text-white uppercase">
                {liveClass.instructorName.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-xs font-bold text-white shadow-black drop-shadow-md truncate">
            {liveClass.instructorName}
          </span>
        </div>

        <h3 className="font-extrabold text-white text-lg line-clamp-2 leading-tight mb-2 drop-shadow-md group-hover:text-blue-200 transition-colors">
          {liveClass.title}
        </h3>

        {/* Schedule & Duration */}
        <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            <span>
              {new Date(liveClass.scheduleTime).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
