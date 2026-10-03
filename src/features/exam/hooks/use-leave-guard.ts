'use client';

import { useEffect } from 'react';

/**
 * Peringatan bawaan browser saat menutup tab / memuat ulang / pindah situs
 * selama sesi berjalan. (Teks dialog ditentukan browser.)
 */
export function useLeaveGuard(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Chrome lama butuh returnValue terisi.
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [active]);
}
