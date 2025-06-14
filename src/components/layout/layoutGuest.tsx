'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from 'react';
import Navbar from '../_shared/navbar';
import { useAppContext } from '../provider/provider-app';

interface LayoutGuestProps {
  children: ReactNode;
}
interface auth {
  open: boolean;
  redirect: string | null;
}

export default function LayoutGuest({ children }: LayoutGuestProps) {
  const {
    useAuth: { showAuth, setShowAuth },
  } = useAppContext();

  const Context = {
    showAuth,
    setShowAuth,
  };

  return (
    <GuestContext.Provider value={Context}>
      <Navbar />
      {children}
    </GuestContext.Provider>
  );
}

interface GuestContextType {
  showAuth: auth;
  setShowAuth: Dispatch<SetStateAction<auth>>;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within an GuestContext');
  }
  return context;
};
