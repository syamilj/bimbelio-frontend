import { Highlight } from '@/components/brand/highlight';
import { Lio } from '@/components/brand/lio';
import { Supergraphic } from '@/components/brand/supergraphic';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONTAINER } from '../section';

const PROMISES = [
  'Garansi uang kembali',
  'Bisa dicicil 3×',
  'Tutor alumni PTN top',
];

/**
 * Hero beranda (brand book hlm. 103): Biru penuh, tagline + satu aksen lime,
 * Lio ukuran M ekspresi ambis dengan ikat kepala, dan supergrafis.
 */
export function HomeHero() {
  return (
    <section
      data-surface="brand"
      aria-labelledby="hero-judul"
      className="relative isolate overflow-hidden"
    >
      <Supergraphic className="-right-[38%] -bottom-[48%] -z-10 h-[110%] text-white/10 lg:-right-[14%] lg:-bottom-[62%] lg:h-[130%]" />
      <div
        className={cn(
          SITE_CONTAINER,
          'grid items-center gap-8 pt-12 pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-6 lg:pt-24 lg:pb-28',
        )}
      >
        <div className="flex flex-col gap-7">
          <h1
            id="hero-judul"
            className="font-display text-[clamp(2.75rem,6.4vw,5.5rem)] leading-[0.98] font-extrabold tracking-hero text-balance"
          >
            Selesai TO, langsung tahu jalan ke{' '}
            <Highlight
              tone="text"
              className="whitespace-nowrap"
            >
              PTN-mu.
            </Highlight>
          </h1>
          <p className="max-w-[46ch] text-lg text-pretty text-on-dark-muted sm:text-xl">
            Bimbel online dengan AI untuk UTBK-SNBT, ujian mandiri, dan
            kedinasan. Kerjakan tryout, lihat posisimu, lalu belajar dari topik
            yang paling menaikkan skor.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="accent"
            >
              <Link href="/tryout">Ikut tryout</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline-light"
            >
              <Link href="/#rapor">Lihat contoh rapor</Link>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            {PROMISES.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2"
              >
                <span
                  aria-hidden
                  className="flex size-5 items-center justify-center rounded-full bg-white text-brand"
                >
                  <Check
                    className="size-3.5"
                    strokeWidth={3}
                  />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="-mt-4 -mb-10 flex justify-end lg:my-0 lg:justify-center">
          <Lio
            expression="ambis"
            props={['ikat']}
            tone="white"
            size="l"
            className="size-40 sm:size-56 lg:size-[26rem]"
          />
        </div>
      </div>
    </section>
  );
}
