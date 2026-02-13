import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import {
  IconEssay,
  IconObjective,
  IconTailedArrowNext,
  IconTailedArrowPrev,
} from '@/styles/icon';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useProvider } from '../provider';

export default function Start() {
  const {
    useQuiz: { Quiz, QuizRefetch },
  } = useProvider();
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const documentId = `${pathnameArray && pathnameArray[pathnameArray?.length - 1]}`;

  const { data: session } = useSession();

  // const limitation = api.user.limitation.useMutation();

  const { userLimitation, checkLimitation } = useUserLimitation();

  // const { mutate: generateQuiz, isPending: isGeneratingQuiz } =
  //   api.quiz.generateQuiz.useMutation();

  const { mutate: generateQuiz, isLoading: isGeneratingQuiz } = useMutation(
    '/quiz/generateQuiz',
    'post',
    {
      onSuccess: () => {
        // trpc.quiz.getQuiz.refetch();
        QuizRefetch();
      },
      onError: () => {
        setLoading(false);
      },
    },
  );

  // const {
  //   mutate: generateQuizObjective,
  //   isPending: isGeneratingQuizObjective,
  // } = api.quiz.generateQuizObjective.useMutation();

  const {
    mutate: generateQuizObjective,
    isLoading: isGeneratingQuizObjective,
  } = useMutation('/quiz/generateQuizObjective', 'post', {
    onSuccess: () => {
      // trpc.quiz.getQuiz.refetch();
      QuizRefetch();
    },
    onError: () => {
      setLoading(false);
    },
  });

  const [step, setStep] = useState<{ number: number; type: string | null }>({
    number: 1,
    type: null,
  });

  const [pages, setPages] = useState<{ first: number; last: number }>({
    first: 0,
    last: 0,
  });

  const [warn, setWarn] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generateEssay = async () => {
    setLoading(true);
    if (!isGeneratingQuiz && !isGeneratingQuizObjective) {
      try {
        const data = await checkLimitation({ quiz: true });
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
          generateQuiz({
            payload: {
              documentId,
              firstPage: pages.first,
              lastPage: pages.last,
            },
          });
        }
      } catch (error) {
        toaster({
          title: 'Gagal',
          condition: 'warning',
          description: 'Coba lagi nanti!',
        });
        return;
      }
    }
  };

  const generateObjective = async () => {
    setLoading(true);
    if (!isGeneratingQuizObjective && !isGeneratingQuiz) {
      try {
        const data = await checkLimitation({ quiz: true });
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
          generateQuizObjective({
            payload: {
              documentId,
              firstPage: pages.first,
              lastPage: pages.last,
            },
          });
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
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-full max-w-[800px] flex-col items-center justify-center gap-[2rem] px-[2rem]">
        <h1 className="font-regular w-full text-[24px] text-main-gray-text">
          {step.number === 1 ? (
            <>
              <span className="text-main">Halo, {session?.user.name}</span>{' '}
              <br />
              Tipe soal apa yang ingin kamu kerjakan?
            </>
          ) : (
            <>
              <div
                className="mb-[1rem] w-fit cursor-pointer text-main-gray-text duration-300 md:hover:-translate-x-2"
                onClick={() => {
                  if (!loading) setStep({ number: 1, type: null });
                }}
              >
                <IconTailedArrowPrev />
              </div>
              <span className="text-main">Halaman berapa saja</span> <br />
              yang ingin kamu jadikan quiz{' '}
              <span className="text-main">
                {step.type === 'objective' ? 'Pilihan ganda' : 'Essay'}
              </span>
              ?
            </>
          )}
        </h1>
        {step.number === 1 ? (
          <div className="grid w-full grid-cols-2 gap-[1rem] font-medium text-main-gray-text">
            <div
              className={`flex items-center gap-[.5rem] rounded-3xl bg-white p-[1.5rem] duration-200 ${!isGeneratingQuizObjective && !isGeneratingQuiz && 'cursor-pointer hover:shadow-xl'}`}
              onClick={() => {
                // generateObjective();
                setStep({ number: 2, type: 'objective' });
              }}
            >
              {isGeneratingQuizObjective ? (
                <div className="flex w-full justify-center text-main">
                  <Spinner />
                </div>
              ) : (
                <>
                  <IconObjective className="text-main" />
                  <p>Pilihan ganda</p>
                </>
              )}
            </div>
            <div
              className={`flex items-center gap-[.5rem] rounded-3xl bg-white p-[1.5rem] duration-200 ${!isGeneratingQuiz && !isGeneratingQuizObjective && 'cursor-pointer hover:shadow-xl'}`}
              onClick={() => {
                // generateEssay();
                setStep({ number: 2, type: 'essay' });
              }}
            >
              {isGeneratingQuiz ? (
                <div className="flex w-full justify-center text-main">
                  <Spinner />
                </div>
              ) : (
                <>
                  <IconEssay className="text-main" />
                  <p>Soal Essay</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <form
            className={cn(
              'flex w-full items-center justify-start gap-[.5rem]',
              loading && 'h-[82px] justify-center',
            )}
            onSubmit={(e) => {
              e.preventDefault();
              if (pages.first > pages.last) {
                setWarn('Tidak dapat lebih besar dari halaman akhir');
                return;
              }
              if (pages.last - pages.first > 2) {
                setWarn('Maksimal 3 halaman');
                return;
              } else {
                setWarn('');
                if (step.number === 2 && step.type === 'objective') {
                  generateObjective();
                } else if (step.number === 2 && step.type === 'essay') {
                  generateEssay();
                }
              }
            }}
          >
            {!loading ? (
              <>
                <div className="flex shrink items-center gap-[.5rem]">
                  <div className="relative flex flex-col gap-[.5rem]">
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
                    <div className="absolute top-[100%] mt-[.5rem] w-full text-[.9rem] text-red-600">
                      {warn}
                    </div>
                  </div>
                  <div className="mt-[1.8rem] h-[2px] w-[1rem] bg-main-gray-text" />
                  <div className="flex flex-col gap-[.5rem]">
                    <p>Halaman akhir</p>
                    <input
                      type="number"
                      className="h-[50px] w-full rounded-3xl border border-main-gray-input px-[1rem] text-[.9rem] outline-none duration-300 focus:shadow-cardSoft"
                      required
                      placeholder="1.."
                      onChange={(e) => {
                        if (parseInt(e.target.value) > 0)
                          setPages((prev) => ({
                            ...prev,
                            last: parseInt(e.target.value),
                          }));
                      }}
                    />
                  </div>
                </div>
                <div className="ml-[.5rem] flex h-full shrink-0 items-end">
                  <button className="h-[50px] rounded-3xl bg-main px-[1rem] text-white duration-300 md:hover:bg-main-hover">
                    <IconTailedArrowNext w={15} />
                  </button>
                </div>
              </>
            ) : (
              <Spinner />
            )}
          </form>
        )}
        .
      </div>
    </div>
  );
}
