'use client';

import { TryoutAnswer, TryoutQuestion } from '@prisma/client';
import { useEffect, useState } from 'react';

import { SpinnerPageCentered } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { IconDown, IconTimer, IconUp } from '@/styles/icon';
import CountDownTryout from './countdown-tryout';
import Header from './header';
import SessionQuestion from './session-question';
import SubmitTryout from './submit-tryout';

interface QuestionWithAnswer extends TryoutQuestion {
  TryoutAnswers: TryoutAnswer[];
}

interface Props {
  questions: QuestionWithAnswer[];
  sessionId: string;
  sessionData: any;
  isSessionDone: boolean;
  numberSession: number;
}

const Tryout: React.FC<Props> = ({
  questions,
  sessionId,
  sessionData,
  isSessionDone,
  numberSession,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionAnswer, setSessionAnswer] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [listQuestionsHeight, setListQuestionsHeight] = useState<number>(0);
  const [showListQuestions, setShowListQuestions] = useState<boolean>(true);
  const [status] = useState<'none' | 'correct' | 'wrong' | 'complete'>('none');

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
    const durationInSeconds = sessionData.duration * 60;
    const dateNow = new Date().getTime();
    const dateStart = new Date(
      sessionData.TryoutSessionParticipant[0].startSession,
    ).getTime();

    const diffInMilliseconds = dateNow - dateStart;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const currentDuration = durationInSeconds - diffInSeconds;
    return currentDuration < 0 ? 0 : currentDuration;
  };

  if (!sessionAnswer || sessionAnswer?.length < 1)
    return <SpinnerPageCentered />;

  const currentQuestionData = questions[currentQuestionIndex];

  const toggleListQuestions = () => {
    const div = document.querySelector(
      '#info #list-questions',
    ) as HTMLDivElement;
    if (div) {
      if (div.clientHeight !== 0) {
        div.style.height = `${div.clientHeight}px`;
        setListQuestionsHeight(div.clientHeight);
        setShowListQuestions(false);
      } else {
        setShowListQuestions(true);
      }
      div.style.height =
        div.clientHeight === 0 ? `${listQuestionsHeight}px` : '0px';
      div.style.overflow = 'hidden';
      div.style.transition = 'height 0.3s ease';
    }
  };

  return (
    <>
      <Header
        current={currentQuestionIndex}
        total={questions.length}
        name={sessionData ? sessionData.name : ''}
      />
      <div className="absolute left-0 top-0 h-full w-full flex-1 overflow-y-auto bg-workspace pb-20 pt-14 md:top-16 md:pb-32 md:pt-4">
        <div className="flex flex-col-reverse justify-end md:h-fit md:flex-row md:justify-between">
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
          <div
            id="info"
            className="flex w-full shrink-0 flex-col items-center gap-y-6 px-6 py-4 md:w-[420px] md:py-0"
          >
            <div className="flex w-full justify-center rounded-xl bg-white px-4 py-1 text-lg md:hidden">
              {!isSessionDone && (
                <div className="flex items-center gap-2 font-medium text-red-800">
                  <IconTimer />
                  <CountDownTryout
                    seconds={getDuration()}
                    sessionId={sessionId}
                    sessionAnswer={sessionAnswer}
                  />
                </div>
              )}
            </div>
            <div className="relative flex w-full items-center justify-between">
              <h1 className="w-full text-center font-semibold">
                Sesi {numberSession} -{' '}
                {sessionData ? sessionData?.TryoutCategory?.name : ''}
              </h1>
              <div
                className="absolute right-4 cursor-pointer text-main-gray-text duration-300 md:hover:text-black"
                onClick={toggleListQuestions}
              >
                {showListQuestions ? <IconUp /> : <IconDown />}
              </div>
            </div>
            <div className="mt-[-1rem] hidden w-full justify-center rounded-xl bg-white px-4 py-1 text-lg md:flex">
              {!isSessionDone && (
                <div className="flex items-center gap-2 font-medium text-red-800">
                  <IconTimer />
                  <CountDownTryout
                    seconds={getDuration()}
                    sessionId={sessionId}
                    sessionAnswer={sessionAnswer}
                  />
                </div>
              )}
            </div>
            <div
              id="list-questions"
              className="flex w-full flex-wrap justify-center gap-4"
            >
              {questions?.map((_, i: number) => (
                <div
                  key={i}
                  className={cn(
                    `flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-xl bg-white font-bold text-main-gray-text md:hover:bg-black/5 ${currentQuestionIndex === i && 'bg-black/10'} duration-300`,
                    !isSessionDone &&
                      isAnswered(i) &&
                      'bg-main text-white md:hover:bg-main-hover',
                    !isSessionDone &&
                      sessionAnswer[i].notSure &&
                      'bg-main-yellow text-black md:hover:bg-yellow-400',
                  )}
                  onClick={() => {
                    if (!isSessionDone) {
                      setCurrentQuestionIndex(i);
                    } else {
                      const scrollTo = (selector: string) => {
                        const element = document.querySelector(selector);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      };
                      scrollTo(`#question${i + 1}`);
                    }
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="flex w-full justify-end">
              {!isSessionDone && (
                <SubmitTryout
                  sessionAnswer={sessionAnswer}
                  sessionId={sessionId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tryout;
