'use client';

import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { WebsiteCategory, WebsiteSubCategory } from '@/types/database';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

export default function Provider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<WebsiteCategory[]>([]);

  const [subCategories, setSubCategories] = useState<WebsiteSubCategory[]>([]);

  const getData = async () => {
    await getGeneral('/website-category/getWebsiteCategory?viewCore=true', {
      onSuccess({ data }) {
        const getData: (WebsiteCategory & {
          WebsiteSubCategory: WebsiteSubCategory[];
        })[] = data;
        const category = getData.map((cat) => {
          return {
            id: cat.id,
            name: cat.name,
            main_color: cat.main_color,
            secondary_color: cat.secondary_color,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
          };
        });
        const subCategory = getData
          .map((cat) => {
            return cat.WebsiteSubCategory.map((sub) => {
              return {
                id: sub.id,
                name: sub.name,
                image: sub.image,
                main_color: sub.main_color,
                secondary_color: sub.secondary_color,
                website_category_id: sub.website_category_id,
                sharing_website_sub_category_ids:
                  sub.sharing_website_sub_category_ids,
                type: sub.type,
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt,
              };
            });
          })
          .flat(Infinity);
        setCategories(category);
        setSubCategories(subCategory as any);
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const Context = {
    getData,
    categories,
    setCategories,
    subCategories,
    setSubCategories,
  };

  return (
    <AdminWebCategoryContext.Provider value={Context}>
      {children}
    </AdminWebCategoryContext.Provider>
  );
}

type AdminWebCategoryContextType = {
  getData: () => Promise<void>;
  categories: WebsiteCategory[];
  setCategories: Dispatch<SetStateAction<WebsiteCategory[]>>;
  subCategories: WebsiteSubCategory[];
  setSubCategories: Dispatch<SetStateAction<WebsiteSubCategory[]>>;
};

const AdminWebCategoryContext = createContext<
  AdminWebCategoryContextType | undefined
>(undefined);

export const useAdminWebCategory = () => {
  const context = useContext(AdminWebCategoryContext);
  if (!context) {
    throw new Error(
      'useAdminWebCategory must be used within an AdminWebCategoryContext',
    );
  }
  return context;
};
