'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  Target,
  TrendingDown,
  Zap,
} from 'lucide-react';
import { useMemo } from 'react';

interface PainPoint {
  title: string;
  description: string;
  category: 'utama' | 'lanjutan' | 'psikologis';
  icon: React.ReactNode;
  colorFrom: string;
  colorTo: string;
}

interface CompetitionData {
  exam: string;
  examShortName: string;
  applicants: string;
  accepted: string;
  ratio: string;
  imageUrl?: string; // Placeholder untuk image nanti
  brandColor: string; // Warna brand untuk setiap card
}

const ProblemSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const isMainLandingPage = window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  // Vibrant colors palette untuk pain points
  const vibrantColors = [
    { from: '#0EA5E9', to: '#06B6D4', name: 'Cyan' },
    { from: '#8B5CF6', to: '#D946EF', name: 'Purple' },
    { from: '#10B981', to: '#14B8A6', name: 'Emerald' },
    { from: '#F59E0B', to: '#F97316', name: 'Amber' },
    { from: '#EF4444', to: '#DC2626', name: 'Rose' },
    { from: '#EC4899', to: '#DB2777', name: 'Pink' },
    { from: '#84CC16', to: '#65A30D', name: 'Lime' },
    { from: '#6366F1', to: '#4F46E5', name: 'Indigo' },
  ];

  // Colorful brand colors palette
  const brandColors = {
    blue: '#0140ed', // Vibrant Blue
    steelBlue: '#225baa', // Steel Blue
    navy: '#103466', // Navy
    black: '#000000', // Black
    yellow: '#ffc208', // Yellow
  };

  // Competition data for statistics table
  const competitionData: CompetitionData[] = [
    {
      exam: 'Seleksi Nasional Berbasih Tes',
      examShortName: 'SNBT',
      applicants: '785.058',
      accepted: '231.104',
      ratio: '29%',
      imageUrl: '/tutors/LOGO_SNBT.webp', // Placeholder - akan diisi image nanti
      brandColor: brandColors.blue, // Vibrant Blue
    },
    {
      exam: 'SIMAK Universitas Indonesia',
      examShortName: 'SIMAK UI',
      applicants: '31.289',
      accepted: '4.200',
      ratio: '13%',
      imageUrl: '/tutors/LOGO_PTN_UI.webp', // Placeholder - akan diisi image nanti
      brandColor: brandColors.yellow, // Yellow
    },
    {
      exam: 'Ujian Mandiri Universitas Gadjah Mada',
      examShortName: 'UM UGM',
      applicants: '34.627',
      accepted: '3.670',
      ratio: '11%',
      imageUrl: '/tutors/LOGO_PTN_UGM.webp', // Placeholder - akan diisi image nanti
      brandColor: brandColors.steelBlue, // Steel Blue
    },
    {
      exam: 'Politeknik Keuangan Negara STAN',
      examShortName: 'PKN STAN',
      applicants: '100.000',
      accepted: '500',
      ratio: '0,5%',
      imageUrl: '/tutors/LOGO_KEDINASAN_STAN.webp', // Placeholder - akan diisi image nanti
      brandColor: brandColors.navy, // Navy
    },
  ];

  // Pain Points dengan narasi original
  const painPoints: PainPoint[] = useMemo(
    () => [
      // MASALAH UTAMA
      {
        title: 'Nilai Stuck di Zone Nyaman',
        description:
          'Nilai kok 400-500an gitu aja. Udah coba semua metode, tapi nilai lo tetap mandeg. Parah banget sih kalau SNBT momentum tapi nilai gue nggak naik-naik.',
        category: 'utama',
        icon: <TrendingDown className="w-6 h-6" />,
        colorFrom: vibrantColors[4].from,
        colorTo: vibrantColors[4].to,
      },
      {
        title: 'Bingung Dari Mana Mulai',
        description:
          'Materi banyak banget, bab-nya juga bergengsi berapa pun. Mana yang harus dikerjain duluan? Mulai dari mana? Prioritas apa? Waktu lo terbatas, tapi materi unlimited.',
        category: 'utama',
        icon: <Brain className="w-6 h-6" />,
        colorFrom: vibrantColors[1].from,
        colorTo: vibrantColors[1].to,
      },

      // TANTANGAN LANJUTAN
      {
        title: 'Materi Itu Overwhelming Banget',
        description:
          'Nonton video berjam-jam, tapi tetap aja merasa belum paham. Teori membludak, praktik minim. Jenuh banget apalagi info yang nggak nyangkut di otak lo.',
        category: 'lanjutan',
        icon: <AlertCircle className="w-6 h-6" />,
        colorFrom: vibrantColors[3].from,
        colorTo: vibrantColors[3].to,
      },
      {
        title: 'Biaya Bimbel Bikin Kantong Jebol',
        description:
          'Les bimbel bisa 10+ juta per paket. Terus kursus online, buku soal, expert session... Eh kok hasilnya gue nggak sebanding? Sakit hati kalau nggak lolos.',
        category: 'lanjutan',
        icon: <TrendingDown className="w-6 h-6" />,
        colorFrom: vibrantColors[2].from,
        colorTo: vibrantColors[2].to,
      },
      {
        title: 'Progres Itu Invisible & Mengecewakan',
        description:
          'Belajar terus-terusan tapi gue nggak bisa lihat kemajuan yang nyata. Belum tahu soal mana yang udah dikuasai lo, mana yang masih lemah. Jadi kayak tawon di toples.',
        category: 'lanjutan',
        icon: <BarChart3 className="w-6 h-6" />,
        colorFrom: vibrantColors[0].from,
        colorTo: vibrantColors[0].to,
      },

      // HAMBATAN PSIKOLOGIS
      {
        title: 'Stamina & Mental Turun Drastis',
        description:
          'Awalnya semangat lo membara, cita-cita tinggi banget. Tapi lama-lama? Males banget. Burnout di tengah jalan, stres berlebihan, mimpi buruk soal tes.',
        category: 'psikologis',
        icon: <Zap className="w-5 h-5" />,
        colorFrom: vibrantColors[6].from,
        colorTo: vibrantColors[6].to,
      },
      {
        title: 'Galau Pilih Jurusan yang Pas',
        description:
          'Tahu sih harus milih jurusan, tapi gue nggak confident mana yang cocok buat lo. Takut sesal, takut salah pilih, takut nggak lolos juga.',
        category: 'psikologis',
        icon: <Target className="w-5 h-5" />,
        colorFrom: vibrantColors[0].from,
        colorTo: vibrantColors[0].to,
      },
      {
        title: 'Takut Membuang-buang Waktu',
        description:
          'Takut fokus ke hal yang akhirnya gue nggak penting pas tes. Takut effort sekarang nggak ada hasil di hari H. Panik terus-terusan nih.',
        category: 'psikologis',
        icon: <AlertTriangle className="w-5 h-5" />,
        colorFrom: vibrantColors[7].from,
        colorTo: vibrantColors[7].to,
      },
    ],
    [],
  );

  // Group pain points by category
  const groupedPainPoints = {
    utama: painPoints.filter((p) => p.category === 'utama'),
    lanjutan: painPoints.filter((p) => p.category === 'lanjutan'),
    psikologis: painPoints.filter((p) => p.category === 'psikologis'),
  };

  return (
    <section className="py-20 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <Badge
              variant="outline"
              className="px-6 py-2 text-sm font-bold text-white border-none"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              REALITA YANG PERLU DIHADAPI
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              Pernah Merasa
            </h2>
            <h2
              className="text-4xl md:text-5xl font-black bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Seperti Ini?
            </h2>
          </motion.div>

          {/* Subtext */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-4 text-lg text-gray-700 leading-relaxed"
          >
            <p>
              Jangan merasa sendirian. Dari{' '}
              <span
                className="font-bold"
                style={{ color: mainColor }}
              >
                785 ribu peserta SNBT
              </span>
              , cuma{' '}
              <span
                className="font-bold"
                style={{ color: mainColor }}
              >
                1 dari 10
              </span>{' '}
              yang beneran lolos ke PTN impian lo. Sisanya? Ngalamin hal yang
              sama kayak lo.
            </p>
            <p>
              Tapi tunggu,{' '}
              <span
                className="font-bold"
                style={{ color: secondaryColor }}
              >
                masalahnya bukan soal effort atau IQ lo kok
              </span>
              . Ribuan siswa yang IQ-nya standar aja bisa masuk PTN top dengan
              nilai 600+. Mereka tau sesuatu yang lo belum tau.
            </p>
            <p>
              Mereka tau{' '}
              <span
                className="font-bold"
                style={{ color: mainColor }}
              >
                sistem yang tepat buat belajar
              </span>
              . Strategi yang terukur. Metode yang proven. Bukan cuma sekadar
              nonton video atau ngapalin soal.
            </p>
            <p className="text-sm md:text-base italic text-gray-600 border-l-4 pl-4 my-6 text-left">
              <span
                className="inline-block"
                style={{ borderColor: mainColor }}
              >
                &quot;Banyak siswa pintar yang nggak lolos. Kenapa? Karena
                mereka belajar keras, tapi gak cerdas. Sebaliknya, banyak siswa
                biasa yang lolos karena mereka belajar cerdas, gak cuma
                keras.&quot;
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* STATISTIK KOMPETISI TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          {/* Table Header Icon + Title */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div
              className="p-4 rounded-xl text-white shadow-lg"
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

          {/* Modern Card-Based Competition Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitionData.map((data, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl border-2 hover:border-opacity-50 shadow-lg hover:shadow-sm transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: `${data.brandColor}20`,
                }}
              >
                {/* Top Accent Bar dengan Brand Color */}
                <div
                  className="h-2 w-full"
                  style={{
                    backgroundColor: data.brandColor,
                  }}
                />

                <div className="p-6">
                  {/* Header with Image Placeholder */}
                  <div className="flex items-start gap-4 mb-6">
                    {/* Image Placeholder dengan Brand Color */}
                    <div
                      className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-solid"
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
                        <img
                          src={data.imageUrl}
                          alt={data.examShortName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div
                            className="text-xs font-bold mb-1"
                            style={{ color: data.brandColor }}
                          >
                            Logo
                          </div>
                          <div
                            className="text-[10px] opacity-60"
                            style={{ color: data.brandColor }}
                          >
                            80x80
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Exam Info */}
                    <div className="flex-1">
                      <h4 className="text-xl md:text-2xl font-black text-gray-900 mb-1">
                        {data.examShortName}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                        {data.exam}
                      </p>
                    </div>

                    {/* Ratio Badge dengan Brand Color */}
                    <div className="flex-shrink-0">
                      <div
                        className="px-4 py-2 rounded-xl shadow-md"
                        style={{
                          backgroundColor: data.brandColor,
                        }}
                      >
                        <div className="text-xs font-bold text-white/80 mb-0.5">
                          Rasio Lolos
                        </div>
                        <div className="text-2xl font-black text-white">
                          {data.ratio}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Pendaftar */}
                    <div
                      className="p-4 rounded-xl border-2 bg-gradient-to-br from-gray-50 to-white transition-all duration-300 group-hover:shadow-md"
                      style={{
                        borderColor: `${data.brandColor}15`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: data.brandColor }}
                        />
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                          Pendaftar
                        </p>
                      </div>
                      <p className="text-2xl md:text-3xl font-black text-gray-900">
                        {data.applicants}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Total peserta
                      </p>
                    </div>

                    {/* Diterima */}
                    <div
                      className="p-4 rounded-xl border-2 bg-gradient-to-br from-gray-50 to-white transition-all duration-300 group-hover:shadow-md"
                      style={{
                        borderColor: `${data.brandColor}15`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: data.brandColor }}
                        />
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                          Diterima
                        </p>
                      </div>
                      <p className="text-2xl md:text-3xl font-black text-gray-900">
                        {data.accepted}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Yang lolos</p>
                    </div>
                  </div>

                  {/* Bottom Insight dengan Brand Color */}
                  <div
                    className="mt-4 p-3 rounded-lg border-l-4 text-xs md:text-sm"
                    style={{
                      backgroundColor: `${data.brandColor}08`,
                      borderColor: data.brandColor,
                    }}
                  >
                    <p className="text-gray-700">
                      <span className="font-bold">
                        {(
                          (parseFloat(data.applicants.replace(/\./g, '')) /
                            parseFloat(data.accepted.replace(/\./g, ''))) |
                          0
                        ).toLocaleString('id-ID')}{' '}
                        siswa
                      </span>{' '}
                      bersaing untuk <span className="font-bold">1 kursi</span>
                    </p>
                  </div>
                </div>

                {/* Hover Effect Glow dengan Brand Color */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${data.brandColor}12, transparent 70%)`,
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 p-6 rounded-xl border-l-4"
            style={{
              backgroundColor: `${mainColor}08`,
              borderColor: mainColor,
            }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: mainColor }}
              />
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                <span className="font-black">Apa Artinya?</span> Di SNBT aja,
                dari 785 ribu peserta, cuma 231 ribu yang lolos (29%). Itu
                berarti{' '}
                <span className="font-black">7 dari 10 siswa gak lolos</span>,
                meski udah belajar keras. Kenapa? Karena mereka gak punya{' '}
                <span className="font-black">strategi yang tepat</span> buat
                maksimalin score.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Pain Points Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Tapi Tunggu... Coba Lihat
          </h3>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Setiap siswa punya masalah berbeda. Cek poin di bawah - kemungkinan
            besar lo ngalamin minimal 3 dari 8 ini.
          </p>
        </motion.div>

        {/* Pain Points Grid */}
        <div className="space-y-16">
          {/* UTAMA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: mainColor }}
              />
              Masalah Utama (Paling Sering)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedPainPoints.utama.map((point, index) => (
                <PainPointCard
                  key={`utama-${index}`}
                  point={point}
                  index={index}
                />
              ))}
            </div>
          </motion.div>

          {/* LANJUTAN Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              />
              Tantangan Lanjutan (Sering Diabaikan)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groupedPainPoints.lanjutan.map((point, index) => (
                <PainPointCard
                  key={`lanjutan-${index}`}
                  point={point}
                  index={index}
                />
              ))}
            </div>
          </motion.div>

          {/* PSIKOLOGIS Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: mainColor }}
              />
              Hambatan Psikologis (Sering Terabaikan)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groupedPainPoints.psikologis.map((point, index) => (
                <PainPointCard
                  key={`psikologis-${index}`}
                  point={point}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div
            className="rounded-3xl p-8 max-w-3xl mx-auto"
            style={{
              background: `linear-gradient(to right, ${mainColor}08, ${secondaryColor}08)`,
            }}
          >
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
              Tapi Ada Solusinya!
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Blueprint gue dirancang khusus buat handle semua masalah ini. Dari
              diagnosis akurat, strategi terjelas, sampai support psikologis
              yang nyata. Semuanya dalam satu sistem yang terbukti.
            </p>
            <div className="flex items-center justify-center gap-3 text-green-600 font-bold">
              <CheckCircle2 className="w-6 h-6" />
              <span>Hasil yang real dari ribuan siswa yang udah buktiin</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Pain Point Card Component
const PainPointCard: React.FC<{
  point: PainPoint;
  index: number;
}> = ({ point, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 border border-gray-200 transition-all duration-300 cursor-pointer"
    >
      {/* Gradient background on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${point.colorFrom}, ${point.colorTo})`,
        }}
      />

      {/* Icon with gradient background */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300"
        style={{
          background: `linear-gradient(135deg, ${point.colorFrom}, ${point.colorTo})`,
        }}
      >
        {point.icon}
      </div>

      {/* Title */}
      <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-700">
        {point.title}
      </h4>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {point.description}
      </p>

      {/* Category badge */}
      <div className="mt-4 flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{
            backgroundColor: point.colorFrom,
          }}
        />
        <span className="text-xs font-semibold text-gray-500 capitalize">
          {point.category}
        </span>
      </div>
    </motion.div>
  );
};

export default ProblemSection;
export { ProblemSection };
