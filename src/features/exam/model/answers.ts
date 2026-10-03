import type {
  AnswerEntry,
  DraftAnswer,
  ExamQuestion,
  QuestionType,
} from '../types';

/** Lembar jawaban satu sesi, urut sesuai soal. */
export type AnswerSheet = AnswerEntry[];

export const emptySheet = (questions: ExamQuestion[]): AnswerSheet =>
  questions.map((q) => ({
    number: q.number,
    questionId: q.id,
    answerId: '',
    answer: '',
    type: q.type,
    notSure: false,
  }));

export const isAnswered = (entry: AnswerEntry | undefined) =>
  !!entry &&
  ((entry.answerId ?? '').trim().length > 0 ||
    (entry.answer ?? '').trim().length > 0);

export type SheetStats = {
  total: number;
  answered: number;
  flagged: number;
  empty: number;
  /** Nomor soal (1-based urutan) yang belum dijawab. */
  emptyNumbers: number[];
  flaggedNumbers: number[];
};

export function sheetStats(sheet: AnswerSheet): SheetStats {
  const emptyNumbers: number[] = [];
  const flaggedNumbers: number[] = [];
  sheet.forEach((e, i) => {
    if (!isAnswered(e)) emptyNumbers.push(i + 1);
    if (e.notSure) flaggedNumbers.push(i + 1);
  });
  return {
    total: sheet.length,
    answered: sheet.length - emptyNumbers.length,
    flagged: flaggedNumbers.length,
    empty: emptyNumbers.length,
    emptyNumbers,
    flaggedNumbers,
  };
}

// ---------------------------------------------------------------- aksi

export type SheetAction =
  | { type: 'pilih'; index: number; answerId: string }
  | { type: 'kosongkan'; index: number }
  | { type: 'isian'; index: number; text: string; answerId: string }
  | { type: 'ragu'; index: number; value?: boolean }
  | { type: 'ganti'; sheet: AnswerSheet };

const update = (
  sheet: AnswerSheet,
  index: number,
  patch: (e: AnswerEntry) => AnswerEntry,
) => {
  if (!sheet[index]) return sheet;
  const next = sheet.slice();
  next[index] = patch(sheet[index]);
  return next;
};

export function sheetReducer(
  sheet: AnswerSheet,
  action: SheetAction,
): AnswerSheet {
  switch (action.type) {
    case 'pilih':
      // Memilih opsi yang sudah terpilih = membatalkan (perilaku lama).
      return update(sheet, action.index, (e) =>
        e.answerId === action.answerId
          ? { ...e, answerId: '', answer: '' }
          : { ...e, answerId: action.answerId, answer: '' },
      );
    case 'kosongkan':
      return update(sheet, action.index, (e) => ({
        ...e,
        answerId: '',
        answer: '',
      }));
    case 'isian':
      // Jawaban singkat: backend menilai lewat opsi tunggal soal itu. Teks
      // kosong = belum dijawab (dulu tetap terhitung terjawab).
      return update(sheet, action.index, (e) => ({
        ...e,
        answer: action.text,
        answerId: action.text.trim() ? action.answerId : '',
      }));
    case 'ragu':
      return update(sheet, action.index, (e) => ({
        ...e,
        notSure: action.value ?? !e.notSure,
      }));
    case 'ganti':
      return action.sheet;
  }
}

// ---------------------------------------------------------------- payload

/** Body `finishSession`/`finishSessionLate`: semua field wajib ada. */
export const toSubmitAnswers = (sheet: AnswerSheet): AnswerEntry[] =>
  sheet.map((e) => ({
    number: e.number,
    questionId: e.questionId,
    answerId: e.answerId ?? '',
    answer: e.type === 'SHORT_ANSWER' ? (e.answer ?? '') : '',
    type: e.type,
    notSure: !!e.notSure,
  }));

/** Batas backend untuk satu draft (MAX_DRAFT_ANSWERS). */
export const MAX_DRAFT_ANSWERS = 500;

export const toDraftAnswers = (sheet: AnswerSheet): DraftAnswer[] =>
  sheet.slice(0, MAX_DRAFT_ANSWERS).map((e) => ({
    questionId: e.questionId,
    answerId: e.answerId ?? '',
    notSure: !!e.notSure,
  }));

/**
 * Pasang jawaban tersimpan (lokal/server) ke soal sesi saat ini. Soal yang
 * tidak ada di simpanan tetap kosong; opsi yang tidak lagi ada dibuang.
 */
export function applySaved(
  questions: ExamQuestion[],
  saved: Partial<AnswerEntry>[] | null | undefined,
): AnswerSheet {
  const base = emptySheet(questions);
  if (!saved?.length) return base;
  const byId = new Map(saved.map((s) => [s.questionId, s]));
  return base.map((entry, i) => {
    const s = byId.get(entry.questionId);
    if (!s) return entry;
    const q = questions[i];
    const validOption =
      !!s.answerId && q.TryoutAnswers.some((o) => o.id === s.answerId);
    return {
      ...entry,
      answerId: validOption ? (s.answerId as string) : '',
      answer:
        q.type === 'SHORT_ANSWER' && validOption ? (s.answer ?? '') : '',
      notSure: !!s.notSure,
    };
  });
}

/**
 * Gabungkan draft server dengan cadangan lokal: yang lebih baru menang.
 * Draft server tidak membawa teks jawaban singkat, jadi teks diambil dari
 * cadangan lokal bila opsinya sama.
 */
export function mergeSaved(
  local: { answers: Partial<AnswerEntry>[]; updatedAt: number } | null,
  server: ServerDraftLike | null,
): Partial<AnswerEntry>[] | null {
  if (!server) return local?.answers ?? null;
  const serverAt = new Date(server.updatedAt).getTime() || 0;
  if (local && local.updatedAt >= serverAt) return local.answers;
  const localById = new Map(
    (local?.answers ?? []).map((a) => [a.questionId, a]),
  );
  return server.answers.map((a) => {
    const l = localById.get(a.questionId);
    return {
      ...a,
      answer: l && l.answerId === a.answerId ? (l.answer ?? '') : '',
    };
  });
}

type ServerDraftLike = { answers: DraftAnswer[]; updatedAt: string };

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  OBJECTIVE_5: 'Pilihan ganda',
  TRUE_FALSE: 'Benar/salah',
  SHORT_ANSWER: 'Jawaban singkat',
};
