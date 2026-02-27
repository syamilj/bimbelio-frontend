'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { SpinnerPageCentered } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { TryoutAnswer, TryoutQuestion } from '@/types/database';
import { BookOpen, FileText, LayoutGrid, Target, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TryoutDataType } from '../page';
import CountDownTryout from './countdown-tryout';
import SessionQuestion from './session-question';
import SubmitTryout from './submit-tryout';

interface QuestionWithAnswer extends TryoutQuestion {
  TryoutAnswers: TryoutAnswer[];
}

interface Props {
  questions: QuestionWithAnswer[];
  sessionId: string;
  sessionData: NonNullable<TryoutDataType>['TryoutSession'][0];
  isSessionDone: boolean;
  numberSession: number;
  tryoutData: NonNullable<TryoutDataType>;
}

const Tryout: React.FC<Props> = ({
  questions,
  sessionId,
  sessionData,
  isSessionDone,
  numberSession,
  tryoutData,
}) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionAnswer, setSessionAnswer] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [status] = useState<'none' | 'correct' | 'wrong' | 'complete'>('none');

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  useEffect(() => {
    const dataString = localStorage.getItem(`sessionAnswer-${sessionId}`);
    if (dataString) {
      setSessionAnswer(JSON.parse(dataString));
    } else {
      const initialAnswers = questions?.map((item: any) => ({
        number: item.number,
        questionId: item.id,
        answerId: '',
        answer: '',
        type: item.type,
        notSure: false,
      }));
      setSessionAnswer(initialAnswers);
    }
  }, [questions, sessionId]);

  useEffect(() => {
    if (sessionAnswer?.length > 0) {
      const currentQuestionData = questions[currentQuestionIndex];
      if (
        currentQuestionData.type === 'OBJECTIVE_5' ||
        currentQuestionData.type === 'TRUE_FALSE'
      ) {
        setSelectedOption(sessionAnswer[currentQuestionIndex].answerId);
      } else {
        setSelectedOptions(sessionAnswer[currentQuestionIndex].answer);
      }
      if (sessionAnswer[currentQuestionIndex].type === 'SHORT_ANSWER') {
        setInputValue(sessionAnswer[currentQuestionIndex].answer);
      } else {
        setInputValue('');
      }
    }
    if (sessionAnswer)
      localStorage.setItem(
        `sessionAnswer-${sessionId}`,
        JSON.stringify(sessionAnswer),
      );
  }, [sessionAnswer, currentQuestionIndex, questions, sessionId]);

  const isAnswered = (index: number) => {
    return sessionAnswer[index].answer !== '';
  };

  console.log({ sessionData });

  const getDuration = () => {
    if (!sessionData.TryoutSessionParticipant?.startSession) return 0;

    let durationInSeconds = sessionData.duration * 60;
    const dateNow = new Date().getTime();
    const dateStart = new Date(
      sessionData.TryoutSessionParticipant?.startSession,
    ).getTime();
    const endDateTryout = new Date(tryoutData.endDate).getTime();

    const endDateSession = new Date(
      sessionData.TryoutSessionParticipant?.startSession,
    );
    endDateSession.setMinutes(
      endDateSession.getMinutes() + sessionData.duration,
    );

    if (tryoutData.id === 'cmkqjyg2w01iykuctdm6v3awh') {
      if (endDateSession.getTime() > endDateTryout) {
        console.log('Tryout ended before session end, adjusting duration');

        const diffInMilliseconds = endDateTryout - dateStart;
        durationInSeconds = Math.floor(diffInMilliseconds / 1000);
      }
    }

    const diffInMilliseconds = dateNow - dateStart;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const currentDuration = durationInSeconds - diffInSeconds;
    return currentDuration < 0 ? 0 : currentDuration;
  };

  if (!sessionAnswer || sessionAnswer?.length < 1)
    return <SpinnerPageCentered />;

  const currentQuestionData = questions[currentQuestionIndex];
  const answeredCount = sessionAnswer.filter(
    (item: any) => item.answer !== '',
  ).length;
  const notSureCount = sessionAnswer.filter((item: any) => item.notSure).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Session Info */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Trophy
                  className="w-6 h-6"
                  style={{ color: mainColor }}
                />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">
                  Sesi {numberSession}
                </h1>
                <p className="text-sm text-gray-600">
                  {sessionData ? sessionData?.TryoutCategory?.name : ''}
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-4">
              <div className="flex items-center ">
                <span className="font-mono font-bold text-red-700">
                  <CountDownTryout
                    seconds={getDuration()}
                    sessionId={sessionId}
                    sessionAnswer={sessionAnswer}
                  />
                </span>
              </div>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2.5 rounded-3xl bg-white hover:bg-slate-50 transition-colors shadow-sm border border-slate-200"
              >
                <LayoutGrid className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {/* <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Soal {currentQuestionIndex + 1} dari {questions.length}
              </span>
              <span className="text-sm text-gray-600">
                {answeredCount} terjawab
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 rounded-full"
              style={{
                background: '#f3f4f6',
              }}
            />
          </div> */}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <SessionQuestion
              sessionId={sessionId}
              currentQuestionIndex={currentQuestionIndex}
              currentQuestionData={currentQuestionData}
              selectedOptions={selectedOptions}
              selectedOption={selectedOption}
              inputValue={inputValue}
              setInputValue={setInputValue}
              sessionAnswer={sessionAnswer}
              setSessionAnswer={setSessionAnswer}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              questions={questions}
              status={status}
            />
          </div>

          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Session Stats */}
              <Card
                className="border rounded-3xl overflow-hidden shadow-sm"
                style={{ borderColor: `${mainColor}20` }}
              >
                <CardContent className="p-6">
                  <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                    <BookOpen
                      className="w-5 h-5"
                      style={{ color: mainColor }}
                    />
                    Statistik Sesi
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div
                        className="text-2xl font-black"
                        style={{ color: mainColor }}
                      >
                        {answeredCount}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        Terjawab
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-yellow-600">
                        {notSureCount}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        Ragu-ragu
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-slate-400">
                      {questions.length - answeredCount}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Belum dijawab
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Navigation */}
              <Card
                className="border rounded-3xl overflow-hidden shadow-sm"
                style={{ borderColor: `${secondaryColor}20` }}
              >
                <CardContent className="p-6">
                  <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                    <Target
                      className="w-5 h-5"
                      style={{ color: secondaryColor }}
                    />
                    Navigasi Soal
                  </h3>
                  <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto no-scrollbar">
                    {questions?.map((_, i) => (
                      <button
                        key={i}
                        className={cn(
                          'h-10 w-10 rounded-3xl font-black text-sm transition-all duration-200 border shadow-sm',
                          currentQuestionIndex === i
                            ? 'border-transparent text-white'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white',
                          isAnswered(i) && currentQuestionIndex !== i
                            ? 'text-white border-transparent bg-emerald-500'
                            : '',
                          sessionAnswer[i].notSure && currentQuestionIndex !== i
                            ? 'bg-yellow-400 text-yellow-900 border-yellow-300'
                            : '',
                        )}
                        style={{
                          backgroundColor:
                            currentQuestionIndex === i
                              ? mainColor
                              : isAnswered(i) && currentQuestionIndex !== i
                                ? '#10B981'
                                : sessionAnswer[i].notSure &&
                                    currentQuestionIndex !== i
                                  ? ''
                                  : undefined,
                        }}
                        onClick={() => {
                          if (!isSessionDone) {
                            setCurrentQuestionIndex(i);
                          }
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Section */}
              {!isSessionDone && (
                <Card
                  className="border rounded-3xl overflow-hidden shadow-sm"
                  style={{ borderColor: `${mainColor}20` }}
                >
                  <CardContent className="p-6">
                    <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                      <FileText
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                      Selesaikan Sesi
                    </h3>
                    <div className="space-y-4">
                      <div className="text-sm text-slate-600">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Progress:</span>
                          <span className="font-black">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                        <Progress
                          value={progressPercentage}
                          className="h-2"
                        />
                      </div>
                      <SubmitTryout
                        sessionAnswer={sessionAnswer}
                        sessionId={sessionId}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dialog */}
      <Dialog
        open={showSidebar}
        onOpenChange={setShowSidebar}
      >
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black">
              <Trophy
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
              Sesi {numberSession}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Session Stats */}
            <Card
              className="border rounded-3xl overflow-hidden"
              style={{ borderColor: `${mainColor}20` }}
            >
              <CardContent className="p-4">
                <h3 className="font-black text-base mb-3 flex items-center gap-2">
                  <BookOpen
                    className="w-4 h-4"
                    style={{ color: mainColor }}
                  />
                  Statistik Sesi
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div
                      className="text-xl font-black"
                      style={{ color: mainColor }}
                    >
                      {answeredCount}
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium">
                      Terjawab
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-yellow-600">
                      {notSureCount}
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium">
                      Ragu-ragu
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-slate-400">
                      {questions.length - answeredCount}
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium">
                      Belum dijawab
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Navigation */}
            <Card
              className="border rounded-3xl overflow-hidden"
              style={{ borderColor: `${secondaryColor}20` }}
            >
              <CardContent className="p-4">
                <h3 className="font-black text-base mb-3 flex items-center gap-2">
                  <Target
                    className="w-4 h-4"
                    style={{ color: secondaryColor }}
                  />
                  Navigasi Soal
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {questions?.map((_, i) => (
                    <button
                      key={i}
                      className={cn(
                        'h-10 w-10 rounded-3xl font-black text-sm transition-all duration-200 border shadow-sm',
                        currentQuestionIndex === i
                          ? 'border-transparent text-white'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white',
                        isAnswered(i) && currentQuestionIndex !== i
                          ? 'text-white border-transparent bg-emerald-500'
                          : '',
                        sessionAnswer[i].notSure && currentQuestionIndex !== i
                          ? 'bg-yellow-400 text-yellow-900 border-yellow-300'
                          : '',
                      )}
                      style={{
                        backgroundColor:
                          currentQuestionIndex === i
                            ? mainColor
                            : isAnswered(i) && currentQuestionIndex !== i
                              ? '#10B981'
                              : sessionAnswer[i].notSure &&
                                  currentQuestionIndex !== i
                                ? ''
                                : undefined,
                      }}
                      onClick={() => {
                        if (!isSessionDone) {
                          setCurrentQuestionIndex(i);
                          setShowSidebar(false);
                        }
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit Section */}
            {!isSessionDone && (
              <Card
                className="border rounded-3xl overflow-hidden"
                style={{ borderColor: `${mainColor}20` }}
              >
                <CardContent className="p-4">
                  <h3 className="font-black text-base mb-3 flex items-center gap-2">
                    <FileText
                      className="w-4 h-4"
                      style={{ color: mainColor }}
                    />
                    Selesaikan Sesi
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm text-slate-600">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Progress:</span>
                        <span className="font-black">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className="h-2"
                      />
                    </div>
                    <SubmitTryout
                      sessionAnswer={sessionAnswer}
                      sessionId={sessionId}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tryout;
