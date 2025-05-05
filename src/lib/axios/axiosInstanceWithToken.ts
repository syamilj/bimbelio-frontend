// utils/axiosInstance.js
import { env } from '@/env.mjs';
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstanceWithToken = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan interceptor untuk inject token secara otomatis
axiosInstanceWithToken.interceptors.request.use(
  (config) => {
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

export default axiosInstanceWithToken;
