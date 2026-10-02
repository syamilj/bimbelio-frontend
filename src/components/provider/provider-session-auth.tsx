'use client';

import { PageLoader } from '@/components/patterns/page-loader';
import { hasSession, migrateSession, signOut } from '@/lib/auth-helper';
import axiosInstanceWithToken from '@/lib/axios/axiosInstanceWithToken';
import { responseError } from '@/lib/response';
import { trackIdFromPath } from '@/lib/surface';
import {
  Subscription,
  SubscriptionFeature,
  SubscriptionInstallment,
  SubscriptionPending,
  SubscriptionPendingFeature,
  SubscriptionPendingLimitation,
  UserRoleEnum,
} from '@/types/database';
import { usePathname } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// Rute yang butuh sesi sebelum konten boleh dirender. Halaman lain (marketing)
// dirender langsung agar HTML dari server berisi konten, bukan spinner.
const isProtectedPath = (pathname: string) =>
  trackIdFromPath(pathname) !== undefined;

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

const NO_FEATURE = { document: false, course: [], quiz: [], liveClass: false };

/** Hitung tier & fitur langganan untuk track yang sedang dibuka. */
export const buildSession = (
  raw: any,
  trackId: string | null,
): NonNullable<SessionProviderType['data']> => {
  const subsByTrack = raw.subsList ?? {};
  const subsData = raw.subsData ?? {};
  const pendingData = raw.subsPendingData ?? {};
  const hasTrack = !!trackId && trackId in subsByTrack;

  let tier = hasTrack ? subsByTrack[trackId].tier : null;
  let feature = hasTrack ? subsByTrack[trackId].feature : NO_FEATURE;

  const isStaffOrPremium = [
    'ADMIN',
    'SUPER_ADMIN',
    'PREMIUM',
    'FINANCE',
  ].includes(raw.role);
  if (raw.specialRole && isStaffOrPremium) {
    tier = raw.specialRole.tier;
    feature = raw.specialRole.feature;
  }

  return {
    expires: undefined,
    user: {
      id: raw.id,
      email: raw.email,
      name: raw.name,
      role: raw.role,
      type: raw.type,
      userTryOutId: raw.userTryOutId,
      emailVerified: raw.emailVerified,
      expire: raw.expire,
      image: raw.image,
      phone: raw.phone,
      subsList: (trackId && subsData[trackId]) || [],
      subsPendingList: [
        ...((trackId && pendingData[trackId]) || []),
        ...(pendingData.all || []),
      ],
      tier,
      feature,
    },
  };
};

export default function ProviderSessionAuth({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [raw, setRaw] = useState<any>(null);

  const load = useCallback(async () => {
    if (!hasSession()) {
      setRaw(null);
      setStatus('unauthenticated');
      return;
    }
    try {
      await migrateSession();
      const res = await axiosInstanceWithToken.post('/auth/verifyToken');
      setRaw(res.data.data);
      setStatus('authenticated');
    } catch (error) {
      const { status: httpStatus } = responseError(error);
      setStatus('unauthenticated');
      if (httpStatus === 401) signOut();
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const trackId = useMemo(() => {
    const fromPath = trackIdFromPath(pathname);
    if (fromPath) return fromPath;
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('website_sub_category_id');
  }, [pathname]);

  const value = useMemo<SessionProviderType>(
    () => ({
      status,
      data: raw ? buildSession(raw, trackId) : undefined,
      refresh: load,
    }),
    [status, raw, trackId, load],
  );

  if (status === 'loading' && isProtectedPath(pathname)) {
    return <PageLoader />;
  }

  return (
    <SessionProvider.Provider value={value}>
      {children}
    </SessionProvider.Provider>
  );
}

const SessionProvider = createContext<null | SessionProviderType>(null);

type SessionProviderType = {
  status: SessionStatus;
  /** Verifikasi ulang sesi (mis. setelah langganan berubah) tanpa reload halaman. */
  refresh: () => Promise<void>;
  data:
    | {
        user: {
          id: string;
          name: string;
          email: string;
          role: UserRoleEnum;
          image: string | null;
          emailVerified: Date | null;
          expire: string;
          userTryOutId: string | null;
          type: string;
          tier: string;
          phone: string | null;
          feature: {
            document: boolean;
            course: string[] | 'ALLOW';
            quiz: string[] | 'ALLOW';
            liveClass: boolean;
          };
          subsList: (Subscription & {
            SubscriptionFeature: SubscriptionFeature[];
            SubscriptionInstallment: SubscriptionInstallment[];
          })[];
          subsPendingList: (SubscriptionPending & {
            SubscriptionPendingFeature: SubscriptionPendingFeature[];
            SubscriptionPendingLimitation?: SubscriptionPendingLimitation;
          })[];
        };
        expires: string | undefined;
      }
    | undefined;
};

export const useSession = () => {
  const context = useContext(SessionProvider);
  if (!context) {
    throw Error('useSession must be wrapped in SessionProvider');
  }
  return context;
};
