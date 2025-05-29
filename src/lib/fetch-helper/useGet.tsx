import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { getGeneral } from './fetch-helper';

export type UseGetDataType<Data, ErrorData = any> = Omit<
  FetchReturnType,
  'data' | 'error'
> & {
  data: Data | null;
  success:
    | (Omit<SuccessType, 'data'> & {
        data?: Data | null;
      })
    | null;
  error:
    | (Omit<ErrorType, 'data'> & {
        data: ErrorData | null;
      })
    | null;
};

export const useGet = <T,>(url: string, more?: MoreProps): FetchReturnType => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorType | null>(null);
  const [success, setSuccess] = useState<SuccessType | null>(null);

  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const refetch = async () => {
    const res = await getGeneral(url, {
      ...more,
      setLoading: setIsLoading,
      setData: setData,
      setPage: setPage,
      setTotalPages: setTotalPages,
      onError(errorData) {
        setError(errorData);
      },
    });
    return res;
  };

  const initialFetch = useDebouncedCallback(refetch);

  useEffect(() => {
    initialFetch();
  }, more?.useEffectDependencies || []);

  return {
    data: data,
    isLoading,
    success,
    error,
    refetch,
    page,
    totalPages,
  };
};

type MoreProps = {
  params?: object;
  firstLoad?: boolean;
  endLoad?: boolean;
  hideToast?: boolean;
  toast?: {
    hideSuccess?: boolean;
    hideError?: boolean;
    successTitle?: string;
    successMsg?: string;
    errorTitle?: string;
    errorMsg?: string;
  };
  onSuccess?: (params: { message: string; status: number; data?: any }) => any;
  onError?: (params: {
    status: number;
    message: string;
    error: any;
    data: any;
  }) => any;
  useEffectDependencies?: any[];
};

type ErrorType = { data: any; error: any; message: string; status: number };
type SuccessType = {
  message: string;
  status: number;
  data?: any;
};

type FetchReturnType = {
  data: any;
  isLoading: boolean;
  error: ErrorType | null;
  success: SuccessType | null;
  refetch: () => Promise<
    | {
        message: string;
        status: number;
        data?: any;
        page?: number;
        total_pages?: number;
      }
    | undefined
  >;
  page: number;
  totalPages: number;
};
