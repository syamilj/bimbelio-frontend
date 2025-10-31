'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { motion } from 'framer-motion';
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

  // Get dynamic colors
  // safe access to window to avoid potential SSR/undefined access
  const isMainLandingPage =
    typeof window !== 'undefined' && window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  // Navigasi ke /price
  const handleCTAClick = () => {
    router.push('/price');
  };

  return (
    <>
      <div
        id="hero"
        className="relative w-full overflow-hidden pt-16 md:pt-20"
      >
        {/* Background Image with responsive height - Mobile center position */}
        <div className="absolute inset-0 z-0 min-h-[850px]">
          <Image
            src={HeroBgWeb}
            alt="ALLPRINTS Hero Background"
            fill
            quality={95}
            className="object-cover object-center md:object-center"
            placeholder="blur"
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
          {/* Hero Heading Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-5xl mb-6 md:mb-10"
          >
            <Image
              src={HeroHeadingWeb}
              alt="ALLPRINTS - Satu Akun Untuk SNBT, Mandiri PTN & Kedinasan"
              width={1200}
              height={600}
              priority
              quality={95}
              className="w-full h-auto"
              placeholder="blur"
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full flex flex-col items-center gap-3 md:gap-4"
          >
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
                href="https://discord.com/invite/5Fy3fnVaE9"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-2 px-5 md:px-6 py-3 md:py-3.5 rounded-xl text-xs md:text-sm font-bold text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
                  border: `2px solid ${mainColor}30`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Grup Belajar</span>
              </a>
              <a
                href="#try-out"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('tryout');
                  if (el) {
                    const top =
                      el.getBoundingClientRect().top + window.pageYOffset - 100;
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
              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="group relative flex items-center gap-2 px-5 md:px-6 py-3 md:py-3.5 rounded-xl text-xs md:text-sm font-bold shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden"
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
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
export { HeroSection };
