// ============ TYPES ============
import { SNBT_SUBTEST_INITIALS } from '@/lib/utils/subtest';

export interface Volume {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'upcoming' | 'locked' | 'completed';
  startDate: string;
  endDate: string;
  totalParticipants: number;
}

export interface SubCategory {
  id: string;
  name: string;
  code: string;
  gradient: string;
  bg: string;
  iconBg: string;
  color: string;
}

export interface Quiz {
  id: string;
  name: string;
  questions: number;
  time: number;
  isDone: boolean;
  score: number | null;
  rank: number | null;
  correct: number | null;
  wrong: number | null;
  skipped: number | null;
  completedAt: string | null;
}

export interface QuizCategory extends SubCategory {
  quizzes: Quiz[];
}

export interface UserStats {
  currentRank: number;
  previousRank: number;
  totalScore: number; // Accumulated total from all quizzes (sum of 0-100 scores)
  streak: number;
  currentStreak: number;
  avgScore: number; // Average score per quiz (0-100)
  averageScore: number;
  quizzesDone: number;
  bestSubject: string;
  worstSubject: string;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  accuracy: number; // Percentage (0-100)
  avgTimePerQuiz: number;
  estimatedUtbkScore: number; // Predicted UTBK score based on average performance
}

export interface TargetUniversity {
  id: string;
  name: string;
  program: string;
  major: string;
  passingScore: number;
  competitionRatio: number;
  probability: number;
  passingProbability: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  description: string;
  icon: string;
  unlocked: boolean;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress?: number;
}

export interface Reward {
  rank: number;
  title: string;
  name: string;
  prize: string;
  description: string;
  color: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  pointsRequired: number;
  isUnlocked: boolean;
}

export interface PerformanceDataPoint {
  date: string;
  score: number;
  avgScore: number;
}

export interface SubjectPerformance {
  subject: string;
  score: number;
  fullMark: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  username: string;
  school: string;
  province: string;
  targetUniversity?: string;
  targetMajor?: string;
  quizDone: number;
  totalQuiz: number;
  totalScore: number;
  accuracy: number;
  avgTime: number;
  correct: number;
  wrong: number;
  empty: number;
  isCurrentUser: boolean;
}

// ============ MOCK DATA ============
export const VOLUMES: Volume[] = [
  {
    id: 'vol-1',
    name: 'Volume 1',
    description: 'Paket 1-5',
    status: 'active',
    startDate: '1 Jan 2026',
    endDate: '31 Jan 2026',
    totalParticipants: 2458,
  },
  {
    id: 'vol-2',
    name: 'Volume 2',
    description: 'Paket 6-10',
    status: 'upcoming',
    startDate: '1 Feb 2026',
    endDate: '28 Feb 2026',
    totalParticipants: 0,
  },
  {
    id: 'vol-3',
    name: 'Volume 3',
    description: 'Paket 11-15',
    status: 'locked',
    startDate: '1 Mar 2026',
    endDate: '31 Mar 2026',
    totalParticipants: 0,
  },
];

export const SUB_CATEGORIES: SubCategory[] = [
  {
    id: 'pu',
    name: 'Penalaran Umum',
    code: SNBT_SUBTEST_INITIALS['Penalaran Umum'],
    gradient: 'from-blue-500 to-blue-600',
    bg: 'from-blue-50 to-blue-100',
    iconBg: 'bg-blue-500',
    color: '#3b82f6',
  },
  {
    id: 'ppu',
    name: 'Pengetahuan & Pemahaman Umum',
    code: SNBT_SUBTEST_INITIALS['Pengetahuan dan Pemahaman Umum'],
    gradient: 'from-green-500 to-green-600',
    bg: 'from-green-50 to-green-100',
    iconBg: 'bg-green-500',
    color: '#22c55e',
  },
  {
    id: 'pbm',
    name: 'Pemahaman Bacaan & Menulis',
    code: SNBT_SUBTEST_INITIALS['Pemahaman Bacaan dan Menulis'],
    gradient: 'from-yellow-500 to-yellow-600',
    bg: 'from-yellow-50 to-yellow-100',
    iconBg: 'bg-yellow-500',
    color: '#eab308',
  },
  {
    id: 'pk',
    name: 'Pengetahuan Kuantitatif',
    code: SNBT_SUBTEST_INITIALS['Pengetahuan Kuantitatif'],
    gradient: 'from-red-500 to-red-600',
    bg: 'from-red-50 to-red-100',
    iconBg: 'bg-red-500',
    color: '#ef4444',
  },
  {
    id: 'lbi',
    name: 'Literasi Bahasa Indonesia',
    code: SNBT_SUBTEST_INITIALS['Literasi Bahasa Indonesia'],
    gradient: 'from-indigo-500 to-indigo-600',
    bg: 'from-indigo-50 to-indigo-100',
    iconBg: 'bg-indigo-500',
    color: '#6366f1',
  },
  {
    id: 'lbe',
    name: 'Literasi Bahasa Inggris',
    code: SNBT_SUBTEST_INITIALS['Literasi Bahasa Inggris'],
    gradient: 'from-purple-500 to-purple-600',
    bg: 'from-purple-50 to-purple-100',
    iconBg: 'bg-purple-500',
    color: '#a855f7',
  },
  {
    id: 'pm',
    name: 'Penalaran Matematika',
    code: SNBT_SUBTEST_INITIALS['Penalaran Matematika'],
    gradient: 'from-orange-500 to-orange-600',
    bg: 'from-orange-50 to-orange-100',
    iconBg: 'bg-orange-500',
    color: '#f97316',
  },
];

export const REWARDS: Reward[] = [
  {
    rank: 1,
    title: 'Juara 1',
    name: 'Badge Emas',
    prize: 'Rp 500.000 + Badge Emas',
    description: 'Badge eksklusif pemenang kompetisi',
    color: 'from-yellow-400 to-amber-500',
    tier: 'gold',
    pointsRequired: 5000,
    isUnlocked: true,
  },
  {
    rank: 2,
    title: 'Juara 2',
    name: 'Badge Perak',
    prize: 'Rp 300.000 + Badge Perak',
    description: 'Badge runner up kompetisi',
    color: 'from-slate-300 to-slate-400',
    tier: 'silver',
    pointsRequired: 10000,
    isUnlocked: false,
  },
  {
    rank: 3,
    title: 'Juara 3',
    name: 'Badge Perunggu',
    prize: 'Rp 150.000 + Badge Perunggu',
    description: 'Badge peringkat tiga',
    color: 'from-orange-400 to-orange-500',
    tier: 'bronze',
    pointsRequired: 15000,
    isUnlocked: false,
  },
  {
    rank: 10,
    title: 'Top 10',
    name: 'Badge Eksklusif',
    prize: 'Badge Eksklusif + Diskon 50%',
    description: 'Badge untuk Top 10 peserta',
    color: 'from-indigo-400 to-indigo-500',
    tier: 'platinum',
    pointsRequired: 25000,
    isUnlocked: false,
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-blood',
    name: 'First Blood',
    desc: 'Selesaikan quiz pertama',
    description: 'Selesaikan quiz pertama',
    icon: 'Target',
    unlocked: true,
    isUnlocked: true,
    progress: 100,
  },
  {
    id: 'streak-7',
    name: 'Weekly Warrior',
    desc: '7 hari berturut-turut quiz',
    description: '7 hari berturut-turut quiz',
    icon: 'Flame',
    unlocked: true,
    isUnlocked: true,
    progress: 100,
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    desc: 'Raih nilai 100 di quiz',
    description: 'Raih nilai 100 di quiz',
    icon: 'Star',
    unlocked: false,
    isUnlocked: false,
    progress: 70,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    desc: 'Selesaikan quiz < 5 menit',
    description: 'Selesaikan quiz < 5 menit',
    icon: 'Zap',
    unlocked: true,
    isUnlocked: true,
    progress: 100,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    desc: 'Selesaikan 1 volume penuh',
    description: 'Selesaikan 1 volume penuh',
    icon: 'Trophy',
    unlocked: false,
    isUnlocked: false,
    progress: 40,
  },
  {
    id: 'top-10',
    name: 'Elite Squad',
    desc: 'Masuk Top 10 leaderboard',
    description: 'Masuk Top 10 leaderboard',
    icon: 'Crown',
    unlocked: false,
    isUnlocked: false,
    progress: 85,
  },
];

export const TARGET_UNIVERSITIES: TargetUniversity[] = [
  {
    id: 'ui-kedokteran',
    name: 'Universitas Indonesia',
    program: 'Kedokteran',
    major: 'Kedokteran',
    passingScore: 720,
    competitionRatio: 45,
    probability: 35,
    passingProbability: 35,
    trend: 'up',
  },
  {
    id: 'itb-informatika',
    name: 'Institut Teknologi Bandung',
    program: 'Teknik Informatika',
    major: 'Teknik Informatika',
    passingScore: 680,
    competitionRatio: 28,
    probability: 58,
    passingProbability: 58,
    trend: 'up',
  },
  {
    id: 'ugm-hukum',
    name: 'Universitas Gadjah Mada',
    program: 'Ilmu Hukum',
    major: 'Ilmu Hukum',
    passingScore: 640,
    competitionRatio: 22,
    probability: 72,
    passingProbability: 72,
    trend: 'stable',
  },
];

// Generate mock quizzes
export const generateQuizzes = (): QuizCategory[] =>
  SUB_CATEGORIES.map((sub) => ({
    ...sub,
    quizzes: Array.from({ length: 5 }).map((_, i) => {
      const isDone = true; // All quizzes are done
      const correct = Math.floor(Math.random() * 8) + 12;
      const wrong = 20 - correct - Math.floor(Math.random() * 3);
      const skipped = 20 - correct - wrong;
      return {
        id: `${sub.id}-q${i + 1}`,
        name: `Quiz ${i + 1}`,
        questions: 20,
        time: 20,
        isDone,
        score: Math.floor(Math.random() * 40) + 60, // Score between 60-100 (percentage)
        rank: Math.floor(Math.random() * 400) + 50,
        correct,
        wrong,
        skipped,
        completedAt: `${10 + i} Jan 2026`,
      };
    }),
  }));

// Generate performance history
export const generatePerformanceHistory = (): PerformanceDataPoint[] => {
  const data: PerformanceDataPoint[] = [];
  const baseDate = new Date('2026-01-05');

  for (let i = 0; i < 14; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      }),
      score: Math.floor(Math.random() * 30) + 65, // Score between 65-95 (percentage)
      avgScore: 75, // Average score 75%
    });
  }
  return data;
};

// Generate radar chart data
export const generateSubjectPerformance = (): SubjectPerformance[] =>
  SUB_CATEGORIES.map((sub) => ({
    subject: sub.code,
    score: Math.floor(Math.random() * 35) + 55, // Score between 55-90 (percentage)
    fullMark: 100, // Full mark is 100%
  }));

// Generate leaderboard
export const generateLeaderboard = (
  currentUserRank: number,
): LeaderboardEntry[] => {
  const entries: LeaderboardEntry[] = [];
  const universities = ['UI', 'ITB', 'UGM', 'Unpad', 'Undip'];
  const majors = [
    'Kedokteran',
    'Teknik Informatika',
    'Hukum',
    'Psikologi',
    'Akuntansi',
  ];
  const provinces = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'DI Yogyakarta',
    'Banten',
    'Sumatera Utara',
    'Sulawesi Selatan',
  ];
  const schools = [
    'SMAN 3 Bandung',
    'SMAN 8 Jakarta',
    'SMAN 1 Yogyakarta',
    'SMAN 5 Surabaya',
    'SMA Taruna Nusantara',
    'SMAN 1 Semarang',
    'SMA Labschool Jakarta',
    'SMAN 2 Denpasar',
    'SMAN 1 Malang',
    'SMA Kolese Gonzaga',
    'SMAN 4 Jakarta',
    'SMAN 1 Bekasi',
    'SMAN 1 Depok',
    'SMAN 2 Bandung',
    'SMA BPK Penabur',
    'SMAN 6 Jakarta',
    'SMAN 1 Bogor',
    'SMAN 3 Semarang',
    'SMAN 1 Medan',
    'SMAN 2 Makassar',
  ];
  const names = [
    'Rizky Pratama',
    'Aulia Rahmawati',
    'Muhammad Farhan',
    'Siti Nurhaliza',
    'Dimas Prasetyo',
    'Anisa Putri',
    'Budi Santoso',
    'Dewi Kartika',
    'Eko Wijaya',
    'Fitri Handayani',
    'Galih Ramadan',
    'Hana Safira',
    'Irfan Hakim',
    'Julia Kristina',
    'Kevin Anggara',
    'Lina Marlina',
    'Mochammad Rizal',
    'Nadya Permata',
    'Oscar Pratama',
    'Putri Ayu',
  ];

  // Top 3
  for (let i = 1; i <= 3; i++) {
    entries.push({
      rank: i,
      name: names[i - 1],
      username: `@${names[i - 1].toLowerCase().replace(' ', '')}`,
      school: schools[i - 1],
      province: provinces[i % provinces.length],
      targetUniversity: universities[(i - 1) % universities.length],
      targetMajor: majors[(i - 1) % majors.length],
      quizDone: 35,
      totalQuiz: 35,
      totalScore: 3150 - i * 50, // 35 quizzes x ~90 avg = ~3150
      accuracy: 95 - i,
      avgTime: 12 + i,
      correct: 665 - i * 5, // out of 700 total questions (35 quiz x 20 questions)
      wrong: 20 + i * 3,
      empty: 15 + i * 2,
      isCurrentUser: false,
    });
  }

  // Ranks 4-20
  for (let i = 4; i <= 20; i++) {
    const isUser = i === currentUserRank;
    const quizDone = 35 - Math.floor(Math.random() * 5);
    const avgQuizScore = 85 - i * 1.5 + Math.floor(Math.random() * 10); // avg score per quiz
    entries.push({
      rank: i,
      name: isUser ? 'Kamu' : names[(i - 1) % names.length],
      username: isUser
        ? '@kamu'
        : `@${names[(i - 1) % names.length].toLowerCase().replace(' ', '')}`,
      school: isUser ? 'SMAN 8 Jakarta' : schools[(i - 1) % schools.length],
      province: isUser ? 'DKI Jakarta' : provinces[i % provinces.length],
      targetUniversity: isUser ? 'ITB' : universities[i % universities.length],
      targetMajor: isUser ? 'Teknik Informatika' : majors[i % majors.length],
      quizDone,
      totalQuiz: 35,
      totalScore: Math.round(quizDone * avgQuizScore), // total = quizDone x avgScore
      accuracy: 90 - Math.floor(Math.random() * 15),
      avgTime: 13 + Math.floor(Math.random() * 5),
      correct:
        Math.round(quizDone * 20 * 0.8) -
        i * 5 +
        Math.floor(Math.random() * 20),
      wrong:
        Math.round(quizDone * 20 * 0.15) +
        i * 2 +
        Math.floor(Math.random() * 10),
      empty: Math.round(quizDone * 20 * 0.05) + Math.floor(Math.random() * 5),
      isCurrentUser: isUser,
    });
  }

  return entries;
};

// Calculate mock user stats
export const calculateUserStats = (quizzes: QuizCategory[]): UserStats => {
  let totalScore = 0;
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalSkipped = 0;
  let quizzesDone = 0;
  const subjectScores: Record<string, number[]> = {};

  quizzes.forEach((cat) => {
    subjectScores[cat.code] = [];
    cat.quizzes.forEach((q) => {
      if (q.isDone && q.score) {
        totalScore += q.score;
        totalCorrect += q.correct || 0;
        totalWrong += q.wrong || 0;
        totalSkipped += q.skipped || 0;
        quizzesDone++;
        subjectScores[cat.code].push(q.score);
      }
    });
  });

  const avgScores = Object.entries(subjectScores)
    .map(([code, scores]) => ({
      code,
      avg:
        scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0,
    }))
    .filter((s) => s.avg > 0);

  const bestSubject = avgScores.sort((a, b) => b.avg - a.avg)[0]?.code || 'PU';
  const worstSubject =
    avgScores.sort((a, b) => a.avg - b.avg)[0]?.code || 'PPU';

  const totalAnswered = totalCorrect + totalWrong;
  const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

  const avgScore = quizzesDone > 0 ? Math.round(totalScore / quizzesDone) : 0;

  // Estimate UTBK score: map avgScore (0-100) to UTBK range (200-800)
  // Formula: 200 + (avgScore / 100) * 600
  const estimatedUtbkScore = Math.round(200 + (avgScore / 100) * 600);

  return {
    currentRank: 47,
    previousRank: 52,
    totalScore, // Sum of all quiz scores (each quiz 0-100)
    streak: 5,
    currentStreak: 5,
    avgScore, // Average score per quiz (0-100)
    averageScore: avgScore,
    quizzesDone,
    bestSubject,
    worstSubject,
    totalCorrect,
    totalWrong,
    totalSkipped,
    accuracy,
    avgTimePerQuiz: 14.5,
    estimatedUtbkScore, // Predicted UTBK score (200-800)
  };
};

// ML Prediction Engine (simplified mock)
export const calculatePredictions = (
  stats: UserStats,
  targets: TargetUniversity[],
): TargetUniversity[] => {
  // Simple prediction based on average score (0-100) and accuracy
  // Base probability from avgScore: map 0-100 to 5-95%
  const baseProb = Math.min(95, Math.max(5, (stats.avgScore / 100) * 90 + 5));

  return targets.map((target) => {
    const scoreDiff = stats.avgScore - target.passingScore;
    const competitionFactor = target.competitionRatio / 50;
    let probability = baseProb + scoreDiff / 10 - competitionFactor * 10;
    probability = Math.min(95, Math.max(5, probability));

    const prevProb = target.probability;
    const trend =
      probability > prevProb + 3
        ? 'up'
        : probability < prevProb - 3
          ? 'down'
          : 'stable';

    return {
      ...target,
      probability: Math.round(probability),
      passingProbability: Math.round(probability),
      trend: trend as 'up' | 'down' | 'stable',
    };
  });
};
