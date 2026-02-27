'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
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
import {
  website_sub_category_id,
  website_sub_category_id_params,
} from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import {
  TryoutAnswer,
  TryoutQuestion,
  TryoutSession,
  TryoutSessionParticipant,
  TryoutUserAnswer,
} from '@/types/database';
import {
  BookOpen,
  BotIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gem,
  Grid3X3,
  Lightbulb,
  Trophy,
  User,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { SessionOptionsProps } from '..';
import { TryoutAI } from './tryout-ai';

interface CourseSubChapterRef {
  id: string;
  title: string;
  type: string;
  premium: boolean;
}

interface CourseChapterRef {
  id: string;
  title: string;
  categoryId: string;
  CourseSubChapter: CourseSubChapterRef[];
}

interface PivotCourseChapterRef {
  id: string;
  CourseChapter: CourseChapterRef;
}

interface QuestionWithAnswers extends TryoutQuestion {
  TryoutAnswers: TryoutAnswer[];
  Pivot_TryoutQuestion_CourseChapter?: PivotCourseChapterRef[];
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
  participantId: string;
}

interface NavigationProps {
  sessionResult: SessionResultTryout | undefined;
  userAnswerIndex: number;
  getIsCorrect: (userAnswerIdx: number) => boolean | null;
  setUserAnswerIndex: React.Dispatch<SetStateAction<number>>;
  className?: string;
}

export function ReviewTab({
  sessionResult,
  setResultIndex,
  resultIndex,
  sessionOptions,
  participantId,
}: Props) {
  const { websiteSubCategory } = useWebsiteSubCategory();

  const [userAnswerIndex, setUserAnswerIndex] = useState<number>(0);
  const [activeView, setActiveView] = useState<'question' | 'grid'>('question');

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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

  const notAnswered =
    sessionResult?.TryoutUserAnswer.reduce((acc, answer) => {
      if (!answer.TryoutAnswers) return acc + 1;
      return acc;
    }, 0) || 0;

  const getCorrectOptionByQuestion = (
    question: QuestionWithAnswers | undefined,
  ) => {
    if (!question?.TryoutAnswers || question.TryoutAnswers.length === 0) {
      return null;
    }

    return question.TryoutAnswers.reduce((prev, current) => {
      return current.value > prev.value ? current : prev;
    });
  };

  const getCorrectAnswer = () => {
    if (!UserAnswers) return '....';
    const correct = getCorrectOptionByQuestion(UserAnswers.TryoutQuestion);
    return correct?.answer || '....';
  };

  const getIsCorrect = (userAnswerIdx: number): boolean | null => {
    if (!sessionResult) return null;
    const userAnswer = sessionResult.TryoutUserAnswer[userAnswerIdx];
    if (!userAnswer || !userAnswer.TryoutAnswers) return null;

    const correctOption = getCorrectOptionByQuestion(userAnswer.TryoutQuestion);
    if (!correctOption) return null;

    return userAnswer.TryoutAnswers.id === correctOption.id;
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
      if (!item.TryoutAnswers) return false;
      const correctOption = getCorrectOptionByQuestion(item.TryoutQuestion);
      if (!correctOption) return false;
      return item.TryoutAnswers.id === correctOption.id;
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
    <div className="space-y-4">
      {/* Enhanced Compact Header */}
      <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-3xl flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <FileText
                className="w-5 h-5 md:w-6 md:h-6"
                style={{ color: mainColor }}
              />
            </div>
            <div>
              <h1
                className="text-base md:text-xl font-black"
                style={{ color: mainColor }}
              >
                Review Soal
              </h1>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Soal {userAnswerIndex + 1} dari {TotalQuestion} •{' '}
                {correctAnswer()} benar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto">
            {/* View Toggle */}
            <div className="flex bg-slate-100 rounded-3xl p-1">
              <Button
                variant={activeView === 'question' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('question')}
                className="rounded-3xl px-3 py-1.5 h-8 text-xs font-black"
                style={{
                  backgroundColor:
                    activeView === 'question' ? mainColor : 'transparent',
                  color: activeView === 'question' ? 'white' : 'inherit',
                }}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                <span>Soal</span>
              </Button>
              <Button
                variant={activeView === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('grid')}
                className="rounded-3xl px-3 py-1.5 h-8 text-xs font-black"
                style={{
                  backgroundColor:
                    activeView === 'grid' ? mainColor : 'transparent',
                  color: activeView === 'grid' ? 'white' : 'inherit',
                }}
              >
                <Grid3X3 className="w-3.5 h-3.5 mr-1.5" />
                <span>Navigasi</span>
              </Button>
            </div>

            {/* Subtest Selector */}
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
              <SelectTrigger className="w-auto min-w-[120px] max-w-[180px] h-8 rounded-3xl border border-slate-200 bg-white shadow-sm text-xs font-black">
                <SelectValue placeholder="Pilih Subtes" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(sessionOptions) && sessionOptions.length > 0 ? (
                  sessionOptions.map((subtest, index) => (
                    <SelectItem
                      key={subtest.id}
                      value={`${index}`}
                    >
                      {subtest.TryoutSubCategory ||
                        subtest.name ||
                        'Subkategori'}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="0">Tidak ada subtes</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats Bar - Horizontal Scroll on Mobile - More Compact */}
        <div className="overflow-x-auto no-scrollbar mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-200">
          <div className="flex lg:grid lg:grid-cols-5 gap-3 md:gap-4 min-w-max lg:min-w-0">
            <div className="text-center min-w-[100px] md:min-w-[120px] lg:min-w-0">
              <div
                className="text-xl md:text-2xl font-black leading-none"
                style={{ color: mainColor }}
              >
                {getTotalScore().toFixed(0)}
              </div>
              <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">
                Skor Total
              </div>
            </div>
            <div className="text-center min-w-[100px] md:min-w-[120px] lg:min-w-0">
              <div className="text-xl md:text-2xl font-black text-green-600 leading-none">
                {accuracy.toFixed(1)}%
              </div>
              <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">
                Akurasi
              </div>
            </div>
            <div className="text-center min-w-[100px] md:min-w-[120px] lg:min-w-0">
              <div className="text-xl md:text-2xl font-black text-blue-600 leading-none">
                {correctAnswer()}
              </div>
              <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">
                Benar
              </div>
            </div>
            <div className="text-center min-w-[100px] md:min-w-[120px] lg:min-w-0">
              <div className="text-xl md:text-2xl font-black text-red-600 leading-none">
                {TotalQuestion - correctAnswer() - notAnswered}
              </div>
              <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">
                Salah
              </div>
            </div>
            <div className="text-center min-w-[100px] md:min-w-[120px] lg:min-w-0">
              <div className="text-xl md:text-2xl font-black text-gray-600 leading-none">
                {notAnswered}
              </div>
              <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">
                Kosong
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {activeView === 'question' ? (
          <QuestionView
            UserAnswers={UserAnswers}
            safeUserAnswerIndex={safeUserAnswerIndex}
            getIsCorrect={getIsCorrect}
            getCorrectAnswer={getCorrectAnswer}
            mainColor={mainColor}
            userAnswerIndex={userAnswerIndex}
            setUserAnswerIndex={setUserAnswerIndex}
            totalQuestions={TotalQuestion}
            sessionResult={sessionResult}
            participantId={participantId}
          />
        ) : (
          <GridView
            sessionResult={sessionResult}
            getIsCorrect={getIsCorrect}
            setUserAnswerIndex={setUserAnswerIndex}
            userAnswerIndex={userAnswerIndex}
            setActiveView={setActiveView}
            mainColor={mainColor}
          />
        )}
      </div>
    </div>
  );
}

// Question View Component
const QuestionView = ({
  UserAnswers,
  safeUserAnswerIndex,
  getIsCorrect,
  getCorrectAnswer,
  mainColor,
  userAnswerIndex,
  setUserAnswerIndex,
  totalQuestions,
  sessionResult,
  participantId,
}: {
  UserAnswers: UserAnswerWithAnswerQuestion | undefined;
  safeUserAnswerIndex: number;
  getIsCorrect: (userAnswerIdx: number) => boolean | null;
  getCorrectAnswer: () => string;
  mainColor: string;
  userAnswerIndex: number;
  setUserAnswerIndex: Dispatch<SetStateAction<number>>;
  totalQuestions: number;
  sessionResult: SessionResultTryout | undefined;
  participantId: string;
}) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Main Question Area */}
      <div className="lg:col-span-3">
        <Card className="border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <CardHeader
            className="border-b py-3 md:py-4"
            style={{ backgroundColor: `${mainColor}03` }}
          >
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base md:text-xl font-black flex items-center gap-2 md:gap-3">
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-3xl flex items-center justify-center text-white font-black text-sm md:text-base flex-shrink-0"
                  style={{ backgroundColor: mainColor }}
                >
                  {safeUserAnswerIndex + 1}
                </div>
                <span className="text-sm md:text-xl">
                  Soal {UserAnswers?.TryoutQuestion.number || 'N/A'}
                </span>
              </CardTitle>
              <div className="flex items-center gap-1 md:gap-2">
                {getIsCorrect(safeUserAnswerIndex) === true ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] md:text-xs px-2 py-0.5">
                    <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 mr-0.5 md:mr-1" />
                    <span className="hidden sm:inline">Benar</span>
                    <span className="sm:hidden">✓</span>
                  </Badge>
                ) : getIsCorrect(safeUserAnswerIndex) === false ? (
                  <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] md:text-xs px-2 py-0.5">
                    <XCircle className="w-3 h-3 md:w-4 md:h-4 mr-0.5 md:mr-1" />
                    <span className="hidden sm:inline">Salah</span>
                    <span className="sm:hidden">✗</span>
                  </Badge>
                ) : (
                  <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px] md:text-xs px-2 py-0.5">
                    Kosong
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 md:p-6">
            {UserAnswers ? (
              <div className="space-y-4 md:space-y-6">
                {/* Question Content */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm md:text-lg font-black text-slate-900">
                      Pertanyaan
                    </h3>
                    {UserAnswers.difficultyQuestion && (
                      <Badge
                        className={cn(
                          'text-[10px] md:text-sm px-2 md:px-3 py-0.5 md:py-1',
                          UserAnswers.difficultyQuestion?.value === 1 &&
                            'bg-green-100 text-green-700 border-green-200',
                          UserAnswers.difficultyQuestion?.value === 2 &&
                            'bg-green-200 text-green-700 border-green-300',
                          UserAnswers.difficultyQuestion?.value === 3 &&
                            'bg-orange-100 text-orange-700 border-orange-200',
                          UserAnswers.difficultyQuestion?.value === 4 &&
                            'bg-red-100 text-red-700 border-red-200',
                          UserAnswers.difficultyQuestion?.value === 5 &&
                            'bg-red-200 text-red-700 border-red-300',
                        )}
                      >
                        {UserAnswers.difficultyQuestion?.message}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 md:p-6 bg-slate-50 rounded-3xl">
                    <BlocknoteEditor
                      value={
                        UserAnswers.TryoutQuestion.question ||
                        'Tidak ada pertanyaan.'
                      }
                      viewOnly
                    />
                  </div>
                </div>

                {/* Answer Comparison - Stack on Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Your Answer */}
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-sm md:text-base font-black flex items-center gap-1.5 md:gap-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-3xl flex items-center justify-center">
                        <User className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      </div>
                      Jawaban Kamu
                    </h3>
                    <div
                      className="p-3 md:p-4 rounded-3xl border min-h-[80px] md:min-h-[100px]"
                      style={{
                        backgroundColor:
                          getIsCorrect(safeUserAnswerIndex) === true
                            ? '#f0fdf4'
                            : getIsCorrect(safeUserAnswerIndex) === false
                              ? '#fef2f2'
                              : '#f9fafb',
                        borderColor:
                          getIsCorrect(safeUserAnswerIndex) === true
                            ? '#bbf7d0'
                            : getIsCorrect(safeUserAnswerIndex) === false
                              ? '#fecaca'
                              : '#e5e7eb',
                      }}
                    >
                      <BlocknoteEditor
                        value={
                          UserAnswers.TryoutAnswers?.answer || 'Tidak Dijawab'
                        }
                        viewOnly
                      />
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-sm md:text-base font-black flex items-center gap-1.5 md:gap-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded-3xl flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                      </div>
                      Jawaban Benar
                    </h3>
                    <div className="p-3 md:p-4 bg-green-50 rounded-3xl border border-green-200 min-h-[80px] md:min-h-[100px]">
                      <BlocknoteEditor
                        value={getCorrectAnswer()}
                        viewOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-sm md:text-base font-black flex items-center gap-1.5 md:gap-2">
                    <div
                      className="w-5 h-5 md:w-6 md:h-6 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Lightbulb
                        className="w-3 h-3 md:w-4 md:h-4"
                        style={{ color: mainColor }}
                      />
                    </div>
                    Pembahasan
                  </h3>
                  <div
                    className="p-4 md:p-6 rounded-3xl border"
                    style={{
                      backgroundColor: `${mainColor}05`,
                      borderColor: `${mainColor}20`,
                    }}
                  >
                    <BlocknoteEditor
                      value={
                        UserAnswers.TryoutQuestion.explanation ||
                        'Belum ada pembahasan untuk soal ini.'
                      }
                      viewOnly
                    />
                  </div>
                </div>

                {/* Saran Baca Materi BimCourse */}
                {UserAnswers.TryoutQuestion
                  .Pivot_TryoutQuestion_CourseChapter &&
                  UserAnswers.TryoutQuestion.Pivot_TryoutQuestion_CourseChapter
                    .length > 0 && (
                    <div className="space-y-2 md:space-y-3">
                      <h3 className="text-sm md:text-base font-black flex items-center gap-1.5 md:gap-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-100 rounded-3xl flex items-center justify-center">
                          <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                        </div>
                        Saran Baca Materi
                      </h3>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 md:p-5 space-y-3">
                        <p className="text-xs text-emerald-700 font-medium">
                          Pelajari materi berikut di BimCourse untuk memperkuat
                          pemahamanmu pada soal ini:
                        </p>
                        {UserAnswers.TryoutQuestion.Pivot_TryoutQuestion_CourseChapter.map(
                          (pivot) => (
                            <div
                              key={pivot.id}
                              className="space-y-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                <span className="text-xs md:text-sm font-black text-emerald-800">
                                  {pivot.CourseChapter.title}
                                </span>
                              </div>
                              {pivot.CourseChapter.CourseSubChapter.length >
                                0 && (
                                <div className="ml-3.5 flex flex-wrap gap-2">
                                  {pivot.CourseChapter.CourseSubChapter.map(
                                    (sub) => (
                                      <Link
                                        key={sub.id}
                                        href={`/${website_sub_category_id_params}/user/bimcourse/${pivot.CourseChapter.categoryId}/study?sub=${sub.id}&tab=chat`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 rounded-3xl text-xs font-semibold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-sm"
                                      >
                                        <BookOpen className="w-3 h-3 flex-shrink-0" />
                                        <span className="line-clamp-1 max-w-[180px]">
                                          {sub.title}
                                        </span>
                                        {sub.premium && (
                                          <Gem className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                        )}
                                      </Link>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 md:w-8 md:h-8 text-slate-400" />
                </div>
                <p className="text-sm md:text-base text-slate-500 font-medium">
                  Tidak ada jawaban untuk ditampilkan
                </p>
              </div>
            )}
          </CardContent>

          {/* Enhanced Navigation Footer - Sticky on Mobile */}
          <div className="border-t bg-slate-50 p-3 md:p-4 sticky bottom-0 z-10 lg:static">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setUserAnswerIndex((prev: number) => Math.max(0, prev - 1))
                }
                disabled={userAnswerIndex === 0}
                className="flex items-center gap-1.5 md:gap-2 rounded-3xl border h-9 md:h-11 text-xs md:text-sm px-3 md:px-4"
              >
                <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
                <span className="sm:hidden">Prev</span>
              </Button>

              {/* Mobile AI Button - More Prominent */}
              <TryoutAI
                participantId={participantId}
                number={userAnswerIndex + 1}
              >
                <Button
                  className="lg:hidden flex items-center gap-1.5 h-9 px-3 rounded-3xl shadow-md text-white text-xs font-semibold"
                  style={{ backgroundColor: mainColor }}
                >
                  <BotIcon className="w-4 h-4" />
                  <span>BimBot AI</span>
                </Button>
              </TryoutAI>

              <div className="hidden sm:flex items-center gap-1.5 md:gap-2">
                <span className="text-xs md:text-sm text-slate-600 font-black whitespace-nowrap">
                  {userAnswerIndex + 1} / {totalQuestions}
                </span>
                <Progress
                  value={((userAnswerIndex + 1) / totalQuestions) * 100}
                  className="w-16 md:w-20 h-1.5 md:h-2"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  setUserAnswerIndex((prev: number) =>
                    Math.min(totalQuestions - 1, prev + 1),
                  )
                }
                disabled={userAnswerIndex === totalQuestions - 1}
                className="flex items-center gap-1.5 md:gap-2 rounded-3xl border h-9 md:h-11 text-xs md:text-sm px-3 md:px-4"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Compact Sidebar - Hidden on Mobile */}
      <div className="hidden lg:block lg:col-span-1">
        <CompactNavigation
          participantId={participantId}
          sessionResult={sessionResult}
          getIsCorrect={getIsCorrect}
          setUserAnswerIndex={setUserAnswerIndex}
          userAnswerIndex={userAnswerIndex}
          mainColor={mainColor}
        />
      </div>
    </div>
  );
};

// Grid View Component
const GridView = ({
  sessionResult,
  getIsCorrect,
  setUserAnswerIndex,
  userAnswerIndex,
  setActiveView,
  mainColor,
}: any) => {
  const totalQuestions = Array.isArray(sessionResult?.TryoutUserAnswer)
    ? sessionResult.TryoutUserAnswer.length
    : 0;

  return (
    <Card className="border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <CardHeader
        className="border-b py-3 md:py-4"
        style={{ backgroundColor: `${mainColor}03` }}
      >
        <CardTitle className="text-base md:text-xl font-black flex items-center gap-2 md:gap-3">
          <Grid3X3
            className="w-5 h-5 md:w-6 md:h-6"
            style={{ color: mainColor }}
          />
          Grid Navigasi Soal
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 md:gap-3 mb-4 md:mb-6">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const isCorrect = getIsCorrect(index);
            return (
              <button
                key={index}
                className={cn(
                  'aspect-square rounded-3xl font-black text-xs md:text-sm transition-all duration-200 border flex items-center justify-center relative hover:scale-105 active:scale-95',
                  userAnswerIndex === index
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600',
                  isCorrect === true &&
                    userAnswerIndex !== index &&
                    'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
                  isCorrect === false &&
                    userAnswerIndex !== index &&
                    'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
                  isCorrect === null &&
                    userAnswerIndex !== index &&
                    'bg-slate-50 hover:bg-slate-100',
                )}
                style={{
                  backgroundColor:
                    userAnswerIndex === index ? mainColor : undefined,
                }}
                onClick={() => {
                  setUserAnswerIndex(index);
                  setActiveView('question');
                }}
              >
                {index + 1}
                {/* Status Indicator - Smaller on Mobile */}
                <div className="absolute -top-0.5 md:-top-1 -right-0.5 md:-right-1">
                  {isCorrect === true && (
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full border border-white" />
                  )}
                  {isCorrect === false && (
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full border border-white" />
                  )}
                  {isCorrect === null && (
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-slate-400 rounded-full border border-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Grid Legend - More Compact */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
          <div className="flex items-center justify-center gap-1.5 md:gap-2">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-green-100 border border-green-200 rounded-3xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
            </div>
            <span className="text-xs md:text-sm text-slate-600 font-medium">
              Benar
            </span>
          </div>
          <div className="flex items-center justify-center gap-1.5 md:gap-2">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-red-100 border border-red-200 rounded-3xl flex items-center justify-center flex-shrink-0">
              <XCircle className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
            </div>
            <span className="text-xs md:text-sm text-slate-600 font-medium">
              Salah
            </span>
          </div>
          <div className="flex items-center justify-center gap-1.5 md:gap-2">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-slate-100 border border-slate-200 rounded-3xl flex items-center justify-center flex-shrink-0">
              <span className="text-slate-400 text-xs">?</span>
            </div>
            <span className="text-xs md:text-sm text-slate-600 font-medium">
              Kosong
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Compact Navigation Component
const CompactNavigation = ({
  sessionResult,
  getIsCorrect,
  setUserAnswerIndex,
  userAnswerIndex,
  mainColor,
  participantId,
}: {
  sessionResult: SessionResultTryout | undefined;
  getIsCorrect: (userAnswerIdx: number) => boolean | null;
  setUserAnswerIndex: Dispatch<SetStateAction<number>>;
  userAnswerIndex: number;
  mainColor: string;
  participantId: string;
}) => {
  const [openAI, setOpenAI] = useState<boolean>(false);

  const totalQuestions = Array.isArray(sessionResult?.TryoutUserAnswer)
    ? sessionResult.TryoutUserAnswer.length
    : 0;

  // Enhanced pagination for navigation
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 20; // Increased from 12 to 20
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  // Calculate current page based on selected question
  React.useEffect(() => {
    const newPage = Math.floor(userAnswerIndex / questionsPerPage);
    setCurrentPage(newPage);
  }, [userAnswerIndex, questionsPerPage]);

  const getCurrentPageQuestions = () => {
    const startIndex = currentPage * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);
    return Array.from(
      { length: endIndex - startIndex },
      (_, i) => startIndex + i,
    );
  };

  const getQuestionStats = () => {
    if (!sessionResult) return { correct: 0, wrong: 0, unanswered: 0 };

    let correct = 0,
      wrong = 0,
      unanswered = 0;

    for (let i = 0; i < totalQuestions; i++) {
      const isCorrect = getIsCorrect(i);
      if (isCorrect === true) correct++;
      else if (isCorrect === false) wrong++;
      else unanswered++;
    }

    return { correct, wrong, unanswered };
  };

  const stats = getQuestionStats();

  const questionNumber = userAnswerIndex + 1;

  return (
    <div className="space-y-3">
      {/* Enhanced Navigation Header with Stats - More Compact */}
      <Card className="border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <CardHeader
          className="border-b py-2"
          style={{ backgroundColor: `${mainColor}05` }}
        >
          <CardTitle className="text-sm font-black flex items-center gap-1.5">
            <Trophy
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            Navigasi Soal
          </CardTitle>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="text-center">
              <div className="text-base font-black text-green-600 leading-none">
                {stats.correct}
              </div>
              <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                Benar
              </div>
            </div>
            <div className="text-center">
              <div className="text-base font-black text-red-600 leading-none">
                {stats.wrong}
              </div>
              <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                Salah
              </div>
            </div>
            <div className="text-center">
              <div className="text-base font-black text-slate-600 leading-none">
                {stats.unanswered}
              </div>
              <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                Kosong
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {/* Page Navigation - More Compact */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="h-7 px-2 rounded-3xl"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-600 font-medium">
                  {currentPage * questionsPerPage + 1}-
                  {Math.min(
                    (currentPage + 1) * questionsPerPage,
                    totalQuestions,
                  )}{' '}
                  dari {totalQuestions}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="h-7 px-2 rounded-3xl"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Question Grid - More Compact */}
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {getCurrentPageQuestions().map((index) => {
              const isCorrect = getIsCorrect(index);
              return (
                <button
                  key={index}
                  className={cn(
                    'aspect-square rounded-3xl font-black text-xs transition-all duration-200 border flex items-center justify-center relative hover:scale-105 active:scale-95',
                    userAnswerIndex === index
                      ? 'border-transparent text-white shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600',
                    isCorrect === true &&
                      userAnswerIndex !== index &&
                      'bg-green-100 text-green-700 border-green-200',
                    isCorrect === false &&
                      userAnswerIndex !== index &&
                      'bg-red-100 text-red-700 border-red-200',
                    isCorrect === null &&
                      userAnswerIndex !== index &&
                      'bg-slate-50',
                  )}
                  style={{
                    backgroundColor:
                      userAnswerIndex === index ? mainColor : undefined,
                  }}
                  onClick={() => setUserAnswerIndex(index)}
                >
                  {index + 1}

                  {/* Enhanced Status Indicator */}
                  {userAnswerIndex !== index && (
                    <div className="absolute -top-1 -right-1">
                      {isCorrect === true && (
                        <div className="w-2 h-2 bg-green-500 rounded-full border border-white" />
                      )}
                      {isCorrect === false && (
                        <div className="w-2 h-2 bg-red-500 rounded-full border border-white" />
                      )}
                      {isCorrect === null && (
                        <div className="w-2 h-2 bg-slate-400 rounded-full border border-white" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Page Indicators */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => setCurrentPage(pageIndex)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-200',
                    currentPage === pageIndex
                      ? 'w-4'
                      : 'bg-slate-300 hover:bg-slate-400',
                  )}
                  style={{
                    backgroundColor:
                      currentPage === pageIndex ? mainColor : undefined,
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-2 border-gray-100 rounded-3xl shadow-lg">
        <CardContent className="p-4 space-y-3">
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open</Button>
            </SheetTrigger>
            <SheetContent className="w-[600px]">
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="grid gap-3">
                  <Label htmlFor="sheet-demo-name">Name</Label>
                  <Input
                    id="sheet-demo-name"
                    defaultValue="Pedro Duarte"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="sheet-demo-username">Username</Label>
                  <Input
                    id="sheet-demo-username"
                    defaultValue="@peduarte"
                  />
                </div>
              </div>
              <SheetFooter>
                <Button type="submit">Save changes</Button>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet> */}
          <TryoutAI
            participantId={participantId}
            number={questionNumber}
          >
            <Button
              className="w-full h-10 rounded-3xl font-medium text-white shadow-lg"
              style={{ backgroundColor: mainColor }}
              onClick={() => setOpenAI(true)}
            >
              <BotIcon className="w-4 h-4 mr-2" />
              Tanya AI
            </Button>
          </TryoutAI>

          {sessionResult?.TryoutSession.Document && (
            <div className="w-[5px] h-[20px] mx-auto bg-main rounded-3xl"></div>
          )}
          {sessionResult?.TryoutSession.Document && (
            <Link
              href={`/${website_sub_category_id}/user/workspace/${
                sessionResult?.TryoutSession.Document!.category.id
              }/${sessionResult.TryoutSession.Document!.id}`}
            >
              <Button
                className="w-full h-10 rounded-3xl font-medium text-white shadow-lg"
                style={{ backgroundColor: mainColor }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Pembahasan
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Legend */}
      <Card className="border-2 border-gray-100 rounded-3xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">
            Keterangan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-3xl flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: mainColor }}
            >
              5
            </div>
            <span className="text-sm text-gray-600">Soal Dipilih</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-100 border border-green-200 rounded-3xl flex items-center justify-center relative">
              <span className="text-green-700 text-xs font-bold">1</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />
            </div>
            <span className="text-sm text-gray-600">Jawaban Benar</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-100 border border-red-200 rounded-3xl flex items-center justify-center relative">
              <span className="text-red-700 text-xs font-bold">2</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </div>
            <span className="text-sm text-gray-600">Jawaban Salah</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-100 border border-gray-200 rounded-3xl flex items-center justify-center relative">
              <span className="text-gray-500 text-xs font-bold">3</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full border border-white" />
            </div>
            <span className="text-sm text-gray-600">Tidak Dijawab</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewTab;
