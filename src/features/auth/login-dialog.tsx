'use client';

import { Lio } from '@/components/brand/lio';
import { Logo } from '@/components/brand/logo';
import { BubbleLoader } from '@/components/patterns/bubble-loader';
import { useAppContext } from '@/components/provider/provider-app';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { env } from '@/env.mjs';
import { toApiError } from '@/lib/api/client';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useGoogleLogin } from './login-flow';

/** Modal masuk (Google). Dibuka lewat `useAppContext().useAuth.setShowAuth`. */
export function LoginDialog() {
  const {
    useAuth: { showAuth, setShowAuth },
  } = useAppContext();
  const login = useGoogleLogin();
  const [pending, setPending] = useState(false);

  const close = () => setShowAuth((prev) => ({ ...prev, open: false }));

  return (
    <Dialog
      open={showAuth.open}
      onOpenChange={(open) => !open && !pending && close()}
    >
      <DialogContent className="justify-items-center gap-6 px-8 py-10 text-center sm:max-w-sm">
        <Lio
          expression="senang"
          size="m"
        />
        <div className="flex flex-col gap-2">
          <Logo
            title=""
            className="mx-auto h-6"
          />
          <DialogTitle className="font-display text-2xl tracking-display">
            Masuk ke Bimbelio
          </DialogTitle>
          <DialogDescription>
            Pakai akun Google-mu. Akun baru otomatis dibuat saat pertama kali
            masuk.
          </DialogDescription>
        </div>

        <div
          id="google-button-container"
          className="flex min-h-11 w-full justify-center"
        >
          {pending ? (
            <BubbleLoader label="Sedang masuk…" />
          ) : (
            <GoogleOAuthProvider
              clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              locale="id"
            >
              <div id="google-button">
                <GoogleLogin
                  text="continue_with"
                  shape="pill"
                  size="large"
                  width="280"
                  onSuccess={async ({ credential }) => {
                    if (!credential) return;
                    setPending(true);
                    try {
                      await login(credential, showAuth.redirect);
                      close();
                    } catch (error) {
                      toast.error('Gagal masuk', {
                        description: toApiError(error).message,
                      });
                    } finally {
                      setPending(false);
                    }
                  }}
                  onError={() => {
                    toast.error('Gagal masuk', {
                      description:
                        'Jendela Google ditutup atau diblokir. Coba lagi.',
                    });
                  }}
                />
              </div>
            </GoogleOAuthProvider>
          )}
        </div>

        <p className="text-xs text-ink-muted">
          Dengan masuk, kamu menyetujui{' '}
          <Link
            href="/terms"
            onClick={close}
            className="font-semibold text-brand-strong underline-offset-2 hover:underline"
          >
            Syarat dan Ketentuan
          </Link>{' '}
          serta{' '}
          <Link
            href="/privacy"
            onClick={close}
            className="font-semibold text-brand-strong underline-offset-2 hover:underline"
          >
            Kebijakan Privasi
          </Link>{' '}
          Bimbelio.
        </p>
      </DialogContent>
    </Dialog>
  );
}
