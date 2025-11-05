'use client';

// ✅ Guard check for SSR - localStorage/window only available in browser
const getStoredSubCategoryId = (): string | null => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage?.getItem('website_sub_category_id') || null;
};

export const website_sub_category_id = getStoredSubCategoryId();

const urlPathname =
  typeof window !== 'undefined' ? window.location.pathname.split('/') : [];

export const website_sub_category_id_params =
  urlPathname.length > 1 && urlPathname[1].length > 0
    ? urlPathname[1]
    : website_sub_category_id;
