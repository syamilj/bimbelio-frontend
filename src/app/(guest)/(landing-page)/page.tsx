// index.tsx
// other imports remain unchanged
"use client";
import Footer from "@/components/_shared/footer";
import HeroSection from "@/components/_shared/homepage/hero";
import LearningRevolutions from "@/components/_shared/homepage/learning-revolutions";
import Tryout from "@/components/_shared/homepage/tryout";
import Navbar from "@/components/_shared/navbar";
import { Fragment, useEffect, useState } from "react";
// import LearningMaterials from '@/components/homepage/learning-materials';
import Login from "@/components/_shared/auth/login";
import SignUp from "@/components/_shared/auth/sign-up";
import CaraBelajarSection1 from "@/components/_shared/homepage/cara-belajar";
import Testimoni from "@/components/_shared/homepage/testimoni";
import WhyUs from "@/components/_shared/homepage/why-us";
import LayoutGuest from "@/components/layout/layoutGuest";
// import Pricing from '@/components/homepage/pricing';
// import Blog from '@/components/homepage/blog';
// import Invitation from '@/components/homepage/invitation';

interface auth {
  login: boolean;
  signUp: boolean;
}

export default function Home() {
  return (
    <LayoutGuest>
      <div id="homepage" className="relative bg-bg-workspace">
        <div className="absolute top-0 -z-10 h-full w-full bg-white">
          <div className="absolute bottom-auto left-auto right-32 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(109,244,152,0.53)] opacity-60 blur-[80px]" />
        </div>
        <div className="py-2">
          <div className="min-h-screen">
            {/* <div className="flex w-full flex-col gap-[5rem]">
              <HeroSection />
              <CaraBelajarSection1 />
              <Tryout />
              <LearningRevolutions />
              <WhyUs />
              <Testimoni />
              <Footer />
            </div> */}
          </div>
        </div>
      </div>
    </LayoutGuest>
  );
}
