'use client';

import { BubbleLoader } from '@/components/patterns/bubble-loader';
import { api } from '@/lib/api/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { DialogJoinDiscord } from '../_shared/dialog/dialog-join-discord';
import { DialogOnBoarding } from '../_shared/dialog/dialog-on-boarding';
import { useSession } from './provider-session-auth';

type CheckPaymentResult = { expired_time?: string; inviteLink?: string };

/**
 * Menangani kembali dari halaman pembayaran (Midtrans menambahkan
 * `?order_id&transaction_status`): verifikasi ke server, bersihkan URL, lalu
 * tampilkan onboarding (dan undangan grup bila ada) untuk pembelian berhasil.
 */
export default function ProviderCheckPayment({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { refresh } = useSession();
  const orderId = searchParams?.get('order_id');
  const transactionStatus = searchParams?.get('transaction_status');

  const [verifying, setVerifying] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!orderId || !transactionStatus || handled.current === orderId) return;
    handled.current = orderId;
    setVerifying(true);

    api
      .post<CheckPaymentResult>('/payment/checkPayment', { order_id: orderId })
      .then(({ data }) => {
        const stillValid =
          data?.expired_time && new Date(data.expired_time) > new Date();
        if (stillValid && transactionStatus === 'settlement') {
          toast.success('Pembelian berhasil', {
            description: 'Paket belajarmu sudah aktif.',
          });
          setInviteLink(data.inviteLink ?? null);
          setOnboardingOpen(true);
          refresh();
        }
      })
      .catch(() => {
        toast.error('Status pembayaran belum dapat dipastikan', {
          description: 'Cek riwayat pembelian di menu akun beberapa saat lagi.',
        });
      })
      .finally(() => {
        setVerifying(false);
        router.replace(pathname);
      });
  }, [orderId, transactionStatus, pathname, refresh, router]);

  return (
    <>
      {children}
      {verifying && (
        <div
          role="alertdialog"
          aria-live="polite"
          aria-label="Memverifikasi pembayaran"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4"
        >
          <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg bg-surface p-8 text-center shadow-overlay">
            <BubbleLoader label="Memverifikasi pembayaran" />
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-ink">
                Memverifikasi pembayaran
              </p>
              <p className="text-sm text-ink-muted">
                Tunggu sebentar, jangan tutup halaman ini.
              </p>
            </div>
          </div>
        </div>
      )}
      <DialogOnBoarding
        inviteLink={inviteLink}
        useOpen={{ isOpen: onboardingOpen, onOpenChange: setOnboardingOpen }}
        onFinish={() => setJoinOpen(true)}
      />
      {inviteLink && (
        <DialogJoinDiscord
          inviteLink={inviteLink}
          open={joinOpen}
          onOpenChange={setJoinOpen}
        />
      )}
    </>
  );
}
