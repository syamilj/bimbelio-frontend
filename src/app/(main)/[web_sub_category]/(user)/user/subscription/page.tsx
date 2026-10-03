'use client';

import { DialogJoinDiscord } from '@/components/_shared/dialog/dialog-join-discord';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { siteHref } from '@/lib/surface';
import { cn, getDateString } from '@/lib/utils';
import { formatIDR } from '@/lib/utils/currency';
import { formatDateRange } from '@/lib/utils/date';
import {
  Calendar,
  Check,
  Clock,
  Coins,
  Crown,
  FileText,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Star,
  TrendingUp,
  Video,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionPage() {
  const { data: userSession } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { setTransactionPopUp } = useAppContext();
  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#4C94FF';
  const userTier = userSession?.user.tier;

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
        return <FileText className="h-3.5 w-3.5" />;
      case 'COURSE':
        return <GraduationCap className="h-3.5 w-3.5" />;
      case 'LIVECLASS':
        return <Video className="h-3.5 w-3.5" />;
      default:
        return <Check className="h-3.5 w-3.5" />;
    }
  };

  const hasActiveSubscription =
    userSession?.user.subsList && userSession.user.subsList.length > 0;
  const hasPendingSubscription =
    userSession?.user.subsPendingList &&
    userSession.user.subsPendingList.length > 0;

  return (
    <div className="space-y-4 px-4 pb-6 md:px-0">
      {/* Status Member Hero */}
      {userTier && userTier !== 'USER' && (
        <div
          className="relative overflow-hidden rounded-3xl p-5 text-white"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-white/20">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <p className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-white/70 uppercase">
                <Star className="h-3 w-3" />
                Status Member
              </p>
              <h2 className="text-xl font-black">
                {userSession?.user.subsList?.length || 0} Active Member
              </h2>
              <p className="text-xs text-white/70">
                Akses unlimited ke semua fitur premium
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Subscriptions */}
      {hasActiveSubscription ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-3xl"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Zap
                  className="h-4 w-4"
                  style={{ color: mainColor }}
                />
              </div>
              <h3 className="text-base font-black text-slate-800">
                Subscription Aktif
              </h3>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: mainColor }}
            >
              {userSession.user.subsList.length} Paket
            </span>
          </div>

          {userSession.user.subsList.map((sub) => {
            const isInstallment = sub.paymentType === 'INSTALLMENT';
            let currentInstallment:
              (typeof sub.SubscriptionInstallment)[0] | null =
              sub.SubscriptionInstallment[
                sub.SubscriptionInstallment.length - 1
              ] || null;

            sub.SubscriptionInstallment.forEach((inst) => {
              if (
                currentInstallment &&
                inst.isPaid === false &&
                inst.installmentNumber < currentInstallment?.installmentNumber
              ) {
                currentInstallment = inst;
              }
            });

            return (
              <div
                key={sub.id}
                className="space-y-3 rounded-3xl border border-emerald-200 bg-white p-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <span
                      className="inline-flex items-center gap-1 rounded-3xl px-2.5 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Crown className="h-3 w-3" />
                      {sub.planTier}
                    </span>
                    <h4 className="text-base font-black text-slate-800">
                      {sub.planName}
                    </h4>
                  </div>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Description */}
                <p className="line-clamp-2 text-sm text-slate-500">
                  {sub.planDescription}
                </p>

                {/* Features */}
                {sub.SubscriptionFeature &&
                  sub.SubscriptionFeature.length > 0 && (
                    <div>
                      <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        <Sparkles
                          className="h-3 w-3"
                          style={{ color: mainColor }}
                        />
                        Fitur Aktif:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.SubscriptionFeature.map((feature) => (
                          <span
                            key={feature.id}
                            className="inline-flex items-center gap-1 rounded-3xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                          >
                            {getFeatureIcon(feature.type)}
                            {feature.type === 'DOCUMENT' && 'Document'}
                            {feature.type === 'COURSE' && 'Course'}
                            {feature.type === 'LIVECLASS' && 'Live Class'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Installment Schedule */}
                {isInstallment &&
                  sub.SubscriptionInstallment &&
                  sub.SubscriptionInstallment.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        <Clock className="h-3 w-3 text-blue-500" />
                        Jadwal Cicilan
                      </p>
                      {sub.SubscriptionInstallment.map((installment) => (
                        <div
                          key={installment.id}
                          className={cn(
                            'flex items-center justify-between rounded-3xl border p-2.5 text-sm',
                            installment.isPaid
                              ? 'border-emerald-200 bg-emerald-50'
                              : 'border-blue-200 bg-blue-50',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-black text-slate-600">
                              #{installment.installmentNumber}
                            </span>
                            <span className="font-bold text-slate-800">
                              {formatIDR(installment.amount)}
                            </span>
                            {installment.isPaid && (
                              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                                ✓ Lunas
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {getDateString(installment.dueDate)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Expiry */}
                <div className="flex items-center gap-2 rounded-3xl border border-orange-100 bg-orange-50 p-2.5">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-[10px] text-slate-500">Berakhir pada</p>
                    <p className="text-sm font-black text-orange-600">
                      {new Date(sub.planExpire).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {sub.discord_invite_link && (
                    <DialogJoinDiscord inviteLink={sub.discord_invite_link}>
                      <Button
                        asChild
                        className="h-9 w-full rounded-3xl bg-[#5865F2] text-xs font-bold text-white hover:bg-[#4752C4]"
                      >
                        <div>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="mr-1.5"
                          >
                            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
                          </svg>
                          Gabung Discord
                        </div>
                      </Button>
                    </DialogJoinDiscord>
                  )}
                  <Button
                    asChild
                    className="h-9 w-full rounded-3xl text-xs font-bold text-white"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Link href={siteHref(`/price/${sub.planSlug}`)}>
                      <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                      Lihat Detail Paket
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 py-10 text-center">
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-3xl"
            style={{ backgroundColor: `${mainColor}12` }}
          >
            <Sparkles
              className="h-6 w-6"
              style={{ color: mainColor }}
            />
          </div>
          <h3 className="mb-1 text-base font-black text-slate-700">
            Belum Ada Subscription
          </h3>
          <p className="mx-auto max-w-xs text-sm text-slate-400">
            Upgrade ke premium untuk akses unlimited semua fitur
          </p>
        </div>
      )}

      {/* Pending Subscriptions */}
      {hasPendingSubscription && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-3xl bg-amber-50">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <h3 className="text-base font-black text-slate-800">
                Subscription Pending
              </h3>
            </div>
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
              {userSession!.user.subsPendingList.length} Paket
            </span>
          </div>

          {userSession!.user.subsPendingList.map((subPending) => (
            <div
              key={subPending.id}
              className="space-y-3 rounded-3xl border border-amber-200 bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-3xl bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {subPending.planTier}
                    </span>
                    <span className="rounded-3xl bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      PENDING
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-800">
                    {subPending.planName}
                  </h4>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <Calendar className="h-4 w-4 text-amber-600" />
                </div>
              </div>

              <p className="line-clamp-2 text-sm text-slate-500">
                {subPending.planDescription}
              </p>

              {/* Pending Features */}
              {subPending.SubscriptionPendingFeature &&
                subPending.SubscriptionPendingFeature.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Fitur yang Akan Aktif
                    </p>
                    {subPending.SubscriptionPendingFeature.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center justify-between rounded-3xl border border-amber-100 bg-amber-50 p-2"
                      >
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                          {getFeatureIcon(feature.type)}
                          {feature.type === 'DOCUMENT' && 'Document'}
                          {feature.type === 'COURSE' && 'Course'}
                          {feature.type === 'LIVECLASS' && 'Live Class'}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {formatDateRange(
                            feature.validFrom,
                            feature.validUntil,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              {/* Pending Limitation (Coin) */}
              {subPending.SubscriptionPendingLimitation && (
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-3">
                  <p className="mb-2 flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <Coins className="h-3 w-3" />
                    Coin yang Akan Diterima
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      {
                        icon: MessageSquare,
                        label: 'Chat',
                        value: subPending.SubscriptionPendingLimitation.chat,
                        color: '#3b82f6',
                      },
                      {
                        icon: FileText,
                        label: 'Notes',
                        value: subPending.SubscriptionPendingLimitation.notes,
                        color: '#10b981',
                      },
                      {
                        icon: Video,
                        label: 'Vision',
                        value: subPending.SubscriptionPendingLimitation.vision,
                        color: '#8b5cf6',
                      },
                      {
                        icon: GraduationCap,
                        label: 'Quiz',
                        value: subPending.SubscriptionPendingLimitation.quiz,
                        color: '#f59e0b',
                      },
                      {
                        icon: Star,
                        label: 'Tryout',
                        value: subPending.SubscriptionPendingLimitation.tryout,
                        color: '#ef4444',
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-1.5 rounded-3xl border border-slate-100 bg-white p-2"
                      >
                        <item.icon
                          className="h-3 w-3"
                          style={{ color: item.color }}
                        />
                        <div>
                          <p className="text-[9px] text-slate-400">
                            {item.label}
                          </p>
                          <p
                            className="text-xs font-black"
                            style={{ color: item.color }}
                          >
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 flex items-center gap-1 border-t border-slate-100 pt-2 text-[10px] font-bold text-emerald-600">
                    <Check className="h-3 w-3" />
                    Aktif{' '}
                    {formatDateRange(
                      subPending.SubscriptionPendingLimitation.validFrom,
                      subPending.SubscriptionPendingLimitation.validUntil,
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <Button
        className="h-11 w-full gap-2 rounded-3xl text-sm font-bold text-white transition-all hover:scale-[1.01]"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
        onClick={() => setTransactionPopUp(true)}
      >
        <Sparkles className="h-4 w-4" />
        Beli Subscription Premium
      </Button>
    </div>
  );
}
