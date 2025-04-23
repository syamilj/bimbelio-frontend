"use client";

import { env } from "@/env.mjs";
import { usePathname } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useMedia from "use-media";
import HistoryPayment from "../_shared/account/setting";

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
  imageMessageLoading: any;
  setImageMessageLoading: Dispatch<any>;
  messageData: any;
  setMessageData: Dispatch<any>;
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

  // Tambahan baru
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  scrollToPdfPage: (pageNum: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default function ProviderApp({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDekstop = useMedia({ minWidth: "768px" });

  const [minimizeSidebar, setMinimizeSidebar] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [messageData, setMessageData] = useState<any>([]);
  const [imageMessageLoading, setImageMessageLoading] = useState<any>({
    index: 99999,
    value: true,
  });

  const [vision, setVision] = useState<boolean>(false);
  const [zoomValue, setZoomValue] = useState<string>("page-width");
  const [normalSize, setNormalSize] = useState<string>("1.00");
  const [transactionPopUp, setTransactionPopUp] = useState<boolean>(false);
  const [transactionHistory, setTransactionHistory] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  // Change Note
  const [change, setChange] = useState<boolean>(false);
  const [mobileScreen, setMobileScreen] = useState<string>("minimize");
  const [sidebarMobile, setSidebarMobile] = useState<boolean>(false);

  // Search Data
  const [docsSearchData, setDocsSearchData] = useState<any>([]);

  const [pagesSetting, setPagesSetting] = useState<string>("account");

  const [onBoarding, setOnBoarding] = useState<OnBoardingProps>({
    chat: false,
    notes: false,
    quiz: false,
    tryout: false,
  });

  // >>> Tambahan Baru <<<
  // Untuk tracking halaman PDF saat ini
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fungsi global untuk scroll ke halaman
  // Sesuaikan container (#VisionOff atau #VisionOn) jika vision = true/false
  const scrollToPdfPage = (pageNum: number) => {
    const containerId = vision ? "VisionOn" : "VisionOff";
    const selector = `#${containerId} #pdf-page-${pageNum}`;
    const pageElement = document.querySelector(selector);

    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth" });
      setCurrentPage(pageNum);
    } else {
      console.warn(`Halaman ${pageNum} tidak ditemukan di ${selector}`);
    }
  };
  // >>> End of Tambahan Baru <<<

  useEffect(() => {
    setMessageData([]);
  }, [pathname]);

  useEffect(() => {
    if (isDekstop) setMinimizeSidebar(true);
  }, [isDekstop]);

  useEffect(() => {
    const snapScriptUrl = `${env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}`;
    const clientKey = env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const script = document.createElement("script");
    script.src = snapScriptUrl;
    script.setAttribute("data-client-key", clientKey);
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
      imageMessageLoading,
      setImageMessageLoading,
      messageData,
      setMessageData,
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

      // Tambahan baru
      currentPage,
      setCurrentPage,
      scrollToPdfPage,
    }),
    [
      minimizeSidebar,
      showSidebar,
      imageMessageLoading,
      messageData,
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
      currentPage,
      scrollToPdfPage,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {transactionHistory && <HistoryPayment pages={`${pagesSetting}`} />}
      {children}
    </AppContext.Provider>
  );
}
