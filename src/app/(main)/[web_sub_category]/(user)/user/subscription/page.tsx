'use client';

import { DialogJoinDiscord } from '@/components/_shared/dialog/dialog-join-discord';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  // Admin/user data
  const userTier = userSession?.user.tier;

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
        return <FileText className="w-3 h-3" />;
      case 'COURSE':
        return <GraduationCap className="w-3 h-3" />;
      case 'LIVECLASS':
        return <Video className="w-3 h-3" />;
      default:
        return <Check className="w-3 h-3" />;
    }
  };

  const hasActiveSubscription =
    userSession?.user.subsList && userSession.user.subsList.length > 0;
  const hasPendingSubscription =
    userSession?.user.subsPendingList &&
    userSession.user.subsPendingList.length > 0;

  return (
    <div className="space-y-4">
      {/* Hero Section with User Tier */}
      {userTier && userTier !== 'USER' && (
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-3xl -ml-12 -mb-12"></div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                  Status Member
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {userTier} Member
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Akses unlimited ke semua fitur premium
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Subscription Aktif */}
        {hasActiveSubscription ? (
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className="p-2 bg-main rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  Subscription Aktif
                </CardTitle>
                <Badge className="bg-main text-white px-3 py-1">
                  {userSession.user.subsList.length} Paket
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {userSession.user.subsList.map((sub) => (
                  <div
                    key={sub.id}
                    className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-white to-green-50 p-4 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    {/* Header Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col gap-2">
                        <Badge
                          className="w-fit text-white font-semibold text-xs px-3 py-1"
                          style={{ backgroundColor: mainColor }}
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          {sub.planTier}
                        </Badge>
                        <h3 className="text-base font-bold text-gray-900">
                          {sub.planName}
                        </h3>
                      </div>
                      <div className="p-2 bg-main rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {sub.planDescription}
                    </p>
                    {/* Features */}
                    {sub.SubscriptionFeature &&
                      sub.SubscriptionFeature.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-green-600" />
                            Fitur Aktif:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sub.SubscriptionFeature.map((feature) => (
                              <div
                                key={feature.id}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
                              >
                                {getFeatureIcon(feature.type)}
                                <span className="text-xs font-medium text-blue-700">
                                  {feature.type === 'DOCUMENT' && 'Document'}
                                  {feature.type === 'COURSE' && 'Course'}
                                  {feature.type === 'LIVECLASS' && 'Live Class'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    {/* Expiry Info */}
                    <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg mb-3">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-700">
                          Berakhir pada
                        </p>
                        <p className="text-sm font-bold text-orange-600">
                          {new Date(sub.planExpire).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {sub.discord_invite_link && (
                        <DialogJoinDiscord inviteLink={sub.discord_invite_link}>
                          <Button
                            asChild
                            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-md"
                          >
                            <div rel="noopener noreferrer">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="mr-2"
                              >
                                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
                              </svg>
                              Gabung Discord dengan plan ini
                            </div>
                          </Button>
                        </DialogJoinDiscord>
                      )}
                      <Button
                        asChild
                        className="w-full bg-main text-white shadow-md"
                      >
                        <Link href={`/price/${sub.planSlug}`}>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Lihat Detail Paket
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Belum Ada Subscription
              </h3>
              <p className="text-sm text-gray-500 text-center mb-4 max-w-xs">
                Upgrade ke premium untuk akses unlimited semua fitur
                pembelajaran
              </p>
            </CardContent>
          </Card>
        )}

        {/* Subscription Pending */}
        {hasPendingSubscription && (
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Subscription Pending
                </CardTitle>
                <Badge className="bg-orange-500 text-white px-3 py-1">
                  {userSession!.user.subsPendingList.length} Paket
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {userSession!.user.subsPendingList.map((subPending) => (
                  <div
                    key={subPending.id}
                    className="relative overflow-hidden rounded-xl border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 p-4 shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-500 text-white font-semibold text-xs px-3 py-1">
                            <Crown className="w-3 h-3 mr-1" />
                            {subPending.planTier}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-orange-600 border-orange-600 text-[10px] px-2 py-0.5"
                          >
                            PENDING
                          </Badge>
                        </div>
                        <h3 className="text-base font-bold text-gray-900">
                          {subPending.planName}
                        </h3>
                      </div>
                      <div className="p-2 bg-orange-500 rounded-full">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {subPending.planDescription}
                    </p>

                    {/* Pending Features */}
                    {subPending.SubscriptionPendingFeature &&
                      subPending.SubscriptionPendingFeature.length > 0 && (
                        <div className="mb-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-orange-600" />
                            Fitur yang Akan Aktif:
                          </p>
                          {subPending.SubscriptionPendingFeature.map(
                            (feature) => (
                              <div
                                key={feature.id}
                                className="p-2.5 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {getFeatureIcon(feature.type)}
                                  <span className="text-xs font-medium text-yellow-800">
                                    {feature.type === 'DOCUMENT' && 'Document'}
                                    {feature.type === 'COURSE' && 'Course'}
                                    {feature.type === 'LIVECLASS' &&
                                      'Live Class'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                                  <Check className="w-3 h-3" />
                                  Aktif{' '}
                                  {formatDateRange(
                                    feature.validFrom,
                                    feature.validUntil,
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}

                    {/* Pending Limitation (Coin) */}
                    {subPending.SubscriptionPendingLimitation && (
                      <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <Coins className="w-3 h-3 text-purple-600" />
                          Coin yang Akan Diterima:
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="flex items-center gap-1.5 p-2 bg-white rounded-md">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                            <div>
                              <p className="text-[10px] text-gray-600">Chat</p>
                              <p className="text-sm font-bold text-blue-600">
                                {subPending.SubscriptionPendingLimitation.chat}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 p-2 bg-white rounded-md">
                            <FileText className="w-3.5 h-3.5 text-green-600" />
                            <div>
                              <p className="text-[10px] text-gray-600">Notes</p>
                              <p className="text-sm font-bold text-green-600">
                                {subPending.SubscriptionPendingLimitation.notes}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 p-2 bg-white rounded-md">
                            <Video className="w-3.5 h-3.5 text-purple-600" />
                            <div>
                              <p className="text-[10px] text-gray-600">
                                Vision
                              </p>
                              <p className="text-sm font-bold text-purple-600">
                                {
                                  subPending.SubscriptionPendingLimitation
                                    .vision
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 p-2 bg-white rounded-md">
                            <GraduationCap className="w-3.5 h-3.5 text-orange-600" />
                            <div>
                              <p className="text-[10px] text-gray-600">Quiz</p>
                              <p className="text-sm font-bold text-orange-600">
                                {subPending.SubscriptionPendingLimitation.quiz}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 p-2 bg-white rounded-md col-span-2">
                            <Star className="w-3.5 h-3.5 text-yellow-600" />
                            <div>
                              <p className="text-[10px] text-gray-600">
                                Tryout
                              </p>
                              <p className="text-sm font-bold text-yellow-600">
                                {
                                  subPending.SubscriptionPendingLimitation
                                    .tryout
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium pt-2 border-t border-purple-200">
                          <Check className="w-3 h-3" />
                          Aktif{' '}
                          {formatDateRange(
                            subPending.SubscriptionPendingLimitation.validFrom,
                            subPending.SubscriptionPendingLimitation.validUntil,
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <Button
          className="w-full items-center gap-2 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-12 text-sm font-semibold"
          style={{
            background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
          }}
          onClick={() => setTransactionPopUp(true)}
        >
          <Sparkles className="w-5 h-5" />
          <span>Beli Subscription Premium</span>
        </Button>
      </div>
    </div>
  );
}
