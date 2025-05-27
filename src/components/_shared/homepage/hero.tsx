'use client';

import ImageHero from '@/_assest/homepage/hero/bg-hero.webp';
import LogoIPDN from '@/_assest/homepage/hero/LOGO_KEDINASAN_IPDN.webp';
import LogoSTAN from '@/_assest/homepage/hero/LOGO_KEDINASAN_STAN.webp';
import LogoSTIS from '@/_assest/homepage/hero/LOGO_KEDINASAN_STIS.webp';
import LogoITB from '@/_assest/homepage/hero/LOGO_PTN_ITB.webp';
import LogoITS from '@/_assest/homepage/hero/LOGO_PTN_ITS.webp';
import LogoUGM from '@/_assest/homepage/hero/LOGO_PTN_UGM.webp';
import LogoUI from '@/_assest/homepage/hero/LOGO_PTN_UI.webp';
// Add these imports after the existing logo imports
import MobilePoster from '@/_assest/homepage/hero/bimbelio-mobile.webp';
import DesktopPoster from '@/_assest/homepage/hero/bimbelio.webp';
import GridPattern from '@/components/magicui/animated-grid-pattern';
import PulsatingButton from '@/components/magicui/pulsating-button';
import { IPhoneFrame } from '@/components/ui/iphone-frame';
import { cn } from '@/lib/utils';
import { IconOpenAI } from '@/styles/icon';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw, Search } from 'lucide-react';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

export interface Logo {
  src: string | StaticImageData;
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
  { src: LogoITB, alt: 'Logo ITB', label: 'ITB' },
  { src: LogoSTIS, alt: 'Logo STIS', label: 'STIS' },
  { src: LogoITS, alt: 'Logo ITS', label: 'ITS' },
  { src: LogoIPDN, alt: 'Logo IPDN', label: 'IPDN' },
  { src: LogoSTAN, alt: 'Logo STAN', label: 'STAN' },
  { src: LogoUGM, alt: 'Logo UGM', label: 'UGM' },
  { src: LogoUI, alt: 'Logo UI', label: 'UI' },
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
        src={ImageHero || '/placeholder.svg'}
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

const BrandLogo: React.FC = () => {
  return (
    <div className="flex mt-6 mb-6 flex-col items-center">
      {/* Badge tanpa “Powered by” */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2 flex items-center justify-center"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-white border px-3 py-1.5 shadow-sm">
          {/* Logo Bimbelio */}
          <div className="relative h-6 w-6 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Bimbelio Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          {/* Teks badge */}
          <span className="text-blue-500 font-medium text-xs sm:text-sm">
            Bimbel AI untuk PTN dan Kedinasan
          </span>
        </div>
      </motion.div>

      {/* “Powered by OpenAI” */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-1 text-gray-600 text-xs mt-2"
      >
        <span>Powered by</span>
        <IconOpenAI className="h-3 w-3" />
      </motion.div>
    </div>
  );
};

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
  // triple array untuk efek continuous scroll
  const doubled = [...logos, ...logos, ...logos];

  return (
    <div className="w-full mb-12">
      {/* desktop: scroll kanan→kiri */}
      <div className="hidden md:block relative overflow-hidden py-4 rounded-full">
        <div className="animate-marquee-slower flex">
          {doubled.map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-4 flex flex-col items-center group"
            >
              <div
                className="w-28 h-28 p-1 bg-white rounded-full shadow-md flex items-center justify-center
                              group-hover:shadow-lg group-hover:scale-105 transition-all duration-300"
              >
                <Image
                  src={logo.src || '/placeholder.svg'}
                  alt={logo.alt}
                  width={100}
                  height={100}
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

      {/* mobile: scroll kiri→kanan */}
      <div className="md:hidden relative overflow-hidden py-3 rounded-full">
        <div className="animate-marquee-reverse flex">
          {doubled.map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-3 flex flex-col items-center group"
            >
              <div
                className="w-20 h-20 p-2 bg-white rounded-full shadow-md flex items-center justify-center
                              group-hover:shadow-lg group-hover:scale-105 transition-all duration-300"
              >
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
const handleClick = () => {
  const el = document.getElementById('tryout');
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

const CTAButton: React.FC<{ onClick?: () => void }> = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.7 }}
    className="w-full flex justify-center mb-6"
  >
    <PulsatingButton
      onClick={handleClick}
      aria-label="Coba Try Out Sekarang"
      tabIndex={0}
    >
      Coba Try Out Sekarang!
    </PulsatingButton>
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

const MobileVideoMockup: React.FC = () => {
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
      { threshold: 0.1, rootMargin: '50px' },
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
        video.playbackRate = 2;
        video.play().catch(console.error);
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });
    }
  }, [isInView, isLoaded]);

  return (
    <IPhoneFrame>
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster={MobilePoster.src}
          aria-label="Bimbelio mobile app demonstration"
        >
          <source
            src="/hero/bimbelio-mobile.webm"
            type="video/webm"
          />
        </video>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>
    </IPhoneFrame>
  );
};

const DesktopVideoMockup: React.FC = () => {
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
      { threshold: 0.1, rootMargin: '50px' },
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
        video.playbackRate = 2;
        video.play().catch(console.error);
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });
    }
  }, [isInView, isLoaded]);

  return (
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
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          preload="none"
          poster={DesktopPoster.src}
          aria-label="Bimbelio desktop website demonstration"
        >
          <source
            src="/hero/bimbelio.webm"
            type="video/webm"
          />
        </video>
      </div>
    </div>
  );
};

export default HeroSection;
