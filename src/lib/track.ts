'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { areaHref, toRoutePath, trackIdFromPath } from './surface';
import { rememberTrackCookie } from './track-cookie';

/** Kunci localStorage track terakhir yang dibuka (dipakai juga kode lama). */
export const TRACK_STORAGE_KEY = 'website_sub_category_id';

/** Placeholder track: membuka dialog pemilih track di area aplikasi. */
export const NO_TRACK = 'choice';

const subscribe = (onChange: () => void) => {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
};

const readStoredTrack = () => {
  try {
    return localStorage.getItem(TRACK_STORAGE_KEY);
  } catch {
    return null;
  }
};

/** Track terakhir dari localStorage; null saat SSR atau belum pernah memilih. */
export function useStoredTrackId() {
  return useSyncExternalStore(subscribe, readStoredTrack, () => null);
}

/**
 * Track aktif: dari URL bila sedang di area aplikasi, selain itu track
 * terakhir yang tersimpan. Dihitung ulang setiap navigasi (bukan sekali saat
 * modul dimuat seperti hook lama yang bisa menghasilkan `/null/...`).
 */
export function useTrackId() {
  const pathname = usePathname();
  const stored = useStoredTrackId();
  return trackIdFromPath(pathname) ?? stored;
}

/**
 * Pathname dalam bentuk rute internal (`/utbk/user/bimboard`), baik dibuka
 * lewat satu domain maupun subdomain (`app.bimbelio.com/utbk/bimboard`).
 */
export function useRoutePathname(area: 'app' | 'admin') {
  return toRoutePath(usePathname(), area);
}

/** Simpan track terakhir (localStorage untuk origin ini + cookie lintas subdomain). */
export function rememberTrack(trackId: string) {
  try {
    localStorage.setItem(TRACK_STORAGE_KEY, trackId);
  } catch {}
  rememberTrackCookie(trackId);
}

/**
 * URL di area siswa untuk track tertentu, mis. `appPath('utbk', 'bimboard')`.
 * Satu domain → `/utbk/user/bimboard`; domain terpisah → URL app.bimbelio.com.
 */
export const appPath = (trackId: string | null | undefined, path: string) =>
  areaHref('app', trackId || NO_TRACK, path);

export const adminPath = (trackId: string | null | undefined, path = '') =>
  areaHref('admin', trackId || NO_TRACK, path);
