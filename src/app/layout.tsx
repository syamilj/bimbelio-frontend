import ProviderApp from '@/components/provider/provider-app';
import ProviderCheckPayment from '@/components/provider/provider-check-payment';
import ProviderLimitation from '@/components/provider/provider-limitation';
import ProviderMaintenance from '@/components/provider/provider-maintenance';
import ProviderPixel from '@/components/provider/provider-pixel';
import ProviderSessionAuth from '@/components/provider/provider-session-auth';
import ProviderWebsiteCategory from '@/components/provider/provider-website-category';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import Script from 'next/script';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | Bimbelio`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    'Bimbelio',
    'Bimbel AI',
    'SNBT',
    'UTBK',
    'Bimbel SNBT',
    'Bimbel UTBK',
    'Ujian Mandiri',
    'Bimbel Ujian Mandiri',
    'Bimbel SIMAK UI',
    'Bimbel UTUL UGM',
    'Bimbel UM UGM',
    'Bimbel STAN',
    'Bimbel IPDN',
  ],
  authors: [{ name: 'Bimbelio', url: 'https://www.bimbelio.com' }],
  creator: 'Bimbelio',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
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
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    card: 'summary_large_image',
    creator: '@Bimbelio',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/logo.png',
    apple: '/apple-touch-icon.png',
  },
  // manifest: `$(siteConfig.url)/manifest.json`,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    [key: string]: any;
  }
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
    >
      <head>
        <Script
          async
          src={'https://www.googletagmanager.com/gtag/js?id=G-PVEJ5PSRCH'}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PVEJ5PSRCH');
          `,
          }}
        />
        {/* End Google Tag Manager */}

        <Script
          type="application/ld+json"
          id="ld-json-org"
          dangerouslySetInnerHTML={{
            __html: `
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Bimbelio",
            "url": "https://www.bimbelio.com",
            "logo": "https://www.bimbelio.com/logo.png",
            "sameAs": [
              "https://www.facebook.com/bimbelio.official",
              "https://www.twitter.com/bimbelio.official",
              "https://www.instagram.com/bimbelio.official",
              "https://www.tiktok.com/bimbelio.official"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+6285161112223",
              "contactType": "Customer Service"
            }
          }
          `,
          }}
        />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <ProviderMaintenance>
          <ProviderPixel>
            <ProviderSessionAuth>
              <ProviderWebsiteCategory>
                <ProviderLimitation>
                  <ProviderApp>
                    <ProviderCheckPayment>{children}</ProviderCheckPayment>
                  </ProviderApp>
                </ProviderLimitation>
              </ProviderWebsiteCategory>
            </ProviderSessionAuth>
          </ProviderPixel>
        </ProviderMaintenance>
      </body>
    </html>
  );
}
