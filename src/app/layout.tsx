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
    'Bimbel TKA',
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
        {/* Resource Hints untuk percepat LCP */}
        <link
          rel="preconnect"
          href="https://www.bimbelio.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="image"
          href="/_next/static/media/bimbelio.webp"
        />
        {/* Catatan: path preload perlu disesuaikan saat build karena hashed file; untuk dev ini bisa dihapus jika error */}
        {/* Meta Pixel Script - Load before interactive untuk detection yang lebih baik */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '367763043065117');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* TikTok Pixel Script - Load before interactive untuk detection yang lebih baik */}
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('D23J0VRC77U5781IJVSG');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />

        {/* Google Analytics - tetap afterInteractive */}
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
          <ProviderSessionAuth>
            <ProviderPixel>
              <ProviderWebsiteCategory>
                <ProviderLimitation>
                  <ProviderApp>
                    <ProviderCheckPayment>{children}</ProviderCheckPayment>
                  </ProviderApp>
                </ProviderLimitation>
              </ProviderWebsiteCategory>
            </ProviderPixel>
          </ProviderSessionAuth>
        </ProviderMaintenance>
      </body>
    </html>
  );
}
