'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import { ErrorState } from './error-state';
import { SectionLoader } from './page-loader';

type QueryStateProps<T> = {
  query: UseQueryResult<T>;
  children: (data: T) => React.ReactNode;
  /** Tampilan saat memuat pertama kali; default: BubbleLoader. Pakai Skeleton yang menyerupai konten bila bisa. */
  loading?: React.ReactNode;
  /** Ditampilkan bila `isEmpty(data)` bernilai true. */
  empty?: React.ReactNode;
  isEmpty?: (data: T) => boolean;
  errorTitle?: string;
};

const defaultIsEmpty = (data: unknown) =>
  data == null || (Array.isArray(data) && data.length === 0);

/**
 * Satu pola untuk tiga keadaan asinkron: memuat, gagal, kosong.
 * Saat refetch di latar belakang, data lama tetap ditampilkan.
 */
export function QueryState<T>({
  query,
  children,
  loading,
  empty,
  isEmpty = defaultIsEmpty,
  errorTitle,
}: QueryStateProps<T>) {
  if (query.isPending) return <>{loading ?? <SectionLoader />}</>;

  if (query.isError) {
    return (
      <ErrorState
        error={query.error}
        title={errorTitle}
        onRetry={() => query.refetch()}
        retrying={query.isRefetching}
      />
    );
  }

  if (empty && isEmpty(query.data)) return <>{empty}</>;

  return <>{children(query.data)}</>;
}
