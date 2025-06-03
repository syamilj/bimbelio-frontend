'use client';

import { Badge } from '@/components/ui/badge';
import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { cn, getInitials } from '@/lib/utils';
import { IconCheckList, IconX } from '@/styles/icon';
import {
  TryoutAnswer,
  TryoutQuestion,
  TryoutSession,
  TryoutSessionParticipant,
  TryoutUserAnswer,
} from '@/types/database';
import {
  ArrowLeft,
  ArrowRight,
  BarChart,
  Book,
  Clock,
  Target,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { SetStateAction, useState } from 'react';
import { SessionOptionsProps } from '..';

interface QuestionWithAnswers extends TryoutQuestion {
  TryoutAnswers: TryoutAnswer[];
}

interface UserAnswerWithAnswerQuestion extends TryoutUserAnswer {
  TryoutAnswers: TryoutAnswer | null;
  TryoutQuestion: QuestionWithAnswers;
  difficultyQuestion: {
    message: string;
    value: number;
  } | null;
}

interface TryoutSessionWithDocument extends TryoutSession {
  Document: {
    id: string;
    category: {
      id: string;
    };
  } | null;
}

interface SessionResultTryout extends TryoutSessionParticipant {
  TryoutSession: TryoutSessionWithDocument;
  TryoutUserAnswer: UserAnswerWithAnswerQuestion[];
  totalScore: number;
}

interface Props {
  sessionResult: SessionResultTryout | undefined;
  setResultIndex: React.Dispatch<SetStateAction<number>>;
  resultIndex: number;
  sessionOptions: SessionOptionsProps[];
}

export function ReviewTab({
  sessionResult,
  setResultIndex,
  resultIndex,
  sessionOptions,
}: Props) {
  const [userAnswerIndex, setUserAnswerIndex] = useState<number>(0);

  // Safeguard: Pastikan userAnswerIndex dalam rentang yang valid
  const safeUserAnswerIndex =
    sessionResult &&
    userAnswerIndex >= 0 &&
    userAnswerIndex < sessionResult.TryoutUserAnswer.length
      ? userAnswerIndex
      : 0;

  const UserAnswers = sessionResult?.TryoutUserAnswer[safeUserAnswerIndex];
  const AssessmentType = sessionResult?.TryoutSession.assessmentType || '';
  const TotalQuestion = sessionResult?.TryoutUserAnswer.length || 0;

  const getCorrectAnswer = () => {
    if (!UserAnswers) return '....';
    if (AssessmentType !== '+4/-1/0') {
      const correct = UserAnswers.TryoutQuestion.TryoutAnswers.find(
        (item) => item.value === 5,
      );
      return correct ? correct.answer : '....';
    } else {
      const correct = UserAnswers.TryoutQuestion.TryoutAnswers.find(
        (item) => item.value === 4,
      );
      return correct ? correct.answer : '....';
    }
  };

  const getIsCorrect = (userAnswerIdx: number): boolean | null => {
    if (!sessionResult) return null;
    const userAnswer = sessionResult.TryoutUserAnswer[userAnswerIdx];
    if (!userAnswer || !userAnswer.TryoutAnswers) return null;

    const value = userAnswer.TryoutAnswers.value;

    if (AssessmentType === '1-5' || AssessmentType === '+5/0') {
      return value === 5;
    } else if (AssessmentType === 'IRT') {
      // const weight =
      //   sessionResult.TryoutUserAnswer.find(
      //     (item) => item.TryoutAnswers?.value !== 0,
      //   )?.TryoutAnswers?.value || 0;
      return value === 5;
    } else if (AssessmentType === '+4/-1/0') {
      return value === 4;
    } else if (AssessmentType === '+1/0') {
      return value === 1;
    }

    return null;
  };

  const getSessionDuration = () => {
    if (!sessionResult?.endSession) return 'Coming Soon';
    const startSession = new Date(sessionResult.startSession);
    const endSession = new Date(sessionResult.endSession);

    const diffInMilliseconds = endSession.getTime() - startSession.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;

    // Pastikan angka didefinisikan sebelum dipanggil toString
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const getSecondPerQuestion = () => {
    if (!sessionResult?.endSession) return 'Coming Soon';
    const startSession = new Date(sessionResult.startSession);
    const endSession = new Date(sessionResult.endSession);

    const diffInMilliseconds = endSession.getTime() - startSession.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const questPerSecond =
      sessionResult.TryoutUserAnswer.length > 0
        ? diffInSeconds / sessionResult.TryoutUserAnswer.length
        : 0;

    return `Rata-rata ${questPerSecond.toFixed(2)} detik/soal`;
  };

  const correctAnswer = () => {
    if (!sessionResult) return 0;
    return sessionResult.TryoutUserAnswer.filter((item) => {
      const value = item.TryoutAnswers?.value || 0;
      if (AssessmentType === '1-5' || AssessmentType === '+5/0') {
        return value === 5;
      } else if (AssessmentType === 'IRT') {
        return value === 5;
      } else if (AssessmentType === '+4/-1/0') {
        return value === 4;
      }
      return false;
    }).length;
  };

  const getTotalScore = () => {
    return sessionResult?.totalScore || 0;
  };

  const accuracy =
    TotalQuestion > 0 ? (correctAnswer() / TotalQuestion) * 100 : 0;

  const getPercentageScore = () => {
    if (!sessionResult?.TryoutSession.thresholdValue) return null;
    const value =
      getTotalScore() / (sessionResult?.TryoutSession.thresholdValue || 0);

    return value * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Review Soal</h1>
        <Select
          value={resultIndex != null ? resultIndex.toString() : '0'}
          onValueChange={(value) => {
            if (value !== undefined && value !== null) {
              const parsedValue = parseInt(value, 10);
              if (!isNaN(parsedValue)) {
                setResultIndex(parsedValue);
              }
            }
          }}
        >
          <SelectTrigger className="font-regular h-[45px] w-fit rounded-[.5rem] border-none bg-white px-[1rem] text-sm text-black shadow-cardSoft outline-none">
            <SelectValue placeholder="Pilih Subtes" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(sessionOptions) && sessionOptions.length > 0 ? (
              sessionOptions.map((subtest, index) => (
                <SelectItem
                  key={subtest.id}
                  value={`${index}`}
                >
                  {getInitials(subtest.TryoutCategory || '')} -{' '}
                  {subtest.TryoutSubCategory || 'Subkategori'}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="0">Tidak ada subtes</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skor</CardTitle>
            <BarChart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalScore().toFixed(2)}
            </div>
            {getPercentageScore() && (
              <Progress
                value={getPercentageScore()}
                className="mt-2 h-1"
                classNameThumb="bg-blue-500"
              />
            )}
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              Poin Keseluruhan
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Akurasi</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accuracy.toFixed(2)}%</div>
            <Progress
              value={accuracy}
              className="mt-2 h-1"
              classNameThumb="bg-green-600"
            />
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {correctAnswer()} benar, {TotalQuestion - correctAnswer()} salah
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-yellow-100/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waktu</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getSessionDuration()}</div>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {getSecondPerQuestion()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Soal</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TotalQuestion}</div>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {correctAnswer()} benar, {TotalQuestion - correctAnswer()} salah
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Navigasi Soal untuk Mobile */}
        <Navigation
          getIsCorrect={getIsCorrect}
          sessionResult={sessionResult}
          setUserAnswerIndex={setUserAnswerIndex}
          userAnswerIndex={userAnswerIndex}
          className="md:hidden"
        />
        {/* Review Jawaban */}
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-xl font-bold">Review Jawaban</CardTitle>
          </CardHeader>
          <CardContent className="rounded-[.6rem] border bg-white pt-[.7rem]">
            <Tabs defaultValue="all">
              <TabsContent value="all">
                {UserAnswers ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getIsCorrect(safeUserAnswerIndex) === true ? (
                          <IconCheckList className="text-green-600" />
                        ) : getIsCorrect(safeUserAnswerIndex) === false ? (
                          <IconX className="text-red-600" />
                        ) : null}
                        <span className="font-semibold">
                          Soal {UserAnswers.TryoutQuestion.number || 'N/A'}
                        </span>
                      </div>
                      <Badge
                        className={cn(
                          'bg-white',
                          !UserAnswers.difficultyQuestion && 'hidden',
                          UserAnswers.difficultyQuestion?.value === 1 &&
                            'bg-green-100 text-green-600',
                          UserAnswers.difficultyQuestion?.value === 2 &&
                            'bg-green-200 text-green-600',
                          UserAnswers.difficultyQuestion?.value === 3 &&
                            'bg-orange-100 text-orange-600',
                          UserAnswers.difficultyQuestion?.value === 4 &&
                            'bg-red-100 text-red-600',
                          UserAnswers.difficultyQuestion?.value === 5 &&
                            'bg-red-200 text-red-600',
                        )}
                      >
                        {UserAnswers.difficultyQuestion?.message}
                      </Badge>
                    </div>
                    <BlocknoteEditor
                      value={
                        UserAnswers.TryoutQuestion.question ||
                        'Tidak ada pertanyaan.'
                      }
                      viewOnly
                    />
                    <div className="space-y-2">
                      <p className="font-medium">Jawaban Kamu:</p>
                      <BlocknoteEditor
                        value={
                          UserAnswers.TryoutAnswers?.answer || 'Tidak Dijawab'
                        }
                        viewOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Jawaban Benar:</p>
                      <BlocknoteEditor
                        value={getCorrectAnswer()}
                        viewOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Pembahasan:</p>
                      <BlocknoteEditor
                        value={UserAnswers.TryoutQuestion.explanation || ''}
                        viewOnly
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Tidak ada jawaban untuk ditampilkan.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        {/* Navigasi Soal untuk Desktop */}
        <Navigation
          getIsCorrect={getIsCorrect}
          sessionResult={sessionResult}
          setUserAnswerIndex={setUserAnswerIndex}
          userAnswerIndex={userAnswerIndex}
          className="hidden md:block"
        />
      </div>
    </div>
  );
}

type NavigationProps = {
  sessionResult: SessionResultTryout | undefined;
  userAnswerIndex: number;
  getIsCorrect: (userAnswerIndex: number) => boolean | null;
  setUserAnswerIndex: React.Dispatch<SetStateAction<number>>;
  className?: string;
};

const Navigation = ({
  sessionResult,
  userAnswerIndex,
  getIsCorrect,
  setUserAnswerIndex,
  className,
}: NavigationProps) => {
  const router = useRouter();
  const totalQuestions = Array.isArray(sessionResult?.TryoutUserAnswer)
    ? sessionResult.TryoutUserAnswer.length
    : 0;

  return (
    <Card className={cn('bg-transparent shadow-none', className)}>
      <CardHeader>
        <CardTitle>Navigasi Soal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const isCorrect = getIsCorrect(index);
            return (
              <Button
                key={index}
                variant={userAnswerIndex === index ? 'default' : 'outline'}
                className={cn(
                  'flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[.5rem] bg-white font-bold text-main-gray-text hover:bg-white md:hover:bg-black/5',
                  isCorrect === true &&
                    'bg-green-100 text-green-800 hover:bg-green-100 md:hover:bg-green-200',
                  isCorrect === false &&
                    'bg-red-100 text-red-800 hover:bg-red-100 md:hover:bg-red-200',
                  isCorrect === null && 'bg-white hover:bg-white',
                )}
                onClick={() => setUserAnswerIndex(index)}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center gap-[1rem] md:justify-center">
          <Button
            variant="outline"
            onClick={() => setUserAnswerIndex((prev) => Math.max(0, prev - 1))}
            disabled={userAnswerIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setUserAnswerIndex((prev) =>
                Math.min(totalQuestions - 1, prev + 1),
              )
            }
            disabled={userAnswerIndex === totalQuestions - 1}
          >
            Selanjutnya
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="w-full flex justify-end mt-8">
          {sessionResult?.TryoutSession.Document && (
            <Button
              className="h-[unset] bg-main hover:bg-main/85 py-[.6rem] px-[1rem] rounded-[.6rem]"
              onClick={() =>
                router.push(
                  `/${website_sub_category_id}/user/workspace/${
                    sessionResult?.TryoutSession.Document!.category.id
                  }/${sessionResult.TryoutSession.Document!.id}`,
                )
              }
            >
              Pembahasan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewTab;
