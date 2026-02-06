'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CompetitionData {
  name: string;
  applicants: string;
  accepted: string;
  ratio: string;
  image: string;
  color: string;
}

const StatisticsSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  const competitionData: CompetitionData[] = [
    {
      name: 'SNBT',
      applicants: '785.058',
      accepted: '231.104',
      ratio: '29%',
      image: '/hero/LOGO_SNBT.webp',
      color: '#3B82F6',
    },
    {
      name: 'SIMAK UI',
      applicants: '31.289',
      accepted: '4.200',
      ratio: '13%',
      image: '/hero/LOGO_PTN_UI.webp',
      color: '#F59E0B',
    },
    {
      name: 'UM UGM',
      applicants: '34.627',
      accepted: '3.670',
      ratio: '11%',
      image: '/hero/LOGO_PTN_UGM.webp',
      color: '#10B981',
    },
    {
      name: 'PKN STAN',
      applicants: '100.000',
      accepted: '500',
      ratio: '0,5%',
      image: '/hero/LOGO_KEDINASAN_STAN.webp',
      color: '#EF4444',
    },
  ];

  return (
    <section
      id="statistics"
      className="py-16 md:py-24 px-5 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-4 bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle className="w-3.5 h-3.5" />
            FAKTA PENTING
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Persaingan <span className="text-red-500">Makin Ketat</span>
          </h2>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Ratusan ribu siswa bersaing untuk kursi yang sangat terbatas. Tanpa
            persiapan yang tepat, peluang kamu makin kecil.
          </p>
        </div>

        {/* Competition Stats - Mobile Optimized Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
          {competitionData.map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden bg-white rounded-3xl p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Colored Top Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: item.color }}
              />

              {/* Logo */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.applicants} pendaftar
                  </p>
                </div>
              </div>

              {/* Ratio Display */}
              <div className="flex items-end justify-between">
                <div>
                  <p
                    className="text-3xl md:text-4xl font-bold"
                    style={{ color: item.color }}
                  >
                    {item.ratio}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">diterima</p>
                </div>

                {/* Visual Bar */}
                <div className="w-12 h-12 md:w-14 md:h-14 relative">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="3"
                      strokeDasharray={`${parseFloat(item.ratio.replace(',', '.')) * 0.94} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Positive Message */}
        <div
          className="relative overflow-hidden rounded-3xl p-5 md:p-6"
          style={{ backgroundColor: `${mainColor}08` }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div
              className="w-12 h-12 rounded-3xl flex items-center justify-center flex-shrink-0 text-white"
              style={{ backgroundColor: mainColor }}
            >
              <TrendingUp className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Tapi kabar baiknya...
              </h3>
              <p className="text-sm text-gray-600">
                Dengan persiapan yang tepat dan support yang lengkap, kamu bisa
                jadi bagian dari yang lolos. Yang penting:{' '}
                <span
                  className="font-semibold"
                  style={{ color: mainColor }}
                >
                  mulai dari sekarang, dengan cara yang benar.
                </span>
              </p>
            </div>

            <Link
              href="/price"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: mainColor }}
            >
              Mulai Persiapan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
