'use client';
import { showNotificationToast } from '@/components/_shared/notification/notification-toast';
import { useGet } from '@/lib/fetch-helper/useGet';
import { MutateType, useMutation } from '@/lib/fetch-helper/useMutation';
import { notificationSound } from '@/lib/notification-sound';
import { connectSocket } from '@/lib/socket/socket';
import { Notification as NotificationData } from '@/types/database';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSession } from './provider-session-auth';

export default function ProviderNotification({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notificationPopUpQueue, setNotificationPopUpQueue] = useState<NotificationData[]>([]);
  const notificationPopUp = notificationPopUpQueue[0] ?? null;
  const notificationPopUpQueueLength = notificationPopUpQueue.length;

  const dismissCurrentPopUp = useCallback(() => {
    setNotificationPopUpQueue((prev) => prev.slice(1));
  }, []);

  const pushToPopUpQueue = useCallback((notif: NotificationData) => {
    setNotificationPopUpQueue((prev) => [...prev, notif]);
  }, []);

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [view, setView] = useState<'inbox' | 'archive'>('inbox');

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
      view,
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
    useEffectDependencies: [take, page, filter, view],
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

  const { mutate: archiveNotificationMutate } = useMutation(
    '/notification/archiveNotification',
    'put',
    {
      toast: { hideSuccess: true },
      async onError() {
        await fetchNotification();
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

  const handleArchive = useCallback((notifId: string, archive: boolean) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    archiveNotificationMutate({ payload: { id: notifId, archive } });
  }, []);

  const { data: session } = useSession();
  const userId = session?.user.id;

  // ✅ Direct socket listener — bypasses abstraction, most reliable approach
  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket();

    const handleNotification = (data: Omit<NotificationData, 'createdAt' | 'updatedAt'>) => {
      console.log('[NOTIF] Personal received:', data.title);
      const newNotif: NotificationData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (newNotif.isPopUp) {
        pushToPopUpQueue(newNotif);
      } else {
        showNotificationToast(newNotif);
      }
      notificationSound.play();
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleBroadcast = (data: Omit<NotificationData, 'createdAt' | 'updatedAt'>) => {
      console.log('[NOTIF] Broadcast received:', data.title);
      const newNotif: NotificationData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (newNotif.isPopUp) {
        pushToPopUpQueue(newNotif);
      } else {
        showNotificationToast(newNotif);
      }
      notificationSound.play();
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleConnect = () => {
      console.log('[NOTIF] Socket connected, joining room:', userId);
      socket.emit('user:auth', { userId });
    };

    // Register listeners
    socket.on('notification', handleNotification);
    socket.on('notification:broadcast', handleBroadcast);
    socket.on('connect', handleConnect);

    // If already connected, auth immediately
    if (socket.connected) {
      console.log('[NOTIF] Already connected, joining room:', userId);
      socket.emit('user:auth', { userId });
    }

    return () => {
      socket.off('notification', handleNotification);
      socket.off('notification:broadcast', handleBroadcast);
      socket.off('connect', handleConnect);
    };
  }, [userId]);

  const Context = {
    usePopUp: {
      notificationPopUp,
      dismissCurrentPopUp,
      queueLength: notificationPopUpQueueLength,
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
      view,
      setView,
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
      handleArchive,
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
    dismissCurrentPopUp: () => void;
    queueLength: number;
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
    view: 'inbox' | 'archive';
    setView: Dispatch<SetStateAction<'inbox' | 'archive'>>;
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
    handleArchive: (notifId: string, archive: boolean) => void;
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

