import {
  AnswerBubble,
  optionLetter,
  type BubbleState,
} from '@/components/patterns/answer-bubble';
import { Button } from '@/components/ui/button';
import { Check, Timer } from 'lucide-react';
import Link from 'next/link';

const PROMISES = [
  'Garansi uang kembali',
  'Bisa dicicil 3×',
  'Tutor alumni PTN top',
];

const OPTIONS = [
  'Rani lolos seleksi.',
  'Rani tidak lolos seleksi.',
  'Rani mendapat skor di atas 700.',
  'Semua peserta try out lolos seleksi.',
  'Rani akan mengikuti seleksi tahun depan.',
];
const CHOSEN = 1;

/** Status navigator 20 soal: terjawab, ragu-ragu (stabilo), soal aktif, kosong. */
const NAV: BubbleState[] = [
  'filled',
  'filled',
  'filled',
  'filled',
  'flagged',
  'filled',
  'filled',
  'filled',
  'filled',
  'filled',
  'filled',
  'filled',
  'filled',
  'empty',
  'empty',
  'empty',
  'empty',
  'empty',
  'empty',
  'empty',
];

/** Hero beranda: janji utama + cuplikan lembar jawaban try out. */
export function HomeHero() {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-20">
        <div className="flex flex-col gap-7">
          <h1 className="text-3xl leading-[1.05] font-extrabold tracking-tight text-balance text-ink sm:text-4xl lg:text-6xl">
            Bimbel AI untuk SNBT, Ujian Mandiri, dan Kedinasan
          </h1>
          <p className="max-w-xl text-lg text-pretty text-ink-muted">
            Program terstruktur 8 bulan, Januari sampai Agustus, bersama tutor
            alumni PTN, mentor pribadi, dan BimBot yang siap menjawab kapan
            saja.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
            >
              <Link href="/price">Lihat paket belajar</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
            >
              <Link href="/#tryout">Coba try out gratis</Link>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink">
            {PROMISES.map((p) => (
              <li
                key={p}
                className="flex items-center gap-1.5"
              >
                <Check
                  className="size-4 text-success"
                  aria-hidden
                />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <AnswerSheetPreview />
      </div>
    </section>
  );
}

/** Cuplikan antarmuka ujian BimArena (dekoratif, bukan formulir sungguhan). */
function AnswerSheetPreview() {
  return (
    <figure
      aria-label="Contoh tampilan try out di BimArena"
      className="relative flex flex-col gap-5 rounded-lg border border-line bg-paper p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-ink">Try Out UTBK #12</span>
        <span className="inline-flex items-center gap-1.5 font-bold text-ink tabular-nums">
          <Timer
            className="size-4 text-ink-muted"
            aria-hidden
          />
          01:42:10
        </span>
      </div>

      <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-4 sm:p-5">
        <p className="text-xs font-semibold text-ink-muted">
          Soal 14 dari 20, Penalaran Umum
        </p>
        <p className="text-sm leading-relaxed text-ink sm:text-base">
          Semua peserta yang lolos seleksi pernah mengikuti try out. Rani tidak
          pernah mengikuti try out. Kesimpulan yang pasti benar adalah…
        </p>
        <ul
          className="flex flex-col gap-2"
          aria-hidden
        >
          {OPTIONS.map((text, i) => {
            const chosen = i === CHOSEN;
            return (
              <li
                key={i}
                className={`flex items-start gap-3 rounded-md border px-3 py-2 text-sm ${
                  chosen ? 'border-brand-strong bg-brand-soft' : 'border-line'
                }`}
              >
                <AnswerBubble
                  size="sm"
                  label={optionLetter(i)}
                  state={chosen ? 'filled' : 'empty'}
                />
                <span className="pt-1 text-ink">{text}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        aria-hidden
        className="grid grid-cols-10 gap-1.5 sm:gap-2"
      >
        {NAV.map((state, i) => (
          <AnswerBubble
            key={i}
            size="xs"
            label={i + 1}
            state={state}
            current={i === 13}
            className="justify-self-center"
          />
        ))}
      </div>

      <figcaption className="text-xs text-ink-muted">
        Tampilan try out di BimArena: timer, navigator soal, dan tanda
        ragu-ragu.
      </figcaption>
    </figure>
  );
}
