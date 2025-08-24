'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Heart,
  MessageCircle,
  Quote,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface TestimonialData {
  id: string;
  studentName: string;
  studentAge: number;
  studentLocation: string;
  tutorName: string;
  subject: string;
  scoreBefore: number;
  scoreAfter: number;
  improvement: number;
  university: string;
  testimonial: string;
  avatar: string;
  studyDuration: string;
  rating: number;
  highlights: string[];
}

// Testimonials data dengan avatar dan info lengkap
const TESTIMONIALS: TestimonialData[] = [
  {
    id: '1',
    studentName: 'Aldi Rahman',
    studentAge: 18,
    studentLocation: 'Jakarta',
    tutorName: 'Dr. Ahmad Rizky',
    subject: 'Matematika',
    scoreBefore: 420,
    scoreAfter: 650,
    improvement: 230,
    university: 'ITB - Teknik Informatika',
    testimonial:
      'Pak Ahmad cara ngajarnya luar biasa! Matematika yang dulu bikin pusing sekarang jadi menyenangkan. Metodenya step-by-step dan selalu sabar jelasin sampai paham. Alhamdulillah berkat bimbingannya bisa lolos ITB!',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    studyDuration: '6 bulan',
    rating: 5,
    highlights: ['Konsep dasar kuat', 'Soal HOTS', 'Waktu efisien'],
  },
  {
    id: '2',
    studentName: 'Sari Indah',
    studentAge: 17,
    studentLocation: 'Bandung',
    tutorName: 'Dr. Maya Kartika',
    subject: 'Bahasa Indonesia',
    scoreBefore: 380,
    scoreAfter: 580,
    improvement: 200,
    university: 'UI - Ilmu Komunikasi',
    testimonial:
      'Bu Maya ngebimbing aku dari yang benci baca teks panjang jadi suka analisis bahasa. Teknik membaca cepatnya game-changer banget! Sekarang bisa jawab soal bahasa dengan percaya diri.',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    studyDuration: '4 bulan',
    rating: 5,
    highlights: ['Teknik baca cepat', 'Analisis mendalam', 'Boost confidence'],
  },
  {
    id: '3',
    studentName: 'Budi Santoso',
    studentAge: 18,
    studentLocation: 'Surabaya',
    tutorName: 'Dr. Rani Handayani',
    subject: 'Biologi',
    scoreBefore: 350,
    scoreAfter: 620,
    improvement: 270,
    university: 'UGM - Kedokteran',
    testimonial:
      'Bu Rani bikin biologi yang tadinya susah jadi masuk akal. Case study medisnya keren banget, jadi tahu aplikasi nyata ilmu biologi. Berkat beliau aku bisa lolos kedokteran UGM!',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    studyDuration: '5 bulan',
    rating: 5,
    highlights: [
      'Case study menarik',
      'Aplikasi real-world',
      'Expert guidance',
    ],
  },
  {
    id: '4',
    studentName: 'Dina Rahayu',
    studentAge: 17,
    studentLocation: 'Yogyakarta',
    tutorName: 'Prof. Sarah Indira',
    subject: 'Fisika',
    scoreBefore: 390,
    scoreAfter: 610,
    improvement: 220,
    university: 'ITB - Teknik Fisika',
    testimonial:
      'Bu Sarah jelasin fisika dengan analogi yang mudah dimengerti. Lab virtualnya membantu banget memahami konsep yang abstrak. Terima kasih sudah membuat fisika jadi menyenangkan!',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    studyDuration: '4 bulan',
    rating: 5,
    highlights: [
      'Lab virtual interaktif',
      'Konsep mudah dipahami',
      'Support luar biasa',
    ],
  },
  {
    id: '5',
    studentName: 'Rizky Pratama',
    studentAge: 18,
    studentLocation: 'Medan',
    tutorName: 'Dr. Budi Santoso',
    subject: 'TPA & Psikotes',
    scoreBefore: 65,
    scoreAfter: 95,
    improvement: 30,
    university: 'CPNS - Kemenkeu',
    testimonial:
      'Pak Budi punya trik-trik khusus yang bikin ngerjain soal TPA jadi cepat dan akurat. Pattern recognitionnya membantu banget pas tes CPNS. Alhamdulillah sekarang jadi PNS!',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    studyDuration: '3 bulan',
    rating: 5,
    highlights: ['Trik khusus', 'Pattern recognition', 'Success rate tinggi'],
  },
];

const TutorTestimonialsSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  };

  const currentTestimonial = TESTIMONIALS[currentIndex];

  // Calculate average stats
  const avgImprovement =
    TESTIMONIALS.reduce((sum, t) => sum + t.improvement, 0) /
    TESTIMONIALS.length;
  const avgRating =
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length;

  return (
    <section
      id="tutor-testimonials"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-100 to-blue-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-6 px-6 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit mx-auto"
            style={{ backgroundColor: mainColor }}
          >
            <Heart className="w-4 h-4" />
            Student Success Stories
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Cerita{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sukses Siswa
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ribuan siswa telah{' '}
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              merasakan transformasi belajar
            </span>{' '}
            bersama tutor-tutor terbaik kami dan berhasil mencapai target
            universitas impian
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center">
            <div
              className="text-3xl md:text-4xl font-black mb-2"
              style={{ color: mainColor }}
            >
              15,000+
            </div>
            <div className="text-gray-600 font-medium">Siswa Berhasil</div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center">
            <div
              className="text-3xl md:text-4xl font-black mb-2"
              style={{ color: mainColor }}
            >
              +{Math.round(avgImprovement)}
            </div>
            <div className="text-gray-600 font-medium">Rata-rata Naik</div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center">
            <div
              className="text-3xl md:text-4xl font-black mb-2 flex items-center justify-center gap-1"
              style={{ color: mainColor }}
            >
              {avgRating}
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
            </div>
            <div className="text-gray-600 font-medium">Rating Tutor</div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 text-center">
            <div
              className="text-3xl md:text-4xl font-black mb-2"
              style={{ color: mainColor }}
            >
              97%
            </div>
            <div className="text-gray-600 font-medium">Success Rate</div>
          </div>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            key={currentTestimonial.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100"
          >
            {/* Student Info Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
              <div className="flex items-center gap-4">
                {/* Avatar dengan gambar asli */}
                <div className="relative">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.studentName}
                    className="w-16 h-16 rounded-full object-cover border-4 shadow-lg"
                    style={{ borderColor: `${mainColor}30` }}
                    onError={(e) => {
                      // Fallback ke initial jika gambar gagal load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback avatar jika gambar gagal */}
                  <div
                    className="hidden w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{ backgroundColor: mainColor }}
                  >
                    {currentTestimonial.studentName.split(' ')[0][0]}
                    {currentTestimonial.studentName.split(' ')[1]?.[0]}
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: mainColor }}
                  >
                    <GraduationCap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentTestimonial.studentName}
                  </h3>
                  <p className="text-gray-600">
                    {currentTestimonial.studentAge} tahun,{' '}
                    {currentTestimonial.studentLocation}
                  </p>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: mainColor }}
                  >
                    {currentTestimonial.university}
                  </p>
                </div>
              </div>

              {/* Score Improvement */}
              <div className="text-center md:text-right">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp
                    className="w-5 h-5"
                    style={{ color: mainColor }}
                  />
                  <span
                    className="text-2xl md:text-3xl font-black"
                    style={{ color: mainColor }}
                  >
                    +{currentTestimonial.improvement}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {currentTestimonial.scoreBefore} →{' '}
                  {currentTestimonial.scoreAfter} poin
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  dalam {currentTestimonial.studyDuration}
                </div>
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="mb-8">
              <Quote
                className="w-8 h-8 text-gray-300 mb-4"
                style={{ color: `${mainColor}40` }}
              />
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
                "{currentTestimonial.testimonial}"
              </p>
            </div>

            {/* Tutor & Subject Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                <GraduationCap className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Tutor: {currentTestimonial.tutorName}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                <MessageCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Mata Pelajaran: {currentTestimonial.subject}
                </span>
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-8">
              <h4 className="font-bold text-gray-900 mb-3 text-sm">
                Yang Disukai dari Tutor:
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentTestimonial.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-md"
                    style={{ backgroundColor: `${mainColor}cc` }}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Rating:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < currentTestimonial.rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                ({currentTestimonial.rating}/5)
              </span>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevTestimonial}
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-gray-700">Sebelumnya</span>
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-3">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 shadow-lg'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  style={{
                    backgroundColor:
                      index === currentIndex ? mainColor : undefined,
                  }}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <span className="font-medium text-gray-700">Selanjutnya</span>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mini Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {TESTIMONIALS.filter((_, idx) => idx !== currentIndex)
              .slice(0, 3)
              .map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    setCurrentIndex(TESTIMONIALS.indexOf(testimonial))
                  }
                >
                  <div className="flex items-center gap-3 mb-3">
                    {/* Mini avatar dengan gambar */}
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.studentName}
                        className="w-10 h-10 rounded-full object-cover border-2 shadow-sm"
                        style={{ borderColor: `${mainColor}30` }}
                        onError={(e) => {
                          // Fallback ke initial jika gambar gagal load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      {/* Fallback avatar jika gambar gagal */}
                      <div
                        className="hidden w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: `${mainColor}80` }}
                      >
                        {testimonial.studentName.split(' ')[0][0]}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        {testimonial.studentName}
                      </div>
                      <div className="text-xs text-gray-600">
                        +{testimonial.improvement} poin
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    "{testimonial.testimonial}"
                  </p>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorTestimonialsSection;
