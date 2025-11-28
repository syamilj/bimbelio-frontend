'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
// import { motion } from 'framer-motion';
import { ArrowRight, PhoneCallIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { lazy, Suspense, useState } from 'react';

// Import gambar hero
import HeroBgWeb from '@/../public/hero/hero-bg-web.webp';
import HeroHeadingWeb from '@/../public/hero/hero-heading-web.webp';

// Lazy loading untuk komponen berat
const ConsultationDialog = lazy(
  () => import('@/components/_shared/contact/consultation-dialog'),
);

// Component
const HeroSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get dynamic colors - gunakan default main landing page colors
  // websiteSubCategory akan null di main landing page
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color ?? '#5aa4dd';

  // Navigasi ke /price
  const handleCTAClick = () => {
    router.push('/price');
  };

  return (
    <>
      <div
        id="hero"
        className="relative w-full overflow-hidden pt-16 md:pt-20 pb-[100px] md:pb-0"
      >
        <div
          className="absolute block md:hidden left-0 right-0 h-[50px] z-[1] bottom-0"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.7) 70%, rgba(255, 255, 255, 1) 100%)',
          }}
        />
        {/* Background Image with responsive height - Mobile center position */}
        <div className="absolute inset-0 z-0 min-h-[850px]">
          <Image
            src={HeroBgWeb}
            alt="ALLPRINTS Hero Background"
            fill
            priority
            quality={30}
            fetchPriority="high"
            className="object-cover object-center md:object-center"
            placeholder="blur"
            sizes="100vw"
            style={{
              objectPosition: 'center center', // Mobile: center, Desktop: center
            }}
          />

          {/* Gradient Fade Out - MOBILE ONLY (Lebih Kuat & Terlihat) */}
          <div
            className="absolute inset-x-0 bottom-0 h-96 z-10 pointer-events-none md:hidden"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.25) 16%, rgba(255, 255, 255, 0.4) 24%, rgba(255, 255, 255, 0.55) 32%, rgba(255, 255, 255, 0.68) 40%, rgba(255, 255, 255, 0.78) 50%, rgba(255, 255, 255, 0.86) 60%, rgba(255, 255, 255, 0.92) 70%, rgba(255, 255, 255, 0.96) 80%, rgba(255, 255, 255, 0.99) 90%, rgba(255, 255, 255, 1) 100%)',
            }}
          />

          {/* Gradient Fade Out - DESKTOP ONLY (Subtle) */}
          <div
            className="absolute inset-x-0 bottom-0 h-72 z-10 pointer-events-none hidden md:block"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.25) 40%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0.75) 80%, rgba(255, 255, 255, 1) 100%)',
            }}
          />
        </div>

        {/* Main Content - Margin lebih kecil di mobile */}
        <div className="relative z-20 mx-auto flex max-w-2xl flex-col items-center text-center pt-36 md:pt-8 lg:pt-12 pb-24 md:pb-32">
          {/* Hero Heading - Image dengan Text Skeleton untuk SEO */}
          <div className="w-full max-w-5xl mb-6 md:mb-10 relative">
            {/* <div
              className={`bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 border-2 border-yellow-400/50 relative overflow-hidden transition-opacity duration-300 ${imageLoaded ? 'hidden' : 'block'}`}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #3b82f6 1px, transparent 1px), linear-gradient(-45deg, #3b82f6 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px',
                }}
              />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center justify-center gap-2 bg-blue-600 px-4 py-2 rounded-full">
                  <span className="text-sm font-bold text-white">
                    Active AI-Based Learning
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg">
                  <span className="text-yellow-400">ALL</span>
                  <span className="text-yellow-300">PRINTS</span>
                </h1>

                <p className="text-lg md:text-xl text-white font-semibold">
                  Satu Akun Untuk SNBT, Mandiri PTN & Kedinasan
                </p>

                <div className="bg-yellow-400 text-slate-900 rounded-xl px-6 py-4 font-bold text-center">
                  Pengajar 100% UI, UGM, ITB, & Juara OSN
                </div>
                <div className="bg-slate-700/50 border-2 border-yellow-400/30 rounded-xl p-6 space-y-3">
                  <div className="text-white">
                    <p className="text-sm font-semibold mb-2">Full timeline:</p>
                    <p className="text-base md:text-lg font-bold">
                      Core → Intensif → Super → Mandiri → Kedinasan
                    </p>
                  </div>
                  <div className="bg-yellow-400 text-slate-900 rounded-lg px-4 py-3 font-black text-center">
                    November 2025 - Agustus 2026
                  </div>
                </div>

                <div className="bg-blue-700/40 border-2 border-blue-400/50 rounded-lg px-4 py-3 text-center">
                  <p className="text-sm md:text-base text-white font-bold">
                    <span className="text-white font-black">
                      3-Layer Support:
                    </span>{' '}
                    <span className="italic">Tutor • Mentor • AI 24/7</span>
                  </p>
                </div>
              </div>
            </div> */}

            <Image
              src={HeroHeadingWeb}
              alt="Bimbel AI untuk SNBT, Ujian Mandiri, KEDINASAN"
              width={672}
              height={443}
              priority
              quality={60}
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="w-full h-auto"
              placeholder="blur"
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* CTA Buttons */}
          <div className="w-full flex flex-col items-center gap-3 md:gap-4">
            {/* Main CTA - Redesigned dengan warna gradient lebih menarik */}
            <button
              onClick={handleCTAClick}
              className="group relative flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg text-white shadow-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-white/20"
              style={{
                background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 50%, ${mainColor} 100%)`,
                boxShadow: `0 12px 48px -10px ${mainColor}70, 0 0 0 1px ${mainColor}30`,
              }}
            >
              {/* Animated gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${secondaryColor} 0%, ${mainColor} 100%)`,
                }}
              />

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <span className="relative z-10 tracking-wide">
                Mulai Sekarang!
              </span>
              <ArrowRight className="relative z-10 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>

            {/* Sub CTA Buttons - Redesigned dengan style modern */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-3 md:mt-4">
              <a
                href="https://www.bimbelio.com/l/wa-grup"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-2 px-5 md:px-6 py-3 md:py-3.5 rounded-xl text-xs md:text-sm font-bold text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-fit"
                style={{
                  background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
                  border: `2px solid ${mainColor}30`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Grup Belajar</span>
              </a>
              <div className="flex flex-col gap-4">
                <a
                  href="#try-out"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('tryout');
                    if (el) {
                      const top =
                        el.getBoundingClientRect().top +
                        window.pageYOffset -
                        100;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}
                  className="group relative flex items-center gap-2 px-5 md:px-6 py-3 md:py-3.5 rounded-xl text-xs md:text-sm font-bold text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
                    border: `2px solid ${mainColor}30`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Tryout Gratis</span>
                </a>
                <a
                  href="#live-learning"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('live-learning');
                    if (el) {
                      const top =
                        el.getBoundingClientRect().top +
                        window.pageYOffset -
                        100;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}
                  className="group relative flex items-center gap-2 px-5 md:px-6 py-3 md:py-3.5 rounded-xl text-xs md:text-sm font-bold text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
                    border: `2px solid ${mainColor}30`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Live Learning</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="group relative flex items-center gap-2 px-5 md:px-6 py-3 md:py-3.5 rounded-xl text-xs md:text-sm font-bold shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden h-fit"
                style={{
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: mainColor,
                  color: mainColor,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: mainColor }}
                />
                {/* Lazy-loaded dialog dengan Suspense wrapper */}
                <Suspense fallback={null}>
                  <ConsultationDialog
                    isOpen={isConsultationOpen}
                    onOpenChange={setIsConsultationOpen}
                  />
                </Suspense>
                <PhoneCallIcon className="relative z-10 w-3 h-3 md:w-4 md:h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10 font-black">Konsultasi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
export { HeroSection };
