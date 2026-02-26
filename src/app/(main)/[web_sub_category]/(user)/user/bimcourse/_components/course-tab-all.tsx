'use client';

import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FlaskConical,
  Layers,
  Play,
  Search,
  SkipForward,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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

/** spendTime is stored in minutes in the database */
function formatTime(minutes: number): string {
  if (!minutes || minutes <= 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}j${m > 0 ? ` ${m}m` : ''}`;
  return `${m}m`;
}

function getStatus(item: CourseCategory): Status {
  if (item.completedChapters >= item.totalChapters && item.totalChapters > 0)
    return 'Selesai';
  if (item.completedChapters > 0) return 'Berlangsung';
  return 'Belum Dimulai';
}

const BADGE_CONFIG: Record<Status, { label: string; cls: string }> = {
  'Belum Dimulai': {
    label: 'Belum Dimulai',
    cls: 'bg-slate-800/70 text-white',
  },
  Berlangsung: { label: 'Berlangsung', cls: 'bg-blue-500/80 text-white' },
  Selesai: { label: '✓ Selesai', cls: 'bg-emerald-500/85 text-white' },
};

const ACTION_LABEL: Record<Status, string> = {
  'Belum Dimulai': 'Mulai Belajar',
  Berlangsung: 'Lanjutkan',
  Selesai: 'Lihat Detail',
};

const ACTION_ICON: Record<Status, typeof Play> = {
  'Belum Dimulai': Play,
  Berlangsung: SkipForward,
  Selesai: ChevronRight,
};

const PROGRESS_GRADIENT: Record<Status, string> = {
  'Belum Dimulai': 'from-slate-300 to-slate-400',
  Berlangsung: 'from-blue-500 to-indigo-500',
  Selesai: 'from-emerald-400 to-teal-500',
};

const BUTTON_STYLE: Record<Status, string> = {
  'Belum Dimulai':
    'bg-blue-500 hover:bg-blue-600 text-white shadow-sm shadow-blue-200',
  Berlangsung:
    'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm shadow-indigo-200',
  Selesai:
    'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200',
};

function CourseGridCard({ item, web }: { item: CourseCategory; web: string }) {
  const status = getStatus(item);
  const pct = Math.min(100, Math.round(item.percentageProgress));
  const Icon = ACTION_ICON[status];
  const badge = BADGE_CONFIG[status];

  return (
    <Link
      href={`/${web}/user/bimcourse/${item.id}`}
      className="group flex flex-col rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-200 bg-white"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-50">
            <BookOpen className="w-9 h-9 text-slate-300" />
          </div>
        )}

        {/* Gradient scrim at bottom for readability */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Status badge top-left */}
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              'text-[10px] font-black px-2 py-0.5 rounded-full backdrop-blur-md leading-tight',
              badge.cls,
            )}
          >
            {badge.label}
          </span>
        </div>

        {/* Progress % bottom-right */}
        <div className="absolute bottom-1.5 right-2 text-white text-[11px] font-black drop-shadow">
          {pct}%
        </div>

        {/* Done full check */}
        {status === 'Selesai' && (
          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2.5">
        {/* Title */}
        <p className="font-bold text-slate-800 text-[13px] leading-snug line-clamp-2 flex-1">
          {item.name}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold flex-wrap">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {item.totalChapters} chapter
          </span>
          {item.totalTryout > 0 && (
            <span className="flex items-center gap-1">
              <FlaskConical className="w-3 h-3 shrink-0" />
              {item.totalTryout} Uji Progress
            </span>
          )}
          {formatTime(item.totalSpendTime) && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(item.totalSpendTime)}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                PROGRESS_GRADIENT[status],
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>
              {item.completedChapters}/{item.totalChapters} selesai
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          className={cn(
            'w-full flex items-center justify-center gap-1.5 py-2 rounded-3xl text-[11px] font-black transition-all duration-150',
            BUTTON_STYLE[status],
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          {ACTION_LABEL[status]}
        </button>
      </div>
    </Link>
  );
}

export default function CourseTabAll({ onCountReady }: Props) {
  const params = useParams();
  const web = (params?.web_sub_category as string) || '';

  const { data, isLoading } = useGet<CourseCategory[]>(
    '/course/getCategoryForCard',
  );
  const [search, setSearch] = useState('');

  const items = data ?? [];
  const filtered = search.trim()
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  const onCountRef = useRef(onCountReady);
  onCountRef.current = onCountReady;

  useEffect(() => {
    if (!isLoading) {
      onCountRef.current(items.length);
    }
  }, [isLoading, items.length]);

  return (
    <div className="p-4 md:p-6">
      {/* Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari modul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 text-sm rounded-3xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors"
          >
            <X className="w-3 h-3 text-slate-600" />
          </button>
        )}
      </div>

      {/* Results count */}
      {!isLoading && filtered.length > 0 && (
        <p className="text-xs text-slate-400 font-semibold mb-3">
          {search
            ? `${filtered.length} hasil`
            : `${items.length} modul tersedia`}
        </p>
      )}

      {/* Grid / Scroll */}
      {isLoading ? (
        <>
          {/* Mobile skeleton horizontal */}
          <div
            className="flex gap-3 overflow-x-auto pb-2 md:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden animate-pulse border border-slate-100 shrink-0 w-[72vw]"
              >
                <div className="aspect-video bg-slate-100" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                  <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                  <div className="h-7 bg-slate-100 rounded-3xl w-full mt-1" />
                </div>
              </div>
            ))}
          </div>
          {/* Desktop skeleton grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden animate-pulse border border-slate-100"
              >
                <div className="aspect-video bg-slate-100" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                  <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                  <div className="h-7 bg-slate-100 rounded-3xl w-full mt-1" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
            <Search className="w-7 h-7 text-slate-300" />
          </div>
          <p className="font-bold text-slate-600 mb-1">
            {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada modul'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-blue-500 font-semibold mt-2 hover:underline"
            >
              Hapus pencarian
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile: horizontal snap scroll */}
          <div
            className="flex gap-3 overflow-x-auto pb-2 md:hidden snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {filtered.map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-[72vw] snap-start"
              >
                <CourseGridCard
                  item={item}
                  web={web}
                />
              </div>
            ))}
          </div>
          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item) => (
              <CourseGridCard
                key={item.id}
                item={item}
                web={web}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
