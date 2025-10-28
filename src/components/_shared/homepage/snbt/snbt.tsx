'use client';
import Footer from '@/components/_shared/footer';
import BentoGrid from '../home/bento-grid';
import BlueprintConcept from '../home/blueprint-concept';
import FaqHomepage from '../home/FaqHomepage';
import HeroSection from '../home/hero';
import Tryout from '../home/tryout';
import WhyUs from '../home/why-us';
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
          <BentoGrid />
          <BlueprintConcept />
          <Tryout />
          <WhyUs />
          <Testimoni />
          <FaqHomepage />
          <Footer />
        </div>
      </div>
    </div>
  );
}
