'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from 'react';
import { OneTapLogin } from '../_shared/auth/one-tap-login';
import Footer from '../_shared/footer';
import Navbar from '../_shared/navbar';
import FloatingContactButton from '../_shared/other/floating-contact-button';
import { useAppContext } from '../provider/provider-app';

interface LayoutGuestProps {
  children: ReactNode;
}
interface auth {
  open: boolean;
  redirect: string | null;
}

export default function LayoutGuest({ children }: LayoutGuestProps) {
  const pathname = usePathname();
  const {
    useAuth: { showAuth, setShowAuth },
  } = useAppContext();

  // Ref untuk mencegah multiple initialization
  // const googleInitialized = useRef(false);

  // // useEffect(() => {
  // //   // Prevent multiple initialization
  // //   if (googleInitialized.current) return;

  // //   // Check if script already exists
  // //   const existingScript = document.querySelector(
  // //     'script[src="https://accounts.google.com/gsi/client"]',
  // //   );
  // //   if (existingScript) {
  // //     console.log('Google script already loaded');
  // //     return;
  // //   }

  // //   // Load Google Identity Services
  // //   const script = document.createElement('script');
  // //   script.src = 'https://accounts.google.com/gsi/client';
  // //   script.async = true;
  // //   document.head.appendChild(script);

  // //   console.log('Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  // //   script.onload = () => {
  // //     // Mark as initialized
  // //     googleInitialized.current = true;

  // //     window.google.accounts.id.initialize({
  // //       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  // //       callback: handleCredentialResponse,
  // //       auto_select: true, // Enable One Tap
  // //       cancel_on_tap_outside: false,
  // //     });

  // //     // Render One Tap
  // //     window.google.accounts.id.prompt();
  // //   };

  // //   // Cleanup function
  // //   return () => {
  // //     googleInitialized.current = false;
  // //   };
  // // }, []); // Empty dependency array

  // // const handleCredentialResponse = async (response: any) => {
  // //   console.log({ response });
  // //   return;
  // //   try {
  // //     // Kirim JWT token ke endpoint backend
  // //     const res = await fetch('/api/auth/google', {
  // //       method: 'POST',
  // //       headers: {
  // //         'Content-Type': 'application/json',
  // //       },
  // //       body: JSON.stringify({
  // //         token: response.credential, // JWT dari Google
  // //         provider: 'google',
  // //       }),
  // //     });

  // //     const data = await res.json();

  // //     if (res.ok) {
  // //       // Simpan token dari backend ke localStorage/cookies
  // //       localStorage.setItem('auth_token', data.token);
  // //       localStorage.setItem('user', JSON.stringify(data.user));

  // //       // Redirect ke dashboard
  // //       window.location.href = '/dashboard';
  // //     } else {
  // //       console.error('Auth failed:', data.message);
  // //       // Show error message
  // //     }
  // //   } catch (error) {
  // //     console.error('Network error:', error);
  // //   }
  // // };

  const Context = {
    showAuth,
    setShowAuth,
  };

  return (
    <GuestContext.Provider value={Context}>
      <OneTapLogin />
      <div className="min-h-screen">
        {pathname !== '/discord' && <Navbar />}
        <main className="relative">
          {children}

          <Footer />
        </main>
        <FloatingContactButton />
      </div>
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
