'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { lazy, Suspense, useCallback, useState } from 'react';

// Lazy loading untuk dialog
const ConsultationDialog = lazy(
  () => import('@/components/_shared/contact/consultation-dialog'),
);

const HeroSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  const scrollToElement = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      <section
        id="hero"
        className="relative w-full overflow-hidden pt-12 md:pt-20 pb-16 md:pb-0"
      >
        {/* Background - Next Image for better mobile optimization */}
        <div className="absolute inset-0 z-0 min-h-[600px] md:min-h-[850px]">
          <Image
            src="/hero/hero-bg-web.webp"
            alt=""
            fill
            quality={50}
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-20 mx-auto flex max-w-2xl flex-col items-center text-center pt-24 md:pt-8 lg:pt-12 pb-16 md:pb-32 px-3 md:px-4">
          {/* Hero Heading Image - priority LCP */}
          <div className="w-full max-w-5xl mb-6 md:mb-10">
            <Image
              src="/hero/hero-heading.webp"
              alt="Bimbel AI untuk SNBT, Ujian Mandiri, KEDINASAN"
              width={672}
              height={443}
              priority
              quality={60}
              sizes="(max-width: 480px) 90vw, (max-width: 768px) 95vw, 672px"
              className="w-full h-auto"
              fetchPriority="high"
            />
          </div>

          {/* CTA Buttons */}
          <div className="w-full flex flex-col items-center gap-3 md:gap-4">
            {/* Primary CTA - Use Link instead of button+router */}
            <Link
              href="/price"
              className="flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg text-white"
              style={{ backgroundColor: mainColor }}
              prefetch={false}
            >
              <span>Mulai Sekarang!</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>

            {/* Secondary CTAs - simplified for mobile */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <a
                href="https://www.bimbelio.com/link/komunitas"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white group hover:brightness-110 transition-all shadow-md"
                style={{ backgroundColor: mainColor }}
              >
                Komunitas
                <div className="absolute -top-3 -right-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  </span>
                  <span className="absolute top-0 right-0 transform rotate-12 bg-yellow-400 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 border border-yellow-500">
                    Gratis
                  </span>
                </div>
              </a>

              <a
                href="#tryout"
                onClick={(e) => scrollToElement(e, 'tryout')}
                className="relative inline-flex items-center px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white group hover:brightness-110 transition-all shadow-md"
                style={{ backgroundColor: mainColor }}
              >
                Try Out
                <div className="absolute -top-3 -right-3">
                  <span className="absolute top-0 right-0 transform rotate-12 bg-yellow-400 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 border border-yellow-500">
                    Gratis
                  </span>
                </div>
              </a>

              <a
                href="#live-learning"
                onClick={(e) => scrollToElement(e, 'live-learning')}
                className="relative inline-flex items-center px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white group hover:brightness-110 transition-all shadow-md"
                style={{ backgroundColor: mainColor }}
              >
                BimLive
                <div className="absolute -top-3 -right-3">
                  <span className="absolute top-0 right-0 transform rotate-12 bg-yellow-400 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 border border-yellow-500">
                    Gratis
                  </span>
                </div>
              </a>
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
