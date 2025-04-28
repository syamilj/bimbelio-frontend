// utils/axiosInstance.js
import { env } from '@/env.mjs';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const website_sub_category_id = localStorage.getItem(
      'website_sub_category_id',
    );

    config.params = {
      ...config.params,
      website_sub_category_id,
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
