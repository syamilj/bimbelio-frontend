'use client';

import { useGet } from '@/lib/fetch-helper/useGet';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface CourseCategory {
  id: number;
  name: string;
  image: string | null;
  totalChapters: number;
  completedChapters: number;
  percentageProgress: number;
  totalSpendTime: number;
  totalTryout: number;
}

interface Props {
  onCountReady: (count: number) => void;
}

function DoneCard({ item, web }: { item: CourseCategory; web: string }) {
  return (
    <Link
      href={`/${web}/user/bimcourse/${item.id}`}
      className="flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors group"
    >
      {/* Thumbnail with done overlay */}
      <div className="relative w-20 h-14 md:w-24 md:h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-50">
            <BookOpen className="w-6 h-6 text-emerald-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-emerald-500/70 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-white drop-shadow" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
          Selesai
        </span>
        <p className="font-semibold text-slate-800 text-sm leading-tight truncate">
          {item.name}
        </p>
        <p className="text-[11px] text-slate-500 font-medium">
          {item.totalChapters} chapter · {item.totalTryout} tryout
        </p>
      </div>

      {/* Done badge */}
      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      </div>
    </Link>
  );
}

export default function CourseTabDone({ onCountReady }: Props) {
  const params = useParams();
  const web = (params?.web_sub_category as string) || '';

  const { data, isLoading } = useGet<CourseCategory[]>(
    '/course/getCategoryForCard',
  );

  const done = (data ?? []).filter(
    (i) => i.completedChapters >= i.totalChapters && i.totalChapters > 0,
  );

  const onCountRef = useRef(onCountReady);
  onCountRef.current = onCountReady;

  useEffect(() => {
    if (!isLoading) {
      onCountRef.current(done.length);
    }
  }, [isLoading, done.length]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 animate-pulse"
          >
            <div className="w-24 h-16 rounded-2xl bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 w-16 bg-slate-100 rounded-full" />
              <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
              <div className="h-2 w-32 bg-slate-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (done.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-300" />
        </div>
        <p className="font-bold text-slate-700 text-base mb-1">
          Belum ada modul selesai
        </p>
        <p className="text-sm text-slate-500">
          Selesaikan modul untuk melihatnya di sini.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <div className="w-1 h-5 rounded-full bg-emerald-500" />
        <h3 className="font-black text-slate-800 text-sm">Modul Selesai</h3>
        <span className="text-[11px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
          {done.length}
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {done.map((item) => (
          <DoneCard
            key={item.id}
            item={item}
            web={web}
          />
        ))}
      </div>
    </div>
  );
}
