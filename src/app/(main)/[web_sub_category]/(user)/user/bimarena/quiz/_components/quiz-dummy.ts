/**
 * Quiz Dummy Data - Central source of truth for all mock data
 *
 * Scoring System (KONSISTEN 0-100):
 * - Individual quiz scores: 0-100 (percentage of correct answers)
 * - Total score: Sum of all quiz scores (e.g., 35 quizzes x avg 80 = 2800)
 * - Accuracy: 0-100% (correct / (correct + wrong))
 * - All averages use 0-100 scale
 * - UTBK prediction: 200-800 (calculated from avg score)
 */

// ============ COMPETITION CONSTANTS ============

/** Total participants in current volume */
export const TOTAL_PARTICIPANTS = 2458;

/** Live online participants (base number, will fluctuate in UI) */
export const BASE_ONLINE_PARTICIPANTS = 847;

/** Total prize pool in Rupiah */
export const TOTAL_PRIZE_POOL = 50_000_000;

/** Gap score to next rank (mock) */
export const GAP_TO_NEXT_RANK = 127;

// ============ AVERAGE SCORES (0-100 scale) ============

/**
 * All students average score per quiz (Quiz 1-5)
 * Scale: 0-100
 */
export const ALL_STUDENTS_AVG_PER_QUIZ: number[] = [72, 74, 76, 75, 78];

/**
 * All students average score per subject
 * Scale: 0-100
 */
export const ALL_STUDENTS_AVG_BY_SUBJECT: Record<string, number> = {
  PU: 72,
  PPU: 68,
  PBM: 70,
  PK: 65,
  LBI: 71,
  LBE: 63,
  PM: 67,
};

/**
 * Top 10 average score per subject
 * Scale: 0-100
 */
export const TOP_10_AVG_BY_SUBJECT: Record<string, number> = {
  PU: 89,
  PPU: 87,
  PBM: 88,
  PK: 85,
  LBI: 88,
  LBE: 84,
  PM: 90,
};

/**
 * Top 10 overall average per quiz
 * Scale: 0-100
 */
export const TOP_10_AVG_PER_QUIZ: number[] = [88, 89, 90, 89, 91];

/**
 * Top 10 overall average score
 * Scale: 0-100
 */
export const TOP_10_AVG_SCORE = 88;

/**
 * Top 10 average accuracy
 * Scale: 0-100%
 */
export const TOP_10_AVG_ACCURACY = 92;

// ============ SAMPLE USER SCORES ============

/**
 * Sample user quiz scores per subject (pre-generated for consistency)
 * Each value is 0-100
 */
export const SAMPLE_USER_SCORES: Record<string, number[]> = {
  PU: [78, 82, 85, 88, 91],
  PPU: [72, 75, 80, 83, 91],
  PBM: [70, 73, 78, 80, 80],
  PK: [62, 65, 68, 70, 66],
  LBI: [75, 77, 80, 82, 78],
  LBE: [88, 90, 92, 94, 94],
  PM: [82, 85, 88, 92, 96],
};

// ============ LEADERBOARD DATA ============

/**
 * Top 5 players for mini leaderboard in hero
 * Score is total (sum of all quiz scores)
 */
export const TOP_5_PLAYERS = [
  {
    rank: 1,
    name: 'Budi Santoso',
    score: 3150,
    iconType: 'Crown' as const,
    color: 'text-amber-500',
  },
  {
    rank: 2,
    name: 'Siti Nurhaliza',
    score: 3050,
    iconType: 'Medal' as const,
    color: 'text-slate-400',
  },
  {
    rank: 3,
    name: 'Ahmad Rizky',
    score: 2980,
    iconType: 'Award' as const,
    color: 'text-orange-500',
  },
  {
    rank: 4,
    name: 'Dewi Lestari',
    score: 2920,
    iconType: 'Star' as const,
    color: 'text-slate-400',
  },
  {
    rank: 5,
    name: 'Reza Pratama',
    score: 2870,
    iconType: 'Star' as const,
    color: 'text-slate-400',
  },
];

// ============ PERFORMANCE LEVELS ============

/**
 * Performance level thresholds (percentage score 0-100)
 */
export const PERFORMANCE_LEVELS = {
  excellent: { min: 90, label: 'Sangat Baik', color: '#22c55e' },
  good: { min: 75, label: 'Baik', color: '#3b82f6' },
  average: { min: 60, label: 'Cukup', color: '#eab308' },
  needsWork: { min: 0, label: 'Perlu Ditingkatkan', color: '#ef4444' },
} as const;

/**
 * Get performance level based on score (0-100)
 */
export const getPerformanceLevel = (score: number) => {
  if (score >= PERFORMANCE_LEVELS.excellent.min)
    return PERFORMANCE_LEVELS.excellent;
  if (score >= PERFORMANCE_LEVELS.good.min) return PERFORMANCE_LEVELS.good;
  if (score >= PERFORMANCE_LEVELS.average.min)
    return PERFORMANCE_LEVELS.average;
  return PERFORMANCE_LEVELS.needsWork;
};

// ============ PREDICTION DATA ============

/**
 * University passing thresholds
 * - minAvgScore: minimum average quiz score (0-100) needed for good chance
 * - passingUtbkScore: estimated UTBK score threshold (200-800)
 */
export const UNIVERSITY_THRESHOLDS: Record<
  string,
  { minAvgScore: number; passingUtbkScore: number; competitionRatio: number }
> = {
  'Universitas Indonesia - Kedokteran': {
    minAvgScore: 88,
    passingUtbkScore: 720,
    competitionRatio: 45,
  },
  'Institut Teknologi Bandung - Teknik Informatika': {
    minAvgScore: 82,
    passingUtbkScore: 680,
    competitionRatio: 28,
  },
  'Universitas Gadjah Mada - Ilmu Hukum': {
    minAvgScore: 75,
    passingUtbkScore: 640,
    competitionRatio: 22,
  },
  'Universitas Padjadjaran - Psikologi': {
    minAvgScore: 72,
    passingUtbkScore: 620,
    competitionRatio: 18,
  },
  'Universitas Brawijaya - Akuntansi': {
    minAvgScore: 68,
    passingUtbkScore: 580,
    competitionRatio: 15,
  },
};

/**
 * Calculate passing probability based on user's average score
 * @param userAvgScore User's average quiz score (0-100)
 * @param minAvgScore Minimum avg score for the university (0-100)
 * @param competitionRatio Competition ratio (1:N)
 * @returns Probability 5-95%
 */
export const calculatePassingProbability = (
  userAvgScore: number,
  minAvgScore: number,
  competitionRatio: number,
): number => {
  const scoreDiff = userAvgScore - minAvgScore;
  let probability = 50 + scoreDiff * 2;
  probability -= competitionRatio * 0.5;
  return Math.min(95, Math.max(5, Math.round(probability)));
};

/**
 * Convert quiz average score (0-100) to UTBK score (200-800)
 * Formula: 200 + (avgScore / 100) * 600
 */
export const convertToUtbkScore = (avgScore: number): number => {
  return Math.round(200 + (avgScore / 100) * 600);
};

// ============ HELPER FUNCTIONS ============

/**
 * Calculate user average per quiz (across all subjects)
 */
export const getUserAvgPerQuiz = (
  scores: Record<string, number[]>,
): number[] => {
  const quizCount = 5;
  const result: number[] = [];

  for (let i = 0; i < quizCount; i++) {
    let total = 0;
    let count = 0;
    Object.values(scores).forEach((subjectScores) => {
      if (subjectScores[i] !== undefined) {
        total += subjectScores[i];
        count++;
      }
    });
    result.push(count > 0 ? Math.round(total / count) : 0);
  }

  return result;
};

/**
 * Calculate user average per subject
 */
export const getUserAvgPerSubject = (
  scores: Record<string, number[]>,
): Record<string, number> => {
  const result: Record<string, number> = {};

  Object.entries(scores).forEach(([code, subjectScores]) => {
    const avg = subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length;
    result[code] = Math.round(avg);
  });

  return result;
};

/**
 * Calculate overall average from all quiz scores
 */
export const getOverallAverage = (scores: Record<string, number[]>): number => {
  let total = 0;
  let count = 0;

  Object.values(scores).forEach((subjectScores) => {
    subjectScores.forEach((score) => {
      total += score;
      count++;
    });
  });

  return count > 0 ? Math.round(total / count) : 0;
};

/**
 * Calculate total score (sum of all quiz scores)
 */
export const getTotalScore = (scores: Record<string, number[]>): number => {
  let total = 0;

  Object.values(scores).forEach((subjectScores) => {
    subjectScores.forEach((score) => {
      total += score;
    });
  });

  return total;
};

// Pre-calculated values for sample user
export const SAMPLE_USER_AVG_PER_QUIZ = getUserAvgPerQuiz(SAMPLE_USER_SCORES);
// Result: [75, 78, 82, 84, 85]

export const SAMPLE_USER_AVG_PER_SUBJECT =
  getUserAvgPerSubject(SAMPLE_USER_SCORES);
// Result: { PU: 85, PPU: 80, PBM: 76, PK: 66, LBI: 78, LBE: 92, PM: 89 }

export const SAMPLE_USER_OVERALL_AVG = getOverallAverage(SAMPLE_USER_SCORES);
// Result: ~80

export const SAMPLE_USER_TOTAL_SCORE = getTotalScore(SAMPLE_USER_SCORES);
// Result: ~2788 (35 quizzes)

export const SAMPLE_USER_UTBK_SCORE = convertToUtbkScore(
  SAMPLE_USER_OVERALL_AVG,
);
// Result: ~680

// ============ QUIZ CARD DATA ============

/**
 * Number of questions per quiz
 */
export const QUESTIONS_PER_QUIZ = 20;

/**
 * Time limit per quiz (minutes)
 */
export const TIME_PER_QUIZ = 20;

/**
 * Points awarded per quiz (based on questions)
 */
export const POINTS_PER_QUIZ = QUESTIONS_PER_QUIZ * 5; // 100 points

// ============ COUNTDOWN DATA ============

/**
 * Default countdown values (will be dynamic in real app)
 */
export const DEFAULT_COUNTDOWN = {
  days: 12,
  hours: 5,
  minutes: 32,
  seconds: 45,
};

// ============ UI FORMATTING ============

/**
 * Format number with locale
 */
export const formatNumber = (num: number): string =>
  num.toLocaleString('id-ID');

/**
 * Format currency (Rupiah)
 */
export const formatCurrency = (num: number): string =>
  `Rp ${num.toLocaleString('id-ID')}`;

/**
 * Format percentage
 */
export const formatPercent = (num: number): string => `${num.toFixed(0)}%`;

// ============ TREND & COMPARISON DATA ============

/**
 * Score change from last week (mock data)
 */
export const SCORE_CHANGE_LAST_WEEK = 12;

/**
 * Interval for countdown timer (ms)
 */
export const COUNTDOWN_INTERVAL_MS = 1000;

/**
 * Interval for live online fluctuation (ms)
 */
export const LIVE_ONLINE_INTERVAL_MS = 3000;

/**
 * Range for live online fluctuation
 */
export const LIVE_ONLINE_FLUCTUATION = 7;

// ============ CALCULATION HELPERS ============

/**
 * Calculate completion percentage
 * @param completed Number of completed items
 * @param total Total items
 * @returns Percentage 0-100
 */
export const calculateCompletionPercentage = (
  completed: number,
  total: number,
): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Calculate national percentile based on accuracy
 * @param accuracy User's accuracy (0-100)
 * @returns Top X% string
 */
export const calculateNationalPercentile = (accuracy: number): number => {
  return Math.round(100 - accuracy);
};

/**
 * Calculate beaten count (participants beaten by user)
 * @param userRank User's current rank
 * @param totalParticipants Total participants
 * @returns Number of beaten participants
 */
export const calculateBeatenCount = (
  userRank: number,
  totalParticipants: number = TOTAL_PARTICIPANTS,
): number => {
  return totalParticipants - userRank;
};

/**
 * Calculate beaten percentage
 * @param beatenCount Number of beaten participants
 * @param totalParticipants Total participants
 * @returns Percentage string with 1 decimal
 */
export const calculateBeatenPercentage = (
  beatenCount: number,
  totalParticipants: number = TOTAL_PARTICIPANTS,
): string => {
  return ((beatenCount / totalParticipants) * 100).toFixed(1);
};

/**
 * Build Top 10 comparison data
 * @param subjectPerformance Array of subject performance data
 * @param userAvgScore User's average score
 * @param subCategories Array of subject categories
 */
export const buildTop10Comparison = (
  subjectPerformance: { subject: string; score: number }[],
  userAvgScore: number,
  subCategories: { code: string; color: string }[],
) => {
  const perSubject = subCategories.map((sub) => {
    const userScore =
      subjectPerformance.find((sp) => sp.subject === sub.code)?.score || 0;
    return {
      code: sub.code,
      userScore,
      top10Score: TOP_10_AVG_BY_SUBJECT[sub.code] || 87,
      color: sub.color,
    };
  });

  const userBestSubject = subjectPerformance.reduce(
    (best, curr) => (curr.score > best.score ? curr : best),
    subjectPerformance[0],
  );

  // Find top 10 best subject
  const top10BestSubject = Object.entries(TOP_10_AVG_BY_SUBJECT).reduce(
    (best, [subject, score]) =>
      score > best.score ? { subject, score } : best,
    { subject: 'PM', score: 0 },
  );

  return {
    avgScore: TOP_10_AVG_SCORE,
    accuracy: TOP_10_AVG_ACCURACY,
    totalGap: userAvgScore - TOP_10_AVG_SCORE,
    perSubject,
    userBestScore: userBestSubject?.score || 0,
    top10Best: top10BestSubject,
  };
};

/**
 * Build enhanced radar data for chart
 * @param subjectPerformance Array of subject performance data
 */
export const buildEnhancedRadarData = (
  subjectPerformance: { subject: string; score: number }[],
) => {
  return subjectPerformance.map((sp) => ({
    subject: sp.subject,
    userScore: sp.score,
    avgScore: ALL_STUDENTS_AVG_BY_SUBJECT[sp.subject] || 70,
    fullMark: 100,
  }));
};

/**
 * Calculate line chart data for quiz progress
 * @param quizzes Quiz categories with quiz data
 * @param quizCount Number of quizzes
 */
export const buildLineChartData = (
  quizzes: {
    code: string;
    quizzes: { isDone: boolean; score?: number | null }[];
  }[],
  quizCount: number = 5,
) => {
  const data = [];

  for (let i = 0; i < quizCount; i++) {
    const quizData: Record<string, number | string> = {
      quiz: `Quiz ${i + 1}`,
    };

    let quizTotalScore = 0;
    let quizScoreCount = 0;

    quizzes.forEach((cat) => {
      const quiz = cat.quizzes[i];
      if (quiz?.isDone && quiz.score != null) {
        quizData[cat.code] = quiz.score;
        quizTotalScore += quiz.score;
        quizScoreCount++;
      }
    });

    quizData['userAvg'] =
      quizScoreCount > 0 ? Math.round(quizTotalScore / quizScoreCount) : 0;

    quizData['allStudentsAvg'] = ALL_STUDENTS_AVG_PER_QUIZ[i];

    data.push(quizData);
  }

  return data;
};

/**
 * Generate deterministic "random" value based on string id
 * Used for consistent values that don't change on re-render
 * @param id String identifier
 * @param min Minimum value
 * @param max Maximum value
 */
export const getDeterministicValue = (
  id: string,
  min: number,
  max: number,
): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return min + Math.abs(hash % (max - min + 1));
};

/**
 * Check if quiz should show "HOT" badge (deterministic)
 * @param quizId Quiz identifier
 * @returns Boolean indicating if quiz is hot (~30% chance)
 */
export const isQuizHot = (quizId: string): boolean => {
  let hash = 0;
  for (let i = 0; i < quizId.length; i++) {
    hash = (hash << 5) - hash + quizId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 10) > 6;
};

/**
 * Calculate live online fluctuation
 * @param currentOnline Current online count
 * @returns New online count with small fluctuation
 */
export const calculateLiveOnlineFluctuation = (
  currentOnline: number,
): number => {
  const fluctuation =
    Math.floor(Math.random() * LIVE_ONLINE_FLUCTUATION) -
    Math.floor(LIVE_ONLINE_FLUCTUATION / 2);
  return currentOnline + fluctuation;
};
