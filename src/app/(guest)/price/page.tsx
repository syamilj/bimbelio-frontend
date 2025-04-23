import type { Metadata } from "next";
import PricingPlans from "./_components/pricing-plans";
import PricingHeader from "./_components/pricing-header";
import PricingFaq from "./_components/pricing-faq";
import PricingFeatures from "./_components/pricing-features";

export const metadata: Metadata = {
  title: "Pricing - TutorSNBT",
  description:
    "Choose the perfect plan for your learning journey with TutorSNBT",
};

export default function PricingPage() {
  return (
    <div className="bg-[#f5f9ff] min-h-screen mt-[4rem]">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <PricingHeader />
        {/* <PricingPlans /> */}
        <PricingFeatures />
        <PricingFaq />
      </div>
    </div>
  );
}
