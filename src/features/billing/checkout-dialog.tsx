'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { api, toApiError } from '@/lib/api/client';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { cn } from '@/lib/utils';
import { formatIDR } from '@/lib/utils/currency';
import { useMutation } from '@tanstack/react-query';
import { CircleCheck, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  amountAfterVoucher,
  baseAmount,
  installmentSchedule,
  isValidWhatsapp,
  listPrice,
  normalizeWhatsapp,
  type PaymentMethod,
  type PlanDataType,
  type Voucher,
} from './plan';

type CheckoutDialogProps = {
  plan: PlanDataType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Voucher yang dibawa dari URL (`?voucherCode=`), dicek otomatis. */
  initialVoucher?: string | null;
};

const productData = (plan: PlanDataType, value: number) => ({
  contents: [{ id: plan.id, quantity: 1 }],
  content_id: plan.id,
  content_name: plan.name,
  content_type: 'product',
  value,
  currency: 'IDR',
});

const track = (input: Parameters<typeof trackUnifiedEvent>[0]) => {
  try {
    trackUnifiedEvent(input);
  } catch {}
};

/**
 * Checkout paket: metode bayar (bila bisa dicicil) → nomor WhatsApp → voucher →
 * bayar. Pembayaran diselesaikan di halaman invoice (redirect).
 */
export function CheckoutDialog({
  plan,
  open,
  onOpenChange,
  initialVoucher,
}: CheckoutDialogProps) {
  const { data: session } = useSession();
  const formId = useId();
  const canInstall =
    !!plan.PlanInstallmentConfig && installmentSchedule(plan).length > 0;

  const [method, setMethod] = useState<PaymentMethod>('FULL_PAYMENT');
  const [phone, setPhone] = useState('');
  const [voucherInput, setVoucherInput] = useState('');
  const [voucher, setVoucher] = useState<{
    code: string;
    value: Voucher;
  } | null>(null);

  const user = session
    ? {
        userId: session.user.id,
        email: session.user.email,
        phone: session.user.phone ?? undefined,
        firstName: session.user.name.split(' ')[0],
        lastName: session.user.name.split(' ').slice(1).join(' ') || undefined,
      }
    : undefined;

  const checkVoucher = useMutation({
    mutationFn: (code: string) =>
      api.post<Voucher>('/voucher/checkVoucherCode', {
        voucherCode: code,
        planId: plan.id,
      }),
    meta: { toastError: false },
    onSuccess: (res, code) => setVoucher({ code, value: res.data }),
  });

  // Reset setiap kali dialog dibuka; isi nomor dari profil dan cek voucher URL.
  useEffect(() => {
    if (!open) return;
    setMethod('FULL_PAYMENT');
    setVoucher(null);
    checkVoucher.reset();
    setPhone(normalizeWhatsapp(session?.user.phone ?? ''));
    setVoucherInput(initialVoucher?.toUpperCase() ?? '');
    if (initialVoucher) checkVoucher.mutate(initialVoucher.toUpperCase());
    track({
      eventName: 'InitiateCheckout',
      customData: { ...productData(plan, listPrice(plan)), num_items: 1 },
      user,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hanya saat dialog dibuka
  }, [open]);

  const base = baseAmount(plan, method);
  const total = voucher
    ? amountAfterVoucher(plan, method, voucher.value)
    : method === 'FULL_PAYMENT'
      ? listPrice(plan)
      : base;
  const saving = Math.max(0, base - total);
  const phoneValid = isValidWhatsapp(phone);

  const pay = useMutation({
    mutationFn: () =>
      api.post<{ invoiceUrl?: string; order_id?: string }>(
        '/payment/addPayment',
        {
          telp: phone,
          type: 'plan',
          planId: plan.id,
          plan_website_sub_category_id:
            plan.PlanSubscription?.websiteSubCategoryId,
          // Hanya voucher yang sudah lolos pengecekan yang dikirim.
          voucherCode: voucher?.code ?? null,
          paymentType: method,
          userId: session?.user.id,
          url: window.location.href,
        },
      ),
    meta: { toastError: false },
    onSuccess: (res) => {
      const invoiceUrl = res.data?.invoiceUrl;
      if (!invoiceUrl) {
        toast.error('Invoice tidak tersedia', {
          description:
            'Pembayaran belum dapat dibuat. Coba lagi beberapa saat lagi.',
        });
        return;
      }
      track({
        eventName: 'AddToCart',
        customData: {
          ...productData(plan, total),
          num_items: 1,
          order_id: res.data.order_id,
        },
        user,
      });
      window.location.assign(invoiceUrl);
    },
    onError: (error) =>
      toast.error('Pembayaran gagal dibuat', {
        description: toApiError(error).message,
      }),
  });

  const schedule = useMemo(() => installmentSchedule(plan), [plan]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !pay.isPending && onOpenChange(next)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>{plan.name}</DialogDescription>
        </DialogHeader>

        <form
          id={formId}
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!phoneValid || pay.isPending) return;
            track({
              eventName: 'AddPaymentInfo',
              customData: productData(plan, total),
              user: user && { ...user, phone },
            });
            pay.mutate();
          }}
        >
          {canInstall && (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 font-mono text-xs font-medium text-ink-muted lowercase">
                Cara bayar
              </legend>
              <RadioGroup
                value={method}
                onValueChange={(value) => {
                  setMethod(value as PaymentMethod);
                  // Nilai voucher bergantung pada cara bayar: hitung ulang dari voucher yang sama.
                }}
                className="gap-2"
              >
                <MethodOption
                  value="FULL_PAYMENT"
                  checked={method === 'FULL_PAYMENT'}
                  title="Bayar penuh"
                  detail="Sekali bayar, langsung aktif"
                  amount={formatIDR(listPrice(plan))}
                />
                <MethodOption
                  value="INSTALLMENT"
                  checked={method === 'INSTALLMENT'}
                  title={`Cicilan ${schedule.length}×`}
                  detail={
                    plan.PlanInstallmentConfig?.gracePeriodDays
                      ? `Masa tenggang ${plan.PlanInstallmentConfig.gracePeriodDays} hari per cicilan`
                      : 'Bayar bertahap sesuai jadwal'
                  }
                  amount={`${formatIDR(schedule[0]?.amount ?? 0)} dulu`}
                />
              </RadioGroup>
              {method === 'INSTALLMENT' && (
                <ol className="flex flex-col gap-1 rounded-md bg-paper p-3 text-sm">
                  {schedule.map((item, index) => (
                    <li
                      key={item.id}
                      className="flex justify-between gap-3 tabular-nums"
                    >
                      <span className="text-ink-muted">
                        Cicilan {item.installmentNumber}{' '}
                        {index === 0
                          ? '(hari ini)'
                          : `(hari ke-${item.daysAfterFirstPayment})`}
                      </span>
                      <span className="font-semibold text-ink">
                        {formatIDR(item.amount)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </fieldset>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${formId}-phone`}>Nomor WhatsApp</Label>
            <Input
              id={`${formId}-phone`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0812 3456 7890"
              value={phone}
              aria-invalid={phone.length > 3 && !phoneValid}
              aria-describedby={`${formId}-phone-hint`}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => setPhone(normalizeWhatsapp(phone))}
              required
            />
            <p
              id={`${formId}-phone-hint`}
              className="text-xs text-ink-muted"
            >
              Invoice dan info akses dikirim ke nomor ini.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${formId}-voucher`}>Kode voucher (opsional)</Label>
            <div className="flex gap-2">
              <Input
                id={`${formId}-voucher`}
                value={voucher ? voucher.code : voucherInput}
                disabled={!!voucher}
                autoCapitalize="characters"
                className="font-mono"
                placeholder="Contoh: HEMAT50"
                onChange={(e) => {
                  setVoucherInput(e.target.value.toUpperCase());
                  checkVoucher.reset();
                }}
              />
              {voucher ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setVoucher(null);
                    setVoucherInput('');
                  }}
                >
                  Hapus
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!voucherInput.trim()}
                  loading={checkVoucher.isPending}
                  onClick={() => checkVoucher.mutate(voucherInput.trim())}
                >
                  Pakai
                </Button>
              )}
            </div>
            {checkVoucher.isError && (
              <p
                role="alert"
                className="text-xs text-danger"
              >
                {toApiError(checkVoucher.error).message}
              </p>
            )}
            {voucher && saving > 0 && (
              <p className="flex items-center gap-1 text-xs font-semibold text-success">
                <CircleCheck
                  className="size-3.5"
                  aria-hidden
                />
                Voucher dipakai, hemat {formatIDR(saving)}
              </p>
            )}
          </div>

          <div className="flex items-end justify-between gap-3 border-t border-line pt-4">
            <div className="flex flex-col">
              <span className="text-sm text-ink-muted">
                {method === 'INSTALLMENT'
                  ? 'Bayar cicilan pertama'
                  : 'Total bayar'}
              </span>
              {saving > 0 && (
                <s className="text-sm text-ink-subtle tabular-nums">
                  {formatIDR(base)}
                </s>
              )}
            </div>
            <span className="font-display text-3xl font-extrabold tracking-hero text-ink tabular-nums">
              {formatIDR(total)}
            </span>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!phoneValid}
            loading={pay.isPending}
          >
            {pay.isPending ? 'Membuat invoice…' : 'Lanjut ke pembayaran'}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
            <ShieldCheck
              className="size-3.5"
              aria-hidden
            />
            Pembayaran diproses di halaman invoice yang aman.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MethodOption({
  value,
  checked,
  title,
  detail,
  amount,
}: {
  value: PaymentMethod;
  checked: boolean;
  title: string;
  detail: string;
  amount: string;
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors',
        checked
          ? 'border-brand bg-brand-soft'
          : 'border-line hover:border-line-strong',
      )}
    >
      <RadioGroupItem value={value} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold text-ink">{title}</span>
        <span className="text-xs text-ink-muted">{detail}</span>
      </span>
      <span className="font-mono text-sm font-medium text-ink tabular-nums">
        {amount}
      </span>
    </label>
  );
}

/**
 * Buka checkout bila sudah masuk; bila belum, buka login dengan tujuan kembali
 * ke halaman ini dengan `?checkout=<planId>` agar checkout terbuka otomatis.
 */
export function useCheckoutGate() {
  const { status } = useSession();
  const pathname = usePathname();
  const {
    useAuth: { setShowAuth },
  } = useAppContext();

  return (
    planId: string,
    voucherCode?: string | null,
    openCheckout?: () => void,
  ) => {
    if (status === 'authenticated') {
      openCheckout?.();
      return;
    }
    const params = new URLSearchParams({ checkout: planId });
    if (voucherCode) params.set('voucherCode', voucherCode);
    setShowAuth({ open: true, redirect: `${pathname}?${params}` });
  };
}
