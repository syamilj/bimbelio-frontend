import { Analytics, OrganizationJsonLd } from '@/components/analytics';
import { AppProviders } from '@/components/providers/app-providers';
import { siteConfig } from '@/config/site';
import { env } from '@/env.mjs';
import { fontVariables } from '@/lib/fonts';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'Bimbelio',
    'Bimbel AI',
    'SNBT',
    'UTBK',
    'Bimbel SNBT',
    'Bimbel UTBK',
    'Bimbel TKA',
    'Ujian Mandiri',
    'Bimbel SIMAK UI',
    'Bimbel UM UGM',
    'Bimbel STAN',
    'Bimbel IPDN',
    'Bimbel Kedinasan',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@Bimbelio',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/logo.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#f6f8fb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href={env.NEXT_PUBLIC_API_URL}
        />
        <link
          rel="dns-prefetch"
          href="https://connect.facebook.net"
        />
        <link
          rel="dns-prefetch"
          href="https://analytics.tiktok.com"
        />
      </head>
      <body className="min-h-dvh">
        <AppProviders>{children}</AppProviders>
        <Analytics />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
