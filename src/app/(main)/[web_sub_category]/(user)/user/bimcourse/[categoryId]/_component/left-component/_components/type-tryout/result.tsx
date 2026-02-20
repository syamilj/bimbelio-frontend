import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { IconCheckList, IconX } from '@/styles/icon';
import {
  ArrowLeft,
  ArrowRight,
  Book,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CourseType } from '../../../../_provider/provider';

type SessionResultTryout = NonNullable<
  CourseType[0]['CourseSubChapter'][0]['TryoutSession']
>['TryoutSessionParticipant'][0];

interface Props {
  sessionResult: SessionResultTryout | undefined;
}

export default function ReviewTabTypeTryout({ sessionResult }: Props) {
  const [userAnswerIndex, setUserAnswerIndex] = useState<number>(0);

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
    const val = AssessmentType !== '+4/-1/0' ? 5 : 4;
    return (
      UserAnswers.TryoutQuestion.TryoutAnswers.find((a) => a.value === val)
        ?.answer ?? '....'
    );
  };

  const getIsCorrect = (idx: number): boolean | null => {
    if (!sessionResult) return null;
    const ua = sessionResult.TryoutUserAnswer[idx];
    if (!ua?.TryoutAnswers) return null;
    const v = ua.TryoutAnswers.value;
    if (
      AssessmentType === '1-5' ||
      AssessmentType === '+5/0' ||
      AssessmentType === 'IRT'
    )
      return v === 5;
    if (AssessmentType === '+4/-1/0') return v === 4;
    if (AssessmentType === '+1/0') return v === 1;
    return null;
  };

  const correctCount = () =>
    sessionResult?.TryoutUserAnswer.filter((_, i) => getIsCorrect(i) === true)
      .length ?? 0;

  const getTotalScore = () =>
    sessionResult?.TryoutUserAnswer.reduce(
      (acc, item) => acc + (item.TryoutAnswers?.value || 0),
      0,
    ) ?? 0;

  const accuracy =
    TotalQuestion > 0 ? (correctCount() / TotalQuestion) * 100 : 0;
  const isPassed = accuracy >= 60;
  const score =
    TotalQuestion > 0
      ? ((getTotalScore() / 5 / TotalQuestion) * 100).toFixed(0)
      : '0';

  return (
    <div>
      {/* Score Banner */}
      <div
        className={cn(
          'mx-4 mt-4 px-4 py-8 text-center rounded-3xl',
          isPassed ? 'bg-emerald-500' : 'bg-rose-500',
        )}
      >
        <div
          className={cn(
            'inline-flex items-center justify-center w-14 h-14 rounded-full mb-3',
            isPassed ? 'bg-white/20' : 'bg-white/20',
          )}
        >
          {isPassed ? (
            <CheckCircle2 className="w-7 h-7 text-white" />
          ) : (
            <XCircle className="w-7 h-7 text-white" />
          )}
        </div>
        <h1 className="text-xl font-black text-white mb-1">
          {isPassed ? 'Selamat, Kamu Lulus!' : 'Jangan Menyerah!'}
        </h1>
        <p className="text-sm text-white/80 mb-5">
          {isPassed
            ? 'Kerja bagus! Kamu berhasil.'
            : 'Terus berlatih dan kamu pasti bisa.'}
        </p>
        <div className="flex justify-center gap-3">
          <div className="bg-white/20 rounded-2xl px-5 py-2.5">
            <p className="text-xs text-white/70 font-medium">Akurasi</p>
            <p className="text-2xl font-black text-white">
              {accuracy.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl px-5 py-2.5">
            <p className="text-xs text-white/70 font-medium">Skor</p>
            <p className="text-2xl font-black text-white">{score}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Stats + Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-xl font-black text-emerald-500">
                {correctCount()}
              </div>
              <p className="text-xs text-slate-500 font-medium">Benar</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-rose-400">
                {TotalQuestion - correctCount()}
              </div>
              <p className="text-xs text-slate-500 font-medium">Salah</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-slate-700">
                {TotalQuestion}
              </div>
              <p className="text-xs text-slate-500 font-medium">Total</p>
            </div>
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>Akurasi</span>
            <span className="font-black text-slate-700">
              {accuracy.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={accuracy}
            className="h-1.5 bg-slate-100"
          />
        </div>

        {/* Question Navigation Grid */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-black text-slate-800 mb-3">
            Navigasi Soal
          </h2>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {Array.from({ length: TotalQuestion }).map((_, i) => {
              const isCorrect = getIsCorrect(i);
              const isCurrent = userAnswerIndex === i;
              return (
                <button
                  key={i}
                  onClick={() => setUserAnswerIndex(i)}
                  className={cn(
                    'h-10 w-full rounded-xl font-black text-xs border transition-all',
                    isCurrent && 'ring-2 ring-offset-1 ring-slate-400',
                    isCorrect === true
                      ? 'bg-emerald-500 text-white border-transparent'
                      : isCorrect === false
                        ? 'bg-rose-400 text-white border-transparent'
                        : 'bg-white text-slate-600 border-slate-200',
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              Benar
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-rose-400" />
              Salah
            </div>
          </div>
        </div>

        {/* Review Card */}
        {UserAnswers && (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {/* Question Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                {getIsCorrect(safeUserAnswerIndex) === true ? (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                    <IconCheckList
                      w={14}
                      className="text-white"
                    />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-rose-400 flex items-center justify-center">
                    <IconX
                      w={14}
                      className="text-white"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-black text-slate-800">
                    Soal #{UserAnswers.TryoutQuestion.number}
                  </p>
                  <p className="text-xs text-slate-500">
                    {getIsCorrect(safeUserAnswerIndex) === true
                      ? 'Jawaban Benar'
                      : 'Jawaban Salah'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {safeUserAnswerIndex + 1}/{TotalQuestion}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {/* Question */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <BlocknoteEditor
                  value={UserAnswers.TryoutQuestion.question || ''}
                  viewOnly
                  className="question-content"
                />
              </div>

              {/* User Answer */}
              <div
                className={cn(
                  'rounded-xl border p-3',
                  getIsCorrect(safeUserAnswerIndex) === false
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-blue-50 border-blue-200',
                )}
              >
                <p
                  className={cn(
                    'text-xs font-black uppercase mb-1',
                    getIsCorrect(safeUserAnswerIndex) === false
                      ? 'text-rose-500'
                      : 'text-blue-500',
                  )}
                >
                  Jawaban Kamu
                </p>
                <BlocknoteEditor
                  value={UserAnswers.TryoutAnswers?.answer || 'Tidak Dijawab'}
                  viewOnly
                  className="question-content"
                />
              </div>

              {/* Correct Answer */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                <p className="text-xs font-black uppercase text-emerald-600 mb-1">
                  Jawaban Benar
                </p>
                <BlocknoteEditor
                  value={getCorrectAnswer()}
                  viewOnly
                  className="question-content"
                />
              </div>

              {/* Explanation */}
              {UserAnswers.TryoutQuestion.explanation && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs font-black uppercase text-amber-600 mb-1">
                    Pembahasan
                  </p>
                  <BlocknoteEditor
                    value={UserAnswers.TryoutQuestion.explanation}
                    viewOnly
                    className="question-content"
                  />
                </div>
              )}
            </div>

            {/* Prev / Next */}
            <div className="flex gap-2 px-4 pb-4">
              <button
                onClick={() => setUserAnswerIndex((p) => Math.max(0, p - 1))}
                disabled={userAnswerIndex === 0}
                className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Sebelumnya
              </button>
              <button
                onClick={() =>
                  setUserAnswerIndex((p) => Math.min(TotalQuestion - 1, p + 1))
                }
                disabled={userAnswerIndex === TotalQuestion - 1}
                className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                Selanjutnya
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Pembahasan lengkap */}
        <DocumentLink sessionResult={sessionResult} />
      </div>
    </div>
  );
}

const DocumentLink = ({
  sessionResult,
}: {
  sessionResult: SessionResultTryout | undefined;
}) => {
  const router = useRouter();
  if (!sessionResult?.TryoutSession.Document) return null;
  return (
    <button
      onClick={() =>
        router.push(
          `/user/workspace/${sessionResult.TryoutSession.Document!.category.id}/${sessionResult.TryoutSession.Document!.id}`,
        )
      }
      className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
    >
      <Book className="w-4 h-4" />
      Lihat Pembahasan Lengkap
    </button>
  );
};
