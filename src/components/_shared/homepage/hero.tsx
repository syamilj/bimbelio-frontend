'use client';

import ImageHero from '@/_assets/homepage/hero/bg-hero.webp';
import MobilePoster from '@/_assets/homepage/hero/bimbelio-mobile.webp';
import DesktopPoster from '@/_assets/homepage/hero/bimbelio.webp';
import LogoIPDN from '@/_assets/homepage/hero/LOGO_KEDINASAN_IPDN.webp';
import LogoSTAN from '@/_assets/homepage/hero/LOGO_KEDINASAN_STAN.webp';
import LogoSTIS from '@/_assets/homepage/hero/LOGO_KEDINASAN_STIS.webp';
import LogoITB from '@/_assets/homepage/hero/LOGO_PTN_ITB.webp';
import LogoITS from '@/_assets/homepage/hero/LOGO_PTN_ITS.webp';
import LogoUGM from '@/_assets/homepage/hero/LOGO_PTN_UGM.webp';
import LogoUI from '@/_assets/homepage/hero/LOGO_PTN_UI.webp';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { IPhoneFrame } from '@/components/ui/iphone-frame';
import { cn } from '@/lib/utils';
import { IconOpenAI } from '@/styles/icon';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCw,
  Search,
  Star,
} from 'lucide-react';
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

// Simplified Constants
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
  { label: 'Siswa Aktif', value: '15,000+' },
  { label: 'Try Out Tersedia', value: '100+' },
];

// Component
const HeroSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [isMobile, setIsMobile] = useState(false);
  // STATE untuk defer / lazy rendering komponen non-kritis
  const [showLogos, setShowLogos] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Defer render LogoSection setelah idle untuk kurangi TBT awal
  useEffect(() => {
    const run = () => setShowLogos(true);
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(run, { timeout: 2000 });
      } else {
        setTimeout(run, 1200);
      }
    }
  }, []);

  // Video ditampilkan setelah user scroll pertama atau fallback timeout
  useEffect(() => {
    const reveal = () => setShowVideo(true);
    const onScroll = () => {
      reveal();
      window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { once: true });
    const t = setTimeout(reveal, 3000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(t);
    };
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

      {/* Background: jadikan lebih ringan & non-priority agar tidak rebut LCP */}
      <div className="absolute inset-0 z-1">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(ellipse at center, ${mainColor}20 0%, transparent 70%)`,
          }}
        />
        {/* Fix: Add relative positioning untuk parent dari Image dengan fill */}
        <div className="relative w-full h-full">
          <Image
            src={ImageHero || '/placeholder.svg'}
            alt="Background dekoratif"
            fill
            className="object-cover opacity-5"
            // hilangkan priority agar LCP fokus ke poster utama
            loading="lazy"
            sizes="100vw"
            style={{ objectPosition: 'center top' }}
          />
        </div>
      </div>

      {/* Main Content - Ultra  Layout */}
      <div className="relative z-30 mx-auto flex max-w-6xl flex-col items-center px-4 text-center pb-16">
        {/* LCP IMAGE: Poster utama sesuai device */}
        <div className="mb-10 relative w-full max-w-3xl mx-auto">
          <Image
            src={isMobile ? MobilePoster : DesktopPoster}
            alt="Bimbelio Adaptive Learning"
            priority
            width={isMobile ? 560 : 960}
            height={isMobile ? 560 : 540}
            className="w-full h-auto object-contain mx-auto"
            sizes="(max-width:768px) 90vw, 960px"
          />
        </div>

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
          mainColor={mainColor}
          secondaryColor={secondaryColor}
        />
        {showLogos && (
          <LogoSection
            logos={LOGOS}
            mainColor={mainColor}
          />
        )}
        {showVideo && <VideoSection isMobile={isMobile} />}
      </div>
    </div>
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
  `}</style>
);

//  Brand Section
const BrandSection: React.FC<{ mainColor: string }> = () => (
  <div className="flex mt-4 mb-6 flex-col items-center">
    <div className="flex items-center gap-2 text-gray-600 text-sm bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
      <span>Powered by</span>
      <IconOpenAI className="h-4 w-4" />
    </div>
  </div>
);

//  Heading Section - Much simpler
const HeadingSection: React.FC<{
  mainColor: string;
  secondaryColor: string;
}> = ({ mainColor, secondaryColor }) => (
  <div className="mb-16 space-y-8 max-w-4xl">
    {/* Main heading -  and powerful */}
    <div className="space-y-6">
      <h1 className="text-center font-black leading-tight relative text-6xl">
        {/* Baris 1: LOLOS PTN & */}
        <div className="flex justify-center items-center gap-3 flex-wrap">
          <span className="text-gray-900">LOLOS</span>
          <SparklesText sparklesCount={6}>
            <span className="text-white bg-clip-padding px-1 rounded-lg bg-main-default">
              PTN
            </span>
          </SparklesText>
          <span className="text-gray-900">&</span>
        </div>
        {/* Baris 2: .Pasti. Kedinasan */}
        <div className="flex justify-center items-center gap-3 mt-4 flex-wrap">
          <SparklesText sparklesCount={6}>
            <span className="text-white bg-clip-padding px-1 rounded-lg bg-main-default">
              Kedinasan.
            </span>
          </SparklesText>
          <span className="text-gray-900"> Pasti.</span>
        </div>
      </h1>

      <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed">
        Raih impianmu dengan Adaptive-AI terdepan di Indonesia
      </p>
    </div>

    {/*  feature pills */}
    {/* <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="flex flex-wrap justify-center gap-3"
    >
      {[
        { icon: <Sparkles className="w-4 h-4" />, text: 'AI Powered' },
        { icon: <Users className="w-4 h-4" />, text: '15K+ Students' },
        { icon: <TrendingUp className="w-4 h-4" />, text: '95% Success' },
        { icon: <Award className="w-4 h-4" />, text: 'Top Rated' },
      ].map((pill, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border"
          style={
            {
              borderColor: `${mainColor} ${secondaryColor}`,
            } as React.CSSProperties
          }
        >
          <div style={{ color: mainColor }}>{pill.icon}</div>
          <span className="font-medium text-gray-700 text-sm">{pill.text}</span>
        </div>
      ))}
    </motion.div> */}
  </div>
);

//  Stats Section
const StatsSection: React.FC<{
  stats: Stat[];
  mainColor: string;
}> = ({ stats, mainColor }) => (
  <div className="grid grid-cols-3 gap-8 mb-16 max-w-2xl w-full">
    {stats.map((stat, i) => (
      <div
        key={i}
        className="text-center"
      >
        <div className="text-3xl md:text-4xl font-black mb-2 text-main-default">
          {stat.value}
        </div>
        <div className="text-sm md:text-base font-medium text-gray-600">
          {stat.label}
        </div>
      </div>
    ))}
  </div>
);

//  Logo Section
const LogoSection: React.FC<{
  logos: Logo[];
  mainColor: string;
}> = ({ logos, mainColor }) => {
  const doubled = [...logos, ...logos];

  return (
    <div className="w-full mb-16 transition-opacity duration-500">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Destinasi Impian Para Juara
        </h3>
        <p className="text-gray-600">
          Alumni berhasil diterima di universitas terbaik
        </p>
      </div>

      {/*  logo slider */}
      <div className="relative overflow-hidden py-4 rounded-2xl">
        <div className="animate-smooth-marquee flex">
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
                />
              </div>
              <span className="text-sm font-semibold mt-3 text-main-default">
                {logo.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

//  CTA Section
const CTASection: React.FC<{
  onClick?: () => void;
  mainColor: string;
  secondaryColor: string;
}> = ({ onClick, mainColor, secondaryColor }) => (
  <div className="w-full flex flex-col items-center mb-16 space-y-6">
    {/* Main CTA */}
    <button
      onClick={onClick}
      className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg transition-all duration-300 bg-main-default hover:scale-[1.02] active:scale-95"
      style={
        {
          // background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }
      }
    >
      <Play className="w-5 h-5" />
      <span>Mulai Try Out GRATIS</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>

    {/* Trust indicators */}
    <div className="flex items-center gap-6 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold bg-main-default"
            >
              <Star className="w-3 h-3" />
            </div>
          ))}
        </div>
        <span className="font-medium">15,000+ siswa</span>
      </div>

      <div className="w-px h-4 bg-gray-300" />

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="font-medium">100% Gratis</span>
      </div>

      <div className="w-px h-4 bg-gray-300" />

      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">4.9/5 rating</span>
      </div>
    </div>
  </div>
);

//  Video Section
const VideoSection: React.FC<{ isMobile: boolean }> = ({ isMobile }) => (
  <div
    className={cn(
      'relative mx-auto transition-opacity duration-700',
      isMobile ? 'w-[280px] h-[500px]' : 'w-[900px] h-[506px]',
    )}
  >
    {isMobile ? <MobileVideo /> : <DesktopVideo />}
  </div>
);

//  Mobile Video
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
      { threshold: 0.1 },
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
          >
            <source
              src="/hero/bimbelio-mobile.webm"
              type="video/webm"
            />
          </video>
        </div>
      </IPhoneFrame>
    </div>
  );
};

//  Desktop Video
const DesktopVideo: React.FC = () => {
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
      { threshold: 0.1 },
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
    <div className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden bg-white">
      <div className="flex flex-col w-full h-full">
        {/*  browser bar */}
        <div className="flex items-center bg-gray-50 px-4 py-3 border-b">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex space-x-2 mr-4 text-gray-400">
            <ChevronLeft className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <RotateCw className="w-4 h-4" />
          </div>
          <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 text-sm border">
            <Search className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-600">bimbelio.com</span>
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
