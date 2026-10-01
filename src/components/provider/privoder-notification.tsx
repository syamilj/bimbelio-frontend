'use client';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { MutateType, useMutation } from '@/lib/fetch-helper/useMutation';
import { useSocket } from '@/lib/socket/useSocket';
import { Notification as NotificationData } from '@/types/database';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { Bell, X } from 'lucide-react';
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
  const [notificationPopUp, setNotificationPopUp] =
    useState<NotificationData | null>(null as any);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [notificationsPopUpQueue, setNotificationsPopUpQueue] = useState<
    NotificationData[]
  >([]);
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

        setNotificationsPopUpQueue(
          newData
            .filter((notif) => notif.isPopUp && !notif.isRead)
            .filter(
              (notif, index, arr) =>
                arr.findIndex((n) => n.title === notif.title) === index,
            )
            .slice(0, 5),
        );

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

  const [lastQueuedPopUpId, setLastQueuedPopUpId] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (
      notificationsPopUpQueue.length > 0 &&
      !notificationPopUp &&
      !lastQueuedPopUpId
    ) {
      const nextPopUp = notificationsPopUpQueue[0];
      if (!nextPopUp) return;
      setNotificationPopUp(nextPopUp);
      setLastQueuedPopUpId(nextPopUp.id);
    }
    if (!notificationPopUp && lastQueuedPopUpId) {
      setNotificationsPopUpQueue((prev) =>
        prev.filter((notif) => notif.id !== lastQueuedPopUpId),
      );
      setLastQueuedPopUpId(null);
    }
  }, [notificationsPopUpQueue, notificationPopUp, lastQueuedPopUpId]);

  console.log({
    notificationPopUp,
    lastQueuedPopUpId,
    notificationsPopUpQueue,
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
        hideError: true,
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
      <FloatingNotificationAlert />
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
  const { on, off } = useSocket();

  const playNotificationSound = (
    soundUrl: string = '/sounds/notification.mp3',
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

// Langganan web push. Dulu setiap pemuatan halaman meng-unregister service
// worker, membuat langganan baru, dan mengirim POST ke backend; sekarang hanya
// bila belum ada langganan, VAPID key berubah, atau belum tersinkron untuk user ini.
const PUSH_SYNC_STORAGE_KEY = 'push-subscription-synced';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
};

const sameKey = (a: ArrayBuffer | null | undefined, b: Uint8Array) => {
  if (!a || a.byteLength !== b.byteLength) return false;
  const view = new Uint8Array(a);
  return view.every((byte, i) => byte === b[i]);
};

const syncPushSubscription = async (userId: string) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  if (Notification.permission === 'default') {
    if ((await Notification.requestPermission()) !== 'granted') return;
  }
  if (Notification.permission !== 'granted') return;

  const token = Cookies.get('token');
  if (!token) return;

  const keyRes = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/notification/vapidPublicKey`,
  );
  if (!keyRes.ok) return;
  const serverKey = urlBase64ToUint8Array((await keyRes.json()).data.publicKey);

  // register() idempoten: memperbarui sw.js bila berubah tanpa unregister.
  await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  const keyChanged =
    !!subscription &&
    !sameKey(subscription.options.applicationServerKey, serverKey);
  if (keyChanged) {
    await subscription!.unsubscribe();
    subscription = null;
  }
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: serverKey,
    });
  }

  const syncMarker = `${userId}|${subscription.endpoint}`;
  let alreadySynced = false;
  try {
    alreadySynced = localStorage.getItem(PUSH_SYNC_STORAGE_KEY) === syncMarker;
  } catch {
    // storage tidak tersedia: tetap sinkron
  }
  if (alreadySynced) return;

  const res = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/notification/addNotificationWorker`,
    {
      method: 'POST',
      body: JSON.stringify(subscription.toJSON()),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) throw new Error(`Gagal menyimpan langganan push: ${res.status}`);
  try {
    localStorage.setItem(PUSH_SYNC_STORAGE_KEY, syncMarker);
  } catch {
    // abaikan
  }
};

const initiateNotificationWorker = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;
    syncPushSubscription(userId).catch((error) =>
      console.error('Push subscription gagal:', error),
    );
  }, [userId]);
};

const FloatingNotificationAlert = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default',
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Dynamic colors from website sub category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Detect browser
  const getBrowserName = ():
    | 'chrome'
    | 'firefox'
    | 'safari'
    | 'edge'
    | 'other' => {
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) return 'edge';
    if (ua.includes('Chrome/')) return 'chrome';
    if (ua.includes('Firefox/')) return 'firefox';
    if (ua.includes('Safari/')) return 'safari';
    return 'other';
  };

  const handleRequestPermission = async () => {
    try {
      if (permission === 'denied') {
        // Tidak bisa request lagi, arahkan ke settings browser
        handleOpenBrowserSettings();
        return;
      }
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch (error) {
      console.warn('Error requesting notification permission:', error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleOpenBrowserSettings = () => {
    const browser = getBrowserName();

    if (browser === 'chrome' || browser === 'edge' || browser === 'firefox') {
      setIsDialogOpen(false);
      setIsGuideOpen(true);
    } else {
      setIsDialogOpen(false);
      setIsGuideOpen(true);
    }
  };

  const handleDismiss = () => {
    setIsDialogOpen(false);
    setIsDismissed(true);
  };

  // Show when permission is 'default' or 'denied', and not dismissed, and granted
  if (permission === 'granted' || isDismissed) return null;

  return (
    <>
      {/* Floating Bell Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 2 }}
        className="fixed bottom-24 right-6 z-50"
      >
        <motion.button
          onClick={() => setIsDialogOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white focus:outline-none"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
          aria-label="Aktifkan notifikasi"
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: mainColor }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Bell icon with shake */}
          <motion.div
            animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Bell className="w-6 h-6 relative z-10" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Permission Dialog */}
      {isDialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) =>
            e.target === e.currentTarget && setIsDialogOpen(false)
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Top gradient bar */}
            <div
              className="h-1 w-full"
              style={{
                background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
              }}
            />

            <div className="p-6">
              {/* Close button */}
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <Bell className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Text */}
              <h2 className="text-center text-lg font-bold text-gray-900 mb-1">
                Aktifkan Notifikasi
              </h2>

              {/* Teks berbeda tergantung status permission */}
              {permission === 'denied' ? (
                <p className="text-center text-sm text-gray-500 leading-relaxed mb-6">
                  Notifikasi diblokir. Klik{' '}
                  <span className="font-semibold text-gray-700">"Izinkan"</span>{' '}
                  untuk melihat cara mengaktifkannya di pengaturan browser.
                </p>
              ) : (
                <p className="text-center text-sm text-gray-500 leading-relaxed mb-6">
                  Dapatkan info tryout, pengumuman nilai, dan promo eksklusif
                  langsung di perangkatmu.
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Nanti saja
                </button>
                <button
                  onClick={handleRequestPermission}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  Izinkan
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Guide Dialog — muncul ketika permission 'denied' */}
      {isGuideOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setIsGuideOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div
              className="h-1 w-full"
              style={{
                background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
              }}
            />
            <div className="p-6">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <Bell className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-center text-lg font-bold text-gray-900 mb-3">
                Cara Mengaktifkan Notifikasi
              </h2>

              {/* Step by step */}
              <ol className="text-sm text-gray-600 space-y-2 mb-6 text-left list-none">
                <li className="flex gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: mainColor }}
                  >
                    1
                  </span>
                  <span>
                    Klik ikon{' '}
                    <span className="font-semibold">🔒 gembok / ⓘ info</span> di
                    address bar browser
                  </span>
                </li>
                <li className="flex gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: mainColor }}
                  >
                    2
                  </span>
                  <span>
                    Pilih <span className="font-semibold">"Izin situs"</span>{' '}
                    atau <span className="font-semibold">"Site settings"</span>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: mainColor }}
                  >
                    3
                  </span>
                  <span>
                    Cari <span className="font-semibold">"Notifikasi"</span>{' '}
                    lalu ubah ke{' '}
                    <span className="font-semibold text-green-600">
                      "Izinkan"
                    </span>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: mainColor }}
                  >
                    4
                  </span>
                  <span>Muat ulang halaman ini</span>
                </li>
              </ol>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                Muat Ulang Halaman
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
