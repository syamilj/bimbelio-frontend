import { ApiError } from '@/lib/api/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAutosaver, type AutosaveStatus } from './autosave';

describe('autosave', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const setup = (save: (p: number) => Promise<unknown>) => {
    const statuses: AutosaveStatus[] = [];
    const onConflict = vi.fn();
    const saver = createAutosaver<number>({
      save,
      debounceMs: 1000,
      maxWaitMs: 5000,
      retryMs: 3000,
      onStatus: (s) => statuses.push(s),
      onConflict,
    });
    return { saver, statuses, onConflict };
  };

  it('debounce: hanya payload terakhir yang dikirim', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const { saver, statuses } = setup(save);
    saver.schedule(1);
    await vi.advanceTimersByTimeAsync(500);
    saver.schedule(2);
    await vi.advanceTimersByTimeAsync(500);
    saver.schedule(3);
    expect(save).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1000);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(3);
    expect(statuses.at(-1)).toBe('saved');
  });

  it('maxWait: perubahan beruntun tetap tersimpan paling lama tiap 5 detik', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const { saver } = setup(save);
    for (let i = 0; i < 12; i++) {
      saver.schedule(i);
      await vi.advanceTimersByTimeAsync(500);
    }
    expect(save).toHaveBeenCalled();
  });

  it('404 (endpoint belum ter-deploy) → diam-diam lokal saja, tidak mencoba lagi', async () => {
    const save = vi.fn().mockRejectedValue(new ApiError('Not found', 404));
    const { saver, statuses } = setup(save);
    saver.schedule(1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(statuses.at(-1)).toBe('local');
    expect(saver.serverDisabled).toBe(true);
    saver.schedule(2);
    await vi.advanceTimersByTimeAsync(5000);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('409 (sesi sudah selesai) → onConflict dan berhenti', async () => {
    const save = vi.fn().mockRejectedValue(new ApiError('Selesai', 409));
    const { saver, onConflict } = setup(save);
    saver.schedule(1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(onConflict).toHaveBeenCalledTimes(1);
    saver.schedule(2);
    saver.resume();
    await vi.advanceTimersByTimeAsync(5000);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('gagal jaringan → offline lalu dicoba lagi', async () => {
    const save = vi
      .fn()
      .mockRejectedValueOnce(new ApiError('Offline', 0))
      .mockResolvedValue(undefined);
    const { saver, statuses } = setup(save);
    saver.schedule(7);
    await vi.advanceTimersByTimeAsync(1000);
    expect(statuses.at(-1)).toBe('offline');
    await vi.advanceTimersByTimeAsync(3000);
    expect(save).toHaveBeenCalledTimes(2);
    expect(save).toHaveBeenLastCalledWith(7);
    expect(statuses.at(-1)).toBe('saved');
  });

  it('flush mengirim segera; stop membuang antrean', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const { saver } = setup(save);
    saver.schedule(1);
    await saver.flush();
    expect(save).toHaveBeenCalledWith(1);
    saver.schedule(2);
    saver.stop();
    await vi.advanceTimersByTimeAsync(2000);
    expect(save).toHaveBeenCalledTimes(1);
  });
});
