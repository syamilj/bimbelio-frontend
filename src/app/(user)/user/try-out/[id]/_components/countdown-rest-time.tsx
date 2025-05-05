import { useSession } from '@/components/provider/session-provider-auth';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper';
import { useEffect, useRef, useState } from 'react';

const timeFormat = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`;
};

export default function CountDownRestTime({
  seconds,
  sessionId,
}: {
  seconds: number;
  sessionId: string;
}) {
  const { data: session } = useSession();

  const [countdown, setCountdown] = useState<number>(seconds);
  const [execute, setExecute] = useState<boolean>(false);
  const timerId = useRef<any>(null);

  // const trpc = api.useUtils();

  // const { mutate: createTryoutSessionParticipant } =
  //   api.tryoutSession.createTryoutSessionParticipant.useMutation({
  //     onSuccess() {
  //       trpc.tryout.getTryoutById.refetch();
  //     },
  //     onError() {
  //       // toast({
  //       //     variant: "destructive",
  //       //     title: 'Error',
  //       // });
  //       toaster({
  //         title: "Upss!",
  //         description: "Error",
  //         condition: "warning",
  //         duration: 2000,
  //       });
  //     },
  //   });

  const createTryoutSessionParticipant = async (payload: {
    sessionId: string;
    userId: string;
  }) => {
    await mutateGeneral('/tryoutSession/createTryoutSessionParticipant', {
      payload,
      type: 'post',
      toast: { errorMsg: 'Error' },
      onSuccess() {
        //       trpc.tryout.getTryoutById.refetch();
        window.location.reload();
      },
    });
  };

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
      createTryoutSessionParticipant({
        sessionId: sessionId,
        userId: session?.user.id || '',
      });
    }
  }, [execute]);

  return timeFormat(countdown);
}
