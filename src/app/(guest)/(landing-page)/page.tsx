import { Highlight } from '@/components/brand/highlight';
import { SeriesLabel } from '@/components/brand/series-label';
import { siteConfig } from '@/config/site';
import { getPlans } from '@/features/billing/api';
import { AlumniStorySection } from '@/features/marketing/home/alumni-story';
import { BimBotSection } from '@/features/marketing/home/bimbot';
import { ComparisonTables } from '@/features/marketing/home/comparison';
import { CompetitionSection } from '@/features/marketing/home/competition';
import { FaqSection } from '@/features/marketing/home/faq';
import { HomeHero } from '@/features/marketing/home/hero';
import { HowItWorksSection } from '@/features/marketing/home/how-it-works';
import { LiveMentorSection } from '@/features/marketing/home/live-mentor';
import { PricingPreview } from '@/features/marketing/home/pricing-preview';
import { RoadmapSection } from '@/features/marketing/home/roadmap';
import { SampleReportSection } from '@/features/marketing/home/sample-report';
import { TryoutPreview } from '@/features/marketing/home/tryout-preview';
import { TutorsSection } from '@/features/marketing/home/tutors';
import { MarketingSection } from '@/features/marketing/section';
import { Package } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: siteConfig.defaultTitle },
  alternates: { canonical: '/' },
};

// Data publik (paket, tutor) di-cache dan diperbarui berkala.
export const revalidate = 300;

/**
 * Beranda merek 2.1 (BRAND-2.1 §6.1), satu aksen per seksi dan bergantian:
 * hero Biru → cara kerja → contoh rapor (Tinta) → BimBot → kelas live & mentor
 * → persaingan kampus → paket → cerita alumni → FAQ → footer Tinta.
 */
export default async function HomePage() {
  const plans = await getPlans();

  return (
    <>
      <HomeHero />
      <HowItWorksSection>
        <TryoutPreview />
      </HowItWorksSection>
      <SampleReportSection />
      <BimBotSection />
      <LiveMentorSection tutors={<TutorsSection />}>
        <RoadmapSection />
      </LiveMentorSection>
      <CompetitionSection />
      <MarketingSection
        id="pricing"
        eyebrow={<SeriesLabel icon={Package}>Paket belajar</SeriesLabel>}
        title={
          <>
            Pilih paket yang <Highlight>cocok untukmu.</Highlight>
          </>
        }
        description="SNBT saja, atau sekalian mandiri UI/UGM/ITB dan kedinasan STAN/STIS? Semua ada paketnya, dan bisa dicicil."
      >
        {plans.length > 0 && <PricingPreview plans={plans} />}
        <ComparisonTables />
      </MarketingSection>
      <AlumniStorySection />
      <FaqSection />
    </>
  );
}
