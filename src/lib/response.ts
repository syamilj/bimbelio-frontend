import { toaster } from '@/components/ui/toaster';
// import axiosInstance from "./axios/axiosInstance";

export const responseError = (
  error: any,
  showToast?: boolean,
  toastMessage?: string,
  toastTitle?: string,
) => {
  if (showToast) {
    toaster({
      title: toastTitle || 'Error',
      condition: 'warning',
      description:
        toastMessage ||
        (error as any).response.data.message ||
        'Internal Server Error',
      duration: 2500,
    });
  }
  return {
    error,
    message:
      ((error as any)?.response?.data?.message as string) ||
      'Internal Server Error',
    status: ((error as any)?.response?.data?.status as number) || 500,
  };
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
} => {
  if (showToast) {
    toaster({
      title: toastTitle || 'Successfully',
      condition: 'success',
      description: toastMessage || res.data.message || 'Succesfully',
      duration: 2500,
    });
  }
  return res.data;
};
