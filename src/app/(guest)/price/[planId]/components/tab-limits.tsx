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
import { motion } from 'framer-motion';
import { CheckCircle2, Infinity, TrendingUp } from 'lucide-react';
import { getLimitationIcon, PlanDataType } from './_helper';

export default function TabLimits({ plan }: { plan: PlanDataType }) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  return (
    <>
      {plan.PlanLimitation && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Badge
                  className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit"
                  style={{ backgroundColor: mainColor }}
                >
                  <Infinity className="w-4 h-4" />
                  Koin Detail
                </Badge>
                <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Detail sistem{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    koin
                  </span>{' '}
                  per fitur
                </CardTitle>
                <CardDescription className="text-xl text-gray-600 leading-relaxed">
                  <span
                    className="font-bold"
                    style={{ color: mainColor }}
                  >
                    Breakdown lengkap
                  </span>{' '}
                  koin yang tersedia untuk setiap fitur pembelajaran premium.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6">
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
                .map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                    viewport={{ once: true }}
                    className="group p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          {getLimitationIcon(key)}
                        </div>
                        <div>
                          <span className="font-black text-gray-900 text-xl block">
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
                          <div className="text-gray-600 mt-1 font-medium">
                            {key === 'chat' &&
                              'Tanya jawab unlimited dengan AI'}
                            {key === 'notes' && 'Buat catatan sepuasnya'}
                            {key === 'vision' && 'Analisis gambar dengan AI'}
                            {key === 'quiz' && 'Latihan soal tanpa batas'}
                            {key === 'tryout' && 'Simulasi ujian premium'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-4xl font-black mb-1"
                          style={{ color: mainColor }}
                        >
                          {typeof value === 'number'
                            ? value.toLocaleString()
                            : value}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">
                          koin tersedia
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">
                          Kapasitas
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: secondaryColor }}
                        >
                          {typeof value === 'number' && value > 1000
                            ? 'Unlimited'
                            : 'Full Access'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full relative overflow-hidden"
                          style={{
                            background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                            width:
                              typeof value === 'number' && value > 500
                                ? '100%'
                                : '75%',
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* Feature highlight */}
                    <div className="mt-4 p-3 rounded-3xl bg-white/60 border border-white/80">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0"
                          style={{ color: secondaryColor }}
                        />
                        <span className="text-gray-700 font-medium">
                          <span
                            className="font-bold"
                            style={{ color: mainColor }}
                          >
                            Goal kita jelas:
                          </span>{' '}
                          Kamu bisa maksimalin fitur ini tanpa worry soal limit!
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

              {/* Summary card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-r from-yellow-50 to-orange-50"
              >
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-black text-gray-900 text-xl mb-2">
                    Total Value Lebih dari Cukup!
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    <span
                      className="font-bold"
                      style={{ color: mainColor }}
                    >
                      Semua angka di atas
                    </span>{' '}
                    dirancang supaya kamu bisa belajar optimal tanpa mikirin
                    batas koin.
                    <span
                      className="font-bold"
                      style={{ color: secondaryColor }}
                    >
                      {' '}
                      Focus aja sama goalmu!
                    </span>
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}
