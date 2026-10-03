import { cn } from '@/lib/utils';
import { Bubble, ChartTable, chartPalette, type ChartSurface } from './bubble';
import { heatLevels } from './geometry';

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const HOURS = ['06', '08', '10', '12', '14', '16', '18', '20', '22'];
const OPACITY = [0, 0.3, 0.5, 0.75, 1];

/**
 * D1 · Peta jam: hari × blok 2 jam belajar. Satu warna, 4 tingkat; puncak
 * diberi cincin.
 */
export function BubbleHeatmap({
  grid,
  rows = DAYS,
  cols = HOURS,
  surface = 'light',
  unit = 'menit',
  title = 'Jam belajarmu dalam seminggu',
  className,
}: {
  /** grid[hari][blok jam] — nilai bebas (menit, jumlah soal, …). */
  grid: number[][];
  rows?: string[];
  cols?: string[];
  surface?: ChartSurface;
  unit?: string;
  title?: string;
  className?: string;
}) {
  const c = chartPalette(surface);
  const { levels, peak } = heatLevels(grid);
  const r = 16;
  const labelW = 44;
  const cell = 2 * r + 10;
  const W = labelW + cols.length * cell;
  const H = rows.length * cell + 22;

  return (
    <figure className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={title}
        className="h-auto w-full overflow-visible"
      >
        {levels.map((row, ri) => (
          <g key={ri}>
            <text
              x={0}
              y={ri * cell + r + 5}
              fontSize={12}
              fill={c.muted}
              className="font-mono"
            >
              {rows[ri]}
            </text>
            {row.map((lv, ci) => {
              const cx = labelW + ci * cell + r;
              const cy = ri * cell + r + 1;
              const isPeak = peak?.[0] === ri && peak?.[1] === ci;
              return (
                <g key={ci}>
                  {lv === 0 ? (
                    <Bubble
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={0}
                      color={c.focus}
                      ring={c.ring}
                      stroke={1.5}
                    />
                  ) : (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={c.focus}
                      opacity={OPACITY[lv]}
                    />
                  )}
                  {isPeak && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r + 4}
                      fill="none"
                      stroke={c.text}
                      strokeWidth={2}
                    />
                  )}
                </g>
              );
            })}
          </g>
        ))}
        {cols.map((h, ci) => (
          <text
            key={h}
            x={labelW + ci * cell + r}
            y={H - 4}
            fontSize={11}
            textAnchor="middle"
            fill={c.muted}
            className="font-mono"
          >
            {h}
          </text>
        ))}
      </svg>
      <ChartTable
        caption={title}
        head={['Hari', `Total (${unit})`]}
        rows={grid.map((row, i) => [rows[i], row.reduce((a, b) => a + b, 0)])}
      />
    </figure>
  );
}
