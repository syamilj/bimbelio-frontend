'use client';

import { StatusBadge } from '@/components/ds';
import { CheckCircle, Clock, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TryoutProgressCardProps {
  tryout: {
    id: string;
    title: string;
    score: number | null;
    totalQuestions: number;
    answeredQuestions: number;
    status: 'completed' | 'in-progress' | 'not-started';
    thumbnail: string | null;
    deadline: string | null;
  };
  webSubCategoryId: string;
  mainColor: string;
}

export function TryoutProgressCard({
  tryout,
  webSubCategoryId,
  mainColor,
}: TryoutProgressCardProps) {
  const statusBadge = () => {
    switch (tryout.status) {
      case 'completed':
        return (
          <StatusBadge variant="success" size="sm">
            <CheckCircle className="w-3 h-3" />
            Selesai
          </StatusBadge>
        );
      case 'in-progress':
        return (
          <StatusBadge variant="info" size="sm">
            <Clock className="w-3 h-3" />
            Berlangsung
          </StatusBadge>
        );
      default:
        return (
          <StatusBadge variant="neutral" size="sm">
            <Target className="w-3 h-3" />
            Belum Mulai
          </StatusBadge>
        );
    }
  };

  return (
    <Link
      href={`/${webSubCategoryId}/user/bimarena/try-out/${tryout.id}`}
      className="group relative rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-slate-900 border border-slate-100 flex-shrink-0 w-[280px] md:w-auto aspect-[4/5]"
    >
      {/* Full Background Image */}
      {tryout.thumbnail ? (
        <Image
          src={tryout.thumbnail}
          alt={tryout.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center opacity-20"
          style={{ backgroundColor: mainColor }}
        >
          <Target className="w-16 h-16 text-white" />
        </div>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Top Badges */}
      <div className="absolute top-3 left-3 flex gap-2 z-10">
        {statusBadge()}
      </div>

      {/* Score Badge - Top Right (if completed) */}
      {tryout.score && tryout.score > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-sm px-2.5 py-1 flex items-center gap-1 border border-white/50">
            <Target
              className="w-3.5 h-3.5"
              style={{ color: mainColor }}
            />
            <span
              className="text-xs font-black"
              style={{ color: mainColor }}
            >
              {tryout.score}
            </span>
          </div>
        </div>
      )}

      {/* Content Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
        <h3 className="font-extrabold text-white text-lg line-clamp-3 leading-tight mb-3 drop-shadow-md group-hover:text-blue-200 transition-colors">
          {tryout.title}
        </h3>
        <p className="text-white/80 text-xs font-medium line-clamp-1 mb-1">
          {tryout.totalQuestions} Soal •{' '}
          {tryout.status === 'completed'
            ? 'Selesai'
            : tryout.status === 'in-progress'
              ? 'Lanjutkan'
              : 'Belum Mulai'}
        </p>
      </div>
    </Link>
  );
}
