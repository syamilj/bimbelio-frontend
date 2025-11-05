'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
// import { motion } from 'framer-motion';
import { CheckCircle2, Scale, Shield, TrendingUp, X, Zap } from 'lucide-react';

export default function ComparisonSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  const isMainLandingPage =
    typeof window !== 'undefined' && window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#7C3AED');

  // Data Table 1: Liveclass vs Livestream
  const liveclassComparison = [
    {
      aspek: 'Jenis Program',
      liveclass: 'Liveclass (Premium)',
      livestream: 'Livestream (Best Value)',
    },
    {
      aspek: 'Kapasitas/kelas',
      liveclass: 'Max 50 siswa',
      livestream: 'Unlimited',
    },
    {
      aspek: 'Total sesi',
      liveclass: '198+ sesi live',
      livestream: '198+ sesi live',
    },
    {
      aspek: 'Jadwal',
      liveclass: 'Sen–Jum 18:30–21:30',
      livestream: 'Sen–Jum 18:30–21:30',
    },
    {
      aspek: 'Mulai',
      liveclass: '21 Nov 2025',
      livestream: '21 Nov 2025',
    },
    {
      aspek: 'Durasi',
      liveclass: '6 Bulan (Bimbel → Intensif)',
      livestream: '6 Bulan (Bimbel → Intensif)',
    },
    {
      aspek: 'Konseling 1-on-1',
      liveclass: 'Dengan tutor alumni PTN',
      livestream: 'Grup diskusi',
    },
    {
      aspek: 'Grup Diskusi',
      liveclass: 'Small batch eksklusif',
      livestream: 'Grup besar',
    },
    {
      aspek: 'Tryout',
      liveclass: 'IRT-based + analisis personal',
      livestream: 'IRT-based standar',
    },
    {
      aspek: 'Progress Report',
      liveclass: 'Mingguan + feedback tutor',
      livestream: 'Otomatis sistem',
    },
    {
      aspek: 'Support',
      liveclass: 'Priority & fast response',
      livestream: 'Standard response',
    },
    {
      aspek: 'Coverage',
      liveclass: 'Materi + Intensif + Super',
      livestream: 'All + UM + Kedinasan',
    },
    {
      aspek: 'Harga',
      liveclass: 'Rp1.499k',
      livestream: 'Rp799k',
    },
    {
      aspek: 'Cicilan',
      liveclass: '3× Rp499k',
      livestream: '3× Rp266k',
    },
  ];

  // Data Table 2: Bimbelio vs Alternatif Lain
  const bimbelioComparison = [
    {
      aspek: 'Live class interaktif',
      bimbelio: true,
      videoOnDemand: false,
      bimbelOffline: true,
    },
    {
      aspek: 'Rekaman lengkap',
      bimbelio: true,
      videoOnDemand: true,
      bimbelOffline: false,
    },
    {
      aspek: 'AI Mentor 24/7',
      bimbelio: true,
      videoOnDemand: false,
      bimbelOffline: false,
    },
    {
      aspek: 'TO IRT-based',
      bimbelio: true,
      videoOnDemand: false,
      bimbelOffline: 'Terbatas',
    },
    {
      aspek: 'Progress tracking',
      bimbelio: true,
      videoOnDemand: 'Manual',
      bimbelOffline: 'Terbatas',
    },
    {
      aspek: 'Harga',
      bimbelio: 'Rp 799-1.499k',
      videoOnDemand: 'Rp 200-500k',
      bimbelOffline: 'Rp 3-8 juta',
    },
    {
      aspek: 'Fleksibilitas',
      bimbelio: true,
      videoOnDemand: true,
      bimbelOffline: false,
    },
  ];

  return (
    <section
      id="comparison"
      className="py-24 px-4 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            className="mb-6 px-6 py-2 text-sm font-bold text-white border-none"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Scale className="w-4 h-4 mr-2 inline" />
            Data Speaks Louder
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Masih Ragu? —
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Ini Data Perbandingannya
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            Data speaks louder. Ini perbandingan jujur antara program aku dan
            alternatif lain di pasaran — biar kamu makin yakin.
          </p>

          {/* Info Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
              style={{
                backgroundColor: `${mainColor}15`,
                border: `1.5px solid ${mainColor}30`,
              }}
            >
              <TrendingUp
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: mainColor }}
              >
                Perbandingan Jujur
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
              style={{
                backgroundColor: '#00C85315',
                border: '1.5px solid #00C85330',
              }}
            >
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                Data Transparan
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
              style={{
                backgroundColor: '#9C27B015',
                border: '1.5px solid #9C27B030',
              }}
            >
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">
                Best Value
              </span>
            </div>
          </div>
        </div>

        {/* Table 1: Liveclass vs Livestream */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              Liveclass vs Livestream
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilih yang sesuai dengan kebutuhan dan budget kamu
            </p>
          </div>

          <div
            className="overflow-hidden rounded-3xl shadow-md border-2 border-gray-100"
            style={{ boxShadow: `0 8px 32px ${mainColor}15` }}
          >
            {/* Top Accent Bar */}
            <div
              className="h-1.5"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="text-white"
                    style={{ background: mainColor }}
                  >
                    <th className="px-6 py-4 text-left font-bold text-sm md:text-base">
                      Aspek
                    </th>
                    <th className="px-6 py-4 text-center font-bold text-sm md:text-base">
                      Liveclass
                    </th>
                    <th className="px-6 py-4 text-center font-bold text-sm md:text-base">
                      Livestream
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {liveclassComparison.map((row, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 text-sm md:text-base border-b border-gray-200">
                        {row.aspek}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 text-sm md:text-base border-b border-gray-200">
                        {row.liveclass}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 text-sm md:text-base border-b border-gray-200">
                        {row.livestream}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table 2: Bimbelio vs Alternatif Lain */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              Bimbelio vs Alternatif Lain
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bandingkan fitur dan value yang kamu dapatkan
            </p>
          </div>

          <div
            className="overflow-hidden rounded-3xl shadow-md border-2 border-gray-100"
            style={{ boxShadow: `0 8px 32px ${mainColor}15` }}
          >
            {/* Top Accent Bar */}
            <div
              className="h-1.5"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="text-white"
                    style={{ background: mainColor }}
                  >
                    <th className="px-6 py-4 text-left font-bold text-sm md:text-base">
                      Aspek
                    </th>
                    <th className="px-6 py-4 text-center font-bold text-sm md:text-base">
                      Bimbelio
                    </th>
                    <th className="px-6 py-4 text-center font-bold text-sm md:text-base">
                      Video-on-Demand
                    </th>
                    <th className="px-6 py-4 text-center font-bold text-sm md:text-base">
                      Bimbel Offline
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bimbelioComparison.map((row, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 text-sm md:text-base border-b border-gray-200">
                        {row.aspek}
                      </td>
                      <td className="px-6 py-4 text-center border-b border-gray-200">
                        {typeof row.bimbelio === 'boolean' ? (
                          row.bimbelio ? (
                            <CheckCircle2
                              className="w-6 h-6 mx-auto"
                              style={{ color: '#00C853' }}
                            />
                          ) : (
                            <X className="w-6 h-6 mx-auto text-gray-400" />
                          )
                        ) : (
                          <span className="text-sm md:text-base text-gray-700">
                            {row.bimbelio}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center border-b border-gray-200">
                        {typeof row.videoOnDemand === 'boolean' ? (
                          row.videoOnDemand ? (
                            <CheckCircle2
                              className="w-6 h-6 mx-auto"
                              style={{ color: '#00C853' }}
                            />
                          ) : (
                            <X className="w-6 h-6 mx-auto text-gray-400" />
                          )
                        ) : (
                          <span className="text-sm md:text-base text-gray-700">
                            {row.videoOnDemand}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center border-b border-gray-200">
                        {typeof row.bimbelOffline === 'boolean' ? (
                          row.bimbelOffline ? (
                            <CheckCircle2
                              className="w-6 h-6 mx-auto"
                              style={{ color: '#00C853' }}
                            />
                          ) : (
                            <X className="w-6 h-6 mx-auto text-gray-400" />
                          )
                        ) : (
                          <span className="text-sm md:text-base text-gray-700">
                            {row.bimbelOffline}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Bottom CTA */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md p-8">
            {/* Icon Header */}
            <div className="mb-4 flex items-center justify-center gap-3">
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Scale className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Sudah Jelas Bedanya?
              </h3>
            </div>

            <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              <span className="font-bold text-gray-900">
                Bimbelio kasih kamu fleksibilitas online + kualitas premium
              </span>{' '}
              dengan harga yang masuk akal. Nggak perlu keluar jutaan buat
              bimbel offline, tapi tetap dapet{' '}
              <span className="font-bold text-gray-900">live interaction</span>{' '}
              yang nggak kamu dapet di video biasa.
            </p>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t-2 border-gray-100 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-semibold text-gray-700">
                  Harga Transparan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-semibold text-gray-700">
                  Fitur Lengkap
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="font-semibold text-gray-700">
                  Best Value for Money
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
