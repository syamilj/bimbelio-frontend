'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { UserReferral } from '@/types/database';
import { ReferralHero } from './_components/referral-hero';
import ReferralHistory from './_components/referral-history';
import { ReferralInfo } from './_components/referral-info';
import { ReferralStats } from './_components/referral-stats';

interface ReferralResponse {
  userReferral: UserReferral;
  totalReferrals: number;
  balance: number;
}

export default function Referral() {
  const { data: ReferralData, isLoading } = useGet<ReferralResponse>(
    '/referral/getUserReferralDetail',
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pb-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8">
          <Skeleton className="h-40 rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!ReferralData) {
    return (
      <div className="min-h-screen pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Tidak ada data referral</p>
        </div>
      </div>
    );
  }

  const { userReferral } = ReferralData;

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
        <ReferralStats
          balance={userReferral.balance}
          totalReferrals={ReferralData.totalReferrals}
        />
        <ReferralHero
          referralCode={userReferral.referralCode}
          createdAt={userReferral.createdAt}
        />
        <ReferralInfo />
        <ReferralHistory />
      </div>
    </div>
  );
}
