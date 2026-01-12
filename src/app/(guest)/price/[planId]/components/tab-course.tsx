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
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Crown,
  FileText,
  Play,
  Target,
  Video,
} from 'lucide-react';
import { PlanDataType } from './_helper';

export default function TabCourse({ plan }: { plan: PlanDataType }) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <>
      {plan.PlanSubscription?.PlanFeature.find(
        (feature) => feature.type === 'COURSE',
      ) && (
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
                  <BookOpen className="w-4 h-4" />
                  Struktur Pembelajaran
                </Badge>
                <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Materi{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    terstruktur
                  </span>{' '}
                  untuk hasil optimal
                </CardTitle>
                <CardDescription className="text-xl text-gray-600 leading-relaxed">
                  <span
                    className="font-bold"
                    style={{ color: mainColor }}
                  >
                    Sistem pembelajaran berjenjang
                  </span>{' '}
                  dari dasar hingga mahir. Setiap chapter dirancang khusus
                  dengan subchapter yang mendalam.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {plan.PlanSubscription.PlanFeature.find(
                  (feature) => feature.type === 'COURSE',
                )?.Pivot_Plan_Category.map((pivot, categoryIndex) => (
                  <motion.div
                    key={pivot.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: categoryIndex * 0.1,
                    }}
                    viewport={{ once: true }}
                    className="group p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-8 translate-x-8 opacity-50" />

                    <div className="relative">
                      {/* Category Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          {pivot.Category.nomor}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-gray-900 mb-1">
                            {pivot.Category.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Kategori #{pivot.Category.nomor} •{' '}
                            <span
                              className="font-bold"
                              style={{ color: secondaryColor }}
                            >
                              Akses Premium
                            </span>
                          </p>
                        </div>
                        <Badge
                          className="text-white border-none"
                          style={{
                            backgroundColor: secondaryColor,
                          }}
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>

                      {/* Chapters Preview */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: mainColor }}
                          >
                            <Play className="w-3 h-3 text-white" />
                          </div>
                          <h4 className="font-bold text-gray-800">
                            Chapter & Subchapter
                          </h4>
                        </div>

                        {/* Sample Chapter Structure */}
                        <div className="space-y-3 bg-white/60 p-4 rounded-3xl border border-white/50">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 hover:bg-white transition-all duration-200">
                            <div
                              className="w-8 h-8 rounded-lg text-white text-xs flex items-center justify-center font-bold"
                              style={{
                                backgroundColor: mainColor,
                              }}
                            >
                              1
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-900 font-semibold text-sm">
                                Pengenalan {pivot.Category.name}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                Chapter dasar dan fundamental
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>

                          <div className="pl-6 space-y-2">
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80">
                              <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                                1.1
                              </div>
                              <span className="text-gray-700 text-sm">
                                Konsep Dasar
                              </span>
                              <div className="text-xs text-gray-500 ml-auto flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                15 menit
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80">
                              <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                                1.2
                              </div>
                              <span className="text-gray-700 text-sm">
                                Teori dan Aplikasi
                              </span>
                              <div className="text-xs text-gray-500 ml-auto flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                25 menit
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80">
                              <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                                1.3
                              </div>
                              <span className="text-gray-700 text-sm">
                                Latihan Soal
                              </span>
                              <div className="text-xs text-gray-500 ml-auto flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Tryout
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 hover:bg-white transition-all duration-200">
                            <div
                              className="w-8 h-8 rounded-lg text-white text-xs flex items-center justify-center font-bold"
                              style={{
                                backgroundColor: mainColor,
                              }}
                            >
                              2
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-900 font-semibold text-sm">
                                Lanjutan {pivot.Category.name}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                Chapter intermediate
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>

                          <div className="text-center py-3">
                            <span className="text-xs text-gray-500 font-semibold">
                              + Banyak chapter & subchapter lainnya
                            </span>
                          </div>
                        </div>

                        {/* Category Features */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200">
                            <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center">
                              <Video className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-green-700 text-xs font-semibold">
                              Video Pembelajaran
                            </span>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-200">
                            <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center">
                              <FileText className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-purple-700 text-xs font-semibold">
                              Materi & Dokumen
                            </span>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200">
                            <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center">
                              <Target className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-orange-700 text-xs font-semibold">
                              Latihan Tryout
                            </span>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
                            <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-blue-700 text-xs font-semibold">
                              Progress Tracking
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Category Stats */}
                      <div className="mt-6 p-4 rounded-3xl bg-white/60 border border-white/50">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div
                              className="text-xl font-black"
                              style={{ color: mainColor }}
                            >
                              12+
                            </div>
                            <div className="text-xs text-gray-600 font-semibold">
                              Chapter
                            </div>
                          </div>
                          <div>
                            <div
                              className="text-xl font-black"
                              style={{ color: secondaryColor }}
                            >
                              48+
                            </div>
                            <div className="text-xs text-gray-600 font-semibold">
                              Subchapter
                            </div>
                          </div>
                          <div>
                            <div
                              className="text-xl font-black"
                              style={{ color: mainColor }}
                            >
                              ∞
                            </div>
                            <div className="text-xs text-gray-600 font-semibold">
                              Akses
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category badge */}
                    <div
                      className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      #{pivot.Category.nomor}
                    </div>
                  </motion.div>
                ))}

                {/* Info banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: mainColor }}
                    >
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 mb-2 text-lg">
                        Pembelajaran Sistematis & Terstruktur
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        <span
                          className="font-bold"
                          style={{ color: mainColor }}
                        >
                          Setiap kategori
                        </span>{' '}
                        memiliki chapter yang disusun bertahap, dilengkapi
                        subchapter yang detail.{' '}
                        <span
                          className="font-bold"
                          style={{ color: secondaryColor }}
                        >
                          Progress tracking otomatis
                        </span>{' '}
                        membantu kamu memantau kemajuan belajar secara
                        real-time!
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}
