// export default function ProviderUtm(){

// }

'use client';

import { trackUnifiedEvent } from '@/lib/tracking/track';
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

    const pagePath =
      typeof window !== 'undefined' ? window.location.pathname : '';

    // Meta PageView (browser + server dedup via event_id)
    trackUnifiedEvent({
      eventName: 'PageView',
      platforms: ['meta'],
      customData: {
        page_path: pagePath,
        content_type: 'link_page',
      },
    });

    // TikTok page helper
    try {
      if (typeof window !== 'undefined' && (window as any).ttq?.page) {
        (window as any).ttq.page();
      }
    } catch {
      // ignore
    }

    // TikTok ViewContent (browser + server dedup via event_id)
    trackUnifiedEvent({
      eventName: 'ViewContent',
      platforms: ['tiktok'],
      customData: {
        utm_source: utmParams?.utm_source,
        utm_medium: utmParams?.utm_medium,
        utm_campaign: utmParams?.utm_campaign,
        utm_content: utmParams?.utm_content,
        utm_term: utmParams?.utm_term,
        content_type: 'link_page',
        page_path: pagePath,
        content_id: `link_${pagePath.split('/').filter(Boolean).join('_') || 'home'}`,
      },
    });

    const slug = getLinkPageSlug();
    if (slug) {
      utm.trackPageView(slug);
    }
  }, []);

  return <>{children}</>;
}
