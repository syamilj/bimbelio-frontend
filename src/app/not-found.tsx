import { Lio } from '@/components/brand/lio';
import { Logo } from '@/components/brand/logo';
import { MonoLabel } from '@/components/brand/mono-label';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halaman tidak ditemukan',
  robots: { index: false },
};

const EXITS = [
  { label: 'Tryout gratis', href: '/tryout' },
  { label: 'Paket belajar', href: '/price' },
  { label: 'Blog', href: '/blog' },
  { label: 'Kalender', href: '/calendar' },
];

/** 404 global: Lio pusing + jalan keluar (BRAND-2.1 §6.1). */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-paper">
      <header className="mx-auto flex w-full max-w-[75rem] px-5 py-6 sm:px-8">
        <Link
          href="/"
          aria-label="Bimbelio — beranda"
          className="rounded-sm focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:outline-none"
        >
          <Logo
            title=""
            className="h-7"
          />
        </Link>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 pb-16 text-center">
        <Lio
          expression="pusing"
          size="l"
          className="size-40 sm:size-48"
        />
        <div className="flex max-w-md flex-col items-center gap-3">
          <MonoLabel>error 404</MonoLabel>
          <h1 className="font-display text-4xl leading-tight font-extrabold tracking-hero text-balance text-ink sm:text-5xl">
            Halaman tidak ditemukan
          </h1>
          <p className="text-ink-muted">
            Lio juga bingung. Tautannya mungkin salah ketik, atau halamannya
            sudah dipindahkan. Coba salah satu jalan keluar ini.
          </p>
        </div>
        <Button
          asChild
          size="lg"
        >
          <Link href="/">Ke beranda</Link>
        </Button>
        <nav
          aria-label="Jalan keluar"
          className="flex flex-wrap justify-center gap-2"
        >
          {EXITS.map((exit) => (
            <Link
              key={exit.href}
              href={exit.href}
              className="inline-flex h-9 items-center rounded-full border-[1.5px] border-line-strong px-4 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            >
              {exit.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
