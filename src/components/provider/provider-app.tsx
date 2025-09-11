'use client';

import { env } from '@/env.mjs';
import dynamic from 'next/dynamic';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import useMedia from 'use-media';
import { BlocknoteEditorType } from '../workspace/editor/provider';
// Dynamic import komponen berat yang jarang muncul awal
const Login = dynamic(() => import('../_shared/auth/login'), { ssr: false });
const HistoryPayment = dynamic(() => import('../_shared/account/setting'), {
  ssr: false,
});

export default function ProviderApp({ children }: { children: ReactNode }) {
  const isDekstop = useMedia({ minWidth: '768px' });

  const [showAuth, setShowAuth] = useState<{
    open: boolean;
    redirect: string | null;
  }>({ open: false, redirect: null });

  const [minimizeSidebar, setMinimizeSidebar] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const [vision, setVision] = useState<boolean>(false);
  const [zoomValue, setZoomValue] = useState<string>('page-width');
  const [normalSize, setNormalSize] = useState<string>('1.00');
  const [transactionPopUp, setTransactionPopUp] = useState<boolean>(false);
  const [transactionHistory, setTransactionHistory] = useState<boolean>(false);
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

  const [pagesSetting, setPagesSetting] = useState<string>('account');

  const [onBoarding, setOnBoarding] = useState<OnBoardingProps>({
    chat: false,
    notes: false,
    quiz: false,
    tryout: false,
  });

  // useEffect(() => {
  //   if (isDekstop) setMinimizeSidebar(false);
  // }, [isDekstop]);

  // Lazy load Midtrans Snap hanya saat popup transaksi dibuka
  useEffect(() => {
    // if (!transactionPopUp) return;
    const snapScriptUrl = `${env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}`;
    if (!snapScriptUrl) return;
    const clientKey = env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const id = 'midtrans-snap-script';
    if (document.getElementById(id)) return; // sudah dimuat
    const script = document.createElement('script');
    script.id = id;
    script.src = snapScriptUrl;
    if (clientKey) script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
    transactionHistory,
    setTransactionHistory,
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
      {transactionHistory && <HistoryPayment pages={`${pagesSetting}`} />}
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
  transactionHistory: boolean;
  setTransactionHistory: Dispatch<SetStateAction<boolean>>;
  change: boolean;
  setChange: Dispatch<SetStateAction<boolean>>;
  mobileScreen: string;
  setMobileScreen: Dispatch<SetStateAction<string>>;
  sidebarMobile: boolean;
  setSidebarMobile: Dispatch<SetStateAction<boolean>>;
  docsSearchData: any;
  setDocsSearchData: Dispatch<any>;
  pagesSetting: string;
  setPagesSetting: Dispatch<SetStateAction<string>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  onBoarding: OnBoardingProps;
  setOnBoarding: Dispatch<SetStateAction<OnBoardingProps>>;
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
