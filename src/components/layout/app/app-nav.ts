import { toRoutePath } from '@/lib/surface';
import { appPath } from '@/lib/track';
import {
  BarChart3,
  BookOpen,
  Bot,
  Home,
  Medal,
  MonitorPlay,
  Swords,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

export type AppNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Penanda kecil: fitur baru / beta. */
  tag?: 'Baru' | 'Beta' | 'AI';
};

export type AppNavSection = { title: string; items: AppNavItem[] };

/** Track yang punya fitur prediksi kelulusan. */
const PREDICTION_TRACKS = new Set(['simak-ui']);

export function buildAppNav(trackId: string | null): AppNavSection[] {
  const p = (path: string) => appPath(trackId, path);
  return [
    {
      title: 'Ringkasan',
      items: [
        { label: 'BimBoard', href: p('bimboard'), icon: Home },
        {
          label: 'BimInsight',
          href: p('biminsight'),
          icon: BarChart3,
          tag: 'Beta',
        },
      ],
    },
    {
      title: 'Belajar',
      items: [
        { label: 'BimCourse', href: p('bimcourse'), icon: BookOpen },
        {
          label: 'BimLive',
          href: p('bimlive'),
          icon: MonitorPlay,
          tag: 'Baru',
        },
      ],
    },
    {
      title: 'Latihan',
      items: [
        { label: 'Try Out', href: p('bimarena/try-out'), icon: Medal },
        { label: 'Quiz', href: p('bimarena/quiz'), icon: Swords, tag: 'Beta' },
        { label: 'Peringkat', href: p('bimarena/leaderboard'), icon: Trophy },
      ],
    },
    {
      title: 'Asisten AI',
      items: [
        { label: 'BimBot', href: p('bimbot'), icon: Bot, tag: 'AI' },
        ...(trackId && PREDICTION_TRACKS.has(trackId)
          ? [
              {
                label: 'BimPrediction',
                href: p('prediction'),
                icon: TrendingUp,
              },
            ]
          : []),
      ],
    },
  ];
}

/** Item aktif bila URL sama atau berada di bawahnya. */
export const isNavActive = (pathname: string, href: string) => {
  const target = toRoutePath(href, 'app');
  return pathname === target || pathname.startsWith(`${target}/`);
};

/** Tab bar mobile: empat tujuan utama + "Menu". */
export const mobileTabs = (trackId: string | null) => [
  { label: 'Beranda', href: appPath(trackId, 'bimboard'), icon: Home },
  { label: 'Belajar', href: appPath(trackId, 'bimcourse'), icon: BookOpen },
  { label: 'Try Out', href: appPath(trackId, 'bimarena/try-out'), icon: Medal },
  { label: 'BimBot', href: appPath(trackId, 'bimbot'), icon: Bot },
];
