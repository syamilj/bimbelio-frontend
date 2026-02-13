'use client';

import { DialogJoinDiscord } from '@/components/_shared/dialog/dialog-join-discord';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, getDateString, getHours } from '@/lib/utils';
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
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  const userTier = userSession?.user.tier;

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return <FileText className="w-3.5 h-3.5" />;
      case 'COURSE': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'LIVECLASS': return <Video className="w-3.5 h-3.5" />;
      default: return <Check className="w-3.5 h-3.5" />;
    }
  };

  const hasActiveSubscription =
    userSession?.user.subsList && userSession.user.subsList.length > 0;
  const hasPendingSubscription =
    userSession?.user.subsPendingList && userSession.user.subsPendingList.length > 0;

  return (
    <div className="space-y-4 px-4 md:px-0 pb-6">
      {/* Status Member Hero */}
      {userTier && userTier !== 'USER' && (
        <div
          className="rounded-3xl p-5 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-3xl bg-white/20 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 flex items-center gap-1">
                <Star className="w-3 h-3" />
                Status Member
              </p>
              <h2 className="text-xl font-black">{userSession?.user.subsList?.length || 0} Active Member</h2>
              <p className="text-white/70 text-xs">Akses unlimited ke semua fitur premium</p>
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
                className="w-8 h-8 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Zap className="w-4 h-4" style={{ color: mainColor }} />
              </div>
              <h3 className="text-base font-black text-slate-800">Subscription Aktif</h3>
            </div>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: mainColor }}
            >
              {userSession.user.subsList.length} Paket
            </span>
          </div>

          {userSession.user.subsList.map((sub) => {
            const isInstallment = sub.paymentType === 'INSTALLMENT';
            let currentInstallment:
              | (typeof sub.SubscriptionInstallment)[0]
              | null =
              sub.SubscriptionInstallment[sub.SubscriptionInstallment.length - 1] || null;

            sub.SubscriptionInstallment.forEach((inst) => {
              if (currentInstallment && inst.isPaid === false && inst.installmentNumber < currentInstallment?.installmentNumber) {
                currentInstallment = inst;
              }
            });

            return (
              <div
                key={sub.id}
                className="rounded-3xl border border-emerald-200 bg-white p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-3xl text-white"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Crown className="w-3 h-3" />
                      {sub.planTier}
                    </span>
                    <h4 className="text-base font-black text-slate-800">{sub.planName}</h4>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 line-clamp-2">{sub.planDescription}</p>

                {/* Features */}
                {sub.SubscriptionFeature && sub.SubscriptionFeature.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" style={{ color: mainColor }} />
                      Fitur Aktif:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.SubscriptionFeature.map((feature) => (
                        <span
                          key={feature.id}
                          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-3xl bg-slate-50 border border-slate-200 text-slate-600"
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
                {isInstallment && sub.SubscriptionInstallment && sub.SubscriptionInstallment.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      Jadwal Cicilan
                    </p>
                    {sub.SubscriptionInstallment.map((installment) => (
                      <div
                        key={installment.id}
                        className={cn(
                          'flex items-center justify-between p-2.5 rounded-3xl border text-sm',
                          installment.isPaid
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-blue-50 border-blue-200',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black bg-white px-1.5 py-0.5 rounded text-slate-600">
                            #{installment.installmentNumber}
                          </span>
                          <span className="font-bold text-slate-800">{formatIDR(installment.amount)}</span>
                          {installment.isPaid && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">✓ Lunas</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{getDateString(installment.dueDate)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Expiry */}
                <div className="flex items-center gap-2 p-2.5 bg-orange-50 border border-orange-100 rounded-3xl">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-[10px] text-slate-500">Berakhir pada</p>
                    <p className="text-sm font-black text-orange-600">
                      {new Date(sub.planExpire).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {sub.discord_invite_link && (
                    <DialogJoinDiscord inviteLink={sub.discord_invite_link}>
                      <Button asChild className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-3xl h-9 text-xs font-bold">
                        <div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5">
                            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
                          </svg>
                          Gabung Discord
                        </div>
                      </Button>
                    </DialogJoinDiscord>
                  )}
                  <Button asChild className="w-full text-white rounded-3xl h-9 text-xs font-bold" style={{ backgroundColor: mainColor }}>
                    <Link href={`/price/${sub.planSlug}`}>
                      <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
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
            className="w-12 h-12 rounded-3xl mx-auto mb-3 flex items-center justify-center"
            style={{ backgroundColor: `${mainColor}12` }}
          >
            <Sparkles className="w-6 h-6" style={{ color: mainColor }} />
          </div>
          <h3 className="text-base font-black text-slate-700 mb-1">Belum Ada Subscription</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Upgrade ke premium untuk akses unlimited semua fitur
          </p>
        </div>
      )}

      {/* Pending Subscriptions */}
      {hasPendingSubscription && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-3xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-base font-black text-slate-800">Subscription Pending</h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white">
              {userSession!.user.subsPendingList.length} Paket
            </span>
          </div>

          {userSession!.user.subsPendingList.map((subPending) => (
            <div
              key={subPending.id}
              className="rounded-3xl border border-amber-200 bg-white p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-3xl bg-amber-500 text-white">
                      {subPending.planTier}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-3xl bg-amber-100 text-amber-700">
                      PENDING
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-800">{subPending.planName}</h4>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-amber-600" />
                </div>
              </div>

              <p className="text-sm text-slate-500 line-clamp-2">{subPending.planDescription}</p>

              {/* Pending Features */}
              {subPending.SubscriptionPendingFeature && subPending.SubscriptionPendingFeature.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fitur yang Akan Aktif</p>
                  {subPending.SubscriptionPendingFeature.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-2 rounded-3xl bg-amber-50 border border-amber-100"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        {getFeatureIcon(feature.type)}
                        {feature.type === 'DOCUMENT' && 'Document'}
                        {feature.type === 'COURSE' && 'Course'}
                        {feature.type === 'LIVECLASS' && 'Live Class'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        {formatDateRange(feature.validFrom, feature.validUntil)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pending Limitation (Coin) */}
              {subPending.SubscriptionPendingLimitation && (
                <div className="p-3 rounded-3xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    Coin yang Akan Diterima
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { icon: MessageSquare, label: 'Chat', value: subPending.SubscriptionPendingLimitation.chat, color: '#3b82f6' },
                      { icon: FileText, label: 'Notes', value: subPending.SubscriptionPendingLimitation.notes, color: '#10b981' },
                      { icon: Video, label: 'Vision', value: subPending.SubscriptionPendingLimitation.vision, color: '#8b5cf6' },
                      { icon: GraduationCap, label: 'Quiz', value: subPending.SubscriptionPendingLimitation.quiz, color: '#f59e0b' },
                      { icon: Star, label: 'Tryout', value: subPending.SubscriptionPendingLimitation.tryout, color: '#ef4444' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5 p-2 bg-white rounded-3xl border border-slate-100">
                        <item.icon className="w-3 h-3" style={{ color: item.color }} />
                        <div>
                          <p className="text-[9px] text-slate-400">{item.label}</p>
                          <p className="text-xs font-black" style={{ color: item.color }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold mt-2 pt-2 border-t border-slate-100 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Aktif {formatDateRange(subPending.SubscriptionPendingLimitation.validFrom, subPending.SubscriptionPendingLimitation.validUntil)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <Button
        className="w-full gap-2 rounded-3xl text-white h-11 text-sm font-bold transition-all hover:scale-[1.01]"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
        onClick={() => setTransactionPopUp(true)}
      >
        <Sparkles className="w-4 h-4" />
        Beli Subscription Premium
      </Button>
    </div>
  );
}
