'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReferralInfo() {
  const steps = [
    {
      number: 1,
      title: 'Bagikan',
      description: 'Bagikan link referral Anda ke teman atau sosial media',
      color: 'bg-main',
    },
    {
      number: 2,
      title: 'Membeli Produk',
      description: 'Teman Anda membeli produk menggunakan link referral Anda',
      color: 'bg-main',
    },
    {
      number: 3,
      title: 'Dapatkan',
      description: 'Dapatkan komisi dari setiap pembelian',
      color: 'bg-main',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Cara Kerja Program Referral
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => (
          <Card
            key={step.number}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Badge
                  className={`${step.color} w-8 h-8 flex items-center justify-center p-0 text-white`}
                >
                  {step.number}
                </Badge>
                <div>
                  <CardTitle className="text-base">{step.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
