import { cn } from '@/lib/utils';
import { Bubble, ChartTable, chartPalette, type ChartSurface } from './bubble';
import { fillLevels } from './geometry';

export type SubtestScore = { label: string; value: number };

/**
 * B1 · Batang bubble: profil subtes 0–800, 1 bubble = 100 poin. Satu subtes
 * disorot — di rapor, sorot subtes FOKUS (yang paling perlu dikejar), bukan
 * andalan (brand book hlm. 102).
 */
export function BubbleBars({
  data,
  focus,
  max = 800,
  per = 100,
  surface = 'light',
  title = 'Profil skor per subtes',
  className,
}: {
  data: SubtestScore[];
  focus?: string;
  max?: number;
  per?: number;
  surface?: ChartSurface;
  title?: string;
  className?: string;
}) {
  const c = chartPalette(surface);
  const n = Math.ceil(max / per);
  const r = 14;
  const gap = 6;
  const labelW = 64;
  const valueW = 64;
  const rowH = 2 * r + 12;
  const W = labelW + n * (2 * r + gap) + valueW;
  const H = data.length * rowH;

  return (
    <figure className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${title}: ${data.map((d) => `${d.label} ${Math.round(d.value)}`).join(', ')}`}
        className="h-auto w-full overflow-visible"
      >
        {data.map((d, i) => {
          const on = d.label === focus;
          const y = i * rowH + r + 2;
          return (
            <g key={d.label}>
              <text
                x={0}
                y={y + 5}
                fontSize={14}
                fill={c.text}
                opacity={on ? 1 : 0.75}
                className="font-mono"
              >
                {d.label}
              </text>
              {fillLevels(d.value, per, n).map((f, b) => (
                <Bubble
                  key={b}
                  cx={labelW + r + b * (2 * r + gap)}
                  cy={y}
                  r={r}
                  fill={f}
                  color={on ? c.focus : c.neutral}
                  ring={c.ring}
                  stroke={2.5}
                />
              ))}
              <text
                x={W}
                y={y + 6}
                fontSize={18}
                fontWeight={800}
                textAnchor="end"
                fill={
                  on
                    ? surface === 'dark'
                      ? c.focus
                      : 'var(--brand-strong)'
                    : c.text
                }
                className="font-display tabular-nums"
              >
                {Math.round(d.value)}
              </text>
            </g>
          );
        })}
      </svg>
      <ChartTable
        caption={title}
        head={['Subtes', 'Skor']}
        rows={data.map((d) => [d.label, Math.round(d.value)])}
      />
    </figure>
  );
}
