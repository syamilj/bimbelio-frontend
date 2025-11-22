// export default function ProviderUtm(){

// }

'use client';

import { pixel } from '@/lib/pixel/_core';
import { utm } from '@/lib/utm/_core';
import { getLinkPageSlug } from '@/lib/utm/url';
import { useEffect } from 'react';

interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

function getUTMParams(): UTMParams | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const utmParams = {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
  };

  if (!Object.values(utmParams).some((v) => v)) {
    return null;
  }

  return utmParams;
}

export default function ProviderUtmLinkPage({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session } = useSession();

  useEffect(() => {
    const utmParams = getUTMParams();
    console.log('🟢 ProviderUtm mounted on CLIENT');
    console.log('🟢 UTM Params:', utmParams);
    console.log({
      gtag: (window as any).gtag,
      fbq: (window as any).fbq,
      ttq: (window as any).ttq,
      utmParams,
    });

    pixel.meta.track('PageView', {
      utm_source: utmParams?.utm_source,
      utm_medium: utmParams?.utm_medium,
      utm_campaign: utmParams?.utm_campaign,
    });

    pixel.tiktok.track('ViewContent', {
      utm_source: utmParams?.utm_source,
      utm_medium: utmParams?.utm_medium,
      utm_campaign: utmParams?.utm_campaign,
    });

    const slug = getLinkPageSlug();
    if (slug) {
      console.log('📄 Link Page SLUG:', slug);

      utm.trackPageView(slug);
    }

    console.log('UTM Params tracked:', utmParams);
  }, []);

  console.log('ProviderUtm rendered ==================================');

  return <>{children}</>;
}
