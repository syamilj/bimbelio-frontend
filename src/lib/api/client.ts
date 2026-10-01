import { env } from '@/env.mjs';
import { trackIdFromPath } from '@/lib/surface';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

/** Bentuk respons standar backend Bimbelio. */
export type ApiEnvelope<T> = {
  status: number;
  message: string;
  data: T;
  page?: number;
  total_pages?: number;
  total_data?: number;
};

export type Paginated<T> = {
  items: T;
  page: number;
  totalPages: number;
  totalData: number;
};

/** Error bertipe untuk semua kegagalan request (HTTP maupun jaringan). */
export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNetwork() {
    return this.status === 0;
  }
}

const FALLBACK_MESSAGE = 'Terjadi kesalahan. Coba lagi sebentar lagi.';
const NETWORK_MESSAGE =
  'Tidak dapat terhubung ke server. Periksa koneksi internetmu.';

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;
  if (error instanceof AxiosError) {
    if (!error.response) {
      return new ApiError(NETWORK_MESSAGE, 0);
    }
    const body = error.response.data as
      Partial<ApiEnvelope<unknown>> | undefined;
    return new ApiError(
      body?.message || FALLBACK_MESSAGE,
      body?.status || error.response.status,
      body?.data,
    );
  }
  if (error instanceof Error) return new ApiError(error.message, 500);
  return new ApiError(FALLBACK_MESSAGE, 500);
};

/**
 * Di area aplikasi, segmen pertama URL adalah id track (web_sub_category),
 * mis. `/utbk/user/bimboard` (atau `/utbk/bimboard` di app.bimbelio.com).
 * Backend memfilter data per track lewat query `website_sub_category_id`.
 */
export { trackIdFromPath };

export const http = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const token = Cookies.get('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const trackId = trackIdFromPath(window.location.pathname);
  if (trackId && !config.params?.website_sub_category_id) {
    config.params = { ...config.params, website_sub_category_id: trackId };
  }
  return config;
});

http.interceptors.response.use(undefined, (error) =>
  Promise.reject(toApiError(error)),
);

type RequestOptions = Pick<AxiosRequestConfig, 'params' | 'signal' | 'headers'>;

/** GET yang mengembalikan seluruh amplop (untuk data berhalaman). */
export async function getEnvelope<T>(url: string, options?: RequestOptions) {
  const res = await http.get<ApiEnvelope<T>>(url, options);
  return res.data;
}

export const api = {
  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return (await getEnvelope<T>(url, options)).data;
  },

  async paginated<T>(
    url: string,
    options?: RequestOptions,
  ): Promise<Paginated<T>> {
    const body = await getEnvelope<T>(url, options);
    return {
      items: body.data,
      page: body.page ?? 1,
      totalPages: body.total_pages ?? 1,
      totalData: body.total_data ?? 0,
    };
  },

  async post<T>(url: string, body?: unknown, options?: RequestOptions) {
    return (await http.post<ApiEnvelope<T>>(url, body, options)).data;
  },

  async put<T>(url: string, body?: unknown, options?: RequestOptions) {
    return (await http.put<ApiEnvelope<T>>(url, body, options)).data;
  },

  async patch<T>(url: string, body?: unknown, options?: RequestOptions) {
    return (await http.patch<ApiEnvelope<T>>(url, body, options)).data;
  },

  async delete<T>(url: string, options?: RequestOptions & { data?: unknown }) {
    return (await http.delete<ApiEnvelope<T>>(url, options)).data;
  },
};
