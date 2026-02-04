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

  const answered =
    sessionAnswer?.filter((item: any) => item.answer !== '').length || 0;
  const totalQuestions = sessionAnswer?.length || 0;
  const progressPercentage =
    totalQuestions > 0 ? (answered / totalQuestions) * 100 : 0;

  return (
    <div className="flex w-full items-center justify-start text-[.9rem] md:justify-end">
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <button className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-101">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Submit Jawaban
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="w-full mb:max-w-[450px] p-0 gap-0 overflow-hidden">
          {step === 1 ? (
            <>
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-white mb-2">
                      Selesaikan Tryout?
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-center text-white/90 text-sm">
                    Pastikan kamu sudah memeriksa semua jawabanmu
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Progress Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-200">
                    <p className="text-xs font-semibold text-green-700 mb-1">
                      Terjawab
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {answered}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border border-orange-200">
                    <p className="text-xs font-semibold text-orange-700 mb-1">
                      Belum Dijawab
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {totalQuestions - answered}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="font-bold text-blue-600">
                      {progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Unanswered Questions Warning */}
                {unAnswered?.length > 0 && (
                  <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-3xl">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-orange-800 mb-2">
                          Soal yang belum dijawab:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {unAnswered?.map((item: any, i: number) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2.5 py-1 rounded-3xl bg-white border border-orange-300 text-orange-700 text-sm font-medium"
                            >
                              #{item?.number}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {loading ? (
                  <div className="flex h-14 w-full items-center justify-center bg-gray-50 rounded-3xl">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      className="flex-1 h-12 rounded-3xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                      onClick={() => setOpen(false)}
                    >
                      Kembali
                    </button>
                    <button
                      className="flex-1 h-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
              {/* Header */}
              <div className="relative bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-white mb-2">
                      Konfirmasi Submit
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-center text-white/90 text-sm">
                    Ada beberapa jawaban yang belum kamu yakini
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {notSure?.length > 0 && (
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-3xl">
                    <p className="text-center text-gray-700 mb-4">
                      Kamu belum yakin dengan jawaban berikut. Apakah tetap
                      ingin melanjutkan?
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {notSure?.map((item: any, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1.5 rounded-3xl bg-yellow-200 border border-yellow-400 text-yellow-800 text-sm font-semibold"
                        >
                          #{item?.number}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    className="flex-1 h-12 rounded-3xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                    onClick={() => setOpen(false)}
                  >
                    Kembali
                  </button>
                  <button
                    className="flex-1 h-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => {
                      setLoading(true);
                      FinishTryOut({
                        payload: {
                          sessionId: sessionId,
                          answer: sessionAnswer,
                          subCourseId,
                        },
                      });
                    }}
                  >
                    Yakin, Kumpulkan
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
