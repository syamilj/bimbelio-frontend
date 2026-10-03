import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { navigation } from '../../../../test/utils/next-navigation';
import { renderWithProviders } from '../../../../test/utils/render';
import { DataTable, type DataTableColumn } from './data-table';
import { applyClientTableState } from './table-state';
import { useTableState } from './use-table-state';

vi.mock(
  'next/navigation',
  () => import('../../../../test/utils/next-navigation'),
);

type Row = { id: string; title: string; status: string; n: number };
const ROWS: Row[] = Array.from({ length: 23 }, (_, i) => ({
  id: `id-${i}`,
  title: `Try Out ${i + 1}`,
  status: i % 3 === 0 ? 'DRAFT' : 'PUBLIC',
  n: i,
}));

const columns: DataTableColumn<Row>[] = [
  { id: 'title', header: 'Judul', cell: (r) => r.title, sortable: true },
  { id: 'status', header: 'Status', cell: (r) => r.status },
  { id: 'id', header: 'ID', cell: (r) => r.id, mono: true },
];

function Harness(props: {
  rows?: Row[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  onDelete?: (r: Row) => void;
  onBulk?: (r: Row[]) => void;
  expandable?: boolean;
}) {
  const table = useTableState({ filterKeys: ['status'] });
  const view = applyClientTableState(props.rows ?? ROWS, table, {
    searchText: (r) => r.title,
    sortValue: { title: (r) => r.n },
    filterFn: { status: (r, v) => r.status === v },
  });
  return (
    <DataTable
      caption="Daftar try out"
      table={table}
      columns={columns}
      rows={props.isLoading ? undefined : view.rows}
      total={view.total}
      pageCount={view.pageCount}
      getRowId={(r) => r.id}
      getRowLabel={(r) => r.title}
      isLoading={props.isLoading}
      error={props.error}
      onRetry={props.onRetry}
      searchPlaceholder="Cari try out"
      filters={[
        {
          id: 'status',
          label: 'Status',
          options: [
            { value: 'PUBLIC', label: 'Publik' },
            { value: 'DRAFT', label: 'Draf' },
          ],
        },
      ]}
      rowActions={(r) => [
        {
          label: 'Hapus',
          destructive: true,
          onSelect: () => props.onDelete?.(r),
        },
      ]}
      bulkActions={
        props.onBulk
          ? (selected) => (
              <button
                type="button"
                onClick={() => props.onBulk!(selected)}
              >
                Arsipkan
              </button>
            )
          : undefined
      }
      renderExpanded={
        props.expandable ? (r) => <p>Detail {r.title}</p> : undefined
      }
      empty={{ title: 'Belum ada try out' }}
    />
  );
}

const table = () => screen.getByRole('table', { name: 'Daftar try out' });
const bodyRows = () => within(table()).getAllByRole('row').slice(1);

beforeEach(() => navigation.set('/utbk/admin/tryout'));

describe('DataTable', () => {
  it('menampilkan halaman pertama dan ringkasan jumlah', () => {
    renderWithProviders(<Harness />);
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText('1–10 dari 23')).toBeInTheDocument();
  });

  it('paginasi tersimpan di URL', async () => {
    const { user } = renderWithProviders(<Harness />);
    await user.click(
      screen.getByRole('button', { name: 'Halaman berikutnya' }),
    );
    expect(navigation.search.get('page')).toBe('2');
    expect(screen.getByText('11–20 dari 23')).toBeInTheDocument();
    expect(within(table()).getByText('Try Out 11')).toBeInTheDocument();
  });

  it('membaca state awal dari URL', () => {
    navigation.set('/utbk/admin/tryout?page=3&q=Try');
    renderWithProviders(<Harness />);
    expect(bodyRows()).toHaveLength(3);
  });

  it('mencari mengembalikan halaman ke 1', async () => {
    navigation.set('/utbk/admin/tryout?page=2');
    const { user } = renderWithProviders(<Harness />);
    await user.type(
      screen.getByRole('searchbox', { name: 'Cari try out' }),
      'Out 2',
    );
    await waitFor(() => expect(navigation.search.get('q')).toBe('Out 2'));
    expect(navigation.search.get('page')).toBeNull();
  });

  it('urutkan lewat header kolom (aria-sort ikut berubah)', async () => {
    const { user } = renderWithProviders(<Harness />);
    const header = screen.getByRole('columnheader', { name: /Judul/ });
    await user.click(within(header).getByRole('button'));
    expect(navigation.search.get('sort')).toBe('title');
    await user.click(within(header).getByRole('button'));
    expect(navigation.search.get('sort')).toBe('-title');
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(within(bodyRows()[0]).getByText('Try Out 23')).toBeInTheDocument();
  });

  it('kosong karena filter menawarkan hapus filter', async () => {
    navigation.set('/utbk/admin/tryout?q=tidak-ada');
    const { user } = renderWithProviders(<Harness />);
    expect(screen.getByText('Tidak ada yang cocok')).toBeInTheDocument();
    await user.click(
      screen.getAllByRole('button', { name: /Hapus filter/ })[0],
    );
    expect(navigation.search.get('q')).toBeNull();
  });

  it('kosong tanpa filter memakai pesan kosong', () => {
    renderWithProviders(<Harness rows={[]} />);
    expect(screen.getByText('Belum ada try out')).toBeInTheDocument();
  });

  it('memuat menampilkan kerangka, gagal menampilkan tombol coba lagi', async () => {
    const { rerender, user } = renderWithProviders(<Harness isLoading />);
    expect(table()).toHaveAttribute('aria-busy', 'true');
    const retry = vi.fn();
    rerender(
      <Harness
        error={new Error('Server sibuk')}
        onRetry={retry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Server sibuk');
    await user.click(screen.getByRole('button', { name: /Coba lagi/ }));
    expect(retry).toHaveBeenCalled();
  });

  it('aksi per baris lewat menu', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(<Harness onDelete={onDelete} />);
    await user.click(
      within(table()).getByRole('button', { name: 'Aksi untuk Try Out 1' }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Hapus' }));
    expect(onDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'id-0' }),
    );
  });

  it('seleksi massal: pilih semua di halaman lalu jalankan aksi', async () => {
    const onBulk = vi.fn();
    const { user } = renderWithProviders(<Harness onBulk={onBulk} />);
    await user.click(
      within(table()).getByRole('checkbox', {
        name: 'Pilih semua baris di halaman ini',
      }),
    );
    expect(screen.getByText('10 dipilih')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Arsipkan' }));
    expect(onBulk.mock.calls[0][0]).toHaveLength(10);
    await user.click(screen.getByRole('button', { name: /Batalkan pilihan/ }));
    expect(screen.queryByText('10 dipilih')).not.toBeInTheDocument();
  });

  it('baris bisa dibuka untuk detail', async () => {
    const { user } = renderWithProviders(<Harness expandable />);
    const toggle = within(table()).getByRole('button', {
      name: 'Buka detail Try Out 1',
    });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(within(table()).getByText('Detail Try Out 1')).toBeInTheDocument();
  });
});
