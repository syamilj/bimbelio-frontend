import { BimBrand } from '@/components/ui/bim-brand';
import {
  BarChart3,
  BookOpen,
  Bot,
  FileQuestion,
  Home,
  Medal,
  MonitorPlay,
  Swords,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────

export interface NavItem {
  title: string;
  url: (subCategoryId: string) => string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  badge?: string;
  isLocked?: boolean;
  isNew?: boolean;
  isAI?: boolean;
  showForCategory?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface BimArenaSubItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ─── Route Data ─────────────────────────────────────────────────

export const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'BimBoard',
        url: (subCategoryId) => `/${subCategoryId}/user/bimboard`,
        icon: Home,
      },
      {
        title: 'BimInsight',
        url: (subCategoryId) => `/${subCategoryId}/user/biminsight`,
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Learning',
    items: [
      {
        title: 'BimCourse',
        url: () => '#',
        icon: BookOpen,
      },
      {
        title: 'BimLive',
        url: (subCategoryId) => `/${subCategoryId}/user/bimlive`,
        icon: MonitorPlay,
        isNew: true,
      },
    ],
  },
  {
    title: 'Practice',
    items: [
      {
        title: 'BimArena',
        url: () => '#',
        icon: Target,
      },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      {
        title: 'BimBot',
        url: (subCategoryId) => `/${subCategoryId}/user/bimbot`,
        icon: Bot,
        badge: 'AI',
        isAI: true,
      },
      {
        title: 'BimPrediction',
        url: (subCategoryId) => `/${subCategoryId}/user/prediction`,
        icon: TrendingUp,
        showForCategory: 'simak-ui',
        isAI: true,
      },
    ],
  },
];

// ─── BimArena Sub-Items ─────────────────────────────────────────

export function getBimArenaSubItems(webSubCategoryId: string): BimArenaSubItem[] {
  return [
    {
      name: 'Peringkat',
      href: `/${webSubCategoryId}/user/bimarena/leaderboard`,
      icon: Trophy,
    },
    {
      name: 'Try Out',
      href: `/${webSubCategoryId}/user/bimarena/try-out`,
      icon: Medal,
    },
    {
      name: 'Quiz',
      href: `/${webSubCategoryId}/user/bimarena/quiz`,
      icon: Swords,
    },
  ];
}

// ─── Helpers ────────────────────────────────────────────────────

export function renderBimTitle(title: string) {
  const bimMatch = title.match(/^Bim([A-Z][a-zA-Z]*)$/);
  if (bimMatch) {
    return <BimBrand suffix={bimMatch[1]} />;
  }
  return title;
}
