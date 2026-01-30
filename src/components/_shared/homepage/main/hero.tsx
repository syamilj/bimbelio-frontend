'use client';

import ImageHero from '@/_assets/homepage/hero/bg-hero.webp';
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
import { usePathname, useRouter } from 'next/navigation';
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
  { label: 'Blueprint Users', value: '15,000+' },
  { label: 'Score Improvement', value: '+200' },
  { label: 'Blueprint Success', value: '97%' },
];

// Component
const HeroSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadBg, setShouldLoadBg] = useState(false);
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
    useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  // Get dynamic colors
  const pathname = usePathname();

  // Get dynamic colors
  const isMainLandingPage = pathname === '/';
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

  // Lazy load background after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadBg(true);
    }, 1500); // Delay 1.5 detik untuk prioritaskan konten utama

    return () => clearTimeout(timer);
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

        {/* Ultra  Background */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-1"
        >
          {/* Lazy loaded background image */}
          {shouldLoadBg && (
            <div className="relative w-full h-full">
              <Image
                src={ImageHero || '/placeholder.svg'}
                alt="University Buildings Background"
                fill
                loading="lazy"
                sizes="100vw"
                className={`
                  object-contain scale-200 object-[center_35%]          /* mobile */
                  md:object-contain md:object-[center_top] md:scale-100  /* desktop sama seperti sebelumnya */
                  transition-opacity duration-700 ease-in-out
                  ${shouldLoadBg ? 'opacity-100' : 'opacity-0'}
                `}
              />
            </div>
          )}
        </motion.div>

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
              <div className="w-full h-96 bg-gray-100 rounded-3xl animate-pulse" />
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
            showDiscordOption={false}
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
const BrandSection: React.FC<{ mainColor: string }> = ({ mainColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex mt-16 mb-8 flex-col items-center"
    >
      {/*  badge */}

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
          Bimbelio: Bimbel AI untuk PTN dan Kedinasan
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
  <div className="mb-16 space-y-8 max-w-4xl">
    {/* Main heading -  and powerful */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-center font-black leading-tight relative text-4xl sm:text-5xl">
        {/* Baris 1: Blueprint */}
        <div className="flex justify-center items-center gap-3 flex-wrap">
          <span className="text-gray-900">Sistem Belajar</span>
        </div>
        {/* Baris 2: Sistem Belajar */}
        <div className="flex justify-center items-center px-4 mt-4 md:mt-6">
          <span
            className={cn(
              'text-white text-center px-3 py-2 rounded-3xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight shadow-lg transition-all duration-300',
              !colorsLoaded && 'bg-blue-500',
            )}
            style={
              colorsLoaded
                ? {
                    backgroundColor: mainColor,
                  }
                : {}
            }
          >
            Blueprint TKA & UTBK
          </span>
        </div>
        {/* Baris 3: Pasti Naik 200+ Poin! */}
        <div className="flex justify-center items-center gap-3 mt-4 flex-wrap text-4xl sm:text-5xl">
          <span
            className={cn(
              'font-black transition-all duration-300',
              colorsLoaded ? 'bg-clip-text text-transparent' : 'text-blue-600',
            )}
            style={
              colorsLoaded
                ? {
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor || mainColor}aa)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                : {}
            }
          >
            Pasti Naik 200+ Poin!
          </span>
        </div>
      </h1>

      {/* Penjelasan goal - versi mobile dan desktop */}
      <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed">
        {typeof window !== 'undefined' && window.innerWidth < 768 ? (
          // Mobile: Gabungkan kedua tulisan
          <>
            <span
              className={cn(
                'font-bold transition-colors duration-300',
                !colorsLoaded && 'text-blue-600',
              )}
              style={colorsLoaded ? { color: mainColor } : {}}
            >
              Goal kita jelas:
            </span>{' '}
            bantu kamu naik minimal 200 poin dari hasil tes awal.{' '}
            <span
              className={cn(
                'font-bold transition-colors duration-300',
                !colorsLoaded && 'text-blue-500',
              )}
              style={colorsLoaded ? { color: secondaryColor || mainColor } : {}}
            >
              Bukan sekadar janji motivasi
            </span>
            , tapi sistem yang terukur!
          </>
        ) : (
          // Desktop: Pisahkan dengan <br />
          <>
            <span
              className={cn(
                'font-bold transition-colors duration-300',
                !colorsLoaded && 'text-blue-600',
              )}
              style={colorsLoaded ? { color: mainColor } : {}}
            >
              Goal kita jelas:
            </span>{' '}
            bantu kamu naik minimal 200 poin dari hasil tes awal.
            <br />
            <span
              className={cn(
                'font-bold transition-colors duration-300',
                !colorsLoaded && 'text-blue-500',
              )}
              style={colorsLoaded ? { color: secondaryColor || mainColor } : {}}
            >
              Bukan sekadar janji motivasi
            </span>
            , tapi sistem yang terukur!
          </>
        )}
      </p>
    </motion.div>

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
// Stats Section dengan badge fitur tambahan
// Stats Section dengan badge fitur + ikon
// StatsSection dengan desain lebih menarik & interaktif
const StatsSection: React.FC<{
  stats: Stat[];
  mainColor: string;
}> = ({ stats = STATS, mainColor }) => (
  <div className="flex flex-col items-center mb-16 w-full">
    {/* Stat utama */}

    {/* Badge fitur dengan ikon */}
    <div className="flex flex-wrap justify-center gap-4">
      {[
        'Pretest',
        'Uji Progress',
        'Try Out',
        'Liveclass',
        'AI',
        'SMART Goals',
      ].map((badge, idx) => (
        <motion.span
          key={badge}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
          className="flex shadow items-center px-5 py-2 rounded-full font-semibold text-sm bg-white/50 hover:scale-105 transition-transform cursor-pointer"
          style={{
            borderColor: mainColor,
            color: mainColor,
          }}
        >
          <span
            className="rounded-full"
            style={{ color: mainColor }}
          >
            {BADGE_ICONS[badge]}
          </span>
          {badge}
        </motion.span>
      ))}
    </div>
  </div>
);

//  Logo Section dengan Lazy Loading yang Super Optimized
// const LogoSection: React.FC<{
//   logos: Logo[];
//   mainColor: string;
// }> = ({ logos, mainColor }) => {
//   const [isInView, setIsInView] = useState(false);
//   const [shouldRender, setShouldRender] = useState(false);
//   const logoSectionRef = useRef<HTMLDivElement>(null);
//   const doubled = [...logos, ...logos];

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsInView(true);
//           // Delay rendering sedikit setelah masuk viewport untuk smooth loading
//           setTimeout(() => setShouldRender(true), 300);
//           observer.disconnect();
//         }
//       },
//       {
//         threshold: 0.1,
//         rootMargin: '150px 0px', // Load 150px sebelum masuk viewport
//       },
//     );

//     if (logoSectionRef.current) {
//       observer.observe(logoSectionRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div
//       ref={logoSectionRef}
//       className="w-full mb-16"
//     >
//       {isInView && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="text-center mb-8"
//         >
//           <h3 className="text-2xl font-bold text-gray-900 mb-2">
//             Target PTN Idaman
//           </h3>
//           <p className="text-gray-600">
//             PTN impian yang dicapai karena sistem udah terbukti work!
//           </p>
//         </motion.div>
//       )}

//       {/* Placeholder height untuk mencegah layout shift */}
//       <div className="relative overflow-hidden py-4 rounded-3xl min-h-[120px]">
//         {shouldRender ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="animate-smooth-marquee flex"
//           >
//             {doubled.map((logo, i) => (
//               <div
//                 key={i}
//                 className="shrink-0 mx-8 flex flex-col items-center group"
//               >
//                 <div className="w-24 h-24 p-2 bg-white rounded-full shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
//                   <Image
//                     src={logo.src || '/placeholder.svg'}
//                     alt={logo.alt}
//                     width={80}
//                     height={80}
//                     className="w-20 h-20 object-cover rounded-full"
//                     loading="lazy"
//                     priority={false}
//                   />
//                 </div>
//                 <span className="text-sm font-semibold mt-3 text-main-default">
//                   {logo.label}
//                 </span>
//               </div>
//             ))}
//           </motion.div>
//         ) : (
//           // Ultra minimal loading skeleton
//           <div className="flex animate-pulse">
//             {Array.from({ length: 7 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="shrink-0 mx-8 flex flex-col items-center"
//               >
//                 <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
//                 <div className="w-8 h-3 bg-gray-200 rounded mt-3"></div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

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
        className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg text-white shadow-xl transition-all duration-300 cursor-pointer"
        style={{
          background: `linear-gradient(90deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
          boxShadow: `0 4px 24px 0 ${mainColor}33`,
        }}
      >
        <Play className="w-5 h-5 animate-gentle-float" />
        <span>Mulai Blueprint 200+ Poin</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
      </motion.button>

      {/* Sub CTA Buttons */}
      <div className="flex justify-center mt-2">
        <a
          href="https://www.bimbelio.com/link/komunitas"
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
    <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-white">
      <div className="flex flex-col w-full h-full">
        {/* Optimized browser bar dengan lazy loading icons */}
        {showBrowserBar && (
          <div className="flex items-center bg-gray-50 px-4 py-3 border-b">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex space-x-2 mr-4 text-gray-400">
              <Suspense
                fallback={<div className="w-4 h-4 bg-gray-200 rounded" />}
              >
                <ChevronLeft className="w-4 h-4" />
                <ChevronRight className="w-4 h-4" />
                <RotateCw className="w-4 h-4" />
              </Suspense>
            </div>
            <div className="flex-1 flex items-center bg-white rounded-3xl px-3 py-2 text-sm border">
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
