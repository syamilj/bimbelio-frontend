'use client';
import Footer from '@/components/_shared/footer';
import BentoGrid from '@/components/_shared/homepage/snbt/bento-grid';
import BlueprintConcept from '@/components/_shared/homepage/snbt/blueprint-concept';
import FaqHomepage from '@/components/_shared/homepage/snbt/FaqHomepage';
import HeroSection from '@/components/_shared/homepage/snbt/hero';
import PlanCards from '@/components/_shared/homepage/snbt/plan-cards';
import Tryout from '@/components/_shared/homepage/snbt/tryout';
import WhyUs from '@/components/_shared/homepage/snbt/why-us';

export default function SNBT() {
  return (
    <div
      id="homepage"
      className="relative bg-bg-workspace"
    >
      <div className="absolute top-0 -z-10 h-full w-full">
        <div className="absolute bottom-auto left-auto right-32 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(109,244,152,0.53)] opacity-60 blur-[80px]" />
      </div>
      <div className="min-h-screen">
        <div className="flex w-full flex-col gap-20">
          {/* <h1 className="text-center mt-40 text-xl font-medium">SNBT</h1> */}
          <HeroSection />
          <PlanCards />
          <Tryout />
          <BentoGrid />
          <BlueprintConcept />
          <WhyUs />
          {/* <Testimoni /> */}
          <FaqHomepage />
          <Footer />
        </div>
      </div>
    </div>
  );
}
