'use client';
import Footer from '@/components/_shared/footer';
import HeroSection from '@/components/_shared/homepage/hero';
import LearningRevolutions from '@/components/_shared/homepage/learning-revolutions';
import Testimoni from '@/components/_shared/homepage/testimoni';
import Tryout from '@/components/_shared/homepage/tryout';
import WhyUs from '@/components/_shared/homepage/why-us';

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
          <Tryout />
          <LearningRevolutions />
          <WhyUs />
          <Testimoni />
          <Footer />
        </div>
      </div>
    </div>
  );
}
