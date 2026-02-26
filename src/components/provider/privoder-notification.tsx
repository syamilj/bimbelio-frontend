'use client';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { MutateType, useMutation } from '@/lib/fetch-helper/useMutation';
import { useSocket } from '@/lib/socket/useSocket';
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
import { useDebouncedCallback } from 'use-debounce';
import { useSession } from './provider-session-auth';
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

  notificationSocketListener({
    setNotificationPopUp,
    setNotifications,
    setUnreadCount,
  });

  initiateNotificationWorker();

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

const notificationSocketListener = ({
  setNotificationPopUp,
  setNotifications,
  setUnreadCount,
}: {
  setNotificationPopUp: Dispatch<SetStateAction<NotificationData | null>>;
  setNotifications: Dispatch<SetStateAction<NotificationData[]>>;
  setUnreadCount: Dispatch<SetStateAction<number>>;
}) => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const role = session?.user.role;
  const { on, emit, off } = useSocket();

  const playNotificationSound = (
    soundUrl: string = '/sounds/notification2.wav',
  ) => {
    try {
      const audio = new Audio(soundUrl);
      audio.volume = 1;
      audio.play().catch((error) => {
        console.warn('Could not play notification sound:', error);
      });
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    console.log('Setting up notification listener for userId:', userId);
    console.log('Listening to event: ', `notification:${userId}`);

    on(
      `notification:${userId}`,
      (data: Omit<NotificationData, 'createdAt' | 'updatedAt'>) => {
        console.log('New notification received2:', data);
        playNotificationSound();

        const newNotif: NotificationData = {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (newNotif.isPopUp) {
          setNotificationPopUp(newNotif);
          console.log('2');
        }

        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      },
    );
    return () => {
      console.log('Cleaning up notification listener for userId:', userId);
      off(`notification:${userId}`);
    };
  }, [userId]);

  useEffect(() => {
    console.log('Setting up notification listener for broadcast');
    on(
      `notification:broadcast`,
      (data: Omit<NotificationData, 'createdAt' | 'updatedAt'>) => {
        console.log('New notification received:', data);
        playNotificationSound();

        const newNotif: NotificationData = {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (newNotif.isPopUp) {
          setNotificationPopUp(newNotif);
        }

        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      },
    );
    return () => {
      console.log('Cleaning up notification listener for broadcast');
      off(`notification:broadcast`);
    };
  }, []);
};

const initiateNotificationWorker = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  const handleResubscribe = useDebouncedCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        // Check notification permission
        console.log(
          'Current notification permission:',
          Notification.permission,
        );

        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          console.log('Requested permission:', permission);
          if (permission !== 'granted') {
            console.warn('❌ Notification permission not granted');
            alert('Please enable notifications in your browser settings');
            return;
          }
        } else if (Notification.permission === 'denied') {
          console.warn(
            '❌ Notification permission is denied. Please change it in browser settings.',
          );
          alert(
            'Notification permission is denied. Please change it in browser settings.',
          );
          return;
        }

        // Unregister old SW and register fresh one
        const registrations = await navigator.serviceWorker.getRegistrations();

        if (registrations.length > 0) {
          return;
        }

        console.log({ registrations });

        for (let reg of registrations) {
          await reg.unregister();
        }

        // Register service worker fresh
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('✅ Service worker registered/updated');

        // Tunggu sampai SW benar-benar active dengan polling
        let isActive = false;
        let attempts = 0;
        const maxAttempts = 20;

        while (!isActive && attempts < maxAttempts) {
          if (registration.active) {
            isActive = true;
            console.log('✅ Service worker is now active!');
            break;
          }
          attempts++;
          console.log(
            `Waiting for SW to activate... attempt ${attempts}/${maxAttempts}`,
          );
          await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms
        }

        if (!isActive) {
          throw new Error(
            'Service Worker failed to activate after multiple attempts',
          );
        }

        // Check existing subscription
        let subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          console.log('Existing subscription found, deleting...');
          await subscription.unsubscribe();
        }

        // Create new subscription
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo',
          ),
        });

        console.log('✅ New push subscription created:', subscription);

        const payload = { userId, ...subscription.toJSON() };

        // Kirim subscription ke backend
        const res = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/notification/addNotificationWorker`,
          {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'content-type': 'application/json',
            },
          },
        );

        if (!res.ok) {
          throw new Error(`Failed to subscribe: ${res.status}`);
        }

        const data = await res.json();
        console.log('✅ Subscription sent to backend:', data);
        alert('✅ Subscription successful! You can now receive notifications.');
      } catch (error: any) {
        console.error('❌ Error:', error);
        alert('Error: ' + error.message);
      }
    }
  }, 1000);

  useEffect(() => {
    handleResubscribe();
  }, []);
};
