// State tabel admin yang disimpan di URL (pure, tanpa React — mudah diuji).
//
// Kunci query: `page`, `size`, `sort` ("kolom" naik, "-kolom" turun), `q`,
// dan satu kunci per filter (mis. `status=PUBLIC`). Bila satu halaman memuat
// lebih dari satu tabel, beri `prefix` agar kuncinya tidak bertabrakan
// (`sub.page`, `sub.q`, ...).

export type SortDir = 'asc' | 'desc';
export type TableSort = { id: string; dir: SortDir };

export type TableState = {
  page: number;
  pageSize: number;
  sort: TableSort | null;
  q: string;
  filters: Record<string, string>;
};

export type TableStateConfig = {
  /** Awalan kunci query, mis. `sub.` untuk tabel kedua di halaman yang sama. */
  prefix?: string;
  defaultPageSize?: number;
  /** Ukuran halaman yang boleh dipilih; nilai lain dari URL diabaikan. */
  pageSizes?: number[];
  /** Kunci filter yang dibaca dari URL. Kunci lain diabaikan. */
  filterKeys?: string[];
  defaultSort?: TableSort | null;
};

export const DEFAULT_PAGE_SIZES = [10, 20, 50, 100];

const keysFor = (prefix = '') => ({
  page: `${prefix}page`,
  size: `${prefix}size`,
  sort: `${prefix}sort`,
  q: `${prefix}q`,
});

const toPositiveInt = (value: string | null) => {
  if (!value) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export const parseSort = (raw: string | null): TableSort | null => {
  if (!raw) return null;
  const desc = raw.startsWith('-');
  const id = desc ? raw.slice(1) : raw;
  return id ? { id, dir: desc ? 'desc' : 'asc' } : null;
};

export const formatSort = (sort: TableSort | null) =>
  sort ? `${sort.dir === 'desc' ? '-' : ''}${sort.id}` : '';

export function parseTableState(
  params: URLSearchParams,
  config: TableStateConfig = {},
): TableState {
  const keys = keysFor(config.prefix);
  const sizes = config.pageSizes ?? DEFAULT_PAGE_SIZES;
  const defaultSize = config.defaultPageSize ?? sizes[0];
  const size = toPositiveInt(params.get(keys.size));

  const filters: Record<string, string> = {};
  for (const key of config.filterKeys ?? []) {
    const value = params.get(`${config.prefix ?? ''}${key}`);
    if (value) filters[key] = value;
  }

  return {
    page: toPositiveInt(params.get(keys.page)) ?? 1,
    pageSize: size && sizes.includes(size) ? size : defaultSize,
    sort: parseSort(params.get(keys.sort)) ?? config.defaultSort ?? null,
    q: params.get(keys.q)?.trim() ?? '',
    filters,
  };
}

export type TableStatePatch = Partial<Omit<TableState, 'filters'>> & {
  /** Nilai kosong/undefined menghapus filter dari URL. */
  filters?: Record<string, string | undefined>;
};

/**
 * Terapkan perubahan ke query string yang ada (query lain tetap utuh).
 * Mengubah pencarian, filter, urutan, atau ukuran halaman selalu
 * mengembalikan halaman ke 1 — kecuali `page` ikut diberikan.
 */
export function applyTablePatch(
  current: URLSearchParams,
  patch: TableStatePatch,
  config: TableStateConfig = {},
): URLSearchParams {
  const next = new URLSearchParams(current);
  const keys = keysFor(config.prefix);
  const prefix = config.prefix ?? '';
  const sizes = config.pageSizes ?? DEFAULT_PAGE_SIZES;
  const defaultSize = config.defaultPageSize ?? sizes[0];

  const set = (key: string, value: string | null | undefined) => {
    if (value === null || value === undefined || value === '') next.delete(key);
    else next.set(key, value);
  };

  let resetPage = false;

  if (patch.q !== undefined) {
    set(keys.q, patch.q.trim());
    resetPage = true;
  }
  if (patch.filters) {
    for (const [key, value] of Object.entries(patch.filters)) {
      set(`${prefix}${key}`, value);
    }
    resetPage = true;
  }
  if (patch.sort !== undefined) {
    const isDefault =
      formatSort(patch.sort) === formatSort(config.defaultSort ?? null);
    set(keys.sort, isDefault ? null : formatSort(patch.sort) || null);
    resetPage = true;
  }
  if (patch.pageSize !== undefined) {
    set(keys.size, patch.pageSize === defaultSize ? null : `${patch.pageSize}`);
    resetPage = true;
  }

  if (patch.page !== undefined) {
    set(keys.page, patch.page > 1 ? `${patch.page}` : null);
  } else if (resetPage) {
    next.delete(keys.page);
  }

  return next;
}

/** Urutan berikut saat header kolom diklik: naik → turun → tanpa urutan. */
export function nextSort(
  current: TableSort | null,
  columnId: string,
): TableSort | null {
  if (!current || current.id !== columnId) return { id: columnId, dir: 'asc' };
  if (current.dir === 'asc') return { id: columnId, dir: 'desc' };
  return null;
}

export const pageCountFor = (total: number, pageSize: number) =>
  Math.max(1, Math.ceil(total / pageSize));

type ClientOptions<T> = {
  /** Teks yang dicari untuk setiap baris (huruf besar/kecil diabaikan). */
  searchText?: (row: T) => string;
  /** Nilai pembanding per kolom yang bisa diurutkan. */
  sortValue?: Record<string, (row: T) => string | number | Date | null>;
  /** Predikat per kunci filter. */
  filterFn?: Record<string, (row: T, value: string) => boolean>;
};

/**
 * Untuk endpoint yang mengembalikan seluruh data sekaligus: cari, filter,
 * urutkan, lalu potong per halaman di client — state tetap di URL.
 */
export function applyClientTableState<T>(
  rows: readonly T[],
  state: TableState,
  options: ClientOptions<T> = {},
) {
  let result = [...rows];
  const q = state.q.toLowerCase();
  if (q && options.searchText) {
    result = result.filter((row) =>
      options.searchText!(row).toLowerCase().includes(q),
    );
  }
  for (const [key, value] of Object.entries(state.filters)) {
    const fn = options.filterFn?.[key];
    if (fn) result = result.filter((row) => fn(row, value));
  }
  const getValue = state.sort && options.sortValue?.[state.sort.id];
  if (state.sort && getValue) {
    const factor = state.sort.dir === 'asc' ? 1 : -1;
    result.sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);
      if (va === vb) return 0;
      if (va === null || va === undefined) return 1;
      if (vb === null || vb === undefined) return -1;
      const na = va instanceof Date ? va.getTime() : va;
      const nb = vb instanceof Date ? vb.getTime() : vb;
      if (typeof na === 'number' && typeof nb === 'number')
        return (na - nb) * factor;
      return String(na).localeCompare(String(nb), 'id') * factor;
    });
  }
  const total = result.length;
  const pageCount = pageCountFor(total, state.pageSize);
  const page = Math.min(state.page, pageCount);
  const start = (page - 1) * state.pageSize;
  return {
    rows: result.slice(start, start + state.pageSize),
    total,
    pageCount,
    /** Semua baris yang lolos filter (mis. untuk ekspor). */
    filtered: result,
  };
}
