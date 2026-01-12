'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
// import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  HelpCircle,
  MapPin,
  TrendingDown,
  TrendingUp,
  Video,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface PainPoint {
  icon: any;
  title: string;
  description: string;
}

interface ProblemCard {
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  painPoints: PainPoint[];
  color: string;
  iconBg: string;
}

interface CompetitionData {
  examShortName: string;
  applicants: string;
  accepted: string;
  ratio: string;
  imageUrl?: string;
  brandColor: string;
}

const ProblemSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const pathname = usePathname();

  // Get dynamic colors
  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  // Colorful brand colors palette
  const brandColors = {
    blue: '#0140ed',
    steelBlue: '#225baa',
    navy: '#103466',
    black: '#000000',
    yellow: '#ffc208',
  };

  // Competition data for statistics table
  const competitionData: CompetitionData[] = [
    {
      examShortName: 'SNBT',
      applicants: '785.058',
      accepted: '231.104',
      ratio: '29%',
      imageUrl: '/hero/LOGO_SNBT.webp',
      brandColor: brandColors.blue,
    },
    {
      examShortName: 'SIMAK UI',
      applicants: '31.289',
      accepted: '4.200',
      ratio: '13%',
      imageUrl: '/hero/LOGO_PTN_UI.webp',
      brandColor: brandColors.yellow,
    },
    {
      examShortName: 'UM UGM',
      applicants: '34.627',
      accepted: '3.670',
      ratio: '11%',
      imageUrl: '/hero/LOGO_PTN_UGM.webp',
      brandColor: brandColors.steelBlue,
    },
    {
      examShortName: 'PKN STAN',
      applicants: '100.000',
      accepted: '500',
      ratio: '0,5%',
      imageUrl: '/hero/LOGO_KEDINASAN_STAN.webp',
      brandColor: brandColors.navy,
    },
  ];

  // 3 Problem Cards dengan masing-masing pain points
  const problemCards: ProblemCard[] = useMemo(
    () => [
      {
        icon: MapPin,
        title: 'Navigate',
        subtitle: 'Peta belajar yang jelas',
        description:
          'Galau jurusan? Takut kelamaan di satu bab? Navigator guide kamu dari Core → Intensif → Super Intensif. Ada peta, nggak nyasar.',
        color: '#F59E0B', // Orange
        iconBg: '#FEF3C7',
        painPoints: [
          {
            icon: HelpCircle,
            title: 'Bingung mau mulai dari materi apa',
            description:
              'Mulai belajar asal-asalan, padahal materi saling terkait — harus tau prioritas.',
          },
          {
            icon: BookOpen,
            title: 'Bolak-balik belajar tetap nggak ngerti',
            description:
              'Ulang soal yang sama berkali-kali tanpa tahu kenapa salah, padahal pola soal gitu-gitu aja.',
          },
          {
            icon: MapPin,
            title: 'Galau pilih jurusan/jalur',
            description:
              'Ikut tren atau ikut teman — bukan karena data atau peluang nyata.',
          },
        ],
      },
      {
        icon: TrendingDown,
        title: 'Test',
        subtitle: 'Latihan soal yang cerdas',
        description:
          'Video ngeboseninใ TO pakai IRT system — ngasih soal yang pas sama level kamu. Progress terlihat real-time, bukan cuma berasa aja.',
        color: '#EC4899', // Pink
        iconBg: '#FCE7F3',
        painPoints: [
          {
            icon: TrendingDown,
            title: 'Nilai TO stagnan di 400-500an',
            description:
              'Ngerjain soal banyak, tapi skornya setara ±600.000 orang — kerja keras tanpa arah.',
          },
          {
            icon: Video,
            title: 'Nonton video doang bikin ngantuk',
            description:
              'Kamu cuma konsumsi, bukan praktek — materi lewat begitu saja, nggak nempel.',
          },
          {
            icon: TrendingUp,
            title: 'Ortu minta bukti progres',
            description:
              'Nilai angka doang nggak jelasin apa yang harus diperbaiki — jadi bukti itu kosong.',
          },
        ],
      },
      {
        icon: AlertTriangle,
        title: 'Support',
        subtitle: 'Nggak pernah sendirian',
        description:
          'Butuh dukungan intensif? AI Mentor 24/7 sudah termasuk. Plus, tutor alumni PTN top siap membimbing — sistem support lengkap terintegrasi.',
        color: '#6366F1', // Indigo
        iconBg: '#E0E7FF',
        painPoints: [
          {
            icon: Wallet,
            title: 'Biaya bimbel >10 juta bikin pusing',
            description:
              'Bayar 2-3 tempat, hasilnya tetap berantakan — uang banyak, arah nggak jelas.',
          },
          {
            icon: AlertTriangle,
            title: 'Stamina ujian drop pas tes penuh',
            description:
              'Pas diuji penuh langsung panik & capek — belum dilatih tahan lama.',
          },
        ],
      },
    ],
    [],
  );

  return (
    <section
      id="problem"
      className="py-20 md:py-24 px-4 md:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Badge
              variant="outline"
              className="px-6 py-2 text-sm font-bold text-white border-none"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              Pola Yang Sering Terjadi
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              Banyak Yang Belajar Keras,
            </h2>
            <h2
              className="text-4xl md:text-5xl font-black bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tapi Kurang Strategis
            </h2>
          </div>

          {/* Subtext */}
          <p className="text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Dari{' '}
            <span
              style={{ color: mainColor }}
              className="font-bold"
            >
              785 ribu peserta SNBT
            </span>
            , hanya{' '}
            <span
              style={{ color: mainColor }}
              className="font-bold"
            >
              1 dari 10
            </span>{' '}
            yang sampai ke PTN impian. Angka ini bukan soal IQ — tapi soal punya
            roadmap atau tidak. Mayoritas siswa belajar asal-asalan, padahal
            siswa yang berhasil punya satu kesamaan:{' '}
            <span className="font-bold">
              mereka tahu persis harus fokus ke mana
            </span>
            .
          </p>
        </div>

        {/* STATISTIK KOMPETISI TABLE */}
        <div className="mb-20">
          {/* Table Header */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div
              className="p-4 rounded-3xl text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                Statistik Kompetisi
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Angka-angka yang nunjukin seberapa ketat persaingan PTN sekarang
              </p>
            </div>
          </div>

          {/* Clean Table */}
          <div className="overflow-x-auto rounded-3xl border-2 border-gray-200 shadow-lg">
            <table className="w-full bg-white">
              {/* Table Head */}
              <thead>
                <tr
                  className="text-white"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Ujian
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                    Rasio Lolos
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                    Pendaftar
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                    Diterima
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {competitionData.map((data, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {/* Ujian Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-xl border-2 flex items-center justify-center overflow-hidden"
                          style={{
                            borderColor: data.imageUrl
                              ? 'transparent'
                              : `${data.brandColor}40`,
                            backgroundColor: data.imageUrl
                              ? 'transparent'
                              : `${data.brandColor}08`,
                          }}
                        >
                          {data.imageUrl ? (
                            <Image
                              src={data.imageUrl}
                              alt={data.examShortName}
                              className="w-full h-full object-cover"
                              width={44}
                              height={44}
                            />
                          ) : (
                            <div className="text-center">
                              <div
                                className="text-[10px] font-bold"
                                style={{ color: data.brandColor }}
                              >
                                Logo
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Exam Name */}
                        <div>
                          <div className="font-black text-gray-900 text-base">
                            {data.examShortName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Rasio Column */}
                    <td className="px-6 py-4 text-center">
                      <div
                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl font-black text-white text-lg shadow-md"
                        style={{ backgroundColor: data.brandColor }}
                      >
                        {data.ratio}
                      </div>
                    </td>
                    {/* Pendaftar Column */}
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-gray-900 text-lg">
                        {data.applicants}
                      </div>
                      <div className="text-xs text-gray-500">siswa</div>
                    </td>

                    {/* Diterima Column */}
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-gray-900 text-lg">
                        {data.accepted}
                      </div>
                      <div className="text-xs text-gray-500">siswa</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pain Points Section Header */}
        <div className="text-center mb-12">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Ini masalahnya — tanpa basa-basi. Kalau kamu ngerasa salah satu atau
            beberapa dari ini, berarti strategi belajarmu butuh di-upgrade.
          </p>
        </div>

        {/* Pain Points Grid - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {problemCards.flatMap((card) =>
            card.painPoints.map((painPoint, idx) => (
              <div
                key={`${card.title}-${idx}`}
                className="group relative bg-white rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Left Border Accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: mainColor }}
                />

                <div className="flex items-start gap-4 p-5">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: mainColor }}
                  >
                    <painPoint.icon
                      className="w-7 h-7 text-white"
                      strokeWidth={2.5}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-900 mb-1.5 leading-snug">
                      {painPoint.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {painPoint.description}
                    </p>
                  </div>
                </div>
              </div>
            )),
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div
            className="mx-auto max-w-3xl rounded-3xl border-2 p-8 shadow-md"
            style={{
              backgroundColor: `${mainColor}05`,
              borderColor: `${mainColor}30`,
            }}
          >
            <p className="text-base text-gray-700 leading-relaxed">
              <span className="font-bold text-gray-900">
                Ngalamin salah satu dari masalah di atas?
              </span>{' '}
              Kabar baiknya: kamu bukan sendirian, dan ada solusi sistematis
              yang udah proven bantu ribuan siswa keluar dari masalah yang sama.
              💪
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
