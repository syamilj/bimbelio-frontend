'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { trackUnifiedEvent } from '@/lib/tracking/track';
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
    const fullName = session?.user?.name || '';
    const [firstName, ...restNameParts] = fullName.split(' ').filter(Boolean);
    const lastName = restNameParts.length ? restNameParts.join(' ') : undefined;

    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Prediction Page',
        content_type: 'page',
        content_id: 'prediction_page_layout',
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
  }, [session]);

  if (website_sub_category_id_params !== 'simak-ui') {
    return <></>;
  }
  return <Provider>{children}</Provider>;
}
