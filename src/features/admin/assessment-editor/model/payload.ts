// Konversi data server ↔ editor, payload simpan, dan validasi sebelum simpan.

import { toLocalInput } from '../../lib/format';
import { durationNumber, normalizeSession, sessionType } from './editor';
import { isAssessmentType } from './scoring';
import type {
  AssessmentKind,
  EditorSession,
  EditorState,
  TryoutCategoryOption,
  TryoutForUpdate,
} from './types';

export function fromServer(
  data: TryoutForUpdate,
  categories: TryoutCategoryOption[],
  kind: AssessmentKind,
): EditorState {
  const sessions: EditorSession[] = data.TryoutSession.map((session) => {
    const category = categories.find((c) => c.id === session.categoryId);
    const sub = category?.TryoutSubCategory.find(
      (s) => s.id === session.subCategoryId,
    );
    return normalizeSession(
      {
        id: session.id,
        tryoutId: session.tryoutId,
        categoryId: session.categoryId,
        category: category?.name,
        subCategoryId: session.subCategoryId,
        subCategory: sub?.name,
        documentId: session.documentId,
        name: session.name,
        slug: session.slug,
        description: session.description ?? undefined,
        duration: session.duration,
        thresholdValue: session.thresholdValue ?? undefined,
        assessmentType: session.assessmentType,
        Questions: session.TryoutQuestion.map((q) => ({
          id: q.id,
          number: q.number,
          question: q.question,
          image: q.image,
          explanation: q.explanation ?? undefined,
          subCategory: q.subCategory ?? undefined,
          subSubCategory: q.subSubCategory ?? undefined,
          categoryId:
            q.Pivot_TryoutQuestion_CourseChapter[0]?.CourseChapter
              ?.categoryId ?? undefined,
          courseChapterIds: q.Pivot_TryoutQuestion_CourseChapter.map(
            (p) => p.courseChapterId,
          ),
          Answers: q.TryoutAnswers.map((a) => ({
            id: a.id,
            answer: a.answer,
            value: a.value,
            image: a.image,
          })),
        })),
      },
      kind,
    );
  });

  return {
    meta: {
      id: data.id,
      title: data.title,
      restTime: data.restTime,
      status: data.status,
      startDate: toLocalInput(data.startDate),
      endDate: toLocalInput(data.endDate),
      resultDate: toLocalInput(data.resultDate),
      image: data.image,
      instagram: data.instagram,
      tiktok: data.tiktok,
      updateAt: data.updateAt,
    },
    sessions: kind === 'quiz' ? sessions.slice(0, 1) : sessions,
    quizVolume: data.QuizVolume
      ? { id: data.QuizVolume.id, name: data.QuizVolume.title ?? '' }
      : null,
  };
}

export type ValidationIssue = {
  message: string;
  /** Lokasi untuk dibuka otomatis di editor. */
  sessionIndex?: number;
  questionIndex?: number;
};

const blank = (v: string | null | undefined) => !v || v.trim().length === 0;

/** Pesan pertama yang menghalangi simpan, atau null bila valid. */
export function validateEditor(
  state: EditorState,
  kind: AssessmentKind,
): ValidationIssue | null {
  const { meta, sessions } = state;
  const noun = kind === 'quiz' ? 'quiz' : 'try out';
  if (blank(meta.title)) return { message: `Isi judul ${noun} dulu.` };
  if (!meta.status) return { message: 'Pilih status publikasi.' };
  if (blank(meta.startDate)) return { message: 'Isi waktu mulai.' };
  if (blank(meta.endDate)) return { message: 'Isi waktu berakhir.' };
  if (blank(meta.resultDate)) return { message: 'Isi waktu pembagian hasil.' };
  if (meta.startDate! > meta.endDate!)
    return { message: 'Waktu berakhir harus setelah waktu mulai.' };
  if (sessions.length === 0) return { message: 'Buat minimal 1 sesi.' };

  const irtCount = sessions.filter((s) => s.assessmentType === 'IRT').length;
  if (irtCount > 0 && irtCount < sessions.length)
    return {
      message:
        'Penilaian IRT harus dipakai di semua sesi, atau tidak sama sekali.',
    };

  for (const [si, s] of sessions.entries()) {
    const at = kind === 'quiz' ? 'Sesi quiz' : `Sesi ${si + 1}`;
    if (blank(s.categoryId))
      return { message: `${at}: pilih kategori tes.`, sessionIndex: si };
    if (blank(s.subCategoryId))
      return { message: `${at}: pilih subtes.`, sessionIndex: si };
    if (blank(s.name))
      return { message: `${at}: isi nama sesi.`, sessionIndex: si };
    if (!isAssessmentType(s.assessmentType))
      return { message: `${at}: pilih tipe penilaian.`, sessionIndex: si };
    if (durationNumber(s.duration) < 5)
      return {
        message: `${at}: durasi minimal 5 menit.`,
        sessionIndex: si,
      };
    if (s.Questions.length === 0)
      return { message: `${at}: belum ada soal.`, sessionIndex: si };
    for (const [qi, q] of s.Questions.entries()) {
      const where = { sessionIndex: si, questionIndex: qi };
      if (blank(q.question))
        return {
          message: `${at}, soal ${qi + 1}: isi soal masih kosong.`,
          ...where,
        };
      if (q.Answers.some((a) => blank(a.answer)))
        return {
          message: `${at}, soal ${qi + 1}: masih ada opsi jawaban kosong.`,
          ...where,
        };
    }
  }
  return null;
}

const metaPayload = (state: EditorState, kind: AssessmentKind) => ({
  ...(state.meta.id ? { id: state.meta.id } : {}),
  title: state.meta.title!.trim(),
  ...(kind === 'tryout' ? { restTime: state.meta.restTime || 0 } : {}),
  status: state.meta.status!,
  startDate: state.meta.startDate!,
  endDate: state.meta.endDate!,
  resultDate: state.meta.resultDate!,
  image: state.meta.image || '',
  instagram: state.meta.instagram ?? undefined,
  tiktok: state.meta.tiktok ?? undefined,
});

function sessionPayload(
  session: EditorSession,
  kind: AssessmentKind,
  mode: 'create' | 'update',
) {
  const withId = mode === 'update';
  return {
    ...(withId ? { id: session.id || 'new' } : {}),
    name: session.name!.trim(),
    categoryId: session.categoryId!,
    subCategoryId: session.subCategoryId!,
    documentId: session.documentId || null,
    // Backend create mewajibkan string; null di DB dikirim sebagai "".
    description: session.description ?? '',
    duration: durationNumber(session.duration),
    thresholdValue: Number.isFinite(session.thresholdValue)
      ? session.thresholdValue
      : undefined,
    assessmentType: sessionType(session, kind),
    TryoutQuestion: session.Questions.map((q) => ({
      ...(withId ? { id: q.id || 'new' } : {}),
      number: q.number,
      question: q.question,
      image: q.image ?? null,
      explanation: q.explanation,
      subCategory: q.subCategory,
      subSubCategory: q.subSubCategory,
      courseChapterIds: q.courseChapterIds,
      TryoutAnswers: q.Answers.map((a) => ({
        ...(withId ? { id: a.id || 'new' } : {}),
        answer: a.answer,
        value: a.value,
        // Versi lama tidak mengirim gambar opsi saat ubah, sehingga gambar
        // opsi yang baru diunggah tidak pernah tersimpan.
        image: a.image ?? null,
      })),
    })),
  };
}

/** Body untuk create/update try out (`/tryout/*`) atau quiz (`/quizTryout/*`). */
export function toPayload(
  state: EditorState,
  kind: AssessmentKind,
  mode: 'create' | 'update',
) {
  const Tryout = metaPayload(state, kind);
  if (kind === 'quiz') {
    return {
      QuizVolumeId: state.quizVolume?.id || undefined,
      Tryout,
      TryoutSession: sessionPayload(state.sessions[0], kind, mode),
    };
  }
  return {
    Tryout,
    TryoutSession: state.sessions.map((s) => sessionPayload(s, kind, mode)),
  };
}
