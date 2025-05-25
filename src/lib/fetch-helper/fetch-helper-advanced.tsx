import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { getGeneral } from './fetch-helper';

// Mendeklarasikan tipe Error secara eksplisit
type Error = { data: any; error: any; message: string; status: number };

export type FetchReturnType = {
  data: any;
  isLoading: boolean;
  error: Error | null;
  fetchData: () => Promise<
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

export type SetDataType<Data, ErrorData = any> = Omit<
  FetchReturnType,
  'data' | 'error'
> & {
  data: Data | null;
  error:
    | (Omit<Error, 'data'> & {
        data: ErrorData | null;
      })
    | null;
};

export const getGeneralAdvanced = <T,>(
  url: string,
  more?: {
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
    onSuccess?: (params: {
      message: string;
      status: number;
      data?: any;
    }) => any;
    onError?: (params: {
      status: number;
      message: string;
      error: any;
      data: any;
    }) => any;
  },
): FetchReturnType => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchData = async () => {
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

  const initialFetch = useDebouncedCallback(fetchData);

  useEffect(() => {
    initialFetch();
  }, []);

  return {
    data: data,
    isLoading,
    error,
    fetchData,
    page,
    totalPages,
  };
};
