'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
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
    <>
      {plan.PlanSubscription?.PlanFeature && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {plan.PlanSubscription.PlanFeature.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <CardHeader
                  className="text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%222%22/%3E%3C/g%3E%3C/svg%3E')]" />
                  </div>

                  <CardTitle className="flex items-center gap-4 text-xl relative">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      {getFeatureIcon(feature.type)}
                    </div>
                    <div>
                      <div className="font-black text-2xl capitalize">
                        {feature.type === 'COURSE' && 'Materi Kursus Premium'}
                        {feature.type === 'DOCUMENT' && 'Bank Dokumen Lengkap'}
                        {feature.type === 'LIVECLASS' && 'Live Class Eksklusif'}
                        {!['COURSE', 'DOCUMENT', 'LIVECLASS'].includes(
                          feature.type,
                        ) && feature.type.toLowerCase().replace('_', ' ')}
                      </div>
                      <div className="text-white/80 text-sm font-normal mt-1">
                        Akses penuh tanpa batas
                      </div>
                    </div>
                    <Badge className="ml-auto bg-white/20 text-white border-none">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feature.type === 'COURSE' &&
                      feature.Pivot_Plan_Category.map((pivot, pivotIndex) => (
                        <motion.div
                          key={pivot.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: pivotIndex * 0.1,
                          }}
                          viewport={{ once: true }}
                          className="group/item p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                        >
                          {/* Background decoration */}
                          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-4 translate-x-4 opacity-50" />

                          <div className="relative flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl text-white text-sm flex items-center justify-center font-bold shadow-lg shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                              }}
                            >
                              {pivot.Category.nomor}
                            </div>
                            <div className="flex-1">
                              <span className="font-black text-gray-900 group-hover/item:text-blue-600 transition-colors block text-sm leading-tight">
                                {pivot.Category.name}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                Kategori #{pivot.Category.nomor}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-blue-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                          </div>
                        </motion.div>
                      ))}

                    {feature.type === 'DOCUMENT' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="group/item col-span-3 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                      >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -translate-y-8 translate-x-8 opacity-50" />

                        <div className="relative flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                            }}
                          >
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <span className="font-black text-gray-900 group-hover/item:text-emerald-600 transition-colors text-lg">
                              Akses ke Semua Dokumen
                            </span>
                            <div className="text-gray-600 mt-1">
                              <span
                                className="font-bold"
                                style={{ color: mainColor }}
                              >
                                Gak ada yang terkunci!
                              </span>{' '}
                              Semua materi, e-book, dan dokumen pendukung bisa
                              diakses kapan saja.
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                        </div>
                      </motion.div>
                    )}

                    {feature.type === 'LIVECLASS' &&
                      feature.liveClassesPerWeek && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                          viewport={{ once: true }}
                          className="group/item col-span-3 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                        >
                          {/* Background decoration */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full -translate-y-8 translate-x-8 opacity-50" />

                          <div className="relative flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                              }}
                            >
                              <Play className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <span className="font-black text-gray-900 group-hover/item:text-purple-600 transition-colors text-lg">
                                {feature.liveClassesPerWeek} Live Class Per
                                Minggu
                              </span>
                              <div className="text-gray-600 mt-1">
                                <span
                                  className="font-bold"
                                  style={{ color: mainColor }}
                                >
                                  Interaksi langsung
                                </span>{' '}
                                dengan instruktur terbaik. Tanya jawab real-time
                                & pembahasan mendalam.
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-purple-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                          </div>
                        </motion.div>
                      )}
                  </div>

                  {/* Feature summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200/50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: secondaryColor,
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-sm mb-1">
                          Goal kita jelas: Kamu sukses!
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          <span
                            className="font-bold"
                            style={{ color: mainColor }}
                          >
                            Semua fitur ini
                          </span>{' '}
                          dirancang khusus buat memastikan kamu bisa meraih
                          target dengan pembelajaran yang optimal.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}
