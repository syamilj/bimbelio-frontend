// utils/axiosInstance.js
import { env } from '@/env.mjs';
import { getAuthToken } from '@/lib/auth-helper';
import axios from 'axios';

const axiosInstanceWithToken = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  // Cookie sesi httpOnly ikut terkirim (lihat httpOnlySession).
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan interceptor untuk inject token secara otomatis
axiosInstanceWithToken.interceptors.request.use(
  (config) => {
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

export default axiosInstanceWithToken;
