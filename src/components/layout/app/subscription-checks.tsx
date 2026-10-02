'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { api } from '@/lib/api/client';
import { useTrackId } from '@/lib/track';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/** 201 = status langganan/kuota berubah di server; 202 = cicilan menunggak. */
const CHANGED = 201;
const INSTALLMENT_SUSPENDED = 202;

/**
 * Sinkronisasi status langganan saat siswa membuka aplikasi: langganan aktif,
 * langganan tertunda yang mulai berlaku, cicilan, dan kuota koin. Bila ada yang
 * berubah, sesi dimuat ulang (dulu: reload halaman penuh).
 * Menggantikan empat ProviderCheck* lama; endpoint gabungan menyusul (Fase 6).
 */
export function SubscriptionChecks() {
  const { data: session, refresh } = useSession();
  const { setPagesSetting } = useAppContext();
  const trackId = useTrackId();
  const checkedFor = useRef<string | null>(null);

  const userId = session?.user.id;

  useEffect(() => {
    if (!userId || !trackId) return;
    const key = `${userId}|${trackId}`;
    if (checkedFor.current === key) return;
    checkedFor.current = key;

    const status = (request: Promise<{ status: number }>) =>
      request.then((res) => res.status).catch(() => null);

    // Urutan penting: langganan pending diaktifkan TERAKHIR, setelah langganan
    // kedaluwarsa, cicilan, dan kuota yang habis dibereskan (sama seperti
    // perilaku produksi lama, di mana cek pending tertunda 1 detik). Bila
    // dibalik, kuota baru bisa ditambahkan ke limit lama yang sudah habis.
    const run = async () => {
      const [subscription, installment, limitation] = await Promise.all([
        status(api.post('/user/checkSubscription', { userId })),
        status(api.post('/user/checkSubscriptionInstallment')),
        status(api.post('/user/checkLimitation', { userId })),
      ]);
      const pending = await status(
        api.post(
          '/user/checkSubscriptionPending',
          { userId },
          { params: { website_sub_category_id: trackId } },
        ),
      );

      if (installment === INSTALLMENT_SUSPENDED) {
        toast.error('Langganan ditangguhkan', {
          description:
            'Ada cicilan yang belum dibayar. Bayar cicilan agar akses kembali aktif.',
          duration: 10_000,
        });
        setPagesSetting('installment');
      }
      if ([subscription, pending, limitation, installment].includes(CHANGED)) {
        refresh();
      }
    };
    run();
  }, [userId, trackId, refresh, setPagesSetting]);

  return null;
}
