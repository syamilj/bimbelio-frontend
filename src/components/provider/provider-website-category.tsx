'use client';

import axiosInstanceRaw from '@/lib/axios/axiosInstanceRaw';
import { getGeneral } from '@/lib/fetch-helper';
import { response } from '@/lib/response';
import { getMainStyles } from '@/styles/main-styles';
import { WebsiteCategory, WebsiteSubCategory } from '@/types/database';
import { Loader2 } from 'lucide-react';
import NextTopLoader from 'nextjs-toploader';
import { createContext, useContext, useEffect, useState } from 'react';
import ChooseWebCategory from '../ui/choose-web-category';
import { useSession } from './session-provider-auth';
import { useParams } from 'next/navigation';

const initialValue = {
  id: 'guest',
  main_color: '#0091FF',
  secondary_color: '#5aa4dd',
  name: 'guest',
  createdAt: new Date(),
  updatedAt: new Date(),
  website_category_id: 'guest',
};

export default function ProviderWebsiteCategory({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { web_sub_category } = useParams<{ web_sub_category: string }>();
  const [first, setFirst] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [webCategoryData, setWebCategoryData] = useState<
    (WebsiteCategory & { WebsiteSubCategory: WebsiteSubCategory[] })[]
  >([]);

  const [websiteSubCategory, setWebsiteSubCategory] =
    useState<WebsiteSubCategory | null>(null);

  const getWebSubCategory = () => {
    const website_sub_category_id = localStorage.getItem(
      'website_sub_category_id',
    );
    setIsLoading(true);
    if (website_sub_category_id) {
      axiosInstanceRaw
        .get(
          `/website-category/getSingleWebsiteSubCategory?website_sub_category_id=${website_sub_category_id}`,
        )
        .then((res) => {
          const resData = response(res);
          setWebsiteSubCategory(resData.data);
        })
        .catch(() => {
          setFirst(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      if (!session) setWebsiteSubCategory(initialValue);
      else setFirst(true);

      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWebSubCategory();
    getGeneral('/website-category/getWebsiteCategory', {
      setData: setWebCategoryData,
    });
  }, [session]);

  useEffect(() => {
    if (webCategoryData.length === 0 || !web_sub_category) return
    console.log(web_sub_category)
    const find = webCategoryData.find(item => item.WebsiteSubCategory.find(item2 => item2.id === web_sub_category))
    console.log({ find })
    console.log({ length: webCategoryData.length })
    if (find) {
      localStorage.setItem("website_sub_category_id", web_sub_category)
      setWebsiteSubCategory(find.WebsiteSubCategory.find(item2 => item2.id === web_sub_category) || null)
    } else {
      localStorage.removeItem("website_sub_category_id")
      setWebsiteSubCategory(null)
      setFirst(true);
    }
  }, [web_sub_category, webCategoryData])

  console.log({ websiteSubCategory });

  const Context = {
    id: websiteSubCategory?.id,
    websiteSubCategory,
    setWebsiteSubCategory,
    isLoading,
    setIsLoading,
    webCategoryData,
    setWebCategoryData,
  };

  // const mainColor = websiteSubCategory?.main_color || "#0091FF";

  // const shades = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

  // const styles = `
  //   .bg-gradient {background: linear-gradient(145deg, ${
  //     websiteSubCategory?.secondary_color
  //   }, ${websiteSubCategory?.main_color});}
  //   .bg-main { background-color: ${mainColor}; }
  //   .data-\[state\=active\]\:bg-main { background-color: ${mainColor}; }
  //   .text-main { color: ${mainColor}; }
  //   .ring-main { --tw-ring-color: ${mainColor}; }
  //   .ring-offset-background {
  //         --tw-ring-offset-color: ${mainColor};
  //   }
  //   ${shades
  //     .map((color) => {
  //       const value = `${hexToRgba(mainColor, color / 100)}`;
  //       return `
  //       .bg-main\\/${color} { background-color: ${value}; }
  //       .hover\\:bg-main\\/${color}:hover { background-color: ${value}; }
  //       .focus\\:bg-main\\/${color}:focus { background-color: ${value}; }

  //       .data-\[state\=active\]\:bg-main\\/${color} { background-color: ${value}; }
  //       .ring-main\\/${color} {
  //         --tw-ring-color: ${value};
  //       }
  //       .ring-offset-background\\/${color}  {
  //         --tw-ring-offset-color: ${value};
  //       }

  //       .text-main\\/${color} { color: ${value}; }
  //       .hover\\:text-main\\/${color} { color: ${value}; }
  //       .focus\\:text-main\\/${color} { color: ${value}; }
  //       `;
  //     })
  //     .join("")}
  // `;

  if (isLoading) {
    return (
      <div className="flex w-full h-full fixed top-0 left-0 justify-center items-center">
        <Loader2 className="animate-spin w-4 h-4" />
      </div>
    );
  }

  if (first) {
    return (
      <WebsiteSubCategoryContext.Provider value={Context}>
        <div className="fixed top-0 left-0 h-full w-full justify-center items-center">
          <ChooseWebCategory first />
        </div>
      </WebsiteSubCategoryContext.Provider>
    );
  }

  return (
    <WebsiteSubCategoryContext.Provider value={Context}>
      <NextTopLoader
        color={websiteSubCategory?.main_color || '#0091FF'}
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #0091FF,0 0 5px #0091FF"
      />
      <style>{getMainStyles(websiteSubCategory)}</style>
      {children}
    </WebsiteSubCategoryContext.Provider>
  );
}

interface WebsiteSubCategoryContextType {
  id: string | undefined;
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
      'useWebsiteSubCategory must be used within an WebsiteSubCategoryContext',
    );
  }
  return context;
};
