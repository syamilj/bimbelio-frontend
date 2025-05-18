'use client';

import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import card1 from '../../_assest/card1.png';
// import card2 from '../../_assest/card2.png';
// import card3 from '../../_assest/card3.png';
// import TIU from '../../_assest/category/TIU.png';
// import TKP from '../../_assest/category/TKP.png';
// import TOEFL from '../../_assest/category/TOEFL.png';
// import TWK from '../../_assest/category/TWK.png';
// import Umum from '../../_assest/category/Umum.png';

import { getGeneral } from '@/lib/fetch-helper';
import { Category } from '@/types/database';
import SearchDeskstop from '../../_components/search-dekstop';
import Free from './free';
// import iklan from '../../_assest/Iklan/test.png';

export default function ExploreClient() {
  // const {
  //   data: category,
  //   // isLoading: isLoadingCategory
  // } = api.category.getAllCategories.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  const [category, setCategory] = useState<
    Omit<Category, 'to' | 'website_sub_category_id'>[]
  >([]);

  const fetchCategory = async () => {
    await getGeneral('/category/getAllCategories', {
      setData: setCategory,
    });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  if (category) {
    console.log('category', category);
  }

  return (
    <div className="flex flex-col gap-[2rem] px-[1rem] md:px-0">
      <div className="hidden w-full justify-center md:flex">
        <SearchDeskstop />
      </div>

      <div className="font-regular flex flex-col gap-[.5rem]">
        <Free />
      </div>

      <div className="font-regular flex flex-col gap-[.5rem]">
        {/* <Terbaru /> */}
      </div>

      <div className="font-regular flex flex-col gap-[.5rem]">
        {/* <Trending /> */}
      </div>

      <div className="font-regular flex flex-col gap-[.5rem]">
        {/* <Riwayat /> */}
      </div>
    </div>
  );
}
