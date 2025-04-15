import { toaster } from '@/components/ui/toaster';
import { api } from '@/trpc/react';
import { useEffect, useRef, useState } from 'react';

const timeFormat = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function CountDownRestTime({
  seconds,
  sessionId,
}: {
  seconds: number;
  sessionId: string;
}) {
  const [countdown, setCountdown] = useState<number>(seconds);
  const [execute, setExecute] = useState<boolean>(false);
  const timerId = useRef<any>(null);

  const trpc = api.useUtils();

  const { mutate: createTryoutSessionParticipant } =
    api.tryoutSession.createTryoutSessionParticipant.useMutation({
      onSuccess() {
        trpc.tryout.getTryoutById.refetch();
      },
      onError() {
        // toast({
        //     variant: "destructive",
        //     title: 'Error',
        // });
        toaster({
          title: 'Upss!',
          description: 'Error',
          condition: 'warning',
          duration: 2000,
        });
      },
    });

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCountdown((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    // localStorage.setItem(`${sessionId}-countdownRestTime`, `${countdown}`)
    if (countdown <= 0) {
      clearInterval(timerId.current);
      // toast({
      //     variant: "destructive",
      //     title: 'Waktu istirahat telah selesai!!',
      // });
      toaster({
        title: 'Upss!',
        description: 'Waktu istirahat telah selesai!!',
        condition: 'warning',
        duration: 2000,
      });
      setExecute(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (execute) {
      createTryoutSessionParticipant({ sessionId: sessionId });
    }
  }, [execute]);

  return timeFormat(countdown);
}
