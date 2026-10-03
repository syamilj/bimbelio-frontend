import { render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { navigation } from '../../../../test/utils/next-navigation';
import { renderWithProviders } from '../../../../test/utils/render';
import { TextField } from '../resource-form/fields';
import { AdminPageHeader } from './admin-page-header';
import { CategoryManager, defineCategoryLevel } from './category-manager';

vi.mock(
  'next/navigation',
  () => import('../../../../test/utils/next-navigation'),
);

describe('AdminPageHeader', () => {
  it('judul h1, breadcrumb dengan halaman aktif, dan aksi', () => {
    render(
      <AdminPageHeader
        title="Ubah try out"
        meta="id · abc123"
        breadcrumbs={[
          { label: 'Try out', href: '/utbk/admin/tryout' },
          { label: 'TO #12' },
        ]}
        actions={<button type="button">Simpan</button>}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Ubah try out' }),
    ).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Jejak halaman' });
    expect(within(nav).getByRole('link', { name: 'Try out' })).toHaveAttribute(
      'href',
      '/utbk/admin/tryout',
    );
    expect(within(nav).getByText('TO #12')).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('id · abc123')).toBeInTheDocument();
  });
});

type Cat = { id: string; name: string; total: number };
type Sub = { id: string; name: string; parent: string };

function Manager({
  cats,
  subs,
  onCreate,
  onUpdate,
  onDelete,
}: {
  cats: Cat[];
  subs: Sub[];
  onCreate: (v: { name: string }) => Promise<unknown>;
  onUpdate: (row: Cat, v: { name: string }) => Promise<unknown>;
  onDelete: (row: Cat) => Promise<unknown>;
}) {
  const schema = z.object({
    name: z.string().trim().min(1, 'Nama wajib diisi'),
  });
  const query = <T,>(data: T[]) => ({
    data,
    isPending: false,
    error: null,
    refetch: vi.fn(),
  });
  return (
    <CategoryManager
      levels={[
        defineCategoryLevel<Cat, typeof schema>({
          key: 'category',
          label: 'Kategori',
          noun: 'kategori',
          query: query(cats),
          columns: [
            { id: 'name', header: 'Nama', cell: (r) => r.name },
            { id: 'total', header: 'Dokumen', cell: (r) => r.total },
          ],
          getId: (r) => r.id,
          getName: (r) => r.name,
          schema,
          emptyValues: { name: '' },
          toValues: (r) => ({ name: r.name }),
          renderFields: () => (
            <TextField
              name="name"
              label="Nama kategori"
            />
          ),
          onCreate,
          onUpdate,
          onDelete,
        }),
        defineCategoryLevel<Sub, typeof schema>({
          key: 'sub',
          label: 'Subkategori',
          noun: 'subkategori',
          query: query(subs),
          columns: [{ id: 'name', header: 'Nama', cell: (r) => r.name }],
          getId: (r) => r.id,
          getName: (r) => r.name,
          schema,
          emptyValues: { name: '' },
          toValues: (r) => ({ name: r.name }),
          renderFields: () => (
            <TextField
              name="name"
              label="Nama subkategori"
            />
          ),
          onCreate: vi.fn(),
          onUpdate: vi.fn(),
        }),
      ]}
    />
  );
}

beforeEach(() => navigation.set('/utbk/admin/category'));

describe('CategoryManager', () => {
  const cats = [
    { id: 'c1', name: 'Matematika', total: 3 },
    { id: 'c2', name: 'Biologi', total: 0 },
  ];
  const subs = [{ id: 's1', name: 'Aljabar', parent: 'c1' }];

  it('tab per level tersimpan di URL', async () => {
    const { user } = renderWithProviders(
      <Manager
        cats={cats}
        subs={subs}
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('table', { name: 'Daftar kategori' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /Subkategori/ }));
    expect(navigation.search.get('tab')).toBe('sub');
    expect(
      await screen.findByRole('table', { name: 'Daftar subkategori' }),
    ).toBeInTheDocument();
  });

  it('tambah: validasi lalu kirim, dialog tertutup', async () => {
    const onCreate = vi.fn(async () => undefined);
    const { user } = renderWithProviders(
      <Manager
        cats={cats}
        subs={subs}
        onCreate={onCreate}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Tambah kategori' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Tambah kategori',
    });
    await user.click(within(dialog).getByRole('button', { name: 'Simpan' }));
    expect(
      await within(dialog).findByText('Nama wajib diisi'),
    ).toBeInTheDocument();
    await user.type(within(dialog).getByLabelText('Nama kategori'), 'Fisika');
    await user.click(within(dialog).getByRole('button', { name: 'Simpan' }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({ name: 'Fisika' }),
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('ubah: form terisi nilai baris', async () => {
    const onUpdate = vi.fn(async () => undefined);
    const { user } = renderWithProviders(
      <Manager
        cats={cats}
        subs={subs}
        onCreate={vi.fn()}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />,
    );
    const table = screen.getByRole('table', { name: 'Daftar kategori' });
    await user.click(
      within(table).getByRole('button', { name: 'Aksi untuk Biologi' }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Ubah' }));
    const dialog = await screen.findByRole('dialog', { name: 'Ubah kategori' });
    const input = within(dialog).getByLabelText('Nama kategori');
    expect(input).toHaveValue('Biologi');
    await user.clear(input);
    await user.type(input, 'Biologi Sel');
    await user.click(within(dialog).getByRole('button', { name: 'Simpan' }));
    await waitFor(() =>
      expect(onUpdate).toHaveBeenCalledWith(cats[1], { name: 'Biologi Sel' }),
    );
  });

  it('hapus meminta konfirmasi', async () => {
    const onDelete = vi.fn(async () => undefined);
    const { user } = renderWithProviders(
      <Manager
        cats={cats}
        subs={subs}
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={onDelete}
      />,
    );
    const table = screen.getByRole('table', { name: 'Daftar kategori' });
    await user.click(
      within(table).getByRole('button', { name: 'Aksi untuk Matematika' }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Hapus' }));
    const alert = await screen.findByRole('alertdialog');
    expect(alert).toHaveTextContent('Hapus kategori "Matematika"?');
    await user.click(
      within(alert).getByRole('button', { name: 'Hapus kategori' }),
    );
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith(cats[0]));
  });

  it('cari menyaring baris', async () => {
    const { user } = renderWithProviders(
      <Manager
        cats={cats}
        subs={subs}
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    await user.type(
      screen.getByRole('searchbox', { name: 'Cari kategori…' }),
      'bio',
    );
    await waitFor(() =>
      expect(navigation.search.get('category.q')).toBe('bio'),
    );
    const table = screen.getByRole('table', { name: 'Daftar kategori' });
    expect(within(table).queryByText('Matematika')).not.toBeInTheDocument();
  });
});
