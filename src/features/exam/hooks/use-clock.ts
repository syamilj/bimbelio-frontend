'use client';

import { useEffect, useState } from 'react';

/**
 * Jam "server" yang berdetak tiap detik: Date.now() + selisih jam server.
 * Dipakai timer sesi & istirahat agar jam perangkat yang salah tidak
 * memperpanjang/memperpendek waktu ujian.
 */
export function useServerNow(offsetMs: number, intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now() + offsetMs);
  useEffect(() => {
    setNow(Date.now() + offsetMs);
    const id = window.setInterval(
      () => setNow(Date.now() + offsetMs),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [offsetMs, intervalMs]);
  return now;
}
