'use client';

import TO_STAN from '@/_assest/homepage/hero/TO_STAN.webp';
import TO_UGM from '@/_assest/homepage/hero/TO_UGM.webp';
import TO_UI from '@/_assest/homepage/hero/TO_UI.webp';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useRef } from 'react';

interface TryOutCardProps {
  id: string;
  title: string;
  description: string;
  image: string | StaticImageData;
  category: string;
  duration: string;
  questions: number;
  participants: number;
  rating: number;
  tags: string[];
  price: number;
  isPopular?: boolean;
  isNew?: boolean;
  startDate: string;
  endDate: string;
  passingRate: number;
  onClick: () => void;
}

const tryOuts: TryOutCardProps[] = [
  {
    id: 'to-1',
    title: 'Try Out SIMAK UI 2025',
    description:
      'Simulasi SIMAK UI terbaru dengan prediksi soal yang akurat berdasarkan pola tahun sebelumnya.',
    image: TO_UI,
    category: 'SIMAK UI',
    duration: '165 menit',
    questions: 125,
    participants: 212,
    rating: 4.8,
    tags: ['Terbaru', 'Populer', 'Prediksi'],
    price: 0,
    isPopular: true,
    startDate: '25 April 2025',
    endDate: '5 Mei 2025',
    passingRate: 78,
    onClick: () => {
      window.location.href = '/user/try-out';
    },
  },
  {
    id: 'to-2',
    title: 'Try Out UM UGM 2025',
    description:
      'Persiapkan diri untuk ujian masuk UGM dengan soal-soal yang mirip dengan ujian asli.',
    image: TO_UGM,
    category: 'UM UGM',
    duration: '135 menit',
    questions: 105,
    participants: 148,
    rating: 4.7,
    tags: ['Saintek', 'Soshum', 'Prediksi'],
    price: 0,
    startDate: '25 April 2025',
    endDate: '12 Mei 2025',
    passingRate: 72,
    onClick: () => {
      window.location.href = '/user/try-out';
    },
  },
  {
    id: 'to-3',
    title: 'Try Out PKN STAN 2025',
    description:
      'Latihan soal untuk persiapan ujian masuk Sekolah Tinggi Akuntansi Negara.',
    image: TO_STAN,
    category: 'PKN STAN',
    duration: '100 menit',
    questions: 110,
    participants: 125,
    rating: 4.6,
    tags: ['Kedinasan', 'Akuntansi', 'Perpajakan'],
    price: 0,
    isNew: true,
    startDate: '25 April 2025',
    endDate: '12 Mei 2025',
    passingRate: 75,
    onClick: () => {
      window.location.href = '/user/try-out';
    },
  },
];

const TryOutCard = ({ tryOut }: { tryOut: TryOutCardProps }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
    className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300"
  >
    {/* Header */}
    <div className="relative h-[200px] w-full overflow-hidden">
      <Image
        src={tryOut.image}
        alt={tryOut.title}
        fill
        className="object-cover transition-transform object-[90%_20%] duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 via-blue-600/30 to-blue-600/20" />

      {/* Price */}
      <div className="absolute left-4 top-4 z-10">
        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-600 shadow-md">
          {/* Rp{tryOut.price.toLocaleString('id-ID')} */} Gratis!
        </span>
      </div>

      {/* Popular / New */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        {tryOut.isPopular && (
          <span className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-blue-800 shadow-md">
            POPULER
          </span>
        )}
        {tryOut.isNew && (
          <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-bold text-white shadow-md">
            BARU
          </span>
        )}
      </div>

      {/* Category & Title */}
      <div className="absolute bottom-0 left-0 w-full p-4 text-center">
        <span className="mb-2 inline-block rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-blue-900">
          {tryOut.category}
        </span>
        <h3 className="text-xl font-bold text-white md:text-2xl">
          {tryOut.title}
        </h3>
      </div>
    </div>

    {/* Body */}
    <div className="p-4">
      <p className="mb-4 text-sm text-gray-600">{tryOut.description}</p>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-blue-50 p-2 text-center">
          <div className="text-xs text-gray-600">Durasi</div>
          <div className="text-sm font-bold text-blue-600">
            {tryOut.duration}
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-2 text-center">
          <div className="text-xs text-gray-600">Soal</div>
          <div className="text-sm font-bold text-blue-600">
            {tryOut.questions}
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-2 text-center">
          <div className="text-xs text-gray-600">Peserta</div>
          <div className="text-sm font-bold text-blue-600">
            {tryOut.participants.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-center flex-wrap gap-1">
        {tryOut.tags.map((tag, idx) => (
          <span
            key={idx}
            className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-blue-50 p-2 text-xs">
          <Calendar className="h-3 w-3 text-blue-600" />
          <span className="font-medium text-gray-700">
            Mulai: {tryOut.startDate}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-blue-50 p-2 text-xs">
          <Calendar className="h-3 w-3 text-blue-600" />
          <span className="font-medium text-gray-700">
            Selesai: {tryOut.endDate}
          </span>
        </div>
      </div>

      <button
        onClick={tryOut.onClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
      >
        Daftar Sekarang
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </motion.div>
);

const FeaturedTryoutSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) controls.start('visible');
  }, [controls, isInView]);

  return (
    <section
      id="tryout"
      className="relative min-h-screen w-full overflow-hidden pt-16 md:pt-20"
    >
      <div
        className="relative z-[30] mx-auto flex max-w-7xl flex-col items-center px-4 text-center md:pb-0 pb-12"
        ref={ref}
      >
        {/* Heading */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } },
          }}
          className="mb-4 text-center"
        >
          <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
            TRY OUT TERSEDIA
          </span>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.1 },
            },
          }}
          className="mb-8 text-center"
        >
          <h2 className="mb-4 text-[1.5rem] font-bold text-primary md:text-[2.5rem]">
            Pilih{' '}
            <span className="inline-block bg-blue-600 text-white rounded-xl px-1 py-0">
              Try Out
            </span>{' '}
            Terbaikmu
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Kami menyediakan berbagai Try Out berkualitas untuk membantu
            persiapan ujian masuk PTN dan sekolah kedinasan favoritmu.
          </p>
        </motion.div>

        {/* Try Out Cards */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.2, staggerChildren: 0.1 },
            },
          }}
          className="mb-10 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {tryOuts.map((tryOut) => (
            <motion.div
              key={tryOut.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <TryOutCard tryOut={tryOut} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedTryoutSection;
