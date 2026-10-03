'use client';

import { api } from '@/lib/api/client';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type {
  AssessmentListItem,
  IrtResult,
  QuizVolume,
  QuizVolumeDetail,
  TryoutForIrt,
} from './model/types';

/** Semua kunci query admin asesmen; `invalidateQueries(['admin','assessments'])` menyegarkan semuanya. */
export const adminAssessmentKeys = {
  all: ['admin', 'assessments'] as const,
  list: (type: 'TRYOUT' | 'QUIZ') =>
    [...adminAssessmentKeys.all, 'list', type] as const,
  info: () => [...adminAssessmentKeys.all, 'info'] as const,
  irt: (id: string) => [...adminAssessmentKeys.all, 'irt', id] as const,
  volumes: (params: object) =>
    [...adminAssessmentKeys.all, 'volumes', params] as const,
  volume: (id: string) => [...adminAssessmentKeys.all, 'volume', id] as const,
  quizOptions: (q: string) =>
    [...adminAssessmentKeys.all, 'quiz-options', q] as const,
  subCategories: () => [...adminAssessmentKeys.all, 'sub-categories'] as const,
};

/** Daftar try out/quiz (endpoint mengembalikan semua; paginasi di client). */
export const useAssessmentList = (type: 'TRYOUT' | 'QUIZ') =>
  useQuery({
    queryKey: adminAssessmentKeys.list(type),
    queryFn: ({ signal }) =>
      api.get<AssessmentListItem[]>('/tryout/getTryout', {
        params: { type },
        signal,
      }),
  });

export const useAssessmentInfo = () =>
  useQuery({
    queryKey: adminAssessmentKeys.info(),
    queryFn: ({ signal }) =>
      api.get<{ title: string; total: number }[]>('/tryout/getTryoutInfo', {
        signal,
      }),
  });

// ── IRT ──────────────────────────────────────────────────────────────────────

export const useTryoutForIrt = (tryoutId: string) =>
  useQuery({
    queryKey: adminAssessmentKeys.irt(tryoutId),
    queryFn: ({ signal }) =>
      api.get<TryoutForIrt>('/irt/getTryoutDataForIrt', {
        params: { tryoutId },
        signal,
      }),
    staleTime: Infinity,
  });

export const processIrt = async (sessionId: string, tryoutId: string) =>
  (
    await api.post<IrtResult>('/irt/processIrtForSession', {
      sessionId,
      tryoutId,
    })
  ).data;

export const saveIrt = (
  sessionId: string,
  tryoutId: string,
  result: Pick<IrtResult, 'participants' | 'question'>,
) =>
  api.post('/irt/saveIrtForSession', {
    sessionId,
    tryoutId,
    SaveDataIRT: {
      participants: result.participants,
      question: result.question,
    },
  });

// ── Volume quiz ──────────────────────────────────────────────────────────────

export const useQuizVolumes = (params: {
  page: number;
  take: number;
  search: string;
}) =>
  useQuery({
    queryKey: adminAssessmentKeys.volumes(params),
    queryFn: ({ signal }) =>
      api.paginated<QuizVolume[]>('/quizTryout/getQuizVolume', {
        params,
        signal,
      }),
    placeholderData: keepPreviousData,
  });

export const useQuizVolume = (id: string | undefined) =>
  useQuery({
    queryKey: adminAssessmentKeys.volume(id ?? ''),
    queryFn: ({ signal }) =>
      api.get<QuizVolumeDetail>('/quizTryout/getSingleQuizVolume', {
        params: { id },
        signal,
      }),
    enabled: !!id,
  });

export type QuizOption = QuizVolumeDetail['Tryout'][number];

export const useQuizOptions = (search: string) =>
  useQuery({
    queryKey: adminAssessmentKeys.quizOptions(search),
    queryFn: ({ signal }) =>
      api.get<QuizOption[]>('/quizTryout/getQuizTryoutList', {
        params: { search, take: 10, page: 1 },
        signal,
      }),
    enabled: search.length === 0 || search.length >= 3,
    placeholderData: keepPreviousData,
  });

export const useTryoutSubCategories = () =>
  useQuery({
    queryKey: adminAssessmentKeys.subCategories(),
    queryFn: ({ signal }) =>
      api.get<{ id: string; name: string; categoryId?: string }[]>(
        '/tryoutCategory/getSubCategory',
        { signal },
      ),
    staleTime: 5 * 60_000,
  });

export type QuizVolumePayload = {
  id?: string;
  title: string;
  number: number;
  status: string;
  startDate: string;
  endDate: string;
  resultDate: string;
  image: string | null;
  TryoutIds: { id: string; quizOrder: number }[];
};

export function useSaveQuizVolume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: QuizVolumePayload) =>
      api.post(
        payload.id
          ? '/quizTryout/updateQuizVolume'
          : '/quizTryout/createQuizVolume',
        payload,
      ),
    meta: { successMessage: 'Volume quiz tersimpan.' },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: adminAssessmentKeys.all }),
  });
}

export function useDeleteQuizVolume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete('/quizTryout/deleteQuizVolume', { params: { id } }),
    meta: { successMessage: 'Volume quiz dihapus.' },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: adminAssessmentKeys.all }),
  });
}
