'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SpinnerPageCentered } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { TryoutAnswer, TryoutQuestion } from '@/types/database';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  Trophy,
} from 'lucide-react';
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
                className="lg:hidden p-2 rounded-3xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {showSidebar ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
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

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {(showSidebar || window.innerWidth >= 1024) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="sticky top-32 space-y-6"
                >
                  {/* Session Stats */}
                  <Card
                    className="border-2 rounded-3xl overflow-hidden shadow-lg"
                    style={{ borderColor: `${mainColor}20` }}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <BookOpen
                          className="w-5 h-5"
                          style={{ color: mainColor }}
                        />
                        Statistik Sesi
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div
                            className="text-2xl font-bold"
                            style={{ color: mainColor }}
                          >
                            {answeredCount}
                          </div>
                          <div className="text-xs text-gray-600">Terjawab</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {notSureCount}
                          </div>
                          <div className="text-xs text-gray-600">Ragu-ragu</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400">
                          {questions.length - answeredCount}
                        </div>
                        <div className="text-xs text-gray-600">
                          Belum dijawab
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Question Navigation */}
                  <Card
                    className="border-2 rounded-3xl overflow-hidden shadow-lg"
                    style={{ borderColor: `${secondaryColor}20` }}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Target
                          className="w-5 h-5"
                          style={{ color: secondaryColor }}
                        />
                        Navigasi Soal
                      </h3>
                      <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                        {questions?.map((_, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              'h-10 w-10 rounded-3xl font-bold text-sm transition-all duration-200 border-2',
                              currentQuestionIndex === i
                                ? 'border-transparent text-white shadow-lg'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300',
                              isAnswered(i) && currentQuestionIndex !== i
                                ? 'text-white border-transparent'
                                : '',
                              sessionAnswer[i].notSure &&
                                currentQuestionIndex !== i
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
                                      : 'white',
                            }}
                            onClick={() => {
                              if (!isSessionDone) {
                                setCurrentQuestionIndex(i);
                              }
                            }}
                          >
                            {i + 1}
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Section */}
                  {!isSessionDone && (
                    <Card
                      className="border-2 rounded-3xl overflow-hidden shadow-lg"
                      style={{ borderColor: `${mainColor}20` }}
                    >
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <FileText
                            className="w-5 h-5"
                            style={{ color: mainColor }}
                          />
                          Selesaikan Sesi
                        </h3>
                        <div className="space-y-4">
                          <div className="text-sm text-gray-600">
                            <div className="flex justify-between mb-2">
                              <span>Progress:</span>
                              <span className="font-bold">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tryout;
