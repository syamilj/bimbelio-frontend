import type { ExamSession, ExamTryout } from '../types';

/**
 * Tryout yang sesinya dipotong di `endDate` tryout (dan sesi tersisa
 * diselesaikan otomatis setelah tryout berakhir). Perilaku lama yang
 * di-hardcode per id; dipertahankan apa adanya — lihat README.
 */
export const CLAMP_TO_TRYOUT_END = new Set(['cmkqjyg2w01iykuctdm6v3awh']);

/**
 * Selisih jam server − jam perangkat (ms). `serverTime` diambil saat respons
 * dibuat, jadi `receivedAt` (Date.now() saat respons tiba) dipakai sebagai
 * pembanding. Tanpa `serverTime` → 0 (jam perangkat, perilaku lama).
 */
export function clockOffset(serverTime: string | undefined, receivedAt: number) {
  if (!serverTime) return 0;
  const server = new Date(serverTime).getTime();
  if (Number.isNaN(server)) return 0;
  return server - receivedAt;
}

/** Batas akhir sesi (ms epoch, jam server). null bila sesi belum dimulai. */
export function sessionDeadline(session: ExamSession, tryout: ExamTryout) {
  const start = session.TryoutSessionParticipant?.startSession;
  if (!start) return null;
  const startMs = new Date(start).getTime();
  const end = startMs + session.duration * 60_000;
  if (CLAMP_TO_TRYOUT_END.has(tryout.id)) {
    return Math.min(end, new Date(tryout.endDate).getTime());
  }
  return end;
}

/**
 * Batas akhir istirahat sebelum sesi `index`: `endSession` sesi sebelumnya +
 * `restTime` menit. Bila `endSession` tidak tercatat, istirahat penuh dihitung
 * dari `now` (perilaku lama).
 */
export function restDeadline(tryout: ExamTryout, index: number, now: number) {
  const restMs = tryout.restTime * 60_000;
  const prev = tryout.TryoutSession[index - 1];
  const ended = prev?.TryoutSessionParticipant?.endSession;
  if (!ended) return now + restMs;
  return new Date(ended).getTime() + restMs;
}

/** Ambang peringatan timer: 10 menit/20% dan kritis 5 menit/10% (perilaku lama). */
export function timerLevel(remainingMs: number, totalMs: number) {
  const critical = Math.max(5 * 60_000, totalMs * 0.1);
  const warning = Math.max(10 * 60_000, totalMs * 0.2);
  if (remainingMs <= critical) return 'kritis' as const;
  if (remainingMs <= warning) return 'peringatan' as const;
  return 'normal' as const;
}

/** 3725000 → "1:02:05"; di bawah satu jam → "02:05". */
export function formatClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Label pembaca layar: "1 jam 2 menit 5 detik". */
export function spokenClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h && `${h} jam`, m && `${m} menit`, `${s} detik`]
    .filter(Boolean)
    .join(' ');
}
