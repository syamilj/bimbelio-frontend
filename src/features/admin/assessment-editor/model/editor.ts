// Operasi murni pada sesi/soal editor asesmen.

import {
  convertAnswers,
  defaultAnswers,
  fromFivePointValue,
  isAssessmentType,
} from './scoring';
import type {
  AssessmentKind,
  AssessmentType,
  EditorQuestion,
  EditorSession,
  EditorState,
} from './types';

export const DEFAULT_TYPE: Record<AssessmentKind, AssessmentType> = {
  tryout: '1-5',
  quiz: '0-100',
};

export const sessionType = (
  session: EditorSession,
  kind: AssessmentKind = 'tryout',
): AssessmentType =>
  isAssessmentType(session.assessmentType)
    ? session.assessmentType
    : DEFAULT_TYPE[kind];

export function emptySession(kind: AssessmentKind = 'tryout'): EditorSession {
  return {
    categoryId: '',
    name: '',
    description: '',
    duration: 0,
    thresholdValue: 0,
    assessmentType: DEFAULT_TYPE[kind],
    Questions: [],
  };
}

export function emptyState(kind: AssessmentKind): EditorState {
  return {
    meta: { restTime: 0 },
    // Quiz selalu tepat satu sesi.
    sessions: kind === 'quiz' ? [emptySession('quiz')] : [],
    quizVolume: null,
  };
}

let uidCounter = 0;
/** Kunci lokal stabil untuk soal (React key), tidak dikirim ke server. */
export const newUid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `q-${Date.now()}-${++uidCounter}`;

const renumber = (questions: EditorQuestion[]) =>
  questions.map((q, i) => (q.number === i + 1 ? q : { ...q, number: i + 1 }));

export function addQuestion(
  session: EditorSession,
  kind: AssessmentKind = 'tryout',
): EditorSession {
  const question: EditorQuestion = {
    uid: newUid(),
    number: session.Questions.length + 1,
    question: '',
    Answers: defaultAnswers(sessionType(session, kind)),
    courseChapterIds: [],
  };
  return { ...session, Questions: [...session.Questions, question] };
}

export function removeQuestion(
  session: EditorSession,
  index: number,
): EditorSession {
  return {
    ...session,
    Questions: renumber(session.Questions.filter((_, i) => i !== index)),
  };
}

const move = <T>(list: T[], from: number, to: number) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(to, next.length)), 0, item);
  return next;
};

/** Pindahkan soal ke posisi `to` (0-based) lalu nomori ulang. */
export function moveQuestion(
  session: EditorSession,
  from: number,
  to: number,
): EditorSession {
  return { ...session, Questions: renumber(move(session.Questions, from, to)) };
}

export function moveAnswer(
  question: EditorQuestion,
  from: number,
  to: number,
): EditorQuestion {
  return { ...question, Answers: move(question.Answers, from, to) };
}

export const moveSession = (
  sessions: EditorSession[],
  from: number,
  to: number,
) => move(sessions, from, to);

export function changeSessionType(
  session: EditorSession,
  to: AssessmentType,
): EditorSession {
  const from = session.assessmentType;
  return {
    ...session,
    assessmentType: to,
    Questions: session.Questions.map((q) => ({
      ...q,
      Answers: convertAnswers(q.Answers, from, to),
    })),
  };
}

export type GeneratedQuestion = {
  number: number;
  question: string;
  Answers: { answer: string; value: number }[];
};

/** Tambahkan soal hasil AI ke akhir sesi (nilai 1–5 dikonversi ke tipe sesi). */
export function appendGenerated(
  session: EditorSession,
  generated: GeneratedQuestion[],
  kind: AssessmentKind = 'tryout',
): EditorSession {
  const type = sessionType(session, kind);
  const start = session.Questions.length;
  return {
    ...session,
    Questions: [
      ...session.Questions,
      ...generated.map((g, i) => ({
        uid: newUid(),
        number: start + i + 1,
        question: g.question,
        Answers: g.Answers.map((a) => ({
          answer: a.answer,
          value: fromFivePointValue(a.value, type),
        })),
        courseChapterIds: [],
      })),
    ],
  };
}

/** Lengkapi data (mis. dari draf lama) agar aman dipakai editor. */
export function normalizeSession(
  session: Partial<EditorSession> | null | undefined,
  kind: AssessmentKind = 'tryout',
): EditorSession {
  const base = { ...emptySession(kind), ...(session ?? {}) };
  return {
    ...base,
    Questions: (base.Questions ?? []).filter(Boolean).map((q, i) => ({
      ...q,
      uid: q.uid ?? newUid(),
      number: q.number ?? i + 1,
      question: q.question ?? '',
      courseChapterIds: Array.isArray(q.courseChapterIds)
        ? q.courseChapterIds
        : [],
      Answers: Array.isArray(q.Answers) ? q.Answers : [],
    })),
  };
}

/** Sesi berganti kategori tes: subtes ikut dikosongkan. */
export function setSessionCategory(
  session: EditorSession,
  category: { id: string; name: string } | null,
): EditorSession {
  return {
    ...session,
    categoryId: category?.id ?? '',
    category: category?.name ?? '',
    subCategoryId: '',
    subCategory: '',
  };
}

export const durationNumber = (duration: EditorSession['duration']) =>
  typeof duration === 'string'
    ? duration === ''
      ? 0
      : parseFloat(duration)
    : (duration ?? 0);

export const totalQuestions = (sessions: EditorSession[]) =>
  sessions.reduce((n, s) => n + s.Questions.length, 0);
