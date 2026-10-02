'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CheckoutDialog, useCheckoutGate } from './checkout-dialog';
import type { PlanDataType } from './plan';

type PlanCheckoutValue = {
  buy: (plan: PlanDataType) => void;
  /** Voucher dari URL (`?voucherCode=`), null bila tidak ada. */
  voucherCode: string | null;
};
const PlanCheckoutContext = createContext<PlanCheckoutValue | null>(null);

export const usePlanCheckout = () => {
  const ctx = useContext(PlanCheckoutContext);
  if (!ctx)
    throw new Error('usePlanCheckout harus berada di dalam <PlanCheckout>');
  return ctx;
};

/**
 * Satu dialog checkout untuk sekumpulan paket. Menangani gerbang login dan
 * melanjutkan checkout setelah login (`?checkout=<planId>`, juga `?planId=` lama).
 */
export function PlanCheckout({
  plans,
  children,
}: {
  plans: PlanDataType[];
  children: React.ReactNode;
}) {
  const gate = useCheckoutGate();
  const { status } = useSession();
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [active, setActive] = useState<PlanDataType | null>(null);
  // Klik saat sesi masih dimuat ditahan dulu, agar pengguna yang sudah masuk
  // tidak disodori modal login.
  const [pending, setPending] = useState<PlanDataType | null>(null);

  const buy = useCallback(
    (plan: PlanDataType) => {
      if (status === 'loading') setPending(plan);
      else gate(plan.id, voucherCode, () => setActive(plan));
    },
    [gate, status, voucherCode],
  );

  useEffect(() => {
    if (pending && status !== 'loading') {
      setPending(null);
      gate(pending.id, voucherCode, () => setActive(pending));
    }
  }, [pending, status, gate, voucherCode]);

  return (
    <PlanCheckoutContext.Provider value={{ buy, voucherCode }}>
      {children}
      {/* Membaca query string ditunda sendiri agar halaman tetap statis dan
          status 404/redirect halaman tidak terganggu streaming. */}
      <Suspense fallback={null}>
        <ResumeFromUrl
          plans={plans}
          onVoucher={setVoucherCode}
          onResume={buy}
        />
      </Suspense>
      {active && (
        <CheckoutDialog
          plan={active}
          open={!!active}
          onOpenChange={(open) => !open && setActive(null)}
          initialVoucher={voucherCode}
        />
      )}
    </PlanCheckoutContext.Provider>
  );
}

/** Voucher dari URL dan lanjutan checkout setelah login (`?checkout=`, juga `?planId=` lama). */
function ResumeFromUrl({
  plans,
  onVoucher,
  onResume,
}: {
  plans: PlanDataType[];
  onVoucher: (code: string | null) => void;
  onResume: (plan: PlanDataType) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const voucher = searchParams.get('voucherCode');
  const resumeId = searchParams.get('checkout') ?? searchParams.get('planId');

  useEffect(() => onVoucher(voucher), [voucher, onVoucher]);

  useEffect(() => {
    if (!resumeId || status === 'loading') return;
    const plan = plans.find((p) => p.id === resumeId || p.slug === resumeId);
    const rest = new URLSearchParams(searchParams);
    rest.delete('checkout');
    rest.delete('planId');
    router.replace(rest.size ? `${pathname}?${rest}` : pathname, {
      scroll: false,
    });
    if (plan) onResume(plan);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sekali per resumeId & status sesi
  }, [resumeId, status]);

  return null;
}
