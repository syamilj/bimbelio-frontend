import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ReactMarkdown from '@/components/ui/react-markdown';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useProvider } from '../../../../_provider/provider';
import ReviewTabTypeTryout from './result';
import SubmitTryout from './submit-tryout';

type userAnswersProps = {
  number: number;
  questionId: string;
  answerId: string;
  answer: string;
  notSure: boolean;
};

const TryoutType = () => {
  const {
    useParams: { sub },
    useData: { CourseData },
  } = useProvider();

  const TryoutSession = CourseData?.TryoutSession;
  const subCourseId = CourseData?.id;

  const [userAnswers, setUserAnswers] = useState<userAnswersProps[] | null>(
    null,
  );
  const [currentSub, setCurrentSub] = useState<string | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [currentIndexQuestion, setCurrentIndexQuestion] = useState<number>(0);

  console.log({ userAnswers });

  useEffect(() => {
    const savedAnswer = localStorage.getItem(`tryout-sub-chapter-${sub}`);
    const savedAnswerArray = savedAnswer ? JSON.parse(savedAnswer) : null;
    if (savedAnswerArray) {
      setUserAnswers(
        savedAnswerArray.sort((a: any, b: any) => a.number - b.number),
      );
    } else if (TryoutSession) {
      const initialAnswers = TryoutSession.TryoutQuestion.map((item) => {
        return {
          number: item.number,
          questionId: item.id,
          answerId: '',
          answer: '',
          notSure: false,
        };
      }).sort((a, b) => a.number - b.number);
      setUserAnswers(initialAnswers);
    }
    if (
      TryoutSession &&
      TryoutSession?.TryoutSessionResult.length > 0 &&
      TryoutSession.TryoutSessionParticipant.length > 0
    ) {
      setIsDone(true);
    }
  }, [TryoutSession]);

  useEffect(() => {
    if (userAnswers && currentSub == sub) {
      localStorage.setItem(
        `tryout-sub-chapter-${sub}`,
        JSON.stringify(userAnswers),
      );
    }
    if (sub !== currentSub && typeof sub === 'string') {
      setCurrentSub(sub);
    }
  }, [userAnswers, sub, currentSub]);

  if (!TryoutSession) return null;

  const answered = () => {
    let total = 0;
    userAnswers?.forEach((item) => {
      if (item.answerId) {
        total += 1;
      }
    });
    return total;
  };
  const progress = (answered() / (userAnswers?.length || 0)) * 100;

  const getRadioGroupValue = () => {
    const data = userAnswers?.find(
      (item) =>
        item.questionId ===
        TryoutSession.TryoutQuestion[currentIndexQuestion].id,
    );
    if (data) {
      return data.answerId;
    }
    return '';
  };

  console.log({ userAnswers, TryoutSession });

  return (
    <div className="flex w-full flex-col gap-[1rem] p-6 h-full pb-[100px]">
      {!isDone ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {TryoutSession.name}
            </CardTitle>
            <CardDescription>
              Kerjakan Tryout{' '}
              <span className="text-main">({progress.toFixed(1)}%)</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="flex cursor-pointer items-start gap-[.5rem] rounded-[.5rem]  py-[.5rem] text-start text-[1rem] font-semibold duration-300 md:hover:bg-surface-primary-light">
                  Navigasi Soal
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap justify-center gap-4 mb-4">
                    {Array.from({
                      length: TryoutSession.TryoutQuestion.length,
                    }).map((_, index) => {
                      return (
                        <Button
                          key={index}
                          variant={'outline'}
                          className={cn(
                            'flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[.5rem] bg-white font-bold text-main-gray-text hover:bg-black hover:text-white active:bg-black/80 md:hover:bg-black/80 md:hover:text-white',
                            currentIndexQuestion === index &&
                              'bg-black text-white',
                            userAnswers &&
                              userAnswers[index].answerId.length > 0 &&
                              'bg-main text-white md:hover:bg-main-hover',
                          )}
                          onClick={() => setCurrentIndexQuestion(index)}
                        >
                          {index + 1}
                        </Button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Progress
              value={progress}
              className="mb-4"
            />
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">
                Pertanyaan {currentIndexQuestion + 1} dari {userAnswers?.length}
              </h3>
              {/* <p className="text-muted-foreground mb-4">
                {TryoutSession.TryoutQuestion[currentIndexQuestion].question}
              </p> */}
              <ReactMarkdown
                className="font-medium"
                value={
                  TryoutSession.TryoutQuestion[currentIndexQuestion].question
                }
              />
              <RadioGroup
                // value={selectedAnswers[currentQuestion]}
                // onValueChange={handleAnswerSelect}
                value={getRadioGroupValue()}
                onValueChange={(value) => {
                  console.log('Jawaban :', value);
                }}
              >
                {TryoutSession.TryoutQuestion[
                  currentIndexQuestion
                ].TryoutAnswers.map((answer, aIndex) => (
                  <div
                    key={aIndex}
                    className="flex items-center space-x-2 rounded-xl p-2 hover:bg-accent"
                    onClick={() => {
                      if (!userAnswers) return;
                      const newData = userAnswers?.map((uAnswer) => {
                        if (
                          uAnswer.questionId ===
                          TryoutSession.TryoutQuestion[currentIndexQuestion].id
                        ) {
                          return {
                            ...uAnswer,
                            answer: answer.answer,
                            answerId: answer.id,
                          };
                        }
                        return uAnswer;
                      });
                      setUserAnswers(newData);
                    }}
                  >
                    <RadioGroupItem
                      id={answer.id}
                      value={answer.id}
                    />
                    <Label htmlFor={answer.id}>{answer.answer}</Label>
                  </div>
                ))}
                {/* {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-accent"
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))} */}
              </RadioGroup>
              <div className="mt-6 flex justify-between">
                <button
                  className={cn(
                    'rounded-[.8rem] border border-input bg-white px-[1rem] py-[.8rem] text-[.9rem] text-black duration-300 active:bg-white md:hover:bg-accent md:hover:text-accent-foreground',
                    currentIndexQuestion === 0 &&
                      'cursor-not-allowed bg-white hover:bg-white md:hover:bg-white text-muted-foreground/30',
                  )}
                  onClick={() => {
                    setCurrentIndexQuestion((prev) => {
                      if (prev > 0) {
                        return prev - 1;
                      }
                      return prev;
                    });
                  }}
                  disabled={currentIndexQuestion === 0}
                >
                  Sebelumnya
                </button>
                <button
                  className={cn(
                    'rounded-[.8rem] bg-main px-[1rem] py-[.8rem] text-[.9rem] text-white duration-300 active:bg-main md:hover:bg-main-hover',
                    currentIndexQuestion ===
                      TryoutSession.TryoutQuestion.length - 1 &&
                      'cursor-not-allowed bg-main-hover active:bg-main-hover',
                  )}
                  onClick={() => {
                    setCurrentIndexQuestion((prev) => {
                      if (prev < TryoutSession.TryoutQuestion.length - 1) {
                        return prev + 1;
                      }
                      return prev;
                    });
                  }}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // <div className="flex w-full flex-col gap-[1rem]">
        //   <div
        //     className={cn(
        //       'flex flex-col items-center gap-[1rem] rounded-[1rem] py-[1.5rem] font-medium text-white',
        //       isPassed && 'bg-main',
        //       !isPassed && 'bg-main-red',
        //     )}
        //   >
        //     {isPassed ? (
        //       <>
        //         <IconCheckList
        //           w={46}
        //           className="text-white"
        //         />
        //         <h1 className="text-[1.2rem]">SELAMAT, KAMU LULUS!</h1>
        //         <p>{accuracy?.toFixed(2)}% akurasi</p>
        //         <p>
        //           Nilai Akhir: {totalScore}/{perfectScore}
        //         </p>
        //       </>
        //     ) : (
        //       <>
        //         <IconX
        //           w={46}
        //           className="text-white"
        //         />
        //         <h1 className="text-[1.2rem]">MAAF, KAMU BELUM LULUS!</h1>
        //         <p>{accuracy?.toFixed(2)}% akurasi</p>
        //         <p>
        //           Nilai Akhir: {totalScore}/{perfectScore}
        //         </p>
        //       </>
        //     )}
        //   </div>
        //   <div className="grid grid-cols-2 gap-[1rem]">
        //     <div className="flex gap-[.5rem] rounded-[1rem] bg-white p-[1rem]">
        //       <div className="">
        //         <IconCircleLoop className="mt-[.1rem] text-main" />
        //       </div>
        //       <div className="flex w-full flex-col">
        //         <h1 className="font-medium">Jawaban Benar</h1>
        //         <p className="font-regular text-[.9rem] text-main-gray-text">
        //           {correctAnswer}/{totalQuestion} soal
        //         </p>
        //       </div>
        //     </div>
        //     <div className="flex gap-[.5rem] rounded-[1rem] bg-white p-[1rem]">
        //       <div className="">
        //         <IconTimer className="mt-[.1rem] text-main" />
        //       </div>
        //       <div className="flex w-full flex-col">
        //         <h1 className="font-medium">Waktu pengerjaaan</h1>
        //         <p className="font-regular text-[.9rem] text-main-gray-text">
        //           Coming soon!
        //         </p>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <ReviewTabTypeTryout
          sessionResult={TryoutSession.TryoutSessionParticipant[0]}
        />
      )}
      {!isDone && (
        <SubmitTryout
          sessionAnswer={userAnswers}
          sessionId={TryoutSession.id}
          subCourseId={subCourseId || ''}
        />
      )}
    </div>
  );
};

export default TryoutType;
