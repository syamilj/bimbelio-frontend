// src/app/(user)/layout-user-client.tsx

'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { formatIDR } from '@/lib/utils/currency';
import { formatDateRange } from '@/lib/utils/date';
import { ChevronDown, Clock, Crown, Settings, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export const BadgeSubsInfo = () => {
  const { data: userSession } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const userTier = userSession?.user.tier;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    minimizeSidebar,
    setSidebarMobile,
    setTransactionPopUp,
    setPagesSetting,
  } = useAppContext();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isPremiumRole =
    userTier === 'ADMIN' || userTier === 'SUPER_ADMIN' || userTier === 'PREMIUM';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Badge */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-3xl text-white text-sm font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
      >
        <Crown className="w-4 h-4" />
        <span>{isPremiumRole ? 'Premium' : userTier || 'Free Tier'}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-[340px] bg-white rounded-3xl border border-slate-200 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <p className="text-sm font-black text-white">Subscription Aktif</p>
            <button
              onClick={() => setOpen(false)}
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 max-h-[70vh] overflow-y-auto space-y-3">
            {/* Admin/Role Badge */}
            {userSession?.user.role !== 'USER' && (
              <div className="flex items-center gap-2 p-2.5 rounded-3xl bg-slate-50 border border-slate-100">
                <div
                  className="w-8 h-8 rounded-3xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: mainColor }}
                >
                  <Crown className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-800">{userTier}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Current Role</p>
                </div>
              </div>
            )}

            {/* Active Subscriptions */}
            {userSession?.user.subsList &&
            userSession.user.subsList.length > 0 ? (
              <div className="space-y-2">
                {userSession.user.subsList.map((sub) => {
                  const isInstallment = sub.paymentType === 'INSTALLMENT';
                  let currentInstallment:
                    | (typeof sub.SubscriptionInstallment)[0]
                    | null =
                    sub.SubscriptionInstallment[
                      sub.SubscriptionInstallment.length - 1
                    ] || null;

                  sub.SubscriptionInstallment.forEach((inst) => {
                    if (
                      currentInstallment &&
                      inst.isPaid === false &&
                      inst.installmentNumber <
                        currentInstallment?.installmentNumber
                    ) {
                      currentInstallment = inst;
                    }
                  });
                  return (
                    <div
                      key={sub.id}
                      className="p-3 rounded-3xl bg-emerald-50/80 border border-emerald-200/60"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-full text-white font-bold shrink-0"
                          style={{ backgroundColor: mainColor }}
                        >
                          {sub.planTier}
                        </span>
                      </div>
                      <p className="text-xs font-black text-slate-800 mb-1">
                        {sub.planName}
                      </p>
                      <p className="text-[11px] text-slate-500 mb-2 line-clamp-2">
                        {sub.planDescription}
                      </p>

                      {/* Features */}
                      {sub.SubscriptionFeature &&
                        sub.SubscriptionFeature.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {sub.SubscriptionFeature.map((feature) => (
                              <span
                                key={feature.id}
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-white text-slate-600 font-medium border border-slate-200"
                              >
                                {feature.type === 'DOCUMENT' && '📄 Document'}
                                {feature.type === 'COURSE' && '📚 Course'}
                                {feature.type === 'LIVECLASS' && '🎥 Live Class'}
                                {feature.type === 'QUIZ' && '💯 Quiz'}
                              </span>
                            ))}
                          </div>
                        )}

                      {/* Installment Info - Unpaid */}
                      {isInstallment &&
                        currentInstallment &&
                        !currentInstallment.isPaid && (
                          <div className="p-2 rounded-3xl bg-amber-50 border border-amber-200/60 mb-2">
                            <p className="text-[10px] font-bold text-amber-800 mb-1.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Cicilan #{currentInstallment.installmentNumber}
                            </p>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-black text-slate-800">
                                {formatIDR(currentInstallment.amount)}
                              </span>
                              {new Date(currentInstallment.dueDate) < new Date() ? (
                                <Badge className="bg-red-100 text-red-600 border-0 text-[9px] px-1.5 py-0 font-bold">
                                  Tertunda
                                </Badge>
                              ) : (
                                <Badge className="bg-blue-100 text-blue-600 border-0 text-[9px] px-1.5 py-0 font-bold">
                                  Menunggu
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-3 text-[9px]">
                              <div>
                                <p className="text-amber-600 font-bold">Jatuh Tempo</p>
                                <p className="text-slate-700 font-bold">
                                  {new Date(currentInstallment.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                              <div>
                                <p className="text-amber-600 font-bold">Tenggang</p>
                                <p className="text-emerald-600 font-bold">
                                  {new Date(currentInstallment.gracePeriodEndDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                              <div>
                                <p className="text-amber-600 font-bold">Berakhir</p>
                                <p className="text-slate-700 font-bold">
                                  {new Date(currentInstallment.expiredAccessDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            </div>
                            {currentInstallment.lateFee > 0 &&
                              new Date(currentInstallment.dueDate) < new Date() && (
                                <p className="text-[9px] text-orange-600 font-bold mt-1 p-1 bg-orange-50 rounded">
                                  Denda: {formatIDR(currentInstallment.lateFee)}
                                </p>
                              )}
                            <Button
                              className="w-full mt-2 h-7 text-[11px] font-bold rounded-3xl"
                              variant="outline"
                              onClick={() => setPagesSetting('installment')}
                            >
                              Bayar Sekarang
                            </Button>
                          </div>
                        )}

                      {/* Installment Info - Paid */}
                      {isInstallment &&
                        currentInstallment &&
                        currentInstallment.isPaid && (
                          <div className="p-2 rounded-3xl bg-amber-50 border border-amber-200/60 mb-2">
                            <p className="text-[9px] text-amber-600 font-bold">Akses Berakhir</p>
                            <p className="text-xs text-slate-800 font-bold">
                              {new Date(currentInstallment.expiredAccessDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        )}

                      {sub.paymentType === 'FULL_PAYMENT' && (
                        <p className="text-[10px] text-slate-400 font-medium">
                          Expired: {new Date(sub.planExpire).toLocaleDateString('id-ID')}
                        </p>
                      )}

                      <Button
                        asChild
                        variant="outline"
                        className="w-full mt-1 h-7 text-[11px] font-bold rounded-3xl border-slate-200"
                      >
                        <Link href={`/price/${sub.planSlug}`}>Lihat Detail</Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-center">
                <div
                  className="w-10 h-10 rounded-3xl mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <Crown className="w-5 h-5" style={{ color: mainColor }} />
                </div>
                <p className="text-xs font-bold text-slate-500">
                  Tidak ada subscription aktif
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Upgrade untuk akses fitur premium
                </p>
              </div>
            )}

            {/* Subscription Pending */}
            {userSession?.user.subsPendingList &&
              userSession.user.subsPendingList.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-xs font-black text-amber-600 text-center">
                    Subscription Pending
                  </p>
                  <div className="space-y-2">
                    {userSession.user.subsPendingList.map((subPending) => (
                      <div
                        key={subPending.id}
                        className="p-3 rounded-3xl bg-amber-50/80 border border-amber-200/60"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] px-2 py-0.5 rounded-full text-white font-bold bg-amber-500">
                            {subPending.planTier === 'Limitation' ? 'Koin' : subPending.planTier}
                          </span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">
                            PENDING
                          </span>
                        </div>
                        <p className="text-xs font-black text-slate-800 mb-1">{subPending.planName}</p>
                        <p className="text-[11px] text-slate-500 mb-2 line-clamp-2">{subPending.planDescription}</p>

                        {subPending.SubscriptionPendingFeature &&
                          subPending.SubscriptionPendingFeature.length > 0 && (
                            <div className="space-y-1 mb-2">
                              {subPending.SubscriptionPendingFeature.map((feature) => (
                                <div
                                  key={feature.id}
                                  className="flex items-center justify-between p-1.5 rounded-3xl bg-white border border-amber-100"
                                >
                                  <span className="text-[10px] font-bold text-slate-600">
                                    {feature.type === 'DOCUMENT' && '📄 Document'}
                                    {feature.type === 'COURSE' && '📚 Course'}
                                    {feature.type === 'LIVECLASS' && '🎥 Live Class'}
                                    {feature.type === 'QUIZ' && '💯 Quiz'}
                                  </span>
                                  <span className="text-[9px] text-emerald-600 font-medium">
                                    {formatDateRange(feature.validFrom, feature.validUntil)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                        {subPending.SubscriptionPendingLimitation && (
                          <div className="p-2 rounded-3xl bg-white border border-amber-100 mb-2">
                            <p className="text-[10px] font-bold text-slate-500 mb-1">Coin</p>
                            <div className="grid grid-cols-3 gap-1 text-[10px]">
                              {[
                                { label: 'Chat', value: subPending.SubscriptionPendingLimitation.chat },
                                { label: 'Notes', value: subPending.SubscriptionPendingLimitation.notes },
                                { label: 'Vision', value: subPending.SubscriptionPendingLimitation.vision },
                                { label: 'Quiz', value: subPending.SubscriptionPendingLimitation.quiz },
                                { label: 'Tryout', value: subPending.SubscriptionPendingLimitation.tryout },
                              ].map((item) => (
                                <div key={item.label} className="text-center p-1 rounded-3xl bg-slate-50">
                                  <p className="text-[9px] text-slate-400 font-bold">{item.label}</p>
                                  <p className="text-xs font-black text-slate-700">{item.value}</p>
                                </div>
                              ))}
                            </div>
                            <p className="text-[9px] text-emerald-600 font-medium mt-1.5 pt-1.5 border-t border-slate-100">
                              Aktif {formatDateRange(subPending.SubscriptionPendingLimitation.validFrom, subPending.SubscriptionPendingLimitation.validUntil)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* CTA Buttons */}
          <div className="p-3 pt-0 space-y-2">
            <div className="h-px bg-slate-100" />
            <Button
              asChild
              variant="outline"
              className="w-full gap-2 rounded-3xl border-slate-200 hover:bg-slate-50 text-xs h-9 font-bold"
              style={{ color: mainColor }}
            >
              <Link href={`/${website_sub_category_id_params}/user/subscription`}>
                <Settings className="w-3.5 h-3.5" />
                Kelola Subscription
              </Link>
            </Button>
            <Button
              className="w-full gap-2 rounded-3xl text-white text-xs h-9 font-bold hover:scale-[1.02] transition-transform"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
              onClick={() => {
                setTransactionPopUp(true);
                setOpen(false);
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Beli Subscription
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
