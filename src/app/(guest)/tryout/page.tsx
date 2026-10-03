import { Highlight } from '@/components/brand/highlight';
import { SeriesLabel } from '@/components/brand/series-label';
import { Button } from '@/components/ui/button';
import { HowItWorksSection } from '@/features/marketing/home/how-it-works';
import { TryoutPreview } from '@/features/marketing/home/tryout-preview';
import { MarketingSection } from '@/features/marketing/section';
import { Medal } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tryout gratis',
  description:
    'Tryout UTBK-SNBT, ujian mandiri, dan kedinasan gratis dengan penilaian IRT dan peringkat nasional dari Bimbelio.',
  alternates: { canonical: '/tryout' },
};

export default function TryoutPage() {
  return (
    <>
      <MarketingSection
        headingLevel={1}
        eyebrow={<SeriesLabel icon={Medal}>Tryout</SeriesLabel>}
        title={
          <>
            Tryout <Highlight>gratis</Highlight>
          </>
        }
        description="Ukur kesiapanmu dengan simulasi ujian berformat resmi. Daftar gratis, kerjakan sesuai jadwal, lalu lihat skor dan pembahasannya."
        headerAction={
          <Button
            asChild
            variant="outline"
          >
            <Link href="/price">Butuh latihan lebih banyak?</Link>
          </Button>
        }
        className="pt-10 sm:pt-14"
      >
        <TryoutPreview
          headingLevel={2}
          title="Jadwal tryout terdekat"
        />
      </MarketingSection>
      <HowItWorksSection />
    </>
  );
}
