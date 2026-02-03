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
    <div className="relative bg-slate-50/50 min-h-screen pt-16">
      {/* Simplified Background decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Single subtle gradient circle */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-3xl"
          style={{ backgroundColor: '#0091FF' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
        <PricingPlans />
        <PricingFeatures />
      </div>
    </div>
  );
}
