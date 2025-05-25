'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { mutateGeneral } from '@/lib/fetch-helper';
import { useEffect, useState } from 'react';

interface SessionAnswer {
  number: number;
  questionId: string;
  answerId: string | null;
  answer: string;
  type: string;
  notSure: boolean;
}

const SubmitTryout = ({
  sessionAnswer,
  sessionId,
}: {
  sessionAnswer: SessionAnswer[];
  sessionId: string;
}) => {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const unAnswered = sessionAnswer?.filter((item) => item.answer === '');
  const notSure = sessionAnswer?.filter((item) => item.notSure === true);

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // const trpc = api.useUtils();
  // const { mutate: FinishTryOut } = api.tryoutSession.finishSession.useMutation({
  //   onSuccess() {
  //     trpc.tryout.getTryoutById.refetch();
  //     localStorage.removeItem(`sessionAnswer-${sessionId}`);
  //     toaster({
  //       title: "Success",
  //       description: "Tryout berhasil di submit",
  //       condition: "success",
  //       duration: 2000,
  //     });
  //     setLoading(false);
  //     setHasSubmitted(false);
  //     setOpen(false);
  //     window.location.reload();
  //   },
  //   onError(error) {
  //     if (error.message.includes("Session already finished. Skipping...")) {
  //       setOpen(false);
  //       return;
  //     }

  //     toaster({
  //       title: "Upss!",
  //       description: "Error, coba lagi!",
  //       condition: "warning",
  //       duration: 2000,
  //     });
  //     setLoading(false);
  //     setHasSubmitted(false);
  //   },
  // });

  const FinishTryOut = async (payload: {
    userId: string;
    sessionId: string;
    answer: any[];
  }) => {
    await mutateGeneral('/tryoutSession/finishSession', {
      payload,
      type: 'post',
      toast: {
        successMsg: 'Tryout berhasil di submit',
        errorMsg: 'Gagal submit tryout, coba lagi!',
      },
      onSuccess() {
        //       trpc.tryout.getTryoutById.refetch();
        localStorage.removeItem(`sessionAnswer-${sessionId}`);
        window.location.reload();
        setLoading(false);
        setHasSubmitted(false);
        setOpen(false);
      },
      onError() {
        setLoading(false);
        setHasSubmitted(false);
      },
    });
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
      }, 500);
    }
  }, [open]);

  const handleSubmit = () => {
    if (loading || hasSubmitted) return;

    setLoading(true);
    setHasSubmitted(true);
    FinishTryOut({
      sessionId,
      answer: sessionAnswer,
      userId: session?.user.id || '',
    });
  };

  return (
    <div className="flex w-full items-center justify-center text-sm md:justify-center">
      <Dialog
        open={loading ? true : open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <button
            className="rounded-xl bg-main-default px-4 py-3 text-white duration-300 active:bg-main-default hover:bg-main-default/85"
            disabled={loading || hasSubmitted}
          >
            Kumpulkan
          </button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[390px]">
          {step === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-base font-medium">
                  Selesaikan Tryout ini?
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 text-base text-main-gray-text">
                {unAnswered?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p>Soal yang kamu kosongkan :</p>
                    <div className="flex flex-wrap items-center gap-1 text-main-gray-text">
                      {unAnswered.map((item, i) => (
                        <p key={i}>
                          {item.number}
                          {i !== unAnswered.length - 1 && ','}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {notSure?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p>Soal yang belum yakin :</p>
                    <div className="flex flex-wrap items-center gap-1 text-yellow-500">
                      {notSure.map((item, i) => (
                        <p key={i}>
                          {item.number}
                          {i !== notSure.length - 1 && ','}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {loading ? (
                  <div className="flex h-12 w-full items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex h-12 items-center gap-4 text-sm">
                    <button
                      className="h-full w-full rounded-xl bg-transparent text-main-gray-disabled duration-300 md:hover:text-main-gray-text"
                      onClick={() => setOpen(false)}
                    >
                      Kembali
                    </button>
                    <button
                      className={`h-full w-full rounded-xl bg-main-default text-white duration-300 active:bg-main-default hover:bg-main-default/85 ${
                        hasSubmitted ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      onClick={() => {
                        if (notSure.length > 0) setStep(2);
                        else handleSubmit();
                      }}
                      disabled={hasSubmitted}
                    >
                      Kumpulkan
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : step === 2 ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-base font-medium">
                  Kumpulkan jawaban?
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 text-base text-main-gray-text">
                {notSure?.length > 0 && (
                  <div className="flex flex-col gap-2 text-center">
                    <p>
                      Kamu belum yakin dengan jawaban berikut. Apakah tetap
                      ingin melanjutkan?
                    </p>
                    <div className="my-4 flex items-center justify-center gap-1 text-yellow-500">
                      {notSure.map((item, i) => (
                        <p key={i}>
                          {item.number}
                          {i !== notSure.length - 1 && ','}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <button
                    className="w-full rounded-xl bg-transparent py-3 text-main-gray-disabled duration-300 md:hover:text-main-gray-text"
                    onClick={() => setOpen(false)}
                  >
                    Kembali
                  </button>
                  <button
                    className={`w-full rounded-xl bg-main-default py-3 text-white duration-300 active:bg-main-default ${
                      hasSubmitted ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    onClick={handleSubmit}
                    disabled={hasSubmitted}
                  >
                    Kumpulkan
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmitTryout;
