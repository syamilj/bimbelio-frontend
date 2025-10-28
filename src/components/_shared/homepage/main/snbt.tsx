'use client';
import Footer from '@/components/_shared/footer';
import BentoGrid from './bento-grid';
import BlueprintConcept from './blueprint-concept';
import FaqHomepage from './FaqHomepage';
import HeroSection from './hero';
import Testimoni from './testimoni';
import Tryout from './tryout';
import WhyUs from './why-us';

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
