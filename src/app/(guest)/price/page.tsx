import { ContactButton } from '@/components/layout/site/contact';
import { getPlans } from '@/features/billing/api';
import { CoinExplainer } from '@/features/billing/coin-explainer';
import { PlanBrowser } from '@/features/billing/plan-browser';
import { MarketingSection } from '@/features/marketing/section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paket belajar',
  description:
    'Pilih paket belajar Bimbelio untuk UTBK-SNBT, ujian mandiri, dan kedinasan. Bisa dicicil, lengkap dengan try out, live class, dan BimBot AI.',
  alternates: { canonical: '/price' },
};

export default async function PricePage({
  searchParams,
}: {
  searchParams: Promise<{ voucherCode?: string }>;
}) {
  const { voucherCode } = await searchParams;
  const plans = await getPlans(voucherCode);

  return (
    <>
      <MarketingSection
        headingLevel={1}
        title="Paket belajar"
        description="Pilih paket sesuai jalur ujianmu. Semua program sudah termasuk try out, live class, dan BimBot AI sesuai isi paketnya."
        className="pt-10 sm:pt-14"
      >
        <PlanBrowser plans={plans} />
      </MarketingSection>
      <CoinExplainer />
      <MarketingSection
        title="Masih bingung pilih paket?"
        description="Ceritakan target dan jadwalmu. Tim kami bantu pilihkan paket yang paling pas, gratis."
        headerAction={<ContactButton size="lg" />}
      />
    </>
  );
}
