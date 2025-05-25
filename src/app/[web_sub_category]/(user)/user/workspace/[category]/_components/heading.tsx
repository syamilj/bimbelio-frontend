'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';

import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface heading {
  setSubCategoryId: (id: string) => void;
  subCategoryId: string;
  setDocsData: (data: any) => void;
  sort: boolean;
  setSort: (sort: boolean) => void;
}

export default function HeadingBahanAjar({
  setSubCategoryId,
  subCategoryId,
  setDocsData,
  sort,
  setSort,
}: heading) {
  const params = useParams();
  const pathname = usePathname();

  const [subCategoryData, setSubCategoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const { data: subCategory, isLoading } =
  //   api.subcategory.getAllSubcategoryByCategoryId.useQuery(
  //     `${params?.category}`,
  //     { refetchOnWindowFocus: false },
  //   );

  // useEffect(() => {
  //   if (subCategory) {
  //     setSubCategoryData(subCategory);
  //   }
  // }, [subCategory]);

  useEffect(() => {
    if (!params?.category) return;
    getGeneral(
      `/category/getAllSubcategoryByCategoryId?categoryId=${params?.category}`,
      {
        setData: setSubCategoryData,
        setLoading: setIsLoading,
      },
    );
  }, [params]);

  useEffect(() => {
    setSubCategoryId('');
  }, [pathname]);

  return (
    <div className="flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <Tabs
        value={subCategoryId}
        onValueChange={setSubCategoryId}
        className="w-full md:w-auto"
      >
        <div className="w-full overflow-x-auto heading-scrollbar py-[.7rem]">
          <TabsList className="flex w-fit gap-2 bg-transparent p-2">
            <TabsTrigger
              value=""
              className="flex flex-1 items-center rounded-[.7rem] px-[1.5rem] py-[.7rem] bg-white text-sm text-gray-500 data-[state=active]:bg-main data-[state=active]:text-white"
            >
              Semua
            </TabsTrigger>
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="rounded-[.7rem] w-[100px] h-[36px] bg-gray-200 animate-pulse"
                    />
                  ))
              : subCategoryData?.map((item: any) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="flex flex-1 items-center rounded-[.7rem] bg-white px-[1.5rem] py-[.7rem] text-sm text-gray-500 data-[state=active]:bg-main data-[state=active]:text-white"
                  >
                    <span>{item.name}</span>
                  </TabsTrigger>
                ))}
          </TabsList>
        </div>
      </Tabs>
      <div className="flex h-full w-full items-center justify-end gap-2 md:w-auto">
        {/* <UrutkanDocs
          setDocsData={setDocsData}
          subCategoryId={subCategoryId}
          sort={sort}
          setSort={setSort}
        /> */}
      </div>
    </div>
  );
}
