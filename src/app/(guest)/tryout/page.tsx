'use client';

import Footer from '@/components/_shared/footer';
import { lazy, Suspense } from 'react';

const Tryout = lazy(() => import('@/components/_shared/homepage/main/tryout'));

export default function TryoutPage() {
  return (
    <div
      id="tryout"
      className="relative bg-bg-workspace"
    >
      {/* Consistent background pattern seperti homepage */}
      <div className="absolute top-0 -z-10 h-full w-full">
        <div className="absolute bottom-auto left-auto right-32 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(109,244,152,0.53)] opacity-60 blur-[80px]" />
      </div>

      <div className="min-h-screen">
        <div className="flex w-full flex-col gap-20">
          <Suspense
            fallback={
              <div className="w-full h-64 bg-gray-100 rounded-3xl animate-pulse" />
            }
          >
            <Tryout />
          </Suspense>

          <Footer />
        </div>
      </div>
    </div>
  );
}
