'use client';

import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

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
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-paper px-4 text-center">
      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Halaman ini gagal dimuat
        </h1>
        <p className="text-ink-muted">
          Terjadi kesalahan di sisi kami. Muat ulang halaman; jika masih gagal,
          kembali ke beranda.
        </p>
        {error.digest && (
          <p className="text-xs text-ink-subtle">Kode: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>
          <RotateCw />
          Muat ulang
        </Button>
        <Button
          variant="outline"
          asChild
        >
          <Link href="/">Ke beranda</Link>
        </Button>
      </div>
    </main>
  );
}
