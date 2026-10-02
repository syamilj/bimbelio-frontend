import { MutationCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from './client';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
    mutationMeta: {
      /** Pesan toast saat berhasil. Tanpa ini, mutasi tidak memunculkan toast sukses. */
      successMessage?: string;
      /** Set false untuk menangani error sendiri (default: toast pesan error). */
      toastError?: boolean;
    };
  }
}

const shouldRetry = (failureCount: number, error: ApiError) => {
  // 4xx adalah jawaban final dari server; ulangi hanya gangguan jaringan/5xx.
  if (error.status >= 400 && error.status < 500) return false;
  return failureCount < 2;
};

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
    mutationCache: new MutationCache({
      onSuccess: (_data, _vars, _ctx, mutation) => {
        const message = mutation.meta?.successMessage;
        if (message) toast.success(message);
      },
      onError: (error, _vars, _ctx, mutation) => {
        if (mutation.meta?.toastError === false) return;
        toast.error(error.message);
      },
    }),
  });
