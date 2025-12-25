import { NotificationPopUp } from '@/components/_shared/notification/notification-pop-up';
import ProviderNotification from '@/components/provider/privoder-notification';
import ProviderApp from '@/components/provider/provider-app';
import ProviderCheckPayment from '@/components/provider/provider-check-payment';
import ProviderLimitation from '@/components/provider/provider-limitation';
import ProviderMaintenance from '@/components/provider/provider-maintenance';
import ProviderPixel from '@/components/provider/provider-pixel';
import ProviderSessionAuth from '@/components/provider/provider-session-auth';
import ProviderWebsiteCategory from '@/components/provider/provider-website-category';
import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import SocketInfo from '../(guest)/socket-info';
import '../../styles/globals.css';
const PATH_HEADER_KEYS = [
  'x-invoke-path',
  'x-matched-path',
  'x-original-url',
  'next-url',
];

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
    'Bimbel SBMPTN',
    'Bimbel Kedinasan',
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
        <DefaultHeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ProviderMaintenance>
          <Suspense fallback={null}>
            <ProviderSessionAuth>
              <SocketInfo />
              <ProviderPixel>
                <ProviderWebsiteCategory>
                  <ProviderLimitation>
                    <ProviderApp>
                      <ProviderNotification>
                        <NotificationPopUp />
                        <Suspense fallback={null}>
                          <ProviderCheckPayment>
                            {children}
                          </ProviderCheckPayment>
                        </Suspense>
                      </ProviderNotification>
                    </ProviderApp>
                  </ProviderLimitation>
                </ProviderWebsiteCategory>
              </ProviderPixel>
            </ProviderSessionAuth>
          </Suspense>
        </ProviderMaintenance>
      </body>
    </html>
  );
}

function DefaultHeadContent() {
  return (
    <>
      <link
        rel="preconnect"
        href="https://be.bimbelio.com"
      />
      <link
        rel="preconnect"
        href="https://app.midtrans.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="dns-prefetch"
        href="https://connect.facebook.net"
      />
      <link
        rel="dns-prefetch"
        href="https://analytics.tiktok.com"
      />
      <link
        rel="dns-prefetch"
        href="https://static.cloudflareinsights.com"
      />

      <TrackingScripts lazy={false} />
      <StructuredData />
    </>
  );
}

function TrackingScripts({ lazy }: { lazy?: boolean }) {
  const strategy = lazy ? 'lazyOnload' : 'afterInteractive';

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy={strategy}
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
          `,
        }}
      />

      <Script
        id="tiktok-pixel"
        strategy={strategy}
        dangerouslySetInnerHTML={{
          __html: `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._t=ttq._t||{},ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('D23J0VRC77U5781IJVSG');
            }(window, document, 'ttq');
          `,
        }}
      />

      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-PVEJ5PSRCH"
        strategy={strategy}
      />
      <Script
        id="gtag-init"
        strategy={strategy}
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PVEJ5PSRCH');
        `,
        }}
      />
    </>
  );
}

function StructuredData() {
  return (
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
  );
}
