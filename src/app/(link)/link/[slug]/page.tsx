import { env } from '@/env.mjs';
import { cookies } from 'next/headers';
import { passwordCookieName } from './_components/password-cookie';
import { unlockLinkPage } from './actions';

import { Lio } from '@/components/brand/lio';
import { Logo } from '@/components/brand/logo';
import { Supergraphic } from '@/components/brand/supergraphic';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from '@/components/icons/brand-icons';
import { Button } from '@/components/ui/button';
import { CircleAlert, Globe, Lock, MessageCircle, Music4 } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type ComponentType } from 'react';
import { ButtonLinkPage } from './_components/button-link-page';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
// MIGRATED: Removed export const runtime = 'edge' (incompatible with Cache Components)
// MIGRATED: Removed export const revalidate = 60 (incompatible with Cache Components)
// TODO: Will add "use cache" + cacheLife('minutes') after analyzing build errors

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

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ password?: string; error?: string } | undefined>;
};

/** Password dari cookie (hasil unlockLinkPage); `?password=` lama tetap diterima. */
async function resolvePassword(slug: string, fromQuery?: string) {
  return (await cookies()).get(passwordCookieName(slug))?.value ?? fromQuery;
}

async function getLinkPage(
  slug: string,
  password?: string,
): Promise<LinkPageResult> {
  // 'use cache';
  // cacheLife('minutes');

  const url = new URL(`/link/${slug}`, API_BASE_URL);
  if (password) {
    url.searchParams.set('password', password);
  }

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
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
        (a, b) =>
          (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER),
      ),
    },
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = (await Promise.resolve(searchParams)) ?? {};
  const result = await getLinkPage(
    resolvedParams.slug,
    await resolvePassword(resolvedParams.slug, resolvedSearchParams.password),
  );

  if (!result.data) {
    return {
      title: 'Bimbelio',
      description: 'Link tidak ditemukan',
    };
  }

  return {
    title: result.data.metaTitle || result.data.title,
    description:
      result.data.metaDescription ||
      result.data.description ||
      'Kunjungi link bio saya di Bimbelio.',
    openGraph: {
      title: result.data.metaTitle || result.data.title,
      description:
        result.data.metaDescription ||
        result.data.description ||
        'Kunjungi link bio saya di Bimbelio.',
      images: result.data.ogImage ? [result.data.ogImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: result.data.metaTitle || result.data.title,
      description:
        result.data.metaDescription ||
        result.data.description ||
        'Kunjungi link bio saya di Bimbelio.',
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

// Warna latar lama (#0140ed) adalah default admin sebelum merek 2.1 → Biru 2.1.
const LEGACY_DEFAULT = /^#0140ed$/i;
const brandColor = (color?: string | null) =>
  !color || LEGACY_DEFAULT.test(color) ? 'var(--brand)' : color;

/** Latar dari pengaturan halaman (data pengguna, bukan token): warna atau foto + lapisan warna. */
const backgroundStyle = (data?: LinkPageData): React.CSSProperties => {
  const color = brandColor(data?.backgroundColor);
  if (data?.backgroundType === 'IMAGE' && data.backgroundImage)
    return {
      backgroundColor: color,
      backgroundImage: `linear-gradient(0deg, color-mix(in oklab, ${color} 85%, transparent), color-mix(in oklab, ${color} 85%, transparent)), url(${data.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  return { backgroundColor: color };
};

const PasswordGate = ({ slug, wrong }: { slug: string; wrong?: boolean }) => (
  <div
    data-surface="ink"
    className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden p-5"
  >
    <Supergraphic className="-z-10 text-white/5" />
    <div className="w-full max-w-sm rounded-lg border border-on-dark-line bg-white/5 p-8 text-center">
      <span className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border-2 border-on-dark-line">
        <Lock
          className="size-6"
          aria-hidden
        />
      </span>
      <h1 className="font-display text-2xl font-bold tracking-display">
        Halaman terkunci
      </h1>
      <p className="mt-2 text-sm text-on-dark-muted">
        Masukkan password untuk membuka halaman ini.
      </p>
      {wrong && (
        <p
          role="alert"
          className="mt-4 flex items-center justify-center gap-2 rounded-sm bg-white px-3 py-2 text-sm font-semibold text-danger"
        >
          <CircleAlert
            className="size-4"
            aria-hidden
          />
          Password salah. Coba lagi.
        </p>
      )}
      <form
        action={unlockLinkPage.bind(null, slug)}
        className="mt-8 flex flex-col gap-3 text-left"
      >
        <label
          htmlFor="password"
          className="sr-only"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="h-12 w-full rounded-full border-[1.5px] border-on-dark-line bg-transparent px-5 text-center text-white transition-colors placeholder:text-on-dark-muted focus-visible:border-white focus-visible:ring-2 focus-visible:ring-highlight focus-visible:outline-none"
          placeholder="Masukkan password"
          required
          autoFocus
        />
        <Button
          type="submit"
          variant="accent"
          size="lg"
        >
          Buka halaman
        </Button>
      </form>
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div
    data-surface="ink"
    className="flex min-h-dvh items-center justify-center p-5"
  >
    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg border border-on-dark-line bg-white/5 p-8 text-center">
      <Lio
        expression="ko"
        tone="white"
        size="m"
      />
      <h1 className="font-display text-2xl font-bold tracking-display">
        Halaman gagal dimuat
      </h1>
      <p className="text-sm text-on-dark-muted">{message}</p>
      <Button
        asChild
        variant="outline-light"
      >
        <Link href="/">Kembali ke beranda</Link>
      </Button>
    </div>
  </div>
);

const buildButtonSections = (buttons: LinkButton[]) => {
  const map = new Map<string, LinkButton[]>();
  const order: string[] = [];

  buttons.forEach((button) => {
    const label = button.sectionLabel?.trim() || '';
    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(button);
  });

  return order.map((label, index) => ({
    key: `${label || 'default'}-${index}`,
    label: label || null,
    buttons: map.get(label)!,
  }));
};

export default async function PublicLinkPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = (await Promise.resolve(searchParams)) ?? {};
  const password = await resolvePassword(
    resolvedParams.slug,
    resolvedSearchParams.password,
  );
  const result = await getLinkPage(resolvedParams.slug, password);

  if (result.status === 404) {
    notFound();
  }

  if (result.requiresPassword) {
    return (
      <PasswordGate
        slug={resolvedParams.slug}
        wrong={resolvedSearchParams.error === 'password'}
      />
    );
  }

  if (!result.data) {
    return (
      <ErrorState message="Halaman link belum bisa dimuat. Coba lagi beberapa saat lagi." />
    );
  }

  const page = result.data;

  const socialEntries = Object.entries(page.socialLinks || {}).filter(
    ([, url]) => Boolean(url),
  );
  const whatsappLink = page.socialLinks?.whatsapp;
  const primaryCtaLink =
    whatsappLink || page.buttons[0]?.url || socialEntries[0]?.[1] || '#';
  const primaryCtaLabel = whatsappLink
    ? 'Chat lewat WhatsApp'
    : 'Kunjungi tautan utama';
  const buttonSections = buildButtonSections(page.buttons);
  const hasButtons = buttonSections.some(
    (section) => section.buttons.length > 0,
  );

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

  return (
    <div
      data-surface="brand"
      className="relative isolate min-h-dvh w-full overflow-x-hidden"
      style={backgroundStyle(page)}
    >
      <Supergraphic className="-right-[35%] -bottom-[10%] -z-10 h-[70%] text-white/10" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center px-5 py-16 sm:py-20">
        <div className="mb-10 flex flex-col items-center text-center">
          {page.profileImage && (
            <div className="relative mb-5 size-28 overflow-hidden rounded-full ring-4 ring-white/30">
              <Image
                src={page.profileImage}
                alt={page.title}
                fill
                className="object-cover"
                priority
                sizes="112px"
                unoptimized={true}
              />
            </div>
          )}
          <h1 className="font-display text-2xl font-bold tracking-display text-balance sm:text-3xl">
            {page.title}
          </h1>
          {page.description && (
            <p className="mt-2 max-w-xs text-base leading-relaxed">
              {page.description}
            </p>
          )}
          {socialEntries.length > 0 && (
            <ul className="mt-6 flex flex-wrap justify-center gap-3">
              {socialEntries.map(([platform, url]) => {
                if (!url) return null;
                const Icon = socialIconMap[platform.toLowerCase()];
                if (!Icon) return null;
                return (
                  <li key={platform}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-11 items-center justify-center rounded-full border-[1.5px] border-white/60 text-white transition-colors hover:bg-white hover:text-ink focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
                      aria-label={platform}
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex w-full flex-col gap-8">
          {!hasButtons ? (
            <div className="rounded-lg border-2 border-dashed border-white/40 px-6 py-12 text-center">
              <p>Belum ada tautan yang aktif.</p>
            </div>
          ) : (
            buttonSections.map((section) => (
              <div
                key={section.key}
                className="flex flex-col gap-3"
              >
                {section.label && (
                  <h2 className="px-1 text-center font-mono text-xs font-medium lowercase">
                    {section.label}
                  </h2>
                )}
                {section.buttons.map((button) => (
                  <ButtonLinkPage
                    key={button.id}
                    button={button}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        <footer className="mt-auto flex flex-col items-center gap-4 pt-16 text-center text-sm">
          <a
            href={primaryCtaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <span
              aria-hidden
              className="size-2 rounded-full bg-lime"
            />
            {primaryCtaLabel}
          </a>
          <Link
            href="/"
            aria-label="Bimbelio — beranda"
            className="rounded-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <Logo
              tone="white"
              title=""
              className="h-6"
            />
          </Link>
          <p>
            © {new Date().getFullYear()} {page.title}
          </p>
        </footer>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ slug: 'example' }];
}
