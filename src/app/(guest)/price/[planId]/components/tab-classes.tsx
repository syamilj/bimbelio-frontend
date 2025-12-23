'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Clock,
  Crown,
  Play,
  Users,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlanDataType } from './_helper';

export default function TabClasses({ plan }: { plan: PlanDataType }) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      {plan.Pivot_LiveClass_Plan.map((pivot, index) => (
        <motion.div
          key={pivot.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div className="md:flex">
              <div className="md:w-1/3">
                {pivot.LiveClass.image && (
                  <div className="relative h-48 md:h-full overflow-hidden">
                    <Image
                      src={pivot.LiveClass.image || '/placeholder.svg'}
                      alt={pivot.LiveClass.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}40, ${secondaryColor}40)`,
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className="text-white border-none font-bold"
                        style={{ backgroundColor: mainColor }}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Kelas #{index + 1}
                      </Badge>
                    </div>
                    {pivot.LiveClass.isRecord && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-red-500 text-white border-none font-semibold animate-pulse">
                          <Video className="w-3 h-3 mr-1" />
                          LIVE
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="md:w-2/3 p-6">
                <div className="space-y-6">
                  <div>
                    <Badge
                      className="mb-3 px-3 py-1 text-xs font-bold text-white border-none"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Live Class Eksklusif
                    </Badge>
                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                      {pivot.LiveClass.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {pivot.LiveClass.description}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: mainColor }}
                        >
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                            Jadwal
                          </div>
                          <div className="font-black text-gray-900">
                            {formatDate(pivot.LiveClass.startDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: secondaryColor,
                          }}
                        >
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                            Durasi
                          </div>
                          <div className="font-black text-gray-900">
                            {pivot.LiveClass.duration} menit
                          </div>
                        </div>
                      </div>
                    </div>

                    {pivot.LiveClass.maxParticipant && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: mainColor }}
                          >
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                              Kapasitas
                            </div>
                            <div className="font-black text-gray-900">
                              Max {pivot.LiveClass.maxParticipant}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {pivot.LiveClass.isRecord && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200/50">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: secondaryColor,
                            }}
                          >
                            <Video className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                              Status
                            </div>
                            <div className="font-black text-gray-900">
                              Direkam
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <Link
                      href={`/${pivot.LiveClass.websiteSubCategoryId}/user/live-class/${pivot.liveClassId}`}
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                    >
                      <Button
                        className="group/btn w-full sm:w-auto text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        style={{
                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                        }}
                      >
                        <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Ikuti Kelas Live
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom highlight */}
            <div
              className="h-1"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            />
          </Card>
        </motion.div>
      ))}

      {/* No classes message */}
      {plan.Pivot_LiveClass_Plan.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: `linear-gradient(135deg, ${mainColor}20, ${secondaryColor}20)`,
            }}
          >
            <Play
              className="w-10 h-10"
              style={{ color: mainColor }}
            />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">
            Live Class Segera Hadir
          </h3>
          <p className="text-gray-600 text-lg">
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              Tunggu update dari kita!
            </span>{' '}
            Kelas live eksklusif akan segera tersedia untuk membermu.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
