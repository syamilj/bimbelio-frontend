'use client';

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
