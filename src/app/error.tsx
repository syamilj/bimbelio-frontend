'use client';

import { Lio } from '@/components/brand/lio';
import { MonoLabel } from '@/components/brand/mono-label';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Error global: Lio ko + jalan keluar. Ini kesalahan sistem, bukan skor siswa,
 * jadi ekspresi `ko` boleh dipakai (BRAND-2.1 §6.1).
 */
export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-paper px-5 py-16 text-center">
      <Lio
        expression="ko"
        size="l"
        className="size-40 sm:size-48"
      />
      <div className="flex max-w-md flex-col items-center gap-3">
        <MonoLabel>
          gagal memuat{error.digest ? ` · kode ${error.digest}` : ''}
        </MonoLabel>
        <h1 className="font-display text-4xl leading-tight font-extrabold tracking-hero text-balance text-ink sm:text-5xl">
          Halaman ini gagal dimuat
        </h1>
        <p className="text-ink-muted">
          Ada kesalahan di sisi kami, bukan kamu. Coba muat ulang; kalau masih
          gagal, kembali ke beranda dulu.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          onClick={reset}
        >
          <RotateCw />
          Muat ulang
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
        >
          <Link href="/">Ke beranda</Link>
        </Button>
      </div>
    </main>
  );
}
