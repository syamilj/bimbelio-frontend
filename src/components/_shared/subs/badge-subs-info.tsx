// src/app/(user)/layout-user-client.tsx

'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { formatIDR } from '@/lib/utils/currency';
import { formatDateRange } from '@/lib/utils/date';
import { ChevronDown, Clock, Crown, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const BadgeSubsInfo = () => {
  const { data: userSession } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const userTier = userSession?.user.tier;

  const {
    minimizeSidebar,
    setSidebarMobile,
    setTransactionPopUp,
    setPagesSetting,
  } = useAppContext();

  return (
    <>
      {userTier === 'ADMIN' ||
      userTier === 'SUPER_ADMIN' ||
      userTier === 'PREMIUM' ? (
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-white text-sm font-bold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <Crown className="w-4 h-4" />
          <span>Premium</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </div>
      ) : (
        <>
          <Tooltip delayDuration={100}>
            <TooltipTrigger className="cursor-pointer">
              <div
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-white text-sm font-bold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Crown className="w-4 h-4" />
                <span>{userTier || 'Free Tier'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="min-w-xs max-w-[350px] p-3 max-h-[90vh] overflow-y-auto"
              side="bottom"
              align="end"
            >
              <div className="space-y-3">
                {/* Subscription Aktif */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-center">
                    Subscription Aktif
                  </p>
                  {userSession?.user.subsList &&
                  userSession.user.subsList.length > 0 ? (
                    <div className="space-y-2">
                      {userSession.user.subsList.map((sub, index) => {
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
                            className="p-2 rounded-lg bg-green-50 border border-green-200"
                          >
                            <div className="flex flex-col items-start justify-center mb-1 gap-1">
                              <span
                                className="text-[9px] px-2 py-0.5 rounded-full text-white font-medium flex items-center justify-center"
                                style={{
                                  backgroundColor: mainColor,
                                }}
                              >
                                {sub.planTier}
                              </span>
                              <span className="text-xs font-semibold text-gray-900 truncate">
                                {sub.planName}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                              {sub.planDescription}
                            </p>
                            {sub.SubscriptionFeature &&
                              sub.SubscriptionFeature.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs font-medium text-gray-700 mb-1">
                                    Fitur:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {sub.SubscriptionFeature.map(
                                      (feature, featureIndex) => (
                                        <span
                                          key={feature.id}
                                          className="text-[10px] px-1.5 py-0.5 rounded-3xl bg-blue-100 text-blue-700 font-medium"
                                        >
                                          {feature.type === 'DOCUMENT' &&
                                            '📄 Document'}
                                          {feature.type === 'COURSE' &&
                                            '📚 Course'}
                                          {feature.type === 'LIVECLASS' &&
                                            '🎥 Live Class'}
                                          {feature.type === 'QUIZ' && '💯 Quiz'}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                            {/* Current Installment Info */}
                            {isInstallment &&
                              currentInstallment &&
                              currentInstallment.isPaid === false && (
                                <div className="p-2.5 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 mb-3">
                                  <p className="text-[11px] font-semibold text-amber-900 mb-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Cicilan
                                  </p>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                                          #
                                          {currentInstallment.installmentNumber}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                          {formatIDR(currentInstallment.amount)}
                                        </span>
                                      </div>
                                      {currentInstallment.isPaid ? (
                                        <Badge className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0">
                                          ✓ Lunas
                                        </Badge>
                                      ) : new Date(currentInstallment.dueDate) <
                                        new Date() ? (
                                        <Badge className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0">
                                          ⚠ Tertunda
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0">
                                          Menunggu Pembayaran
                                        </Badge>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                                      <div>
                                        <p className="text-amber-700 font-medium text-[9px]">
                                          Jatuh Tempo
                                        </p>
                                        <p className="text-gray-900 font-semibold">
                                          {new Date(
                                            currentInstallment.dueDate,
                                          ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                          })}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-amber-700 font-medium text-[9px]">
                                          Tenggang
                                        </p>
                                        <p className="text-green-600 font-semibold">
                                          {new Date(
                                            currentInstallment.gracePeriodEndDate,
                                          ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                          })}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-amber-700 font-medium text-[9px]">
                                          Akses Berakhir
                                        </p>
                                        <p className="text-gray-900 font-semibold">
                                          {new Date(
                                            currentInstallment.expiredAccessDate,
                                          ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                          })}
                                        </p>
                                      </div>
                                    </div>

                                    {currentInstallment.lateFee > 0 &&
                                      !currentInstallment.isPaid &&
                                      new Date(currentInstallment.dueDate) <
                                        new Date() && (
                                        <div className="p-1.5 bg-orange-100 rounded border border-orange-300">
                                          <p className="text-[9px] text-orange-700 font-semibold">
                                            Denda:{' '}
                                            {formatIDR(
                                              currentInstallment.lateFee,
                                            )}
                                          </p>
                                        </div>
                                      )}
                                    <Button
                                      className="w-full pt-1 pb-1.5 px-2 text-xs h-auto font-semibold rounded-lg bg-green-50 border-green-400"
                                      variant={'outline'}
                                      onClick={() =>
                                        setPagesSetting('installment')
                                      }
                                    >
                                      Bayar Sekarang
                                    </Button>
                                  </div>
                                </div>
                              )}
                            {isInstallment &&
                              currentInstallment &&
                              currentInstallment.isPaid && (
                                <div className="p-2.5 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 mb-3">
                                  <div>
                                    <p className="text-amber-700 font-medium text-[9px]">
                                      Akses Berakhir
                                    </p>
                                    <p className="text-gray-900 font-semibold text-xs">
                                      {new Date(
                                        currentInstallment.expiredAccessDate,
                                      ).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}
                            {sub.paymentType === 'FULL_PAYMENT' && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">
                                  Expired:{' '}
                                  {new Date(sub.planExpire).toLocaleDateString(
                                    'id-ID',
                                  )}
                                </span>
                              </div>
                            )}
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full mt-2 h-7 text-xs"
                            >
                              <Link href={`/price/${sub.planSlug}`}>
                                Lihat Detail
                              </Link>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 text-center">
                      Tidak ada subscription aktif
                    </p>
                  )}
                  {userSession?.user.role !== 'USER' && (
                    <div className="flex justify-center w-full">
                      <Badge className="bg-amber-400 text-white">
                        {userTier}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Subscription Pending */}
                {userSession?.user.subsPendingList &&
                  userSession.user.subsPendingList.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      <p className="text-sm font-semibold text-center text-orange-600">
                        Subscription Pending
                      </p>
                      <div className="space-y-2">
                        {userSession.user.subsPendingList.map(
                          (subPending, index) => (
                            <div
                              key={subPending.id}
                              className="p-2 rounded-lg bg-orange-50 border border-orange-200"
                            >
                              <div className="flex flex-col items-start justify-center mb-1 gap-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-[9px] px-2 py-0.5 rounded-full text-white font-medium flex items-center justify-center"
                                    style={{
                                      backgroundColor: '#f59e0b',
                                    }}
                                  >
                                    {subPending.planTier === 'Limitation'
                                      ? 'Koin'
                                      : subPending.planTier}
                                  </span>
                                  <span className="text-[8px] px-1.5 py-0.5 rounded-3xl bg-orange-100 text-orange-700 font-medium">
                                    PENDING
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-gray-900 truncate">
                                  {subPending.planName}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                                {subPending.planDescription}
                              </p>

                              {/* Subscription Pending Features dengan Timeline */}
                              {subPending.SubscriptionPendingFeature &&
                                subPending.SubscriptionPendingFeature.length >
                                  0 && (
                                  <div className="mb-2">
                                    <p className="text-xs font-medium text-gray-700 mb-1">
                                      Fitur:
                                    </p>
                                    <div className="space-y-1">
                                      {subPending.SubscriptionPendingFeature.map(
                                        (feature, featureIndex) => (
                                          <div
                                            key={feature.id}
                                            className="p-1.5 rounded-3xl bg-yellow-50 border border-yellow-200"
                                          >
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="text-[10px] px-1.5 py-0.5 rounded-3xl bg-yellow-200 text-yellow-800 font-medium">
                                                {feature.type === 'DOCUMENT' &&
                                                  '📄 Document'}
                                                {feature.type === 'COURSE' &&
                                                  '📚 Course'}
                                                {feature.type === 'LIVECLASS' &&
                                                  '🎥 Live Class'}
                                                {feature.type === 'QUIZ' &&
                                                  '💯 Quiz'}
                                              </span>
                                            </div>
                                            {/* Timeline untuk pending feature */}
                                            <div className="text-[10px] text-green-600 pt-1 border-t border-yellow-300">
                                              Aktif pada{' '}
                                              {formatDateRange(
                                                feature.validFrom,
                                                feature.validUntil,
                                              )}
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Subscription Pending Limitation */}
                              {subPending.SubscriptionPendingLimitation && (
                                <div className="mb-2">
                                  <p className="text-xs font-medium text-gray-700 mb-1">
                                    Coin :
                                  </p>
                                  <div className="p-1.5 rounded-3xl bg-yellow-50 border border-yellow-200">
                                    <div className="grid grid-cols-2 gap-1 mb-1">
                                      <div className="text-[10px] text-yellow-800">
                                        <span className="font-medium">
                                          Chat:
                                        </span>{' '}
                                        {
                                          subPending
                                            .SubscriptionPendingLimitation.chat
                                        }
                                      </div>
                                      <div className="text-[10px] text-yellow-800">
                                        <span className="font-medium">
                                          Notes:
                                        </span>{' '}
                                        {
                                          subPending
                                            .SubscriptionPendingLimitation.notes
                                        }
                                      </div>
                                      <div className="text-[10px] text-yellow-800">
                                        <span className="font-medium">
                                          Vision:
                                        </span>{' '}
                                        {
                                          subPending
                                            .SubscriptionPendingLimitation
                                            .vision
                                        }
                                      </div>
                                      <div className="text-[10px] text-yellow-800">
                                        <span className="font-medium">
                                          Quiz:
                                        </span>{' '}
                                        {
                                          subPending
                                            .SubscriptionPendingLimitation.quiz
                                        }
                                      </div>
                                      <div className="text-[10px] text-yellow-800 col-span-2">
                                        <span className="font-medium">
                                          Tryout:
                                        </span>{' '}
                                        {
                                          subPending
                                            .SubscriptionPendingLimitation
                                            .tryout
                                        }
                                      </div>
                                    </div>
                                    <div className="text-[10px] text-green-600 pt-1 border-t border-yellow-300">
                                      Aktif pada{' '}
                                      {formatDateRange(
                                        subPending.SubscriptionPendingLimitation
                                          .validFrom,
                                        subPending.SubscriptionPendingLimitation
                                          .validUntil,
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>

              <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-gray-200">
                {/* Button Lihat Detail Subscription */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full items-center gap-2 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2 h-8 lg:h-auto"
                  style={{
                    borderColor: mainColor,
                    color: mainColor,
                  }}
                >
                  <Link
                    href={`/${website_sub_category_id_params}/user/subscription`}
                  >
                    <Settings className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Kelola Subscription</span>
                  </Link>
                </Button>

                {/* Button Beli Subscription */}
                <Button
                  className="w-full items-center gap-1 lg:gap-2 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2 h-8 lg:h-auto"
                  style={{ backgroundColor: mainColor }}
                  onClick={() => setTransactionPopUp(true)}
                >
                  <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden lg:inline">Beli Subscription</span>
                  <span className="lg:hidden">Beli</span>
                </Button>
              </div>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </>
  );
};
