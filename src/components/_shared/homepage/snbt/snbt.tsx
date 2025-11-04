'use client';
import Footer from '@/components/_shared/footer';
import HeroSection from '../home/01-hero-section';
import ProblemSection from '../home/02-problem-section';
import SolutionSection from '../home/03-solution-section';
import ProgramsSection from '../home/04-programs-section';
import EcosystemSection from '../home/05-ecosystem-section';
import TutorsSection from '../home/06-tutors-section';
import PlanCards from '../home/07-plan-cards';
import TryoutSection from '../home/08-tryout-section';
import ComparisonSection from '../home/09-comparison-section';
import AddOnPremiumSection from '../home/10-addon-premium-section';
import FaqSimpleSection from '../home/11-faq-section';
import BentoGrid from './10-bento-grid';
import WhyUs from './10-why-us';
import BlueprintConcept from './11-blueprint-concept';
import FaqSection from './13-faq-section';
import Testimoni from './testimoni';

export default function SNBT() {
  return (
    <div
      id="homepage"
      className="relative bg-bg-workspace"
    >
      <div className="absolute top-0 -z-10 h-full w-full bg-white">
        <div className="absolute bottom-auto left-auto right-32 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(109,244,152,0.53)] opacity-60 blur-[80px]" />
      </div>
      <div className="min-h-screen">
        <div className="flex w-full flex-col gap-20">
          {/* <h1 className="text-center mt-40 text-xl font-medium">SNBT</h1> */}
          <HeroSection />
          <ProblemSection />
          <SolutionSection />
          <PlanCards />
          <ProgramsSection />
          <ComparisonSection />
          <TutorsSection />
          <TryoutSection />
          <BentoGrid />
          <BlueprintConcept />
          <WhyUs />
          <Testimoni />
          <FaqSimpleSection />
          <EcosystemSection />
          <AddOnPremiumSection />
          <FaqSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
