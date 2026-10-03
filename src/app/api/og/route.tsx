import { LOGO_PATHS } from '@/components/brand/logo-paths';
import { env } from '@/env.mjs';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// OG 1200×630 gaya brand book hlm. 29: permukaan Biru atau Tinta, angka/judul
// Parkinsans, satu aksen lime, simbol diperbesar di tepi, logo putih.
//
// Parameter (semua opsional, kompatibel dengan generator OG halaman link):
//   title, description, image (foto profil, host diizinkan saja),
//   value (angka besar, mis. 614), label (kepala mono, mis. "rapor TO · data contoh"),
//   tone = brand | ink

// Satori tidak membaca CSS variable → nilai token merek 2.1 (tokens.css) ditulis langsung.
const C = {
  brand: '#0066FF',
  ink: '#0B1736',
  lime: '#C6F432',
  white: '#FFFFFF',
};

// Font statis (Satori tidak mendukung woff2/variable), dibaca sekali per instance.
const fontsDir = join(process.cwd(), 'src/fonts/og');
const fonts = Promise.all([
  readFile(join(fontsDir, 'parkinsans-800.ttf')),
  readFile(join(fontsDir, 'jakarta-500.ttf')),
  readFile(join(fontsDir, 'dm-mono-500.ttf')),
]);

const getHost = (url?: string) => {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

// Hanya host ini yang boleh diambil server untuk parameter `image` (cegah SSRF).
const ALLOWED_IMAGE_HOSTS = new Set(
  [
    getHost(env.NEXT_PUBLIC_SUPABASE_URL),
    getHost(env.NEXT_PUBLIC_SUPABASE_IMG_URL),
    'bimbelio.com',
    'www.bimbelio.com',
  ].filter((host): host is string => !!host),
);

const getSafeImageUrl = (value: string | null) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    if (url.username || url.password || url.port) return null;
    if (!ALLOWED_IMAGE_HOSTS.has(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
};

const clip = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = clip(searchParams.get('title') || 'Bimbelio', 90);
  const description = clip(searchParams.get('description') || '', 140);
  const value = clip(searchParams.get('value') || '', 8);
  const label = clip(searchParams.get('label') || 'bimbelio.com', 48);
  const tone = searchParams.get('tone') === 'ink' ? 'ink' : 'brand';
  const image = getSafeImageUrl(searchParams.get('image'));
  const [parkinsans, jakarta, dmMono] = await fonts;

  const bg = tone === 'ink' ? C.ink : C.brand;
  const titleSize = value ? 56 : title.length > 48 ? 60 : 76;
  const symbol = LOGO_PATHS.symbol;
  const logo = LOGO_PATHS.horizontal;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: bg,
        color: C.white,
        fontFamily: 'Jakarta',
        padding: '64px 72px',
      }}
    >
      {/* Supergrafis: simbol diperbesar dan terpotong di tepi kanan bawah. */}
      <svg
        viewBox={symbol.viewBox}
        width={560}
        height={580}
        style={{ position: 'absolute', right: -120, bottom: -170 }}
      >
        <path
          d={symbol.body}
          fill="rgba(255,255,255,0.12)"
        />
      </svg>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'DM Mono',
              fontSize: 26,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            {label}
          </div>
          {image && (
            <img
              src={image}
              alt=""
              width={112}
              height={112}
              style={{
                width: 112,
                height: 112,
                borderRadius: 56,
                objectFit: 'cover',
                border: `4px solid ${C.white}`,
              }}
            />
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 860,
          }}
        >
          {value && (
            <div
              style={{
                display: 'flex',
                fontFamily: 'Parkinsans',
                fontSize: 200,
                lineHeight: 0.85,
                letterSpacing: '-0.065em',
                color: C.lime,
                marginBottom: 20,
              }}
            >
              {value}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              fontFamily: 'Parkinsans',
              fontSize: titleSize,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                display: 'flex',
                marginTop: 20,
                fontSize: 28,
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.86)',
              }}
            >
              {description}
            </div>
          )}
        </div>

        <svg
          viewBox={logo.viewBox}
          width={236}
          height={41}
        >
          <path
            d={logo.body}
            fill={C.white}
          />
          {logo.dots && (
            <path
              d={logo.dots}
              fill={C.lime}
            />
          )}
        </svg>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Parkinsans', data: parkinsans, weight: 800, style: 'normal' },
        { name: 'Jakarta', data: jakarta, weight: 500, style: 'normal' },
        { name: 'DM Mono', data: dmMono, weight: 500, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    },
  );
}
