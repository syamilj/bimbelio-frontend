'use client';

import dynamic from 'next/dynamic';
import HeroSection from '@/components/_shared/homepage/home/01-hero-section';

// TIER 2: SSR = true (Above fold, important for initial render)
const ProblemSection = dynamic(
  () => import('@/components/_shared/homepage/home/02-problem-section'),
  { ssr: true, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 2: SSR = true (Important section, keep on server)
const SolutionSection = dynamic(
  () => import('@/components/_shared/homepage/home/03-solution-section'),
  { ssr: true, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 2: SSR = true (Program showcase, pre-render on server)
const ProgramsSection = dynamic(
  () => import('@/components/_shared/homepage/home/04-programs-section'),
  { ssr: true, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Below fold, non-critical - defer to client)
// const EcosystemSection = dynamic(
//   () => import('@/components/_shared/homepage/home/05-ecosystem-section'),
//   { ssr: false, loading: () => <div className="min-h-[400px]" /> },
// );

// TIER 2: SSR = true (Tutors showcase - SEO important)
const TutorsSection = dynamic(
  () => import('@/components/_shared/homepage/home/06-tutors-section'),
  { ssr: true, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Pricing table - below fold, heavy)
const PlanCardsSection = dynamic(
  () => import('@/components/_shared/homepage/home/07-plan-cards'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Tryout section - heavy component, below fold)
const TryoutSection = dynamic(
  () => import('@/components/_shared/homepage/home/08-tryout-section'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

const LiveLearningSection = dynamic(
  () => import('@/components/_shared/homepage/home/08-live-learning-section'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (Comparison - non-critical, heavy)
const ComparisonSection = dynamic(
  () => import('@/components/_shared/homepage/home/09-comparison-section'),
  { ssr: false, loading: () => <div className="min-h-[400px]" /> },
);

// TIER 3: SSR = false (FAQ - interactive, client-side better)
const FaqSection = dynamic(
  () => import('@/components/_shared/homepage/home/11-faq-section'),
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
          {/* 01 Hero section */}
          <HeroSection />

          {/* 02 Problem section */}
          <ProblemSection />

          {/* 03 Solution section */}
          <SolutionSection />

          {/* 04 Programs section */}
          <ProgramsSection />

          {/* 05 Ecosystem section */}
          {/* <EcosystemSection /> */}

          {/* 06 Tutors section */}
          <TutorsSection />

          {/* 08 Plan Cards section */}
          <PlanCardsSection />

          {/* 09 Tryout section */}
          <TryoutSection />

          <LiveLearningSection />

          {/* 10 Comparison section */}
          <ComparisonSection />

          {/* 11 Add-On Premium section */}
          {/* <AddOnPremiumSection /> */}

          {/* 12 FAQ section */}
          <FaqSection />

          {/* 13 Footer */}
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}
