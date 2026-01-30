import { Dispatch, SetStateAction, useState } from 'react';

type useSubCategoryType = {
  SubCategory: {
    code: string;
    color: string;
    id: string;
    name: string;
    categoryId: string;
    website_sub_category_id: string;
  }[];
  selectedSubCategoryId: string | null;
  setSelectedSubCategoryId: Dispatch<SetStateAction<string | null>>;
};

export const useSubCategory = (): useSubCategoryType => {
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);

  return {
    SubCategory: [
      {
        code: 'ARITH',
        color: '#FF6B6B',
        id: 'subcat_001',
        name: 'Aritmetika',
        categoryId: 'cat-001',
        website_sub_category_id: 'sub-cat-001',
      },
      {
        code: 'ALG',
        color: '#4ECDC4',
        id: 'subcat_002',
        name: 'Aljabar',
        categoryId: 'cat-001',
        website_sub_category_id: 'sub-cat-001',
      },
      {
        code: 'GEOM',
        color: '#45B7D1',
        id: 'subcat_003',
        name: 'Geometri',
        categoryId: 'cat-001',
        website_sub_category_id: 'sub-cat-001',
      },
      {
        code: 'TRIG',
        color: '#FFA07A',
        id: 'subcat_004',
        name: 'Trigonometri',
        categoryId: 'cat-001',
        website_sub_category_id: 'sub-cat-001',
      },
      {
        code: 'STAT',
        color: '#98D8C8',
        id: 'subcat_005',
        name: 'Statistika',
        categoryId: 'cat-001',
        website_sub_category_id: 'sub-cat-001',
      },
      {
        code: 'PROB',
        color: '#F7DC6F',
        id: 'subcat_006',
        name: 'Probabilitas',
        categoryId: 'cat-001',
        website_sub_category_id: 'sub-cat-001',
      },
    ],
    selectedSubCategoryId,
    setSelectedSubCategoryId,
  };
};
