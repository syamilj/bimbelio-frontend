import type { AssessmentListItem, ListQuestion } from './types';

export const STATUS_LABELS: Record<string, string> = {
  PUBLIC: 'Publik',
  PRIVATE: 'Privat',
  DRAFT: 'Draf',
  ACTIVE: 'Aktif',
  INACTIVE: 'Nonaktif',
  ENDED: 'Selesai',
};

export const statusLabel = (status: string) => STATUS_LABELS[status] ?? status;

/** Soal dianggap sudah "AI Match" bila punya bab materi atau subkategori. */
export const isQuestionMatched = (q: ListQuestion) =>
  (q.Pivot_TryoutQuestion_CourseChapter?.length ?? 0) > 0 ||
  !!q.subCategory?.trim() ||
  !!q.subSubCategory?.trim();

export type AiMatchState = 'empty' | 'ready' | 'partial' | 'none';

export const AI_MATCH_LABELS: Record<AiMatchState, string> = {
  empty: 'Belum dicek',
  ready: 'Siap',
  partial: 'Sebagian',
  none: 'Belum',
};

export function aiMatchSummary(
  item: Pick<AssessmentListItem, 'TryoutSession'>,
  subtestLabel: (name: string) => string = (n) => n,
) {
  const questions = item.TryoutSession.flatMap((s) => s.TryoutQuestion);
  const total = questions.length;
  const matched = questions.filter(isQuestionMatched).length;
  const state: AiMatchState =
    total === 0
      ? 'empty'
      : matched === total
        ? 'ready'
        : matched > 0
          ? 'partial'
          : 'none';
  const sessions = item.TryoutSession.map((s) => ({
    name: subtestLabel(s.TryoutSubCategory.name),
    unmatched: s.TryoutQuestion.map((q, i) => ({ q, n: q.number || i + 1 }))
      .filter(({ q }) => !isQuestionMatched(q))
      .map(({ n }) => n)
      .sort((a, b) => a - b),
  })).filter((s) => s.unmatched.length > 0);
  return { state, total, matched, sessions };
}

/** Baris ekspor parameter IRT satu sesi (format file lama). */
export const irtParamRows = (
  session: AssessmentListItem['TryoutSession'][number],
) => {
  const name = `${session.TryoutCategory.name} - ${session.TryoutSubCategory.name}`;
  return {
    fileName: name,
    rows: session.TryoutQuestion.map((q) => ({
      Session: name,
      Question: q.number,
      a: q.a_discrimination,
      b: q.b_difficulty,
      c: q.c_guessing,
      SubCategory: q.subCategory,
      SubSubCategory: q.subSubCategory,
    })),
  };
};
