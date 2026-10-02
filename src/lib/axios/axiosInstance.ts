// utils/axiosInstance.js
import { env } from '@/env.mjs';
import { getAuthToken } from '@/lib/auth-helper';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  // Cookie sesi httpOnly ikut terkirim (lihat httpOnlySession).
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // const website_sub_category_id = localStorage.getItem(
    //   'website_sub_category_id',
    // );

    // config.params = {
    //   ...config.params,
    //   website_sub_category_id,
    // };

    const urlPathname = window.location.pathname.split('/');

    if (urlPathname.length > 2) {
      const isThere = config.params?.website_sub_category_id;
      if (!isThere) {
        config.params = {
          ...config.params,
          website_sub_category_id: urlPathname[1],
        };
      }
    }

    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
