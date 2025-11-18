'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { pixel } from '@/lib/pixel/_core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Provider from './_provider/provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (website_sub_category_id_params !== 'simak-ui') {
      router.push(`/${website_sub_category_id_params}/user/dashboard`);
    }
  }, [website_sub_category_id_params]);

  useEffect(() => {
    pixel.meta.track(
      'ViewContent',
      {
        content_name: 'Prediction Page',
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
    pixel.tiktok.track('ViewContent', {
      content_name: 'Prediction Page',
      content_id: 'prediction_page_layout', // ✅ Required untuk TikTok VSA
    });
  }, [session]);

  if (website_sub_category_id_params !== 'simak-ui') {
    return <></>;
  }
  return <Provider>{children}</Provider>;
}
