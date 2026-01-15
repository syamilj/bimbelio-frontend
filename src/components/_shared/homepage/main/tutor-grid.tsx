'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { useGet } from '@/lib/fetch-helper/useGet';
import { motion } from 'framer-motion';
import { Star, Target, Users } from 'lucide-react';
import React from 'react';

type TutorDataType = {
  id: string;
  email: string;
  description: string;
  image: string | null;
  name: string;
  phone: string;
  status: boolean;
  lastEducation: string;
  certificate: string | null;
  averageRating: number;
  Category: {
    id: string;
    name: string;
    nomor: number;
    to: boolean;
    visibleAtWebSubIds: string[];
    website_sub_category_id: string;
  }[];
  totalLiveClass: number;
};

const TutorGridSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  // const router = useRouter();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#7C3AED';

  const { data: tutorList } = useGet<TutorDataType[]>(
    '/instructor/getAllInstructor',
  );

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
          {tutorList?.map((tutor, index) => (
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
  tutor: TutorDataType;
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
      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm ${
            tutor.status ? 'bg-green-500' : 'bg-gray-400'
          }`}
        >
          {tutor.status ? 'Aktif' : 'Tidak Aktif'}
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {tutor.image ? (
          <img
            src={tutor.image}
            alt={tutor.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-main-default/20 to-gray-200">
            <div className="text-center text-gray-400">
              <div className="text-4xl font-bold mb-2">👨‍🏫</div>
              <p className="text-xs">Foto Tutor</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Name Overlay */}
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold drop-shadow-lg">{tutor.name}</h3>
        </div>

        {/* Rating Badge - Bottom Right */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-sm text-gray-900">
            {tutor.averageRating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Categories Section */}
        {tutor.Category.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 text-xs flex items-center gap-2">
              <Target
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
              Mata Pelajaran
            </h4>
            <div className="flex flex-wrap gap-2">
              {tutor.Category.slice(0, 3).map((category, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-white transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: mainColor }}
                >
                  {category.name}
                </span>
              ))}
              {tutor.Category.length > 3 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-200">
                  +{tutor.Category.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="space-y-2 bg-yellow-50 p-3 rounded-3xl border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 text-xs flex items-center gap-2">
            <Target className="w-4 h-4 text-yellow-600" />
            Tentang Tutor
          </h4>
          <p className="text-yellow-900 text-xs leading-relaxed whitespace-normal break-words">
            {tutor.description || 'Deskripsi tidak tersedia'}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-3">
          {/* Last Education */}
          <div
            className="p-3 rounded-3xl border transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: `${mainColor}10`,
              borderColor: `${mainColor}30`,
            }}
          >
            <p className="text-xs text-gray-600 mb-1">Pendidikan Terakhir</p>
            <p
              className="text-sm font-bold whitespace-normal break-words"
              style={{ color: mainColor }}
              title={tutor.lastEducation}
            >
              {tutor.lastEducation}
            </p>
          </div>

          {/* Live Classes */}
          <div
            className="p-3 rounded-3xl border transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: `${mainColor}10`,
              borderColor: `${mainColor}30`,
            }}
          >
            <p className="text-xs text-gray-600 mb-1">Kelas Live</p>
            <p
              className="text-sm font-bold"
              style={{ color: mainColor }}
            >
              {tutor.totalLiveClass}+
            </p>
          </div>
        </div>

        {/* Certificate Section */}
        {tutor.certificate && (
          <div
            className="p-3 rounded-3xl border flex items-start justify-between gap-3 transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: `${mainColor}10`,
              borderColor: `${mainColor}30`,
            }}
          >
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-0.5">Sertifikat</p>
              <p className="text-xs font-semibold text-gray-800 whitespace-normal break-words">
                {tutor.certificate}
              </p>
            </div>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-5"
              style={{ backgroundColor: mainColor }}
            >
              ✓
            </div>
          </div>
        )}

        {/* Contact Info - Hidden until hover */}
        <div className="flex gap-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
          <span>📧 {tutor.email}</span>
        </div>
      </div>

      {/* Enhanced Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default TutorGridSection;
