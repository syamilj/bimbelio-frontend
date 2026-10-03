import { describe, expect, it } from 'vitest';
import {
  applyClientTableState,
  applyTablePatch,
  nextSort,
  parseTableState,
} from './table-state';

const qs = (s: string) => new URLSearchParams(s);

describe('parseTableState', () => {
  it('membaca halaman, ukuran, urutan, cari, dan filter yang dikenal', () => {
    const state = parseTableState(
      qs('page=3&size=20&sort=-title&q= ipa &status=PUBLIC&lain=x'),
      { filterKeys: ['status'] },
    );
    expect(state).toEqual({
      page: 3,
      pageSize: 20,
      sort: { id: 'title', dir: 'desc' },
      q: 'ipa',
      filters: { status: 'PUBLIC' },
    });
  });

  it('nilai tidak valid jatuh ke default', () => {
    const state = parseTableState(qs('page=-1&size=7'), {
      defaultSort: { id: 'date', dir: 'desc' },
    });
    expect(state.page).toBe(1);
    expect(state.pageSize).toBe(10);
    expect(state.sort).toEqual({ id: 'date', dir: 'desc' });
  });

  it('awalan memisahkan dua tabel di satu halaman', () => {
    const state = parseTableState(qs('page=2&sub.page=4&sub.q=fis'), {
      prefix: 'sub.',
    });
    expect(state.page).toBe(4);
    expect(state.q).toBe('fis');
  });
});

describe('applyTablePatch', () => {
  it('mengubah filter/cari/urut/ukuran mengembalikan halaman ke 1', () => {
    const base = qs('page=5&tab=quiz');
    for (const patch of [
      { q: 'abc' },
      { filters: { status: 'DRAFT' } },
      { sort: { id: 'title', dir: 'asc' as const } },
      { pageSize: 50 },
    ]) {
      const next = applyTablePatch(base, patch, { filterKeys: ['status'] });
      expect(next.get('page')).toBeNull();
      expect(next.get('tab')).toBe('quiz');
    }
  });

  it('halaman 1, ukuran default, dan urutan default tidak ditulis ke URL', () => {
    const next = applyTablePatch(
      qs('page=2&size=20&sort=-date'),
      { page: 1, pageSize: 10, sort: { id: 'date', dir: 'desc' } },
      { defaultSort: { id: 'date', dir: 'desc' } },
    );
    expect(next.toString()).toBe('');
  });

  it('filter kosong dihapus', () => {
    const next = applyTablePatch(qs('status=PUBLIC'), {
      filters: { status: undefined },
    });
    expect(next.has('status')).toBe(false);
  });

  it('halaman eksplisit tetap dipakai', () => {
    expect(applyTablePatch(qs(''), { page: 3 }).get('page')).toBe('3');
  });
});

describe('nextSort', () => {
  it('naik → turun → tanpa urutan; kolom lain mulai dari naik', () => {
    expect(nextSort(null, 'a')).toEqual({ id: 'a', dir: 'asc' });
    expect(nextSort({ id: 'a', dir: 'asc' }, 'a')).toEqual({
      id: 'a',
      dir: 'desc',
    });
    expect(nextSort({ id: 'a', dir: 'desc' }, 'a')).toBeNull();
    expect(nextSort({ id: 'a', dir: 'desc' }, 'b')).toEqual({
      id: 'b',
      dir: 'asc',
    });
  });
});

describe('applyClientTableState', () => {
  const rows = Array.from({ length: 25 }, (_, i) => ({
    id: `${i}`,
    title: `Try Out ${String(i + 1).padStart(2, '0')}`,
    status: i % 2 ? 'DRAFT' : 'PUBLIC',
    n: i,
  }));

  it('cari, filter, urut, dan potong halaman', () => {
    const view = applyClientTableState(
      rows,
      {
        page: 2,
        pageSize: 5,
        sort: { id: 'n', dir: 'desc' },
        q: 'try',
        filters: { status: 'PUBLIC' },
      },
      {
        searchText: (r) => r.title,
        sortValue: { n: (r) => r.n },
        filterFn: { status: (r, v) => r.status === v },
      },
    );
    expect(view.total).toBe(13);
    expect(view.pageCount).toBe(3);
    expect(view.rows.map((r) => r.n)).toEqual([14, 12, 10, 8, 6]);
  });

  it('halaman di luar jangkauan dijepit ke halaman terakhir', () => {
    const view = applyClientTableState(rows, {
      page: 99,
      pageSize: 10,
      sort: null,
      q: '',
      filters: {},
    });
    expect(view.rows).toHaveLength(5);
  });
});
