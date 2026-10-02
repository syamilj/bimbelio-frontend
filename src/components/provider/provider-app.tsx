'use client';

import { appPath, useTrackId } from '@/lib/track';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BlocknoteEditorType } from '../workspace/editor/provider';

const Login = dynamic(() => import('../_shared/auth/login'), { ssr: false });
const AccountSetting = dynamic(() => import('../_shared/account/setting'), {
  ssr: false,
});

export type SettingsTab =
  'account' | 'subscription' | 'history' | 'installment' | 'target';
type AuthModal = { open: boolean; redirect: string | null };

const SIDEBAR_KEY = 'bimbelio:sidebar-collapsed';

/**
 * State UI lintas halaman: modal masuk, pengaturan akun, sidebar, dan
 * jembatan editor/chat. (Field lama yang tidak dipakai sudah dihapus.)
 */
export default function ProviderApp({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const trackId = useTrackId();

  const [showAuth, setShowAuth] = useState<AuthModal>({
    open: false,
    redirect: null,
  });
  const [pagesSetting, setPagesSetting] = useState<SettingsTab | undefined>();

  const [minimizeSidebar, setMinimizeSidebarState] = useState(false);
  const [sidebarMobile, setSidebarMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const [vision, setVision] = useState(false);
  const [zoomValue, setZoomValue] = useState('page-width');
  const [normalSize, setNormalSize] = useState('1.00');
  const [change, setChange] = useState(false);
  const [mobileScreen, setMobileScreen] = useState('minimize');
  const [sendMessage, setSendMessage] = useState<string | null>(null);
  const [editor, setEditor] = useState<BlocknoteEditorType | null>(null);

  // Status sidebar diingat antar kunjungan.
  useEffect(() => {
    try {
      setMinimizeSidebarState(localStorage.getItem(SIDEBAR_KEY) === '1');
    } catch {}
  }, []);

  const setMinimizeSidebar: Dispatch<SetStateAction<boolean>> = useCallback(
    (value) => {
      setMinimizeSidebarState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        try {
          localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0');
        } catch {}
        return next;
      });
    },
    [],
  );

  // Tutup menu mobile setiap pindah halaman.
  useEffect(() => setSidebarMobile(false), [pathname]);

  /**
   * "Upgrade" di seluruh aplikasi membuka halaman Paket Belajar. Nama lama
   * (`setTransactionPopUp(true)`) dipertahankan untuk pemanggil yang ada.
   */
  const openUpgrade = useCallback(() => {
    try {
      trackUnifiedEvent({
        eventName: 'ViewContent',
        customData: {
          content_name: 'Payment Dialog',
          content_type: 'pricing',
          content_id: 'payment_modal',
        },
      });
    } catch {}
    const target = appPath(trackId, 'paket-belajar');
    if (pathname !== target) router.push(target);
  }, [pathname, router, trackId]);

  const setTransactionPopUp: Dispatch<SetStateAction<boolean>> = useCallback(
    (value) => {
      const open = typeof value === 'function' ? value(false) : value;
      if (open) openUpgrade();
    },
    [openUpgrade],
  );

  useEffect(() => {
    document.body.style.overflow = showAuth.open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAuth.open]);

  const value = useMemo<AppContextType>(
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
      transactionPopUp: false,
      setTransactionPopUp,
      openUpgrade,
      change,
      setChange,
      mobileScreen,
      setMobileScreen,
      sidebarMobile,
      setSidebarMobile,
      pagesSetting,
      setPagesSetting,
      useSendMessage: { sendMessage, setSendMessage },
      useEditor: { editor, setEditor },
      useAuth: { showAuth, setShowAuth },
    }),
    [
      minimizeSidebar,
      setMinimizeSidebar,
      showSidebar,
      normalSize,
      zoomValue,
      vision,
      setTransactionPopUp,
      openUpgrade,
      change,
      mobileScreen,
      sidebarMobile,
      pagesSetting,
      sendMessage,
      editor,
      showAuth,
    ],
  );

  return (
    <AppContext.Provider value={value}>
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
  /** @deprecated Nilainya tidak pernah dibaca; dipertahankan untuk pemanggil lama. */
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  normalSize: string;
  setNormalSize: Dispatch<SetStateAction<string>>;
  zoomValue: string;
  setZoomValue: Dispatch<SetStateAction<string>>;
  vision: boolean;
  setVision: Dispatch<SetStateAction<boolean>>;
  /** @deprecated Selalu false — upgrade kini membuka halaman Paket Belajar. */
  transactionPopUp: boolean;
  /** @deprecated Pakai `openUpgrade()`. `true` membuka halaman Paket Belajar. */
  setTransactionPopUp: Dispatch<SetStateAction<boolean>>;
  openUpgrade: () => void;
  change: boolean;
  setChange: Dispatch<SetStateAction<boolean>>;
  mobileScreen: string;
  setMobileScreen: Dispatch<SetStateAction<string>>;
  sidebarMobile: boolean;
  setSidebarMobile: Dispatch<SetStateAction<boolean>>;
  pagesSetting: SettingsTab | undefined;
  setPagesSetting: Dispatch<SetStateAction<SettingsTab | undefined>>;
  useSendMessage: {
    sendMessage: string | null;
    setSendMessage: Dispatch<SetStateAction<string | null>>;
  };
  useEditor: {
    editor: BlocknoteEditorType | null;
    setEditor: Dispatch<SetStateAction<BlocknoteEditorType | null>>;
  };
  useAuth: {
    showAuth: AuthModal;
    setShowAuth: Dispatch<SetStateAction<AuthModal>>;
  };
}
