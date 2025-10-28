'use client';

import MobilePoster from '@/_assets/homepage/hero/bimbelio-mobile.webp';
import DesktopPoster from '@/_assets/homepage/hero/bimbelio.webp';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart,
  BookOpen,
  Bot,
  PhoneCallIcon,
  Play,
  Target,
  Users,
} from 'lucide-react';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

// Lazy loading untuk komponen berat
const ConsultationDialog = lazy(
  () => import('@/components/_shared/contact/consultation-dialog'),
);

// Dynamic imports untuk komponen yang tidak immediately visible
const IPhoneFrame = lazy(() =>
  import('@/components/ui/iphone-frame').then((module) => ({
    default: module.IPhoneFrame,
  })),
);

// Lazy import untuk browser icons yang tidak critical
const ChevronLeft = lazy(() =>
  import('lucide-react').then((module) => ({ default: module.ChevronLeft })),
);
const ChevronRight = lazy(() =>
  import('lucide-react').then((module) => ({ default: module.ChevronRight })),
);
const RotateCw = lazy(() =>
  import('lucide-react').then((module) => ({ default: module.RotateCw })),
);
const Search = lazy(() =>
  import('lucide-react').then((module) => ({ default: module.Search })),
);

export interface Logo {
  src: string | StaticImageData;
  alt: string;
  label: string;
}

interface Stat {
  label: string;
  value: string;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  Pretest: <BarChart className="w-4 h-4 mr-2" />,
  'Uji Progress': <BadgeCheck className="w-4 h-4 mr-2" />,
  'Try Out': <BookOpen className="w-4 h-4 mr-2" />,
  Liveclass: <Users className="w-4 h-4 mr-2" />,
  AI: <Bot className="w-4 h-4 mr-2" />,
  'SMART Goals': <Target className="w-4 h-4 mr-2" />,
};

const STATS: Stat[] = [
  { label: 'Live Session', value: '198+' },
  { label: 'Try Out Berkala', value: '100+' },
  { label: 'Rekaman Lengkap', value: '300+' },
];

// Component
const HeroSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [isMobile, setIsMobile] = useState(false);
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
    useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  // Get dynamic colors
  const isMainLandingPage = window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollTo = (id: string, offset = 100) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Handle consultation dialog open
  const handleConsultationClick = () => {
    setIsConsultationDialogOpen(true);
  };

  const handleContactSelect = (contactType: string) => {
    console.log(`📊 Contact selected from hero: ${contactType}`);
  };

  return (
    <>
      <div
        id="hero"
        className="relative min-h-screen w-full overflow-hidden pt-16 md:pt-20"
      >
        <GlobalStyles />

        {/* Modern Geometric Background - Random & Colorful */}
        <div className="absolute inset-0 z-1 bg-white">
          {/* Random Geometric Shapes - Colorful & Solid */}

          {/* Shape 1: Large Blue Circle - Top Right */}
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-25 shape-float-1"
            style={{
              backgroundColor: '#0EA5E9',
              boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)',
            }}
          />

          {/* Shape 2: Medium Yellow Square - Top Left */}
          <div
            className="absolute top-32 left-20 w-40 h-40 rounded-2xl opacity-28 shape-float-2"
            style={{
              backgroundColor: '#FFC208',
              boxShadow: '0 6px 28px rgba(255, 194, 8, 0.35)',
              transform: 'rotate(15deg)',
            }}
          />

          {/* Shape 3: Small Pink Circle - Mid Right */}
          <div
            className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full opacity-30 shape-float-3"
            style={{
              backgroundColor: '#EC4899',
              boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
            }}
          />

          {/* Shape 4: Triangle/Diamond - Mid Left */}
          <div
            className="absolute top-1/3 left-1/3 w-32 h-32 opacity-24 shape-float-4"
            style={{
              backgroundColor: '#8B5CF6',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)',
              transform: 'rotate(45deg)',
              borderRadius: '12px',
            }}
          />

          {/* Shape 5: Medium Green Circle - Bottom Left */}
          <div
            className="absolute bottom-1/4 left-16 w-48 h-48 rounded-full opacity-26 shape-float-5"
            style={{
              backgroundColor: '#10B981',
              boxShadow: '0 10px 36px rgba(16, 185, 129, 0.32)',
            }}
          />

          {/* Shape 6: Small Orange Square - Bottom Center */}
          <div
            className="absolute bottom-32 left-1/2 w-28 h-28 rounded-2xl opacity-32 shape-float-6"
            style={{
              backgroundColor: '#F97316',
              boxShadow: '0 6px 26px rgba(249, 115, 22, 0.38)',
              transform: 'rotate(-12deg)',
            }}
          />

          {/* Shape 7: Large Indigo Rounded Square - Center Right */}
          <div
            className="absolute top-1/2 right-20 w-56 h-56 rounded-3xl opacity-22 shape-float-7"
            style={{
              backgroundColor: '#6366F1',
              boxShadow: '0 12px 40px rgba(99, 102, 241, 0.28)',
              transform: 'rotate(8deg)',
            }}
          />

          {/* Shape 8: Small Cyan Circle - Top Center */}
          <div
            className="absolute top-24 left-1/2 w-20 h-20 rounded-full opacity-34 shape-float-8"
            style={{
              backgroundColor: '#06B6D4',
              boxShadow: '0 4px 18px rgba(6, 182, 212, 0.42)',
            }}
          />

          {/* Shape 5: Medium Green Circle - Bottom Left */}
          <motion.div
            animate={{
              y: [0, 25, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
            className="absolute bottom-1/4 left-16 w-48 h-48 rounded-full opacity-9"
            style={{ backgroundColor: '#10B981' }}
          />

          {/* Shape 6: Small Orange Square - Bottom Center */}
          <motion.div
            animate={{
              rotate: [-12, -22, -12],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3,
            }}
            className="absolute bottom-32 left-1/2 w-28 h-28 rounded-2xl opacity-11"
            style={{ backgroundColor: '#F97316', transform: 'rotate(-12deg)' }}
          />

          {/* Shape 7: Large Indigo Rounded Square - Center Right */}
          <motion.div
            animate={{
              y: [0, -18, 0],
              rotate: [8, 18, 8],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.5,
            }}
            className="absolute top-1/2 right-20 w-56 h-56 rounded-3xl opacity-7"
            style={{ backgroundColor: '#6366F1', transform: 'rotate(8deg)' }}
          />

          {/* Shape 8: Small Cyan Circle - Top Center */}
          <motion.div
            animate={{
              y: [0, 12, 0],
              x: [0, -5, 0],
            }}
            transition={{
              duration: 8.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8,
            }}
            className="absolute top-20 left-1/2 w-20 h-20 rounded-full opacity-13"
            style={{ backgroundColor: '#06B6D4' }}
          />

          {/* Shape 9: Pill Shape - Mid Bottom */}
          <div
            className="absolute bottom-1/3 right-1/3 opacity-27 shape-float-9"
            style={{
              backgroundColor: '#EF4444',
              boxShadow: '0 8px 30px rgba(239, 68, 68, 0.36)',
              width: '80px',
              height: '160px',
              borderRadius: '40px',
              transform: 'rotate(25deg)',
            }}
          />

          {/* Shape 10: Small Lime Square - Random Position */}
          <div
            className="absolute top-2/3 left-1/4 w-24 h-24 rounded-2xl opacity-29 shape-float-10"
            style={{
              backgroundColor: '#84CC16',
              boxShadow: '0 5px 22px rgba(132, 204, 22, 0.38)',
              transform: 'rotate(-15deg)',
            }}
          />

          {/* Shape 11: Medium Teal Rounded - Bottom Right */}
          <div
            className="absolute bottom-20 right-1/4 w-36 h-36 rounded-2xl opacity-23 shape-float-11"
            style={{
              backgroundColor: '#14B8A6',
              boxShadow: '0 10px 34px rgba(20, 184, 166, 0.33)',
            }}
          />

          {/* Shape 12: Tiny Rose Circle - Random */}
          <div
            className="absolute top-1/2 left-2/3 w-16 h-16 rounded-full opacity-35 shape-float-12"
            style={{
              backgroundColor: '#F43F5E',
              boxShadow: '0 4px 16px rgba(244, 63, 94, 0.44)',
            }}
          />

          {/* Shape 10: Small Lime Square - Random Position */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [-15, -5, -15],
            }}
            transition={{
              duration: 9.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.2,
            }}
            className="absolute top-2/3 left-1/4 w-24 h-24 rounded-2xl opacity-10"
            style={{ backgroundColor: '#84CC16', transform: 'rotate(-15deg)' }}
          />

          {/* Shape 11: Medium Teal Rounded - Bottom Right */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3.5,
            }}
            className="absolute bottom-20 right-1/4 w-36 h-36 rounded-2xl opacity-8"
            style={{ backgroundColor: '#14B8A6' }}
          />

          {/* Shape 12: Tiny Rose Circle - Random */}
          <motion.div
            animate={{
              x: [0, -10, 0],
              y: [0, 8, 0],
            }}
            transition={{
              duration: 7.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.2,
            }}
            className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full opacity-14"
            style={{ backgroundColor: '#F43F5E' }}
          />

          {/* Subtle grid for structure */}
          <div className="absolute inset-0 opacity-[0.015]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(#0EA5E9 1px, transparent 1px),
                  linear-gradient(90deg, #0EA5E9 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
              }}
            />
          </div>
        </div>

        {/* Main Content - Ultra  Layout */}
        <div className="relative z-30 mx-auto flex max-w-6xl flex-col items-center px-4 text-center pb-16">
          <BrandSection mainColor={mainColor} />
          <HeadingSection
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />
          <StatsSection
            stats={STATS}
            mainColor={mainColor}
          />

          <CTASection
            onClick={() => scrollTo('tryout')}
            onConsultationClick={handleConsultationClick}
            mainColor={mainColor}
            secondaryColor={secondaryColor}
          />

          <Suspense
            fallback={
              <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse" />
            }
          >
            <VideoSection isMobile={isMobile} />
          </Suspense>
        </div>
      </div>

      {/* Consultation Dialog dengan lazy loading */}
      {isConsultationDialogOpen && (
        <Suspense fallback={null}>
          <ConsultationDialog
            isOpen={isConsultationDialogOpen}
            onOpenChange={setIsConsultationDialogOpen}
            onContactSelect={handleContactSelect}
            showStats={true}
            showTelegramOption={false}
          />
        </Suspense>
      )}
    </>
  );
};

//  Global Styles - Simplified
const GlobalStyles: React.FC = () => (
  <style
    jsx
    global
  >{`
    @keyframes gentle-float {
      0%,
      100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    @keyframes smooth-marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes float-1 {
      0%,
      100% {
        transform: translate(0, 0);
      }
      50% {
        transform: translate(-15px, -20px);
      }
    }

    @keyframes float-2 {
      0%,
      100% {
        transform: translate(0, 0) rotate(15deg);
      }
      50% {
        transform: translate(20px, 15px) rotate(25deg);
      }
    }

    @keyframes float-3 {
      0%,
      100% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(-10px, 18px) scale(1.05);
      }
    }

    @keyframes float-4 {
      0%,
      100% {
        transform: translate(0, 0) rotate(45deg);
      }
      50% {
        transform: translate(-12px, -15px) rotate(55deg);
      }
    }

    @keyframes float-5 {
      0%,
      100% {
        transform: translate(0, 0);
      }
      50% {
        transform: translate(18px, 22px);
      }
    }

    @keyframes float-6 {
      0%,
      100% {
        transform: translate(0, 0) rotate(-12deg) scale(1);
      }
      50% {
        transform: translate(15px, -18px) rotate(-22deg) scale(1.08);
      }
    }

    @keyframes float-7 {
      0%,
      100% {
        transform: translate(0, 0) rotate(8deg);
      }
      50% {
        transform: translate(-20px, -25px) rotate(18deg);
      }
    }

    @keyframes float-8 {
      0%,
      100% {
        transform: translate(0, 0);
      }
      50% {
        transform: translate(-8px, 15px);
      }
    }

    @keyframes float-9 {
      0%,
      100% {
        transform: translate(0, 0) rotate(25deg);
      }
      50% {
        transform: translate(14px, -12px) rotate(35deg);
      }
    }

    @keyframes float-10 {
      0%,
      100% {
        transform: translate(0, 0) rotate(-15deg);
      }
      50% {
        transform: translate(-16px, 20px) rotate(-5deg);
      }
    }

    @keyframes float-11 {
      0%,
      100% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(22px, 18px) scale(1.1);
      }
    }

    @keyframes float-12 {
      0%,
      100% {
        transform: translate(0, 0);
      }
      50% {
        transform: translate(-10px, -14px);
      }
    }

    .animate-gentle-float {
      animation: gentle-float 6s ease-in-out infinite;
    }
    .animate-smooth-marquee {
      animation: smooth-marquee 40s linear infinite;
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.8s ease-out;
    }

    .text-gradient {
      background: linear-gradient(
        135deg,
        var(--main-color),
        var(--secondary-color)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .shape-float-1 {
      animation: float-1 8s ease-in-out infinite;
    }
    .shape-float-2 {
      animation: float-2 10s ease-in-out infinite 1s;
    }
    .shape-float-3 {
      animation: float-3 6s ease-in-out infinite 0.5s;
    }
    .shape-float-4 {
      animation: float-4 9s ease-in-out infinite 2s;
    }
    .shape-float-5 {
      animation: float-5 11s ease-in-out infinite 1.5s;
    }
    .shape-float-6 {
      animation: float-6 7s ease-in-out infinite 3s;
    }
    .shape-float-7 {
      animation: float-7 12s ease-in-out infinite 2.5s;
    }
    .shape-float-8 {
      animation: float-8 8.5s ease-in-out infinite 0.8s;
    }
    .shape-float-9 {
      animation: float-9 10.5s ease-in-out infinite 1.8s;
    }
    .shape-float-10 {
      animation: float-10 9.5s ease-in-out infinite 2.2s;
    }
    .shape-float-11 {
      animation: float-11 13s ease-in-out infinite 3.5s;
    }
    .shape-float-12 {
      animation: float-12 7.5s ease-in-out infinite 1.2s;
    }
  `}</style>
);

//  Brand Section
const BrandSection: React.FC<{ mainColor: string }> = ({ mainColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex mt-16 mb-8 flex-col items-center"
    >
      {/* New badge - Launching soon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full border-2 shadow-sm bg-white/90 backdrop-blur-sm"
        style={{
          borderColor: `${mainColor}30`,
        }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: mainColor }}
        />
        <span className="text-sm font-bold text-gray-700">
          Mulai Sekarang. 36 Minggu ke Depan.
        </span>
      </motion.div>

      {/* Powered by section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center gap-2 text-gray-600 text-sm bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm"
      >
        <span
          className="font-semibold bg-clip-text text-transparent"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${mainColor}aa)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Bimbelio: Satu Akun untuk UTBK, Mandiri, Kedinasan
        </span>
      </motion.div>
    </motion.div>
  );
};

//  Heading Section - Much simpler
const HeadingSection: React.FC<{
  mainColor: string;
  secondaryColor: string;
  colorsLoaded?: boolean;
}> = ({ mainColor, secondaryColor, colorsLoaded = true }) => (
  <div className="mb-16 space-y-8 max-w-5xl">
    {/* Main heading - Liveclass vs Livestream concept */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-center font-black leading-tight relative space-y-3">
        {/* Baris 1: Mau Jadi Penonton */}
        <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="text-gray-900">Mau</span>
          <span
            className={cn(
              'text-white text-center px-3 md:px-4 py-1.5 md:py-2 rounded-2xl font-extrabold leading-tight shadow-md transition-all duration-300',
              !colorsLoaded && 'bg-blue-500',
            )}
            style={
              colorsLoaded
                ? {
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }
                : {}
            }
          >
            Jadi Penonton
          </span>
        </div>

        {/* Baris 2: atau */}
        <div className="flex justify-center items-center text-2xl sm:text-3xl md:text-4xl py-2">
          <span className="text-gray-500 font-semibold">atau</span>
        </div>

        {/* Baris 3: Mahasiswa PTN Favorit? */}
        <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="text-gray-900">Mahasiswa</span>
          <span
            className={cn(
              'text-white text-center px-3 md:px-4 py-1.5 md:py-2 rounded-2xl font-extrabold leading-tight shadow-md transition-all duration-300',
              !colorsLoaded && 'bg-blue-500',
            )}
            style={
              colorsLoaded
                ? {
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }
                : {}
            }
          >
            PTN Favorit
          </span>
          <span className="text-gray-900">?</span>
        </div>
      </h1>

      {/* Value proposition - Liveclass concept */}
      <div className="space-y-4 mt-10 px-4">
        <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-semibold leading-relaxed text-center">
          <span
            className={cn(
              'font-black transition-colors duration-300',
              !colorsLoaded && 'text-blue-600',
            )}
            style={colorsLoaded ? { color: mainColor } : {}}
          >
            Liveclass bukan cuma nonton video.
          </span>{' '}
          Ini kelas interaktif dengan tutor alumni PTN, live di Zoom, bisa tanya
          langsung, diskusi real-time.
        </p>

        <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-center">
          <span className="font-bold text-gray-800">Livestream?</span> Itu buat
          yang ikut dari rumah, tetap dapat rekaman lengkap, TO berkala, dan AI
          Mentor 24/7.{' '}
          <span className="font-bold text-gray-800">
            Harga ratusan ribu dengan cicilan 3x
          </span>{' '}
          — tanpa biaya tersembunyi, tanpa ribet.
        </p>

        <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-center">
          Pilih yang sesuai ritme lo.{' '}
          <span
            className={cn(
              'font-bold transition-colors duration-300',
              !colorsLoaded && 'text-blue-500',
            )}
            style={colorsLoaded ? { color: secondaryColor || mainColor } : {}}
          >
            Satu akun, semua jalur
          </span>{' '}
          — UTBK, SIMAK UI, UM UGM, sampai kedinasan.
        </p>
      </div>
    </motion.div>

    {/* Program comparison cards - Liveclass vs Livestream */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
    >
      {/* Liveclass Card */}
      <div
        className="relative p-6 rounded-2xl bg-white shadow-lg border-2 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        style={{
          borderColor: `${mainColor}40`,
        }}
      >
        <div className="absolute -top-3 left-6">
          <span
            className="px-4 py-1 rounded-full text-xs font-black text-white shadow-md"
            style={{ backgroundColor: mainColor }}
          >
            PREMIUM
          </span>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2 mt-2">
          Liveclass
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          UTBK Materi + Intensif + Super
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${mainColor}20` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: mainColor }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">Maks. 50 siswa</p>
              <p className="text-xs text-gray-600">
                Batch eksklusif, perhatian personal
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${mainColor}20` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: mainColor }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">72+ Sessions</p>
              <p className="text-xs text-gray-600">Live interaktif di Zoom</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${mainColor}20` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: mainColor }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">
                1-on-1 Konseling
              </p>
              <p className="text-xs text-gray-600">Dengan tutor alumni PTN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Livestream Card */}
      <div
        className="relative p-6 rounded-2xl bg-white shadow-lg border-2 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        style={{
          borderColor: `${secondaryColor || mainColor}40`,
        }}
      >
        <div className="absolute -top-3 left-6">
          <span
            className="px-4 py-1 rounded-full text-xs font-black text-white shadow-md"
            style={{ backgroundColor: secondaryColor || mainColor }}
          >
            ALL-ACCESS
          </span>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2 mt-2">
          Livestream
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          UTBK + Ujian Mandiri + Kedinasan
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${secondaryColor || mainColor}20` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: secondaryColor || mainColor }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">Skala Besar</p>
              <p className="text-xs text-gray-600">
                Unlimited peserta, fleksibel
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${secondaryColor || mainColor}20` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: secondaryColor || mainColor }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">198+ Sessions</p>
              <p className="text-xs text-gray-600">
                Rekaman lengkap semua jalur
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${secondaryColor || mainColor}20` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: secondaryColor || mainColor }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">Grup Diskusi</p>
              <p className="text-xs text-gray-600">Belajar bareng komunitas</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Key differentiators */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.6 }}
      className="flex flex-wrap justify-center gap-4 pt-6"
    >
      {[
        {
          icon: <BarChart className="w-5 h-5" />,
          title: 'TO IRT-Based',
          desc: 'Analisis pola kesalahan akurat',
        },
        {
          icon: <Bot className="w-5 h-5" />,
          title: 'AI Mentor 24/7',
          desc: 'Instant jawab pertanyaan',
        },
        {
          icon: <Target className="w-5 h-5" />,
          title: 'Progress Tracking',
          desc: 'Weekly report jelas',
        },
        {
          icon: <Users className="w-5 h-5" />,
          title: 'Expert Tutors',
          desc: 'Fresh graduates',
        },
      ].map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-white shadow-md border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-w-[160px]"
          style={{
            borderColor: `${mainColor}20`,
          }}
        >
          <div
            className="p-2 rounded-2xl"
            style={{
              backgroundColor: `${mainColor}15`,
              color: mainColor,
            }}
          >
            {item.icon}
          </div>
          <div className="text-center">
            <div
              className="font-bold text-sm mb-1"
              style={{ color: mainColor }}
            >
              {item.title}
            </div>
            <div className="text-xs text-gray-600">{item.desc}</div>
          </div>
        </div>
      ))}
    </motion.div>
  </div>
);

//  Stats Section - Focus on program content
const StatsSection: React.FC<{
  stats: Stat[];
  mainColor: string;
}> = ({ stats = STATS, mainColor }) => (
  <div className="flex flex-col items-center mb-12 w-full">
    {/* Content Stats with Icons */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="grid grid-cols-3 gap-4 md:gap-8 mb-10 w-full max-w-3xl"
    >
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="text-center p-4 md:p-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-md hover:shadow-md transition-all duration-300 border-2 hover:-translate-y-1"
          style={{
            borderColor: `${mainColor}20`,
          }}
        >
          <div
            className="text-3xl md:text-5xl font-black mb-2"
            style={{ color: mainColor }}
          >
            {stat.value}
          </div>
          <div className="text-xs md:text-sm font-bold text-gray-700">
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>

    {/* Timeline badge */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 1.4 }}
      className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-lg border-2"
      style={{
        borderColor: `${mainColor}30`,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: mainColor }}
        />
        <span className="text-sm md:text-base font-bold text-gray-700">
          Livestream mulai 21 November
        </span>
      </div>
      <div className="h-6 w-px bg-gray-300" />
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: mainColor }}
        />
        <span className="text-sm md:text-base font-bold text-gray-700">
          Liveclass mulai 8 Januari 2025
        </span>
      </div>
    </motion.div>
  </div>
);

//  Logo Section dengan Lazy Loading yang Super Optimized
const LogoSection: React.FC<{
  logos: Logo[];
  mainColor: string;
}> = ({ logos, mainColor }) => {
  const [isInView, setIsInView] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const logoSectionRef = useRef<HTMLDivElement>(null);
  const doubled = [...logos, ...logos];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Delay rendering sedikit setelah masuk viewport untuk smooth loading
          setTimeout(() => setShouldRender(true), 300);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '150px 0px', // Load 150px sebelum masuk viewport
      },
    );

    if (logoSectionRef.current) {
      observer.observe(logoSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={logoSectionRef}
      className="w-full mb-16"
    >
      {isInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Target PTN Idaman
          </h3>
          <p className="text-gray-600">
            PTN impian yang dicapai karena sistem udah terbukti work!
          </p>
        </motion.div>
      )}

      {/* Placeholder height untuk mencegah layout shift */}
      <div className="relative overflow-hidden py-4 rounded-2xl min-h-[120px]">
        {shouldRender ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="animate-smooth-marquee flex"
          >
            {doubled.map((logo, i) => (
              <div
                key={i}
                className="shrink-0 mx-8 flex flex-col items-center group"
              >
                <div className="w-24 h-24 p-2 bg-white rounded-full shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={logo.src || '/placeholder.svg'}
                    alt={logo.alt}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-full"
                    loading="lazy"
                    priority={false}
                  />
                </div>
                <span className="text-sm font-semibold mt-3 text-main-default">
                  {logo.label}
                </span>
              </div>
            ))}
          </motion.div>
        ) : (
          // Ultra minimal loading skeleton
          <div className="flex animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 mx-8 flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-3 bg-gray-200 rounded mt-3"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

//  CTA Section
// CTASection dengan routing ke /price

// CTASection dengan desain lebih modern dan UX lebih jelas
const CTASection: React.FC<{
  onClick?: () => void;
  onConsultationClick?: () => void;
  mainColor: string;
  secondaryColor: string;
}> = ({ mainColor, secondaryColor, onConsultationClick }) => {
  const router = useRouter();

  // Navigasi ke /price
  const handleClick = () => {
    router.push('/price');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
      className="w-full flex flex-col items-center mb-16 gap-4"
    >
      {/* Main CTA */}
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg text-white shadow-md transition-all duration-300 cursor-pointer"
        style={{
          background: `linear-gradient(90deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
          boxShadow: `0 4px 24px 0 ${mainColor}33`,
        }}
      >
        <Play className="w-5 h-5 animate-gentle-float" />
        <span>Mulai Blueprint sekarang!</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
      </motion.button>

      {/* Sub CTA Buttons */}
      <div className="flex justify-center mt-2">
        <a
          href="https://t.me/bimbelio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white shadow border transition-transform duration-200 hover:scale-105"
          style={{ background: mainColor, color: '#fff' }}
        >
          <Users className="w-3 h-3" />
          Grup Belajar
        </a>
        <a
          href="#tryout"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('tryout');
            if (el) {
              const top =
                el.getBoundingClientRect().top + window.pageYOffset - 100;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white shadow border ml-2 transition-transform duration-200 hover:scale-105"
          style={{ background: mainColor, color: '#fff' }}
        >
          <BarChart className="w-3 h-3" />
          Tryout Gratis
        </a>
        <button
          onClick={onConsultationClick}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white shadow border ml-2 transition-transform duration-200 hover:scale-105"
          style={{ background: mainColor, color: '#fff' }}
        >
          <PhoneCallIcon className="w-3 h-3" />
          Konsultasi
        </button>
      </div>
    </motion.div>
  );
};

//  Video Section
const VideoSection: React.FC<{ isMobile: boolean }> = ({ isMobile }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 2.5 }}
    className={cn(
      'relative mx-auto',
      isMobile ? 'w-[280px] h-[500px]' : 'w-[900px] h-[506px]',
    )}
  >
    {isMobile ? <MobileVideo /> : <DesktopVideo />}
  </motion.div>
);

//  Mobile Video dengan Ultra Optimized Loading
const MobileVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '50px 0px' }, // Load closer to viewport
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current && isInView && !isLoaded) {
      const video = videoRef.current;
      video.load();
      setIsLoaded(true);

      const handleCanPlay = () => {
        video.playbackRate = 1.5;
        video.play().catch(console.error);
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });
    }
  }, [isInView, isLoaded]);

  return (
    <div className="relative">
      <Suspense
        fallback={
          <div className="w-[280px] h-[500px] bg-gray-200 rounded-3xl animate-pulse" />
        }
      >
        <IPhoneFrame>
          <div className="relative w-full h-full">
            {isInView ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="none"
                poster={MobilePoster.src}
              >
                <source
                  src="/hero/bimbelio-mobile.webm"
                  type="video/webm"
                />
              </video>
            ) : (
              <Image
                src={MobilePoster}
                alt="Mobile Video Placeholder"
                fill
                className="object-cover"
                loading="lazy"
              />
            )}
          </div>
        </IPhoneFrame>
      </Suspense>
    </div>
  );
};

//  Desktop Video dengan Super Optimized Loading
const DesktopVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [showBrowserBar, setShowBrowserBar] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Delay browser bar untuk mengurangi initial load
          setTimeout(() => setShowBrowserBar(true), 500);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '50px 0px' },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current && isInView && !isLoaded) {
      const video = videoRef.current;
      video.load();
      setIsLoaded(true);

      const handleCanPlay = () => {
        video.playbackRate = 1.5;
        video.play().catch(console.error);
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });
    }
  }, [isInView, isLoaded]);

  return (
    <div className="relative w-full h-full rounded-2xl shadow-sm overflow-hidden bg-white">
      <div className="flex flex-col w-full h-full">
        {/* Optimized browser bar dengan lazy loading icons */}
        {showBrowserBar && (
          <div className="flex items-center bg-white px-4 py-3 border-b">
            <div className="flex-1 flex items-center bg-white rounded-2xl px-3 py-2 text-sm border">
              <Suspense
                fallback={<div className="w-4 h-4 bg-gray-200 rounded mr-2" />}
              >
                <Search className="w-4 h-4 mr-2 text-gray-400" />
              </Suspense>
              <span className="text-gray-600">bimbelio.com</span>
            </div>
          </div>
        )}

        {isInView ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            preload="none"
            poster={DesktopPoster.src}
          >
            <source
              src="/hero/bimbelio.webm"
              type="video/webm"
            />
          </video>
        ) : (
          <Image
            src={DesktopPoster}
            alt="Desktop Video Placeholder"
            fill
            className="object-cover"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
};

export default HeroSection;
export { HeroSection };
