import { env } from '@/env.mjs';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache, type ComponentType } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import {
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Lock,
  MessageCircle,
  Music4,
  Twitter,
  Youtube,
} from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

const API_BASE_URL = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
export const runtime = 'edge';
export const revalidate = 60;

interface LinkButton {
  id: string;
  title: string;
  subtitle?: string | null;
  sectionLabel?: string | null;
  url: string;
  color?: string | null;
  textColor?: string | null;
  borderRadius?: string | null;
  icon?: string | null;
  iconType?: string | null;
  type?: 'PRIMARY' | 'SECONDARY' | 'OUTLINE' | 'TEXT' | 'THUMBNAIL' | null;
  order?: number | null;
  thumbnail?: string | null;
}

interface LinkPageData {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  profileImage?: string | null;
  backgroundType?: 'GRADIENT' | 'COLOR' | 'IMAGE' | 'VIDEO';
  backgroundColor?: string | null;
  backgroundImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  socialLinks?: Record<string, string | undefined> | null;
  buttons: LinkButton[];
  totalViews?: number;
}

interface LinkPageResult {
  status: number;
  data?: LinkPageData;
  requiresPassword?: boolean;
}

type Awaitable<T> = T | Promise<T>;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ password?: string } | undefined>;
};

const getLinkPage = cache(async (slug: string, password?: string): Promise<LinkPageResult> => {
  const url = new URL(`/link/${slug}`, API_BASE_URL);
  if (password) {
    url.searchParams.set('password', password);
  }

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: password ? 0 : revalidate },
    cache: password ? 'no-store' : undefined,
  });

  if (response.status === 401) {
    return { status: 401, requiresPassword: true };
  }

  if (response.status === 404) {
    return { status: 404 };
  }

  if (!response.ok) {
    return { status: response.status };
  }

  const payload = await response.json();
  const data = payload.data as LinkPageData;

  return {
    status: 200,
    data: {
      ...data,
      buttons: (data.buttons || []).sort(
        (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
      ),
    },
  };
});

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = (await Promise.resolve(searchParams)) ?? {};
  const result = await getLinkPage(resolvedParams.slug, resolvedSearchParams.password);

  if (!result.data) {
    return {
      title: 'Bimbelio',
      description: 'Link tidak ditemukan',
    };
  }

  return {
    title: result.data.metaTitle || result.data.title,
    description: result.data.metaDescription || result.data.description || 'Kunjungi link bio saya di Bimbelio.',
    openGraph: {
      title: result.data.metaTitle || result.data.title,
      description: result.data.metaDescription || result.data.description || 'Kunjungi link bio saya di Bimbelio.',
      images: result.data.ogImage ? [result.data.ogImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: result.data.metaTitle || result.data.title,
      description: result.data.metaDescription || result.data.description || 'Kunjungi link bio saya di Bimbelio.',
      images: result.data.ogImage ? [result.data.ogImage] : undefined,
    },
  };
}

const socialIconMap: Record<string, ComponentType<{ className?: string }>> = {
  website: Globe,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  whatsapp: MessageCircle,
  tiktok: Music4,
};

const backgroundStyle = (data?: LinkPageData) => {
  if (!data) {
    return { backgroundColor: '#0140ed' };
  }

  // Halftone Pattern Effect (Refined: Smaller dots, subtler opacity)
  const halftonePattern = `
    radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)
  `;
  const halftoneSize = '16px 16px'; // More breathing room between dots

  const baseStyle: React.CSSProperties = {
    backgroundImage: halftonePattern,
    backgroundSize: halftoneSize,
    backgroundColor: data.backgroundColor || '#0140ed', // Default Primary Blue
  };

  switch (data.backgroundType) {
    case 'COLOR':
      return {
        ...baseStyle,
        backgroundColor: data.backgroundColor || '#0140ed',
      };
    case 'IMAGE':
      return data.backgroundImage
        ? {
            backgroundImage: `linear-gradient(0deg, rgba(1,64,237,0.85), rgba(1,64,237,0.85)), url(${data.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : baseStyle;
    case 'GRADIENT':
    default:
      // Fallback to Primary Blue with Halftone if gradient not specified
      return baseStyle;
  }
};

const PasswordGate = ({ message, password }: { message?: string; password?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
    <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-slate-900 p-8 text-center shadow-lg border border-white/10">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/20">
        <Lock className="h-6 w-6 text-white/80" />
      </div>
      <h1 className="text-xl font-medium text-white">Halaman Terkunci</h1>
      <p className="mt-2 text-sm text-white/60">{message || 'Masukkan password untuk membuka halaman.'}</p>
      <form method="GET" className="mt-8 space-y-4 text-left">
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue={password}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors"
            placeholder="Masukkan Password"
            required
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black active:scale-[0.98] transition-transform"
        >
          Buka Halaman
        </button>
      </form>
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
    <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-8 text-center border border-white/10">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <ExternalLink className="h-6 w-6 text-red-400" />
      </div>
      <h1 className="text-lg font-medium text-white">Terjadi Kesalahan</h1>
      <p className="mt-2 text-sm text-white/60">{message}</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  </div>
);

const buildButtonSections = (buttons: LinkButton[]) => {
  const map = new Map<string, LinkButton[]>();
  const order: string[] = [];

  buttons.forEach((button) => {
    const label = button.sectionLabel?.trim() || "";
    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(button);
  });

  return order.map((label, index) => ({
    key: `${label || "default"}-${index}`,
    label: label || null,
    buttons: map.get(label)!,
  }));
};

export default async function PublicLinkPage({ params, searchParams }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = (await Promise.resolve(searchParams)) ?? {};
  const password = resolvedSearchParams.password;
  const result = await getLinkPage(resolvedParams.slug, password);

  if (result.status === 404) {
    notFound();
  }

  if (result.requiresPassword) {
    return <PasswordGate password={password} message="Halaman ini dilindungi." />;
  }

  if (!result.data) {
    return <ErrorState message="Gagal memuat halaman link. Silakan coba lagi." />;
  }

  const page = result.data;

  const socialEntries = Object.entries(page.socialLinks || {}).filter(([, url]) => Boolean(url));
  const whatsappLink = page.socialLinks?.whatsapp;
  const primaryCtaLink = whatsappLink || page.buttons[0]?.url || socialEntries[0]?.[1] || '#';
  const primaryCtaLabel = whatsappLink ? 'Chat via WhatsApp' : 'Kunjungi Tautan Utama';
  const buttonSections = buildButtonSections(page.buttons);
  const hasButtons = buttonSections.some((section) => section.buttons.length > 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: page.title,
      description: page.description,
      image: page.profileImage,
      url: `https://www.bimbelio.com/link/${page.slug}`,
      sameAs: socialEntries.map(([, url]) => url),
    },
  };

  const trackingScript = `
    (function(){
      const endpoint = ${JSON.stringify(`${API_BASE_URL}/link/track/button-click`)};
      const linkPageId = ${JSON.stringify(page.id)};
      document.addEventListener('click', function(event) {
        const anchor = event.target.closest('a[data-link-button]');
        if (!anchor) return;
        const payload = {
          buttonId: anchor.getAttribute('data-button-id'),
          linkPageId,
          metadata: {
            title: anchor.getAttribute('data-button-title'),
            url: anchor.getAttribute('href')
          }
        };
        const body = JSON.stringify(payload);
        if (navigator.sendBeacon) {
          navigator.sendBeacon(endpoint, body);
          return;
        }
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true
        });
      }, { passive: true });
    })();
  `;

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden transition-colors duration-700 ${inter.variable} ${playfair.variable} font-sans`} style={backgroundStyle(page)}>
      {/* Halftone Overlay for depth if needed, but handled in backgroundStyle now */}

      {/* Gradient Overlay for depth */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/0 via-black/5 to-black/20" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 py-16 sm:py-20">

        {/* Profile Section - Clean & Open */}
        <div className="mb-10 flex flex-col items-center text-center">
          {page.profileImage && (
            <div className="group relative mb-5 h-28 w-28 overflow-hidden rounded-full shadow-2xl ring-4 ring-white/20">
              <Image
                src={page.profileImage}
                alt={page.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 112px, 112px"
              />
            </div>
          )}

          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-md sm:text-2xl font-serif">
            {page.title}
          </h1>

          {page.description && (
            <p className="mt-2 max-w-xs text-base font-medium leading-relaxed text-white/90 drop-shadow-sm">
              {page.description}
            </p>
          )}          {/* Social Icons - Floating Row */}
          {socialEntries.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {socialEntries.map(([platform, url]) => {
                if (!url) return null;
                const Icon = socialIconMap[platform.toLowerCase()];
                if (!Icon) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white transition-transform active:scale-95 hover:bg-white hover:text-black"
                    aria-label={platform}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="w-full space-y-8">
          {!hasButtons ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-black/10 px-6 py-12 text-center">
              <p className="text-white/60">Belum ada tautan yang aktif.</p>
            </div>
          ) : (
            buttonSections.map((section) => (
              <div key={section.key} className="space-y-3">
                {section.label && (
                  <div className="px-1 pb-1 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60 drop-shadow-sm">
                      {section.label}
                    </h2>
                  </div>
                )}
                <div className="space-y-3">
                  {section.buttons.map((button) => {
                    // Logic for button styling based on TYPE
                    const type = button.type || 'PRIMARY';
                    const baseColor = button.color || '#ffffff';
                    const baseTextColor = button.textColor || '#000000';
                    const radius = button.borderRadius || '99999px'; // Slightly tighter radius

                    let finalBg = baseColor;
                    let finalTxt = baseTextColor;
                    let borderStyle = 'none';
                    let shadow = '0 2px 4px rgba(0,0,0,0.1)';

                    if (type === 'OUTLINE') {
                      finalBg = 'transparent';
                      finalTxt = baseColor; // Use the main color for text/border
                      borderStyle = `2px solid ${baseColor}`;
                      shadow = 'none';
                    } else if (type === 'SECONDARY') {
                      // Secondary usually implies a different style, but here we just use the color
                      // If color is not provided, maybe fallback to glass
                      if (!button.color) {
                         finalBg = 'rgba(255, 255, 255, 0.15)';
                         finalTxt = '#ffffff';
                         borderStyle = '1px solid rgba(255, 255, 255, 0.2)';
                      }
                    } else if (type === 'TEXT') {
                      finalBg = 'transparent';
                      finalTxt = baseTextColor || '#ffffff';
                      shadow = 'none';
                    }

                    // Fallback for glass effect if no color set on PRIMARY
                    if (type === 'PRIMARY' && !button.color) {
                       finalBg = 'rgba(255, 255, 255, 0.95)';
                       finalTxt = '#000000';
                    }

                    return (
                      <a
                        key={button.id}
                        href={button.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-link-button
                        data-button-id={button.id}
                        data-button-title={button.title}
                        className="group relative flex w-full items-center justify-center overflow-hidden px-6 py-4 transition-transform active:scale-[0.98]"
                        style={{
                          backgroundColor: finalBg,
                          color: finalTxt,
                          borderRadius: radius,
                          border: borderStyle,
                          boxShadow: shadow,
                        }}
                      >
                        <div className="relative flex w-full items-center justify-center">
                          {/* Thumbnail/Icon Left */}
                          {(button.thumbnail || button.icon) && (
                            <div className="absolute left-0 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black/5 object-cover">
                               {button.thumbnail ? (
                                 <Image
                                   src={button.thumbnail}
                                   alt=""
                                   width={32}
                                   height={32}
                                   sizes="32px"
                                   className="h-full w-full object-cover"
                                 />
                               ) : (
                                 <span className="text-lg">{/* Icon logic here if needed */}⭐️</span>
                               )}
                            </div>
                          )}

                          <div className="flex flex-col items-center text-center">
                            <span className="text-base font-semibold tracking-wide sm:text-lg">
                              {button.title}
                            </span>
                            {button.subtitle && (
                              <span className="mt-0.5 text-sm opacity-80 font-medium">
                                {button.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="h-px w-12 bg-white/20" />
          <div className="text-sm font-medium text-white/50">
            <p>© {new Date().getFullYear()} {page.title}</p>
            <a
              href={primaryCtaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {primaryCtaLabel}
            </a>
          </div>
        </footer>
      </main>

      {hasButtons && <script dangerouslySetInnerHTML={{ __html: trackingScript }} />}
    </div>
  );
}
