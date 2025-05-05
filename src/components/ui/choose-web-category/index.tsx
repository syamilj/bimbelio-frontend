'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { DialogWebCategory } from './dialog-web-category';

// Sample data matching the required structure
export default function ChooseWebCategory({ first }: { first?: boolean }) {
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();

  return (
    <DialogWebCategory
      first={first}
      items={webCategoryData}
      value={websiteSubCategory?.id}
      onSelect={(item) => {
        localStorage.setItem('website_sub_category_id', item?.id);
        window.location.reload();
        // setIsLoading(true);
        // setWebsiteSubCategory(item);
        // setMinimizeSidebar(true);
        // setTimeout(() => {
        //   setIsLoading(false);
        // }, 2000);
      }}
    />
  );
}
