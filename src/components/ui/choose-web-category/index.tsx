"use client";

import { useEffect, useState } from "react";
import { DialogWebCategory } from "./dialog-web-category";
import { WebsiteCategory, WebsiteSubCategory } from "@/types/database";
import { getGeneral } from "@/lib/fetch-helper";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { useAppContext } from "@/components/provider/provider-app";

// Sample data matching the required structure
const menuItems = [
  {
    id: "snbt",
    name: "SNBT",
    sub: [
      {
        id: "matematika",
        name: "Matematika",
        main_color: "#0066FF",
        gradient_color: "#0099FF",
        secondary_color: "#E6F3FF",
      },
      {
        id: "bahasa-indonesia",
        name: "Bahasa Indonesia",
        main_color: "#FF3366",
        gradient_color: "#FF6699",
        secondary_color: "#FFE6EE",
      },
    ],
  },
  {
    id: "utbk",
    name: "UTBK",
    sub: [
      {
        id: "penalaran-umum",
        name: "Penalaran Umum",
        main_color: "#9933CC",
        gradient_color: "#CC66FF",
        secondary_color: "#F5E6FF",
      },
      {
        id: "literasi",
        name: "Literasi",
        main_color: "#FF9900",
        gradient_color: "#FFCC00",
        secondary_color: "#FFF9E6",
      },
    ],
  },
];
export default function ChooseWebCategory() {
  const { setMinimizeSidebar } = useAppContext();
  const {
    websiteSubCategory,
    setWebsiteSubCategory,
    setIsLoading,
    webCategoryData,
  } = useWebsiteSubCategory();

  return (
    <DialogWebCategory
      items={webCategoryData}
      value={websiteSubCategory?.id}
      onSelect={(item) => {
        localStorage.setItem("website_sub_category_id", item?.id);
        setIsLoading(true);
        setWebsiteSubCategory(item);
        setMinimizeSidebar(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }}
    />
  );
}
