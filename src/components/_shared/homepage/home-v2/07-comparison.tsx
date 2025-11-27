'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { CheckCircle2, Scale, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ComparisonSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const pathname = usePathname();

  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');

  const liveclassComparison = [
    { aspek: 'Kapasitas', liveclass: 'Max 50 siswa', livestream: 'Unlimited' },
    { aspek: 'Total sesi', liveclass: '198+ sesi live', livestream: '198+ sesi live' },
    { aspek: 'Konseling', liveclass: 'Tutor alumni PTN', livestream: 'Grup diskusi' },
    { aspek: 'Tryout', liveclass: 'IRT + analisis personal', livestream: 'IRT standar' },
    { aspek: 'Support', liveclass: 'Priority fast', livestream: 'Standard' },
    { aspek: 'Harga', liveclass: 'Rp1.499k', livestream: 'Rp799k' },
    { aspek: 'Cicilan', liveclass: '3× Rp499k', livestream: '3× Rp266k' },
  ];

  const bimbelioComparison = [
    { aspek: 'Live class', bimbelio: true, videoOnDemand: false, bimbelOffline: true },
    { aspek: 'AI Mentor 24/7', bimbelio: true, videoOnDemand: false, bimbelOffline: false },
    { aspek: 'TO IRT-based', bimbelio: true, videoOnDemand: false, bimbelOffline: 'Terbatas' },
    { aspek: 'Progress track', bimbelio: true, videoOnDemand: 'Manual', bimbelOffline: 'Terbatas' },
    { aspek: 'Harga', bimbelio: '799k-1.4jt', videoOnDemand: '200-500k', bimbelOffline: '4-30 jt' },
    { aspek: 'Fleksibilitas', bimbelio: true, videoOnDemand: true, bimbelOffline: false },
  ];

  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle2 className="w-5 h-5 mx-auto text-green-500" />
      ) : (
        <X className="w-5 h-5 mx-auto text-red-400" />
      );
    }
    return <span className="text-sm text-gray-700">{value}</span>;
  };

  return (
    <section id="comparison" className="py-16 md:py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <Scale className="w-4 h-4" />
            Worth It Nggak?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cek Dulu <span style={{ color: mainColor }}>Sebelum Decide</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami nggak maksa. Bandingin sendiri sama alternatif lain — biar kamu
            yakin pilihan kamu.
          </p>
        </div>

        {/* Table 1: Liveclass vs Livestream */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            Liveclass vs Livestream
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full bg-white text-sm">
              <thead>
                <tr style={{ backgroundColor: mainColor }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">
                    Aspek
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-white">
                    Liveclass
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-white">
                    Livestream
                  </th>
                </tr>
              </thead>
              <tbody>
                {liveclassComparison.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {row.aspek}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {row.liveclass}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {row.livestream}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Bimbelio vs Others */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            Bimbelio vs Alternatif Lain
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full bg-white text-sm">
              <thead>
                <tr style={{ backgroundColor: mainColor }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">
                    Fitur
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-white">
                    Bimbelio
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-white">
                    Video
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-white">
                    Offline
                  </th>
                </tr>
              </thead>
              <tbody>
                {bimbelioComparison.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {row.aspek}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {renderCell(row.bimbelio)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {renderCell(row.videoOnDemand)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {renderCell(row.bimbelOffline)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;

