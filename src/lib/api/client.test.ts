import { HttpResponse, http as mswHttp } from 'msw';
import { describe, expect, it } from 'vitest';
import { API, server } from '../../../test/msw/server';
import { api, ApiError, toApiError, trackIdFromPath } from './client';

describe('trackIdFromPath', () => {
  it.each([
    ['/utbk/user/bimboard', 'utbk'],
    ['/snbt/admin', 'snbt'],
    ['/stan/user', 'stan'],
  ])('mengambil track dari %s', (path, expected) => {
    expect(trackIdFromPath(path)).toBe(expected);
  });

  it.each(['/', '/blog/judul-artikel', '/price/abc', '/utbk', '/user/x'])(
    'tidak menganggap %s sebagai area aplikasi',
    (path) => {
      expect(trackIdFromPath(path)).toBeUndefined();
    },
  );
});

describe('api', () => {
  it('membuka amplop respons dan mengembalikan data', async () => {
    server.use(
      mswHttp.get(`${API}/plan/list`, () =>
        HttpResponse.json({ status: 200, message: 'OK', data: [{ id: 'p1' }] }),
      ),
    );
    await expect(api.get('/plan/list')).resolves.toEqual([{ id: 'p1' }]);
  });

  it('memetakan halaman dari amplop', async () => {
    server.use(
      mswHttp.get(`${API}/items`, () =>
        HttpResponse.json({
          status: 200,
          message: 'OK',
          data: ['a', 'b'],
          page: 2,
          total_pages: 5,
          total_data: 42,
        }),
      ),
    );
    await expect(api.paginated('/items')).resolves.toEqual({
      items: ['a', 'b'],
      page: 2,
      totalPages: 5,
      totalData: 42,
    });
  });

  it('mengirim token dari cookie sebagai Bearer', async () => {
    document.cookie = 'token=abc123; path=/';
    let auth: string | null = null;
    server.use(
      mswHttp.get(`${API}/me`, ({ request }) => {
        auth = request.headers.get('authorization');
        return HttpResponse.json({ status: 200, message: 'OK', data: null });
      }),
    );
    await api.get('/me');
    expect(auth).toBe('Bearer abc123');
  });

  it('menambahkan website_sub_category_id saat berada di area aplikasi', async () => {
    window.history.pushState({}, '', '/utbk/user/bimboard');
    let track: string | null = null;
    server.use(
      mswHttp.get(`${API}/stats`, ({ request }) => {
        track = new URL(request.url).searchParams.get(
          'website_sub_category_id',
        );
        return HttpResponse.json({ status: 200, message: 'OK', data: {} });
      }),
    );
    await api.get('/stats');
    expect(track).toBe('utbk');
    window.history.pushState({}, '', '/');
  });

  it('mengubah error HTTP menjadi ApiError dengan pesan dari backend', async () => {
    server.use(
      mswHttp.post(`${API}/voucher`, () =>
        HttpResponse.json(
          { status: 422, message: 'Kode voucher sudah dipakai', data: null },
          { status: 422 },
        ),
      ),
    );
    const error = (await api
      .post('/voucher', { code: 'X' })
      .catch((e) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(422);
    expect(error.message).toBe('Kode voucher sudah dipakai');
  });

  it('menandai kegagalan jaringan', async () => {
    server.use(mswHttp.get(`${API}/down`, () => HttpResponse.error()));
    const error = (await api.get('/down').catch((e) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.isNetwork).toBe(true);
  });
});

describe('toApiError', () => {
  it('mempertahankan ApiError apa adanya', () => {
    const original = new ApiError('x', 401);
    expect(toApiError(original)).toBe(original);
    expect(original.isUnauthorized).toBe(true);
  });

  it('membungkus Error biasa', () => {
    expect(toApiError(new Error('boom'))).toMatchObject({
      message: 'boom',
      status: 500,
    });
  });

  it('memberi pesan bawaan untuk nilai yang tidak dikenal', () => {
    expect(toApiError('??').message).toMatch(/Terjadi kesalahan/);
  });
});

describe('pagar keamanan tes', () => {
  it('request ke endpoint yang tidak di-mock selalu gagal (tidak pernah keluar ke jaringan)', async () => {
    const error = (await api
      .get('/endpoint-tanpa-mock')
      .catch((e) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.isNetwork).toBe(true);
  });
});
