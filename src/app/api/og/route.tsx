import { env } from '@/env.mjs';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// MIGRATED: Removed export const runtime = 'edge' (incompatible with Cache Components)

const getHost = (url?: string) => {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

// Only these hosts may be fetched server-side for the `image` param (SSRF guard).
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'My Link Page';
  const description = searchParams.get('description') || 'Check out my links!';
  const image = getSafeImageUrl(searchParams.get('image'));

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        backgroundImage: 'linear-gradient(to bottom right, #E0E7FF, #C7D2FE)',
      }}
    >
      {image && (
        <img
          src={image}
          alt="Profile"
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            objectFit: 'cover',
            marginBottom: 20,
            border: '4px solid white',
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 40px',
        }}
      >
        <h1
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: '#1F2937',
            margin: 0,
            marginBottom: 10,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 30,
            color: '#4B5563',
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
