'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DialogWebCategory } from './dialog-web-category';

export default function ChooseWebCategory({ first }: { first?: boolean }) {
  const { web_sub_category } = useParams<{ web_sub_category: string }>();
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <DialogWebCategory
      first={first}
      items={webCategoryData}
      value={websiteSubCategory?.id}
      onSelect={(item) => {
        localStorage.setItem('website_sub_category_id', item?.id);
        const pathname = window.location.pathname;
        const pathnameArray = pathname.split('/');
        let newPathname = '';
        pathnameArray.forEach((pItem, index) => {
          if (index > 1) {
            newPathname += `/${pItem}`;
          }
        });
        window.location.pathname = `/${item.id}${newPathname}`;
      }}
    />
  );
}
