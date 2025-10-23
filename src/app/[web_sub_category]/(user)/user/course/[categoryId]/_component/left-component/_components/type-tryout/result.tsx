import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ReactMarkdown from '@/components/ui/react-markdown';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { IconCheckList, IconX } from '@/styles/icon';
import { ArrowLeft, ArrowRight, BarChart, Book, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SetStateAction, useState } from 'react';
import { CourseType } from '../../../../_provider/provider';

// type SessionResultTryout = NonNullable<
//   NonNullable<
//     getCourseUserByCategoryIdProps['data']
//   >[0]['CourseSubChapter'][0]['TryoutSession']
// >['TryoutSessionParticipant'][0];

type SessionResultTryout = NonNullable<
  CourseType[0]['CourseSubChapter'][0]['TryoutSession']
>['TryoutSessionParticipant'][0];

interface Props {
  sessionResult: SessionResultTryout | undefined;
}

export default function ReviewTabTypeTryout({ sessionResult }: Props) {
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
      } else if (AssessmentType === '+1/0') {
        return value === 1;
      }
      return false;
    }).length;
  };

  const getTotalScore = () => {
    const total = sessionResult?.TryoutUserAnswer.reduce(
      (acc, item) => acc + (item.TryoutAnswers?.value || 0),
      0,
    );
    return total || 0;
  };

  const accuracy =
    TotalQuestion > 0 ? (correctAnswer() / TotalQuestion) * 100 : 0;

  const isPassed = accuracy >= 60; // Define passing threshold

  return (
    <div className="space-y-6">
      {/* Hero Banner with Result */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl p-8 shadow-2xl',
          isPassed
            ? 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600'
            : 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600',
        )}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -ml-36 -mb-36"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {isPassed ? (
            <>
              <div className="mb-4 p-4 bg-white/20 backdrop-blur-sm rounded-full">
                <IconCheckList
                  w={56}
                  className="text-white"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                🎉 Selamat, Kamu Lulus! 🎉
              </h1>
              <p className="text-white/90 text-lg mb-6">
                Kerja bagus! Kamu berhasil menyelesaikan tryout dengan baik
              </p>
            </>
          ) : (
            <>
              <div className="mb-4 p-4 bg-white/20 backdrop-blur-sm rounded-full">
                <IconX
                  w={56}
                  className="text-white"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                Jangan Menyerah!
              </h1>
              <p className="text-white/90 text-lg mb-6">
                Terus berlatih dan kamu pasti bisa lebih baik lagi
              </p>
            </>
          )}

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-3 border border-white/30">
              <p className="text-white/80 text-sm font-medium mb-1">Akurasi</p>
              <p className="text-3xl font-bold text-white">
                {accuracy.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-3 border border-white/30">
              <p className="text-white/80 text-sm font-medium mb-1">
                Skor Akhir
              </p>
              <p className="text-3xl font-bold text-white">
                {((getTotalScore() / 5 / TotalQuestion) * 100).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Statistik Tryout</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-900">
              Skor Total
            </CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <BarChart className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-600 mb-2">
              {((getTotalScore() / 5 / TotalQuestion) * 100).toFixed(1)}
            </div>
            <Progress
              value={(getTotalScore() / (TotalQuestion * 5)) * 100}
              className="mt-2 h-2 bg-blue-200"
              classNameThumb="bg-gradient-to-r from-blue-500 to-indigo-600"
            />
            <p className="mt-3 text-xs font-medium text-blue-700">
              {getTotalScore()} dari {TotalQuestion * 5} poin
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-900">
              Akurasi
            </CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-600 mb-2">
              {accuracy.toFixed(1)}%
            </div>
            <Progress
              value={accuracy}
              className="mt-2 h-2 bg-green-200"
              classNameThumb="bg-gradient-to-r from-green-500 to-emerald-600"
            />
            <p className="mt-3 text-xs font-medium text-green-700">
              <span className="font-bold">{correctAnswer()}</span> benar,{' '}
              <span className="font-bold">
                {TotalQuestion - correctAnswer()}
              </span>{' '}
              salah
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900">
              Total Soal
            </CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Book className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-purple-600 mb-2">
              {TotalQuestion}
            </div>
            <div className="flex gap-2 mt-3">
              <div className="flex-1 bg-green-100 rounded-lg p-2 text-center">
                <p className="text-xs text-green-700 font-medium">Benar</p>
                <p className="text-lg font-bold text-green-600">
                  {correctAnswer()}
                </p>
              </div>
              <div className="flex-1 bg-red-100 rounded-lg p-2 text-center">
                <p className="text-xs text-red-700 font-medium">Salah</p>
                <p className="text-lg font-bold text-red-600">
                  {TotalQuestion - correctAnswer()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Navigasi Soal untuk Mobile */}
        <Navigation
          getIsCorrect={getIsCorrect}
          sessionResult={sessionResult}
          setUserAnswerIndex={setUserAnswerIndex}
          userAnswerIndex={userAnswerIndex}
          className="md:hidden"
        />

        {/* Review Jawaban */}
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-800">
              📝 Review Jawaban
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="all">
              <TabsContent value="all">
                {UserAnswers ? (
                  <div className="space-y-6">
                    {/* Question Header */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                      <div className="flex items-center gap-3">
                        {getIsCorrect(safeUserAnswerIndex) === true ? (
                          <div className="p-2 bg-green-500 rounded-full">
                            <IconCheckList
                              w={20}
                              className="text-white"
                            />
                          </div>
                        ) : getIsCorrect(safeUserAnswerIndex) === false ? (
                          <div className="p-2 bg-red-500 rounded-full">
                            <IconX
                              w={20}
                              className="text-white"
                            />
                          </div>
                        ) : null}
                        <div>
                          <span className="font-bold text-lg text-gray-800">
                            Soal #{UserAnswers.TryoutQuestion.number || 'N/A'}
                          </span>
                          <p className="text-xs text-gray-600">
                            {getIsCorrect(safeUserAnswerIndex) === true
                              ? 'Jawaban Benar ✓'
                              : 'Jawaban Salah ✗'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="p-5 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex-shrink-0">
                          Q
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Pertanyaan
                          </p>
                          <ReactMarkdown
                            className="text-gray-800 font-medium"
                            value={
                              UserAnswers.TryoutQuestion.question ||
                              'Tidak ada pertanyaan.'
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Your Answer */}
                    <div
                      className={cn(
                        'p-5 rounded-xl border-2 shadow-sm',
                        getIsCorrect(safeUserAnswerIndex) === false
                          ? 'bg-red-50 border-red-300'
                          : 'bg-blue-50 border-blue-300',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0',
                            getIsCorrect(safeUserAnswerIndex) === false
                              ? 'bg-red-200 text-red-700'
                              : 'bg-blue-200 text-blue-700',
                          )}
                        >
                          U
                        </div>
                        <div className="flex-1">
                          <p
                            className={cn(
                              'text-xs font-semibold uppercase tracking-wide mb-2',
                              getIsCorrect(safeUserAnswerIndex) === false
                                ? 'text-red-700'
                                : 'text-blue-700',
                            )}
                          >
                            Jawaban Kamu
                          </p>
                          <ReactMarkdown
                            className={cn(
                              'font-medium',
                              getIsCorrect(safeUserAnswerIndex) === false
                                ? 'text-red-800'
                                : 'text-blue-800',
                            )}
                            value={
                              UserAnswers.TryoutAnswers?.answer ||
                              'Tidak Dijawab'
                            }
                          />
                        </div>
                        {getIsCorrect(safeUserAnswerIndex) === false && (
                          <IconX className="w-6 h-6 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Correct Answer */}
                    <div className="p-5 bg-green-50 rounded-xl border-2 border-green-300 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-200 text-green-700 font-bold text-sm flex-shrink-0">
                          ✓
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
                            Jawaban Yang Benar
                          </p>
                          <ReactMarkdown
                            className="text-green-800 font-medium"
                            value={getCorrectAnswer()}
                          />
                        </div>
                        <IconCheckList className="w-6 h-6 text-green-600 flex-shrink-0" />
                      </div>
                    </div>

                    {/* Explanation */}
                    {UserAnswers.TryoutQuestion.explanation && (
                      <div className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-200 text-yellow-700 font-bold text-sm flex-shrink-0">
                            💡
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-2">
                              Pembahasan
                            </p>
                            <ReactMarkdown
                              className="text-gray-700 leading-relaxed"
                              value={UserAnswers.TryoutQuestion.explanation}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Book className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      Tidak ada jawaban untuk ditampilkan
                    </p>
                  </div>
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

  const correctCount = Array.from({ length: totalQuestions }).filter(
    (_, index) => getIsCorrect(index) === true,
  ).length;

  return (
    <Card className={cn('border-none shadow-lg', className)}>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">🗺️ Navigasi Soal</CardTitle>
          <div className="text-xs font-semibold px-3 py-1 bg-white rounded-full shadow-sm">
            {userAnswerIndex + 1} / {totalQuestions}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Question Grid */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const isCorrect = getIsCorrect(index);
            const isCurrent = userAnswerIndex === index;
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={cn(
                  'relative h-12 w-12 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-110 border-2',
                  isCurrent && 'ring-2 ring-offset-2 ring-purple-500 shadow-lg',
                  isCorrect === true &&
                    !isCurrent &&
                    'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-500 hover:from-green-500 hover:to-emerald-600 shadow-md',
                  isCorrect === true &&
                    isCurrent &&
                    'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-600 shadow-lg',
                  isCorrect === false &&
                    !isCurrent &&
                    'bg-gradient-to-br from-red-400 to-pink-500 text-white border-red-500 hover:from-red-500 hover:to-pink-600 shadow-md',
                  isCorrect === false &&
                    isCurrent &&
                    'bg-gradient-to-br from-red-500 to-pink-600 text-white border-red-600 shadow-lg',
                  isCorrect === null &&
                    'bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:bg-purple-50',
                )}
                onClick={() => setUserAnswerIndex(index)}
              >
                {isCorrect === true && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                    <IconCheckList
                      w={12}
                      className="text-green-600"
                    />
                  </div>
                )}
                {isCorrect === false && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                    <IconX
                      w={12}
                      className="text-red-600"
                    />
                  </div>
                )}
                {index + 1}
              </Button>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full"></div>
              <p className="text-xs font-semibold text-gray-600">Benar</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{correctCount}</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-full"></div>
              <p className="text-xs font-semibold text-gray-600">Salah</p>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {totalQuestions - correctCount}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3 mb-6">
          <Button
            variant="outline"
            className={cn(
              'flex-1 rounded-xl py-6 font-semibold transition-all',
              userAnswerIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 hover:shadow-md',
            )}
            onClick={() => setUserAnswerIndex((prev) => Math.max(0, prev - 1))}
            disabled={userAnswerIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            className={cn(
              'flex-1 rounded-xl py-6 font-semibold transition-all',
              userAnswerIndex === totalQuestions - 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 hover:shadow-md',
            )}
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

        {/* Pembahasan Button */}
        {sessionResult?.TryoutSession.Document && (
          <Button
            className="w-full h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() =>
              router.push(
                `/user/workspace/${sessionResult?.TryoutSession.Document!.category.id}/${sessionResult.TryoutSession.Document!.id}`,
              )
            }
          >
            <Book className="mr-2 h-5 w-5" />
            Lihat Pembahasan Lengkap
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
