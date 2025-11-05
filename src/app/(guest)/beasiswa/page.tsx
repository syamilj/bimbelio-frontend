'use client';

import { SupportDialog } from '@/components/_shared/contact/support-dialog';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Calendar,
  DollarSign,
  GraduationCap,
  MapPin,
  Users,
} from 'lucide-react';

type ScholarshipType = {
  id: string;
  title: string;
  provider: string;
  amount: string;
  coverage: string;
  deadline: string;
  requirements: string[];
  location: string;
  description: string;
};

export default function BeasiswaPage() {
  // Dummy data - empty array to show empty state
  const scholarships: ScholarshipType[] = [];

  // Alternative: uncomment to show with dummy data
  //   const scholarships: ScholarshipType[] = [
  //     {
  //       id: '1',
  //       title: 'Beasiswa Penuh S1 - SNBT Excellence',
  //       provider: 'Bimbelio Foundation',
  //       amount: 'Rp 50.000.000',
  //       coverage: 'Penuh (SPP + Buku + Akomodasi)',
  //       deadline: '31 Desember 2025',
  //       requirements: ['SNBT Score > 600', 'IPK SMA > 3.5', 'Rekomendasi Guru'],
  //       location: 'Seluruh Indonesia',
  //       description:
  //         'Beasiswa penuh untuk siswa berprestasi yang lolos SNBT dengan skor tinggi. Mencakup seluruh biaya pendidikan dan akomodasi.',
  //     },
  //     {
  //       id: '2',
  //       title: 'Beasiswa Parsial SIMAK UI',
  //       provider: 'Universitas Indonesia',
  //       amount: 'Rp 25.000.000',
  //       coverage: 'Parsial (50% SPP)',
  //       deadline: '15 Januari 2026',
  //       requirements: ['SIMAK UI Lolos', 'IPK > 3.0', 'Essay Motivasi'],
  //       location: 'Jakarta, Depok',
  //       description:
  //         'Beasiswa parsial untuk calon mahasiswa UI yang lolos SIMAK UI. Membantu meringankan biaya pendidikan hingga 50%.',
  //     },
  //     {
  //       id: '3',
  //       title: 'Beasiswa UM-UGM Berprestasi',
  //       provider: 'Universitas Gadjah Mada',
  //       amount: 'Rp 30.000.000',
  //       coverage: 'Parsial (Tuition + Books)',
  //       deadline: '20 Januari 2026',
  //       requirements: ['UM-UGM Lolos', 'IPK > 3.2', 'Interview'],
  //       location: 'Yogyakarta',
  //       description:
  //         'Beasiswa untuk mahasiswa berprestasi UM-UGM. Mencakup biaya kuliah dan buku pelajaran.',
  //     },
  //   ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-10 md:py-12 overflow-hidden">
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
              <p className="text-sm font-semibold text-main-default flex items-center gap-2">
                <Award className="w-4 h-4" />
                Program Beasiswa
              </p>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-gray-900">
              Program <span className="text-main-default">Beasiswa</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Kami bermitra dengan berbagai institusi pendidikan dan organisasi
              untuk menyediakan beasiswa bagi siswa berprestasi yang ingin
              melanjutkan pendidikan mereka.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Scholarships Content Section */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {scholarships.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className=""
            >
              <div className="text-center">
                {/* Illustration */}
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-20 -z-10 bg-main-default w-48 h-48 mx-auto" />
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-main-default/10 to-main-default/5 flex items-center justify-center border border-main-default/20">
                      <GraduationCap className="w-16 h-16 text-main-default" />
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Belum Ada Program Beasiswa
                </h2>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Program beasiswa kami masih dalam proses penambahan data.
                  Silakan kembali lagi dalam waktu dekat untuk melihat berbagai
                  pilihan beasiswa yang tersedia.
                </p>

                <div className="bg-main-default/5 border border-main-default/20 rounded-2xl p-8 max-w-xl mx-auto">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-main-default flex items-center justify-center flex-shrink-0 text-white">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 mb-1">
                        Pantau Halaman Ini
                      </h3>
                      <p className="text-sm text-gray-600">
                        Kami akan menambahkan berbagai program beasiswa dari
                        mitra kami secara berkala.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-main-default flex items-center justify-center flex-shrink-0 text-white">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 mb-1">
                        Hubungi Tim Kami
                      </h3>
                      <p className="text-sm text-gray-600">
                        Jika Kamu memiliki pertanyaan tentang beasiswa, hubungi
                        tim support kami.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-main-default flex items-center justify-center flex-shrink-0 text-white">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 mb-1">
                        Update Terbaru
                      </h3>
                      <p className="text-sm text-gray-600">
                        Subscribe untuk mendapat notifikasi program beasiswa
                        terbaru.
                      </p>
                    </div>
                  </div>
                </div>

                <SupportDialog>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="mt-12 px-8 py-3 bg-main-default text-white rounded-full font-semibold hover:shadow-lg transition-all cursor-pointer"
                  >
                    Hubungi Kami
                  </motion.button>
                </SupportDialog>
              </div>
            </motion.div>
          ) : (
            // Scholarships List
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {scholarships.map((scholarship) => (
                <motion.div
                  key={scholarship.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-main-default/20 hover:border-main-default/50 transition-all duration-300 hover:shadow-xl"
                >
                  {/* Header */}
                  <div className="flex gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-main-default/20 to-main-default/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-7 h-7 text-main-default" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {scholarship.title}
                      </h3>
                      <p className="text-sm text-main-default font-semibold">
                        {scholarship.provider}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {scholarship.description}
                  </p>

                  {/* Key Info Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Amount */}
                    <div className="p-4 rounded-xl bg-main-default/5 border border-main-default/10">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-main-default" />
                        <span className="text-xs font-semibold text-gray-600">
                          Besaran Beasiswa
                        </span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {scholarship.amount}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {scholarship.coverage}
                      </p>
                    </div>

                    {/* Deadline */}
                    <div className="p-4 rounded-xl bg-main-default/5 border border-main-default/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-main-default" />
                        <span className="text-xs font-semibold text-gray-600">
                          Deadline Pendaftaran
                        </span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {scholarship.deadline}
                      </p>
                    </div>

                    {/* Location */}
                    <div className="p-4 rounded-xl bg-main-default/5 border border-main-default/10">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-main-default" />
                        <span className="text-xs font-semibold text-gray-600">
                          Lokasi
                        </span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {scholarship.location}
                      </p>
                    </div>

                    {/* Requirements */}
                    <div className="p-4 rounded-xl bg-main-default/5 border border-main-default/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-main-default" />
                        <span className="text-xs font-semibold text-gray-600">
                          Persyaratan
                        </span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {scholarship.requirements.length} Poin
                      </p>
                    </div>
                  </div>

                  {/* Requirements List */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                      Persyaratan Utama:
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {scholarship.requirements.map((req, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <div className="w-2 h-2 rounded-full bg-main-default flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full md:w-auto px-8 py-3 bg-main-default text-white rounded-full font-semibold hover:shadow-lg transition-all"
                  >
                    Daftar Sekarang
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Section */}
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
              Cara Mendapatkan Beasiswa
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Langkah-langkah sederhana untuk mendaftar program beasiswa kami
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: 1,
                title: 'Cari Program Beasiswa',
                description:
                  'Lihat daftar program beasiswa yang tersedia dan pilih yang sesuai dengan kriteria Kamu.',
              },
              {
                step: 2,
                title: 'Lengkapi Data Diri',
                description:
                  'Isi formulir pendaftaran dengan data lengkap dan dokumen yang diperlukan.',
              },
              {
                step: 3,
                title: 'Menunggu Hasil',
                description:
                  'Tim penyeleksi akan meninjau aplikasi Kamu dan memberitahu hasil dalam waktu yang ditentukan.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-main-default text-white flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div className="pt-8 p-6 rounded-2xl bg-white border border-main-default/20 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
