'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Crown, LoaderCircle } from 'lucide-react';
import { Slot } from 'radix-ui';
import { useState } from 'react';

type TryoutSummary = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  resultDate: string;
};

const when = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB'
    : '–';

/**
 * Dialog beli akses premium satu tryout (posisi, analisis, rekomendasi).
 * Pengganti `PaymentTryout`: harga `tryout_unlock`, bayar lewat invoice.
 */
export function UpgradeTryoutDialog({
  tryoutId,
  open,
  onOpenChange,
}: {
  tryoutId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const tryout = useQuery({
    queryKey: ['exam', 'tryout-summary', tryoutId],
    enabled: open && !!userId && !!tryoutId,
    queryFn: ({ signal }) =>
      api.get<TryoutSummary>('/tryout/getTryoutDataById', {
        params: { userId, tryoutId },
        signal,
      }),
  });
  const pricing = useQuery({
    queryKey: ['pricing', 'tryout_unlock'],
    enabled: open,
    staleTime: 5 * 60_000,
    queryFn: ({ signal }) =>
      api.get<{ price: number }>('/pricing/getPricingBySlug', {
        params: { slug: 'tryout_unlock' },
        signal,
      }),
  });
  const buy = useMutation({
    mutationFn: async () => {
      const res = await api.post<{ invoiceUrl: string }>(
        '/payment/buyTryoutPremium',
        {
          titleTryout: tryout.data?.title,
          tryoutId,
          userId,
          url: window.location.href,
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      // Halaman pembayaran (Xendit/Midtrans) di luar aplikasi.
      if (data?.invoiceUrl) window.location.assign(data.invoiceUrl);
    },
  });

  const loading = tryout.isPending || pricing.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown
              className="size-5 text-brand"
              aria-hidden
            />
            Buka rapor lengkap
          </DialogTitle>
          <DialogDescription>
            Lihat posisimu di antara peserta, peringkat per subtes, analisis
            kampus pilihan, dan simulasi jurusan untuk tryout ini.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex h-24 items-center justify-center">
            <LoaderCircle
              className="size-5 animate-spin text-ink-muted"
              aria-label="Memuat"
            />
          </div>
        ) : (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-md bg-paper p-4 text-sm">
            <dt className="text-ink-muted">Try out</dt>
            <dd className="font-semibold">{tryout.data?.title ?? '–'}</dd>
            <dt className="text-ink-muted">Pelaksanaan</dt>
            <dd>
              {when(tryout.data?.startDate)} – {when(tryout.data?.endDate)}
            </dd>
            <dt className="text-ink-muted">Hasil keluar</dt>
            <dd>{when(tryout.data?.resultDate)}</dd>
          </dl>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Nanti dulu
          </Button>
          <Button
            disabled={loading || !pricing.data}
            loading={buy.isPending}
            onClick={() => buy.mutate()}
          >
            {pricing.data
              ? `Beli Rp${pricing.data.price.toLocaleString('id-ID')}`
              : 'Beli'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Pemicu dialog upgrade. Dengan `children` (satu elemen), elemen itu yang
 * jadi pemicu; tanpa children tampil tombol "Buka rapor lengkap".
 */
export function UpgradeTryoutButton({
  tryoutId,
  children,
  className,
}: {
  tryoutId: string;
  children?: React.ReactElement;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {children ? (
        <Slot.Root
          onClick={() => setOpen(true)}
          className={className}
        >
          {children}
        </Slot.Root>
      ) : (
        <Button
          className={cn(className)}
          onClick={() => setOpen(true)}
        >
          <Crown aria-hidden />
          Buka rapor lengkap
        </Button>
      )}
      {open && (
        <UpgradeTryoutDialog
          tryoutId={tryoutId}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}
