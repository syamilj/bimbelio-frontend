import {
  AlertCircle,
  Bell,
  BookOpen,
  Camera,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Gift,
  GraduationCap,
  MessageSquare,
  Mic2,
  Music,
  Radio,
  Trophy,
  Tv,
  Users,
  Zap,
} from 'lucide-react';
import React from 'react';

// re-export for popup metadata card usage
export { Camera, Clock, GraduationCap, Mic2, Music, Tv, Users };

// ─── Priority helpers ────────────────────────────────────────────────────────

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-50 border-red-200';
    case 'HIGH':
      return 'bg-orange-50 border-orange-200';
    case 'NORMAL':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export const getPriorityBorderColor = (priority: string) => {
  switch (priority) {
    case 'URGENT':
      return 'border-l-red-500';
    case 'HIGH':
      return 'border-l-orange-500';
    case 'NORMAL':
      return 'border-l-blue-500';
    default:
      return 'border-l-gray-400';
  }
};

export const getPriorityGradient = (priority: string) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-gradient-to-br from-red-50 to-transparent';
    case 'HIGH':
      return 'bg-gradient-to-br from-orange-50 to-transparent';
    case 'NORMAL':
      return 'bg-gradient-to-br from-blue-50 to-transparent';
    default:
      return 'bg-gradient-to-br from-gray-50 to-transparent';
  }
};

export const getPriorityIcon = (priority: string, size: 'sm' | 'md' = 'md') => {
  const cls = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  switch (priority) {
    case 'URGENT':
      return <AlertCircle className={`${cls} text-red-600`} />;
    case 'HIGH':
      return <Zap className={`${cls} text-orange-600`} />;
    default:
      return <Bell className={`${cls} text-blue-600`} />;
  }
};

// ─── Type icon helpers ────────────────────────────────────────────────────────

export const getTypeIcon = (type: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  const cls =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';

  switch (type) {
    case 'PAYMENT_SUCCESSFUL':
    case 'PAYMENT_FAILED':
    case 'PAYMENT_REMINDER':
      return <CreditCard className={`${cls} text-green-600`} />;

    case 'ORDER_CONFIRMATION':
    case 'ORDER_SHIPPED':
    case 'ORDER_DELIVERED':
    case 'REFUND_PROCESSED':
      return <CheckCircle className={`${cls} text-emerald-600`} />;

    case 'SUBSCRIPTION_ACTIVATED':
    case 'SUBSCRIPTION_RENEWED':
    case 'SUBSCRIPTION_EXPIRING':
    case 'SUBSCRIPTION_EXPIRED':
    case 'INSTALLMENT_REMINDER':
    case 'INSTALLMENT_DUE':
      return <Clock className={`${cls} text-purple-600`} />;

    case 'COURSE_ENROLLED':
    case 'COURSE_PROGRESS':
    case 'COURSE_COMPLETED':
    case 'NEW_COURSE_AVAILABLE':
      return <FileText className={`${cls} text-blue-600`} />;

    case 'TRYOUT_AVAILABLE':
    case 'TRYOUT_STARTED':
    case 'TRYOUT_COMPLETED':
    case 'TRYOUT_RESULTS':
      return <Trophy className={`${cls} text-amber-600`} />;

    case 'LIVECLASS_SCHEDULED':
    case 'LIVECLASS_REMINDER':
    case 'LIVECLASS_REGISTRATION_CONFIRMED':
    case 'LIVECLASS_ENDED':
      return <Tv className={`${cls} text-blue-600`} />;

    case 'LIVECLASS_STARTING':
      return <Radio className={`${cls} text-blue-600`} />;

    case 'COURSE_UPDATE':
      return <BookOpen className={`${cls} text-sky-600`} />;

    case 'NEW_MESSAGE':
    case 'MESSAGE_REPLY':
      return <MessageSquare className={`${cls} text-cyan-600`} />;

    case 'PROMOTION':
    case 'SPECIAL_OFFER':
      return <Gift className={`${cls} text-pink-600`} />;

    case 'VISION_USAGE':
      return <Eye className={`${cls} text-indigo-600`} />;

    case 'SYSTEM_ALERT':
      return <AlertCircle className={`${cls} text-slate-600`} />;

    case 'ANNOUNCEMENT':
      return <Bell className={`${cls} text-slate-600`} />;

    default:
      return <Bell className={`${cls} text-gray-500`} />;
  }
};

// ─── Type accent color (left border strip for unread) ───────────────────────────────

export const getTypeAccentColor = (type: string, priority: string): string => {
  if (priority === 'URGENT') return 'border-l-red-400';
  if (
    ['PAYMENT_SUCCESSFUL', 'REFUND_PROCESSED', 'ORDER_CONFIRMATION', 'ORDER_SHIPPED', 'ORDER_DELIVERED'].includes(type)
  ) return 'border-l-emerald-400';
  if (['PAYMENT_FAILED', 'PAYMENT_REMINDER'].includes(type)) return 'border-l-rose-400';
  if (
    ['SUBSCRIPTION_ACTIVATED', 'SUBSCRIPTION_RENEWED', 'SUBSCRIPTION_EXPIRING', 'SUBSCRIPTION_EXPIRED',
     'SUBSCRIPTION_CANCELED', 'INSTALLMENT_REMINDER', 'INSTALLMENT_DUE', 'INSTALLMENT_OVERDUE'].includes(type)
  ) return 'border-l-purple-400';
  if (['TRYOUT_AVAILABLE', 'TRYOUT_STARTED', 'TRYOUT_COMPLETED', 'TRYOUT_RESULTS'].includes(type)) return 'border-l-amber-400';
  if (
    ['LIVECLASS_SCHEDULED', 'LIVECLASS_REMINDER', 'LIVECLASS_STARTING', 'LIVECLASS_ENDED',
     'LIVECLASS_REGISTRATION_CONFIRMED'].includes(type)
  ) return 'border-l-blue-400';
  if (['PROMOTION', 'SPECIAL_OFFER'].includes(type)) return 'border-l-pink-400';
  if (['NEW_MESSAGE', 'MESSAGE_REPLY'].includes(type)) return 'border-l-cyan-400';
  if (
    ['COURSE_ENROLLED', 'COURSE_PROGRESS', 'COURSE_COMPLETED', 'NEW_COURSE_AVAILABLE', 'COURSE_UPDATE'].includes(type)
  ) return 'border-l-sky-400';
  if (priority === 'HIGH') return 'border-l-amber-400';
  return 'border-l-slate-300';
};

// ─── Type icon background ────────────────────────────────────────────────────

export const getTypeIconBg = (type: string, priority: string): string => {
  if (priority === 'URGENT') return 'bg-red-100';
  if (
    ['PAYMENT_SUCCESSFUL', 'REFUND_PROCESSED', 'ORDER_CONFIRMATION', 'ORDER_SHIPPED', 'ORDER_DELIVERED'].includes(type)
  ) return 'bg-emerald-100';
  if (['PAYMENT_FAILED', 'PAYMENT_REMINDER'].includes(type)) return 'bg-rose-100';
  if (
    ['SUBSCRIPTION_ACTIVATED', 'SUBSCRIPTION_RENEWED', 'SUBSCRIPTION_EXPIRING', 'SUBSCRIPTION_EXPIRED',
     'SUBSCRIPTION_CANCELED', 'INSTALLMENT_REMINDER', 'INSTALLMENT_DUE', 'INSTALLMENT_OVERDUE'].includes(type)
  ) return 'bg-purple-100';
  if (['TRYOUT_AVAILABLE', 'TRYOUT_STARTED', 'TRYOUT_COMPLETED', 'TRYOUT_RESULTS'].includes(type)) return 'bg-amber-100';
  if (
    ['LIVECLASS_SCHEDULED', 'LIVECLASS_REMINDER', 'LIVECLASS_STARTING', 'LIVECLASS_ENDED',
     'LIVECLASS_REGISTRATION_CONFIRMED'].includes(type)
  ) return 'bg-blue-100';
  if (['PROMOTION', 'SPECIAL_OFFER'].includes(type)) return 'bg-pink-100';
  if (['NEW_MESSAGE', 'MESSAGE_REPLY'].includes(type)) return 'bg-cyan-100';
  if (
    ['COURSE_ENROLLED', 'COURSE_PROGRESS', 'COURSE_COMPLETED', 'NEW_COURSE_AVAILABLE', 'COURSE_UPDATE'].includes(type)
  ) return 'bg-sky-100';
  if (priority === 'HIGH') return 'bg-amber-100';
  return 'bg-slate-100';
};

// ─── Label helpers ────────────────────────────────────────────────────────────

export const getTypeLabel = (type: string) =>
  type
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');

export const getCategoryLabel = (category: string) => {
  const map: Record<string, string> = {
    PAYMENT: 'Pembayaran',
    SUBSCRIPTION: 'Langganan',
    COURSE: 'Kursus',
    TRYOUT: 'Tryout',
    LIVE_CLASS: 'Live Class',
    SYSTEM: 'Sistem',
    PROMOTION: 'Promosi',
    GENERAL: 'Umum',
  };
  return map[category] ?? category;
};

// ─── Time helpers ─────────────────────────────────────────────────────────────

export const formatTimeAgo = (date: string) => {
  const now = new Date();
  const notifDate = new Date(date);
  const diffMs = now.getTime() - notifDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins}m lalu`;
  if (diffHours < 24) return `${diffHours}j lalu`;
  if (diffDays < 7) return `${diffDays}h lalu`;
  return notifDate.toLocaleDateString('id-ID');
};

// ─── Priority badge helpers ───────────────────────────────────────────────────

export const getPriorityLabel = (priority: string) => {
  if (priority === 'URGENT') return 'Mendesak';
  if (priority === 'HIGH') return 'Penting';
  return 'Info';
};

export const getPriorityBadgeCls = (priority: string) => {
  if (priority === 'URGENT') return 'bg-red-500 text-white';
  if (priority === 'HIGH') return 'bg-amber-500 text-white';
  return 'bg-slate-200 text-slate-600';
};

// ─── Header gradient for popup (no-image variant) ─────────────────────────────

export const getTypeHeaderGradient = (type: string, priority: string): string => {
  if (priority === 'URGENT') return 'from-red-50 to-white';
  if (['PAYMENT_SUCCESSFUL', 'REFUND_PROCESSED', 'ORDER_CONFIRMATION', 'ORDER_SHIPPED', 'ORDER_DELIVERED'].includes(type))
    return 'from-emerald-50 to-white';
  if (['PAYMENT_FAILED', 'PAYMENT_REMINDER'].includes(type))
    return 'from-rose-50 to-white';
  if (['SUBSCRIPTION_ACTIVATED', 'SUBSCRIPTION_RENEWED', 'SUBSCRIPTION_EXPIRING', 'SUBSCRIPTION_EXPIRED', 'SUBSCRIPTION_CANCELED', 'INSTALLMENT_REMINDER', 'INSTALLMENT_DUE', 'INSTALLMENT_OVERDUE'].includes(type))
    return 'from-purple-50 to-white';
  if (['TRYOUT_AVAILABLE', 'TRYOUT_STARTED', 'TRYOUT_COMPLETED', 'TRYOUT_RESULTS'].includes(type))
    return 'from-amber-50 to-white';
  if (['LIVECLASS_SCHEDULED', 'LIVECLASS_REMINDER', 'LIVECLASS_STARTING', 'LIVECLASS_ENDED', 'LIVECLASS_REGISTRATION_CONFIRMED'].includes(type))
    return 'from-blue-50 to-white';
  if (['PROMOTION', 'SPECIAL_OFFER'].includes(type))
    return 'from-pink-50 to-white';
  if (['COURSE_ENROLLED', 'COURSE_PROGRESS', 'COURSE_COMPLETED', 'NEW_COURSE_AVAILABLE', 'COURSE_UPDATE'].includes(type))
    return 'from-sky-50 to-white';
  if (['NEW_MESSAGE', 'MESSAGE_REPLY'].includes(type))
    return 'from-cyan-50 to-white';
  if (priority === 'HIGH') return 'from-amber-50 to-white';
  return 'from-slate-50 to-white';
};
