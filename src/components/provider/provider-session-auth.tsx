'use client';

import { signOut } from '@/lib/auth-helper';
import axiosInstanceWithToken from '@/lib/axios/axiosInstanceWithToken';
import { responseError } from '@/lib/response';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Toaster } from 'react-hot-toast';

export default function ProviderSessionAuth({
  children,
}: {
  children: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<SessionProviderType['data']>();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      axiosInstanceWithToken
        .post('/auth/verifyToken')
        .then((res) => {
          console.log({ token: res });
          const resData = res.data;
          const userData = resData.data;
          setData({
            expires: undefined,
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              token: userData.token,
              type: userData.type,
              userTryOutId: userData.userTryOutId,
              emailVerified: userData.emailVerified,
              expire: userData.expire,
              image: userData.image,
              tier: userData.tier,
              feature: {
                document: userData.feature.document,
                course: userData.feature.course,
              },
            },
          });
        })
        .catch((error) => {
          const { message, status } = responseError(error);
          if (status === 401) {
            signOut();
          }
          console.error('Token verification failed:', message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  console.log({ session: data });

  const Context = {
    data,
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full fixed top-0 left-0 justify-center items-center">
        <Loader2 className="animate-spin w-4 h-4" />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <SessionProvider.Provider value={Context}>
        {children}
      </SessionProvider.Provider>
    </>
  );
}

const SessionProvider = createContext<null | SessionProviderType>(null);

type SessionProviderType = {
  data:
    | {
        user: {
          id: string;
          name: string;
          email: string;
          role: 'ADMIN' | 'PREMIUM' | 'USER';
          token: string;
          image: string | null;
          emailVerified: Date | null;
          expire: string;
          userTryOutId: string | null;
          type: string;
          tier: string;
          feature: { document: boolean; course: boolean };
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
