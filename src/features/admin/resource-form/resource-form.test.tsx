import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { server } from '../../../../test/msw/server';
import { renderWithProviders } from '../../../../test/utils/render';
import { idErrorMap } from './error-map';
import {
  ComboboxField,
  DateField,
  MultiSelectField,
  NumberField,
  SelectField,
  SwitchField,
  TextareaField,
  TextField,
  UploadField,
} from './fields';
import { isNewId, ResourceForm } from './resource-form';

vi.mock(
  'next/navigation',
  () => import('../../../../test/utils/next-navigation'),
);

const schema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi'),
  summary: z.string().optional(),
  number: z.number().int().min(1),
  status: z.enum(['PUBLIC', 'DRAFT']),
  volume: z.string().nullable(),
  tags: z.array(z.string()).min(1),
  start: z.string().min(1),
  active: z.boolean(),
  image: z.string().nullable(),
});
type Values = z.input<typeof schema>;

const empty: Values = {
  title: '',
  summary: '',
  number: undefined as unknown as number,
  status: undefined as unknown as 'DRAFT',
  volume: null,
  tags: [],
  start: '',
  active: false,
  image: null,
};

function Fields() {
  return (
    <>
      <TextField
        name="title"
        label="Judul"
      />
      <TextareaField
        name="summary"
        label="Ringkasan"
        optional
      />
      <NumberField
        name="number"
        label="Nomor"
      />
      <SelectField
        name="status"
        label="Status"
        options={[
          { value: 'PUBLIC', label: 'Publik' },
          { value: 'DRAFT', label: 'Draf' },
        ]}
      />
      <ComboboxField
        name="volume"
        label="Volume"
        options={[{ value: 'v1', label: 'Volume 1' }]}
      />
      <MultiSelectField
        name="tags"
        label="Tag"
        options={[
          { value: 'a', label: 'Aljabar' },
          { value: 'b', label: 'Biologi' },
        ]}
      />
      <DateField
        name="start"
        label="Mulai"
      />
      <SwitchField
        name="active"
        label="Aktif"
      />
      <UploadField
        name="image"
        label="Gambar"
        bucket="img"
        folder="tryout"
        optional
      />
    </>
  );
}

describe('idErrorMap', () => {
  it('pesan bahasa Indonesia untuk kasus umum', () => {
    const run = (s: z.ZodType, v: unknown) =>
      s.safeParse(v, { error: idErrorMap }).error?.issues[0].message;
    expect(run(z.string().min(1), '')).toBe('Wajib diisi');
    expect(run(z.string().min(3), 'ab')).toBe('Minimal 3 karakter');
    expect(run(z.string(), undefined)).toBe('Wajib diisi');
    expect(run(z.number(), 'x')).toBe('Harus berupa angka');
    expect(run(z.number().max(10), 11)).toBe('Maksimal 10');
    expect(run(z.array(z.string()).min(1), [])).toBe('Pilih minimal satu');
    expect(run(z.enum(['A']), 'B')).toBe('Pilih salah satu opsi');
    expect(run(z.email(), 'x')).toBe('Format email tidak valid');
  });
});

describe('ResourceForm', () => {
  it('menampilkan error bahasa Indonesia dan tidak mengirim saat tidak valid', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(
      <ResourceForm
        schema={schema}
        defaultValues={empty}
        onSubmit={onSubmit}
      >
        <Fields />
      </ResourceForm>,
    );
    await user.click(screen.getByRole('button', { name: 'Simpan' }));
    expect(await screen.findByText('Judul wajib diisi')).toBeInTheDocument();
    expect(screen.getAllByText('Wajib diisi').length).toBeGreaterThan(0);
    expect(screen.getByText('Pilih minimal satu')).toBeInTheDocument();
    expect(screen.getByLabelText('Judul')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('mengirim nilai yang sudah ditransformasi zod', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(
      <ResourceForm
        schema={schema}
        defaultValues={empty}
        onSubmit={onSubmit}
      >
        <Fields />
      </ResourceForm>,
    );
    await user.type(screen.getByLabelText('Judul'), '  Volume Awal  ');
    await user.type(screen.getByLabelText('Nomor'), '3');
    await user.click(screen.getByRole('combobox', { name: 'Status' }));
    await user.click(await screen.findByRole('option', { name: 'Draf' }));
    await user.click(screen.getByRole('combobox', { name: 'Volume' }));
    await user.click(await screen.findByRole('option', { name: 'Volume 1' }));
    await user.click(screen.getByRole('combobox', { name: 'Tag' }));
    await user.click(await screen.findByRole('option', { name: 'Biologi' }));
    await user.keyboard('{Escape}');
    await user.type(screen.getByLabelText('Mulai'), '2026-10-05T19:00');
    await user.click(screen.getByRole('switch', { name: 'Aktif' }));
    await user.click(screen.getByRole('button', { name: 'Simpan' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      title: 'Volume Awal',
      summary: '',
      number: 3,
      status: 'DRAFT',
      volume: 'v1',
      tags: ['b'],
      start: '2026-10-05T19:00',
      active: true,
      image: null,
    });
  });

  it('mode ubah: nilai server mengisi form; simpan nonaktif sampai ada perubahan', async () => {
    const { user } = renderWithProviders(
      <ResourceForm
        schema={schema}
        defaultValues={empty}
        values={{
          ...empty,
          title: 'Lama',
          number: 1,
          status: 'PUBLIC',
          tags: ['a'],
          start: '2026-01-01T08:00',
        }}
        requireDirty
        onSubmit={vi.fn()}
        cancelHref="/utbk/admin/quiz-volume"
      >
        <Fields />
      </ResourceForm>,
    );
    expect(await screen.findByDisplayValue('Lama')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simpan' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'Batal' })).toHaveAttribute(
      'href',
      '/utbk/admin/quiz-volume',
    );
    await user.type(screen.getByLabelText('Judul'), ' baru');
    expect(screen.getByRole('button', { name: 'Simpan' })).toBeEnabled();
  });

  it('unggah gambar menyimpan nama file', async () => {
    let uploadedPath = '';
    server.use(
      http.post(
        'http://storage-upload.test/storage/buckets/img/files',
        async ({ request }) => {
          uploadedPath = String((await request.formData()).get('path'));
          return HttpResponse.json({ ok: true });
        },
      ),
    );
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(
      <ResourceForm
        schema={z.object({ image: z.string().min(1) })}
        defaultValues={{ image: '' }}
        onSubmit={onSubmit}
      >
        <UploadField
          name="image"
          label="Gambar"
          bucket="img"
          folder="tryout"
          prefix="tryout"
        />
      </ResourceForm>,
    );
    const input = screen.getByLabelText('Gambar');
    await user.upload(input, new File(['x'], 'a.png', { type: 'image/png' }));
    await screen.findByRole('img', { name: 'Pratinjau gambar' });
    expect(uploadedPath).toMatch(/^tryout\/tryout-/);
    await user.click(screen.getByRole('button', { name: 'Simpan' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0].image).toBe(uploadedPath.split('/')[1]);
  });
});

it('isNewId', () => {
  expect(isNewId('new')).toBe(true);
  expect(isNewId(undefined)).toBe(true);
  expect(isNewId('abc')).toBe(false);
});
