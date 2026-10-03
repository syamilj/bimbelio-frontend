import { ApiError } from '@/lib/api/client';

/**
 * Status autosave untuk UI:
 * - `idle`: belum ada perubahan.
 * - `pending`: ada perubahan, menunggu jeda mengetik selesai.
 * - `saving`: sedang mengirim ke server.
 * - `saved`: tersimpan di server.
 * - `local`: endpoint draft tidak tersedia (404) — tersimpan di perangkat saja.
 * - `offline`: gagal mengirim (jaringan/5xx) — tersimpan di perangkat, dicoba lagi.
 */
export type AutosaveStatus =
  | 'idle'
  | 'pending'
  | 'saving'
  | 'saved'
  | 'local'
  | 'offline';

export type AutosaverOptions<T> = {
  save: (payload: T) => Promise<unknown>;
  /** Jeda setelah perubahan terakhir sebelum mengirim. */
  debounceMs?: number;
  /** Paling lama menunda saat perubahan terus terjadi. */
  maxWaitMs?: number;
  /** Jeda sebelum mencoba lagi setelah gagal jaringan. */
  retryMs?: number;
  onStatus?: (status: AutosaveStatus) => void;
  /** 409: sesi sudah diselesaikan (di tab/perangkat lain atau oleh server). */
  onConflict?: () => void;
};

/**
 * Antrean autosave dengan debounce. Hanya payload TERAKHIR yang dikirim; satu
 * request berjalan pada satu waktu. Bila server membalas 404 (endpoint draft
 * belum ter-deploy), server dimatikan diam-diam dan jawaban cukup tersimpan
 * lokal (perilaku lama).
 */
export function createAutosaver<T>({
  save,
  debounceMs = 1500,
  maxWaitMs = 10_000,
  retryMs = 15_000,
  onStatus,
  onConflict,
}: AutosaverOptions<T>) {
  let latest: { payload: T } | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let firstPendingAt: number | null = null;
  let inFlight: Promise<void> | null = null;
  let disabled = false;
  let stopped = false;
  let conflicted = false;
  let status: AutosaveStatus = 'idle';

  const setStatus = (next: AutosaveStatus) => {
    if (status === next) return;
    status = next;
    onStatus?.(next);
  };

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const run = async (): Promise<void> => {
    clearTimer();
    firstPendingAt = null;
    if (stopped || !latest) return;
    if (disabled) {
      latest = null;
      setStatus('local');
      return;
    }
    if (inFlight) {
      await inFlight;
      return run();
    }
    const { payload } = latest;
    latest = null;
    setStatus('saving');
    inFlight = (async () => {
      try {
        await save(payload);
        if (!latest) setStatus('saved');
      } catch (error) {
        const code = error instanceof ApiError ? error.status : 0;
        if (code === 404) {
          disabled = true;
          latest = null;
          setStatus('local');
        } else if (code === 409) {
          stopped = true;
          conflicted = true;
          latest = null;
          setStatus('saved');
          onConflict?.();
        } else {
          // Simpan lagi nanti — kecuali sudah ada perubahan yang lebih baru.
          latest ??= { payload };
          setStatus('offline');
          clearTimer();
          timer = setTimeout(() => void run(), retryMs);
        }
      } finally {
        inFlight = null;
      }
    })();
    await inFlight;
    if (latest && !timer && status !== 'offline') return run();
  };

  return {
    /** Jadwalkan penyimpanan payload terbaru. */
    schedule(payload: T) {
      if (stopped) return;
      latest = { payload };
      if (disabled) {
        latest = null;
        setStatus('local');
        return;
      }
      const now = Date.now();
      firstPendingAt ??= now;
      const wait = Math.max(
        0,
        Math.min(debounceMs, firstPendingAt + maxWaitMs - now),
      );
      if (status !== 'saving') setStatus('pending');
      clearTimer();
      timer = setTimeout(() => void run(), wait);
    },
    /** Kirim sekarang (mis. sebelum mengumpulkan atau saat tab disembunyikan). */
    flush: () => run(),
    /** Matikan antrean (komponen dilepas / sesi selesai). */
    stop() {
      stopped = true;
      clearTimer();
      latest = null;
    },
    /** Aktifkan lagi setelah `stop()` (mis. mengumpulkan gagal). */
    resume() {
      if (!conflicted) stopped = false;
    },
    get status() {
      return status;
    },
    get serverDisabled() {
      return disabled;
    },
  };
}

export type Autosaver<T> = ReturnType<typeof createAutosaver<T>>;
