'use client';

import { signOut } from '@/lib/auth-helper';
import axiosInstanceWithToken from '@/lib/axios/axiosInstanceWithToken';
import { responseError } from '@/lib/response';
import {
  Subscription,
  SubscriptionFeature,
  SubscriptionPending,
  SubscriptionPendingFeature,
  SubscriptionPendingLimitation,
  UserRoleEnum,
} from '@/types/database';
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
    const urlPathname = window.location.pathname.split('/');

    const website_sub_category_id =
      urlPathname.length > 1 && urlPathname[1].length > 0
        ? urlPathname[1]
        : localStorage?.getItem('website_sub_category_id');

    if (token) {
      axiosInstanceWithToken
        .post(`/auth/verifyToken`)
        .then((res) => {
          const resData = res.data;
          const userData = resData.data;
          const subsListData = userData.subsData;
          const subsPendingListData = userData.subsPendingData;
          console.log({ userData, subsListData, subsPendingListData, res });
          let tier, feature, subsList, subsPendingList;
          if (
            Object.keys(userData.subsList).includes(website_sub_category_id!)
          ) {
            tier = userData.subsList[website_sub_category_id!].tier;
            feature = userData.subsList[website_sub_category_id!].feature;
            subsList = subsListData[website_sub_category_id!] || [];
          } else {
            tier = null;
            feature = { document: false, course: false, liveClass: false };
            subsList = [];
          }

          if (
            Object.keys(subsPendingListData).includes(website_sub_category_id!)
          ) {
            subsPendingList =
              subsPendingListData[website_sub_category_id!] || [];
          } else {
            subsPendingList = [];
          }

          if (Object.keys(subsPendingListData).includes('all')) {
            subsPendingList = [
              ...subsPendingList,
              ...subsPendingListData['all'],
            ];
          }

          if (
            userData.specialRole &&
            (userData.role === 'ADMIN' ||
              userData.role === 'SUPER_ADMIN' ||
              userData.role === 'PREMIUM')
          ) {
            tier = userData.specialRole.tier;
            feature = userData.specialRole.feature;
          }
          setData({
            expires: undefined,
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              token: token,
              type: userData.type,
              userTryOutId: userData.userTryOutId,
              emailVerified: userData.emailVerified,
              expire: userData.expire,
              image: userData.image,
              phone: userData.phone,
              subsList,
              subsPendingList,
              tier,
              feature,
            },
          });
        })
        .catch((error) => {
          const { message, status } = responseError(error);
          if (status === 401) {
            responseError(error, true);
            signOut();
          }
          console.log({ error });
          console.error('Token verification failed:', message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  console.log('session : ', data);

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
          role: UserRoleEnum;
          token: string;
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
            liveClass: boolean;
          };
          subsList: (Subscription & {
            SubscriptionFeature: SubscriptionFeature[];
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
