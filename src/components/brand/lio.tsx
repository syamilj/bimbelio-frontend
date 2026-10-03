// Lio — maskot Bimbelio: simbol logo (siluet tidak diubah) + mata, alis, dan
// properti yang berekspresi. Port dari paket merek (Jutif: .build/bm-lio.js).
//
// Aturan di aplikasi (BRAND-2.1 §4): ukuran kecil, maks. satu Lio per layar,
// ekspresi positif/netral. TIDAK PERNAH `sedih`/`ko` saat skor siswa turun —
// pakai `netral`. BimBot memakai <BimBotAvatar>, bukan Lio penuh.

import { cn } from '@/lib/utils';
import { useId } from 'react';

const SYMBOL =
  'M245 5C245 22.96 243.07 40.46 239.4 57.32C253.66 61.25 268.68 63.35 284.19 63.35C287.82 63.35 291.42 63.23 294.99 63.01C277.81 79.05 255 89.14 229.85 90.01C228.68 90.05 227.5 90.07 226.32 90.07C218.13 90.07 210.17 89.09 202.54 87.24C201.69 87.04 200.84 86.82 200 86.59C191.14 84.2 182.76 80.62 175.05 76.05C189.56 88.04 206.02 97.75 223.89 104.63C192.95 174.06 130.66 226.45 55 243.8V180.88C98.69 169.76 131 130.15 131 83C131 27.22 85.78 -18 30 -18C-25.78 -18 -71 27.22 -71 83C-71 130.15 -38.69 169.76 5 180.88V249.95C3.34 249.98 1.67 250 0 250C-135.31 250 -245 140.31 -245 5C-245 -80.62 -201.08 -155.98 -134.54 -199.79C-129.95 -149.18 -91.55 -108.33 -42.11 -100C-79.71 -122.16 -105 -163.13 -105 -210C-105 -212.16 -104.93 -214.3 -104.8 -216.42C-101.43 -268.71 -58.04 -310 -5 -310C46.46 -310 88.84 -271.14 94.38 -221.16C182.84 -184.2 245 -96.86 245 5ZM170 -80C170 -93.81 158.81 -105 145 -105C131.19 -105 120 -93.81 120 -80C120 -66.19 131.19 -55 145 -55C158.81 -55 170 -66.19 170 -80Z';
const VB = [-245, -310, 294.99, 250] as const;
const MX = 145;
const MY = -80;
const R = 42;

export type LioExpression =
  | 'netral'
  | 'fokus'
  | 'ambis'
  | 'kaget'
  | 'panik'
  | 'ngantuk'
  | 'senang'
  | 'ko'
  | 'pusing'
  | 'bintang'
  | 'sedih'
  | 'licik';

export type LioProp =
  'ikat' | 'kacamata' | 'keringat' | 'zzz' | 'kilau' | 'pensil';

/** brand: Lio Biru di latar terang. white: Lio putih di latar Biru/Tinta/foto. */
type Tone = 'brand' | 'white';

type Ctx = { body: string; accent: string; line: string; pupil: string };

const Stroke = ({ d, w = 13, c }: { d: string; w?: number; c: Ctx }) => (
  <path
    d={d}
    fill="none"
    stroke={c.line}
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const Ball = ({
  c,
  r = R,
  px = 8,
  py = 0,
  rp = 22,
}: {
  c: Ctx;
  r?: number;
  px?: number;
  py?: number;
  rp?: number;
}) => (
  <>
    <circle
      cx={MX}
      cy={MY}
      r={r}
      fill="#fff"
    />
    <circle
      cx={MX + px}
      cy={MY + py}
      r={rp}
      fill={c.pupil}
    />
    <circle
      cx={MX + px + rp * 0.35}
      cy={MY + py - rp * 0.38}
      r={rp * 0.3}
      fill="#fff"
    />
  </>
);

const star = (r1: number, r2: number) => {
  let p = '';
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? r2 : r1;
    const t = -Math.PI / 2 + (i * Math.PI) / 5;
    p += `${i ? 'L' : 'M'}${(r * Math.cos(t)).toFixed(1)} ${(r * Math.sin(t)).toFixed(1)}`;
  }
  return `${p}Z`;
};

const EYES: Record<LioExpression, (c: Ctx) => React.ReactNode> = {
  netral: (c) => <Ball c={c} />,
  fokus: (c) => (
    <>
      <Ball
        c={c}
        px={12}
        py={6}
      />
      <Stroke
        c={c}
        d="M86 -150 L200 -128"
        w={18}
      />
    </>
  ),
  ambis: (c) => (
    <>
      <Ball
        c={c}
        px={14}
        py={8}
      />
      <Stroke
        c={c}
        d="M84 -160 L204 -122"
        w={20}
      />
    </>
  ),
  kaget: (c) => (
    <>
      <Ball
        c={c}
        r={54}
        px={2}
        py={0}
        rp={12}
      />
      <Stroke
        c={c}
        d="M96 -166 Q148 -194 200 -166"
        w={15}
      />
    </>
  ),
  panik: (c) => (
    <>
      <Ball
        c={c}
        r={52}
        px={-4}
        py={0}
        rp={10}
      />
      <Stroke
        c={c}
        d="M96 -160 Q150 -188 200 -178"
        w={15}
      />
    </>
  ),
  ngantuk: (c) => (
    <>
      <circle
        cx={MX}
        cy={MY}
        r={R}
        fill="#fff"
      />
      <circle
        cx={MX + 8}
        cy={MY + 14}
        r={21}
        fill={c.pupil}
      />
      <path
        d={`M${MX - 48} ${MY - 48}H${MX + 48}V${MY + 2}H${MX - 48}Z`}
        fill={c.body}
      />
      <Stroke
        c={c}
        d={`M${MX - 46} ${MY + 2}H${MX + 46}`}
      />
      <Stroke
        c={c}
        d={`M${MX - 30} ${MY + 60} Q${MX} ${MY + 76} ${MX + 32} ${MY + 58}`}
        w={9}
      />
    </>
  ),
  senang: (c) => (
    <Stroke
      c={c}
      d={`M${MX - 38} ${MY + 14} Q${MX} ${MY - 40} ${MX + 38} ${MY + 14}`}
      w={18}
    />
  ),
  ko: (c) => (
    <Stroke
      c={c}
      d={`M${MX - 32} ${MY - 32}L${MX + 32} ${MY + 32}M${MX + 32} ${MY - 32}L${MX - 32} ${MY + 32}`}
      w={18}
    />
  ),
  pusing: (c) => (
    <>
      <circle
        cx={MX}
        cy={MY}
        r={R + 4}
        fill="#fff"
      />
      <Stroke
        c={c}
        d={`M${MX} ${MY}m0 -5a5 5 0 1 1 -5 5a12 12 0 0 1 12 -12a19 19 0 0 1 19 19a26 26 0 0 1 -26 26a33 33 0 0 1 -33 -33`}
        w={8}
      />
    </>
  ),
  bintang: (c) => (
    <path
      transform={`translate(${MX} ${MY})`}
      d={star(62, 26)}
      fill={c.accent}
      stroke={c.line}
      strokeWidth={7}
      strokeLinejoin="round"
    />
  ),
  sedih: (c) => (
    <>
      <Ball
        c={c}
        px={6}
        py={10}
      />
      <Stroke
        c={c}
        d="M92 -134 L196 -158"
        w={15}
      />
    </>
  ),
  licik: (c) => (
    <>
      <circle
        cx={MX}
        cy={MY}
        r={R}
        fill="#fff"
      />
      <circle
        cx={MX + 14}
        cy={MY + 8}
        r={22}
        fill={c.pupil}
      />
      <path
        d={`M${MX - 48} ${MY - 52}H${MX + 48}V${MY - 6}H${MX - 48}Z`}
        fill={c.body}
      />
      <Stroke
        c={c}
        d={`M${MX - 46} ${MY - 6}L${MX + 46} ${MY - 14}`}
      />
      <Stroke
        c={c}
        d="M90 -146 L200 -150"
        w={15}
      />
    </>
  ),
};

const PROPS: Record<LioProp, (c: Ctx, clip: string) => React.ReactNode> = {
  ikat: (c, clip) => (
    <>
      <g clipPath={`url(#${clip})`}>
        <path
          d="M-300 -178 L320 -260 L326 -204 L-294 -122Z"
          fill={c.accent}
        />
      </g>
      <path
        transform="translate(44 -12)"
        d="M-234 -158 C-290 -176 -318 -144 -350 -158 L-332 -114 C-300 -104 -280 -130 -236 -122Z M-236 -138 C-280 -116 -290 -76 -326 -64 L-288 -36 C-260 -56 -252 -96 -232 -110Z"
        fill={c.accent}
      />
    </>
  ),
  kacamata: (c) => (
    <>
      <Stroke
        c={c}
        d={`M${MX - 58} ${MY - 6} L40 -96`}
        w={12}
      />
      <circle
        cx={MX}
        cy={MY}
        r={58}
        fill="rgba(255,255,255,.16)"
        stroke={c.line}
        strokeWidth={13}
      />
    </>
  ),
  keringat: (c) => (
    <path
      d="M240 -262 C258 -232 268 -214 268 -198 a28 28 0 0 1 -56 0 C212 -214 222 -232 240 -262Z"
      fill="#fff"
      stroke={c.line}
      strokeWidth={7}
    />
  ),
  zzz: (c) => (
    <g
      fontFamily="var(--font-display)"
      fontWeight={800}
      fill={c.line}
    >
      <text
        x={250}
        y={-210}
        fontSize={70}
      >
        z
      </text>
      <text
        x={300}
        y={-270}
        fontSize={94}
      >
        z
      </text>
      <text
        x={360}
        y={-345}
        fontSize={122}
      >
        Z
      </text>
    </g>
  ),
  kilau: (c) => (
    <>
      {(
        [
          [300, -250, 1],
          [345, -140, 0.6],
          [240, -340, 0.7],
        ] as const
      ).map(([x, y, s]) => (
        <path
          key={`${x}${y}`}
          transform={`translate(${x} ${y}) scale(${s})`}
          d="M0 -50 C6 -13 13 -6 50 0 C13 6 6 13 0 50 C-6 13 -13 6 -50 0 C-13 -6 -6 -13 0 -50Z"
          fill={c.accent}
          stroke={c.line}
          strokeWidth={7}
          strokeLinejoin="round"
        />
      ))}
    </>
  ),
  pensil: (c) => (
    <g transform="translate(300 44) rotate(-38)">
      <rect
        x={-16}
        y={-160}
        width={32}
        height={160}
        rx={4}
        fill={c.accent}
        stroke={c.line}
        strokeWidth={7}
      />
      <path
        d="M-16 0 L0 38 L16 0Z"
        fill="#fff"
        stroke={c.line}
        strokeWidth={7}
        strokeLinejoin="round"
      />
    </g>
  ),
};

const SIZE = { xs: 'size-10', s: 'size-16', m: 'size-28', l: 'size-44' };

type LioProps = {
  expression?: LioExpression;
  props?: LioProp[];
  tone?: Tone;
  size?: keyof typeof SIZE;
  className?: string;
  /** Lio hampir selalu dekoratif. Isi hanya bila Lio membawa arti. */
  title?: string;
};

export function Lio({
  expression = 'netral',
  props = [],
  tone = 'brand',
  size = 's',
  className,
  title,
}: LioProps) {
  const clip = useId().replace(/:/g, '');
  const c: Ctx = {
    body: tone === 'white' ? '#fff' : 'var(--brand)',
    accent: 'var(--accent)',
    line: 'var(--ink)',
    pupil: 'var(--ink)',
  };
  const pad = props.length ? 120 : 30;
  const [x0, y0, x1, y1] = VB;
  return (
    <svg
      viewBox={`${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      data-slot="lio"
      data-expression={expression}
      className={cn('shrink-0 overflow-visible', SIZE[size], className)}
    >
      <defs>
        <clipPath id={clip}>
          <path d={SYMBOL} />
          <circle
            cx={MX}
            cy={MY}
            r={26}
          />
        </clipPath>
      </defs>
      <path
        fill={c.body}
        d={SYMBOL}
      />
      <circle
        cx={MX}
        cy={MY}
        r={26}
        fill={c.body}
      />
      {props.map((p) => (
        <g key={p}>{PROPS[p](c, clip)}</g>
      ))}
      {EYES[expression](c)}
    </svg>
  );
}

/** Avatar BimBot: simbol putih di lingkaran Biru. BimBot = suara produk, bukan Lio. */
export function BimBotAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      data-slot="bimbot-avatar"
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand',
        className,
      )}
    >
      <svg
        viewBox="-275 -340 600 620"
        className="size-[62%]"
      >
        <path
          fill="#fff"
          d={SYMBOL}
        />
      </svg>
    </span>
  );
}
