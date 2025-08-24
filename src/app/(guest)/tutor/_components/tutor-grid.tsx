'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Calculator,
  FileText,
  Star,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface TutorProfile {
  id: string;
  name: string;
  subject: string;
  specialties: string[];
  methodology: string;
  icon: React.ReactNode;
  thumbnail: string; // Custom thumbnail langsung dari folder public
  education: {
    university: string;
    universityLogo: string;
    major: string;
    gpa: string;
  };
  awards: string[];
  achievements: string[];
  teachingStyle: string;
  bgColor: string;
}

const TutorGridSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#7C3AED';

  // Navigation handler untuk button CTA
  const handleViewAllTutors = () => {
    // Nanti bisa navigate ke halaman lengkap daftar tutor
    router.push('/tutor/all');
  };

  const tutorProfiles: TutorProfile[] = [
    {
      id: 'syamil-matematika',
      name: 'Syamil',
      subject: 'Matematika',
      specialties: ['Penalaran Matematika', 'Penalaran Umum'],
      methodology:
        'Problem-solving sistematis dengan pendekatan visual dan konsep analogi',
      icon: <Calculator className="w-5 h-5" />,
      thumbnail: '/tutors/syamil-matematika.png',
      education: {
        university: 'Universitas Indonesia',
        universityLogo: '/tutors/LOGO_PTN_UI.webp',
        major: 'Manajemen',
        gpa: '3.69',
      },
      awards: [
        'CEO Bimbelio',
        'Young Entrepreneur Award 2023',
        'Excellence in Mathematics Education',
      ],
      achievements: [
        'Membangun platform edukasi terdepan',
        'Spesialisasi problem solving HOTS',
        'Mentor 5000+ siswa sukses',
      ],
      teachingStyle: 'Konseptual & Aplikatif',
      bgColor: '#FFFFFF',
    },
    {
      id: 'erich-matematika',
      name: 'Erich Pratama',
      subject: 'Matematika',
      specialties: ['UTBK Saintek', 'Olimpiade MTK', 'Algoritma', 'Logika'],
      methodology:
        'Pendekatan computational thinking dan programming untuk memahami matematika',
      icon: <Calculator className="w-5 h-5" />,
      thumbnail: '/tutors/erich-matematika.png',
      education: {
        university: 'Universitas Indonesia',
        universityLogo: '/tutors/LOGO_PTN_UI.webp',
        major: 'Sistem Informasi.',
        gpa: '3.52',
      },
      awards: [
        'Perunggu OSN MTK 2023',
        'Finalis OSN MTK 2019-2020',
        'Best Algorithm Designer',
      ],
      achievements: [
        'Spesialis soal olimpiade tingkat nasional',
        'Metode shortcut matematika proven',
        'Expert competitive programming',
      ],
      teachingStyle: 'Algoritmik & Logis',
      bgColor: '#FFFFFF',
    },
    {
      id: 'ashel-literasi',
      name: 'Ashel Pradita',
      subject: 'Bahasa Indonesia',
      specialties: ['UTBK Soshum', 'Literasi', 'Essay Writing', 'Sastra'],
      methodology:
        'Pendekatan kreatif dan analitis dalam literasi dengan teknik writing efektif',
      icon: <FileText className="w-5 h-5" />,
      thumbnail: '/tutors/ashel-literasi.png',
      education: {
        university: 'Universitas Indonesia',
        universityLogo: '/tutors/LOGO_PTN_UI.webp',
        major: 'Sastra',
        gpa: '3.94',
      },
      awards: [
        'Juara 3 Olimpiade Bahasa (NS20)',
        'Editor Buku "Sejarah Turki Modern"',
        'Best Young Writer Award',
      ],
      achievements: [
        'Published author dan editor professional',
        'Spesialisasi analisis teks dan essay writing',
        'Expert dalam sastra klasik dan modern',
      ],
      teachingStyle: 'Kreatif & Analitis',
      bgColor: '#FFFFFF',
    },
    // {
    //   id: 'rina-kimia',
    //   name: 'Dr. Rina Sari',
    //   subject: 'Kimia',
    //   specialties: ['UTBK Saintek', 'Kimia Organik', 'Kimia Analitik'],
    //   methodology:
    //     'Visual chemistry dengan praktikum virtual dan learning by doing',
    //   icon: <Microscope className="w-5 h-5" />,
    //   thumbnail: '/tutors/rina-kimia.png',
    //   education: {
    //     university: 'Institut Teknologi Bandung',
    //     universityLogo: '/tutors/LOGO_PTN_UI.webp',
    //     major: 'S.Si., M.Sc.',
    //     gpa: '3.91',
    //   },
    //   awards: [
    //     'Young Scientist Award',
    //     'Best Research Paper - International Conference',
    //     'Excellence in Chemistry Education',
    //   ],
    //   achievements: [
    //     'Peneliti aktif di bidang green chemistry',
    //     'Spesialisasi reaksi organik kompleks',
    //     'Expert dalam analisis spektroskopi',
    //   ],
    //   teachingStyle: 'Eksperimental & Visual',
    //   bgColor: '#FFFFFF',
    // },
    // {
    //   id: 'davi-fisika',
    //   name: 'Prof. Davi Ramadhan',
    //   subject: 'Fisika',
    //   specialties: ['UTBK Saintek', 'Fisika Kuantum', 'Mekanika'],
    //   methodology:
    //     'Konseptual dengan pendekatan fenomena alam dan teoretis yang mudah dipahami',
    //   icon: <Zap className="w-5 h-5" />,
    //   thumbnail: '/tutors/davi-fisika.png',
    //   education: {
    //     university: 'Universitas Indonesia',
    //     universityLogo: '/tutors/LOGO_PTN_UI.webp',
    //     major: 'S.Si., M.Sc., Ph.D.',
    //     gpa: '3.96',
    //   },
    //   awards: [
    //     'Professor Termuda UI bidang Fisika',
    //     'International Physics Research Award',
    //     'Best Physics Educator',
    //   ],
    //   achievements: [
    //     'Publikasi 50+ paper internasional',
    //     'Spesialisasi mekanika kuantum',
    //     'Expert dalam computational physics',
    //   ],
    //   teachingStyle: 'Konseptual & Fenomenal',
    //   bgColor: '#FFFFFF',
    // },
    // {
    //   id: 'maya-biologi',
    //   name: 'Dr. Maya Putri',
    //   subject: 'Biologi',
    //   specialties: ['UTBK Saintek', 'Kedokteran', 'Biologi Molekuler'],
    //   methodology:
    //     'Case-based learning dengan aplikasi medis menggunakan kasus nyata',
    //   icon: <Users className="w-5 h-5" />,
    //   thumbnail: '/tutors/maya-biologi.png',
    //   education: {
    //     university: 'Universitas Indonesia',
    //     universityLogo: '/tutors/LOGO_PTN_UI.webp',
    //     major: 'S.Si., M.Biomed.',
    //     gpa: '3.89',
    //   },
    //   awards: [
    //     'Young Biomedical Scientist Award',
    //     'Best Medical Educator - FKUI',
    //     'Excellence in Molecular Biology Research',
    //   ],
    //   achievements: [
    //     'Spesialis persiapan masuk kedokteran',
    //     'Expert dalam biologi molekuler',
    //     'Peneliti aktif di bidang biomedis',
    //   ],
    //   teachingStyle: 'Aplikatif & Medis',
    //   bgColor: '#FFFFFF',
    // },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="tutor-grid"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Consistent background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
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
            <Users className="w-4 h-4" />
            Expert Teaching Teams
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Tim Pengajar{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Terspesialisasi
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Setiap mata pelajaran ditangani oleh{' '}
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              tim expert berpengalaman
            </span>{' '}
            yang fokus pada metodologi terbukti efektif untuk UTBK
          </p>
        </motion.div>

        {/* Grid Layout yang Uniform */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {tutorProfiles.map((tutor, index) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              index={index}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
              variants={itemVariants}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Individual Tutor Card Component
const TutorCard: React.FC<{
  tutor: TutorProfile;
  index: number;
  mainColor: string;
  secondaryColor: string;
  variants: any;
}> = ({ tutor, index, mainColor, secondaryColor, variants }) => {
  return (
    <motion.div
      variants={variants}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-md group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl border-0 transition-all duration-500 shadow-lg hover:shadow-2xl"
      style={{
        boxShadow: `0 8px 32px ${mainColor}20`,
      }}
    >
      {/* Subject Badge - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <div
          className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm"
          style={{ backgroundColor: mainColor }}
        >
          {tutor.subject}
        </div>
      </div>

      {/* Hero Thumbnail Section */}
      <div className="relative p-6 bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm">
        {/* Main Thumbnail Container */}
        <div className="relative mt-4 mb-6">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:shadow-xl transition-all duration-500">
            <img
              src={tutor.thumbnail}
              alt={`${tutor.name} - ${tutor.subject} Tutor`}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            />

            {/* Subject Icon Overlay */}
            <div
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white backdrop-blur-sm"
              style={{ backgroundColor: mainColor }}
            >
              {tutor.icon}
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Name & Teaching Style - Overlay on Image */}
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold mb-1 drop-shadow-lg">
              {tutor.name}
            </h3>
            <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              {tutor.teachingStyle}
            </span>
          </div>
        </div>

        {/* University Section - Compact */}
        <div className="bg-white/80 rounded-xl p-4 mb-4 border border-gray-100 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={tutor.education.universityLogo}
                alt={tutor.education.university}
                className="w-8 h-8 object-contain"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-xs leading-tight">
                  {tutor.education.university}
                </p>
                <p className="text-xs text-gray-600">{tutor.education.major}</p>
              </div>
            </div>

            <div
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: `${mainColor}90` }}
            >
              <BarChart3 className="w-3 h-3" />
              <span>IPK: {tutor.education.gpa}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-6">
        {/* Methodology - Simplified */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
            <Target
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            Metode Mengajar
          </h4>
          <p
            className="text-gray-700 text-xs leading-relaxed"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {tutor.methodology}
          </p>
        </div>

        {/* Key Highlights - Full Width Sections */}
        <div className="space-y-4 mb-4">
          {/* Awards Section */}
          <div className="bg-gradient-to-r from-yellow-50 via-yellow-25 to-transparent border border-yellow-200/50 rounded-xl p-3 backdrop-blur-sm">
            <h4 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2">
              <div className="p-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-sm">
                <Trophy className="w-3 h-3 text-white" />
              </div>
              <span className="text-yellow-800">Prestasi Utama</span>
            </h4>
            <div className="space-y-2">
              {tutor.awards.slice(0, 2).map((award, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 mt-1 flex-shrink-0 shadow-sm" />
                  <span
                    className="text-xs text-gray-700 leading-relaxed font-medium"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {award}
                  </span>
                </div>
              ))}
              {tutor.awards.length > 2 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-yellow-200 to-transparent" />
                  <span className="text-xs text-yellow-600 font-semibold bg-yellow-100 px-2 py-1 rounded-full">
                    +{tutor.awards.length - 2} prestasi lainnya
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-yellow-200 to-transparent" />
                </div>
              )}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-gradient-to-r from-blue-50 via-blue-25 to-transparent border border-blue-200/50 rounded-xl p-3 backdrop-blur-sm">
            <h4 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2">
              <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm">
                <Star className="w-3 h-3 text-white" />
              </div>
              <span className="text-blue-800">Keahlian Khusus</span>
            </h4>
            <div className="space-y-2">
              {tutor.achievements.slice(0, 2).map((achievement, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mt-1 flex-shrink-0 shadow-sm" />
                  <span
                    className="text-xs text-gray-700 leading-relaxed font-medium"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {achievement}
                  </span>
                </div>
              ))}
              {tutor.achievements.length > 2 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent" />
                  <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                    +{tutor.achievements.length - 2} keahlian lainnya
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-blue-200 to-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specialties Tags - Bottom */}
        <div className="flex flex-wrap gap-2">
          {tutor.specialties.slice(0, 3).map((specialty, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
            >
              {specialty}
            </span>
          ))}
          {tutor.specialties.length > 3 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
              +{tutor.specialties.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Enhanced Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default TutorGridSection;
