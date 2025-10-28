'use client';

import { SupportDialog } from '@/components/_shared/contact/support-dialog';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Brain,
  Building2,
  CheckCircle,
  Lightbulb,
  Rocket,
  School,
  Shield,
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
      title: 'AI-Powered Learning',
      description:
        'Teknologi AI terdepan untuk personalisasi pengalaman belajar setiap siswa',
    },
    {
      icon: Target,
      title: 'Fokus SNBT',
      description:
        'Khusus persiapan Seleksi Nasional Berdasarkan Tes dengan materi terlengkap',
    },
    {
      icon: Award,
      title: 'Instruktur Expert',
      description:
        'Guru-guru berpengalaman dengan track record terbukti dalam mengajar',
    },
    {
      icon: TrendingUp,
      title: 'Hasil Terukur',
      description:
        'Ribuan siswa telah berhasil masuk ke universitas impian mereka',
    },
  ];

  const exams = [
    {
      name: 'SNBT',
      description: 'Seleksi Nasional Berdasarkan Tes untuk masuk PTN',
      icon: Target,
    },
    {
      name: 'SIMAK UI',
      description: 'Ujian mandiri Universitas Indonesia dengan soal spesifik',
      icon: School,
    },
    {
      name: 'UM-UGM',
      description: 'Ujian mandiri Universitas Gadjah Mada pilihan terbaik',
      icon: BookOpen,
    },
    {
      name: 'Kedinasan',
      description: 'Persiapan lengkap untuk ujian masuk instansi pemerintah',
      icon: Building2,
    },
  ];

  const values = [
    {
      title: 'Inovasi',
      description:
        'Menggunakan teknologi terkini untuk meningkatkan kualitas pendidikan',
      icon: Lightbulb,
    },
    {
      title: 'Komitmen',
      description: 'Berdedikasi penuh untuk kesuksesan setiap siswa',
      icon: Shield,
    },
    {
      title: 'Kualitas',
      description: 'Standar tinggi dalam setiap aspek layanan kami',
      icon: CheckCircle,
    },
    {
      title: 'Akselerasi',
      description: 'Mempercepat pencapaian tujuan pendidikan Anda',
      icon: Rocket,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-main-default/5 via-white to-white" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 -z-10 bg-main-default" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-block mb-6 px-6 py-2 bg-main-default/10 rounded-full border border-main-default/20">
              <p className="text-sm font-semibold text-main-default">
                Tentang Kami
              </p>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-main-default to-main-default">
              Bimbelio
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Platform edukasi dan AI yang merevolusi cara siswa mempersiapkan
              diri untuk ujian masuk universitas dan instansi pemerintah.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {session?.user ? (
                <Link
                  href={`/${website_sub_category_id ? website_sub_category_id : 'choose'}/user/course`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-8 py-3 bg-main-default text-white rounded-full font-semibold cursor-pointer hover:shadow-lg transition-all"
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
                  className="px-8 py-3 bg-main-default text-white rounded-full font-semibold cursor-pointer hover:shadow-lg transition-all"
                >
                  Mulai Belajar
                </motion.div>
              )}
              <SupportDialog>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-3 border-2 border-main-default text-main-default rounded-full font-semibold cursor-pointer hover:bg-main-default/5 transition-all"
                >
                  Hubungi Kami
                </motion.div>
              </SupportDialog>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-transparent to-main-default/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-black mb-4 text-gray-900">
                  Misi Kami
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Memberikan akses pendidikan berkualitas tinggi kepada setiap
                  siswa dengan memanfaatkan teknologi AI terdepan untuk
                  memaksimalkan potensi belajar dan mencapai target ujian masuk.
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black mb-4 text-gray-900">
                  Visi Kami
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Menjadi platform edukasi terdepan di Indonesia yang mengubah
                  cara siswa belajar dan membantu jutaan siswa meraih impian
                  pendidikan mereka di universitas terbaik dan instansi
                  pemerintah.
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
              <div className="absolute inset-0 rounded-2xl blur-2xl opacity-20 -z-10 bg-main-default" />
              <div className="bg-gradient-to-br from-main-default/10 to-main-default/5 p-8 rounded-2xl border border-main-default/20">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 bg-main-default">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Inovasi Berkelanjutan
                      </h3>
                      <p className="text-sm text-gray-600">
                        Terus mengembangkan fitur dan teknologi terbaru
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 bg-main-default">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Komunitas Pembelajar
                      </h3>
                      <p className="text-sm text-gray-600">
                        Membangun ekosistem belajar yang supportif
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 bg-main-default">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Hasil Nyata
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ribuan siswa sukses masuk universitas impian
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
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Keunggulan Bimbelio
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami menghadirkan solusi pembelajaran terpadu yang menggabungkan
              keahlian instruktur dengan teknologi AI canggih
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
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-main-default/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white bg-main-default">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Exam Specialization Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-main-default/5 to-transparent">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Spesialisasi Ujian
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami fokus pada persiapan ujian masuk universitas dan instansi
              pemerintah terkemuka
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {exams.map((exam, index) => {
              const Icon = exam.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="p-8 rounded-2xl text-center bg-white border-2 border-main-default/20 hover:border-main-default/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white bg-main-default">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {exam.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {exam.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prinsip-prinsip yang memandu setiap keputusan dan tindakan kami
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  className="flex gap-6 p-6 rounded-2xl bg-gradient-to-r from-main-default/5 to-transparent border border-main-default/10 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-white bg-main-default">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-main-default/10 to-main-default/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Siap Meraih Impianmu?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Bergabunglah dengan ribuan siswa yang telah berhasil meraih target
              mereka bersama Bimbelio. Mulai perjalanan belajarmu hari ini!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {!session?.user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-main-default text-white rounded-full font-bold text-lg cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setShowAuth({ open: true, redirect: null })}
                >
                  Daftar Sekarang
                </motion.div>
              )}
              <SupportDialog>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 border-2 border-main-default text-main-default rounded-full font-bold text-lg cursor-pointer hover:bg-main-default/5 transition-all"
                >
                  Konsultasi Gratis
                </motion.div>
              </SupportDialog>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
