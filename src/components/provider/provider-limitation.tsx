'use client';
import { PageLoader } from '@/components/patterns/page-loader';
import axiosInstance from '@/lib/axios/axiosInstance';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { response } from '@/lib/response';
import { trackIdFromPath } from '@/lib/surface';
import { usePathname } from 'next/navigation';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSession } from './provider-session-auth';

type UserLimitationType = {
  Limit: {
    chat: number;
    notes: number;
    quiz: number;
    vision: number;
    tryout: number;
    user: {
      id: string;
      Role: 'USER' | 'ADMIN';
    };
    chatLimit: number;
    notesLimit: number;
    visionLimit: number;
    quizLimit: number;
    tryoutLimit: number;
  };
  user: {
    id: string;
    Role: 'USER' | 'ADMIN';
  };
  chat: number;
  quiz: number;
  notes: number;
  vision: number;
  tryout: number;
  chatLimit: number;
  notesLimit: number;
  visionLimit: number;
  quizLimit: number;
  tryoutLimit: number;
};

export default function ProviderLimitation({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userLimitation, setUserLimitation] = useState<UserLimitationType>();
  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    axiosInstance
      .get(`/user/getCurrentLimitation?userId=${session?.user.id}`)
      .then((res) => {
        const resData = response(res);
        setUserLimitation(resData.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [session]);

  const checkLimitation = async (payload: {
    chat?: boolean;
    vision?: boolean;
    notes?: boolean;
    quiz?: boolean;
    tryout?: boolean;
  }) => {
    const { chat, notes, quiz, vision, tryout } = payload;
    let sendData: any = null;
    await mutateGeneral('/user/limitation', {
      payload: {
        ...payload,
        userId: session?.user.id || '',
      },
      toast: { hideSuccess: true },
      type: 'post',
      onSuccess({ data }) {
        sendData = data;
        if (!userLimitation) return;
        const newUserLimitation = userLimitation;
        if (chat === true) newUserLimitation.chat++;
        if (notes === true) newUserLimitation.notes++;
        if (quiz === true) newUserLimitation.quiz++;
        if (vision === true) newUserLimitation.vision++;
        if (tryout === true) newUserLimitation.tryout++;
        setUserLimitation(newUserLimitation);
      },
    });
    return sendData;
  };

  const Context = {
    userLimitation,
    setUserLimitation,
    checkLimitation,
  };

  // Hanya area aplikasi yang menunggu kuota; halaman publik dirender langsung
  // agar HTML dari server berisi konten.
  if (isLoading && trackIdFromPath(pathname)) {
    return <PageLoader />;
  }

  return (
    <LimitationContext.Provider value={Context}>
      {children}
    </LimitationContext.Provider>
  );
}

interface LimitationContextType {
  userLimitation: UserLimitationType | undefined;
  setUserLimitation: Dispatch<SetStateAction<UserLimitationType | undefined>>;
  checkLimitation: (payload: {
    chat?: boolean;
    vision?: boolean;
    notes?: boolean;
    quiz?: boolean;
    tryout?: boolean;
  }) => Promise<any>;
}

const LimitationContext = createContext<LimitationContextType | undefined>(
  undefined,
);

export const useUserLimitation = () => {
  const context = useContext(LimitationContext);
  if (!context) {
    throw new Error(
      'useUserLimitation must be used within an LimitationContext',
    );
  }
  return context;
};

// Safe version that doesn't throw - returns undefined if no provider
export const useUserLimitationSafe = () => {
  return useContext(LimitationContext);
};
