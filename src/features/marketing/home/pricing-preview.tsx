'use client';

import { Button } from '@/components/ui/button';
import { listPrice, type PlanDataType } from '@/features/billing/plan';
import { PlanCard } from '@/features/billing/plan-card';
import {
  PlanCheckout,
  usePlanCheckout,
} from '@/features/billing/plan-checkout';
import Link from 'next/link';

function Cards({ plans }: { plans: PlanDataType[] }) {
  const { buy } = usePlanCheckout();
  return (
    <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onBuy={buy}
        />
      ))}
    </div>
  );
}

/** Tiga paket teratas di beranda (rekomendasi dulu), dengan checkout di tempat. */
export function PricingPreview({ plans }: { plans: PlanDataType[] }) {
  const top = [...plans]
    .sort(
      (a, b) =>
        Number(b.recommended) - Number(a.recommended) ||
        listPrice(b) - listPrice(a),
    )
    .slice(0, 3);
  if (top.length === 0) return null;
  return (
    <PlanCheckout plans={plans}>
      <Cards plans={top} />
      {plans.length > top.length && (
        <Button
          asChild
          variant="outline"
          className="self-start"
        >
          <Link href="/price">Lihat semua paket ({plans.length})</Link>
        </Button>
      )}
    </PlanCheckout>
  );
}
