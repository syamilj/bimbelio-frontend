'use client';

import GridPattern from '@/components/magicui/animated-grid-pattern';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  PointerIcon,
  RotateCw,
  Search,
} from 'lucide-react';
import Image from 'next/image';
import ImageHero from "@/_assest/homepage/hero/bg-hero.webp";
import type React from 'react';
import { useEffect, useState } from 'react';

// Types
interface Logo {
  src: string;
  alt: string;
  label: string;
}

interface Stat {
  label: string;
  value: string;
}

interface HeadingItem {
  text: string;
  bg: string;
  color: string;
}

// Constants
const LOGOS: Logo[] = [
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO_PTN_ITB_9_11zon_6_11zon-UetSeUbMn5OcJXcWqqbdZprLLoEZWO.webp',
    alt: 'Logo ITB',
    label: 'ITB',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO_KEDINASAN_STIS_5_11zon_5_11zon-t7SeKw0UFSI5x6BaVzNWispgKZBcK0.webp',
    alt: 'Logo STIS',
    label: 'STIS',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO_PTN_ITS_7_11zon_7_11zon-riXxE7jk8wiam6ARkDFhhStbDJL8aR.webp',
    alt: 'Logo ITS',
    label: 'ITS',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO_KEDINASAN_IPDN_4_11zon_3_11zon-X8FcsV3aF3ahBfmE24lDKzj83iBdOT.webp',
    alt: 'Logo IPDN',
    label: 'IPDN',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO_KEDINASAN_STAN_1_11zon_4_11zon-ZZE1PJyZGA91YuPkafMB4aqLXY3OtS.webp',
    alt: 'Logo STAN',
    label: 'STAN',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO_PTN_UGM_10_11zon_8_11zon-DxmAgHmVdw9kRgJiJmrNrBnFioZU7V.webp',
    alt: 'Logo UGM',
    label: 'UGM',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO_PTN_UI.svg_11_11zon_9_11zon-pSHV8QVTjWSfMwcWAGbPIjHNflbGRL.webp',
    alt: 'Logo UI',
    label: 'UI',
  },
];

const STATS: Stat[] = [
  { label: 'Tingkat Kelulusan', value: '95%' },
  { label: 'Siswa Diterima', value: '1500+' },
  { label: 'Materi Belajar', value: '10.000+' },
];

const HEADINGS: HeadingItem[] = [
  {
    text: 'Paket Bundling Spesial',
    bg: 'bg-blue-600',
    color: 'text-white',
  },
  {
    text: 'Pejuang PTN & STAN!',
    bg: 'bg-yellow-400',
    color: 'text-blue-800',
  },
];

// Component
const HeroSection: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div
      id="hero"
      className="relative min-h-screen w-full overflow-hidden pt-16 md:pt-20"
    >
      <GlobalStyles />
      <BackgroundElements />

      {/* Main Content */}
      <div className="relative z-[30] mx-auto flex max-w-7xl flex-col items-center px-4 text-center md:pb-0 pb-12">
        <BrandLogo />
        <HeadingSection headings={HEADINGS} />
        <Subtitle />
        <StatsSection stats={STATS} />
        <LogoSliders
          logos={LOGOS}
          isMobile={isMobile}
        />
        <CTAButton onClick={() => scrollTo('tryout')} />
        <VideoMockup isMobile={isMobile} />
      </div>
    </div>
  );
};

// Sub-components
const GlobalStyles: React.FC = () => (
  <style
    jsx
    global
  >{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-33.33%);
      }
    }

    @keyframes marquee-reverse {
      0% {
        transform: translateX(-33.33%);
      }
      100% {
        transform: translateX(0);
      }
    }

    .animate-marquee-slower {
      animation: marquee 30s linear infinite;
    }

    .animate-marquee-reverse {
      animation: marquee-reverse 20s linear infinite;
    }

    .animate-marquee-slower:hover,
    .animate-marquee-reverse:hover {
      animation-play-state: paused;
    }
  `}</style>
);

const BackgroundElements: React.FC = () => (
  <>
    {/* Background Grid Pattern */}
    <div className="absolute inset-0 z-[1] h-full w-full overflow-hidden">
      <GridPattern
        numSquares={30}
        maxOpacity={0.05}
        duration={3}
        repeatdelay={1}
        className="[mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_95%)]"
      />
    </div>

    {/* Background Image + Overlay */}
    <div className="absolute inset-0 z-[2]">
      <Image
        src={ImageHero}
        alt="University Buildings Background"
        fill
        className="object-cover object-[75%] transition-all duration-500 md:object-center [mask-image:radial-gradient(white_90%)] mt-[-15rem]"
        priority
        sizes="100vw"
        loading="eager"
      />
      <div className="absolute inset-0 bg-white/80" />
      <div className="absolute bottom-0 left-0 w-full h-[40px] bg-gradient-to-b from-white to-workspace" />
    </div>
  </>
);

const BrandLogo: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-6 flex items-center rounded-full bg-white px-4 py-2 md:px-6 shadow-md"
  >
    <Image
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20landscape-lQuFJmR6FlX0I6gogGjIUEIxYWyqKO.png"
      alt="Bimbelio Logo"
      width={120}
      height={30}
      className="h-8 w-auto"
      priority
    />
  </motion.div>
);

const HeadingSection: React.FC<{ headings: HeadingItem[] }> = ({
  headings,
}) => (
  <div className="mb-8">
    {headings.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
        className="mb-4"
      >
        <span
          className={`inline-block rounded-xl px-4 py-2 font-bold ${item.bg} ${item.color} text-3xl md:text-6xl`}
        >
          {item.text}
        </span>
      </motion.div>
    ))}
  </div>
);

const Subtitle: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="mb-12 rounded-full bg-blue-100 px-6 py-3 text-blue-600 shadow-md text-base"
  >
    Siap-siap gaspol bareng Try Out paling komplit dan paling worth it!
  </motion.div>
);

const StatsSection: React.FC<{ stats: Stat[] }> = ({ stats }) => (
  <div className="grid grid-cols-3 gap-4 mb-12 max-w-4xl">
    {stats.map((stat, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
        className="flex flex-col items-center bg-white/90 backdrop-blur-sm border p-4 rounded-xl shadow-md"
      >
        <p className="text-gray-700 mb-1">{stat.label}</p>
        <p className="text-blue-600 font-bold text-xl">{stat.value}</p>
      </motion.div>
    ))}
  </div>
);

const LogoSliders: React.FC<{ logos: Logo[]; isMobile: boolean }> = ({
  logos,
  isMobile,
}) => {
  // Create two sets of logos for continuous scrolling effect
  const doubledLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full mb-12">
      {/* Desktop slider - moves from right to left */}
      <div className="hidden md:block relative overflow-hidden py-4 bg-gradient-to-r from-white/0 via-white/80 to-white/0">
        <div className="animate-marquee-slower flex">
          {doubledLogos.map((logo, index) => (
            <div
              key={`desktop-${index}`}
              className="flex-shrink-0 mx-4 flex flex-col items-center group"
            >
              <div className="w-28 h-28 p-3 bg-white rounded-full shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <Image
                  src={logo.src || '/placeholder.svg'}
                  alt={logo.alt}
                  width={120}
                  height={120}
                  className="w-20 h-20 object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-sm mt-2 font-medium text-blue-800 opacity-80 group-hover:opacity-100">
                {logo.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile slider - moves from left to right (opposite direction) */}
      <div className="md:hidden relative overflow-hidden py-3 bg-gradient-to-r from-white/0 via-white/80 to-white/0">
        <div className="animate-marquee-reverse flex">
          {doubledLogos.map((logo, index) => (
            <div
              key={`mobile-${index}`}
              className="flex-shrink-0 mx-3 flex flex-col items-center group"
            >
              <div className="w-20 h-20 p-2 bg-white rounded-full shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <Image
                  src={logo.src || '/placeholder.svg'}
                  alt={logo.alt}
                  width={80}
                  height={80}
                  className="w-16 h-16 object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-xs mt-2 font-medium text-blue-800 opacity-80 group-hover:opacity-100">
                {logo.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CTAButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.7 }}
    className="w-full flex justify-center mb-8"
  >
    <button
      onClick={onClick}
      className="px-8 py-3 bg-gradient text-white font-bold rounded-full shadow-lg hover:-translate-y-1 transition"
      aria-label="Coba Try Out Sekarang"
    >
      Coba Try Out Sekarang!
    </button>
  </motion.div>
);

const VideoMockup: React.FC<{ isMobile: boolean }> = ({ isMobile }) => (
  <div
    className={cn(
      'relative mx-auto mb-12 z-20',
      isMobile ? 'w-[320px] h-[568px]' : 'w-[1024px] h-[576px]',
    )}
  >
    {isMobile ? <MobileVideoMockup /> : <DesktopVideoMockup />}
  </div>
);

const MobileVideoMockup: React.FC = () => (
  <div className="relative aspect-[366/729] mx-auto max-w-[366px]">
    <div className="absolute z-[-1] left-[calc(23/366*100%)] top-[calc(23/729*100%)] h-[calc(686/729*100%)] w-[calc(318/366*100%)] overflow-visible rounded-[calc(38/366*100%)/calc(38/729*100%)]">
      <video
        src="https://tklsekuymvxxcvnkifbx.supabase.co/storage/v1/object/public/dont-delete//bimbelio-mobile.webm"
        className="w-full h-full object-cover"
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        aria-label="Bimbelio mobile app demonstration"
      />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </div>
    <Image
      src="https://tklsekuymvxxcvnkifbx.supabase.co/storage/v1/object/public/dont-delete/iphone-frame.svg"
      alt="Phone frame"
      width={366}
      height={729}
      className="object-cover pointer-events-none"
      priority
    />
  </div>
);

const DesktopVideoMockup: React.FC = () => (
  <div className="relative w-full h-full rounded-xl shadow-xl overflow-hidden">
    <div className="flex flex-col w-full h-full bg-white rounded-xl overflow-hidden border border-gray-200">
      <div className="flex items-center bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex space-x-2 mr-4 text-gray-500">
          <ChevronLeft className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <RotateCw className="w-4 h-4" />
        </div>
        <div className="flex-1 flex items-center bg-gray-200 rounded-md px-3 py-1 text-sm text-gray-600">
          <Search className="w-3.5 h-3.5 mr-2 text-gray-500" />
          <span>bimbelio.com</span>
        </div>
      </div>
      <video
        src="https://tklsekuymvxxcvnkifbx.supabase.co/storage/v1/object/public/dont-delete/bimbelio.webm"
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-label="Bimbelio desktop website demonstration"
      />
    </div>
  </div>
);


export default HeroSection;
