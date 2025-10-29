'use client';
import Footer from '@/components/_shared/footer';
import HeroSection from '@/components/_shared/homepage/home/01-hero-section';
import ProblemSection from '@/components/_shared/homepage/home/02-problem-section';
import SolutionSection from '@/components/_shared/homepage/home/03-solution-section';
import ProgramsSection from '@/components/_shared/homepage/home/04-programs-section';
import EcosystemSection from '@/components/_shared/homepage/home/05-ecosystem-section';
import TutorsSection from '@/components/_shared/homepage/home/06-tutors-section';
import MentorAISection from '@/components/_shared/homepage/home/07-mentor-ai-section';
import PlanCardsSection from '@/components/_shared/homepage/home/08-plan-cards';
import TryoutSection from '@/components/_shared/homepage/home/09-tryout-section';
import ComparisonSection from '@/components/_shared/homepage/home/10-comparison-section';
import FaqSection from '@/components/_shared/homepage/home/12-faq-section';

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

          {/* 07 Mentor AI section */}
          <MentorAISection />

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
          <Footer />
        </div>
      </div>
    </div>
  );
}
