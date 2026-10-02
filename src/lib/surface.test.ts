import { describe, expect, it } from 'vitest';
import {
  areaHref,
  routeByHost,
  siteHref,
  surfaceForHost,
  toInternalPath,
  toPublicPath,
  toRoutePath,
  trackIdFromPath,
  type DomainConfig,
} from './surface';

const SPLIT: DomainConfig = {
  siteUrl: 'https://www.bimbelio.com',
  appUrl: 'https://app.bimbelio.com',
  adminUrl: 'https://admin.bimbelio.com',
};
const SINGLE: DomainConfig = { siteUrl: 'https://www.bimbelio.com' };

describe('surface & path', () => {
  it('mengenali host', () => {
    expect(surfaceForHost('app.bimbelio.com', SPLIT)).toBe('app');
    expect(surfaceForHost('ADMIN.bimbelio.com', SPLIT)).toBe('admin');
    expect(surfaceForHost('www.bimbelio.com', SPLIT)).toBe('site');
    expect(surfaceForHost('app.bimbelio.com', SINGLE)).toBe('site');
  });

  it('path publik ↔ internal', () => {
    expect(toInternalPath('/utbk/bimboard', 'app')).toBe('/utbk/user/bimboard');
    expect(toInternalPath('/utbk/user/bimboard', 'app')).toBe(
      '/utbk/user/bimboard',
    );
    expect(toInternalPath('/utbk/voucher/new', 'admin')).toBe(
      '/utbk/admin/voucher/new',
    );
    expect(toInternalPath('/utbk', 'admin')).toBe('/utbk/admin');
    expect(toPublicPath('/utbk/user/bimarena/try-out', 'app')).toBe(
      '/utbk/bimarena/try-out',
    );
    expect(toPublicPath('/utbk/admin', 'admin')).toBe('/utbk');
  });
});

describe('href & path lintas surface', () => {
  it('satu domain: path lama, tanpa perubahan', () => {
    expect(areaHref('app', 'utbk', 'bimboard', SINGLE)).toBe(
      '/utbk/user/bimboard',
    );
    expect(areaHref('admin', 'utbk', '', SINGLE)).toBe('/utbk/admin');
    expect(siteHref('/price', SINGLE)).toBe('/price');
    expect(toRoutePath('/utbk/bimboard', 'app', SINGLE)).toBe('/utbk/bimboard');
    expect(trackIdFromPath('/utbk/user/bimboard', SINGLE)).toBe('utbk');
    expect(trackIdFromPath('/utbk', SINGLE)).toBeUndefined();
    expect(trackIdFromPath('/price', SINGLE)).toBeUndefined();
  });

  it('domain terpisah: URL absolut ke subdomain', () => {
    expect(areaHref('app', 'utbk', '/bimboard', SPLIT)).toBe(
      'https://app.bimbelio.com/utbk/bimboard',
    );
    expect(areaHref('admin', 'utbk', 'voucher', SPLIT)).toBe(
      'https://admin.bimbelio.com/utbk/voucher',
    );
    expect(areaHref('admin', 'utbk', '', SPLIT)).toBe(
      'https://admin.bimbelio.com/utbk',
    );
    expect(siteHref('/price', SPLIT)).toBe('https://www.bimbelio.com/price');
  });

  it('toRoutePath menyamakan href absolut & pathname publik ke rute internal', () => {
    expect(
      toRoutePath('https://app.bimbelio.com/utbk/bimcourse', 'site', SPLIT),
    ).toBe('/utbk/user/bimcourse');
    expect(toRoutePath('https://admin.bimbelio.com/utbk', 'site', SPLIT)).toBe(
      '/utbk/admin',
    );
    expect(toRoutePath('/utbk/bimcourse/abc', 'app', SPLIT)).toBe(
      '/utbk/user/bimcourse/abc',
    );
    expect(toRoutePath('/utbk/user/bimcourse', 'app', SPLIT)).toBe(
      '/utbk/user/bimcourse',
    );
  });

  it('trackIdFromPath mengenali bentuk publik hanya saat domain terpisah', () => {
    expect(trackIdFromPath('/utbk/bimboard', SPLIT)).toBe('utbk');
    expect(trackIdFromPath('/stan', SPLIT)).toBe('stan');
    expect(trackIdFromPath('/blog/judul', SPLIT)).toBeUndefined();
    expect(trackIdFromPath('/', SPLIT)).toBeUndefined();
  });
});

describe('routeByHost', () => {
  const route = (host: string, path: string, search = '', lastTrack?: string) =>
    routeByHost(host, path, search, { lastTrack }, SPLIT);

  it('tanpa domain terpisah: tidak mengubah apa pun', () => {
    expect(
      routeByHost('www.bimbelio.com', '/utbk/user/bimboard', '', {}, SINGLE),
    ).toEqual({ type: 'next' });
  });

  it('situs: URL area aplikasi lama dialihkan permanen ke subdomain', () => {
    expect(
      route('www.bimbelio.com', '/utbk/user/bimarena/try-out', '?id=x'),
    ).toEqual({
      type: 'redirect',
      url: 'https://app.bimbelio.com/utbk/bimarena/try-out?id=x',
      permanent: true,
    });
    expect(route('www.bimbelio.com', '/utbk/admin/voucher')).toEqual({
      type: 'redirect',
      url: 'https://admin.bimbelio.com/utbk/voucher',
      permanent: true,
    });
    expect(route('www.bimbelio.com', '/price')).toEqual({ type: 'next' });
  });

  it('app: path publik di-rewrite ke rute internal', () => {
    expect(route('app.bimbelio.com', '/utbk/bimboard')).toEqual({
      type: 'rewrite',
      pathname: '/utbk/user/bimboard',
    });
    expect(route('app.bimbelio.com', '/utbk/bimarena/try-out/abc')).toEqual({
      type: 'rewrite',
      pathname: '/utbk/user/bimarena/try-out/abc',
    });
  });

  it('app: bentuk lama /track/user/... dialihkan ke bentuk baru', () => {
    expect(
      route('app.bimbelio.com', '/utbk/user/bimboard', '?tab=chat'),
    ).toEqual({
      type: 'redirect',
      url: '/utbk/bimboard?tab=chat',
      permanent: true,
    });
  });

  it('app: beranda & track saja → dashboard', () => {
    expect(route('app.bimbelio.com', '/', '', 'snbt')).toEqual({
      type: 'redirect',
      url: '/snbt/bimboard',
      permanent: false,
    });
    expect(route('app.bimbelio.com', '/')).toEqual({
      type: 'redirect',
      url: '/choice/bimboard',
      permanent: false,
    });
    expect(route('app.bimbelio.com', '/utbk')).toEqual({
      type: 'redirect',
      url: '/utbk/bimboard',
      permanent: false,
    });
  });

  it('app: halaman marketing dialihkan ke situs utama', () => {
    expect(route('app.bimbelio.com', '/price', '?checkout=p1')).toEqual({
      type: 'redirect',
      url: 'https://www.bimbelio.com/price?checkout=p1',
      permanent: true,
    });
  });

  it('app ↔ admin saling mengalihkan ke domain masing-masing', () => {
    expect(route('app.bimbelio.com', '/utbk/admin/voucher')).toEqual({
      type: 'redirect',
      url: 'https://admin.bimbelio.com/utbk/voucher',
      permanent: true,
    });
    expect(route('admin.bimbelio.com', '/utbk/user/bimboard')).toEqual({
      type: 'redirect',
      url: 'https://app.bimbelio.com/utbk/bimboard',
      permanent: true,
    });
  });

  it('admin: beranda → dashboard admin, path di-rewrite', () => {
    expect(route('admin.bimbelio.com', '/', '', 'utbk')).toEqual({
      type: 'redirect',
      url: '/utbk',
      permanent: false,
    });
    expect(route('admin.bimbelio.com', '/utbk')).toEqual({
      type: 'rewrite',
      pathname: '/utbk/admin',
    });
    expect(route('admin.bimbelio.com', '/utbk/tryout/edit/1')).toEqual({
      type: 'rewrite',
      pathname: '/utbk/admin/tryout/edit/1',
    });
  });
});
