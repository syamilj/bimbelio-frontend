// src/pages/client/try-out/[id]/_component/countdown-tryout.tsx

'use client';

import { toaster } from '@/components/ui/toaster';
import { api } from '@/trpc/react';
import { useEffect, useRef, useState } from 'react';

interface SessionAnswer {
  number: number;
  questionId: string;
  answerId: string | null;
  answer: string;
  type: string;
  notSure: boolean;
}

const timeFormat = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function CountDownTryout({
  seconds,
  sessionId,
  sessionAnswer,
}: {
  seconds: number;
  sessionId: string;
  sessionAnswer: SessionAnswer[];
}) {
  const [countdown, setCountdown] = useState<number>(seconds);
  const [execute, setExecute] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const timerId = useRef<number | null>(null);
  const trpc = api.useUtils();

  const { mutate: FinishTryOut } = api.tryoutSession.finishSession.useMutation({
    onSuccess() {
      toaster({
        title: 'Sukses',
        description: 'Waktumu sudah habis!',
        condition: 'success',
        duration: 2000,
      });
      trpc.tryout.getTryoutById.refetch();
      localStorage.removeItem(`sessionAnswer-${sessionId}`);
      window.location.reload();
      // Navigasi ulang tanpa reload penuh
      // router.replace(router.asPath);
    },
    onError(error) {
      if (error.message.includes('Session already finished. Skipping...')) {
        console.log('Double submission skipped, no toast');
        return;
      }

      toaster({
        title: 'Upss!',
        description: 'Gagal submit tryout, coba lagi!',
        condition: 'warning',
        duration: 2000,
      });
      setHasSubmitted(false); // Reset agar user bisa mencoba lagi
    },
  });

  // Mulai timer
  useEffect(() => {
    timerId.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerId.current) clearInterval(timerId.current);
          setExecute(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, []);

  // Jika waktu habis dan belum pernah submit, langsung submit
  useEffect(() => {
    if (execute && !hasSubmitted) {
      setHasSubmitted(true);
      FinishTryOut({ sessionId, answer: sessionAnswer });
    }
  }, [execute, hasSubmitted, FinishTryOut, sessionAnswer, sessionId]);

  return <span>{timeFormat(countdown)}</span>;
}
