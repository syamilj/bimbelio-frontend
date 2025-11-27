'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface CompetitionData {
  name: string;
  applicants: string;
  accepted: string;
  ratio: string;
  image: string;
}

const StatisticsSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const pathname = usePathname();

  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');

  const competitionData: CompetitionData[] = [
    {
      name: 'SNBT',
      applicants: '785.058',
      accepted: '231.104',
      ratio: '29%',
      image: '/hero/LOGO_SNBT.webp',
    },
    {
      name: 'SIMAK UI',
      applicants: '31.289',
      accepted: '4.200',
      ratio: '13%',
      image: '/hero/LOGO_PTN_UI.webp',
    },
    {
      name: 'UM UGM',
      applicants: '34.627',
      accepted: '3.670',
      ratio: '11%',
      image: '/hero/LOGO_PTN_UGM.webp',
    },
    {
      name: 'PKN STAN',
      applicants: '100.000',
      accepted: '500',
      ratio: '0,5%',
      image: '/hero/LOGO_KEDINASAN_STAN.webp',
    },
  ];

  return (
    <section id="statistics" className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: '#EF4444' }}
          >
            <AlertTriangle className="w-4 h-4" />
            Fakta yang Perlu Kamu Tahu
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Persaingan <span className="text-red-500">Semakin Ketat</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Setiap tahun, ratusan ribu siswa bersaing untuk kursi terbatas.
            Tanpa persiapan yang tepat, peluang kamu makin kecil.
          </p>
        </div>

        {/* Competition Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {competitionData.map((item) => (
            <div
              key={item.name}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{item.name}</p>
              <p className="text-2xl font-bold text-red-500 mb-1">{item.ratio}</p>
              <p className="text-xs text-gray-500">diterima</p>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div
          className="flex items-center justify-center gap-3 p-4 rounded-2xl"
          style={{ backgroundColor: `${mainColor}10` }}
        >
          <TrendingDown className="w-5 h-5" style={{ color: mainColor }} />
          <p className="text-sm font-medium" style={{ color: mainColor }}>
            Tapi tenang — dengan persiapan yang benar, kamu bisa jadi bagian yang lolos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
