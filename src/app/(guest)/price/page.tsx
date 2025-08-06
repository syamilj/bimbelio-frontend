import type { Metadata } from 'next';
import PricingPlans from './_components/pricing-plans';
// import PricingHeader from "./_components/pricing-header";
// import PricingFaq from "./_components/pricing-faq";
import PricingFeatures from './_components/pricing-features';

export const metadata: Metadata = {
  title: 'Pricing - Bimbelio',
  description:
    'Choose the perfect plan for your learning journey with Bimbelio',
};

export default function PricingPage() {
  return (
    <div className="relative bg-bg-workspace min-h-screen pt-16">
      {/* Background gradient overlay matching homepage */}
      <div className="absolute top-0 -z-10 h-full w-full">
        <div className="absolute bottom-auto left-auto right-32 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(109,244,152,0.53)] opacity-60 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-16">
        <PricingPlans />
        <PricingFeatures />
        {/* <PricingFaq /> */}
      </div>
    </div>
  );
}
