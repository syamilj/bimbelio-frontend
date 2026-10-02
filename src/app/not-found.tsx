import { AnswerBubble } from '@/components/patterns/answer-bubble';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halaman tidak ditemukan',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-paper px-4 text-center">
      <div
        className="flex gap-3"
        aria-hidden
      >
        {['4', '0', '4'].map((digit, i) => (
          <AnswerBubble
            key={i}
            label={digit}
            size="lg"
            state="missed"
          />
        ))}
      </div>
      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Halaman tidak ditemukan
        </h1>
        <p className="text-ink-muted">
          Tautannya mungkin salah ketik, atau halaman ini sudah dipindahkan.
        </p>
      </div>
      <Button
        asChild
        size="lg"
      >
        <Link href="/">Ke beranda</Link>
      </Button>
    </main>
  );
}
