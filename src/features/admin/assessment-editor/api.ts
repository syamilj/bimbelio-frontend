'use client';

import { api } from '@/lib/api/client';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { ChapterOption } from './model/csv-import';
import type { GeneratedQuestion } from './model/editor';
import type {
  AssessmentKind,
  TryoutCategoryOption,
  TryoutForUpdate,
} from './model/types';

export const assessmentKeys = {
  all: ['admin', 'assessment'] as const,
  categories: () => [...assessmentKeys.all, 'tryout-categories'] as const,
  detail: (id: string) => [...assessmentKeys.all, 'detail', id] as const,
  courseCategories: () => [...assessmentKeys.all, 'course-categories'] as const,
  chapters: (categoryId: string) =>
    [...assessmentKeys.all, 'chapters', categoryId] as const,
  allChapters: () => [...assessmentKeys.all, 'all-chapters'] as const,
  quizVolumes: (q: string) =>
    [...assessmentKeys.all, 'quiz-volumes', q] as const,
  webCategories: () => [...assessmentKeys.all, 'web-categories'] as const,
  matchCategories: (source: string) =>
    [...assessmentKeys.all, 'match-categories', source] as const,
};

export const useTryoutCategories = () =>
  useQuery({
    queryKey: assessmentKeys.categories(),
    queryFn: ({ signal }) =>
      api.get<TryoutCategoryOption[]>('/tryoutCategory/getCategory', {
        signal,
      }),
    staleTime: 5 * 60_000,
  });

export const useTryoutForUpdate = (id: string | undefined) =>
  useQuery({
    queryKey: assessmentKeys.detail(id ?? ''),
    queryFn: ({ signal }) =>
      api.get<TryoutForUpdate>('/tryout/getTryoutForUpdate', {
        params: { id },
        signal,
      }),
    enabled: !!id,
    // Data editor tidak boleh berubah diam-diam saat sedang disunting.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

const ENDPOINTS: Record<AssessmentKind, { create: string; update: string }> = {
  tryout: { create: '/tryout/createTryout', update: '/tryout/updateTryout' },
  quiz: {
    create: '/quizTryout/createQuizTryout',
    update: '/quizTryout/updateQuizTryout',
  },
};

export const useSaveAssessment = (kind: AssessmentKind) =>
  useMutation({
    mutationFn: ({
      mode,
      body,
    }: {
      mode: 'create' | 'update';
      body: unknown;
    }) =>
      mode === 'create'
        ? api.post<{ Tryout?: { id?: string } }>(ENDPOINTS[kind].create, body)
        : api.put(ENDPOINTS[kind].update, body),
    meta: {
      successMessage:
        kind === 'quiz' ? 'Quiz tersimpan.' : 'Try out tersimpan.',
    },
  });

export const useDeleteAssessment = (kind: AssessmentKind) =>
  useMutation({
    mutationFn: (id: string) =>
      api.delete('/tryout/deleteTryout', { params: { id } }),
    meta: {
      successMessage: kind === 'quiz' ? 'Quiz dihapus.' : 'Try out dihapus.',
    },
  });

export const useGenerateQuestions = () =>
  useMutation({
    mutationFn: async (context: string) =>
      (
        await api.post<GeneratedQuestion[]>('/tryout/generateTryout', {
          context,
        })
      ).data,
  });

type CourseCategory = { id: string; name: string };
type CourseChapter = { id: string; title: string };

export const useCourseCategories = () =>
  useQuery({
    queryKey: assessmentKeys.courseCategories(),
    queryFn: ({ signal }) =>
      api.get<CourseCategory[]>('/category/getAllCategories', { signal }),
    staleTime: 5 * 60_000,
  });

export const useCourseChapters = (categoryId: string | undefined) =>
  useQuery({
    queryKey: assessmentKeys.chapters(categoryId ?? ''),
    queryFn: ({ signal }) =>
      api.get<CourseChapter[]>('/course/getCourseUserByCategoryId', {
        params: { adminPage: true, categoryId },
        signal,
      }),
    enabled: !!categoryId,
    staleTime: 5 * 60_000,
  });

export const useAllChapters = (enabled: boolean) =>
  useQuery({
    queryKey: assessmentKeys.allChapters(),
    queryFn: ({ signal }) =>
      api.get<ChapterOption[]>('/course/getAllCourseChapterId', { signal }),
    enabled,
    staleTime: 5 * 60_000,
  });

export type QuizVolumeOption = {
  id: string;
  title: string | null;
  number?: number;
  startDate: string;
  endDate: string;
};

export const useQuizVolumeOptions = (search: string, enabled = true) =>
  useQuery({
    queryKey: assessmentKeys.quizVolumes(search),
    queryFn: ({ signal }) =>
      api.get<QuizVolumeOption[]>('/quizTryout/getQuizVolumeList', {
        params: { search, take: 10, page: 1 },
        signal,
      }),
    // Sama seperti versi lama: cari setelah ≥3 huruf (atau tanpa kata kunci).
    enabled: enabled && (search.length === 0 || search.length >= 3),
    placeholderData: keepPreviousData,
  });

export type WebCategory = {
  id: string;
  name: string;
  WebsiteSubCategory: { id: string; name: string }[];
};

export const useWebCategories = (enabled: boolean) =>
  useQuery({
    queryKey: assessmentKeys.webCategories(),
    queryFn: ({ signal }) =>
      api.get<WebCategory[]>('/website-category/getWebsiteCategory', {
        signal,
      }),
    enabled,
    staleTime: 5 * 60_000,
  });

export async function fetchMatchCategories(
  trackId: string,
  sourceTrackId: string,
) {
  const data = await api.get<{ categories?: { id: string; name: string }[] }>(
    '/ai/getMatchCategories',
    {
      params: {
        website_sub_category_id: trackId,
        source_website_sub_category_id: sourceTrackId,
      },
    },
  );
  return data?.categories ?? [];
}

export type QuestionMatch = {
  questionIndex: number;
  categoryId: string;
  categoryName: string;
  courseChapterIds: string[];
};

export async function matchQuestions(
  trackId: string,
  sourceTrackId: string,
  categoryIds: string[],
  questions: { index: number; text: string }[],
) {
  const res = await api.post<{ matches?: QuestionMatch[] }>(
    '/ai/matchQuestionCategory',
    { questions },
    {
      params: {
        website_sub_category_id: trackId,
        source_website_sub_category_id: sourceTrackId,
        ...(categoryIds.length > 0
          ? { category_ids: categoryIds.join(',') }
          : {}),
      },
    },
  );
  return res.data?.matches ?? [];
}
