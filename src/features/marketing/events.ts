'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';

// Agenda publik: tryout gratis & kelas live terdekat. Dipakai beranda, /tryout,
// dan kalender bubble di /calendar (satu queryKey → satu request bila berbagi).

export type UpcomingTryout = {
  id: string;
  title: string;
  image?: string | null;
  startDate: string;
  isDone?: boolean;
  isRegistered?: boolean;
  isJoin?: boolean;
  isCouponOnly?: boolean;
  WebsiteSubCategory: { id: string; name: string };
  TryoutSession: {
    duration: number;
    TryoutCategory?: { name: string };
    _count?: { TryoutQuestion: number };
  }[];
};

export type LandingLiveClass = {
  id: string;
  title: string;
  image: string | null;
  startDate: string;
  status?: string;
  accessType: 'FREE' | 'PREMIUM' | string;
  websiteSubCategoryId: string;
  Category?: { name: string } | null;
  Instructor?: {
    name: string;
    lastEducation?: string | null;
    image?: string | null;
  } | null;
};

/** Tryout terdekat. Status daftar/ikut dihitung per pengguna bila sudah masuk. */
export function useUpcomingTryouts() {
  const { data: session, status } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['tryout', 'upcoming-public', userId ?? 'guest'],
    queryFn: () =>
      api.get<UpcomingTryout[]>('/tryout/getTryOutCardUpcoming2', {
        params: { take: 5, userId },
      }),
    enabled: status !== 'loading',
    staleTime: 60_000,
  });
}

/** Kelas live terdekat (gratis & khusus peserta program). */
export function useLandingLiveClasses() {
  return useQuery({
    queryKey: ['liveclass', 'landing'],
    queryFn: () =>
      api.get<LandingLiveClass[]>('/liveClass/getAllLiveClassForLandingPage', {
        params: { take: 6, page: 1 },
      }),
    staleTime: 60_000,
  });
}

/** "Sab, 24 Okt · 19.00 WIB" */
export const eventWhen = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })} · ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })} WIB`;
};
