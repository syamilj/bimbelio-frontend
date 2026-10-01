'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { trackIdFromPath } from './api/client';

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

/** URL di area siswa untuk track tertentu, mis. `appPath('utbk', 'bimboard')`. */
export const appPath = (trackId: string | null | undefined, path: string) =>
  `/${trackId || NO_TRACK}/user/${path.replace(/^\//, '')}`;

export const adminPath = (trackId: string | null | undefined, path = '') =>
  `/${trackId || NO_TRACK}/admin${path ? `/${path.replace(/^\//, '')}` : ''}`;
