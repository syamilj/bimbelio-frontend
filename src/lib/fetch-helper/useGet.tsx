import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { getGeneral } from './fetch-helper';

// export type UseGetDataType<Data, ErrorData = any> = Omit<
//   FetchReturnType<any>,
//   'data' | 'error'
// > & {
//   data: Data | null;
//   success:
//     | (Omit<SuccessType, 'data'> & {
//         data?: Data | null;
//       })
//     | null;
//   error:
//     | (Omit<ErrorType, 'data'> & {
//         data: ErrorData | null;
//       })
//     | null;
// };

export function useGet<Data = any, ErrorData = any>(
  url: string,
  more?: MoreProps,
): FetchReturnType<Data, ErrorData> {
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorType<ErrorData> | null>(null);
  const [success, setSuccess] = useState<SuccessType<Data> | null>(null);

  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const refetch = async () => {
    const res = await getGeneral(url, {
      ...more,
      setLoading: setIsLoading,
      setData: setData,
      setPage: setPage,
      setTotalPages: setTotalPages,
      onSuccess(successData) {
        setSuccess(successData);
      },
      onError(errorData) {
        setError(errorData);
      },
    });
    return res;
  };

  const initialFetch = useDebouncedCallback(refetch);

  const Dependencies = more?.useEffectDependencies || [];
  const Enabled = more?.enabled !== undefined ? more.enabled : true;

  useEffect(() => {
    if (Enabled) {
      initialFetch();
    }
  }, [...Dependencies, Enabled]);

  return {
    data: data,
    isLoading,
    success,
    error,
    refetch,
    page,
    totalPages,
  };
}

type MoreProps = {
  enabled?: boolean;
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

type ErrorType<Data = any> = {
  data: Data;
  error: any;
  message: string;
  status: number;
};
type SuccessType<Data = any> = {
  message: string;
  status: number;
  data?: Data;
};

type FetchReturnType<Data, ErrorData> = {
  data: Data | null;
  isLoading: boolean;
  error: ErrorType<ErrorData> | null;
  success: SuccessType<Data> | null;
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
