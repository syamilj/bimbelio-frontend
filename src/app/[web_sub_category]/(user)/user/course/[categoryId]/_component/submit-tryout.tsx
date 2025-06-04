//src/components/workspace-course/_component/submit-tryout.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SubmitTryout = ({
  sessionAnswer,
  sessionId,
  subCourseId,
}: {
  sessionAnswer: any;
  sessionId: string;
  subCourseId: string;
}) => {
  // const { query } = useRouter();
  const searchParams = useSearchParams();
  const sub = searchParams?.get('sub');

  const [open, setOpen] = useState(false);
  // const answered = sessionAnswer?.filter((item: any) => item.answer !== "")
  const unAnswered = sessionAnswer?.filter((item: any) => item.answer === '');
  const notSure = sessionAnswer?.filter((item: any) => item.notSure === true);

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // const trpc = api.useUtils();
  // const { mutate: FinishTryOut } = api.course.finishTryoutCourse.useMutation({
  //   onSuccess() {
  //     // setOpen(false)
  //     trpc.course.getCourseUserByCategoryId.refetch();
  //     // toast({
  //     //     variant: "success",
  //     //     title: 'Success',
  //     // });
  //     localStorage.removeItem(`tryout-sub-chapter-${sub}`);
  //     toaster({
  //       title: 'Success',
  //       description: 'Tryout berhasil di submit',
  //       condition: 'success',
  //       duration: 2000,
  //     });
  //     window.location.reload();
  //   },
  //   onError() {
  //     // toast({
  //     //     variant: "destructive",
  //     //     title: 'Error',
  //     // });
  //     setLoading(false);
  //     toaster({
  //       title: 'Upss!',
  //       description: 'Error, coba lagi!',
  //       condition: 'warning',
  //       duration: 2000,
  //     });
  //   },
  // });

  const { mutate: FinishTryOut } = useMutation(
    '/course/finishTryoutCourse',
    'post',
    {
      onSuccess() {
        // trpc.course.getCourseUserByCategoryId.refetch();
        localStorage.removeItem(`tryout-sub-chapter-${sub}`);
        window.location.reload();
      },
      onError() {
        setLoading(false);
      },
    },
  );

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
      }, 500);
    }
  }, [open]);

  return (
    <div className="flex w-full items-center justify-start text-[.9rem] md:justify-end">
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <button className="rounded-[.8rem] bg-main px-[1rem] py-[.8rem] text-white duration-300 active:bg-main md:hover:bg-main-hover">
            Submit Jawaban
          </button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[390px]">
          {step === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-[1rem] font-medium">
                  Selesaikan Tryout ini?
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-[1rem] text-[1rem] text-main-gray-text">
                {unAnswered?.length > 0 && (
                  <div className="flex flex-col gap-[.5rem]">
                    <p>Soal yang kamu kosongkan :</p>
                    <div className="flex flex-wrap items-center gap-[.2rem] text-main-gray-text">
                      {unAnswered?.map((item: any, i: number) => (
                        <p key={i}>
                          {item?.number}
                          {i !== unAnswered?.length - 1 && ','}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {/* {notSure?.length > 0 && (
                                    <div className="flex flex-col gap-[.5rem]">
                                        <p>Soal yang belum yakin :</p>
                                        <div className="flex gap-[.2rem] items-center text-yellow-500 flex-wrap">
                                            {notSure?.map((item: any, i: number) =>
                                                <p key={i}>{item?.number}{i !== notSure?.length - 1 && ","}</p>
                                            )}
                                        </div>
                                    </div>
                                )} */}
                {loading ? (
                  <div className="flex h-[48px] w-full items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex h-[48px] items-center gap-[1rem] text-[.9rem]">
                    <button
                      className="h-full w-full rounded-[.8rem] bg-transparent text-main-gray-disabled duration-300 md:hover:text-main-gray-text"
                      onClick={() => setOpen(false)}
                    >
                      Kembali
                    </button>
                    <button
                      className="h-full w-full rounded-[.8rem] bg-main text-white duration-300 active:bg-main md:hover:bg-main-hover"
                      onClick={() => {
                        if (notSure.length > 0) setStep(2);
                        else {
                          setLoading(true);
                          FinishTryOut({
                            payload: {
                              sessionId: sessionId,
                              answer: sessionAnswer,
                              subCourseId,
                            },
                          });
                        }
                      }}
                    >
                      Kumpulkan
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : step == 2 ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-[1rem] font-medium">
                  Submit jawaban?
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-[1rem] text-[1rem] text-main-gray-text">
                {notSure?.length > 0 && (
                  <div className="flex flex-col gap-[.5rem] text-center">
                    <p>
                      Kamu belum yakin dengan jawaban berikut. Apakah tetap
                      ingin melanjutkan?
                    </p>
                    <div className="my-[1rem] flex items-center justify-center gap-[.2rem] text-yellow-500">
                      {notSure?.map((item: any, i: number) => (
                        <p key={i}>
                          {item?.number}
                          {i !== notSure?.length - 1 && ','}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-[1rem] text-[.9rem]">
                  <button
                    className="w-full rounded-[.8rem] bg-transparent py-[.8rem] text-main-gray-disabled duration-300 md:hover:text-main-gray-text"
                    onClick={() => setOpen(false)}
                  >
                    Kembali
                  </button>
                  <button className="w-full cursor-default rounded-[.8rem] bg-main-gray-input py-[.8rem] text-main-gray-disabled">
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
