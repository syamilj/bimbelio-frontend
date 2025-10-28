'use client';
import Footer from '@/components/_shared/footer';
import HeroSection from '@/components/_shared/homepage/home/01-hero-section';
import ProblemSection from '@/components/_shared/homepage/home/02-problem-section';
import PlanCardsSection from '@/components/_shared/homepage/home/03-plan-cards';
import TryoutSection from '@/components/_shared/homepage/home/04-tryout-section';
import BentoGridSection from '@/components/_shared/homepage/home/05-bento-grid';
import BlueprintConceptSection from '@/components/_shared/homepage/home/06-blueprint-concept';
import WhyUsSection from '@/components/_shared/homepage/home/07-why-us';
import FaqSection from '@/components/_shared/homepage/home/08-faq-section';

export default function SNBT() {
  return (
    <div
      id="homepage"
      className="relative"
    >
      <div className="min-h-screen">
        <div className="flex w-full flex-col gap-20">
          {/* 01 Hero section loads immediately */}
          <HeroSection />

          {/* 02 Problem section */}
          <ProblemSection />

          {/* 03 Plan Cards section */}
          <PlanCardsSection />

          {/* 04 Tryout section */}
          <TryoutSection />

          {/* 05 Bento Grid section */}
          <BentoGridSection />

          {/* 06 Blueprint Concept section */}
          <BlueprintConceptSection />

          {/* 07 Why Us section */}
          <WhyUsSection />

          {/* 08 FAQ section */}
          <FaqSection />

          <Footer />
        </div>
      </div>
    </div>
  );
}
