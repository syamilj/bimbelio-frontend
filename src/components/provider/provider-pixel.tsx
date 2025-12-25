'use client';
import { useSession } from '@/components/provider/provider-session-auth';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

export default function ProviderPixel({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    // Track initial load + SPA navigation with consistent rules.
    // PageView is no longer auto-fired in layout.tsx, so provider is source-of-truth.
    const fullName = session?.user?.name || '';
    const [firstName, ...restNameParts] = fullName.split(' ').filter(Boolean);
    const lastName = restNameParts.length ? restNameParts.join(' ') : undefined;

    // Meta PageView (browser + server dedup via event_id)
    trackUnifiedEvent({
      eventName: 'PageView',
      platforms: ['meta'],
      customData: {
        page_path: pathname,
      },
      user: session?.user
        ? {
            userId: session.user.id?.toString?.() || undefined,
            email: session.user.email || undefined,
            phone: session.user.phone || undefined,
            firstName: firstName || undefined,
            lastName,
          }
        : undefined,
    });

    // TikTok page view helper (SPA)
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
        content_name: `Page: ${pathname}`,
        content_type: 'page',
        page_path: pathname,
        content_id: `page_${pathname.replace(/\//g, '_').replace(/^_/, '') || 'home'}`,
      },
      user: session?.user
        ? {
            userId: session.user.id?.toString?.() || undefined,
            email: session.user.email || undefined,
            phone: session.user.phone || undefined,
            firstName: firstName || undefined,
            lastName,
          }
        : undefined,
    });
  }, [pathname, session]);

  return <>{children}</>;
}
