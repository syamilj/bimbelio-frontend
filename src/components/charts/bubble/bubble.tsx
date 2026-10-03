import { useId } from 'react';

/** Warna chart per permukaan. Sorotan = Biru di terang, aksen (lime/pink) di gelap. */
export type ChartSurface = 'light' | 'dark';

export const chartPalette = (surface: ChartSurface) =>
  surface === 'dark'
    ? {
        neutral: '#ffffff',
        focus: 'var(--accent)',
        ring: 'rgb(255 255 255 / 0.35)',
        text: '#ffffff',
        muted: 'rgb(255 255 255 / 0.62)',
      }
    : {
        neutral: 'var(--ink-subtle)',
        focus: 'var(--chart-focus)',
        ring: 'var(--chart-empty)',
        text: 'var(--ink)',
        muted: 'var(--ink-muted)',
      };

/**
 * Bubble LJK. `fill` 0..1: 0 = cincin kosong, 1 = terisi penuh, di antaranya
 * terisi dari bawah (seperti pensil 2B yang belum penuh).
 */
export function Bubble({
  cx,
  cy,
  r,
  fill,
  color,
  ring,
  stroke = 3,
  opacity,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: number;
  color: string;
  ring: string;
  stroke?: number;
  opacity?: number;
}) {
  const id = useId().replace(/:/g, '');
  if (fill >= 0.999)
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        opacity={opacity}
      />
    );
  const edge = (
    <circle
      cx={cx}
      cy={cy}
      r={r - stroke / 2}
      fill="none"
      stroke={ring}
      strokeWidth={stroke}
    />
  );
  if (fill <= 0.001) return edge;
  const h = 2 * r * fill;
  return (
    <g opacity={opacity}>
      <clipPath id={id}>
        <rect
          x={cx - r}
          y={cy + r - h}
          width={2 * r}
          height={h}
        />
      </clipPath>
      {edge}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        clipPath={`url(#${id})`}
      />
    </g>
  );
}

/** Tabel data tersembunyi untuk pembaca layar (chart = gambar). */
export function ChartTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: [string, string];
  rows: [React.ReactNode, React.ReactNode][];
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{head[0]}</th>
          <th scope="col">{head[1]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([a, b], i) => (
          <tr key={i}>
            <th scope="row">{a}</th>
            <td>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
