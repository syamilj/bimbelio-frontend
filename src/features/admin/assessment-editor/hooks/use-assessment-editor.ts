'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useTryoutCategories, useTryoutForUpdate } from '../api';
import {
  clearDraft,
  draftMatchesServer,
  readDraft,
  writeDraft,
} from '../model/draft';
import { emptyState } from '../model/editor';
import { fromServer } from '../model/payload';
import type {
  AssessmentKind,
  EditorMeta,
  EditorQuestion,
  EditorSession,
  EditorState,
} from '../model/types';

export type DraftStatus = 'idle' | 'saving' | 'saved' | 'failed';

/**
 * State editor asesmen: muat data (server/draf), simpan draf otomatis ke
 * localStorage (debounce 1 dtk), konflik draf vs server, dan pemilihan
 * sesi/soal yang sedang disunting.
 */
export function useAssessmentEditor(kind: AssessmentKind, id?: string) {
  const categories = useTryoutCategories();
  const detail = useTryoutForUpdate(id);
  const isEdit = !!id;

  const [state, setState] = useState<EditorState>(() => emptyState(kind));
  const [ready, setReady] = useState(false);
  const [conflict, setConflict] = useState<{
    server: EditorState;
    draft: EditorState;
  } | null>(null);
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('idle');
  const touched = useRef(false);

  const [activeSession, setActiveSession] = useState<number | null>(
    kind === 'quiz' ? 0 : null,
  );
  const [questionIndex, setQuestionIndex] = useState(0);

  // Muat awal: buat → draf lokal; ubah → server (+ cek draf).
  useEffect(() => {
    if (ready || conflict) return;
    if (!isEdit) {
      const draft = readDraft(kind);
      if (draft) {
        if (kind === 'quiz' && draft.sessions.length === 0)
          draft.sessions = emptyState('quiz').sessions;
        setState(draft);
      }
      setReady(true);
      return;
    }
    if (!detail.data || !categories.data) return;
    const server = fromServer(detail.data, categories.data, kind);
    const draft = readDraft(kind, id);
    if (!draft) {
      setState(server);
      setReady(true);
    } else if (draftMatchesServer(draft.meta.updateAt, detail.data.updateAt)) {
      setState({ ...draft, meta: { ...draft.meta, id: server.meta.id } });
      touched.current = true;
      setReady(true);
    } else {
      setConflict({ server, draft });
    }
  }, [isEdit, detail.data, categories.data, ready, conflict, kind, id]);

  const persist = useDebouncedCallback((next: EditorState) => {
    setDraftStatus(writeDraft(kind, id, next) ? 'saved' : 'failed');
  }, 1000);

  useEffect(() => {
    if (!ready || !touched.current) return;
    setDraftStatus('saving');
    persist(state);
  }, [state, ready, persist]);

  useEffect(() => () => persist.flush(), [persist]);

  const change = useCallback((fn: (prev: EditorState) => EditorState) => {
    touched.current = true;
    setState(fn);
  }, []);

  const updateMeta = useCallback(
    (patch: Partial<EditorMeta>) =>
      change((s) => ({ ...s, meta: { ...s.meta, ...patch } })),
    [change],
  );

  const updateSession = useCallback(
    (index: number, fn: (s: EditorSession) => EditorSession) =>
      change((s) => ({
        ...s,
        sessions: s.sessions.map((session, i) =>
          i === index ? fn(session) : session,
        ),
      })),
    [change],
  );

  const updateQuestion = useCallback(
    (
      sessionIndex: number,
      qIndex: number,
      fn: (q: EditorQuestion) => EditorQuestion,
    ) =>
      updateSession(sessionIndex, (session) => ({
        ...session,
        Questions: session.Questions.map((q, i) => (i === qIndex ? fn(q) : q)),
      })),
    [updateSession],
  );

  const openSession = useCallback((index: number | null) => {
    setActiveSession(index);
    setQuestionIndex(0);
  }, []);

  const resolveConflict = useCallback(
    (choice: 'server' | 'draft') => {
      if (!conflict) return;
      if (choice === 'server') {
        clearDraft(kind, id);
        setState(conflict.server);
      } else {
        setState({
          ...conflict.draft,
          meta: { ...conflict.draft.meta, id: conflict.server.meta.id },
        });
        touched.current = true;
      }
      setConflict(null);
      setReady(true);
    },
    [conflict, kind, id],
  );

  /** Buang draf lokal. Mode ubah: muat ulang dari server. */
  const discardDraft = useCallback(async () => {
    persist.cancel();
    clearDraft(kind, id);
    touched.current = false;
    setDraftStatus('idle');
    setActiveSession(kind === 'quiz' ? 0 : null);
    setQuestionIndex(0);
    if (!isEdit) {
      setState(emptyState(kind));
      return;
    }
    const fresh = await detail.refetch();
    if (fresh.data && categories.data)
      setState(fromServer(fresh.data, categories.data, kind));
  }, [kind, id, isEdit, detail, categories.data, persist]);

  /** Setelah simpan berhasil: draf dihapus, mode ubah memuat ulang data server. */
  const afterSave = useCallback(async () => {
    persist.cancel();
    clearDraft(kind, id);
    touched.current = false;
    setDraftStatus('idle');
    if (isEdit) {
      const fresh = await detail.refetch();
      if (fresh.data && categories.data)
        setState(fromServer(fresh.data, categories.data, kind));
    }
  }, [kind, id, isEdit, detail, categories.data, persist]);

  const error = categories.error ?? detail.error;
  const loading = !ready && !conflict && !error;

  return {
    kind,
    id,
    isEdit,
    state,
    ready,
    loading,
    error,
    retry: () => {
      void categories.refetch();
      if (isEdit) void detail.refetch();
    },
    conflict,
    resolveConflict,
    categories: categories.data ?? [],
    draftStatus,
    updateMeta,
    updateSession,
    updateQuestion,
    change,
    activeSession,
    openSession,
    questionIndex,
    setQuestionIndex,
    discardDraft,
    afterSave,
  };
}

export type AssessmentEditorController = ReturnType<typeof useAssessmentEditor>;
