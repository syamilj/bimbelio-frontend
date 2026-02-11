import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { cn } from '@/lib/utils';
import {
  IconCheckList,
  IconCircleReused,
  IconLeft,
  IconRight,
  IconTailedArrowNext,
  IconTailedArrowPrev,
} from '@/styles/icon';
import { useCompletion } from '@ai-sdk/react';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useProvider } from '../provider';
import IndividualQuizQuestion from './individual-quiz-question';
import IndividualQuizReport from './individual-quiz-report';
import QuizFinish from './quiz-finish';
import Result from './result';

interface QuizAttemptType {
  userResponse: string;
  correctResponse: string | null;
  incorrectResponse: string | null;
  moreInfo: string | null;
}

const IndividualQuiz = () => {
  const {
    useQuiz: { QuizRefetch, Quiz },
    useState: { setCurrent, current: cur },
    useCurrentData: { id, opsi, totalQuestions: total },
  } = useProvider();

  const current = cur + 1;

  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const [hasAttempted, setHasAttempted] = useState(false);
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const documentId = pathnameArray && pathnameArray[pathnameArray?.length - 1];

  const { complete, completion, isLoading, setCompletion } = useCompletion({
    body: {
      quizId: id,
      docId: documentId,
      userId: session?.user.id,
    },

    onFinish: async (_prompt, completion) => {
      // utils.quiz.getQuiz.setData({ documentId: `${documentId}` }, (prev) => {
      //   if (!prev) return prev;
      //   return prev.map((quiz) => {
      //     if (quiz.id === id) {
      //       return {
      //         ...quiz,
      //         QuizAttempt: [
      //           ...quiz.QuizAttempt,
      //           {
      //             userResponse,
      //             correctResponse: completion.split('||')[0] ?? null,
      //             incorrectResponse: completion.split('||')[1] ?? null,
      //             moreInfo: completion.split('||')[2] ?? null,
      //             createdAt: new Date(),
      //           },
      //         ],
      //       };
      //     }
      //     return quiz;
      //   });
      // });
      // await trpc.quiz.getQuiz.refetch();
      QuizRefetch();
    },

    onError: () => {
      toaster({
        title: 'Gagal',
        description: 'Terjadi kesalahan dengan pembuatan teks!',
        condition: 'warning',
        duration: 3000,
      });
    },
    streamProtocol: 'text',
    api: `${env.NEXT_PUBLIC_API_URL}/ai/evaluateQuiz?website_sub_category_id=${websiteSubCategory?.id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  });

  const toggleAttempt = () => {
    setHasAttempted((prev) => !prev);
  };

  const [userResponse, setUserResponse] = useState('');
  const [accuracy, setAccuracy] = useState<number>(0);

  const [quizDone, setQuizDone] = useState<any>({
    done: false,
    show: false,
  });

  const [showResult, setShowResult] = useState<boolean>(false);

  const [numberArray, setNumberArray] = useState<any>([]);
  const { setShowSidebar } = useAppContext();

  const handleFinishQuiz = () => {
    try {
      setShowSidebar(false);
      setNumberArray([]);
      Quiz.forEach((item, i) => {
        if (item.QuizAttempt.length === 0) {
          setNumberArray((prev: any) => [...prev, { number: i + 1 }]);
        }
      });
      const Check = Quiz.find((item) => item.QuizAttempt.length === 0);
      if (Check) {
        setQuizDone((prev: any) => ({
          ...prev,
          show: true,
          done: false,
        }));
      } else {
        setQuizDone({ done: true, show: true });
      }
    } catch (error) {
      return;
    }
  };
  const getCorrect = (index: number) => {
    if (
      Quiz[index].QuizAttempt.length > 0 &&
      Quiz[index].QuizAttempt[0].userResponse.includes(Quiz[index].answer)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const getResponse: any = (index: number) => {
    if (
      Quiz[index].QuizAttempt.length > 0 &&
      Quiz[index].QuizAttempt[0].userResponse
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleScrollCategory = (direction: string) => {
    try {
      const pagination = document.getElementById(
        'paginationQuiz',
      ) as HTMLDivElement;
      const scrollAmount = 400;
      if (direction === 'right' && pagination) {
        pagination.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
      if (direction === 'left' && pagination) {
        pagination.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    } catch (error) {
      console.log('HandleScrollCategory:', error);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <QuizFinish
        finish={quizDone}
        setFinish={setQuizDone}
        number={numberArray}
        accuracy={accuracy}
        setShowResult={setShowResult}
      />

      {!showResult && (
        <div className="bg-bg-workspace pb-[.5rem]">
          <div
            id="paginationQuiz"
            className="flex items-center justify-start gap-[.5rem] overflow-x-auto overflow-y-hidden px-[1rem] pb-[1rem] pt-[.5rem]"
          >
            {Array.from({ length: total }).map((_, i) =>
              !opsi ? (
                <p
                  key={i}
                  className={cn(
                    `cursor-pointer rounded-[.3rem] px-[.5rem] text-[.9rem] duration-200 hover:bg-main-hover hover:text-white active:bg-white `,
                    i + 1 === current
                      ? 'bg-[#e7e7e7] text-main-gray-text'
                      : 'bg-white',
                  )}
                  onClick={async () => {
                    setCurrent(i);
                    if (hasAttempted) {
                      toggleAttempt();
                    }
                    setUserResponse('');
                    setCompletion('');
                  }}
                >
                  {i + 1}
                </p>
              ) : (
                <p
                  key={i}
                  className={cn(
                    `cursor-pointer rounded-[.3rem] px-[.5rem] text-[.9rem] duration-200 hover:bg-white hover:text-black active:bg-white`,
                    i + 1 === current
                      ? 'bg-black text-white hover:bg-gray-400 hover:text-white'
                      : getCorrect(i) && getResponse(i)
                        ? 'bg-green-600 text-white hover:bg-green-400 hover:text-white'
                        : !getCorrect(i) && getResponse(i)
                          ? 'bg-red-500 text-white hover:bg-red-400 hover:text-white'
                          : 'bg-white hover:bg-gray-400 hover:text-white',
                  )}
                  onClick={async () => {
                    setCurrent(i);
                    if (hasAttempted) {
                      toggleAttempt();
                    }
                    setUserResponse('');
                    setCompletion('');
                  }}
                >
                  {i + 1}
                </p>
              ),
            )}
          </div>
          <div className="mr-[2rem] flex items-center justify-end gap-[1rem]">
            <div
              onClick={() => {
                handleScrollCategory('left');
              }}
            >
              <IconLeft
                w={15}
                className="cursor-pointer duration-300 active:text-main md:hover:scale-105 md:hover:text-main md:active:text-black"
              />
            </div>
            <div
              onClick={() => {
                handleScrollCategory('right');
              }}
            >
              <IconRight
                w={15}
                className="cursor-pointer duration-300 active:text-main md:hover:scale-105 md:hover:text-main md:active:text-black"
              />
            </div>
          </div>
        </div>
      )}
      {!showResult && (
        <div className="flex-grow overflow-scroll">
          {hasAttempted ? (
            <IndividualQuizReport
              completion={completion}
              isLoading={isLoading}
              toggleAttempt={toggleAttempt}
              userResponse={userResponse}
              setUserResponse={setUserResponse}
            />
          ) : (
            <IndividualQuizQuestion
              complete={complete}
              toggleAttempt={toggleAttempt}
              userResponse={userResponse}
              setUserResponse={setUserResponse}
            />
          )}
        </div>
      )}
      {showResult && <Result setAccuracy={setAccuracy} />}
      <div className="mb-[1rem] flex h-8 items-center justify-between border-t border-gray-100 p-[1.5rem]">
        {!showResult ? (
          <Button
            className="flex items-center text-main-gray-text"
            variant="ghost"
            disabled={current === 1}
            onClick={() => {
              if (hasAttempted) {
                toggleAttempt();
              }
              setUserResponse('');
              setCompletion('');
              setCurrent((prev) => prev - 1);
            }}
          >
            {}
            <IconTailedArrowPrev
              w={15}
              className="text-black"
            />
            <span className="ml-2">Sebelumnya</span>
          </Button>
        ) : (
          <Button
            className="flex items-center text-main-gray-text"
            variant="ghost"
            onClick={() => {
              setShowResult(false);
            }}
          >
            <IconTailedArrowPrev
              w={15}
              className="text-black"
            />
            <span className="ml-2">Lihat Soal</span>
          </Button>
        )}

        {!showResult ? (
          <span className="text-gray-500">
            {current} / {total}
          </span>
        ) : (
          <span className="text-black">Hasil Akhir</span>
        )}

        {!showResult && current !== total ? (
          <Button
            className="flex items-center text-main-gray-text"
            variant="ghost"
            disabled={current === total}
            onClick={() => {
              if (hasAttempted) {
                toggleAttempt();
              }
              setUserResponse('');
              setCompletion('');
              setCurrent((prev) => prev + 1);
            }}
          >
            <span className="mr-2">Berikutnya</span>
            <IconTailedArrowNext
              className="text-black"
              w={15}
            />
          </Button>
        ) : !showResult && current === total ? (
          <button
            className="flex items-center gap-[.5rem] rounded-[.8rem] bg-main px-[1rem] py-[.7rem] text-[.9rem] text-white duration-200 hover:bg-main-hover"
            onClick={() => setShowResult(true)}
          >
            Check Result
            <IconCheckList w={15} />
          </button>
        ) : (
          <button
            className="flex items-center gap-[.5rem] rounded-[.8rem] bg-main px-[1rem] py-[.7rem] text-[.9rem] text-white duration-200 hover:bg-main-hover"
            onClick={() => handleFinishQuiz()}
          >
            Buat quiz baru
            <IconCircleReused w={15} />
          </button>
        )}
      </div>
    </div>
  );
};
export default IndividualQuiz;
