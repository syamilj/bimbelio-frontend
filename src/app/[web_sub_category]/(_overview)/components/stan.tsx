// 'use client';
// import Footer from '@/components/_shared/footer';
// import HeroSection from '@/components/_shared/homepage/home/hero';
// import { lazy, Suspense } from 'react';

// // Lazy loading untuk semua komponen homepage yang tidak immediately visible
// const BentoGrid = lazy(
//   () => import('@/components/_shared/homepage/home/bento-grid'),
// );
// const BlueprintConcept = lazy(
//   () => import('@/components/_shared/homepage/home/blueprint-concept'),
// );
// const FaqHomepage = lazy(
//   () => import('@/components/_shared/homepage/home/FaqHomepage'),
// );
// const PlanCards = lazy(
//   () => import('@/components/_shared/homepage/home/plan-cards'),
// );
// const Tryout = lazy(() => import('@/components/_shared/homepage/home/tryout'));
// const WhyUs = lazy(() => import('@/components/_shared/homepage/home/why-us'));

// export default function STAN() {
//   return (
//     <div
//       id="homepage"
//       className="relative bg-bg-workspace"
//     >
//       <div className="absolute top-0 -z-10 h-full w-full">
//         <div className="absolute bottom-auto left-auto right-32 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(109,244,152,0.53)] opacity-60 blur-[80px]" />
//       </div>
//       <div className="min-h-screen">
//         <div className="flex w-full flex-col gap-20">
//           {/* Hero section loads immediately */}
//           <HeroSection />

//           {/* All other sections load lazily */}
//           <Suspense
//             fallback={
//               <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse" />
//             }
//           >
//             <PlanCards />
//           </Suspense>

//           <Suspense
//             fallback={
//               <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse" />
//             }
//           >
//             <Tryout />
//           </Suspense>

//           <Suspense
//             fallback={
//               <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse" />
//             }
//           >
//             <BentoGrid />
//           </Suspense>

//           <Suspense
//             fallback={
//               <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse" />
//             }
//           >
//             <BlueprintConcept />
//           </Suspense>

//           <Suspense
//             fallback={
//               <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse" />
//             }
//           >
//             <WhyUs />
//           </Suspense>

//           <Suspense
//             fallback={
//               <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse" />
//             }
//           >
//             <FaqHomepage />
//           </Suspense>

//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// }
