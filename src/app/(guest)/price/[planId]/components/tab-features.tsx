'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Crown,
  Play,
} from 'lucide-react';
import { getFeatureIcon, PlanDataType } from './_helper';

export default function TabFeatures({ plan }: { plan: PlanDataType }) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  return (
    <div className="space-y-6">
      {plan.PlanSubscription?.PlanFeature &&
        plan.PlanSubscription?.PlanFeature.length > 0 &&
        plan.PlanSubscription.PlanFeature.map((feature, index) => (
          <Card
            key={feature.id}
            className="border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden"
          >
            <CardHeader
              className="text-white"
              style={{ backgroundColor: mainColor }}
            >
              <CardTitle className="flex items-center gap-4 text-xl">
                <div
                  className="w-11 h-11 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  {getFeatureIcon(feature.type)}
                </div>
                <div>
                  <div className="font-bold text-xl capitalize">
                    {feature.type === 'COURSE' && 'Materi Kursus Premium'}
                    {feature.type === 'DOCUMENT' && 'Bank Dokumen Lengkap'}
                    {feature.type === 'LIVECLASS' && 'BimLive Eksklusif'}
                    {!['COURSE', 'DOCUMENT', 'LIVECLASS'].includes(
                      feature.type,
                    ) && feature.type.toLowerCase().replace('_', ' ')}
                  </div>
                  <div className="text-white/80 text-sm font-normal mt-1">
                    Akses penuh tanpa batas
                  </div>
                </div>
                <Badge className="ml-auto bg-white/20 text-white border-none rounded-full">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {feature.type === 'COURSE' &&
                  feature.Pivot_Plan_Category.map((pivot) => (
                    <div
                      key={pivot.id}
                      className="group/item p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-3xl text-white text-sm flex items-center justify-center font-bold shrink-0"
                          style={{ backgroundColor: mainColor }}
                        >
                          {pivot.Category.nomor}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-slate-900 block text-sm leading-tight">
                            {pivot.Category.name}
                          </span>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Kategori #{pivot.Category.nomor}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    </div>
                  ))}

                {feature.type === 'DOCUMENT' && (
                  <div className="group/item col-span-3 p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-11 h-11 rounded-3xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <BookOpen
                          className="w-5 h-5"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-900 text-base">
                          Akses ke Semua Dokumen
                        </span>
                        <div className="text-slate-600 text-sm mt-1">
                          <span
                            className="font-semibold"
                            style={{ color: mainColor }}
                          >
                            Gak ada yang terkunci!
                          </span>{' '}
                          Semua materi, e-book, dan dokumen pendukung bisa
                          diakses kapan saja.
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>
                  </div>
                )}

                {feature.type === 'LIVECLASS' && feature.liveClassesPerWeek && (
                  <div className="group/item col-span-3 p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-11 h-11 rounded-3xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <Play
                          className="w-5 h-5"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-900 text-base">
                          {feature.liveClassesPerWeek} BimLive Per Minggu
                        </span>
                        <div className="text-slate-600 text-sm mt-1">
                          <span
                            className="font-semibold"
                            style={{ color: mainColor }}
                          >
                            Interaksi langsung
                          </span>{' '}
                          dengan instruktur terbaik. Tanya jawab real-time &
                          pembahasan mendalam.
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>
                  </div>
                )}
              </div>

              {/* Feature summary */}
              <div className="mt-5 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-3xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${secondaryColor}15` }}
                  >
                    <CheckCircle2
                      className="w-4 h-4"
                      style={{ color: secondaryColor }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      Goal kita jelas: Kamu sukses!
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      <span
                        className="font-semibold"
                        style={{ color: mainColor }}
                      >
                        Semua fitur ini
                      </span>{' '}
                      dirancang khusus buat memastikan kamu bisa meraih target
                      dengan pembelajaran yang optimal.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
