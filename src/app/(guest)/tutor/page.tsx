'use client';

import TutorGridSection from '@/app/(guest)/tutor/_components/tutor-grid';
import Footer from '@/components/_shared/footer';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { useRouter } from 'next/navigation';
import { lazy, Suspense } from 'react';

const BentoGrid = lazy(
  () => import('@/components/_shared/homepage/snbt/bento-grid'),
);
const BlueprintConcept = lazy(
  () => import('@/components/_shared/homepage/snbt/blueprint-concept'),
);
const FaqHomepage = lazy(
  () => import('@/components/_shared/homepage/snbt/FaqHomepage'),
);
const PlanCards = lazy(
  () => import('@/components/_shared/homepage/snbt/plan-cards'),
);
const Tryout = lazy(() => import('@/components/_shared/homepage/snbt/tryout'));
const WhyUs = lazy(() => import('@/components/_shared/homepage/snbt/why-us'));

export default function TutorPage() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#7C3AED';

  const handleConsultation = () => {
    router.push('/consultation');
  };

  return (
    <div
      id="tutor"
      className="relative bg-bg-workspace"
    >
      {/* Consistent background pattern seperti homepage */}
      <div className="absolute top-0 -z-10 h-full w-full">
        <div className="absolute bottom-auto left-auto right-32 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(109,244,152,0.53)] opacity-60 blur-[80px]" />
      </div>

      <div className="min-h-screen">
        <div className="flex w-full flex-col gap-20">
          {/* Tutor Cards Section */}
          <Suspense
            fallback={
              <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse mx-auto max-w-7xl" />
            }
          >
            <TutorGridSection />
          </Suspense>

          <Suspense
            fallback={
              <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse" />
            }
          >
            <PlanCards />
          </Suspense>

          <Suspense
            fallback={
              <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse" />
            }
          >
            <Tryout />
          </Suspense>

          <Suspense
            fallback={
              <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse" />
            }
          >
            <BentoGrid />
          </Suspense>

          <Suspense
            fallback={
              <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse" />
            }
          >
            <BlueprintConcept />
          </Suspense>

          <Footer />
        </div>
      </div>
    </div>
  );
}
