import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../../../test/msw/server';
import { storagePublicUrl, useStorageUpload } from './use-storage-upload';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const UPLOAD = 'http://storage-upload.test/storage/buckets/img/files';
const REMOVE = 'http://storage.test/storage/buckets/img/files';
const file = () => new File(['x'], 'a.png', { type: 'image/png' });

describe('useStorageUpload', () => {
  it('mengunggah ke folder dengan nama berawalan dan menghapus file lama', async () => {
    const calls: string[] = [];
    server.use(
      http.post(UPLOAD, async ({ request }) => {
        calls.push(`upload ${(await request.formData()).get('path')}`);
        return HttpResponse.json({});
      }),
      // Preflight CORS untuk DELETE ber-body JSON.
      http.options(REMOVE, () => new HttpResponse(null, { status: 204 })),
      // happy-dom membuang body DELETE, jadi cukup pastikan endpoint dipanggil.
      http.delete(REMOVE, () => {
        calls.push('remove');
        return HttpResponse.json({});
      }),
    );
    const { result } = renderHook(() =>
      useStorageUpload({ bucket: 'img', folder: 'tryout', prefix: 'tryout' }),
    );
    let res!: Awaited<ReturnType<typeof result.current.upload>>;
    await act(async () => {
      res = await result.current.upload(file(), { replace: 'tryout-lama' });
    });
    expect(res.name).toMatch(/^tryout-[0-9a-f-]{36}$/);
    expect(res.path).toBe(`tryout/${res.name}`);
    expect(res.url).toBe(`http://storage.test/img/tryout/${res.name}`);
    expect(calls).toEqual([`upload tryout/${res.name}`, 'remove']);
    expect(result.current.isUploading).toBe(false);
  });

  it('nama yang sudah ada ditimpa lewat update', async () => {
    const update = vi.fn(() => HttpResponse.json({}));
    server.use(
      http.post(UPLOAD, () =>
        HttpResponse.json(
          { message: 'The resource already exists' },
          { status: 409 },
        ),
      ),
      http.put(UPLOAD, update),
    );
    const { result } = renderHook(() => useStorageUpload({ bucket: 'img' }));
    await act(async () => {
      await result.current.upload(file(), { name: 'kategori' });
    });
    expect(update).toHaveBeenCalledTimes(1);
  });

  it('gagal unggah melempar error dan menyimpan pesannya', async () => {
    server.use(
      http.post(UPLOAD, () =>
        HttpResponse.json({ message: 'Kuota penuh' }, { status: 500 }),
      ),
    );
    const { result } = renderHook(() =>
      useStorageUpload({ bucket: 'img', toastError: false }),
    );
    await act(async () => {
      await expect(result.current.upload(file())).rejects.toThrow(
        'Gambar gagal diunggah: Kuota penuh',
      );
    });
    expect(result.current.error).toBe('Gambar gagal diunggah: Kuota penuh');
  });

  it('URL publik per bucket', () => {
    expect(storagePublicUrl('to-question', 'abc-1')).toBe(
      'http://storage.test/to-question/abc-1',
    );
    expect(storagePublicUrl('dump-images', 'x.png')).toBe(
      'http://storage.test/dump-images/x.png',
    );
  });
});
