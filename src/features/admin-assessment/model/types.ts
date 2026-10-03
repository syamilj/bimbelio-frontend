export type AssessmentStatus = 'PUBLIC' | 'PRIVATE' | 'DRAFT' | string;

export type ListQuestion = {
  number: number;
  a_discrimination: number | null;
  b_difficulty: number | null;
  c_guessing: number | null;
  subCategory: string | null;
  subSubCategory: string | null;
  Pivot_TryoutQuestion_CourseChapter?: { id: string }[];
};

/** Item `GET /tryout/getTryout`. */
export type AssessmentListItem = {
  id: string;
  title: string;
  status: AssessmentStatus;
  startDate: string;
  endDate?: string;
  totalRegistration: number;
  totalJoin: number;
  irt: boolean;
  TryoutSession: {
    TryoutCategory: { name: string };
    TryoutSubCategory: { name: string };
    TryoutQuestion: ListQuestion[];
  }[];
};

export type IrtStats = {
  totalParticipants: number;
  averageScores: number;
  averageTheta: number;
  minScores: number;
  maxScores: number;
  medianScores: number;
  minTheta: number;
  maxTheta: number;
  transformMode?: string;
  populationMean?: number;
  populationSd?: number;
  totalPopulation?: number;
  syntheticCount?: number;
};

export type IrtResult = {
  participants: { p: string; theta: number; score: number }[];
  question: {
    q: number;
    a: number | null;
    b: number | null;
    c: number | null;
  }[];
  overallStats: IrtStats;
};

/** `GET /irt/getTryoutDataForIrt` (hanya bagian yang dipakai). */
export type TryoutForIrt = {
  id: string;
  title: string;
  TryoutSession: {
    id: string;
    TryoutCategory: { name: string };
    TryoutSubCategory: { name: string };
    TryoutSessionParticipant: {
      TryoutUserAnswer: {
        TryoutQuestion: {
          a_discrimination: number | null;
          b_difficulty: number | null;
          c_guessing: number | null;
        };
      }[];
    }[];
  }[];
};

export type QuizVolume = {
  id: string;
  number: number;
  title: string | null;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt: string;
  TryoutCategory?: {
    id: string;
    name: string;
    TryoutSubCategory: {
      id: string;
      name: string;
      Tryout: {
        id: string;
        title: string;
        status: AssessmentStatus;
        TryoutSession: { duration: number; name: string } | null;
      }[];
    }[];
  }[];
};

export type VolumeQuiz = {
  id: string;
  title: string;
  quizOrder?: number | null;
  resultDate?: string | null;
  TryoutCategory: { id: string; name: string };
  TryoutSubCategory: { id: string; name: string };
  TryoutSession: { duration: number } | null;
};

export type QuizVolumeDetail = {
  id: string;
  title: string | null;
  number: number;
  status: AssessmentStatus;
  startDate: string;
  endDate: string;
  resultDate?: string | null;
  image: string | null;
  Tryout: VolumeQuiz[];
};
