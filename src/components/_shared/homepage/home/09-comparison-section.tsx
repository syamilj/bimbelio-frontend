'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Bimbelio } from '@/components/ui/bim-brand';
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
    // {
    //   aspek: 'Jadwal',
    //   liveclass: 'Sen–Jum 18:30–21:30',
    //   livestream: 'Sen–Jum 18:30–21:30',
    // },
    {
      aspek: 'Mulai',
      liveclass: '21 Nov 2025',
      livestream: '21 Nov 2025',
    },
    {
      aspek: 'Durasi',
      liveclass: '9 Bulan Hingga Kedinasan',
      livestream: '9 Bulan Hingga Kedinasan',
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
      liveclass: 'Materi + Intensif + Kedinasan',
      livestream: 'Materi + Intensif + UM + Kedinasan',
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
      bimbelOffline: 'Rp 4-30 juta',
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
            <span className="font-bold text-gray-900">Bandingkan sendiri.</span>{' '}
            Ini perbandingan jujur antara Bimbelio dan alternatif lain — dari
            features, support, sampai harga.
            <span className="block mt-2 text-gray-700">
              Kamu akan lihat sendiri kenapa ribuan siswa pilih Bimbelio.
            </span>
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
              Pilih yang sesuai dengan kebutuhan dan budget kamu — kedua-duanya
              powerful, tinggal pilih mana yang cocok.
            </p>
          </div>

          <div
            className="overflow-hidden rounded-3xl shadow-xl border-2"
            style={{
              boxShadow: `0 12px 40px ${mainColor}20`,
              borderColor: `${mainColor}15`,
            }}
          >
            {/* Top Accent Bar */}
            <div
              className="h-2"
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
                    <th className="px-6 py-5 text-left font-bold text-sm md:text-base">
                      Aspek
                    </th>
                    <th className="px-6 py-5 text-center font-bold text-sm md:text-base">
                      Liveclass
                    </th>
                    <th className="px-6 py-5 text-center font-bold text-sm md:text-base relative">
                      Livestream
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        🔥 BEST VALUE
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {liveclassComparison.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 text-sm md:text-base">
                        {item.aspek}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 text-sm md:text-base">
                        {typeof item.liveclass === 'boolean' ? (
                          item.liveclass ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          item.liveclass
                        )}
                      </td>
                      <td
                        className="px-6 py-4 text-center text-sm md:text-base font-semibold transition-colors"
                        style={{
                          backgroundColor: `${mainColor}10`,
                          color: mainColor,
                        }}
                      >
                        {typeof item.livestream === 'boolean' ? (
                          item.livestream ? (
                            <CheckCircle2
                              className="w-5 h-5 mx-auto"
                              style={{ color: mainColor }}
                            />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          item.livestream
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table 2: Bimbelio vs Kompetitor */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              Bimbelio vs Kompetitor
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lihat sendiri apa yang membedakan Bimbelio dari yang lain — semua
              ditampilkan jujur.
            </p>
          </div>

          <div
            className="overflow-hidden rounded-3xl shadow-xl border-2"
            style={{
              boxShadow: `0 12px 40px ${mainColor}20`,
              borderColor: `${mainColor}15`,
            }}
          >
            {/* Top Accent Bar */}
            <div
              className="h-2"
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
                    <th className="px-6 py-5 text-left font-bold text-sm md:text-base">
                      Fitur
                    </th>
                    <th
                      className="px-6 py-5 text-center font-bold text-sm md:text-base relative"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${mainColor}dd)`,
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span>
                          <Bimbelio />
                        </span>
                        <span className="bg-yellow-400 text-white text-xs font-black px-3 py-1 rounded-full">
                          PILIHAN TERBAIK
                        </span>
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center font-bold text-sm md:text-base">
                      Video On-Demand
                    </th>
                    <th className="px-6 py-5 text-center font-bold text-sm md:text-base">
                      Bimbel Offline
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bimbelioComparison.map((row, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 text-sm md:text-base">
                        {row.aspek}
                      </td>
                      <td
                        className="px-6 py-4 text-center text-sm md:text-base font-semibold transition-colors"
                        style={{
                          backgroundColor: `${mainColor}10`,
                          color: mainColor,
                        }}
                      >
                        {typeof row.bimbelio === 'boolean' ? (
                          row.bimbelio ? (
                            <CheckCircle2
                              className="w-5 h-5 mx-auto"
                              style={{ color: mainColor }}
                            />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span
                            className="text-sm md:text-base"
                            style={{ color: mainColor }}
                          >
                            {row.bimbelio}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 text-sm md:text-base">
                        {typeof row.videoOnDemand === 'boolean' ? (
                          row.videoOnDemand ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm md:text-base text-gray-700">
                            {row.videoOnDemand}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 text-sm md:text-base">
                        {typeof row.bimbelOffline === 'boolean' ? (
                          row.bimbelOffline ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
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
          <div
            className="rounded-3xl border-2 shadow-xl p-8 md:p-10"
            style={{
              background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
              borderColor: `${mainColor}20`,
            }}
          >
            {/* Main Heading */}
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 text-center">
              Pilihan Udah Jelas, Kan?
            </h3>

            {/* Strong Value Proposition */}
            <p className="text-center text-lg text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              <span
                className="font-bold"
                style={{ color: mainColor }}
              >
                Online dengan kualitas premium.
              </span>{' '}
              Tutor berpengalaman + Live interaction + AI yang siap 24/7 +{' '}
              <span
                className="font-bold"
                style={{ color: mainColor }}
              >
                harga yang sangat worth it.
              </span>{' '}
              Ribuan siswa udah tahu. Giliran kamu?
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: mainColor }}
                >
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    Mulai dari Rp 99K/bulan
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Coba semua fitur premium tanpa risiko
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: mainColor }}
                >
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    Akses Penuh dari Hari Pertama
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Nggak ada hidden features atau batasan tiba-tiba
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: mainColor }}
                >
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    Support Responsif 24/7
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Tim siap bantu kapan pun kamu butuh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: mainColor }}
                >
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    Flexible Learning Path
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Sesuai dengan kecepatan dan gaya belajar kamu
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom CTA Button */}
            {/* <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <button
                className="w-full md:w-auto px-8 py-4 rounded-3xl font-bold text-white text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                Mulai Trial Gratis Sekarang
              </button>
              <button
                className="w-full md:w-auto px-8 py-4 rounded-3xl font-bold transition-all duration-300 hover:-translate-y-1"
                style={{
                  color: mainColor,
                  borderColor: mainColor,
                  border: '2px solid',
                  backgroundColor: 'white',
                }}
              >
                Lihat Paket Lengkap
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
