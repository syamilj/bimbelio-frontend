'use client';

import {
  formatTimeAgo,
  getTypeIcon,
} from '@/components/_shared/notification/_utils/notification-helpers';
import { cn } from '@/lib/utils';
import { Notification } from '@/types/database';
import { X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type NotifPartial = Omit<Notification, 'createdAt' | 'updatedAt'> & {
  createdAt?: string;
  updatedAt?: string;
};

interface NotificationToastProps {
  notif: NotifPartial;
  toastId: string | number;
}

// ─── Priority visual config ────────────────────────────────────────────────────

const priorityConfig = {
  URGENT: {
    cardShadow: '0 0 0 1.5px #fca5a5, 0 8px 24px rgba(239,68,68,0.14), 0 2px 8px rgba(0,0,0,0.05)',
    iconBg: 'bg-red-100',
    badge: 'bg-red-500 text-white',
    badgeLabel: 'Mendesak',
  },
  HIGH: {
    cardShadow: '0 0 0 1.5px #fde68a, 0 8px 24px rgba(245,158,11,0.12), 0 2px 8px rgba(0,0,0,0.05)',
    iconBg: 'bg-amber-100',
    badge: 'bg-amber-500 text-white',
    badgeLabel: 'Penting',
  },
  NORMAL: {
    cardShadow: '0 0 0 1px #e2e8f0, 0 8px 20px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.04)',
    iconBg: 'bg-slate-100',
    badge: '',
    badgeLabel: '',
  },
} as const;

// ─── Type-specific icon background ────────────────────────────────────────────

const getTypeIconStyle = (type: string, priority: string): string => {
  if (priority === 'URGENT') return 'bg-red-100';
  if (['PAYMENT_SUCCESSFUL', 'REFUND_PROCESSED', 'ORDER_CONFIRMATION', 'ORDER_SHIPPED', 'ORDER_DELIVERED'].includes(type)) return 'bg-emerald-100';
  if (['PAYMENT_FAILED', 'PAYMENT_REMINDER'].includes(type)) return 'bg-rose-100';
  if (['SUBSCRIPTION_ACTIVATED', 'SUBSCRIPTION_RENEWED', 'SUBSCRIPTION_EXPIRING', 'SUBSCRIPTION_EXPIRED', 'SUBSCRIPTION_CANCELED', 'INSTALLMENT_REMINDER', 'INSTALLMENT_DUE', 'INSTALLMENT_OVERDUE'].includes(type)) return 'bg-purple-100';
  if (['TRYOUT_AVAILABLE', 'TRYOUT_STARTED', 'TRYOUT_COMPLETED', 'TRYOUT_RESULTS'].includes(type)) return 'bg-amber-100';
  if (['LIVECLASS_SCHEDULED', 'LIVECLASS_REMINDER', 'LIVECLASS_STARTING', 'LIVECLASS_ENDED', 'LIVECLASS_REGISTRATION_CONFIRMED'].includes(type)) return 'bg-blue-100';
  if (['PROMOTION', 'SPECIAL_OFFER'].includes(type)) return 'bg-pink-100';
  if (['NEW_MESSAGE', 'MESSAGE_REPLY'].includes(type)) return 'bg-cyan-100';
  if (['COURSE_ENROLLED', 'COURSE_PROGRESS', 'COURSE_COMPLETED', 'NEW_COURSE_AVAILABLE', 'COURSE_UPDATE'].includes(type)) return 'bg-sky-100';
  if (priority === 'HIGH') return 'bg-amber-100';
  return 'bg-slate-100';
};

const getPriorityConf = (priority: string) =>
  priorityConfig[(priority as keyof typeof priorityConfig) ?? 'NORMAL'] ??
  priorityConfig.NORMAL;

// ─── Toast card ───────────────────────────────────────────────────────────────

const NotificationToastContent = ({ notif, toastId }: NotificationToastProps) => {
  const conf = getPriorityConf(notif.priority ?? 'NORMAL');
  const iconBg = getTypeIconStyle(notif.type, notif.priority ?? 'NORMAL');
  const hasAction = !!(notif.actionUrl && notif.actionUrl.length > 0);

  const card = (
    <div
      className="relative w-[min(370px,calc(100vw-20px))] rounded-[18px] bg-white overflow-hidden"
      style={{ boxShadow: conf.cardShadow }}
    >
      <div className="flex items-start gap-3 px-3.5 pt-3.5 pb-3.5">
        {/* Icon */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
            iconBg,
          )}
        >
          {getTypeIcon(notif.type, 'md')}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13.5px] font-bold text-gray-900 leading-snug line-clamp-1 flex-1">
              {notif.title}
            </p>
            {notif.priority !== 'NORMAL' && conf.badge && (
              <span
                className={cn(
                  'flex-shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full leading-none mt-0.5',
                  conf.badge,
                )}
              >
                {conf.badgeLabel}
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 mt-0.5">
            {notif.content}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            {notif.createdAt && (
              <span className="text-[10.5px] text-slate-400">
                {formatTimeAgo(notif.createdAt)}
              </span>
            )}
            {hasAction && (
              <>
                <span className="text-slate-300 text-[10px]">·</span>
                <span className="text-[10.5px] font-semibold text-slate-400">
                  Ketuk untuk lihat
                </span>
              </>
            )}
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toast.dismiss(toastId);
          }}
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  if (notif.actionUrl && notif.actionUrl.length > 0) {
    if (notif.actionUrl.startsWith('http')) {
      return (
        <a
          href={notif.actionUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => toast.dismiss(toastId)}
          className="block cursor-pointer focus:outline-none"
        >
          {card}
        </a>
      );
    }
    return (
      <Link
        href={notif.actionUrl}
        onClick={() => toast.dismiss(toastId)}
        className="block cursor-pointer focus:outline-none"
      >
        {card}
      </Link>
    );
  }

  return card;
};

// ─── Public helper ────────────────────────────────────────────────────────────

export const showNotificationToast = (notif: NotifPartial) => {
  return toast.custom(
    (toastId) => (
      <NotificationToastContent
        notif={notif}
        toastId={toastId}
      />
    ),
    {
      position: 'top-center',
      duration: 6000,
      style: {
        padding: 0,
        margin: 0,
        boxShadow: 'none',
        background: 'transparent',
      },
    },
  );
};
