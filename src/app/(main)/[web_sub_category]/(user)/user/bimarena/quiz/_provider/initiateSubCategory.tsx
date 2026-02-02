import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getInitials } from '@/lib/utils';
import { TryoutSubCategory } from '@/types/database';
import { useState } from 'react';
import { ColorList } from './_color-list';

export const initiateSubCategory = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);
  const {
    data: SubCategoryData,
    isLoading: SubCategoryIsLoading,
    refetch: SubCategoryRefetch,
  } = useGet<TryoutSubCategory[]>('/tryoutCategory/getSubCategory');
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const SubCategory = (SubCategoryData || []).map((item, index) => ({
    ...item,
    code: getInitials(item.name),
    color: ColorList[index % ColorList.length],
  }));

  console.log({ SubCategory, selectedSubCategoryId });

  return {
    SubCategory,
    SubCategoryIsLoading,
    SubCategoryRefetch,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
  };
};
