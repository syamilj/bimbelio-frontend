'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Infinity,
  LockOpen,
  Play,
  Star,
  Users,
  Video,
} from 'lucide-react';
import { getFeatureIcon, getLimitationIcon, PlanDataType } from './_helper';

export default function TabOverview({
  plan,
  setActiveTab,
}: {
  plan: PlanDataType;
  setActiveTab: (
    tab: 'overview' | 'course' | 'features' | 'classes' | 'limits',
  ) => void;
}) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  return (
    <>
      {/* Benefits Grid - SNBT Style */}
      {plan.PlanBenefit && plan.PlanBenefit.length > 0 && (
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
                  <Star className="w-4 h-4" />
                  Keunggulan Blueprint
                </Badge>
                <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Sistem yang{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    terukur
                  </span>{' '}
                  untuk hasil maksimal
                </CardTitle>
                <CardDescription className="text-xl text-gray-600 leading-relaxed">
                  <span
                    className="font-bold"
                    style={{ color: mainColor }}
                  >
                    Goal kita jelas:
                  </span>{' '}
                  setiap fitur dirancang khusus untuk bantu kamu naik minimal
                  200+ poin.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {plan.PlanBenefit.sort((a, b) => a.order - b.order).map(
                  (benefit, index) => (
                    <motion.div
                      key={benefit.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                      }}
                      viewport={{ once: true }}
                      className="group relative p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="shrink-0 w-12 h-12 rounded-3xl flex items-center justify-center shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          <Check className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-2">
                            {benefit.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                      <div
                        className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </motion.div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Features Overview - SNBT Style */}
      {plan.PlanSubscription?.PlanFeature &&
        plan.PlanSubscription?.PlanFeature.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Badge
                    className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit"
                    style={{ backgroundColor: mainColor }}
                  >
                    <BookOpen className="w-4 h-4" />
                    Fitur Blueprint
                  </Badge>
                  <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                    Akses{' '}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      unlimited
                    </span>{' '}
                    ke semua kategori
                  </CardTitle>
                  <CardDescription className="text-xl text-gray-600 leading-relaxed">
                    <span
                      className="font-bold"
                      style={{ color: mainColor }}
                    >
                      Semua fitur premium
                    </span>{' '}
                    yang kamu butuhkan untuk persiapan UTBK maksimal. Bukan
                    sekadar akses biasa, tapi{' '}
                    <span
                      className="font-bold"
                      style={{ color: secondaryColor }}
                    >
                      sistem pembelajaran terintegrasi
                    </span>
                    !
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    'grid md:grid-cols-3 gap-6',
                    plan.PlanSubscription.PlanFeature.length === 1 &&
                      'md:grid-cols-1',
                    plan.PlanSubscription.PlanFeature.length === 2 &&
                      'md:grid-cols-2',
                  )}
                >
                  {plan.PlanSubscription.PlanFeature.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.15,
                      }}
                      viewport={{ once: true }}
                      className="group p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          {getFeatureIcon(feature.type)}
                        </div>
                        <div>
                          <h3 className="font-black text-gray-900 text-lg capitalize">
                            {feature.type.toLowerCase().replace('_', ' ')}
                          </h3>
                          {feature.liveClassesPerWeek && (
                            <p
                              className="text-sm font-medium"
                              style={{ color: mainColor }}
                            >
                              {feature.liveClassesPerWeek} kelas/minggu
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        {feature.type === 'COURSE' &&
                          feature.Pivot_Plan_Category.slice(0, 3).map(
                            (pivot) => (
                              <div
                                key={pivot.id}
                                className="flex items-center gap-3 p-2 rounded-3xl bg-white/60 hover:bg-white/80 transition-all duration-200"
                              >
                                <div
                                  className="w-6 h-6 rounded-3xl text-white text-xs flex items-center justify-center font-bold"
                                  style={{
                                    backgroundColor: mainColor,
                                  }}
                                >
                                  {pivot.Category.nomor}
                                </div>
                                <span className="text-gray-900 font-semibold text-sm">
                                  {pivot.Category.name}
                                </span>
                                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                              </div>
                            ),
                          )}
                        {feature.type === 'DOCUMENT' && (
                          <div className="flex gap-3 p-2 rounded-3xl bg-white/60">
                            <div
                              className="w-6 h-6 rounded-3xl text-white text-xs flex items-center justify-center font-bold shrink-0"
                              style={{ backgroundColor: mainColor }}
                            >
                              <LockOpen className="w-3 h-3" />
                            </div>
                            <span className="text-gray-900 font-semibold text-sm">
                              Akses ke Semua Document Premium
                            </span>
                          </div>
                        )}
                        {feature.type === 'LIVECLASS' &&
                          feature.liveClassesPerWeek && (
                            <div className="flex gap-3 p-2 rounded-3xl bg-white/60">
                              <div
                                className="w-6 h-6 rounded-3xl text-white text-xs flex items-center justify-center font-bold shrink-0"
                                style={{
                                  backgroundColor: mainColor,
                                }}
                              >
                                <Play className="w-3 h-3" />
                              </div>
                              <span className="text-gray-900 font-semibold text-sm">
                                {feature.liveClassesPerWeek} Live Class per
                                Minggu
                              </span>
                            </div>
                          )}
                      </div>

                      {/* Feature highlight badge */}
                      <div className="mt-4 pt-3 border-t border-gray-200/50">
                        <div
                          className="text-xs font-bold px-3 py-1 rounded-full text-white w-fit"
                          style={{
                            backgroundColor: secondaryColor,
                          }}
                        >
                          Premium Access
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      {/* Live Classes Overview - SNBT Style */}
      {plan.Pivot_LiveClass_Plan && plan.Pivot_LiveClass_Plan.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <Badge
                  className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit"
                  style={{ backgroundColor: mainColor }}
                >
                  <Video className="w-4 h-4" />
                  Live Class Premium
                </Badge>
                <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Belajar langsung dengan{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    mentor terbaik
                  </span>
                </CardTitle>
                <CardDescription className="text-xl text-gray-600 leading-relaxed">
                  <span
                    className="font-bold"
                    style={{ color: mainColor }}
                  >
                    {plan.Pivot_LiveClass_Plan.length} live class terjadwal
                  </span>{' '}
                  dengan instruktur berpengalaman. Interaksi langsung,{' '}
                  <span
                    className="font-bold"
                    style={{ color: secondaryColor }}
                  >
                    hasil maksimal
                  </span>
                  !
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {plan.Pivot_LiveClass_Plan.slice(0, 4).map((pivot, index) => (
                  <motion.div
                    key={pivot.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                    viewport={{ once: true }}
                    className="group p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full -translate-y-8 translate-x-8 opacity-50" />

                    <div className="relative">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-3xl flex items-center justify-center text-white font-black text-lg shadow-lg shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-gray-900 text-lg mb-2 leading-tight">
                            {pivot.LiveClass.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-3xl">
                              <Clock
                                className="w-4 h-4"
                                style={{ color: mainColor }}
                              />
                              <span className="font-semibold text-gray-700">
                                {pivot.LiveClass.duration}m
                              </span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-3xl">
                              <Users
                                className="w-4 h-4"
                                style={{ color: mainColor }}
                              />
                              <span className="font-semibold text-gray-700">
                                {pivot.LiveClass.maxParticipant || 'Unlimited'}
                              </span>
                            </div>
                            {pivot.LiveClass.isRecord && (
                              <Badge className="bg-green-500 text-white text-xs font-semibold border-0">
                                <Play className="w-3 h-3 mr-1" />
                                Direkam
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Instructor info */}
                      {pivot.LiveClass.Instructor && (
                        <div className="flex items-center gap-2 pt-3 border-t border-purple-200/50">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                            <Users className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            Instructor Premium
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Class number badge */}
                    <div
                      className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full text-white"
                      style={{
                        backgroundColor: secondaryColor,
                      }}
                    >
                      Class {index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>

              {plan.Pivot_LiveClass_Plan.length > 4 && (
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('classes')}
                    className="px-8 py-4 rounded-3xl border-2 font-semibold hover:scale-105 transition-all duration-300"
                    style={{
                      borderColor: mainColor,
                      color: mainColor,
                    }}
                  >
                    Lihat Semua {plan.Pivot_LiveClass_Plan.length} Live Class
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Usage Limits Overview - SNBT Style */}
      {plan.PlanLimitation && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge
                  className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit"
                  style={{ backgroundColor: mainColor }}
                >
                  <Infinity className="w-4 h-4" />
                  Koin Blueprint
                </Badge>
                <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Sistem koin yang{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    unlimited
                  </span>{' '}
                  untuk belajar
                </CardTitle>
                <CardDescription className="text-xl text-gray-600 leading-relaxed">
                  <span
                    className="font-bold"
                    style={{ color: mainColor }}
                  >
                    Gak perlu khawatir
                  </span>{' '}
                  soal limit! Paket ini dirancang untuk pembelajaran maksimal
                  dengan{' '}
                  <span
                    className="font-bold"
                    style={{ color: secondaryColor }}
                  >
                    koin yang berlimpah
                  </span>
                  .
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className="group p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                    >
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -translate-y-6 translate-x-6 opacity-50" />

                      <div className="relative">
                        <div
                          className="w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          {getLimitationIcon(key)}
                        </div>
                        <h4 className="font-black text-gray-900 mb-3 text-lg">
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
                        </h4>
                        <div
                          className="text-4xl font-black mb-2"
                          style={{ color: mainColor }}
                        >
                          {typeof value === 'number'
                            ? value.toLocaleString()
                            : value}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">
                          koin tersedia
                        </div>

                        {/* Progress bar indicator */}
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                backgroundColor: secondaryColor,
                                width:
                                  typeof value === 'number' && value > 100
                                    ? '100%'
                                    : '85%',
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Lebih dari cukup!
                          </p>
                        </div>
                      </div>

                      {/* Feature badge */}
                      <div
                        className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        Premium
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* Info banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-3xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Infinity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 mb-2">
                      Sistem Koin Blueprint yang Berbeda
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      <span
                        className="font-bold"
                        style={{ color: mainColor }}
                      >
                        Gak kayak platform lain
                      </span>{' '}
                      yang perhitungan koinnya pelit. Di sini kamu bisa belajar
                      sepuasnya tanpa khawatir koin habis!
                    </p>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}
