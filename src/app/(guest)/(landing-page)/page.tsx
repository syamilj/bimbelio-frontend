'use client';

import HeroSection from '@/components/_shared/homepage/home-v2/01-hero';
import dynamic from 'next/dynamic';

// TIER 2: SSR = true (Above fold, important for initial render)
const AboutSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/02-about'),
  { ssr: true, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 2: SSR = true (Statistics - builds urgency)
const StatisticsSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/03-statistics'),
  { ssr: true, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 2: SSR = true (Support layers - key value prop)
const LayersSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/04-layers'),
  { ssr: true, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Timeline - below fold)
const TimelineSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/05-timeline'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Ecosystem - New Section)
const EcosystemSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/04-ecosystem'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Product Carousel - New Section)
// const ProductCarouselSection = dynamic(
//   () => import('@/components/_shared/homepage/home-v2/05b-product-carousel'),
//   { ssr: false, loading: () => <div className="min-h-[400px]" /> },
// );

// TIER 3: SSR = false (Features - below fold)
const FeaturesSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/06-features'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Comparison - below fold)
const ComparisonSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/07-comparison'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Pricing - heavy component)
const PricingSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/08-pricing'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Tryout - below fold)
const TryoutSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/09-tryout'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Live Class - heavy component)
const LiveClassSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/10-liveclass'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (FAQ - interactive accordion)
const FaqSection = dynamic(
  () => import('@/components/_shared/homepage/home-v2/11-faq'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

export default function LandingPage() {
  return (
    <div
      id="homepage"
      className="relative bg-white"
    >
      <div className="min-h-screen">
        <div className="flex w-full flex-col gap-20">
          {/* 01 Hero - Masuk PTN Impian */}
          <HeroSection />

          {/* 02 About - Validasi Pain Point */}
          <AboutSection />

          {/* 03 Statistics - Data Kompetisi */}
          <StatisticsSection />

          {/* 04 Layers - 3-Layer Support */}
          <LayersSection />

          {/* 05 Timeline - Roadmap Perjalanan */}
          <TimelineSection />

          {/* 05b - Ecosystem - Integrasi Platform */}
          <EcosystemSection />

          {/* 05c - Product Carousel - Program Jualan */}
          {/* <ProductCarouselSection /> */}

          {/* 06 Features - Fitur Platform */}
          <FeaturesSection />

          {/* 07 Comparison - Banding Kompetitor */}
          <ComparisonSection />

          {/* 08 Pricing - Harga Paket */}
          <PricingSection />

          {/* 09 Tryout - Bonus Try Out */}
          <TryoutSection />

          {/* 10 Live Class - Kelas Live */}
          <LiveClassSection />

          {/* 11 FAQ - Jawab Keraguan */}
          <FaqSection />
        </div>
      </div>
    </div>
  );
}
