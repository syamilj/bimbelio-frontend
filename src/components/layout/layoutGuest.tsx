'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import Login from '../_shared/auth/login';
import SignUp from '../_shared/auth/sign-up';
import Navbar from '../_shared/navbar';

interface LayoutGuestProps {
  children: ReactNode;
}
interface auth {
  login: boolean;
  signUp: boolean;
}

export default function LayoutGuest({ children }: LayoutGuestProps) {
  const [showAuth, setShowAuth] = useState<auth>({
    login: false,
    signUp: false,
  });

  useEffect(() => {
    if (showAuth.login || showAuth.signUp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAuth]);

  const Context = {
    showAuth,
    setShowAuth,
  };

  return (
    <GuestContext.Provider value={Context}>
      <Navbar
        showAuth={showAuth}
        setShowAuth={setShowAuth}
      />
      {showAuth.login && (
        <Login
          showAuth={showAuth}
          setShowAuth={setShowAuth}
        />
      )}
      {showAuth.signUp && (
        <SignUp
          showAuth={showAuth}
          setShowAuth={setShowAuth}
        />
      )}
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
