import { TryoutStatusEnum, UserRoleEnum } from '@/types/database';

export const defaultChartConfig = {
  documentsRead: { label: 'Dokumen Dibaca', color: 'var(--chart-1)' },
  notesCreated: { label: 'Catatan Dibuat', color: 'var(--chart-2)' },
  highlightsMade: { label: 'Highlight Dibuat', color: 'var(--chart-3)' },
  quizStudied: { label: 'Quiz Dibuat', color: 'var(--chart-4)' },
  NilaiTotal: { label: 'Nilai Total', color: 'var(--chart-5)' },
  peringkat: { label: 'Peringkat', color: 'var(--chart-2)' },
};

export type LearningDataType = {
  documentsRead: number;
  notesCreated: number;
  highlightsMade: number;
  quizStudied: number;
  studyTimeByCategory: {
    name: string;
    value: number;
  }[];
  documentsReadIncrease: number;
  notesCreatedIncrease: number;
  highlightsMadeIncrease: number;
  quizStudiedIncrease: number;
  learningStreak: number;
  longestStreak: number;
  topCategories: {
    name: string;
    count: number;
  }[];
  recentDocuments: {
    title: string;
    lastAccessed: string;
  }[];
  mostActiveHours: {
    hour: number;
    activity: number;
  }[];
  quizAccuracy: number;
  totalStudyTime: number;
  averageSessionDuration: number;
  dailyStreak: {
    date: string;
    completed: boolean;
  }[];
  weeklyProgress: {
    documentsRead: number;
    notesCreated: number;
    highlightsMade: number;
    quizStudied: number;
    date: string;
  }[];
};

export type ReportDataType = {
  userHeader: {
    name: string;
    status: UserRoleEnum;
    daysLeft: number;
    avatarUrl: string | null;
  };
  studyHabits: {
    totalHoursStudied: number;
    hoursThisWeek: number;
    longestStreak: number;
    averageDailyStudyTime: number;
    mostProductiveDay: string;
    mostEffectiveTime: string;
  };
  learningReport: {
    totalScore: any;
    scoreIncrease: number;
    scoreIncreasePercentage: number;
    rank: number;
    rankIncrease: number;
    documentsRead: number;
    notesCreated: number;
    highlightsMade: number;
    quizStudied: number;
  };
  tryoutCategory: {
    id: string;
    name: string;
    TryoutSessionResult: {
      id: string;
      totalScore: number;
      categoryId: string;
      tryoutResultId: string;
      sessionId: string;
      startSession: Date;
      endSession: Date;
      theta: number | null;
    }[];
  }[];
  scoreDevelopmentData: {
    total: number;
    date: string;
  }[];
  dataScoreDistribution: {
    scoreRange: string;
    totalParticipants: number;
    highestScore: number;
    lowestScore: number;
    averageScore: number;
    percentage: number;
  }[];
  analysisByCategoryTryout: {
    data: {
      subCategory: string;
      accuracy: number;
    }[];
    category: string;
  }[];
  tryoutHistory: {
    history: {
      rank: number;
      duration: string;
      show: boolean;
      change: number;
      Tryout: {
        id: string;
        image: string | null;
        createAt: Date;
        updateAt: Date;
        title: string;
        restTime: number;
        status: TryoutStatusEnum;
        startDate: Date;
        endDate: Date;
        resultDate: Date;
      };
      TryoutSessionResult: ({
        TryoutSession: {
          thresholdValue: number | null;
        };
        TryoutCategory: {
          id: string;
          name: string;
        };
      } & {
        id: string;
        totalScore: number;
        categoryId: string;
        tryoutResultId: string;
        sessionId: string;
        startSession: Date;
        endSession: Date;
        theta: number | null;
      })[];
      userId: string;
      id: string;
      tryoutId: string;
      totalScore: number;
      startTryout: Date;
      endTryout: Date;
    }[];
    chart: {
      tanggal: Date;
      skorTotal: number;
      peringkat: number;
      perubahan: number;
    }[];
  };
  quizHistory: {
    history: {
      userId: string;
      id: string;
      createAt: Date;
      accuracy: number;
    }[];
    chart: {
      tanggal: Date;
      accuracy: number;
      perubahan: number;
    }[];
  };
};

export interface CalendarView {
  value: string;
  label: string;
}
