'use client';

import { SupportDialog } from '@/components/_shared/contact/support-dialog';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Brain,
  Building2,
  CheckCircle,
  Heart,
  Lightbulb,
  Rocket,
  School,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    useAuth: { setShowAuth },
  } = useAppContext();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color ?? '#5aa4dd';

  // Extended color palette for variety
  const colorPalette = {
    blue: '#0140ed',
    blueSecondary: '#225baa',
    blueDark: '#103466',
    black: '#000000',
    yellow: '#ffc208',
    white: '#ffffff',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const features = [
    {
      icon: Brain,
      title: 'AI yang Ngerti Kamu',
      description:
        'Bukan AI biasa — ini AI yang belajar dari progress kamu dan kasih rekomendasi materi yang pas banget',
    },
    {
      icon: Target,
      title: 'Fokus ke Target Kamu',
      description:
        'Mau SNBT, SIMAK UI, UM-UGM, atau Kedinasan? Semua materi udah aku sesuaikan sama pola soal terbaru',
    },
    {
      icon: Award,
      title: 'Mentor Berpengalaman',
      description:
        'Bukan sembarang tutor — mereka udah ngebimbing ratusan siswa lolos PTN dan kedinasan favorit',
    },
    {
      icon: TrendingUp,
      title: 'Hasil yang Keliatan',
      description:
        'Ribuan alumni aku udah lolos. Kamu bisa cek sendiri testimoni dan data passing rate yang transparan',
    },
  ];

  const exams = [
    {
      name: 'SNBT',
      fullName: 'Seleksi Nasional Berdasarkan Tes',
      description:
        'Jalur utama masuk PTN — aku kasih kamu ribuan soal latihan yang mirip banget sama aslinya',
      icon: Target,
      imageUrl: '/hero/LOGO_SNBT.webp',
      stat1Label: 'Bank Soal',
      stat1Value: '5,000+',
      stat1Desc: 'Soal latihan tersedia',
      stat2Label: 'Video Materi',
      stat2Value: '200+',
      stat2Desc: 'Pembahasan lengkap',
      passingRate: 'NEW',
    },
    {
      name: 'SIMAK UI',
      fullName: 'SIMAK Universitas Indonesia',
      description:
        'Mau masuk UI lewat jalur mandiri? Soal-soal spesifik UI udah aku siapin lengkap',
      icon: School,
      imageUrl: '/hero/LOGO_PTN_UI.webp',
      stat1Label: 'Bank Soal',
      stat1Value: '3,500+',
      stat1Desc: 'Soal spesifik UI',
      stat2Label: 'Try Out',
      stat2Value: '50+',
      stat2Desc: 'Paket latihan',
      passingRate: 'NEW',
    },
    {
      name: 'UM-UGM',
      fullName: 'Ujian Mandiri Universitas Gadjah Mada',
      description:
        'Target UGM? Aku punya bank soal UM-UGM dari tahun-tahun sebelumnya buat kamu pelajari',
      icon: BookOpen,
      imageUrl: '/hero/LOGO_PTN_UGM.webp',
      stat1Label: 'Bank Soal',
      stat1Value: '2,800+',
      stat1Desc: 'Soal tahun lalu',
      stat2Label: 'Pembahasan',
      stat2Value: '100%',
      stat2Desc: 'Video & teks',
      passingRate: 'NEW',
    },
    {
      name: 'Kedinasan',
      fullName: 'IPDN, STAN, STIS & Lainnya',
      description:
        'IPDN, STAN, STIS? Semua pola soal kedinasan udah aku cover di sini',
      icon: Building2,
      imageUrl: '/hero/LOGO_KEDINASAN_STAN.webp',
      stat1Label: 'Bank Soal',
      stat1Value: '4,200+',
      stat1Desc: 'Multi instansi',
      stat2Label: 'Materi',
      stat2Value: '150+',
      stat2Desc: 'Topik lengkap',
      passingRate: 'NEW',
    },
  ];

  const values = [
    {
      title: 'Terus Berinovasi',
      description:
        'Aku selalu cari cara terbaru biar kamu belajar lebih efektif — makanya aku pakai AI dan teknologi canggih',
      icon: Lightbulb,
    },
    {
      title: 'All-In Buat Kamu',
      description:
        'Aku komit bantu kamu sampe beneran lolos. Sukses kamu adalah bukti kesuksesan aku juga',
      icon: Shield,
    },
    {
      title: 'Kualitas Nomor 1',
      description:
        'Aku gak mau asal-asalan — dari materi, soal, sampai mentor, semua aku pastikan berkualitas tinggi',
      icon: CheckCircle,
    },
    {
      title: 'Percepat Progres Kamu',
      description:
        'Aku bikin sistem yang ngebuat kamu belajar lebih cepet dan efisien daripada belajar sendiri',
      icon: Rocket,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-main-default/5 via-white to-white" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-main-default" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10 bg-secondary-default" />
        </div>

        {/* Top Accent Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
          }}
        />

        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge with Icon */}
            <Badge
              className="mb-6 px-6 py-2.5 text-sm font-bold rounded-full border-2 shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${mainColor}15, ${secondaryColor}15)`,
                borderColor: `${mainColor}40`,
                color: mainColor,
              }}
            >
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Kenalan Lebih Dalam Yuk
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                Siapa Sih Aku?
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Aku Bimbelio — platform bimbel + AI yang bikin persiapan SNBT,
              SIMAK UI, UM-UGM, sama Kedinasan jadi gak ribet dan super
              terstruktur. Kenalan yuk!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {session?.user ? (
                <Link
                  href={`/${website_sub_category_id ? website_sub_category_id : 'choose'}/user/course`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 text-white rounded-full font-bold text-lg cursor-pointer shadow-lg hover:shadow-xl transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    Mulai Belajar
                  </motion.div>
                </Link>
              ) : (
                <motion.div
                  onClick={() => {
                    setShowAuth({
                      redirect: `/${website_sub_category_id ? website_sub_category_id : 'choose'}/user/course`,
                      open: true,
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 text-white rounded-full font-bold text-lg cursor-pointer shadow-lg hover:shadow-xl transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  Mulai Belajar
                </motion.div>
              )}
              <SupportDialog>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full font-bold text-lg cursor-pointer border-2 transition-all"
                  style={{
                    borderColor: mainColor,
                    color: mainColor,
                    background: 'white',
                  }}
                >
                  Hubungi Kami
                </motion.div>
              </SupportDialog>
            </div>

            {/* Trust Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <Users
                  className="w-4 h-4"
                  style={{ color: colorPalette.blue }}
                />
                <span className="font-semibold">10,000+ Siswa Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <Target
                  className="w-4 h-4"
                  style={{ color: colorPalette.yellow }}
                />
                <span className="font-semibold">85% Passing Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart
                  className="w-4 h-4"
                  style={{ color: colorPalette.blueSecondary }}
                />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 md:py-32 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white -z-10" />

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <Badge
                  className="px-4 py-1.5 text-xs font-bold rounded-full border-2"
                  style={{
                    background: `${mainColor}10`,
                    borderColor: `${mainColor}30`,
                    color: mainColor,
                  }}
                >
                  <Target className="w-3.5 h-3.5 mr-1.5 inline" />
                  MISSION
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  Kenapa Aku Ada?
                </h2>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  Aku tau banget gimana rasanya belajar sendiri tanpa arah
                  jelas. Makanya aku ada — buat kasih kamu sistem belajar yang
                  terstruktur, didukung AI canggih dan mentor berpengalaman.
                  Target kamu lolos ujian? Aku bantu maksimalin peluang kamu.
                </p>
              </div>

              <div className="space-y-4">
                <Badge
                  className="px-4 py-1.5 text-xs font-bold rounded-full border-2"
                  style={{
                    background: `${secondaryColor}10`,
                    borderColor: `${secondaryColor}30`,
                    color: secondaryColor,
                  }}
                >
                  <Rocket className="w-3.5 h-3.5 mr-1.5 inline" />
                  VISION
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  Mau Jadi Apa Aku?
                </h2>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  Aku pengen jadi platform bimbel #1 di Indonesia yang ngebantu
                  ribuan — bahkan jutaan siswa lolos ke universitas impian
                  mereka. Bukan cuma soal lulus, tapi soal ngasih pengalaman
                  belajar yang bener-bener ngerti struggle kamu.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className="absolute inset-0 rounded-3xl blur-2xl opacity-20 -z-10"
                style={{ background: mainColor }}
              />
              <div
                className="p-8 md:p-10 rounded-3xl border-2 shadow-xl bg-white"
                style={{ borderColor: `${mainColor}20` }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                  style={{
                    background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                  }}
                />

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg"
                      style={{ background: colorPalette.blue }}
                    >
                      <Zap className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Update Terus Menerus
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Aku selalu tambahin fitur baru biar kamu makin dimudahin
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg"
                      style={{ background: colorPalette.yellow }}
                    >
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Komunitas yang Solid
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Kamu belajar bareng ribuan siswa lain yang seperjuangan
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${colorPalette.blueSecondary}, ${colorPalette.blueDark})`,
                      }}
                    >
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Bukti Nyata
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Ribuan alumni aku udah lolos ke PTN dan kedinasan impian
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 md:py-32 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-main-default" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-5 bg-secondary-default" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              className="mb-4 px-5 py-2 text-xs font-bold rounded-full border-2"
              style={{
                background: `${mainColor}10`,
                borderColor: `${mainColor}30`,
                color: mainColor,
              }}
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
              KEUNGGULAN KAMI
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Kenapa Harus Pilih Aku?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Aku gabungin yang terbaik dari dua dunia: mentor expert yang
              ngerti struggle kamu + AI canggih yang personalize belajar kamu
              24/7
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              // Different color for each feature card
              const cardColors = [
                {
                  main: colorPalette.blue,
                  gradient: `linear-gradient(135deg, ${colorPalette.blue}, ${colorPalette.blueSecondary})`,
                  iconBg: `${colorPalette.blue}15`,
                  border: `${colorPalette.blue}25`,
                  dot: colorPalette.blue,
                },
                {
                  main: colorPalette.yellow,
                  gradient: `linear-gradient(135deg, ${colorPalette.yellow}, #ffaa00)`,
                  iconBg: `${colorPalette.yellow}20`,
                  border: `${colorPalette.yellow}30`,
                  dot: colorPalette.yellow,
                },
                {
                  main: colorPalette.blueSecondary,
                  gradient: `linear-gradient(135deg, ${colorPalette.blueSecondary}, ${colorPalette.blueDark})`,
                  iconBg: `${colorPalette.blueSecondary}15`,
                  border: `${colorPalette.blueSecondary}25`,
                  dot: colorPalette.blueSecondary,
                },
                {
                  main: colorPalette.blueDark,
                  gradient: `linear-gradient(135deg, ${colorPalette.blue}, ${colorPalette.blueDark})`,
                  iconBg: `${colorPalette.blueDark}20`,
                  border: `${colorPalette.blueDark}30`,
                  dot: colorPalette.blueDark,
                },
              ];
              const colors = cardColors[index % 4];
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50/50 border-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ borderColor: colors.border }}
                >
                  {/* Top corner accent */}
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 -z-10"
                    style={{ background: colors.gradient }}
                  />

                  {/* Icon with background circle */}
                  <div className="relative mb-5">
                    <div
                      className="absolute inset-0 rounded-2xl blur-xl opacity-30"
                      style={{ background: colors.main }}
                    />
                    <div
                      className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                      style={{ background: colors.gradient }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title with dot indicator */}
                  <div className="flex items-start gap-2 mb-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: colors.dot }}
                    />
                    <h3 className="text-xl font-black text-gray-900 leading-tight">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom gradient bar on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
                    style={{
                      background: colors.gradient,
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Exam Specialization Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(180deg, ${mainColor}08 0%, transparent 100%)`,
          }}
        />

        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              className="mb-4 px-5 py-2 text-xs font-bold rounded-full border-2"
              style={{
                background: `${secondaryColor}10`,
                borderColor: `${secondaryColor}30`,
                color: secondaryColor,
              }}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5 inline" />
              SPESIALISASI
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Ujian Apa Aja yang Aku Cover?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Aku fokus ke 4 ujian besar yang paling banyak kamu butuhin — semua
              udah ada materinya lengkap dan update terus
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {exams.map((exam, index) => {
              const Icon = exam.icon;
              // Different color combinations for each exam
              const examColors = [
                {
                  main: colorPalette.blue,
                  gradient: `linear-gradient(135deg, ${colorPalette.blue}, ${colorPalette.blueSecondary})`,
                  border: `${colorPalette.blue}20`,
                  badgeBg: colorPalette.blue,
                  dot: colorPalette.blue,
                },
                {
                  main: colorPalette.yellow,
                  gradient: `linear-gradient(135deg, ${colorPalette.yellow}, #ffaa00)`,
                  border: `${colorPalette.yellow}25`,
                  badgeBg: colorPalette.yellow,
                  dot: colorPalette.yellow,
                },
                {
                  main: colorPalette.blueSecondary,
                  gradient: `linear-gradient(135deg, ${colorPalette.blueSecondary}, ${colorPalette.blueDark})`,
                  border: `${colorPalette.blueSecondary}20`,
                  badgeBg: colorPalette.blueSecondary,
                  dot: colorPalette.blueSecondary,
                },
                {
                  main: colorPalette.blueDark,
                  gradient: `linear-gradient(135deg, ${colorPalette.blueDark}, ${colorPalette.blue})`,
                  border: `${colorPalette.blueDark}25`,
                  badgeBg: colorPalette.blueDark,
                  dot: colorPalette.blueDark,
                },
              ];
              const colors = examColors[index % 4];
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50/50 border-2 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden"
                  style={{ borderColor: colors.border }}
                >
                  {/* Top gradient accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl"
                    style={{
                      background: colors.gradient,
                    }}
                  />

                  {/* Header: Logo + Title + Badge */}
                  <div className="flex items-center gap-4 mb-6">
                    {/* Logo/Image Box */}
                    <div
                      className="w-20 h-20 flex-shrink-0 rounded-2xl border-2 overflow-hidden bg-white shadow-md"
                      style={{
                        borderColor: exam.imageUrl
                          ? 'transparent'
                          : colors.border,
                        backgroundColor: exam.imageUrl
                          ? 'transparent'
                          : `${colors.main}08`,
                      }}
                    >
                      {exam.imageUrl ? (
                        <img
                          src={exam.imageUrl}
                          alt={exam.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Icon
                            className="w-10 h-10"
                            style={{ color: colors.main }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Exam Name & Description */}
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-1">
                        {exam.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                        {exam.fullName}
                      </p>
                    </div>

                    {/* Passing Rate Badge */}
                    <div className="flex-shrink-0">
                      <div
                        className="px-4 py-2 rounded-2xl shadow-md"
                        style={{
                          backgroundColor: colors.badgeBg,
                        }}
                      >
                        <div className="text-sm font-black text-white tracking-wider">
                          {exam.passingRate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Grid - 2 Column */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Stat 1 */}
                    <div
                      className="p-4 rounded-2xl border-2 bg-gradient-to-br from-gray-50 to-white transition-all duration-300 group-hover:shadow-md"
                      style={{
                        borderColor: `${colors.main}15`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.dot }}
                        />
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                          {exam.stat1Label}
                        </p>
                      </div>
                      <p className="text-2xl md:text-3xl font-black text-gray-900">
                        {exam.stat1Value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {exam.stat1Desc}
                      </p>
                    </div>

                    {/* Stat 2 */}
                    <div
                      className="p-4 rounded-2xl border-2 bg-gradient-to-br from-gray-50 to-white transition-all duration-300 group-hover:shadow-md"
                      style={{
                        borderColor: `${colors.main}15`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.dot }}
                        />
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                          {exam.stat2Label}
                        </p>
                      </div>
                      <p className="text-2xl md:text-3xl font-black text-gray-900">
                        {exam.stat2Value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {exam.stat2Desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom gradient bar on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"
                    style={{
                      background: colors.gradient,
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 md:py-32 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/30 to-white -z-10" />

        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              className="mb-4 px-5 py-2 text-xs font-bold rounded-full border-2"
              style={{
                background: `${mainColor}10`,
                borderColor: `${mainColor}30`,
                color: mainColor,
              }}
            >
              <Shield className="w-3.5 h-3.5 mr-1.5 inline" />
              NILAI-NILAI KAMI
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Prinsip Aku Dalam Ngajarin Kamu
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ini nilai-nilai yang aku pegang teguh setiap kali bikin fitur atau
              konten buat kamu
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              // More vibrant color combinations for values
              const valueColors = [
                {
                  main: colorPalette.blue,
                  gradient: `linear-gradient(135deg, ${colorPalette.blue}, ${colorPalette.blueSecondary})`,
                  border: `${colorPalette.blue}25`,
                  dot: colorPalette.blue,
                },
                {
                  main: colorPalette.yellow,
                  gradient: `linear-gradient(135deg, ${colorPalette.yellow}, #ffaa00)`,
                  border: `${colorPalette.yellow}30`,
                  dot: colorPalette.yellow,
                },
                {
                  main: colorPalette.blueSecondary,
                  gradient: `linear-gradient(135deg, ${colorPalette.blueSecondary}, ${colorPalette.blueDark})`,
                  border: `${colorPalette.blueSecondary}25`,
                  dot: colorPalette.blueSecondary,
                },
                {
                  main: colorPalette.blueDark,
                  gradient: `linear-gradient(135deg, ${colorPalette.blue}, ${colorPalette.blueDark})`,
                  border: `${colorPalette.blueDark}30`,
                  dot: colorPalette.blueDark,
                },
              ];
              const colors = valueColors[index % 4];
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="group flex gap-6 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50/50 border-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ borderColor: colors.border }}
                >
                  {/* Decorative corner gradient */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-5 -z-10"
                    style={{ background: colors.gradient }}
                  />

                  {/* Icon with glow effect */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="absolute inset-0 rounded-2xl blur-xl opacity-30"
                      style={{ background: colors.main }}
                    />
                    <div
                      className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                      style={{ background: colors.gradient }}
                    >
                      <Icon className="w-10 h-10" />
                    </div>
                  </div>

                  <div className="flex-1">
                    {/* Title with dot indicator */}
                    <div className="flex items-start gap-2 mb-3">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: colors.dot }}
                      />
                      <h3 className="text-2xl font-black text-gray-900 leading-tight">
                        {value.title}
                      </h3>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>

                  {/* Left gradient accent bar */}
                  <div
                    className="absolute left-0 top-8 bottom-8 w-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full"
                    style={{ background: colors.gradient }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background with gradient */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(135deg, ${mainColor}12, ${secondaryColor}08)`,
          }}
        />

        {/* Decorative elements */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${secondaryColor}, ${mainColor})`,
          }}
        />

        {/* Floating circles */}
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: mainColor }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: secondaryColor }}
        />

        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge
              className="mb-6 px-6 py-2.5 text-sm font-bold rounded-full border-2 shadow-sm"
              style={{
                background: 'white',
                borderColor: `${mainColor}40`,
                color: mainColor,
              }}
            >
              <Rocket className="w-4 h-4 mr-2 inline" />
              Yuk Gabung Sekarang!
            </Badge>

            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                Udah Kenal Kan — Sekarang Action!
              </span>
            </h2>
            <p className="text-lg md:text-2xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
              Ribuan siswa udah percaya sama aku dan berhasil lolos
              PTN/kedinasan impian mereka. Sekarang giliran kamu — yuk mulai
              perjalanan belajar yang bener-bener terstruktur!
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {!session?.user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 text-white rounded-full font-black text-xl cursor-pointer shadow-2xl hover:shadow-3xl transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                  onClick={() => setShowAuth({ open: true, redirect: null })}
                >
                  Daftar Sekarang 🚀
                </motion.div>
              )}
              <SupportDialog>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-full font-black text-xl cursor-pointer border-3 transition-all bg-white shadow-xl"
                  style={{
                    borderWidth: '3px',
                    borderColor: mainColor,
                    color: mainColor,
                  }}
                >
                  Konsultasi Gratis 💬
                </motion.div>
              </SupportDialog>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                  style={{ background: colorPalette.blue }}
                >
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-black text-gray-900">10,000+</div>
                  <div className="text-xs text-gray-500">Siswa Aktif</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                  style={{ background: colorPalette.yellow }}
                >
                  <Target className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-black text-gray-900">85%</div>
                  <div className="text-xs text-gray-500">Passing Rate</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colorPalette.blueSecondary}, ${colorPalette.blueDark})`,
                  }}
                >
                  <Heart className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-black text-gray-900">4.9/5</div>
                  <div className="text-xs text-gray-500">Rating Siswa</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
