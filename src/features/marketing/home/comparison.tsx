import { cn } from '@/lib/utils';
import { Check, Minus } from 'lucide-react';

type Cell = string | boolean;

// Isi tabel mengikuti materi pemasaran Bimbelio. Harga di sini bersifat ilustrasi;
// harga resmi selalu di halaman Paket (lihat PLAN.md §8).
const PROGRAMS: { aspect: string; liveclass: Cell; livestream: Cell }[] = [
  {
    aspect: 'Kapasitas kelas',
    liveclass: 'Maks. 50 siswa',
    livestream: 'Tanpa batas',
  },
  {
    aspect: 'Total sesi live',
    liveclass: '198+ sesi',
    livestream: '198+ sesi',
  },
  {
    aspect: 'Konseling',
    liveclass: 'Tutor alumni PTN',
    livestream: 'Grup diskusi',
  },
  {
    aspect: 'Tryout',
    liveclass: 'IRT + analisis personal',
    livestream: 'IRT standar',
  },
  { aspect: 'Dukungan', liveclass: 'Prioritas', livestream: 'Standar' },
  { aspect: 'Harga', liveclass: 'Rp1.499.000', livestream: 'Rp799.000' },
  { aspect: 'Cicilan', liveclass: '3× Rp499.000', livestream: '3× Rp266.000' },
];

const ALTERNATIVES: {
  feature: string;
  bimbelio: Cell;
  video: Cell;
  offline: Cell;
}[] = [
  { feature: 'Live class', bimbelio: true, video: false, offline: true },
  { feature: 'AI mentor 24 jam', bimbelio: true, video: false, offline: false },
  {
    feature: 'Try out berbasis IRT',
    bimbelio: true,
    video: false,
    offline: 'Terbatas',
  },
  {
    feature: 'Pantau progres',
    bimbelio: true,
    video: 'Manual',
    offline: 'Terbatas',
  },
  {
    feature: 'Harga',
    bimbelio: 'Rp799 rb – 1,4 jt',
    video: 'Rp200 – 500 rb',
    offline: 'Rp4 – 30 jt',
  },
  { feature: 'Fleksibel waktu', bimbelio: true, video: true, offline: false },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true)
    return (
      <Check
        className="mx-auto size-5 text-brand"
        strokeWidth={2.5}
        aria-label="Ya"
      />
    );
  if (value === false)
    return (
      <Minus
        className="mx-auto size-5 text-ink-subtle"
        aria-label="Tidak"
      />
    );
  return <span className="tabular-nums">{value}</span>;
}

function CompareTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: { label: string; cells: Cell[] }[];
}) {
  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="overflow-x-auto rounded-md border border-line bg-surface focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
    >
      <table className="w-full min-w-[32rem] text-sm">
        <caption className="px-5 pt-5 pb-3 text-left font-display text-lg font-bold tracking-display text-ink">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-line">
            {head.map((h, i) => (
              <th
                key={h}
                scope="col"
                className={cn(
                  'px-5 py-3 font-mono text-xs font-medium lowercase',
                  i === 0 ? 'text-left text-ink-muted' : 'text-center text-ink',
                  i === 1 && 'bg-brand text-brand-ink',
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-line last:border-0"
            >
              <th
                scope="row"
                className="px-5 py-3 text-left font-medium text-ink-muted"
              >
                {row.label}
              </th>
              {row.cells.map((cell, i) => (
                <td
                  key={i}
                  className={cn(
                    'px-5 py-3 text-center text-ink',
                    i === 0 && 'bg-brand-soft font-semibold',
                  )}
                >
                  <CellValue value={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Perbandingan program & alternatif belajar (tabel, header mono). */
export function ComparisonTables() {
  return (
    <div
      id="comparison"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-2xl font-bold tracking-display text-ink">
          Bandingkan dulu, baru putuskan
        </h3>
        <p className="text-ink-muted">
          Kami tidak memaksa. Lihat sendiri perbedaannya supaya kamu yakin
          dengan pilihanmu.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <CompareTable
          caption="Live class atau livestream"
          head={['Aspek', 'Live class', 'Livestream']}
          rows={PROGRAMS.map((r) => ({
            label: r.aspect,
            cells: [r.liveclass, r.livestream],
          }))}
        />
        <CompareTable
          caption="Bimbelio dan alternatif lain"
          head={['Fitur', 'Bimbelio', 'Video', 'Offline']}
          rows={ALTERNATIVES.map((r) => ({
            label: r.feature,
            cells: [r.bimbelio, r.video, r.offline],
          }))}
        />
      </div>
    </div>
  );
}
