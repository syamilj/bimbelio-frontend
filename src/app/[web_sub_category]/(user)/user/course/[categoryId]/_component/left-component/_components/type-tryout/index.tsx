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
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Grid3x3,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
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

  return (
    <div className="flex w-full flex-col gap-6 p-6 h-full pb-[100px]">
      {!isDone ? (
        <>
          {/* Header Card with Gradient */}
          <div className="relative rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6 shadow-xl">
            {/* <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div> */}

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                      Tryout Mode
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {TryoutSession.name}
                  </h1>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <span className="text-lg font-bold text-white">
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <FileText className="w-4 h-4" />
                  <span>{userAnswers?.length || 0} Soal</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{answered()} Terjawab</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <Clock className="w-4 h-4" />
                  <span>
                    {userAnswers ? userAnswers.length - answered() : 0} Tersisa
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Progress
                  value={progress}
                  className="h-2 bg-white/20"
                  classNameThumb="bg-gradient-to-r from-yellow-400 to-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Navigation Card */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Grid3x3 className="w-5 h-5 text-main" />
                <CardTitle className="text-lg">Navigasi Soal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion
                type="single"
                collapsible
                defaultValue="item-1"
              >
                <AccordionItem
                  value="item-1"
                  className="border-none"
                >
                  <AccordionTrigger className="hover:no-underline py-2">
                    <span className="text-sm font-medium">
                      Lihat Semua Nomor
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap justify-center gap-3 pt-4">
                      {Array.from({
                        length: TryoutSession.TryoutQuestion.length,
                      }).map((_, index) => {
                        const isAnswered =
                          userAnswers && userAnswers[index].answerId.length > 0;
                        const isCurrent = currentIndexQuestion === index;

                        return (
                          <Button
                            key={index}
                            variant={'outline'}
                            size="sm"
                            className={cn(
                              'relative h-12 w-12 rounded-xl font-bold transition-all duration-300 transform hover:scale-110',
                              'border-2',
                              isCurrent &&
                                !isAnswered &&
                                'border-blue-500 bg-blue-50 text-blue-600 shadow-lg shadow-blue-200',
                              isCurrent &&
                                isAnswered &&
                                'border-green-500 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200',
                              !isCurrent &&
                                !isAnswered &&
                                'border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:bg-blue-50',
                              !isCurrent &&
                                isAnswered &&
                                'border-green-400 bg-gradient-to-br from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600',
                            )}
                            onClick={() => setCurrentIndexQuestion(index)}
                          >
                            {isAnswered && (
                              <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-600 bg-white rounded-full" />
                            )}
                            {index + 1}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-400 to-emerald-500 border border-green-400"></div>
                        <span className="text-gray-600">Terjawab</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 rounded-md bg-white border-2 border-gray-200"></div>
                        <span className="text-gray-600">Belum Dijawab</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 rounded-md bg-blue-50 border-2 border-blue-500"></div>
                        <span className="text-gray-600">Soal Aktif</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-lg">
                    {currentIndexQuestion + 1}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Soal {currentIndexQuestion + 1}
                    </CardTitle>
                    <CardDescription>
                      dari {userAnswers?.length} pertanyaan
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-gray-700">
                    {answered()} / {userAnswers?.length}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Question */}
                <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <ReactMarkdown
                      className="font-medium text-gray-800 flex-1"
                      value={
                        TryoutSession.TryoutQuestion[currentIndexQuestion]
                          .question
                      }
                    />
                  </div>
                </div>

                {/* Answers */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Pilih Jawaban:
                  </p>
                  <RadioGroup
                    value={getRadioGroupValue()}
                    onValueChange={(value) => {}}
                  >
                    {TryoutSession.TryoutQuestion[
                      currentIndexQuestion
                    ].TryoutAnswers.map((answer, aIndex) => {
                      const isSelected = getRadioGroupValue() === answer.id;
                      const answerLabel = String.fromCharCode(65 + aIndex); // A, B, C, D, etc.

                      return (
                        <div
                          key={aIndex}
                          className={cn(
                            'group relative flex items-start gap-3 rounded-xl p-4 transition-all duration-300 cursor-pointer border-2',
                            isSelected
                              ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-500 shadow-md'
                              : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm',
                          )}
                          onClick={() => {
                            if (!userAnswers) return;
                            const newData = userAnswers?.map((uAnswer) => {
                              if (
                                uAnswer.questionId ===
                                TryoutSession.TryoutQuestion[
                                  currentIndexQuestion
                                ].id
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
                          <div
                            className={cn(
                              'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0 transition-all duration-300',
                              isSelected
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600',
                            )}
                          >
                            {answerLabel}
                          </div>
                          <div className="flex-1 flex items-center gap-3">
                            <RadioGroupItem
                              id={answer.id}
                              value={answer.id}
                              className={cn(
                                'transition-all',
                                isSelected && 'border-blue-600 text-blue-600',
                              )}
                            />
                            <Label
                              htmlFor={answer.id}
                              className={cn(
                                'flex-1 cursor-pointer text-gray-700 font-medium',
                                isSelected && 'text-blue-900',
                              )}
                            >
                              {answer.answer}
                            </Label>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    className={cn(
                      'rounded-xl px-6 py-6 font-semibold transition-all',
                      currentIndexQuestion === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100 hover:shadow-md',
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
                    ← Sebelumnya
                  </Button>
                  <Button
                    className={cn(
                      'rounded-xl px-6 py-6 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all',
                      currentIndexQuestion ===
                        TryoutSession.TryoutQuestion.length - 1 &&
                        'opacity-50 cursor-not-allowed',
                    )}
                    onClick={() => {
                      setCurrentIndexQuestion((prev) => {
                        if (prev < TryoutSession.TryoutQuestion.length - 1) {
                          return prev + 1;
                        }
                        return prev;
                      });
                    }}
                    disabled={
                      currentIndexQuestion ===
                      TryoutSession.TryoutQuestion.length - 1
                    }
                  >
                    Selanjutnya →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        // <div className="flex w-full flex-col gap-4">
        //   <div
        //     className={cn(
        //       'flex flex-col items-center gap-4 rounded-2xl py-6 font-medium text-white',
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
        //   <div className="grid grid-cols-2 gap-4">
        //     <div className="flex gap-[.5rem] rounded-2xl bg-white p-4">
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
        //     <div className="flex gap-[.5rem] rounded-2xl bg-white p-4">
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
