'use client';

import { Notification } from '@/types/database';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BlocknoteEditorType } from '../workspace/editor/provider';
// Dynamic import komponen berat yang jarang muncul awal
const Login = dynamic(() => import('../_shared/auth/login'), { ssr: false });
const AccountSetting = dynamic(() => import('../_shared/account/setting'), {
  ssr: false,
});

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

export default function ProviderApp({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showAuth, setShowAuth] = useState<{
    open: boolean;
    redirect: string | null;
  }>({ open: false, redirect: null });
  const [pagesSetting, setPagesSetting] = useState<
    'account' | 'subscription' | 'history' | 'installment' | undefined
  >();

  const [minimizeSidebar, setMinimizeSidebar] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const [vision, setVision] = useState<boolean>(false);
  const [zoomValue, setZoomValue] = useState<string>('page-width');
  const [normalSize, setNormalSize] = useState<string>('1.00');
  const [transactionPopUp, setTransactionPopUp] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  // Change Note
  const [change, setChange] = useState<boolean>(false);
  const [mobileScreen, setMobileScreen] = useState<string>('minimize');
  const [sidebarMobile, setSidebarMobile] = useState<boolean>(false);

  // Search Data
  const [docsSearchData, setDocsSearchData] = useState<any>([]);

  // Chat
  const [sendMessage, setSendMessage] = useState<string | null>(null);

  // Editor
  const [editor, setEditor] = useState<BlocknoteEditorType | null>(null);

  const [onBoarding, setOnBoarding] = useState<OnBoardingProps>({
    chat: false,
    notes: false,
    quiz: false,
    tryout: false,
  });

  const [notificationPopUp, setNotificationPopUp] =
    useState<Notification | null>(null as any);

  // useEffect(() => {
  //   if (isDekstop) setMinimizeSidebar(false);
  // }, [isDekstop]);

  // const [isMidtransScriptLoaded, setIsMidtransScriptLoaded] =
  //   useState<boolean>(false);

  // const LoadMidtransScript = () => {
  //   const snapScriptUrl = `${env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}`;
  //   if (!snapScriptUrl) return;
  //   const clientKey = env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  //   const id = 'midtrans-snap-script';
  //   if (document.getElementById(id)) return; // sudah dimuat
  //   const script = document.createElement('script');
  //   script.id = id;
  //   script.src = snapScriptUrl;
  //   if (clientKey) script.setAttribute('data-client-key', clientKey);
  //   script.async = true;
  //   document.body.appendChild(script);
  // };

  // const LoadMidtransCss = () => {
  //   const linkId = 'snap-assets-preconnect';
  //   if (document.getElementById(linkId)) return; // Already added!

  //   const link = document.createElement('link');
  //   link.id = linkId; // ✅ Add ID for tracking
  //   link.rel = 'preconnect';
  //   link.href = 'https://snap-assets.al-pc-id-p.cdn.gtflabs.io';
  //   document.head.appendChild(link);
  // };

  useEffect(() => {
    const isPayment =
      transactionPopUp ||
      pathname.includes('/price') ||
      pathname.includes('/user');
    // if (isPayment && !isMidtransScriptLoaded) {
    //   LoadMidtransScript();
    //   LoadMidtransCss();
    //   setIsMidtransScriptLoaded(true);
    // }
  }, [pathname, transactionPopUp]);

  useEffect(() => {
    if (showAuth.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAuth]);

  const Context = {
    minimizeSidebar,
    setMinimizeSidebar,
    showSidebar,
    setShowSidebar,
    normalSize,
    setNormalSize,
    zoomValue,
    setZoomValue,
    vision,
    setVision,
    transactionPopUp,
    setTransactionPopUp,
    change,
    setChange,
    mobileScreen,
    setMobileScreen,
    sidebarMobile,
    setSidebarMobile,
    docsSearchData,
    setDocsSearchData,
    pagesSetting,
    setPagesSetting,
    search,
    setSearch,
    onBoarding,
    setOnBoarding,
    useNotification: {
      notificationPopUp,
      setNotificationPopUp,
    },
    useSendMessage: {
      sendMessage,
      setSendMessage,
    },
    useEditor: {
      editor,
      setEditor,
    },
    useAuth: {
      showAuth,
      setShowAuth,
    },
  };

  return (
    <AppContext.Provider value={Context}>
      {showAuth.open && <Login />}
      <AccountSetting />
      {children}
    </AppContext.Provider>
  );
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppContextType {
  minimizeSidebar: boolean;
  setMinimizeSidebar: Dispatch<SetStateAction<boolean>>;
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  normalSize: string;
  setNormalSize: Dispatch<SetStateAction<string>>;
  zoomValue: string;
  setZoomValue: Dispatch<SetStateAction<string>>;
  vision: boolean;
  setVision: Dispatch<SetStateAction<boolean>>;
  transactionPopUp: boolean;
  setTransactionPopUp: Dispatch<SetStateAction<boolean>>;
  change: boolean;
  setChange: Dispatch<SetStateAction<boolean>>;
  mobileScreen: string;
  setMobileScreen: Dispatch<SetStateAction<string>>;
  sidebarMobile: boolean;
  setSidebarMobile: Dispatch<SetStateAction<boolean>>;
  docsSearchData: any;
  setDocsSearchData: Dispatch<any>;
  pagesSetting:
    | 'account'
    | 'subscription'
    | 'history'
    | 'installment'
    | undefined;
  setPagesSetting: Dispatch<
    SetStateAction<
      'account' | 'subscription' | 'history' | 'installment' | undefined
    >
  >;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  onBoarding: OnBoardingProps;
  setOnBoarding: Dispatch<SetStateAction<OnBoardingProps>>;
  useNotification: {
    notificationPopUp: Notification | null;
    setNotificationPopUp: Dispatch<SetStateAction<Notification | null>>;
  };
  useSendMessage: {
    sendMessage: string | null;
    setSendMessage: Dispatch<SetStateAction<string | null>>;
  };
  useEditor: {
    editor: BlocknoteEditorType | null;
    setEditor: Dispatch<SetStateAction<BlocknoteEditorType | null>>;
  };
  useAuth: {
    showAuth: {
      open: boolean;
      redirect: string | null;
    };
    setShowAuth: Dispatch<
      SetStateAction<{
        open: boolean;
        redirect: string | null;
      }>
    >;
  };
}

interface OnBoardingProps {
  chat: boolean;
  notes: false;
  quiz: boolean;
  tryout: boolean;
}
