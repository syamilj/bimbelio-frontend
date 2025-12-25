'use client';
import { useGet } from '@/lib/fetch-helper/useGet';
import { MutateType, useMutation } from '@/lib/fetch-helper/useMutation';
import { Notification as NotificationData } from '@/types/database';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';

export default function ProviderNotification({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notificationPopUp, setNotificationPopUp] =
    useState<NotificationData | null>(null as any);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewMore, setIsViewMore] = useState(false);

  const [isFirstFetching, setIsFirstFetching] = useState(true);

  const {
    refetch: fetchNotification,
    page: currentPage,
    totalPages,
    totalData,
  } = useGet<{
    data: NotificationData[];
    unreadCount: number;
  }>('/notification/getUserNotification', {
    params: {
      take,
      page,
      unReadOnly: filter === 'UNREAD' ? 'true' : undefined,
    },
    onSuccess({ data }) {
      if (data) {
        const newData = data.data;
        if (page === 1) {
          setNotifications(newData);
          setIsLoading(false);
        } else if (page > 1 && page <= totalPages && isViewMore) {
          setNotifications((prev) => [...prev, ...newData]);
          setIsLoading(false);
        }
        setUnreadCount(data.unreadCount);
      }
      setIsFirstFetching(false);
    },
    onError() {
      setIsLoading(false);
      setIsFirstFetching(false);
    },
    useEffectDependencies: [take, page, filter],
  });

  const isAllLoaded = notifications.length >= totalData;

  const { mutate: deleteNotification } = useMutation(
    '/notification/deleteNotification',
    'delete',
    {
      async onError() {
        if (page === 1) {
          await fetchNotification();
        } else {
          setPage(1);
        }
      },
    },
  );

  const { mutate: readNotification } = useMutation(
    '/notification/readNotification',
    'put',
    {
      toast: {
        hideSuccess: true,
      },
      async onError() {
        if (page === 1) {
          await fetchNotification();
        } else {
          setPage(1);
        }
      },
    },
  );

  const { mutate: readAllNotification, isLoading: isReadingAll } = useMutation(
    '/notification/readAllNotification',
    'put',
    {
      async onSuccess() {
        if (page === 1) {
          await fetchNotification();
        } else {
          setPage(1);
        }
      },
    },
  );

  const handleMarkAsRead = useCallback((notifId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notifId
          ? { ...notif, isRead: true, readAt: new Date().toISOString() }
          : notif,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    readNotification({
      payload: { id: notifId },
    });
  }, []);

  const handleDelete = useCallback((notifId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notifId));
    deleteNotification({ params: { id: notifId } });
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    await readAllNotification();
  }, []);

  const Context = {
    usePopUp: {
      notificationPopUp,
      setNotificationPopUp,
    },
    useData: {
      notifications,
      setNotifications,
    },
    useFetchRead: {
      readAllNotification,
      isReadingAll,
    },
    useFetchData: {
      fetchNotification,
      totalData,
      totalPages,
      currentPage,
      page,
      setPage,
      filter,
      setFilter,
      take,
      setTake,
      isAllLoaded,
    },
    useState: {
      isLoading,
      setIsLoading,
      isFirstFetching,
      setIsFirstFetching,
      isViewMore,
      setIsViewMore,
      unreadCount,
      setUnreadCount,
    },
    useAction: {
      handleMarkAsRead,
      handleDelete,
      handleMarkAllAsRead,
    },
  };

  return (
    <NotificationContext.Provider value={Context}>
      {children}
    </NotificationContext.Provider>
  );
}

interface NotificationContextType {
  usePopUp: {
    notificationPopUp: NotificationData | null;
    setNotificationPopUp: Dispatch<SetStateAction<NotificationData | null>>;
  };
  useData: {
    notifications: NotificationData[];
    setNotifications: Dispatch<SetStateAction<NotificationData[]>>;
  };
  useFetchRead: {
    readAllNotification: MutateType<any>;
    isReadingAll: boolean;
  };
  useFetchData: {
    fetchNotification: () => Promise<
      | {
          message: string;
          status: number;
          data?: any;
          page?: number;
          total_pages?: number;
        }
      | undefined
    >;
    totalData: number;
    totalPages: number;
    currentPage: number;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    filter: 'ALL' | 'UNREAD';
    setFilter: Dispatch<SetStateAction<'ALL' | 'UNREAD'>>;
    take: number;
    setTake: Dispatch<SetStateAction<number>>;
    isAllLoaded: boolean;
  };
  useState: {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    isFirstFetching: boolean;
    setIsFirstFetching: Dispatch<SetStateAction<boolean>>;
    isViewMore: boolean;
    setIsViewMore: Dispatch<SetStateAction<boolean>>;
    unreadCount: number;
    setUnreadCount: Dispatch<SetStateAction<number>>;
  };
  useAction: {
    handleMarkAsRead: (notifId: string) => void;
    handleDelete: (notifId: string) => void;
    handleMarkAllAsRead: () => Promise<void>;
  };
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within an NotificationContext',
    );
  }
  return context;
};

// const Dummy = {
//   id: 'a33c16da-57ed-45ca-aedf-45d7e24afe57',
//   userId: 'cmadn8rb600l1kux1bis4co3d',
//   title: 'Live Class Dimulai!',
//   content:
//     'Live Class Bahasa Indonesia #1 - Huruf Kapital dan Huruf Miring akan dimulai dalam 2 jam. Pastikan Anda siap!',
//   description: 'Persiapkan diri Anda untuk mengikuti Live Class',
//   type: 'LIVECLASS_STARTING',
//   category: 'LIVE_CLASS',
//   priority: 'NORMAL',
//   isBroadcast: false,
//   relatedResourceId: 'cmhsy7t04000ukucqwjnsou2q',
//   relatedResourceType: 'LIVE_CLASS',
//   isRead: false,
//   readAt: null,
//   isArchived: false,
//   archivedAt: null,
//   isPopUp: false,
//   isSendingWhatsApp: true,
//   isSendingEmail: false,
//   actionUrl: '/snbt/user/live-learning/detail/cmhsy7t04000ukucqwjnsou2q',
//   metadata: {
//     id: 'cmhsy7t04000ukucqwjnsou2q',
//     link: 'https://meet.google.com/kko-vvmh-buv',
//     type: 'LIVECLASS',
//     image: null,
//     title: 'Bahasa Indonesia #1 - Huruf Kapital dan Huruf Miring',
//     endDate: '2025-12-23T16:17:00.000Z',
//     duration: 90,
//     isRecord: true,
//     createdAt: '2025-11-10T09:37:13.876Z',
//     startDate: '2025-12-23T14:47:00.000Z',
//     updatedAt: '2025-12-23T12:43:32.891Z',
//     accessType: 'FREE_WITH_REGISTRATION',
//     categoryId: 'cmcbj6l9p099xku3daivdaauf',
//     description:
//       'Kelas Materi Dasar Bahasa Indonesia untuk persiapan ikut UTBK, SIMAK UI, UM UGM, dan PTN Lain.',
//     instructorId: 'cmhsxlkko0003kucqrznb51ie',
//     averageRating: 5,
//     maxParticipant: null,
//     websiteSubCategoryId: 'snbt',
//   },
//   createdAt: '2025-12-23T12:47:00.098Z',
//   updatedAt: '2025-12-23T12:47:00.098Z',
// };

const Dummy = {
  id: '7827f2af-11d8-477c-806a-31992ca51c1e',
  userId: 'cmadn8rb600l1kux1bis4co3d',
  title: 'Try Out Dimulai!',
  content:
    'Try Out [2026] SNBT/UTBK - SPRINT TO #1 akan dimulai dalam 2 jam. Pastikan Anda siap!',
  description: 'Persiapkan diri Anda untuk mengikuti ujian',
  type: 'TRYOUT_STARTED',
  category: 'TRYOUT',
  priority: 'NORMAL',
  isBroadcast: false,
  relatedResourceId: 'cmhoo0pai000tkuq4rlws73mx',
  relatedResourceType: 'TRYOUT',
  isRead: true,
  readAt: '2025-12-23T01:12:01.966Z',
  isArchived: false,
  archivedAt: null,
  isPopUp: false,
  isSendingWhatsApp: true,
  isSendingEmail: false,
  actionUrl: '/snbt/user/try-out/cmhoo0pai000tkuq4rlws73mx',
  metadata: {
    id: 'cmhoo0pai000tkuq4rlws73mx',
    image: 'tryout-153ab516-946d-4abc-a957-d9a9d9e18e04',
    title: '[2026] SNBT/UTBK - SPRINT TO #1',
    status: 'PUBLIC',
    tiktok: null,
    endDate: '2025-12-25T10:59:00.000Z',
    createAt: '2025-11-07T09:40:41.611Z',
    restTime: 1440,
    updateAt: '2025-12-23T01:08:25.316Z',
    instagram: 'https://www.instagram.com/p/DQwEHCvklMY/?img_index=1',
    startDate: '2025-12-23T03:12:00.000Z',
    resultDate: '2025-12-25T10:59:00.000Z',
    website_sub_category_id: 'snbt',
  },
  createdAt: '2025-12-23T01:12:00.029Z',
  updatedAt: '2025-12-23T01:12:01.967Z',
};
