'use client';
import HeroSection from '@/components/_shared/homepage/home/01-hero-section';
import dynamic from 'next/dynamic';

// Lazy load sections below the fold untuk optimasi performance
const ProblemSection = dynamic(
  () => import('@/components/_shared/homepage/home/02-problem-section'),
  { loading: () => <div className="min-h-[400px]" /> },
);

const SolutionSection = dynamic(
  () => import('@/components/_shared/homepage/home/03-solution-section'),
  { loading: () => <div className="min-h-[400px]" /> },
);

const ProgramsSection = dynamic(
  () => import('@/components/_shared/homepage/home/04-programs-section'),
  { loading: () => <div className="min-h-[400px]" /> },
);

const EcosystemSection = dynamic(
  () => import('@/components/_shared/homepage/home/05-ecosystem-section'),
  { loading: () => <div className="min-h-[400px]" /> },
);

const TutorsSection = dynamic(
  () => import('@/components/_shared/homepage/home/06-tutors-section'),
  { loading: () => <div className="min-h-[400px]" /> },
);

const PlanCardsSection = dynamic(
  () => import('@/components/_shared/homepage/home/07-plan-cards'),
  { loading: () => <div className="min-h-[400px]" /> },
);

const TryoutSection = dynamic(
  () => import('@/components/_shared/homepage/home/08-tryout-section'),
  { loading: () => <div className="min-h-[400px]" /> },
);

const ComparisonSection = dynamic(
  () => import('@/components/_shared/homepage/home/09-comparison-section'),
  { loading: () => <div className="min-h-[400px]" /> },
);

const FaqSection = dynamic(
  () => import('@/components/_shared/homepage/home/11-faq-section'),
  { loading: () => <div className="min-h-[400px]" /> },
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
          <EcosystemSection />

          {/* 06 Tutors section */}
          <TutorsSection />

          {/* 08 Plan Cards section */}
          <PlanCardsSection />

          {/* 09 Tryout section */}
          <TryoutSection />

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
