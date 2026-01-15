import type { Metadata } from 'next';
import PricingPlans from './_components/pricing-plans';
// import PricingHeader from "./_components/pricing-header";
// import PricingFaq from "./_components/pricing-faq";
import PricingFeatures from './_components/pricing-features';

export const metadata: Metadata = {
  title: 'Paket',
  description:
    'Pilih paket yang sesuai dengan kebutuhan kamu hari ini baik itu UTBK/SNBT, Ujian Mandiri, Kedinasan, atau lainnya.',
};

export default function PricingPage() {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white min-h-screen pt-16">
      {/* Enhanced Background decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Large blue circle - top right */}
        <div
          className="absolute -top-16 -right-16 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: '#0091FF' }}
        />

        {/* Pink rotated square - top left */}
        <div
          className="absolute top-32 left-20 w-40 h-40 rounded-3xl opacity-8 blur-2xl"
          style={{
            backgroundColor: '#5aa4dd',
            transform: 'rotate(15deg)',
          }}
        />

        {/* Small circle - bottom center */}
        <div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: '#0091FF' }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-20 md:py-24">
        <PricingPlans />
        <PricingFeatures />
        {/* <PricingFaq /> */}
      </div>
    </div>
  );
}
