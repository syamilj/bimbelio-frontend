'use client';

import { env } from '@/env.mjs';
import { usePathname } from 'next/navigation';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useMedia from 'use-media';
import HistoryPayment from '../_shared/account/setting';

interface OnBoardingProps {
  chat: boolean;
  notes: boolean;
  quiz: boolean;
  tryout: boolean;
}

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default function ProviderApp({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDekstop = useMedia({ minWidth: '768px' });

  const [minimizeSidebar, setMinimizeSidebar] = useState<boolean>(false);
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

  const [pagesSetting, setPagesSetting] = useState<string>('account');

  const [onBoarding, setOnBoarding] = useState<OnBoardingProps>({
    chat: false,
    notes: false,
    quiz: false,
    tryout: false,
  });

  useEffect(() => {
    if (isDekstop) setMinimizeSidebar(true);
  }, [isDekstop]);

  useEffect(() => {
    const snapScriptUrl = `${env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}`;
    const clientKey = env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const script = document.createElement('script');
    script.src = snapScriptUrl;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
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
    }),
    [
      minimizeSidebar,
      showSidebar,
      normalSize,
      zoomValue,
      vision,
      transactionPopUp,
      transactionHistory,
      change,
      mobileScreen,
      sidebarMobile,
      docsSearchData,
      pagesSetting,
      search,
      onBoarding,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {transactionHistory && <HistoryPayment pages={`${pagesSetting}`} />}
      {children}
    </AppContext.Provider>
  );
}
