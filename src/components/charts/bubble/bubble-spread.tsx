import { cn } from '@/lib/utils';
import { Bubble, ChartTable, chartPalette, type ChartSurface } from './bubble';
import { spreadColumns, type SpreadBin } from './geometry';

/**
 * C1 · Sebaran bubble: posisi di antara peserta, 1 bubble = `pct`% peserta.
 * Kelas yang sudah kamu lewati tampil penuh, sisanya redup, bubble "kamu"
 * disorot.
 */
export function BubbleSpread({
  bins,
  you,
  pct = 2,
  surface = 'light',
  title = 'Posisimu di antara peserta',
  className,
}: {
  bins: SpreadBin[];
  you: number;
  pct?: number;
  surface?: ChartSurface;
  title?: string;
  className?: string;
}) {
  const c = chartPalette(surface);
  const cols = spreadColumns(bins, you, pct);
  const r = 9;
  const colW = 2 * r + 5;
  const rowH = 2 * r + 4;
  const tallest = Math.max(1, ...cols.map((col) => col.bubbles));
  const base = tallest * rowH + 6;
  const W = cols.length * colW;
  const H = base + 24;
  const tickEvery = Math.max(1, Math.round(cols.length / 4));

  return (
    <figure className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${title}: skormu ${Math.round(you)}`}
        className="h-auto w-full overflow-visible"
      >
        {cols.map((col, i) => {
          const cx = i * colW + colW / 2;
          const n = Math.max(col.bubbles, col.isYou ? 1 : 0);
          return (
            <g key={col.from}>
              {Array.from({ length: n }, (_, k) => {
                const topBubble = k === n - 1;
                const isYou = col.isYou && topBubble;
                return (
                  <Bubble
                    key={k}
                    cx={cx}
                    cy={base - r - k * rowH}
                    r={isYou ? r + 3 : r}
                    fill={1}
                    color={isYou ? c.focus : c.neutral}
                    ring={c.ring}
                    opacity={isYou || col.passed || col.isYou ? 1 : 0.32}
                  />
                );
              })}
              {i % tickEvery === 0 && (
                <text
                  x={i * colW}
                  y={H - 4}
                  fontSize={11}
                  fill={c.muted}
                  className="font-mono tabular-nums"
                >
                  {col.from}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <ChartTable
        caption={title}
        head={['Rentang skor', 'Peserta']}
        rows={cols.map((col) => [`${col.from}–${col.to}`, col.count])}
      />
    </figure>
  );
}
