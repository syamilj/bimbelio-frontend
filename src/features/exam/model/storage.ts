import LZString from 'lz-string';
import type { AnswerEntry } from '../types';
import { toSubmitAnswers, type AnswerSheet } from './answers';

// Cadangan lokal jawaban. Formatnya SAMA dengan mesin lama
// (`sessionAnswer-<sessionId>` = "lz:" + JSON terkompresi), jadi siswa yang
// sedang ujian saat rilis tidak kehilangan jawaban. Waktu simpan disimpan di
// kunci terpisah agar format lama tidak berubah.

const PREFIX = 'sessionAnswer-';
const AT_PREFIX = 'sessionAnswerAt-';

export const storageKey = (sessionId: string) => `${PREFIX}${sessionId}`;

function parse(raw: string): Partial<AnswerEntry>[] | null {
  try {
    const json = raw.startsWith('lz:')
      ? LZString.decompressFromUTF16(raw.slice(3))
      : raw;
    if (!json) return null;
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export function readLocal(sessionId: string) {
  try {
    const raw = localStorage.getItem(storageKey(sessionId));
    if (!raw) return null;
    const answers = parse(raw);
    if (!answers) {
      localStorage.removeItem(storageKey(sessionId));
      return null;
    }
    const at = Number(localStorage.getItem(`${AT_PREFIX}${sessionId}`)) || 0;
    return { answers, updatedAt: at };
  } catch {
    return null;
  }
}

const isQuota = (error: unknown) =>
  error instanceof DOMException &&
  (error.name === 'QuotaExceededError' || error.code === 22);

/** Tulis cadangan. Bila penuh, buang cadangan sesi lain lalu coba lagi. */
export function writeLocal(sessionId: string, sheet: AnswerSheet, at = Date.now()) {
  const json = JSON.stringify(toSubmitAnswers(sheet));
  const payload = `lz:${LZString.compressToUTF16(json)}`;
  const key = storageKey(sessionId);
  const write = (value: string) => {
    localStorage.setItem(key, value);
    localStorage.setItem(`${AT_PREFIX}${sessionId}`, String(at));
  };
  try {
    write(payload);
    return true;
  } catch (error) {
    if (!isQuota(error)) return false;
  }
  try {
    for (const k of Object.keys(localStorage)) {
      if (
        (k.startsWith(PREFIX) || k.startsWith(AT_PREFIX)) &&
        !k.endsWith(sessionId)
      ) {
        localStorage.removeItem(k);
      }
    }
    write(payload);
    return true;
  } catch {
    try {
      write(json);
      return true;
    } catch {
      return false;
    }
  }
}

export function clearLocal(sessionId: string) {
  try {
    localStorage.removeItem(storageKey(sessionId));
    localStorage.removeItem(`${AT_PREFIX}${sessionId}`);
  } catch {}
}
