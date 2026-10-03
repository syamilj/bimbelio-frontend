// Model editor asesmen (try out & quiz). Bentuk data sengaja sama dengan
// kode lama (`TryoutProps`/`SessionProps`/`QuestionProps`) agar draf yang
// tersimpan di localStorage oleh versi lama tetap bisa dibuka.

export const ASSESSMENT_TYPES = [
  '1-5',
  '+5/0',
  'IRT',
  '+4/-1/0',
  '+1/0',
  '0-100',
] as const;
export type AssessmentType = (typeof ASSESSMENT_TYPES)[number];

/** Backend quiz hanya menerima tipe ini (`createQuizTryout`). */
export const QUIZ_ASSESSMENT_TYPES: AssessmentType[] = [
  '1-5',
  '+5/0',
  '+4/-1/0',
  '0-100',
];

export type AssessmentKind = 'tryout' | 'quiz';
export type PublishStatus = 'PUBLIC' | 'PRIVATE' | 'DRAFT';

export type EditorAnswer = {
  id?: string;
  answer: string;
  value: number;
  /** Nama file di bucket `to-question`. */
  image?: string | null;
};

export type EditorQuestion = {
  /** Kunci lokal untuk React (tidak dikirim ke server). */
  uid?: string;
  id?: string;
  number: number;
  question: string;
  image?: string | null;
  explanation?: string;
  subCategory?: string;
  subSubCategory?: string;
  /** Kategori course untuk memilih bab materi. */
  categoryId?: string;
  courseChapterIds: string[];
  Answers: EditorAnswer[];
};

export type EditorSession = {
  id?: string;
  tryoutId?: string;
  categoryId?: string;
  category?: string;
  subCategoryId?: string;
  subCategory?: string;
  /** ID dokumen pembahasan (opsional). */
  documentId?: string | null;
  name?: string;
  slug?: string;
  description?: string;
  /** Menit. String kosong saat input dikosongkan. */
  duration?: number | string;
  thresholdValue?: number;
  assessmentType?: AssessmentType | string;
  Questions: EditorQuestion[];
};

export type EditorMeta = {
  id?: string;
  title?: string;
  restTime?: number;
  status?: PublishStatus;
  /** `YYYY-MM-DDTHH:mm` waktu lokal. */
  startDate?: string;
  endDate?: string;
  resultDate?: string;
  /** Nama file di bucket `img/tryout`. */
  image?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  /** Dari server; dipakai untuk membandingkan draf lokal. */
  updateAt?: string;
};

export type QuizVolumeRef = { id: string; name: string };

export type EditorState = {
  meta: EditorMeta;
  sessions: EditorSession[];
  /** Hanya quiz. */
  quizVolume: QuizVolumeRef | null;
};

export type TryoutCategoryOption = {
  id: string;
  name: string;
  TryoutSubCategory: { id: string; name: string }[];
};

/** Bentuk respons `GET /tryout/getTryoutForUpdate`. */
export type TryoutForUpdate = {
  id: string;
  title: string;
  restTime: number;
  status: PublishStatus;
  startDate: string;
  endDate: string;
  resultDate: string;
  image: string | null;
  instagram: string | null;
  tiktok: string | null;
  updateAt: string;
  QuizVolume?: { id: string; title: string | null } | null;
  TryoutSession: {
    id: string;
    tryoutId: string;
    categoryId: string;
    subCategoryId: string;
    documentId: string | null;
    name: string;
    slug: string;
    description: string | null;
    duration: number;
    thresholdValue: number | null;
    assessmentType: string;
    TryoutQuestion: {
      id: string;
      number: number;
      question: string;
      image: string | null;
      explanation: string | null;
      subCategory: string | null;
      subSubCategory: string | null;
      Pivot_TryoutQuestion_CourseChapter: {
        courseChapterId: string;
        CourseChapter?: { categoryId: string } | null;
      }[];
      TryoutAnswers: {
        id: string;
        answer: string;
        value: number;
        image: string | null;
      }[];
    }[];
  }[];
};
