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
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { cn, getInitials } from '@/lib/utils';
import {
  TryoutAnswer,
  TryoutQuestion,
  TryoutSession,
  TryoutSessionParticipant,
  TryoutUserAnswer,
} from '@/types/database';
import { motion } from 'framer-motion';
import {
  BookOpen,
  BotIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
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
    } else if (AssessmentType === '+1/0' || AssessmentType === '0-100') {
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
      } else if (AssessmentType === '+1/0' || AssessmentType === '0-100') {
        return value === 1;
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
      {/* Enhanced Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <FileText
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
            </div>
            <div>
              <h1
                className="text-xl font-bold"
                style={{ color: mainColor }}
              >
                Review Soal
              </h1>
              <p className="text-sm text-gray-600">
                Soal {userAnswerIndex + 1} dari {TotalQuestion} •{' '}
                {correctAnswer()} benar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <Button
                variant={activeView === 'question' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('question')}
                className="rounded-lg px-3 py-2 h-8"
                style={{
                  backgroundColor:
                    activeView === 'question' ? mainColor : 'transparent',
                  color: activeView === 'question' ? 'white' : 'inherit',
                }}
              >
                <FileText className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Soal</span>
              </Button>
              <Button
                variant={activeView === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('grid')}
                className="rounded-lg px-3 py-2 h-8"
                style={{
                  backgroundColor:
                    activeView === 'grid' ? mainColor : 'transparent',
                  color: activeView === 'grid' ? 'white' : 'inherit',
                }}
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Grid</span>
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
              <SelectTrigger className="w-40 h-10 rounded-xl border-2 border-gray-200 bg-white shadow-sm">
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
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: mainColor }}
            >
              {getTotalScore().toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">Skor Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {accuracy.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Akurasi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {correctAnswer()}
            </div>
            <div className="text-xs text-gray-600">Benar</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {TotalQuestion - correctAnswer()}
            </div>
            <div className="text-xs text-gray-600">Salah</div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
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
      </motion.div>
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Question Area */}
      <div className="lg:col-span-3">
        <Card className="border-2 border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <CardHeader
            className="border-b"
            style={{ backgroundColor: `${mainColor}03` }}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: mainColor }}
                >
                  {safeUserAnswerIndex + 1}
                </div>
                Soal {UserAnswers?.TryoutQuestion.number || 'N/A'}
              </CardTitle>
              <div className="flex items-center gap-2">
                {getIsCorrect(safeUserAnswerIndex) === true ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Benar
                  </Badge>
                ) : getIsCorrect(safeUserAnswerIndex) === false ? (
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    <XCircle className="w-4 h-4 mr-1" />
                    Salah
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                    Tidak Dijawab
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {UserAnswers ? (
              <div className="space-y-6">
                {/* Question Content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pertanyaan
                    </h3>
                    {UserAnswers.difficultyQuestion && (
                      <Badge
                        className={cn(
                          'text-sm px-3 py-1',
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
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <BlocknoteEditor
                      value={
                        UserAnswers.TryoutQuestion.question ||
                        'Tidak ada pertanyaan.'
                      }
                      viewOnly
                    />
                  </div>
                </div>

                {/* Answer Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Your Answer */}
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      Jawaban Kamu
                    </h3>
                    <div
                      className="p-4 rounded-xl border-2 min-h-[100px]"
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
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      Jawaban Benar
                    </h3>
                    <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200 min-h-[100px]">
                      <BlocknoteEditor
                        value={getCorrectAnswer()}
                        viewOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Lightbulb
                        className="w-4 h-4"
                        style={{ color: mainColor }}
                      />
                    </div>
                    Pembahasan
                  </h3>
                  <div
                    className="p-6 rounded-xl border-2"
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
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  Tidak ada jawaban untuk ditampilkan
                </p>
              </div>
            )}
          </CardContent>

          {/* Enhanced Navigation Footer */}
          <div className="border-t bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  setUserAnswerIndex((prev: number) => Math.max(0, prev - 1))
                }
                disabled={userAnswerIndex === 0}
                className="flex items-center gap-2 rounded-xl border-2 h-11"
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {userAnswerIndex + 1} / {totalQuestions}
                </span>
                <Progress
                  value={((userAnswerIndex + 1) / totalQuestions) * 100}
                  className="w-20 h-2"
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
                className="flex items-center gap-2 rounded-xl border-2 h-11"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Compact Sidebar */}
      <div className="lg:col-span-1">
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
    <Card className="border-2 border-gray-100 rounded-2xl shadow-lg overflow-hidden">
      <CardHeader
        className="border-b"
        style={{ backgroundColor: `${mainColor}03` }}
      >
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <Grid3X3
            className="w-6 h-6"
            style={{ color: mainColor }}
          />
          Grid Navigasi Soal
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 mb-6">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const isCorrect = getIsCorrect(index);
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'aspect-square rounded-xl font-bold text-sm transition-all duration-200 border-2 flex items-center justify-center relative',
                  userAnswerIndex === index
                    ? 'border-transparent text-white shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600',
                  isCorrect === true &&
                    userAnswerIndex !== index &&
                    'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
                  isCorrect === false &&
                    userAnswerIndex !== index &&
                    'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
                  isCorrect === null &&
                    userAnswerIndex !== index &&
                    'bg-gray-50 hover:bg-gray-100',
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
                {/* Status Indicator */}
                <div className="absolute -top-1 -right-1">
                  {isCorrect === true && (
                    <div className="w-3 h-3 bg-green-500 rounded-full border border-white" />
                  )}
                  {isCorrect === false && (
                    <div className="w-3 h-3 bg-red-500 rounded-full border border-white" />
                  )}
                  {isCorrect === null && (
                    <div className="w-3 h-3 bg-gray-400 rounded-full border border-white" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Grid Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-green-100 border-2 border-green-200 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Benar</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-red-100 border-2 border-red-200 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm text-gray-600">Salah</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">?</span>
            </div>
            <span className="text-sm text-gray-600">Kosong</span>
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
    <div className="space-y-4">
      {/* Enhanced Navigation Header with Stats */}
      <Card className="border-2 border-gray-100 rounded-2xl shadow-lg overflow-hidden">
        <CardHeader
          className="border-b py-3"
          style={{ backgroundColor: `${mainColor}05` }}
        >
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Trophy
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            Navigasi Soal
          </CardTitle>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {stats.correct}
              </div>
              <div className="text-xs text-gray-600">Benar</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {stats.wrong}
              </div>
              <div className="text-xs text-gray-600">Salah</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">
                {stats.unanswered}
              </div>
              <div className="text-xs text-gray-600">Kosong</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Page Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="h-8 px-3 rounded-lg"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">
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
                className="h-8 px-3 rounded-lg"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Question Grid - Responsive */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {getCurrentPageQuestions().map((index) => {
              const isCorrect = getIsCorrect(index);
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'aspect-square rounded-lg font-bold text-xs transition-all duration-200 border flex items-center justify-center relative',
                    userAnswerIndex === index
                      ? 'border-transparent text-white shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600',
                    isCorrect === true &&
                      userAnswerIndex !== index &&
                      'bg-green-100 text-green-700 border-green-200',
                    isCorrect === false &&
                      userAnswerIndex !== index &&
                      'bg-red-100 text-red-700 border-red-200',
                    isCorrect === null &&
                      userAnswerIndex !== index &&
                      'bg-gray-50',
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
                        <div className="w-2 h-2 bg-gray-400 rounded-full border border-white" />
                      )}
                    </div>
                  )}
                </motion.button>
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
                      : 'bg-gray-300 hover:bg-gray-400',
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
      <Card className="border-2 border-gray-100 rounded-2xl shadow-lg">
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
              className="w-full h-10 rounded-xl font-medium text-white shadow-lg"
              style={{ backgroundColor: mainColor }}
              onClick={() => setOpenAI(true)}
            >
              <BotIcon className="w-4 h-4 mr-2" />
              Tanya AI
            </Button>
          </TryoutAI>

          {sessionResult?.TryoutSession.Document && (
            <div className="w-[5px] h-[20px] mx-auto bg-main rounded-2xl"></div>
          )}
          {sessionResult?.TryoutSession.Document && (
            <Link
              href={`/${website_sub_category_id}/user/workspace/${
                sessionResult?.TryoutSession.Document!.category.id
              }/${sessionResult.TryoutSession.Document!.id}`}
            >
              <Button
                className="w-full h-10 rounded-xl font-medium text-white shadow-lg"
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
      <Card className="border-2 border-gray-100 rounded-2xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">
            Keterangan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: mainColor }}
            >
              5
            </div>
            <span className="text-sm text-gray-600">Soal Dipilih</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-100 border border-green-200 rounded-lg flex items-center justify-center relative">
              <span className="text-green-700 text-xs font-bold">1</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />
            </div>
            <span className="text-sm text-gray-600">Jawaban Benar</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-100 border border-red-200 rounded-lg flex items-center justify-center relative">
              <span className="text-red-700 text-xs font-bold">2</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </div>
            <span className="text-sm text-gray-600">Jawaban Salah</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center relative">
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
