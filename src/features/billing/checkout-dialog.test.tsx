import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API, server } from '../../../test/msw/server';
import { renderWithProviders } from '../../../test/utils/render';
import { CheckoutDialog } from './checkout-dialog';
import type { PlanDataType } from './plan';

vi.mock('@/components/provider/provider-session-auth', () => ({
  useSession: () => ({
    status: 'authenticated',
    data: {
      user: {
        id: 'u1',
        name: 'Siswa Uji',
        email: 's@uji.test',
        phone: '081234567890',
      },
    },
    refresh: vi.fn(),
  }),
}));
vi.mock('@/components/provider/provider-app', () => ({
  useAppContext: () => ({ useAuth: { setShowAuth: vi.fn() } }),
}));
vi.mock('@/lib/tracking/track', () => ({ trackUnifiedEvent: vi.fn() }));

const plan = {
  id: 'plan-1',
  slug: 'intensif',
  name: 'Paket Intensif',
  price: 1_500_000,
  originalPrice: null,
  discount: undefined,
  maxUsers: null,
  totalUsers: 0,
  PlanSubscription: {
    websiteSubCategoryId: 'utbk',
    expireDays: 150,
    PlanSubscriptionBundle: [],
    PlanFeature: [],
  },
  PlanLimitation: null,
  PlanBenefit: [],
  Pivot_LiveClass_Plan: [],
  PlanInstallmentConfig: {
    totalInstallments: 3,
    totalAmount: 1_500_000,
    gracePeriodDays: 3,
    PlanInstallmentSchedule: [
      {
        id: 's1',
        installmentNumber: 1,
        amount: 500_000,
        daysAfterFirstPayment: 0,
      },
      {
        id: 's2',
        installmentNumber: 2,
        amount: 500_000,
        daysAfterFirstPayment: 30,
      },
      {
        id: 's3',
        installmentNumber: 3,
        amount: 500_000,
        daysAfterFirstPayment: 60,
      },
    ],
  },
} as unknown as PlanDataType;

const rp = (n: number) =>
  new RegExp(n.toLocaleString('id-ID').replace(/\./g, '\\.'));

describe('CheckoutDialog', () => {
  let assign: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    window.history.pushState({}, '', '/price');
    assign = vi.spyOn(window.location, 'assign').mockImplementation(() => {});
  });

  it('mengisi nomor dari profil dan menampilkan total bayar penuh', async () => {
    renderWithProviders(
      <CheckoutDialog
        plan={plan}
        open
        onOpenChange={() => {}}
      />,
    );
    expect(screen.getByLabelText('Nomor WhatsApp')).toHaveValue(
      '+6281234567890',
    );
    expect(
      screen.getByText('Total bayar').parentElement?.parentElement,
    ).toHaveTextContent(rp(1_500_000));
  });

  it('cicilan: total menjadi cicilan pertama dan jadwal ditampilkan', async () => {
    const { user } = renderWithProviders(
      <CheckoutDialog
        plan={plan}
        open
        onOpenChange={() => {}}
      />,
    );
    await user.click(screen.getByRole('radio', { name: /Cicilan 3×/ }));
    expect(screen.getByText('Bayar cicilan pertama')).toBeInTheDocument();
    expect(screen.getByText(/Cicilan 2 \(hari ke-30\)/)).toBeInTheDocument();
  });

  it('voucher persen memotong harga, lalu payload pembayaran membawa kode yang sudah dicek', async () => {
    let payload: Record<string, unknown> | null = null;
    server.use(
      http.post(`${API}/voucher/checkVoucherCode`, () =>
        HttpResponse.json({
          status: 200,
          message: 'OK',
          data: { type: 'Percentage', discount: 20 },
        }),
      ),
      http.post(`${API}/payment/addPayment`, async ({ request }) => {
        payload = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({
          status: 200,
          message: 'OK',
          data: { invoiceUrl: 'https://invoice.test/abc', order_id: 'ord-1' },
        });
      }),
    );
    const { user } = renderWithProviders(
      <CheckoutDialog
        plan={plan}
        open
        onOpenChange={() => {}}
      />,
    );
    await user.type(
      screen.getByLabelText('Kode voucher (opsional)'),
      'hemat20',
    );
    await user.click(screen.getByRole('button', { name: 'Pakai' }));
    expect(await screen.findByText(/hemat Rp/)).toHaveTextContent(rp(300_000));

    await user.click(
      screen.getByRole('button', { name: 'Lanjut ke pembayaran' }),
    );
    await waitFor(() =>
      expect(assign).toHaveBeenCalledWith('https://invoice.test/abc'),
    );
    expect(payload).toMatchObject({
      telp: '+6281234567890',
      type: 'plan',
      planId: 'plan-1',
      plan_website_sub_category_id: 'utbk',
      voucherCode: 'HEMAT20',
      paymentType: 'FULL_PAYMENT',
      userId: 'u1',
    });
  });

  it('voucher yang hanya diketik (belum dicek) tidak dikirim', async () => {
    let payload: Record<string, unknown> | null = null;
    server.use(
      http.post(`${API}/payment/addPayment`, async ({ request }) => {
        payload = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({
          status: 200,
          message: 'OK',
          data: { invoiceUrl: 'https://invoice.test/x' },
        });
      }),
    );
    const { user } = renderWithProviders(
      <CheckoutDialog
        plan={plan}
        open
        onOpenChange={() => {}}
      />,
    );
    await user.type(
      screen.getByLabelText('Kode voucher (opsional)'),
      'BELUMDICEK',
    );
    await user.click(
      screen.getByRole('button', { name: 'Lanjut ke pembayaran' }),
    );
    await waitFor(() => expect(payload).not.toBeNull());
    expect(payload).toMatchObject({ voucherCode: null });
  });

  it('voucher tidak valid menampilkan pesan dari server', async () => {
    server.use(
      http.post(`${API}/voucher/checkVoucherCode`, () =>
        HttpResponse.json(
          { status: 404, message: 'Voucher tidak ditemukan' },
          { status: 404 },
        ),
      ),
    );
    const { user } = renderWithProviders(
      <CheckoutDialog
        plan={plan}
        open
        onOpenChange={() => {}}
      />,
    );
    await user.type(screen.getByLabelText('Kode voucher (opsional)'), 'SALAH');
    await user.click(screen.getByRole('button', { name: 'Pakai' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Voucher tidak ditemukan',
    );
  });

  it('nomor tidak valid menonaktifkan tombol bayar', async () => {
    const { user } = renderWithProviders(
      <CheckoutDialog
        plan={plan}
        open
        onOpenChange={() => {}}
      />,
    );
    const phone = screen.getByLabelText('Nomor WhatsApp');
    await user.clear(phone);
    await user.type(phone, '0812');
    expect(
      screen.getByRole('button', { name: 'Lanjut ke pembayaran' }),
    ).toBeDisabled();
  });

  it('pembayaran gagal: tidak redirect', async () => {
    server.use(
      http.post(`${API}/payment/addPayment`, () =>
        HttpResponse.json(
          { status: 500, message: 'Gateway sibuk' },
          { status: 500 },
        ),
      ),
    );
    const { user } = renderWithProviders(
      <CheckoutDialog
        plan={plan}
        open
        onOpenChange={() => {}}
      />,
    );
    await user.click(
      screen.getByRole('button', { name: 'Lanjut ke pembayaran' }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Lanjut ke pembayaran' }),
      ).toBeEnabled(),
    );
    expect(assign).not.toHaveBeenCalled();
  });
});
