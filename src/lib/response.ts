import { toaster } from '@/components/ui/toaster';
// import axiosInstance from "./axios/axiosInstance";

export const responseError = (
  error: any,
  showToast?: boolean,
  toastMessage?: string,
  toastTitle?: string,
  duration?: number,
) => {
  const jsError =
    typeof error?.message === 'string' ? error?.message : undefined;

  if (showToast) {
    toaster({
      title: toastTitle || 'Gagal',
      condition: 'warning',
      description:
        toastMessage ||
        (error as any)?.response?.data?.message ||
        jsError ||
        'Internal Server Error',
      duration: duration || 2500,
    });
  }
  console.log({ error });
  return {
    error,
    message:
      ((error as any)?.response?.data?.message as string) ||
      'Internal Server Error',
    status: ((error as any)?.response?.data?.status as number) || 500,
  };
};

export const throwError = (status: number, message?: string) => {
  const error = new Error(message || 'Terjadi kesalahan pada server');
  (error as any).status = status || 500;
  throw error;
};

export const response = (
  res: any,
  showToast?: boolean,
  toastMessage?: string,
  toastTitle?: string,
): {
  message: string;
  status: number;
  data?: any;
  page?: number;
  total_pages?: number;
  total_data?: number;
} => {
  if (showToast) {
    toaster({
      title: toastTitle || 'Berhasil',
      condition: 'success',
      description: toastMessage || res.data.message || 'Berhasil',
      duration: 2500,
    });
  }
  return res.data;
};
