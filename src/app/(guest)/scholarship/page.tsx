import { SeriesLabel } from '@/components/brand/series-label';
import { ContactButton } from '@/components/layout/site/contact';
import { EmptyState } from '@/components/patterns/empty-state';
import { Button } from '@/components/ui/button';
import { CONTACT_CONFIG } from '@/config/contact';
import { MarketingSection } from '@/features/marketing/section';
import { GraduationCap } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Program beasiswa',
  description:
    'Program beasiswa Bimbelio bersama mitra institusi pendidikan dan organisasi untuk siswa berprestasi.',
  alternates: { canonical: '/scholarship' },
};

const STEPS = [
  {
    title: 'Cari program beasiswa',
    body: 'Lihat daftar program yang tersedia dan pilih yang sesuai dengan kriteriamu.',
  },
  {
    title: 'Lengkapi data diri',
    body: 'Isi formulir pendaftaran dengan data lengkap dan dokumen yang diperlukan.',
  },
  {
    title: 'Tunggu hasil seleksi',
    body: 'Tim penyeleksi meninjau pendaftaranmu dan mengumumkan hasil sesuai jadwal.',
  },
];

export default function BeasiswaPage() {
  return (
    <>
      <MarketingSection
        headingLevel={1}
        eyebrow={<SeriesLabel icon={GraduationCap}>Beasiswa</SeriesLabel>}
        title="Program beasiswa"
        description="Kami bermitra dengan berbagai institusi pendidikan dan organisasi untuk menyediakan beasiswa bagi siswa berprestasi."
        className="pt-10 sm:pt-14"
      >
        <EmptyState
          lio="netral"
          title="Belum ada program beasiswa yang dibuka"
          description="Program beasiswa dari mitra kami sedang disiapkan. Gabung grup belajar untuk dapat kabar pertama saat pendaftaran dibuka."
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href={CONTACT_CONFIG.whatsappGroupPath}>
                  Gabung grup WhatsApp
                </Link>
              </Button>
              <ContactButton variant="outline">Tanya tim kami</ContactButton>
            </div>
          }
          className="bg-surface"
        />
      </MarketingSection>
      <MarketingSection
        tone="surface"
        accent="pink"
        title="Cara mendapatkan beasiswa"
      >
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-3"
            >
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-full bg-brand font-mono text-base font-medium text-brand-ink"
              >
                {String.fromCharCode(65 + i)}
              </span>
              <h3 className="font-display text-xl font-bold tracking-display text-ink">
                {step.title}
              </h3>
              <p className="text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </MarketingSection>
    </>
  );
}
