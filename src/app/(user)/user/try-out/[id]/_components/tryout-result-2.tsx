'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SpinnerPageCentered } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { TryoutCategory, TryoutQuestion, TryoutSession } from '@prisma/client';
import { useState } from 'react';
import Header from './header';
import Result from './result';

interface SessionProps extends TryoutSession {
  TryoutCategory: TryoutCategory;
  TryoutQuestion: TryoutQuestion[];
}

interface Props {
  sessionData: SessionProps[];
  tryoutId: string;
}

const TryoutResult2 = ({ sessionData }: Props) => {
  const [resultIndex, setResultIndex] = useState<number>(0);

  const id =
    sessionData && sessionData.length > 0 ? sessionData[resultIndex].id : '';
  const { data: sessionResult, isLoading } =
    api.tryoutSession.getTryoutSessionResult.useQuery(
      { sessionId: id },
      { refetchOnWindowFocus: false },
    );

  if (isLoading) return <SpinnerPageCentered />;

  if (!sessionResult) {
    return <div>Error loading results</div>;
  }

  const normalizedSessionResult = {
    ...sessionResult,
    startSession: new Date(sessionResult.startSession),
    endSession: sessionResult.endSession
      ? new Date(sessionResult.endSession)
      : null,
    TryoutSession: {
      ...sessionResult.TryoutSession,
      createAt: new Date(sessionResult.TryoutSession.createAt),
      updateAt: new Date(sessionResult.TryoutSession.updateAt),
    },
    TryoutUserAnswer: sessionResult.TryoutUserAnswer.map((userAnswer) => ({
      ...userAnswer,
      TryoutQuestion: {
        ...userAnswer.TryoutQuestion,
        createAt: new Date(userAnswer.TryoutQuestion.createAt),
        updateAt: new Date(userAnswer.TryoutQuestion.updateAt),
      },
      TryoutAnswers: userAnswer.TryoutAnswers || null,
    })),
  };

  const showResult =
    new Date(sessionResult?.TryoutSession.Tryout.resultDate) < new Date();

  const AssessmentType = sessionResult?.TryoutSession.assessmentType || '';

  const isAnswerCorrect = (questionId: string) => {
    if (!showResult) return null;

    const userAnswer = sessionResult?.TryoutUserAnswer.find(
      (item) => item.questionId === questionId,
    );
    if (!userAnswer?.TryoutAnswers) return null;

    switch (AssessmentType) {
      case '1-5':
      case '+5/0':
        return userAnswer.TryoutAnswers.value === 5;
      case 'IRT':
        const weight =
          sessionResult.TryoutUserAnswer.find(
            (item) => item.TryoutAnswers?.value !== 0,
          )?.TryoutAnswers?.value || 0;
        return userAnswer.TryoutAnswers.value === weight;
      case '+4/-1/0':
        return userAnswer.TryoutAnswers.value === 4;
      default:
        return false;
    }
  };

  if (!sessionData || sessionData.length === 0) {
    return null;
  }

  return (
    <>
      <Header
        current={0}
        total={-1}
        name=""
        done
      />
      <div className="absolute left-0 top-12 h-full w-full flex-1 bg-workspace pt-4 md:top-14">
        <div
          id="result-container"
          className="flex h-full flex-col-reverse justify-start overflow-y-auto md:flex-row md:justify-center"
        >
          <div className="flex w-full flex-col gap-y-6 pb-20 md:px-6 lg:min-h-[350px]">
            <Result
              sessionResult={normalizedSessionResult}
              isLoading={isLoading}
              resultDate={sessionResult?.TryoutSession.Tryout.resultDate}
              assessmentType={
                normalizedSessionResult.TryoutSession.assessmentType
              }
            />
          </div>
          <div
            id="info"
            className="flex w-full shrink-0 flex-col items-center gap-y-6 px-6 py-4 md:w-[420px] md:py-0"
          >
            <div className="flex w-full flex-col gap-4">
              <Select
                value={`${resultIndex}`}
                onValueChange={(value) => {
                  if (value) setResultIndex(parseInt(value));
                }}
              >
                <SelectTrigger className="w-full border-none bg-transparent px-0 font-semibold shadow-none outline-none">
                  <SelectValue placeholder="Sesi" />
                </SelectTrigger>
                <SelectContent>
                  {sessionData.map((item, i: number) => (
                    <SelectItem
                      key={i}
                      value={`${i}`}
                    >
                      Sesi {i + 1} - {item.TryoutCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex w-full flex-wrap gap-4">
                {sessionData[resultIndex].TryoutQuestion?.map(
                  (item, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        'flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-xl bg-white font-bold text-main-gray-text transition-colors md:hover:bg-black/5',
                        isAnswerCorrect(item.id) === true &&
                          'bg-blue-100 text-green-800 md:hover:bg-blue-200',
                        isAnswerCorrect(item.id) === false &&
                          'bg-red-100 text-red-800 md:hover:bg-red-200',
                        isAnswerCorrect(item.id) === null && 'bg-white',
                      )}
                      onClick={() => {
                        const element = document.querySelector(
                          `#question${i + 1}`,
                        );
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {i + 1}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TryoutResult2;
