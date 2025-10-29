'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, FileText, Map, Users } from 'lucide-react';
import { useMemo } from 'react';

interface PainPoint {
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
  exam: string;
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
  const isMainLandingPage = window.location.pathname === '/';
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
      exam: 'Seleksi Nasional Berbasih Tes',
      examShortName: 'SNBT',
      applicants: '785.058',
      accepted: '231.104',
      ratio: '29%',
      imageUrl: '/tutors/LOGO_SNBT.webp',
      brandColor: brandColors.blue,
    },
    {
      exam: 'SIMAK Universitas Indonesia',
      examShortName: 'SIMAK UI',
      applicants: '31.289',
      accepted: '4.200',
      ratio: '13%',
      imageUrl: '/tutors/LOGO_PTN_UI.webp',
      brandColor: brandColors.yellow,
    },
    {
      exam: 'Ujian Mandiri Universitas Gadjah Mada',
      examShortName: 'UM UGM',
      applicants: '34.627',
      accepted: '3.670',
      ratio: '11%',
      imageUrl: '/tutors/LOGO_PTN_UGM.webp',
      brandColor: brandColors.steelBlue,
    },
    {
      exam: 'Politeknik Keuangan Negara STAN',
      examShortName: 'PKN STAN',
      applicants: '100.000',
      accepted: '500',
      ratio: '0,5%',
      imageUrl: '/tutors/LOGO_KEDINASAN_STAN.webp',
      brandColor: brandColors.navy,
    },
  ];

  // 3 Problem Cards dengan masing-masing pain points
  const problemCards: ProblemCard[] = useMemo(
    () => [
      {
        icon: Map,
        title: 'Navigate',
        subtitle: 'Peta belajar yang jelas',
        description:
          'Galau jurusan? Takut kelamaan di satu bab? Navigator guide lo dari Core → Intensif → Super Intensif. Ada peta, nggak nyasar.',
        color: '#F59E0B', // Orange
        iconBg: '#FEF3C7',
        painPoints: [
          {
            title: 'Bingung Dari Mana Mulai',
            description:
              'Materi banyak banget, bab-nya juga nggak terhitung. Mana yang harus dikerjain duluan? Mulai dari mana? Prioritas apa? Waktu lo terbatas, tapi materi unlimited.',
          },
          {
            title: 'Galau Pilih Jurusan yang Pas',
            description:
              'Tahu sih harus milih jurusan, tapi gue nggak confident mana yang cocok buat lo. Takut sesal, takut salah pilih, takut nggak lolos juga.',
          },
          {
            title: 'Takut Membuang-buang Waktu',
            description:
              'Takut fokus ke hal yang akhirnya gue nggak penting pas tes. Takut effort sekarang nggak ada hasil di hari H. Panik terus-terusan nih.',
          },
        ],
      },
      {
        icon: FileText,
        title: 'Test',
        subtitle: 'Latihan soal yang cerdas',
        description:
          'Video ngeboseninใ TO pakai IRT system — ngasih soal yang pas sama level lo. Progress terlihat real-time, bukan cuma berasa aja.',
        color: '#EC4899', // Pink
        iconBg: '#FCE7F3',
        painPoints: [
          {
            title: 'Nilai Stuck di Zone Nyaman',
            description:
              'Nilai kok 400-500an gitu aja. Udah coba semua metode, tapi nilai lo tetap mandeg. Parah banget sih kalau SNBT momentum tapi nilai gue nggak naik-naik.',
          },
          {
            title: 'Progres Itu Invisible & Mengecewakan',
            description:
              'Belajar terus-terusan tapi gue nggak bisa lihat kemajuan yang nyata. Belum tahu soal mana yang udah dikuasai lo, mana yang masih lemah. Jadi kayak buta arah.',
          },
          {
            title: 'Materi Itu Overwhelming Banget',
            description:
              'Nonton video berjam-jam, tapi tetap aja merasa belum paham. Teori membludak, praktik minim. Jenuh banget apalagi info yang nggak nyangkut di otak lo.',
          },
        ],
      },
      {
        icon: Users,
        title: 'Support',
        subtitle: 'Nggak pernah sendirian',
        description:
          'Butuh dukungan intensif? AI Mentor 24/7 sudah termasuk. Plus, tutor alumni PTN top siap membimbing — sistem support lengkap terintegrasi.',
        color: '#6366F1', // Indigo
        iconBg: '#E0E7FF',
        painPoints: [
          {
            title: 'Stamina & Mental Turun Drastis',
            description:
              'Awalnya semangat lo membara, cita-cita tinggi banget. Tapi lama-lama? Males banget. Burnout di tengah jalan, stres berlebihan, mimpi buruk soal tes.',
          },
          {
            title: 'Biaya Bimbel Bikin Kantong Jebol',
            description:
              'Les bimbel bisa 10+ juta per paket. Terus kursus online, buku soal, expert session... Eh kok hasilnya gue nggak sebanding? Sakit hati kalau nggak lolos.',
          },
        ],
      },
    ],
    [],
  );

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
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              Realita Yang Harus Lo Hadapi
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
              Gue Tau Banget —
            </h2>
            <h2
              className="text-4xl md:text-5xl font-black bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Struggle Lo Kayak Gini
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
              yang beneran lolos ke PTN impian. Sisanya? Ngalamin struggle yang
              sama kayak lo sekarang.
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
              className="p-4 rounded-2xl text-white shadow-lg"
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
                      className="flex-shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-solid"
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
                        className="px-4 py-2 rounded-2xl shadow-md"
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
                      className="p-4 rounded-2xl border-2 bg-gradient-to-br from-gray-50 to-white transition-all duration-300 group-hover:shadow-md"
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
                      className="p-4 rounded-2xl border-2 bg-gradient-to-br from-gray-50 to-white transition-all duration-300 group-hover:shadow-md"
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
                    className="mt-4 p-3 rounded-2xl border-l-4 text-xs md:text-sm"
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
            className="mt-8 p-6 rounded-2xl border-l-4"
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
            Setiap siswa punya masalah berbeda. Cek 3 kategori utama di bawah -
            kemungkinan besar lo ngalamin minimal 1 masalah di setiap kategori.
          </p>
        </motion.div>

        {/* 3 Main Problem Cards: Navigate, Test, Support */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {problemCards.map((card, cardIndex) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: cardIndex * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div
                className="h-2 w-full"
                style={{ backgroundColor: card.color }}
              />

              {/* Card Content */}
              <div className="p-6 md:p-8">
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: card.iconBg }}
                  >
                    <card.icon
                      className="h-8 w-8"
                      style={{ color: card.color }}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="text-3xl font-black"
                        style={{ color: card.color }}
                      >
                        {card.title.charAt(0)}
                      </div>
                      <h4 className="text-3xl font-black text-gray-900">
                        {card.title.slice(1)}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Subtitle */}
                <p
                  className="text-lg font-bold mb-3"
                  style={{ color: card.color }}
                >
                  {card.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {card.description}
                </p>

                {/* Divider */}
                <div
                  className="h-1 w-16 rounded-full mb-6"
                  style={{ backgroundColor: card.color }}
                />

                {/* Pain Points List */}
                <div className="space-y-4">
                  {card.painPoints.map((painPoint, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: cardIndex * 0.1 + idx * 0.05,
                      }}
                      viewport={{ once: true }}
                      className="group/item relative"
                    >
                      {/* Pain Point Title */}
                      <div className="flex items-start gap-3 mb-2">
                        <div
                          className="mt-1 h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: card.color }}
                        />
                        <h5 className="font-bold text-gray-900 text-sm">
                          {painPoint.title}
                        </h5>
                      </div>

                      {/* Pain Point Description */}
                      <p className="text-xs text-gray-600 leading-relaxed pl-5">
                        {painPoint.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${card.color}15, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div
            className="mx-auto max-w-3xl rounded-3xl border-2 p-8 shadow-md"
            style={{
              backgroundColor: `${mainColor}05`,
              borderColor: `${mainColor}30`,
            }}
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              <span className="font-bold text-gray-900">
                Ngalamin salah satu dari masalah di atas?
              </span>{' '}
              Kabar baiknya: kamu bukan sendirian, dan ada solusi sistematis
              yang udah proven bantu ribuan siswa keluar dari masalah yang sama.
              💪
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
