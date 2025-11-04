'use client';

import Footer from '@/components/_shared/footer';
import TutorGridSection from '@/components/_shared/homepage/main/tutor-grid';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

export default function TutorPage() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();

  return null;

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

          <Footer />
        </div>
      </div>
    </div>
  );
}
