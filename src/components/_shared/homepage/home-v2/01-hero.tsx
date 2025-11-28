'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { ArrowRight, Phone } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { lazy, Suspense, useState } from 'react';

// Import gambar hero
import HeroBgWeb from '@/../public/hero/hero-bg-web.webp';
import HeroHeadingWeb from '@/../public/hero/hero-heading-web.webp';

// Lazy loading untuk dialog
const ConsultationDialog = lazy(
  () => import('@/components/_shared/contact/consultation-dialog'),
);

const HeroSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  const handleCTAClick = () => {
    router.push('/price');
  };

  const scrollToTryout = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('tryout');
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section
        id="hero"
        className="relative w-full overflow-hidden pt-16 md:pt-20 pb-24 md:pb-0"
      >
        {/* Fade overlay mobile */}
        <div className="absolute block md:hidden left-0 right-0 h-12 z-[1] bottom-0 bg-gradient-to-b from-transparent to-white" />

        {/* Background Image */}
        <div className="absolute inset-0 z-0 min-h-[850px]">
          <Image
            src={HeroBgWeb}
            alt="Hero Background"
            fill
            priority
            quality={30}
            fetchPriority="high"
            className="object-cover object-center"
            placeholder="blur"
            sizes="100vw"
          />

          {/* Gradient fade - Mobile */}
          <div className="absolute inset-x-0 bottom-0 h-80 z-10 pointer-events-none md:hidden bg-gradient-to-b from-transparent via-white/70 to-white" />

          {/* Gradient fade - Desktop */}
          <div className="absolute inset-x-0 bottom-0 h-64 z-10 pointer-events-none hidden md:block bg-gradient-to-b from-transparent via-white/50 to-white" />
        </div>

        {/* Main Content */}
        <div className="relative z-20 mx-auto flex max-w-2xl flex-col items-center text-center pt-36 md:pt-8 lg:pt-12 pb-24 md:pb-32 px-4">
          {/* Hero Heading Image */}
          <div className="w-full max-w-5xl mb-8 md:mb-10">
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
            />
          </div>

          {/* CTA Buttons */}
          <div className="w-full flex flex-col items-center gap-4">
            {/* Primary CTA */}
            <button
              onClick={handleCTAClick}
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base md:text-lg text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: mainColor }}
            >
              <span>Mulai Sekarang!</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            {/* Secondary CTAs */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <a
                href="https://www.bimbelio.com/l/wa-grup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: mainColor }}
              >
                Grup Belajar
              </a>

              <a
                href="#try-out"
                onClick={scrollToTryout}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: mainColor }}
              >
                Tryout Gratis
              </a>

              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-white border-2 transition-all duration-200 hover:bg-gray-50"
                style={{ borderColor: mainColor, color: mainColor }}
              >
                <Phone className="w-4 h-4" />
                <span>Konsultasi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Consultation Dialog */}
        <Suspense fallback={null}>
          {isConsultationOpen && (
            <ConsultationDialog
              isOpen={isConsultationOpen}
              onOpenChange={setIsConsultationOpen}
            />
          )}
        </Suspense>
      </section>
    </>
  );
};

export default HeroSection;
export { HeroSection };
