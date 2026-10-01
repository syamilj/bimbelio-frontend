'use client';

import axiosInstanceRaw from '@/lib/axios/axiosInstanceRaw';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { response } from '@/lib/response';
import { trackIdFromPath } from '@/lib/api/client';
import { trackThemeCss } from '@/lib/theme/track-theme';
import {
  WebsiteCategory,
  WebsiteSubCategory,
  WebsiteSubCategoryTypeEnum,
} from '@/types/database';
import { useParams, usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import { createContext, useContext, useEffect, useState } from 'react';
import { DialogWebCategory } from '../ui/choose-web-category/dialog-web-category';
import { LoadingFixed } from '../ui/loading/loading-fixed';
import { useSession } from './provider-session-auth';

const initialValue: WebsiteSubCategory = {
  id: 'guest',
  main_color: '#0091FF',
  secondary_color: '#5aa4dd',
  name: 'guest',
  createdAt: new Date(),
  updatedAt: new Date(),
  website_category_id: 'guest',
  sharing_website_sub_category_ids: [],
  type: 'GENERAL',
};

export default function ProviderWebsiteCategory({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAppArea = trackIdFromPath(pathname) !== undefined;
  const { data: session } = useSession();
  const { web_sub_category } = useParams<{ web_sub_category: string }>();
  const [first, setFirst] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [webCategoryData, setWebCategoryData] = useState<
    (WebsiteCategory & { WebsiteSubCategory: WebsiteSubCategory[] })[]
  >([]);

  const [websiteSubCategory, setWebsiteSubCategory] =
    useState<WebsiteSubCategory | null>(null);

  const websiteSubCategoryType = websiteSubCategory?.type || 'GENERAL';
  const sharingWebSubIds =
    websiteSubCategory?.sharing_website_sub_category_ids || [];

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
          if (isAppArea) {
            setFirst(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      if (!session) setWebsiteSubCategory(initialValue);
      else if (isAppArea) {
        setFirst(true);
      }

      setIsLoading(false);
    }
  };

  // Daftar track jarang berubah: muat sekali per sesi, bukan per navigasi.
  // Beranda (/) tidak butuh track sehingga request ditunda sampai keluar dari /.
  const isHome = pathname === '/';
  // Pemilih track hanya relevan di area aplikasi (/<track>/user|admin).
  useEffect(() => {
    if (isHome) {
      setIsLoading(false);
      return;
    }
    getWebSubCategory();
    getGeneral('/website-category/getWebsiteCategory', {
      setData: setWebCategoryData,
    });
  }, [session, isHome]);

  useEffect(() => {
    if (webCategoryData.length === 0 || !web_sub_category) return;
    const find = webCategoryData.find((item) =>
      item.WebsiteSubCategory.find((item2) => item2.id === web_sub_category),
    );
    if (find) {
      localStorage.setItem('website_sub_category_id', web_sub_category);
      setWebsiteSubCategory(
        find.WebsiteSubCategory.find(
          (item2) => item2.id === web_sub_category,
        ) || null,
      );
    } else {
      localStorage.removeItem('website_sub_category_id');
      setWebsiteSubCategory(null);
      // URL satu segmen yang bukan track (mis. /salah-ketik) → biarkan 404 tampil.
      if (isAppArea) setFirst(true);
    }
  }, [web_sub_category, webCategoryData]);

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const Context = {
    id: websiteSubCategory?.id,
    websiteSubCategory,
    setWebsiteSubCategory,
    isLoading,
    setIsLoading,
    webCategoryData,
    setWebCategoryData,
    websiteSubCategoryType,
    sharingWebSubIds: websiteSubCategoryType === 'CORE' ? sharingWebSubIds : [],
    type: {
      isCore: websiteSubCategoryType === 'CORE',
      isGeneral: websiteSubCategoryType === 'GENERAL',
    },
    mainColor,
    secondaryColor,
  };

  // if (isLoading && pathname !== '/') {
  //   return (
  //     <div className="flex w-full h-full fixed top-0 left-0 justify-center items-center">
  //       <Loader2 className="animate-spin w-4 h-4" />
  //     </div>
  //   );
  // }

  if (first) {
    return (
      <WebsiteSubCategoryContext.Provider value={Context}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-2xl">
            <DialogWebCategory
              items={webCategoryData}
              value={websiteSubCategory?.id}
              isOpen={true}
              onOpenChange={(open) => {
                if (!open) {
                  // Don't allow closing if this is the first selection
                  return;
                }
              }}
              onSelect={(item) => {
                localStorage.setItem('website_sub_category_id', item?.id);
                setWebsiteSubCategory(item);
                setFirst(false);
                // Navigate to the selected category
                const currentPath = window.location.pathname;
                const pathParts = currentPath.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                  window.location.pathname = `/${item.id}/${pathParts.slice(1).join('/')}`;
                } else {
                  window.location.pathname = `/${item.id}/user/bimboard`;
                }
              }}
            />
          </div>
        </div>
      </WebsiteSubCategoryContext.Provider>
    );
  }

  return (
    <WebsiteSubCategoryContext.Provider value={Context}>
      {isLoading && !websiteSubCategory && !isHome && <LoadingFixed />}
      <NextTopLoader
        color="var(--brand)"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow={false}
      />
      <style>
        {trackThemeCss(
          websiteSubCategory?.main_color,
          websiteSubCategory?.secondary_color,
        )}
      </style>
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
  websiteSubCategoryType: WebsiteSubCategoryTypeEnum;
  type: {
    isCore: boolean;
    isGeneral: boolean;
  };
  sharingWebSubIds: string[];
  mainColor: string;
  secondaryColor: string;
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
