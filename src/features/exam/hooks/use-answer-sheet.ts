'use client';

import { ApiError } from '@/lib/api/client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { getDraft, saveDraft } from '../api';
import {
  applySaved,
  mergeSaved,
  sheetReducer,
  toDraftAnswers,
  type AnswerSheet,
  type SheetAction,
} from '../model/answers';
import {
  createAutosaver,
  type Autosaver,
  type AutosaveStatus,
} from '../model/autosave';
import { readLocal, writeLocal } from '../model/storage';
import type { DraftAnswer, ExamQuestion } from '../types';

type Options = {
  sessionId: string;
  questions: ExamQuestion[];
  /** Sesi sudah selesai di server (409) — tarik ulang data tryout. */
  onConflict?: () => void;
  debounceMs?: number;
};

/**
 * Lembar jawaban satu sesi + autosave:
 * 1. Mulai dari cadangan lokal (instan, tahan offline).
 * 2. Ambil draft server (`getDraft`); yang lebih baru menang.
 * 3. Setiap perubahan → tulis lokal seketika + kirim ke server dengan debounce.
 * Endpoint draft 404 → lokal saja (diam-diam). 409 → `onConflict`.
 */
export function useAnswerSheet({
  sessionId,
  questions,
  onConflict,
  debounceMs,
}: Options) {
  const [sheet, rawDispatch] = useReducer(
    sheetReducer,
    undefined,
    (): AnswerSheet =>
      applySaved(
        questions,
        typeof window === 'undefined' ? null : readLocal(sessionId)?.answers,
      ),
  );
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const edited = useRef(false);
  const conflictRef = useRef(onConflict);
  conflictRef.current = onConflict;

  const saverRef = useRef<Autosaver<DraftAnswer[]> | null>(null);
  if (!saverRef.current) {
    saverRef.current = createAutosaver<DraftAnswer[]>({
      save: (answers) => saveDraft(sessionId, answers),
      debounceMs,
      onStatus: setStatus,
      onConflict: () => conflictRef.current?.(),
    });
  }
  const saver = saverRef.current;

  // Pulihkan draft server sekali.
  useEffect(() => {
    const controller = new AbortController();
    getDraft(sessionId, controller.signal)
      .then((server) => {
        if (edited.current || !server?.answers?.length) return;
        const merged = mergeSaved(readLocal(sessionId), server);
        rawDispatch({ type: 'ganti', sheet: applySaved(questions, merged) });
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 409) {
          conflictRef.current?.();
        }
        // 404 (belum ter-deploy) / jaringan: cukup cadangan lokal.
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sekali per sesi
  }, [sessionId]);

  const dispatch = useCallback((action: SheetAction) => {
    edited.current = true;
    rawDispatch(action);
  }, []);

  // Simpan setiap perubahan dari pengguna.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    writeLocal(sessionId, sheet);
    if (edited.current) saver.schedule(toDraftAnswers(sheet));
  }, [sheet, sessionId, saver]);

  // Tab disembunyikan / ditutup → kirim sekarang.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') void saver.flush();
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [saver]);

  // Keluar dari halaman tanpa mengumpulkan → kirim sisa perubahan.
  useEffect(() => () => void saver.flush(), [saver]);

  return {
    sheet,
    dispatch,
    status,
    flush: () => saver.flush(),
    stop: () => saver.stop(),
    resume: () => saver.resume(),
  };
}
