'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  MessageCircle,
  PlayCircle,
  Radio,
  Tv,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function LiveLearningPage() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* HEADER SECTION */}
        <div className="text-center mb-12 md:mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: mainColor }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: mainColor }}
            >
              Live Learning Platform
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-tight">
            Belajar Langsung dengan <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tutor Berpengalaman
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Ikuti kelas live interaktif atau livestream berkualitas tinggi dari
            tutor alumni PTN top. Tanya jawab langsung, dapatkan feedback
            real-time, dan maksimalkan persiapan ujian Anda.
          </p>
        </div>

        {/* MAIN CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* LIVECLASS CARD */}
          <Card className="group relative hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden bg-white">
            {/* Animated gradient background */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${mainColor}05, ${secondaryColor}05)`,
              }}
            />

            {/* Top accent bar */}
            <div
              className="h-3 w-full"
              style={{
                background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
              }}
            />

            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                    style={{
                      backgroundColor: `${mainColor}20`,
                      border: `2px solid ${mainColor}40`,
                    }}
                  >
                    <PlayCircle
                      className="w-8 h-8"
                      style={{ color: mainColor }}
                    />
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div
                  className="px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: mainColor }}
                >
                  ⚡ Interaktif
                </div>
              </div>
              <CardTitle className="text-3xl font-black text-gray-900 mb-2">
                Liveclass
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Kelas live dengan interaksi langsung bersama tutor
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
              {/* Features List */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <MessageCircle
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      Tanya Jawab Real-Time
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Interaksi langsung dengan tutor selama kelas berlangsung
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Users
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Komunitas Belajar</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Belajar bersama siswa lain dengan tujuan sama
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Clock
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Jadwal Teratur</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Kelas dengan jadwal tetap yang konsisten
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Award
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      Sertifikat Kehadiran
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Dapatkan sertifikat setelah menyelesaikan kelas
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* CTA Button */}
              <Link
                href={`/${website_sub_category_id}/user/live-learning/liveclass`}
                className="block"
              >
                <Button
                  className="w-full h-13 text-base font-bold rounded-xl group/btn text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  style={{ backgroundColor: mainColor }}
                >
                  <span className="relative z-10">Jelajahi Liveclass</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* LIVESTREAM CARD */}
          <Card className="group relative hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden bg-white">
            {/* Animated gradient background */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${secondaryColor}05, ${mainColor}05)`,
              }}
            />

            {/* Top accent bar */}
            <div
              className="h-3 w-full"
              style={{
                background: `linear-gradient(90deg, ${secondaryColor}, ${mainColor})`,
              }}
            />

            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                    style={{
                      backgroundColor: `${secondaryColor}20`,
                      border: `2px solid ${secondaryColor}40`,
                    }}
                  >
                    <Tv
                      className="w-8 h-8"
                      style={{ color: secondaryColor }}
                    />
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <Radio className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div
                  className="px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: secondaryColor }}
                >
                  📡 Live Broadcast
                </div>
              </div>
              <CardTitle className="text-3xl font-black text-gray-900 mb-2">
                Livestream
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Siaran langsung untuk jangkauan peserta yang lebih luas
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
              {/* Features List */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${secondaryColor}15` }}
                    >
                      <Radio
                        className="w-5 h-5"
                        style={{ color: secondaryColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Broadcast HD</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Siaran berkualitas tinggi dari studio profesional
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${secondaryColor}15` }}
                    >
                      <Users
                        className="w-5 h-5"
                        style={{ color: secondaryColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Akses Massal</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Ribuan peserta bisa menonton bersamaan
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${secondaryColor}15` }}
                    >
                      <Clock
                        className="w-5 h-5"
                        style={{ color: secondaryColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Rekaman On-Demand</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tonton ulang kapan saja sesuai kenyamanan
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${secondaryColor}15` }}
                    >
                      <Award
                        className="w-5 h-5"
                        style={{ color: secondaryColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      Materi Berkualitas
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Konten expert yang sesuai kebutuhan ujian
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* CTA Button */}
              <Link
                href={`/${website_sub_category_id}/user/live-learning/livestream`}
                className="block"
              >
                <Button
                  className="w-full h-13 text-base font-bold rounded-xl group/btn text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <span className="relative z-10">Jelajahi Livestream</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* COMPARISON SECTION */}
        <Card className="border-0 rounded-3xl overflow-hidden shadow-lg mb-12">
          <CardHeader
            className="pb-4"
            style={{ backgroundColor: `${mainColor}08` }}
          >
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
              Perbandingan Liveclass vs Livestream
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                      Fitur
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">
                      Liveclass
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">
                      Livestream
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      Interaksi Langsung
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      Jangkauan Peserta
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-600">Terbatas</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-900 font-semibold">
                        Ribuan Orang
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      Jadwal Kelas
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      Rekaman
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      Sertifikat
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA SECTION */}
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">
            Pilih metode pembelajaran yang paling sesuai dengan gaya belajar
            Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${website_sub_category_id}/user/live-learning/liveclass`}
            >
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold rounded-xl text-white"
                style={{ backgroundColor: mainColor }}
              >
                Mulai Liveclass
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link
              href={`/${website_sub_category_id}/user/live-learning/livestream`}
            >
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-semibold rounded-xl border-2"
                style={{
                  color: secondaryColor,
                  borderColor: secondaryColor,
                }}
              >
                Mulai Livestream
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
