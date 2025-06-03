'use client';

import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Provider from './_provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (website_sub_category_id_params !== 'simak-ui') {
      router.push(`/${website_sub_category_id_params}/user/dashboard`);
    }
  }, [website_sub_category_id_params]);

  if (website_sub_category_id_params !== 'simak-ui') {
    return <></>;
  }
  return <Provider>{children}</Provider>;
}
