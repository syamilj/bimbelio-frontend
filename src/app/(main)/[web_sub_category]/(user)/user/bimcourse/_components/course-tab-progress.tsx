'use client';

import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronRight, Play, SkipForward } from 'lucide-react';
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

type Status = 'Belum Dimulai' | 'Berlangsung' | 'Selesai';

function getStatus(item: CourseCategory): Status {
  if (item.completedChapters === 0) return 'Belum Dimulai';
  if (item.completedChapters >= item.totalChapters && item.totalChapters > 0)
    return 'Selesai';
  return 'Berlangsung';
}

const STATUS_STYLES: Record<Status, string> = {
  'Belum Dimulai': 'bg-slate-100 text-slate-600',
  Berlangsung: 'bg-blue-50 text-blue-600',
  Selesai: 'bg-emerald-50 text-emerald-600',
};

function CourseCard({ item, web }: { item: CourseCategory; web: string }) {
  const status = getStatus(item);
  const pct = Math.min(100, Math.round(item.percentageProgress));

  const ActionIcon =
    status === 'Belum Dimulai'
      ? Play
      : status === 'Berlangsung'
        ? SkipForward
        : ChevronRight;

  return (
    <Link
      href={`/${web}/user/bimcourse/${item.id}`}
      className="flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors group"
    >
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50">
            <BookOpen className="w-6 h-6 text-blue-400" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <span
          className={cn(
            'text-[11px] font-bold px-2 py-0.5 rounded-full',
            STATUS_STYLES[status],
          )}
        >
          {status}
        </span>
        <p className="font-semibold text-slate-800 text-sm leading-tight truncate">
          {item.name}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-slate-500 flex-shrink-0">
            {item.completedChapters}/{item.totalChapters}
          </span>
        </div>
      </div>

      <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center flex-shrink-0 transition-colors">
        <ActionIcon className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
      </div>
    </Link>
  );
}

export default function CourseTabProgress({ onCountReady }: Props) {
  const params = useParams();
  const web = (params?.web_sub_category as string) || '';

  const { data, isLoading } = useGet<CourseCategory[]>(
    '/course/getCategoryForCard',
  );

  const items = data ?? [];
  const inProgress = items.filter((i) => getStatus(i) === 'Berlangsung');
  const notStarted = items.filter((i) => getStatus(i) === 'Belum Dimulai');
  const visible = [...inProgress, ...notStarted];

  const onCountRef = useRef(onCountReady);
  onCountRef.current = onCountReady;

  useEffect(() => {
    if (!isLoading) {
      onCountRef.current(visible.length);
    }
  }, [isLoading, visible.length]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 animate-pulse"
          >
            <div className="w-24 h-16 rounded-2xl bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 w-16 bg-slate-100 rounded-full" />
              <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
              <div className="h-2 w-full bg-slate-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-blue-400" />
        </div>
        <p className="font-bold text-slate-700 text-base mb-1">
          Belum ada modul aktif
        </p>
        <p className="text-sm text-slate-500">
          Mulai belajar dari tab Semua Modul.
        </p>
      </div>
    );
  }

  return (
    <div>
      {inProgress.length > 0 && (
        <section>
          <div className="flex items-center gap-2 px-5 pt-5 pb-3">
            <div className="w-1 h-5 rounded-full bg-blue-500" />
            <h3 className="font-black text-slate-800 text-sm">
              Sedang Belajar
            </h3>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              {inProgress.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {inProgress.map((item) => (
              <CourseCard
                key={item.id}
                item={item}
                web={web}
              />
            ))}
          </div>
        </section>
      )}
      {notStarted.length > 0 && (
        <section>
          <div className="flex items-center gap-2 px-5 pt-5 pb-3">
            <div className="w-1 h-5 rounded-full bg-slate-400" />
            <h3 className="font-black text-slate-800 text-sm">Belum Dimulai</h3>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {notStarted.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {notStarted.map((item) => (
              <CourseCard
                key={item.id}
                item={item}
                web={web}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
