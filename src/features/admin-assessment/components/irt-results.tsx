'use client';

import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/features/admin/lib/format';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { analyzeIrt, difficultyLabel, discriminationLabel } from '../model/irt';
import type { IrtResult } from '../model/types';

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-line bg-surface p-3">
      <dt className="font-mono text-xs text-ink-subtle lowercase">{label}</dt>
      <dd className="font-mono text-xl font-medium text-ink tabular-nums">
        {value}
      </dd>
      {hint && <dd className="text-xs text-ink-muted">{hint}</dd>}
    </div>
  );
}

function Distribution({
  title,
  data,
  highlight,
}: {
  title: string;
  data: { label: string; count: number }[];
  highlight?: boolean;
}) {
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="text-sm font-semibold text-ink">
        {title}
      </figcaption>
      <div className="h-48 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--line)"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'var(--ink-muted)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--line-strong)' }}
              interval={0}
              angle={data.length > 6 ? -30 : 0}
              textAnchor={data.length > 6 ? 'end' : 'middle'}
              height={data.length > 6 ? 48 : 24}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: 'var(--ink-muted)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--brand-soft)' }}
              formatter={(v) => [v, 'peserta']}
            />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              fill={highlight ? 'var(--chart-focus)' : 'var(--chart-base)'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function Tiers({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; count: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <li
            key={r.label}
            className="grid grid-cols-[9rem_1fr_2rem] items-center gap-2 text-xs"
          >
            <span className="text-ink-muted">{r.label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-line">
              <span
                className="block h-full rounded-full bg-chart-focus"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
            </span>
            <span className="text-right font-mono text-ink">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Hasil proses IRT satu sesi: statistik skor & θ, distribusi, parameter butir. */
export function IrtResults({
  result,
  label,
}: {
  result: IrtResult;
  label: string;
}) {
  const x = analyzeIrt(result);
  const o = result.overallStats;
  const f1 = (v: number) => formatNumber(v, 1);
  const f3 = (v: number | null) => (v === null ? '—' : formatNumber(v, 3));

  return (
    <div className="flex flex-col gap-5">
      <section
        aria-label={`Statistik skor ${label}`}
        className="flex flex-col gap-2"
      >
        <h4 className="text-sm font-semibold text-ink">Skor (skala SNBT)</h4>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat
            label="peserta"
            value={formatNumber(o.totalParticipants)}
          />
          <Stat
            label="rata-rata"
            value={f1(x.displayMean)}
            hint={
              x.synthetic
                ? `populasi · sampel ${f1(o.averageScores)}`
                : undefined
            }
          />
          <Stat
            label="tertinggi"
            value={f1(o.maxScores)}
          />
          <Stat
            label="terendah"
            value={f1(o.minScores)}
          />
          <Stat
            label="median"
            value={f1(o.medianScores)}
          />
          <Stat
            label="std. deviasi"
            value={f1(x.displaySd)}
            hint={x.synthetic ? `populasi · sampel ${f1(x.sd)}` : undefined}
          />
          <Stat
            label="q1 (p25)"
            value={f1(x.q1)}
            hint={`IQR ${f1(x.iqr)}`}
          />
          <Stat
            label="q3 (p75)"
            value={f1(x.q3)}
          />
        </dl>
      </section>

      <section
        aria-label={`Statistik theta ${label}`}
        className="flex flex-col gap-2"
      >
        <h4 className="text-sm font-semibold text-ink">
          Kemampuan (θ, EAP · prior N(0, 25))
        </h4>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat
            label="θ rata-rata"
            value={f3(o.averageTheta)}
          />
          <Stat
            label="θ tertinggi"
            value={f3(o.maxTheta)}
          />
          <Stat
            label="θ terendah"
            value={f3(o.minTheta)}
          />
          <Stat
            label="θ sd"
            value={f3(x.thetaSd)}
            hint={`Q1 ${f3(x.thetaQ1)} · Q3 ${f3(x.thetaQ3)}`}
          />
        </dl>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Distribution
          title="Kategori nilai"
          data={x.brackets.map((b) => ({ label: b.label, count: b.count }))}
          highlight
        />
        <Distribution
          title="Distribusi skor (10 kelompok)"
          data={x.scoreBuckets}
        />
      </div>

      {x.validCount > 0 && (
        <section
          aria-label={`Parameter butir ${label}`}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-sm font-semibold text-ink">
              Parameter butir (model 3PL)
            </h4>
            <p className="font-mono text-xs text-ink-muted">
              {x.validCount}/{x.totalItems} soal terestimasi
              {x.totalItems > x.validCount &&
                ` · ${x.totalItems - x.validCount} tanpa variasi jawaban`}
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-2">
            <Stat
              label="rata-rata a"
              value={f3(x.avgA)}
              hint={`diskriminasi · ${discriminationLabel(x.avgA).toLowerCase()}`}
            />
            <Stat
              label="rata-rata b"
              value={f3(x.avgB)}
              hint={`kesulitan · ${difficultyLabel(x.avgB).toLowerCase()}`}
            />
            <Stat
              label="rata-rata c"
              value={f3(x.avgC)}
              hint="tebakan (pseudo-chance)"
            />
          </dl>
          <div className="grid gap-5 sm:grid-cols-2">
            <Tiers
              title="Tingkat kesulitan (b)"
              rows={[
                { label: 'Mudah (b < −1)', count: x.difficulty.easy },
                { label: 'Sedang (−1 ≤ b ≤ 1)', count: x.difficulty.medium },
                { label: 'Sulit (b > 1)', count: x.difficulty.hard },
              ]}
            />
            <Tiers
              title="Daya diskriminasi (a)"
              rows={[
                { label: 'Rendah (a < 0,5)', count: x.discrimination.low },
                { label: 'Baik (0,5–2)', count: x.discrimination.good },
                { label: 'Sangat tinggi (> 2)', count: x.discrimination.high },
              ]}
            />
          </div>
          <Distribution
            title="Distribusi θ"
            data={x.thetaBuckets}
          />
          <details className="rounded-md border border-line bg-surface">
            <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-ink">
              Tabel parameter per butir
            </summary>
            <div className="max-h-80 overflow-auto">
              <table className="w-full text-sm tabular-nums">
                <thead className="sticky top-0 bg-paper">
                  <tr className="font-mono text-xs text-ink-muted lowercase">
                    <th className="px-3 py-2 text-left">no.</th>
                    <th className="px-3 py-2 text-right">a</th>
                    <th className="px-3 py-2 text-right">b</th>
                    <th className="px-3 py-2 text-right">c</th>
                    <th className="px-3 py-2 text-left">kesulitan</th>
                    <th className="px-3 py-2 text-left">diskriminasi</th>
                  </tr>
                </thead>
                <tbody>
                  {result.question.map((q) => (
                    <tr
                      key={q.q}
                      className="h-9 border-t border-line"
                    >
                      <td className="px-3 font-mono">{q.q}</td>
                      <td className="px-3 text-right font-mono">{f3(q.a)}</td>
                      <td className="px-3 text-right font-mono">{f3(q.b)}</td>
                      <td className="px-3 text-right font-mono">{f3(q.c)}</td>
                      <td className="px-3">
                        <Badge variant="secondary">
                          {difficultyLabel(q.b)}
                        </Badge>
                      </td>
                      <td className="px-3">
                        <Badge variant="secondary">
                          {discriminationLabel(q.a)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
      )}
    </div>
  );
}
