import { useState } from 'react';
import { mutateGeneral } from './fetch-helper';

export type UseMutationDataType<Data, ErrorData = any> = Omit<
  FetchReturnType,
  'data' | 'error'
> & {
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

export const useMutation = <T,>(
  url: string,
  type: 'post' | 'put' | 'delete',
  more?: MoreProps,
): FetchReturnType => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);
  const [success, setSuccess] = useState<SuccessType | null>(null);

  const mutate = async (optional?: { payload?: any; params?: object }) => {
    const res = await mutateGeneral(url, {
      ...more,
      payload: {
        ...more?.payload,
        ...optional?.payload,
      },
      params: {
        ...more?.params,
        ...optional?.params,
      },
      type,
      setLoading: setIsLoading,
      onLoading() {
        if (more?.onLoading) more.onLoading();
      },
      onSuccess(successData) {
        if (more?.onSuccess) more.onSuccess(successData);
        setSuccess(successData);
      },
      onError(errorData) {
        if (more?.onError) more.onError(errorData);
        setError(errorData);
      },
    });
    return res;
  };

  return {
    mutate,
    isLoading,
    success,
    error,
  };
};

type MoreProps = {
  params?: object;
  payload?: any;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
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
  onLoading?: () => any;
  onSuccess?: ({
    message,
    status,
    data,
  }: {
    message: string;
    status: number;
    data?: any;
  }) => any;
  onError?: ({
    status,
    message,
    error,
  }: {
    status: number;
    message: string;
    error: any;
  }) => any;
};

type ErrorType = { data: any; error: any; message: string; status: number };
type SuccessType = {
  message: string;
  status: number;
  data?: any;
};

type FetchReturnType = {
  mutate: (optional?: { payload?: any; params?: object }) => Promise<
    | {
        message: string;
        status: number;
        data?: any;
        page?: number;
        total_pages?: number;
      }
    | undefined
  >;
  isLoading: boolean;
  success: SuccessType | null;
  error: ErrorType | null;
};
