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

// Statis + ISR: tidak memanggil Function Vercel di setiap kunjungan. Harga
// voucher (`?voucherCode=`) dimuat di browser oleh PlanBrowser.
export const revalidate = 300;

export default async function PricePage() {
  const plans = await getPlans();

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
