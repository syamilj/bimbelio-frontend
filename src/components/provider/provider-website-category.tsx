"use client";

import axiosInstanceRaw from "@/lib/axios/axiosInstanceRaw";
import { getGeneral } from "@/lib/fetch-helper";
import { response } from "@/lib/response";
import { WebsiteCategory, WebsiteSubCategory } from "@/types/database";
import { Loader2 } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

export default function ProviderWebsiteCategory({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [webCategoryData, setWebCategoryData] = useState<
    (WebsiteCategory & { WebsiteSubCategory: WebsiteSubCategory[] })[]
  >([]);

  const [websiteSubCategory, setWebsiteSubCategory] =
    useState<WebsiteSubCategory | null>(null);

  useEffect(() => {
    const website_sub_category_id = localStorage.getItem(
      "website_sub_category_id"
    );
    if (website_sub_category_id) {
      axiosInstanceRaw
        .get(
          `/website-category/getSingleWebsiteSubCategory?website_sub_category_id=${website_sub_category_id}`
        )
        .then((res) => {
          const resData = response(res);
          setWebsiteSubCategory(resData.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axiosInstanceRaw
        .get(
          "/website-category/getSingleWebsiteSubCategory?website_sub_category_id=tutor-snbt"
        )
        .then((res) => {
          const resData = response(res);
          setWebsiteSubCategory(resData.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    getGeneral("/website-category/getWebsiteCategory", {
      setData: setWebCategoryData,
    });
  }, []);

  console.log({ websiteSubCategory });

  const Context = {
    websiteSubCategory,
    setWebsiteSubCategory,
    isLoading,
    setIsLoading,
    webCategoryData,
    setWebCategoryData,
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full fixed top-0 left-0 justify-center items-center">
        <Loader2 className="animate-spin w-4 h-4" />
      </div>
    );
  }

  const mainColor = websiteSubCategory?.main_color || "#0091FF";

  const shades = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

  const styles = `
    .bg-main { background-color: ${mainColor}; }
    .data-\[state\=active\]\:bg-main { background-color: ${mainColor}; }
    .text-main { color: ${mainColor}; }
    .ring-main { --tw-ring-color: ${mainColor}; }
    ${shades
      .map((color) => {
        const value = `${hexToRgba(mainColor, color / 100)}`;
        return `
        .bg-main\\/${color} { background-color: ${value}; }
        .hover\\:bg-main\\/${color}:hover { background-color: ${value}; }
        .focus\\:bg-main\\/${color}:focus { background-color: ${value}; }
        .data-\[state\=active\]\:bg-main\\/${color} { background-color: ${value}; }

        .ring-main\\/${color} { 
          --tw-ring-color: ${value};
        }

        .ring-offset-background {
          --tw-ring-offset-color: ${value};
        }

        .text-main\\/${color} { color: ${value}; }
        .hover\\:text-main\\/${color} { color: ${value}; }
        .focus\\:text-main\\/${color} { color: ${value}; }
        `;
      })
      .join("")}
  `;

  return (
    <WebsiteSubCategoryContext.Provider value={Context}>
      <style>{styles}</style>
      {children}
    </WebsiteSubCategoryContext.Provider>
  );
}

interface WebsiteSubCategoryContextType {
  websiteSubCategory: WebsiteSubCategory | null;
  setWebsiteSubCategory: React.Dispatch<
    React.SetStateAction<WebsiteSubCategory | null>
  >;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  webCategoryData: (WebsiteCategory & {
    WebsiteSubCategory: WebsiteSubCategory[];
  })[];
  setWebCategoryData: React.Dispatch<
    React.SetStateAction<
      (WebsiteCategory & {
        WebsiteSubCategory: WebsiteSubCategory[];
      })[]
    >
  >;
}

const WebsiteSubCategoryContext = createContext<
  WebsiteSubCategoryContextType | undefined
>(undefined);

export const useWebsiteSubCategory = () => {
  const context = useContext(WebsiteSubCategoryContext);
  if (!context) {
    throw new Error(
      "useWebsiteSubCategory must be used within an WebsiteSubCategoryContext"
    );
  }
  return context;
};

const hexToRgba = (hex: string, opacity: number) => {
  const sanitizedHex = hex.replace("#", "");
  const bigint = parseInt(sanitizedHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
