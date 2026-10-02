import { Button } from '@/components/ui/button';
import { TryoutPreview } from '@/features/marketing/home/tryout-preview';
import { MarketingSection } from '@/features/marketing/section';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Try out gratis',
  description:
    'Try out UTBK-SNBT, ujian mandiri, dan kedinasan gratis dengan penilaian IRT dan peringkat nasional dari Bimbelio.',
  alternates: { canonical: '/tryout' },
};

export default function TryoutPage() {
  return (
    <>
      <MarketingSection
        headingLevel={1}
        title="Try out gratis"
        description="Ukur kesiapanmu dengan simulasi ujian berformat resmi. Daftar gratis, kerjakan sesuai jadwal, lalu lihat skor dan pembahasannya."
        headerAction={
          <Button
            asChild
            variant="outline"
          >
            <Link href="/price">Butuh latihan lebih banyak?</Link>
          </Button>
        }
        className="pb-0 sm:pb-0"
      />
      <TryoutPreview />
    </>
  );
}
