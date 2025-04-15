"use client";

import { Loader2 } from "lucide-react";
import Tab from "./_component/tab";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios/axiosInstance";
import { response, responseError } from "@/lib/response";
import { TryoutCategory, TryoutSession } from "@/types/database";
export default function index() {
  // const { data: categories, isLoading } =
  //   api.tryoutCategory.getCategoryWithTryoutSession.useQuery(undefined, {
  //     refetchOnWindowFocus: false,
  //   });
  // const { data: subCategories, isLoading: isLoadingSubCategory } =
  //   api.tryoutCategory.getSubCategory.useQuery(undefined, {
  //     refetchOnWindowFocus: false,
  //   });

  const [categories, setCategories] = useState<
    (TryoutCategory & {
      TryoutSession: TryoutSession[];
    })[]
  >([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(true);

  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [isLoadingSubCategory, setIsLoadingSubCategory] =
    useState<boolean>(true);

  const getCatAndSubCat = async () => {
    setIsLoadingCategory(true);
    setIsLoadingSubCategory(true);
    try {
      const cat = await axiosInstance.get(
        "/tryoutCategory/getCategoryWithTryoutSession"
      );
      const resCat = response(cat);
      setCategories(resCat.data);

      const subCat = await axiosInstance.get("/tryoutCategory/getSubCategory");
      const resSubCat = response(subCat);
      setSubCategories(resSubCat.data);
    } catch (error) {
      responseError(error, true);
    } finally {
      setIsLoadingCategory(false);
      setIsLoadingSubCategory(false);
    }
  };

  useEffect(() => {
    getCatAndSubCat();
  }, []);

  if (isLoadingCategory || isLoadingSubCategory) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (!categories || !subCategories) {
    return <div>Error loading categories</div>;
  }

  const categoriesWithDate = categories.map((category) => ({
    ...category,
    createAt: new Date(category.createAt),
    updateAt: new Date(category.updateAt),
    TryoutSession: category.TryoutSession.map((session) => ({
      ...session,
      createAt: new Date(session.createAt),
      updateAt: new Date(session.updateAt),
    })),
  }));

  return (
    <div className="pt-[1rem]">
      <Tab
        categories={categoriesWithDate}
        subCategories={subCategories}
        refresh={getCatAndSubCat}
      />
    </div>
  );
}
