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
    <div className="bg-[#f5f9ff] min-h-screen mt-16">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <PricingPlans />
        <PricingFeatures />
        {/* <PricingFaq /> */}
      </div>
    </div>
  );
}
