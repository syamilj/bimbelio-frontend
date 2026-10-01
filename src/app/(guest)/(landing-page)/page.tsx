import { siteConfig } from '@/config/site';
import { getPlans } from '@/features/billing/api';
import { ApproachSection } from '@/features/marketing/home/approach';
import { ComparisonSection } from '@/features/marketing/home/comparison';
import { CompetitionSection } from '@/features/marketing/home/competition';
import { EcosystemSection } from '@/features/marketing/home/ecosystem';
import { FaqSection } from '@/features/marketing/home/faq';
import { FinalCta } from '@/features/marketing/home/final-cta';
import { HomeHero } from '@/features/marketing/home/hero';
import { LiveClassPreview } from '@/features/marketing/home/liveclass-preview';
import { PricingPreview } from '@/features/marketing/home/pricing-preview';
import { RoadmapSection } from '@/features/marketing/home/roadmap';
import { TryoutPreview } from '@/features/marketing/home/tryout-preview';
import { TutorsSection } from '@/features/marketing/home/tutors';
import { MarketingSection } from '@/features/marketing/section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: siteConfig.defaultTitle },
  alternates: { canonical: '/' },
};

// Data publik (paket, tutor) di-cache dan diperbarui berkala.
export const revalidate = 300;

export default async function HomePage() {
  const plans = await getPlans();

  return (
    <>
      <HomeHero />
      <CompetitionSection />
      <ApproachSection>
        <TutorsSection />
      </ApproachSection>
      <RoadmapSection />
      <EcosystemSection />
      <TryoutPreview />
      <ComparisonSection />
      {plans.length > 0 && (
        <MarketingSection
          id="pricing"
          tone="surface"
          title="Pilih paket yang cocok untukmu"
          description="SNBT saja, atau sekalian mandiri UI/UGM/ITB dan kedinasan STAN/STIS? Semua ada paketnya, dan bisa dicicil."
        >
          <PricingPreview plans={plans} />
        </MarketingSection>
      )}
      <LiveClassPreview />
      <FaqSection />
      <FinalCta />
    </>
  );
}
