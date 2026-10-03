// Bentuk data API ujian (tryout & quiz BimArena). Hanya field yang dipakai
// frontend; backend boleh mengirim lebih banyak.

export type QuestionType = 'OBJECTIVE_5' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export type ExamMode = 'try-out' | 'quiz';

export type ExamOption = {
  id: string;
  questionId: string;
  /** HTML dari editor (BlockNote) — dirender lewat `renderContent`. */
  answer: string;
  /** Bobot; hanya dikirim setelah sesi selesai (atau untuk staf). */
  value?: number;
};

export type ExamQuestion = {
  id: string;
  number: number;
  sessionId: string;
  question: string;
  type: QuestionType;
  explanation?: string | null;
  TryoutAnswers: ExamOption[];
};

export type SessionParticipant = {
  id: string;
  userId: string;
  sessionId: string;
  startSession: string;
  endSession: string | null;
  isDone: boolean;
};

export type ExamSession = {
  id: string;
  number: number;
  name: string;
  description?: string | null;
  /** Durasi dalam menit. */
  duration: number;
  assessmentType: string;
  TryoutCategory: { id: string; name: string };
  TryoutSubCategory: { id: string; name: string };
  TryoutQuestion: ExamQuestion[];
  TryoutSessionParticipant: SessionParticipant | null;
};

export type ExamTryout = {
  id: string;
  title: string;
  image?: string | null;
  /** Menit istirahat antar subtes. */
  restTime: number;
  startDate: string;
  endDate: string;
  resultDate: string;
  quizOrder?: number | null;
  isFirstQuizInVolume?: boolean | null;
  /** Jam server saat respons dibuat (backend PR #150). Opsional. */
  serverTime?: string;
  TryoutSession: ExamSession[];
  TryoutRegistration: { id: string }[];
};

/** Satu baris lembar jawaban — sama dengan body `finishSession` backend. */
export type AnswerEntry = {
  number: number;
  questionId: string;
  /** "" = belum dijawab. */
  answerId: string;
  /** Teks jawaban singkat; "" untuk pilihan ganda. */
  answer: string;
  type: QuestionType;
  notSure: boolean;
};

export type DraftAnswer = Pick<AnswerEntry, 'questionId' | 'answerId' | 'notSure'>;

export type ServerDraft = { answers: DraftAnswer[]; updatedAt: string } | null;

// ---------------------------------------------------------------- hasil

export type SubtestResult = {
  id: string;
  category: string;
  subCategory: string;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  score: number;
  totalParticipants: number;
  ranking: number;
};

export type ChoiceAnalysis = {
  univ: string;
  univAverageScore: number;
  major: string;
  majorAverageScore: number;
  univRanking: number;
  univPercentage: number;
  univTotalAplicants: number;
  majorRanking: number;
  majorPercentage: number;
  majorTotalAplicants: number;
};

export type TryoutAnalysis = {
  userScore: number;
  totalParticipants: number;
  summaryTryout: {
    userScore: number;
    sessionResult: SubtestResult[];
    Result: {
      category: string;
      data: (Omit<SubtestResult, 'category' | 'subCategory'> & {
        title: string;
      })[];
    }[];
  };
  choiceAnalisis: {
    userScore: number;
    rankingTryout: number;
    tryoutPersentage: number;
    rankingUniv: number;
    rankingMajor: number;
    university: ChoiceAnalysis[];
  };
  /** Distribusi skor peserta — belum dikirim backend; bila ada, tampil BubbleSpread. */
  distribution?: { from: number; to: number; count: number }[];
};

export type ReviewAnswer = {
  id: string;
  questionId: string;
  answerId: string | null;
  TryoutAnswers: ExamOption | null;
  TryoutQuestion: ExamQuestion & {
    Pivot_TryoutQuestion_CourseChapter?: {
      id: string;
      CourseChapter: {
        id: string;
        title: string;
        categoryId: string;
        CourseSubChapter: {
          id: string;
          title: string;
          type: string;
          premium: boolean;
        }[];
      };
    }[];
  };
  difficultyQuestion: { message: string; value: number } | null;
};

export type SessionReview = {
  id: string;
  startSession: string;
  endSession: string | null;
  totalScore: number;
  TryoutSession: {
    id: string;
    name: string;
    Document: { id: string; category: { id: string } } | null;
  };
  TryoutUserAnswer: ReviewAnswer[];
};

export type ScoreHistoryItem = {
  name: string;
  score: number;
  subtestCount?: number;
  benar?: number;
  salah?: number;
  kosong?: number;
  totalQuestions?: number;
};

export type UserTryoutAccount = {
  id: string;
  userTryOutId: string;
  univChoiceOne: string | null;
  univStudyChoiceOne: string | null;
  univChoiceTwo: string | null;
  univStudyChoiceTwo: string | null;
  targetValue: number | null;
};

export type University = {
  university: string;
  initials: string;
  averageScore: number;
  referensi: string | null;
  studyProgramList: {
    study: string;
    averageScore: number | null;
    passingGrade?: number;
  }[];
};
