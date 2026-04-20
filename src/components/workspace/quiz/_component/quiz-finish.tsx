import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { IconX } from '@/styles/icon';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useProvider } from '../provider';

const QuizFinish = ({
  finish,
  setFinish,
  number,
  accuracy,
  setShowResult,
}: {
  finish: any;
  setFinish: any;
  number: any;
  accuracy: number;
  setShowResult: any;
}) => {
  const {
    useQuiz: { QuizRefetch },
  } = useProvider();
  const { setShowSidebar } = useAppContext();
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const documentId = `${
    pathnameArray && pathnameArray[pathnameArray?.length - 1]
  }`;
  // const limitation = api.user.limitation.useMutation();

  const { checkLimitation } = useUserLimitation();

  // const deleteQuiz = api.quiz.deleteQuiz.useMutation();

  const { mutate: deleteQuiz } = useMutation('/quiz/deleteQuiz', 'delete');

  // const saveResult = api.quiz.saveResult.useMutation();

  const { mutate: saveResult } = useMutation('/quiz/saveResult', 'post');

  const [step, setStep] = useState<number>(1);
  const [type, setType] = useState<string>('');
  const [pages, setPages] = useState<{ first: number; last: number }>({
    first: 0,
    last: 0,
  });

  const [warn, setWarn] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // const trpc = api.useUtils();

  // const { mutate: generateQuiz } = api.quiz.generateQuiz.useMutation({
  //   onSettled: async () => {
  //     trpc.quiz.getQuiz.refetch();
  //     setFinish(() => ({ done: false, show: false }));
  //     setShowSidebar(true);
  //   },
  //   onSuccess: async () => {
  //     toaster({
  //       title: 'Sukses',
  //       condition: 'success',
  //       duration: 3000,
  //     });
  //     trpc.quiz.getQuiz.refetch();
  //     setLoading(false);
  //   },
  //   onError: (err: any) => {
  //     setShowSidebar(true);
  //     setLoading(false);
  //     toaster({
  //       title: 'Uh-oh',
  //       description: err?.message ?? 'Terjadi kesalahan!',
  //       condition: 'warning',
  //       duration: 3000,
  //     });
  //   },
  // });

  const { mutate: generateQuiz } = useMutation('/quiz/generateQuiz', 'post', {
    onSuccess() {
      // trpc.quiz.getQuiz.refetch();
      QuizRefetch();
      setFinish(() => ({ done: false, show: false }));
      setShowSidebar(true);
      setLoading(false);
    },
    onError() {
      setShowSidebar(true);
      setLoading(false);
    },
  });

  // const { mutate: generateQuizObjective } =
  //   api.quiz.generateQuizObjective.useMutation({
  //     onSettled: async () => {
  //       trpc.quiz.getQuiz.refetch();
  //       setFinish(() => ({ done: false, show: false }));
  //       setShowSidebar(true);
  //     },
  //     onSuccess: async () => {
  //       toaster({
  //         title: 'Sukses',
  //         condition: 'success',
  //         duration: 3000,
  //       });
  //       trpc.quiz.getQuiz.refetch();
  //       setLoading(false);
  //     },
  //     onError: (err: any) => {
  //       setShowSidebar(true);
  //       setLoading(false);
  //       toaster({
  //         title: 'Uh-oh',
  //         description: err?.message ?? 'Terjadi kesalahan!',
  //         condition: 'warning',
  //         duration: 3000,
  //       });
  //     },
  //   });

  const { mutate: generateQuizObjective } = useMutation(
    '/quiz/generateQuizObjective',
    'post',
    {
      onSuccess() {
        //       trpc.quiz.getQuiz.refetch();
        QuizRefetch();
        setFinish(() => ({ done: false, show: false }));
        setShowSidebar(true);
        setLoading(false);
      },
      onError() {
        setShowSidebar(true);
        setLoading(false);
      },
    },
  );

  const handleGenerateNewQuiz = async (type: string) => {
    try {
      setLoading(true);
      const data = await checkLimitation({
        quiz: true,
      });
      if (data && !data.status) {
        toaster({
          title: 'Uppss',
          condition: 'warning',
          description: data.message,
          duration: 5000,
        });
        setLoading(false);
        return;
      } else if (data && data.status) {
        if (type === 'objective') {
          await deleteQuiz();
          await saveResult({ payload: { accuracy: accuracy } });
          generateQuizObjective({
            payload: {
              documentId,
              firstPage: pages.first,
              lastPage: pages.last,
            },
          });
          setShowResult(false);
          setStep(1);
        } else if (type === 'essay') {
          await deleteQuiz();
          await saveResult({ payload: { accuracy: accuracy } });
          generateQuiz({
            payload: {
              documentId,
              firstPage: pages.first,
              lastPage: pages.last,
            },
          });
          setShowResult(false);
          setStep(1);
        }
      }
    } catch (error) {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Coba lagi nanti!',
      });
      setLoading(false);
      return;
    }
  };

  if (loading) {
    return (
      <div className="fixed left-0 top-0 z-[9999999999] flex h-full w-full items-center justify-center bg-[#00000077]">
        <div className="flex flex-col items-center gap-[.5rem]">
          <Spinner />
          <p className="font-semibold">Generating Quiz...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {finish.show && finish.done ? (
        <div className="fixed left-0 top-0 z-[9999999999] flex h-full w-full items-center justify-center bg-[#00000077]">
          {step === 1 ? (
            <div className="flex flex-col gap-[1rem] rounded-3xl bg-white p-[2rem] text-center">
              <p>
                Kamu telah menyelesaikan seluruh soal. <br />
                Apakah kamu ingin buat quiz baru?
              </p>
              <div className="flex items-center gap-[1rem]">
                <button className="w-full cursor-default rounded-3xl bg-transparent py-[.7rem] text-main-gray-text hover:text-gray-800">
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      setFinish({ show: false, done: false });
                      setShowSidebar(true);
                      setStep(1);
                    }}
                  >
                    Batalkan
                  </p>
                </button>
                <button
                  className="w-full rounded-3xl bg-main py-[.7rem] text-white duration-200 hover:bg-main-hover active:bg-main"
                  onClick={() => {
                    setStep(2);
                  }}
                >
                  Buat baru
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="relative flex flex-col gap-[1rem] rounded-3xl bg-white p-[2rem] text-center">
              <div
                className="absolute right-4 top-3 cursor-pointer text-main-gray-text md:hover:text-main-gray-text2"
                onClick={() => {
                  setFinish({ show: false, done: false });
                  setShowSidebar(true);
                  setStep(1);
                }}
              >
                <IconX />
              </div>
              <p>Pilih jenis Quiz yang ingin di kerjakan</p>
              <div className="flex items-center gap-[1rem]">
                <button
                  className="w-full rounded-3xl bg-main px-[1rem] py-[.7rem] text-white duration-200 hover:bg-main-hover active:bg-main"
                  onClick={() => {
                    // handleGenerateNewQuiz('essay');
                    setStep(3);
                    setType('essay');
                  }}
                >
                  Essay
                </button>
                <button
                  className="w-full rounded-3xl bg-main px-[1rem] py-[.7rem] text-white duration-200 hover:bg-main-hover active:bg-main"
                  onClick={() => {
                    // handleGenerateNewQuiz('objective');
                    setStep(3);
                    setType('objective');
                  }}
                >
                  Objective
                </button>
              </div>
            </div>
          ) : step === 3 ? (
            <div className="relative flex flex-col gap-[1rem] rounded-3xl bg-white p-[2rem] text-center">
              <div
                className="absolute right-4 top-3 cursor-pointer text-main-gray-text md:hover:text-main-gray-text2"
                onClick={() => {
                  setFinish({ show: false, done: false });
                  setShowSidebar(true);
                  setStep(1);
                }}
              >
                <IconX />
              </div>
              <p>
                <span className="text-main">Halaman berapa saja</span> <br />
                yang ingin kamu jadikan quiz{' '}
                <span className="text-main">
                  {type === 'objective' ? 'Pilihan ganda' : 'Essay'}
                </span>
                ?
              </p>
              <div className="flex w-full flex-col items-center gap-[1rem]">
                <div className="relative flex w-full flex-col items-start gap-[.5rem]">
                  <p>Halaman awal</p>
                  <input
                    type="number"
                    className="h-[50px] w-full rounded-3xl border border-main-gray-input px-[1rem] text-[.9rem] outline-none duration-300 focus:shadow-cardSoft"
                    required
                    placeholder="1.."
                    onChange={(e) => {
                      if (parseInt(e.target.value) > 0)
                        setPages((prev) => ({
                          ...prev,
                          first: parseInt(e.target.value),
                        }));
                    }}
                  />
                  <div className="absolute left-[0] top-[100%] text-[.8rem] text-red-600">
                    {warn}
                  </div>
                </div>
                <div className="mt-[.5rem] flex w-full flex-col items-start gap-[.5rem]">
                  <p>Halaman akhir</p>
                  <input
                    type="number"
                    className="h-[50px] w-full rounded-3xl border border-main-gray-input px-[1rem] text-[.9rem] outline-none duration-300 focus:shadow-cardSoft"
                    required
                    placeholder="3.."
                    onChange={(e) => {
                      if (parseInt(e.target.value) > 0)
                        setPages((prev) => ({
                          ...prev,
                          last: parseInt(e.target.value),
                        }));
                    }}
                  />
                </div>
                <div className="flex h-full w-full items-center justify-center">
                  <button
                    className="w-full rounded-3xl bg-main py-[.6rem] text-white duration-300 md:hover:bg-main-hover"
                    onClick={() => {
                      if (pages.first > pages.last) {
                        setWarn('Tidak dapat lebih besar dari halaman akhir');
                        return;
                      }
                      if (pages.last - pages.first > 2) {
                        setWarn('Maksimal 3 halaman');
                        return;
                      } else {
                        setWarn('');
                        if (step === 3 && type === 'objective') {
                          handleGenerateNewQuiz('objective');
                        } else if (step === 3 && type === 'essay') {
                          handleGenerateNewQuiz('essay');
                        }
                      }
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : finish.show && !finish.done ? (
        <div className="fixed left-0 top-0 z-[9999999999] flex h-full w-full items-center justify-center bg-[#00000077]">
          {step === 1 ? (
            <div className="flex flex-col gap-[1rem] rounded-3xl bg-white p-[2rem]">
              <div className="flex flex-col gap-[1rem] text-center">
                <p>
                  Kamu belum menyelesaikan seluruh soal <br /> quiz berikut:
                </p>
                <p className="text-main">
                  {number?.map((item: any, i: number) => (
                    <span key={i}>
                      {item.number}
                      {i + 1 !== number.length && ','}
                    </span>
                  ))}
                </p>
                <p className="text-main-gray-text2">Tetap buat quiz baru?</p>
              </div>
              <div className="flex items-center gap-[1rem]">
                <button className="w-full cursor-default rounded-3xl bg-transparent py-[.7rem] text-main-gray-text hover:text-gray-800">
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      setStep(2);
                    }}
                  >
                    Buat baru
                  </p>
                </button>
                <button
                  className="w-full rounded-3xl bg-main py-[.7rem] text-white duration-200 hover:bg-main-hover active:bg-main"
                  onClick={() => {
                    setFinish({ show: false, done: false });
                    setShowSidebar(true);
                    setStep(1);
                  }}
                >
                  Kembali
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="relative flex flex-col gap-[1rem] rounded-3xl bg-white p-[2rem] text-center">
              <div
                className="absolute right-4 top-3 cursor-pointer text-main-gray-text md:hover:text-main-gray-text2"
                onClick={() => {
                  setFinish({ show: false, done: false });
                  setShowSidebar(true);
                  setStep(1);
                }}
              >
                <IconX />
              </div>
              <p>Pilih jenis Quiz yang ingin di kerjakan</p>
              <div className="flex items-center gap-[1rem]">
                <button
                  className="w-full rounded-3xl bg-main px-[1rem] py-[.7rem] text-white duration-200 hover:bg-main-hover active:bg-main"
                  onClick={() => {
                    // handleGenerateNewQuiz('essay');
                    setStep(3);
                    setType('essay');
                  }}
                >
                  Essay
                </button>
                <button
                  className="w-full rounded-3xl bg-main px-[1rem] py-[.7rem] text-white duration-200 hover:bg-main-hover active:bg-main"
                  onClick={() => {
                    // handleGenerateNewQuiz('objective');
                    setStep(3);
                    setType('objective');
                  }}
                >
                  Objective
                </button>
              </div>
            </div>
          ) : step === 3 ? (
            <div className="relative flex flex-col gap-[1rem] rounded-3xl bg-white p-[2rem] text-center">
              <div
                className="absolute right-4 top-3 cursor-pointer text-main-gray-text md:hover:text-main-gray-text2"
                onClick={() => {
                  setFinish({ show: false, done: false });
                  setShowSidebar(true);
                  setStep(1);
                }}
              >
                <IconX />
              </div>
              <p>
                <span className="text-main">Halaman berapa saja</span> <br />
                yang ingin kamu jadikan quiz{' '}
                <span className="text-main">
                  {type === 'objective' ? 'Pilihan ganda' : 'Essay'}
                </span>
                ?
              </p>
              <div className="flex w-full flex-col items-center gap-[1rem]">
                <div className="relative flex w-full flex-col items-start gap-[.5rem]">
                  <p>Halaman awal</p>
                  <input
                    type="number"
                    className="h-[50px] w-full rounded-3xl border border-main-gray-input px-[1rem] text-[.9rem] outline-none duration-300 focus:shadow-cardSoft"
                    required
                    placeholder="1.."
                    onChange={(e) => {
                      if (parseInt(e.target.value) > 0)
                        setPages((prev) => ({
                          ...prev,
                          first: parseInt(e.target.value),
                        }));
                    }}
                  />
                  <div className="absolute left-[0] top-[100%] text-[.8rem] text-red-600">
                    {warn}
                  </div>
                </div>
                <div className="mt-[.5rem] flex w-full flex-col items-start gap-[.5rem]">
                  <p>Halaman akhir</p>
                  <input
                    type="number"
                    className="h-[50px] w-full rounded-3xl border border-main-gray-input px-[1rem] text-[.9rem] outline-none duration-300 focus:shadow-cardSoft"
                    required
                    placeholder="3.."
                    onChange={(e) => {
                      if (parseInt(e.target.value) > 0)
                        setPages((prev) => ({
                          ...prev,
                          last: parseInt(e.target.value),
                        }));
                    }}
                  />
                </div>
                <div className="flex h-full w-full items-center justify-center">
                  <button
                    className="w-full rounded-3xl bg-main py-[.6rem] text-white duration-300 md:hover:bg-main-hover"
                    onClick={() => {
                      if (pages.first > pages.last) {
                        setWarn('Tidak dapat lebih besar dari halaman akhir');
                        return;
                      }
                      if (pages.last - pages.first > 2) {
                        setWarn('Maksimal 3 halaman');
                        return;
                      } else {
                        setWarn('');
                        if (step === 3 && type === 'objective') {
                          handleGenerateNewQuiz('objective');
                        } else if (step === 3 && type === 'essay') {
                          handleGenerateNewQuiz('essay');
                        }
                      }
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default QuizFinish;
