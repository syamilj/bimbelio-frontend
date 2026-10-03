// Draf editor di localStorage. Kunci & bentuk data sama dengan versi lama
// (`{ tryout, sessions }`, LZ-string), sehingga draf yang dibuat sebelum
// migrasi tetap terbaca — dan tombol "hapus draf" di daftar tetap bekerja.

import LZString from 'lz-string';
import { normalizeSession } from './editor';
import type { AssessmentKind, EditorState, QuizVolumeRef } from './types';

export const draftKey = (kind: AssessmentKind, id?: string) =>
  id ? `temporary-edit-${kind}-${id}` : `temporary-add-${kind}`;

export const quizVolumeKey = (id?: string) =>
  id ? `temporary-selectedQuizVolume-${id}` : 'temporary-selectedQuizVolume';

function parseStored(raw: string | null): unknown {
  if (!raw) return null;
  // Versi lama: draf "buat try out" disimpan sebagai JSON biasa, sisanya terkompresi.
  const decompressed = LZString.decompress(raw);
  for (const text of [decompressed, raw]) {
    if (!text) continue;
    try {
      return JSON.parse(text);
    } catch {
      // coba format berikutnya
    }
  }
  return null;
}

type StoredDraft = {
  tryout?: EditorState['meta'] | null;
  sessions?: unknown;
};

export function readDraft(
  kind: AssessmentKind,
  id?: string,
): EditorState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = parseStored(
      localStorage.getItem(draftKey(kind, id)),
    ) as StoredDraft | null;
    if (!stored || !stored.tryout) return null;
    const rawSessions = Array.isArray(stored.sessions)
      ? stored.sessions
      : stored.sessions
        ? [stored.sessions]
        : [];
    const volume = parseStored(
      kind === 'quiz' ? localStorage.getItem(quizVolumeKey(id)) : null,
    ) as QuizVolumeRef | { id: string; title?: string } | null;
    // Versi lama menyimpan "T" bila tanggal/jam belum diisi.
    const date = (v: string | undefined) =>
      v && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v) ? v.slice(0, 16) : '';
    return {
      meta: {
        ...stored.tryout,
        startDate: date(stored.tryout.startDate),
        endDate: date(stored.tryout.endDate),
        resultDate: date(stored.tryout.resultDate),
      },
      sessions: rawSessions.map((s) => normalizeSession(s, kind)),
      quizVolume:
        volume && volume.id
          ? {
              id: volume.id,
              name:
                'name' in volume
                  ? volume.name
                  : ((volume as { title?: string }).title ?? ''),
            }
          : null,
    };
  } catch {
    return null;
  }
}

export function writeDraft(
  kind: AssessmentKind,
  id: string | undefined,
  state: EditorState,
) {
  try {
    const stored = {
      tryout: state.meta,
      sessions: kind === 'quiz' ? state.sessions[0] : state.sessions,
    };
    localStorage.setItem(
      draftKey(kind, id),
      LZString.compress(JSON.stringify(stored)),
    );
    if (kind === 'quiz') {
      if (state.quizVolume)
        localStorage.setItem(
          quizVolumeKey(id),
          JSON.stringify(state.quizVolume),
        );
      else localStorage.removeItem(quizVolumeKey(id));
    }
    return true;
  } catch {
    // Kuota penuh atau mode privat: draf dilewati, editor tetap jalan.
    return false;
  }
}

export function clearDraft(kind: AssessmentKind, id?: string) {
  try {
    localStorage.removeItem(draftKey(kind, id));
    if (kind === 'quiz') localStorage.removeItem(quizVolumeKey(id));
  } catch {}
}

export const hasDraft = (kind: AssessmentKind, id?: string) => {
  try {
    return !!localStorage.getItem(draftKey(kind, id));
  } catch {
    return false;
  }
};

/**
 * Draf dianggap mengikuti versi server yang sama bila `updateAt` draf
 * (+1 menit toleransi) lebih baru dari `updateAt` server — dipakai langsung.
 * Bila server lebih baru, admin diminta memilih.
 */
export function draftMatchesServer(
  draftUpdateAt: string | undefined,
  serverUpdateAt: string,
) {
  if (!draftUpdateAt) return false;
  const draft = new Date(draftUpdateAt);
  draft.setMinutes(draft.getMinutes() + 1);
  return draft > new Date(serverUpdateAt);
}
