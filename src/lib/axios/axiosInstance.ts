// utils/axiosInstance.js
import { env } from '@/env.mjs';
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
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

    if (urlPathname.length > 1) {
      config.params = {
        ...config.params,
        website_sub_category_id: urlPathname[1],
      };
    }

    const token = Cookies.get('token');
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
