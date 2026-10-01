'use client';

import { ContactButton } from '@/components/layout/site/contact';
import { Button } from '@/components/ui/button';
import { isSoldOut, type PlanDataType } from './plan';
import { PlanCheckout, usePlanCheckout } from './plan-checkout';

function Actions({ plan }: { plan: PlanDataType }) {
  const { buy } = usePlanCheckout();
  const soldOut = isSoldOut(plan);
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        size="lg"
        className="sm:flex-1"
        disabled={soldOut}
        onClick={() => buy(plan)}
      >
        {soldOut ? 'Kuota penuh' : 'Beli paket ini'}
      </Button>
      <ContactButton
        size="lg"
        variant="outline"
      >
        Tanya dulu
      </ContactButton>
    </div>
  );
}

/** Tombol beli & konsultasi di halaman detail paket (melanjutkan checkout setelah login). */
export function PlanDetailActions({ plan }: { plan: PlanDataType }) {
  return (
    <PlanCheckout plans={[plan]}>
      <Actions plan={plan} />
    </PlanCheckout>
  );
}
