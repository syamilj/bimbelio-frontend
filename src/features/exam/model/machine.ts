import type { ExamMode, ExamSession, ExamTryout } from '../types';

/**
 * Fase ujian. Alur utama:
 *
 *   belum-mulai ──mulai──▶ sesi ──kumpulkan/waktu habis──▶ istirahat ──lanjut──▶ sesi … ──▶ hasil
 *
 * Fase lain adalah gerbang (tryout belum dibuka, tidak terdaftar, dst.).
 * Fase TIDAK disimpan di state klien: ia diturunkan dari data server
 * (`getTryoutById`) setiap kali data berubah. Transisi = mutasi (mulai sesi,
 * kumpulkan) lalu data ditarik ulang — tanpa reload halaman, dan otomatis
 * benar kembali bila halaman dibuka ulang di tengah ujian.
 */
export type ExamPhase =
  | { kind: 'belum-dibuka'; startDate: Date }
  | { kind: 'tidak-terdaftar' }
  | { kind: 'terkunci' }
  | { kind: 'berakhir'; endDate: Date }
  | { kind: 'kosong' }
  | { kind: 'belum-mulai'; index: 0 }
  | { kind: 'sesi'; index: number }
  | { kind: 'istirahat'; index: number }
  | { kind: 'hasil' };

export type ExamPhaseKind = ExamPhase['kind'];

export type PhaseContext = {
  mode: ExamMode;
  /** Mode uji admin: jadwal tidak membatasi. */
  testing?: boolean;
  /** Fitur quiz pengguna: `'ALLOW'` atau daftar volume yang dibuka. */
  quizFeature?: string[] | 'ALLOW' | null;
  volumeId?: string | null;
  /** Jam sekarang (ms), sudah dikoreksi dengan jam server. */
  now: number;
};

const isDone = (s: ExamSession) => !!s.TryoutSessionParticipant?.isDone;

/** Indeks sesi berikutnya = sesudah sesi terakhir yang selesai (perilaku lama). */
export function currentSessionIndex(sessions: ExamSession[]) {
  let index = 0;
  sessions.forEach((s, i) => {
    if (isDone(s)) index = i + 1;
  });
  return index;
}

export const isQuizUnlocked = (
  feature: PhaseContext['quizFeature'],
  volumeId?: string | null,
) =>
  feature === 'ALLOW' ||
  (Array.isArray(feature) && !!volumeId && feature.includes(volumeId));

export function deriveExamPhase(
  tryout: ExamTryout,
  ctx: PhaseContext,
): ExamPhase {
  const sessions = tryout.TryoutSession;
  const startDate = new Date(tryout.startDate);
  const endDate = new Date(tryout.endDate);
  const started = ctx.now > startDate.getTime();

  if (!started && !ctx.testing) return { kind: 'belum-dibuka', startDate };

  if (
    ctx.mode === 'try-out' &&
    started &&
    tryout.TryoutRegistration.length === 0
  ) {
    return { kind: 'tidak-terdaftar' };
  }

  if (sessions.length === 0) return { kind: 'kosong' };

  const index = currentSessionIndex(sessions);
  const isResult = index >= sessions.length;

  if (
    ctx.mode === 'quiz' &&
    !isResult &&
    !isQuizUnlocked(ctx.quizFeature, ctx.volumeId) &&
    tryout.isFirstQuizInVolume !== true
  ) {
    return { kind: 'terkunci' };
  }

  if (ctx.mode === 'quiz' && !isResult && ctx.now > endDate.getTime()) {
    return { kind: 'berakhir', endDate };
  }

  if (isResult) return { kind: 'hasil' };

  const current = sessions[index];
  if (current.TryoutSessionParticipant) return { kind: 'sesi', index };
  if (index === 0) return { kind: 'belum-mulai', index: 0 };
  return { kind: 'istirahat', index };
}

/** Langkah progres untuk UI (subtes selesai / sedang / menunggu). */
export function sessionSteps(sessions: ExamSession[], active: number) {
  return sessions.map((s, i) => ({
    id: s.id,
    name: s.TryoutSubCategory?.name || s.name,
    status: isDone(s)
      ? ('selesai' as const)
      : i === active
        ? ('aktif' as const)
        : ('menunggu' as const),
  }));
}
