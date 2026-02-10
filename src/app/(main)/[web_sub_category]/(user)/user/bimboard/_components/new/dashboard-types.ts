import { env } from '@/env.mjs';

// === Dashboard Data Types ===

export interface DashboardData {
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
    tier: string;
    joinedDate: string;
    streak: number;
  };
  stats: {
    studyHours: number;
    studyHoursThisWeek: number;
    totalScore: number;
    averageScore: number;
    rank: number;
    rankFrom: number;
    previousRank: number;
    rankChange: number;
    tryoutsCompleted: number;
    coursesCompleted: number;
    coursesInProgress: number;
    documentsRead: number;
    liveClassesAttended: number;
  };
  learningProgress: {
    courses: Array<{
      id: string;
      name: string;
      category: string;
      progress: number;
      totalChapters: number;
      completedChapters: number;
      thumbnail: string | null;
      lastAccessed: string;
    }>;
    tryouts: Array<{
      id: string;
      title: string;
      score: number | null;
      totalQuestions: number;
      answeredQuestions: number;
      status: 'completed' | 'in-progress' | 'not-started';
      thumbnail: string | null;
      deadline: string | null;
    }>;
  };
  recentActivity: Array<{
    id: string;
    type: 'tryout' | 'course' | 'document' | 'liveclass';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
  }>;
  upcomingSchedule: {
    tryouts: Array<{
      id: string;
      title: string;
      startDate: string;
      endDate: string;
      thumbnail: string | null;
      isPremium: boolean;
      totalQuestions: number;
    }>;
    liveClasses: Array<{
      id: string;
      title: string;
      scheduleTime: string;
      duration: number;
      thumbnail: string | null;
      instructorName: string;
      instructorAvatar: string | null;
      isPremium: boolean;
      isRegistered: boolean;
    }>;
  };
  performanceData: {
    scoreHistory: Array<{
      date: string;
      score: number;
      tryoutTitle: string;
      rank: number;
      totalParticipants: number;
      rankChange: number;
    }>;
    studyTimeHistory: Array<{
      date: string;
      hours: number;
    }>;
  };
  recommendations: {
    courses: Array<{
      id: string;
      name: string;
      category: string;
      thumbnail: string | null;
      progress: number;
      isLocked: boolean;
      isPremium: boolean;
    }>;
    tryouts: Array<{
      id: string;
      title: string;
      thumbnail: string | null;
      difficulty: string;
      totalQuestions: number;
      isPremium: boolean;
    }>;
    documents: Array<{
      id: string;
      title: string;
      category: string;
      thumbnail: string | null;
      type: string;
    }>;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    unlockedAt: string | null;
    progress: number;
    target: number;
  }>;
  subscription: {
    isPremium: boolean;
    planName: string;
    planExpiresAt: string | null;
    daysLeft: number | null;
    features: string[];
  };
}

// === Helpers ===

export function getImageUrl(
  imageId: string | null | undefined,
  type: 'tryout' | 'liveclass' | 'course' | 'document' = 'tryout',
): string | undefined {
  if (!imageId || imageId.trim() === '') return undefined;
  if (
    imageId.startsWith('http://') ||
    imageId.startsWith('https://') ||
    imageId.startsWith('/')
  ) {
    return imageId;
  }
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_IMG_URL;
  switch (type) {
    case 'tryout':
      return `${baseUrl}/tryout/${imageId}`;
    case 'liveclass':
      return `${baseUrl}/${imageId}`;
    case 'document':
      return `${baseUrl}/document/${imageId}`;
    case 'course':
      return `${baseUrl}/${imageId}`;
    default:
      return `${baseUrl}/${imageId}`;
  }
}
