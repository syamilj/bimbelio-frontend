import { cn } from '@/lib/utils';
import { Bubble, ChartTable, chartPalette, type ChartSurface } from './bubble';
import { ladderSteps } from './geometry';

/**
 * A1 · Tangga bubble: kenaikan skor tiap TO dibanding TO pertama (baseline
 * nol = jujur). 1 bubble = `per` poin. TO terakhir disorot.
 */
export function BubbleLadder({
  scores,
  labels,
  per = 10,
  surface = 'light',
  title = 'Kenaikan skor per tryout',
  className,
}: {
  scores: number[];
  labels?: string[];
  per?: number;
  surface?: ChartSurface;
  title?: string;
  className?: string;
}) {
  const c = chartPalette(surface);
  const steps = ladderSteps(scores, per);
  const r = 16;
  const colW = 60;
  const rowH = 2 * r + 6;
  const tallest = Math.max(1, ...steps.map((s) => s.bubbles.length));
  const top = 34;
  const base = top + tallest * rowH;
  const W = Math.max(steps.length * colW, colW);
  const H = base + 26;
  const name = (i: number) => labels?.[i] ?? `#${i + 1}`;

  return (
    <figure className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${title}: ${steps.map((s, i) => `${name(i)} ${Math.round(s.score)}`).join(', ')}`}
        className="h-auto w-full overflow-visible"
      >
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          const cx = i * colW + colW / 2;
          return (
            <g key={i}>
              {s.bubbles.map((f, k) => (
                <Bubble
                  key={k}
                  cx={cx}
                  cy={base - r - k * rowH}
                  r={r}
                  fill={f}
                  color={last ? c.focus : c.neutral}
                  ring={last ? c.focus : c.ring}
                  stroke={2.5}
                />
              ))}
              <text
                x={cx}
                y={H - 4}
                fontSize={13}
                textAnchor="middle"
                fill={c.text}
                opacity={last ? 1 : 0.6}
                className="font-mono"
              >
                {name(i)}
              </text>
              {last && s.rise !== 0 && (
                <text
                  x={cx}
                  y={base - s.bubbles.length * rowH - 8}
                  fontSize={20}
                  fontWeight={800}
                  textAnchor="middle"
                  fill={surface === 'dark' ? c.focus : 'var(--brand-strong)'}
                  className="font-display tabular-nums"
                >
                  {s.rise > 0 ? `+${s.rise}` : s.rise}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <ChartTable
        caption={title}
        head={['Tryout', 'Skor']}
        rows={steps.map((s, i) => [name(i), Math.round(s.score)])}
      />
    </figure>
  );
}
