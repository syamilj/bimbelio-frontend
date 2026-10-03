'use client';

import { api } from '@/lib/api/client';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import type {
  AnswerEntry,
  DraftAnswer,
  ExamTryout,
  ScoreHistoryItem,
  ServerDraft,
  SessionReview,
  TryoutAnalysis,
  University,
  UserTryoutAccount,
} from './types';

// Semua request otomatis membawa `website_sub_category_id` dari URL
// (interceptor `@/lib/api/client`).

export const examKeys = {
  all: ['exam'] as const,
  tryout: (tryoutId: string, userId?: string, volumeId?: string | null) =>
    ['exam', 'tryout', tryoutId, userId, volumeId ?? null] as const,
  draft: (sessionId: string) => ['exam', 'draft', sessionId] as const,
  review: (sessionId: string) => ['exam', 'review', sessionId] as const,
  analysis: (tryoutId: string) => ['exam', 'analysis', tryoutId] as const,
  unlock: (tryoutId: string) => ['exam', 'unlock', tryoutId] as const,
  account: (userId?: string) => ['exam', 'account', userId] as const,
  universities: ['exam', 'universities'] as const,
  history: (userId?: string) => ['exam', 'history', userId] as const,
  simulation: (tryoutId: string, univ: string, major: string) =>
    ['exam', 'simulation', tryoutId, univ, major] as const,
};

/** Tryout + `receivedAt` untuk menghitung selisih jam server. */
export type TryoutQueryData = ExamTryout & { receivedAt: number };

export function useTryout(params: {
  tryoutId: string;
  userId?: string;
  volumeId?: string | null;
}) {
  const { tryoutId, userId, volumeId } = params;
  return useQuery({
    queryKey: examKeys.tryout(tryoutId, userId, volumeId),
    enabled: !!userId && !!tryoutId,
    // Data ujian harus segar setiap dibuka (status sesi berubah di server).
    staleTime: 0,
    queryFn: async ({ signal }): Promise<TryoutQueryData> => {
      const data = await api.get<ExamTryout>('/tryout/getTryoutById', {
        params: {
          userId,
          tryoutId,
          ...(volumeId ? { volumeId } : {}),
        },
        signal,
      });
      return { ...data, receivedAt: Date.now() };
    },
  });
}

export const invalidateTryout = (qc: QueryClient, tryoutId: string) =>
  qc.invalidateQueries({ queryKey: ['exam', 'tryout', tryoutId] });

/** Mulai sesi (juga dipakai "lanjut" dari istirahat). */
export function useStartSession(tryoutId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { sessionId: string; userId: string }) =>
      api.post('/tryoutSession/createTryoutSessionParticipant', body),
    onSuccess: () => invalidateTryout(qc, tryoutId),
  });
}

export type FinishBody = {
  sessionId: string;
  userId: string;
  answer: AnswerEntry[];
};

/** Kumpulkan sesi. `late` = waktu habis (finishSessionLate). */
export function useFinishSession(tryoutId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ late, ...body }: FinishBody & { late?: boolean }) =>
      api.post(
        late ? '/tryoutSession/finishSessionLate' : '/tryoutSession/finishSession',
        body,
      ),
    meta: { toastError: false },
    onSuccess: () => invalidateTryout(qc, tryoutId),
  });
}

export const saveDraft = (sessionId: string, answers: DraftAnswer[]) =>
  api.put('/tryoutSession/saveDraft', { sessionId, answers });

export const getDraft = (sessionId: string, signal?: AbortSignal) =>
  api.get<ServerDraft>('/tryoutSession/getDraft', {
    params: { sessionId },
    signal,
  });

// ---------------------------------------------------------------- hasil

export function useSessionReview(sessionId: string | undefined, userId?: string) {
  return useQuery({
    queryKey: examKeys.review(sessionId ?? ''),
    enabled: !!sessionId && !!userId,
    queryFn: ({ signal }) =>
      api.get<SessionReview>('/tryoutSession/getTryoutSessionResult', {
        params: { userId, sessionId },
        signal,
      }),
  });
}

export function useTryoutAnalysis(tryoutId: string, userId?: string) {
  return useQuery({
    queryKey: examKeys.analysis(tryoutId),
    enabled: !!userId,
    queryFn: ({ signal }) =>
      api.get<TryoutAnalysis>('/tryout/getAnalisisByTryoutId', {
        params: { userId, tryoutId },
        signal,
      }),
  });
}

/** Apakah posisi & analisis TO ini terbuka (premium/beli). */
export function useTryoutUnlock(
  tryoutId: string,
  userId: string | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: examKeys.unlock(tryoutId),
    enabled: enabled && !!userId,
    queryFn: ({ signal }) =>
      api.get<boolean | null>('/tryout/getTryoutUnlockByTryoutId', {
        params: { userId, tryoutId },
        signal,
      }),
  });
}

export function useTryoutAccount(userId?: string) {
  return useQuery({
    queryKey: examKeys.account(userId),
    enabled: !!userId,
    retry: false,
    queryFn: ({ signal }) =>
      api.get<UserTryoutAccount>('/user/getUserTryOut', {
        params: { userId },
        signal,
      }),
  });
}

export function useUniversities(enabled = true) {
  return useQuery({
    queryKey: examKeys.universities,
    enabled,
    staleTime: 60 * 60_000,
    queryFn: ({ signal }) => api.get<University[]>('/universitas', { signal }),
  });
}

/** Riwayat skor TO (untuk tangga skor & "▲ +N"). Gagal = disembunyikan. */
export function useScoreHistory(userId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: examKeys.history(userId),
    enabled: enabled && !!userId,
    retry: false,
    queryFn: ({ signal }) =>
      api.get<ScoreHistoryItem[]>('/tryout/getTryoutUserProgress', {
        params: { userId },
        signal,
      }),
  });
}

export function useSimulation(params: {
  tryoutId: string;
  userId?: string;
  university: string;
  major: string;
  enabled: boolean;
}) {
  const { tryoutId, userId, university, major, enabled } = params;
  return useQuery({
    queryKey: examKeys.simulation(tryoutId, university, major),
    enabled: enabled && !!userId && !!university && !!major,
    queryFn: ({ signal }) =>
      api.get<TryoutAnalysis['choiceAnalisis']['university'][number] | null>(
        '/tryout/getSimulationDataByTryoutId',
        { params: { userId, tryoutId, university, major }, signal },
      ),
  });
}

/** Admin: ulangi uji coba tryout. */
export function useTestAgain() {
  return useMutation({
    mutationFn: (body: { userId: string; tryoutId: string }) =>
      api.post('/tryout/testAgain', body),
  });
}
