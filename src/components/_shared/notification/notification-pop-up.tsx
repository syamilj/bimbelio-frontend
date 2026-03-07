'use client';

import { useNotification } from '@/components/provider/privoder-notification';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { env } from '@/env.mjs';
import { cn } from '@/lib/utils';
import { LiveClass, Plan, Tryout } from '@/types/database';
import { Clock, GraduationCap, Mic2, Trophy, Tv, Users } from 'lucide-react';
import Link from 'next/link';
import {
  formatTimeAgo,
  getCategoryLabel,
  getPriorityBadgeCls,
  getPriorityLabel,
  getTypeHeaderGradient,
  getTypeIcon,
  getTypeIconBg,
  getTypeLabel,
} from './_utils/notification-helpers';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const extractHeroImage = (
  relatedResourceType: string | null | undefined,
  metadata: unknown,
): string | null => {
  if (!metadata || typeof metadata !== 'object') return null;
  if (relatedResourceType === 'LIVE_CLASS')
    return (metadata as LiveClass).image ?? null;
  if (relatedResourceType === 'TRYOUT')
    return `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/tryout/${(metadata as Tryout).image}`;
  if (relatedResourceType === 'PLAN') return (metadata as Plan).image ?? null;
  return null;
};

// ─── Main Popup ───────────────────────────────────────────────────────────────

export const NotificationPopUp = () => {
  const {
    usePopUp: { notificationPopUp, setNotificationPopUp },
    useAction: { handleMarkAsRead },
  } = useNotification();

  if (!notificationPopUp) return null;

  const handleClose = () => {
    setNotificationPopUp(null);
  };

  const heroImage = extractHeroImage(
    notificationPopUp.relatedResourceType,
    notificationPopUp.metadata,
  );
  const gradient = getTypeHeaderGradient(
    notificationPopUp.type,
    notificationPopUp.priority,
  );
  const iconBg = getTypeIconBg(
    notificationPopUp.type,
    notificationPopUp.priority,
  );
  const badgeCls = getPriorityBadgeCls(notificationPopUp.priority);
  const badgeLabel = getPriorityLabel(notificationPopUp.priority);
  const actionUrl = notificationPopUp.actionUrl;
  const hasAction = !!(actionUrl && actionUrl.length > 0);

  return (
    <Dialog open={!!notificationPopUp}>
      {' '}
      {/* Only dismiss via explicit button */}
      {/*
        KEY FIX: w-[calc(100vw-32px)] max-w-[420px]
        - On mobile (e.g. 390px): width = 358px → 16px margin each side ✓
        - On desktop: capped at 420px ✓
        This overrides the Dialog's default max-w-[calc(100%-2rem)] correctly.
      */}
      <DialogContent
        showCloseButton={false}
        classOverlay="z-[10000]"
        className="z-[10001] w-[calc(100vw-32px)] max-w-[420px] max-h-[90vh] p-0 overflow-x-hidden overflow-y-auto border-0 rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.06)] gap-0"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* ── Queue indicator ── */}
        {/* {queueLength > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full">
            {queueLength - 1} notifikasi lagi
          </div>
        )} */}

        {/* ── Hero image OR gradient header ── */}
        {heroImage ? (
          <div className="relative w-full h-fit overflow-hidden bg-gray-900 flex-shrink-0">
            <img
              src={heroImage}
              alt={notificationPopUp.title}
              className="w-full h-full object-contain opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
              <div className="flex items-center gap-1.5 mb-2">
                {notificationPopUp.priority !== 'NORMAL' && (
                  <span
                    className={cn(
                      'text-[10px] font-black px-2.5 py-1 rounded-full',
                      badgeCls,
                    )}
                  >
                    {badgeLabel}
                  </span>
                )}
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                  {getCategoryLabel(notificationPopUp.category)}
                </span>
              </div>
              <DialogTitle className="text-[17px] font-black text-white leading-snug">
                {notificationPopUp.title}
              </DialogTitle>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'bg-gradient-to-b pt-9 pb-6 px-5 text-center flex-shrink-0',
              gradient,
            )}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  'w-16 h-16 rounded-[20px] flex items-center justify-center',
                  iconBg,
                )}
              >
                {getTypeIcon(notificationPopUp.type, 'lg')}
              </div>
            </div>
            <DialogTitle className="text-[17px] font-black text-gray-900 leading-snug px-2 mb-2.5">
              {notificationPopUp.title}
            </DialogTitle>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {notificationPopUp.priority !== 'NORMAL' && (
                <span
                  className={cn(
                    'text-[10px] font-black px-2.5 py-1 rounded-full',
                    badgeCls,
                  )}
                >
                  {badgeLabel}
                </span>
              )}
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/80 text-slate-600 border border-slate-200">
                {getCategoryLabel(notificationPopUp.category)}
              </span>
              {notificationPopUp.description && (
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/80 text-slate-600 border border-slate-200">
                  {notificationPopUp.description}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="px-5 pt-4 pb-3">
          <p className="text-[13.5px] text-gray-700 leading-relaxed">
            {notificationPopUp.content}
          </p>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[11px] text-slate-400">
              {formatTimeAgo(notificationPopUp.createdAt)}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-semibold">
              {getTypeLabel(notificationPopUp.type)}
            </span>
          </div>
        </div>

        {/* ── Metadata cards ── */}
        {notificationPopUp.relatedResourceType === 'LIVE_CLASS' && (
          <LiveClassCard
            notificationPopUp={notificationPopUp}
            hideImage={!!heroImage}
          />
        )}
        {notificationPopUp.relatedResourceType === 'TRYOUT' && (
          <TryoutCard notificationPopUp={notificationPopUp} />
        )}

        {/* ── Footer ── */}
        <div className="px-5 pb-5 pt-2 flex gap-2.5">
          {/* Dismiss */}
          <button
            onClick={() => {
              handleMarkAsRead(notificationPopUp.id);
              handleClose();
            }}
            className="flex-1 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-semibold text-gray-700 transition-colors cursor-pointer"
          >
            Tandai Dibaca
          </button>

          {/* Action */}
          {hasAction && actionUrl!.startsWith('/') && (
            <Link
              href={actionUrl!}
              className="flex-1"
            >
              <button
                onClick={() => {
                  handleMarkAsRead(notificationPopUp.id);
                  handleClose();
                }}
                className="w-full h-11 rounded-full bg-gray-900 hover:bg-gray-700 text-[13px] font-bold text-white transition-colors cursor-pointer"
              >
                Lihat Selengkapnya
              </button>
            </Link>
          )}
          {hasAction && actionUrl!.startsWith('http') && (
            <a
              href={actionUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <button
                onClick={() => {
                  handleMarkAsRead(notificationPopUp.id);
                  handleClose();
                }}
                className="w-full h-11 rounded-full bg-gray-900 hover:bg-gray-700 text-[13px] font-bold text-white transition-colors cursor-pointer"
              >
                Lihat Selengkapnya
              </button>
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Live Class metadata card ─────────────────────────────────────────────────

type PopupNotif = NonNullable<
  ReturnType<typeof useNotification>['usePopUp']['notificationPopUp']
>;

const LiveClassCard = ({
  notificationPopUp,
  hideImage,
}: {
  notificationPopUp: PopupNotif;
  hideImage?: boolean;
}) => {
  const m = notificationPopUp.metadata as LiveClass;
  if (!m || typeof m !== 'object') return null;

  return (
    <div className="mx-4 mb-2 rounded-[16px] overflow-hidden bg-slate-50 border border-slate-100">
      {!hideImage && m.image && (
        <div className="relative w-full h-32 overflow-hidden">
          <img
            src={m.image}
            alt={m.title}
            className="w-full h-full object-cover"
          />
          {m.isRecord && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}
        </div>
      )}
      <div className="px-4 py-3 space-y-2.5">
        <div>
          <p className="text-[13px] font-bold text-gray-800">{m.title}</p>
          {m.description && (
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              {m.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-100">
          <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span className="text-[12px] text-gray-700 font-semibold">
            {new Date(m.startDate).toLocaleDateString('id-ID', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {m.duration && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-bold">
              <Clock className="w-2.5 h-2.5" />
              {m.duration} mnt
            </span>
          )}
          {m.maxParticipant && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-purple-50 border border-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-bold">
              <Users className="w-2.5 h-2.5" />
              {m.maxParticipant} org
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-black">
            {m.type === 'LIVECLASS' ? (
              <GraduationCap className="w-2.5 h-2.5" />
            ) : m.type === 'LIVESTREAM' ? (
              <Tv className="w-2.5 h-2.5" />
            ) : (
              <Mic2 className="w-2.5 h-2.5" />
            )}
            {m.type === 'LIVECLASS'
              ? 'Live Class'
              : m.type === 'LIVESTREAM'
                ? 'Livestream'
                : 'Webinar'}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Tryout metadata card ─────────────────────────────────────────────────────

const TryoutCard = ({
  notificationPopUp,
}: {
  notificationPopUp: PopupNotif;
}) => {
  const m = notificationPopUp.metadata as Tryout;
  if (!m || typeof m !== 'object') return null;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

  return (
    <div className="mx-4 mb-2 rounded-[16px] overflow-hidden bg-slate-50 border border-slate-100">
      <div className="px-4 py-3 space-y-2.5">
        <p className="text-[13px] font-bold text-gray-800">{m.title}</p>
        <div className="bg-white rounded-xl border border-slate-100 px-3 py-2.5 space-y-2">
          {[
            { color: 'bg-emerald-500', label: 'Mulai', val: fmt(m.startDate) },
            { color: 'bg-orange-500', label: 'Berakhir', val: fmt(m.endDate) },
            { color: 'bg-purple-500', label: 'Hasil', val: fmt(m.resultDate) },
          ].map(({ color, label, val }) => (
            <div
              key={label}
              className="flex items-center gap-2"
            >
              <span
                className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', color)}
              />
              <span className="text-[11px] text-slate-400 font-medium w-14 flex-shrink-0">
                {label}
              </span>
              <span className="text-[11px] font-bold text-gray-800">{val}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {m.restTime && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">
              <Clock className="w-2.5 h-2.5" />
              Istirahat {m.restTime}h
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold">
            <Trophy className="w-2.5 h-2.5" />
            Tryout Resmi
          </span>
        </div>
      </div>
    </div>
  );
};
