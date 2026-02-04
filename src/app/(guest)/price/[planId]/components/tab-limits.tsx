'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, Infinity, TrendingUp } from 'lucide-react';
import { getLimitationIcon, PlanDataType } from './_helper';

export default function TabLimits({ plan }: { plan: PlanDataType }) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  return (
    <>
      {plan.PlanLimitation && (
        <Card className="border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="pb-6">
            <Badge
              className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit rounded-full shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              <Infinity className="w-4 h-4" />
              Koin BimBot Detail
            </Badge>
            <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Detail sistem{' '}
              <span style={{ color: mainColor }}>koin</span>{' '}
              per fitur
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 leading-relaxed">
              <span className="font-semibold" style={{ color: mainColor }}>
                Breakdown lengkap
              </span>{' '}
              koin yang tersedia untuk setiap fitur pembelajaran premium.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(plan.PlanLimitation)
              .filter(([key, value]) => {
                if (
                  key !== 'id' &&
                  key !== 'planId' &&
                  key !== 'expireDays' &&
                  key !== 'validFrom' &&
                  key !== 'validUntil' &&
                  key !== 'isTimebound'
                ) {
                  if (typeof value === 'number' && value > 0) {
                    return true;
                  }
                  if (typeof value === 'string' && parseInt(value) > 0) {
                    return true;
                  }
                  return false;
                }
                return false;
              })
              .map(([key, value]) => (
                <div
                  key={key}
                  className="group p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <div style={{ color: mainColor }}>
                          {getLimitationIcon(key)}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 text-lg block">
                          {key === 'chat'
                            ? 'Chat AI'
                            : key === 'notes'
                              ? 'Catatan'
                              : key === 'vision'
                                ? 'Vision AI'
                                : key === 'quiz'
                                  ? 'Kuis'
                                  : key === 'tryout'
                                    ? 'Tryout'
                                    : key}
                        </span>
                        <div className="text-slate-600 mt-0.5 text-sm font-medium">
                          {key === 'chat' && 'Tanya jawab unlimited dengan AI'}
                          {key === 'notes' && 'Buat catatan sepuasnya'}
                          {key === 'vision' && 'Analisis gambar dengan AI'}
                          {key === 'quiz' && 'Latihan soal tanpa batas'}
                          {key === 'tryout' && 'Simulasi ujian premium'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-3xl font-bold mb-1"
                        style={{ color: mainColor }}
                      >
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : value}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        koin tersedia
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">
                        Kapasitas
                      </span>
                      <span className="font-semibold" style={{ color: secondaryColor }}>
                        {typeof value === 'number' && value > 1000
                          ? 'Unlimited'
                          : 'Full Access'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: mainColor,
                          width:
                            typeof value === 'number' && value > 500
                              ? '100%'
                              : '75%',
                        }}
                      />
                    </div>
                  </div>

                  {/* Feature highlight */}
                  <div className="mt-4 p-3 rounded-xl bg-white border border-slate-100">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0"
                        style={{ color: secondaryColor }}
                      />
                      <span className="text-slate-700 font-medium">
                        <span className="font-semibold" style={{ color: mainColor }}>
                          Goal kita jelas:
                        </span>{' '}
                        Kamu bisa maksimalin fitur ini tanpa worry soal limit!
                      </span>
                    </div>
                  </div>
                </div>
              ))}

            {/* Summary card */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
              <div className="text-center">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <TrendingUp className="w-7 h-7" style={{ color: mainColor }} />
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-2">
                  Total Value Lebih dari Cukup!
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <span className="font-semibold" style={{ color: mainColor }}>
                    Semua angka di atas
                  </span>{' '}
                  dirancang supaya kamu bisa belajar optimal tanpa mikirin
                  batas koin.
                  <span className="font-semibold" style={{ color: secondaryColor }}>
                    {' '}
                    Focus aja sama goalmu!
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
