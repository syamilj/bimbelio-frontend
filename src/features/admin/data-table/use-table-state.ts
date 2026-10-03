'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import {
  applyTablePatch,
  parseTableState,
  type TableSort,
  type TableState,
  type TableStateConfig,
  type TableStatePatch,
} from './table-state';

export type TableController = TableState & {
  config: TableStateConfig;
  update: (patch: TableStatePatch) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (sort: TableSort | null) => void;
  setSearch: (q: string) => void;
  setFilter: (key: string, value: string | undefined) => void;
  reset: () => void;
};

/**
 * State tabel (halaman, ukuran, urutan, cari, filter) yang hidup di URL, jadi
 * bisa dibagikan, bertahan saat reload, dan ikut tombol back. Komponen yang
 * memakai hook ini harus berada di dalam `<Suspense>` (aturan Next untuk
 * `useSearchParams`).
 */
export function useTableState(config: TableStateConfig = {}): TableController {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const key = params.toString();
  const configKey = JSON.stringify(config);

  const state = useMemo(
    () => parseTableState(new URLSearchParams(key), config),
    // config biasanya literal objek; bandingkan isinya, bukan identitasnya.
    [key, configKey],
  );

  const update = useCallback(
    (patch: TableStatePatch) => {
      const next = applyTablePatch(
        new URLSearchParams(window.location.search),
        patch,
        config,
      );
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, configKey],
  );

  return useMemo(
    () => ({
      ...state,
      config,
      update,
      setPage: (page) => update({ page }),
      setPageSize: (pageSize) => update({ pageSize }),
      setSort: (sort) => update({ sort }),
      setSearch: (q) => update({ q }),
      setFilter: (k, value) => update({ filters: { [k]: value } }),
      reset: () =>
        update({
          q: '',
          sort: config.defaultSort ?? null,
          filters: Object.fromEntries(
            (config.filterKeys ?? []).map((k) => [k, undefined]),
          ),
        }),
    }),
    [state, update],
  );
}
