'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Gift, Link2, Users } from 'lucide-react';

interface ReferralStatsProps {
  totalReferrals: number;
  balance: number;
}

export function ReferralStats({ totalReferrals, balance }: ReferralStatsProps) {
  const { mainColor } = useWebsiteSubCategory();

  const stats = [
    {
      icon: Users,
      label: 'Total Referral',
      value: totalReferrals.toString(),
      subtitle: `${totalReferrals} berhasil menggunakan referral`,
    },
    {
      icon: Gift,
      label: 'Saldo Reward',
      value: `Rp ${balance.toLocaleString('id-ID')}`,
      subtitle: 'Siap untuk digunakan',
    },
    {
      icon: Link2,
      label: 'Status Referral',
      value: 'Aktif',
      subtitle: 'Kode referral berlaku',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2 flex-shrink-0"
                style={{ backgroundColor: mainColor }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-black text-slate-800 mb-1">
                {stat.value}
              </p>
              <CardDescription className="text-xs">
                {stat.subtitle}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
