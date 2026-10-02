import { siteConfig } from '@/config/site';
import Script from 'next/script';

const META_PIXEL_ID = '367763043065117';
const TIKTOK_PIXEL_ID = 'D23J0VRC77U5781IJVSG';
const GA_ID = 'G-PVEJ5PSRCH';

/**
 * Skrip pelacakan (Meta, TikTok, GA) — satu tempat untuk seluruh aplikasi.
 * `afterInteractive`: stub fbq/ttq harus ada sebelum ProviderPixel mengirim
 * PageView; berkas besar tetap dimuat async oleh stub itu sendiri.
 */
export function Analytics() {
  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
      >
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');`}
      </Script>
      <Script
        id="tiktok-pixel"
        strategy="afterInteractive"
      >
        {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._t=ttq._t||{},ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${TIKTOK_PIXEL_ID}');}(window,document,'ttq');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
      >
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Bimbelio',
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  sameAs: [
    'https://www.facebook.com/bimbelio.official',
    siteConfig.links.twitter,
    siteConfig.links.instagram,
    siteConfig.links.tiktok,
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+6285161112223',
    contactType: 'customer service',
  },
};

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
    />
  );
}
