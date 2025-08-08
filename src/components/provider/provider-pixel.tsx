'use client';
import { useSession } from '@/components/provider/provider-session-auth';
import { pixel } from '@/lib/pixel/_core';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

export default function ProviderPixel({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    // ✅ HANYA track route changes untuk SPA navigation (bukan initial page load)
    // PageView untuk initial load sudah handled di layout.tsx

    if (typeof window !== 'undefined' && window.fbq) {
      // Track route change sebagai ViewContent (bukan PageView untuk avoid duplikasi)
      pixel.meta.track(
        'ViewContent',
        {
          content_name: `Page: ${pathname}`,
          content_type: 'page',
        },
        // ✅ Advanced Matching untuk Meta Pixel
        session?.user
          ? {
              em: session.user.email,
              ph: session.user.phone || undefined,
              fn: session.user.name?.split(' ')[0],
              ln: session.user.name?.split(' ').slice(1).join(' '),
            }
          : undefined,
      );
    }

    if (typeof window !== 'undefined' && window.ttq) {
      // TikTok sudah auto-track page dengan ttq.page() di layout
      // Hanya perlu track route changes sebagai ViewContent
      pixel.tiktok.track('ViewContent', {
        content_name: `Page: ${pathname}`,
        page_path: pathname,
        content_id: `page_${pathname.replace(/\//g, '_').replace(/^_/, '') || 'home'}`, // ✅ Required untuk TikTok VSA
      });
    }
  }, [pathname, session]);

  return <>{children}</>;
}
