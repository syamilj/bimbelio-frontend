import ButtonPayment from '@/app/[web_sub_category]/(user)/user/_components/button-payment';
import { useSession } from '@/components/provider/session-provider-auth';
import ReactMarkdown from '@/components/ui/react-markdown';
import { SpinnerPageCentered } from '@/components/ui/spinner';
import {
  cn,
  getDateString,
  getHoursDetail,
  replaceLatexNotation,
} from '@/lib/utils';
import {
  IconAward,
  IconCircleLoop,
  IconSuccess,
  IconTimer,
  IconTimer2,
  IconX,
} from '@/styles/icon';
import {
  TryoutAnswer,
  TryoutQuestion,
  TryoutSession,
  TryoutSessionParticipant,
  TryoutUserAnswer,
} from '@/types/database';
import 'katex/dist/katex.min.css';
import CountdownResult from './countdown-result';

interface QuestionWithAnswers extends TryoutQuestion {
  TryoutAnswers: TryoutAnswer[];
}

interface UserAnswerWithAnswerQuestion extends TryoutUserAnswer {
  TryoutAnswers: TryoutAnswer | null;
  TryoutQuestion: QuestionWithAnswers;
}

interface SessionResult extends TryoutSessionParticipant {
  TryoutSession: TryoutSession;
  TryoutUserAnswer: UserAnswerWithAnswerQuestion[];
}

interface ResultProps {
  sessionResult: SessionResult;
  isLoading: boolean;
  resultDate: Date;
  assessmentType: string;
}

export default function Result({
  sessionResult,
  isLoading,
  resultDate,
  assessmentType,
}: ResultProps) {
  const { data: session } = useSession();

  if (isLoading) return <SpinnerPageCentered />;

  const getIsCorrect = (userAnswerIndex: number): boolean => {
    if (!sessionResult) return false;

    const userAnswer = sessionResult.TryoutUserAnswer[userAnswerIndex];
    if (!userAnswer || !userAnswer.TryoutAnswers) return false;

    switch (assessmentType) {
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

  const correctAnswer =
    sessionResult?.TryoutUserAnswer.filter((item) =>
      getIsCorrect(sessionResult.TryoutUserAnswer.indexOf(item)),
    ).length || 0;

  const showResult = new Date(resultDate) < new Date();

  const getSessionDuration = (): string => {
    if (!sessionResult.endSession) return 'Coming Soon';
    const startSession = new Date(sessionResult.startSession);
    const endSession = new Date(sessionResult.endSession);
    const diffInMilliseconds = endSession.getTime() - startSession.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const getFinalScore = () => {
    const thresholdValue = sessionResult.TryoutSession.thresholdValue || null;
    const total = sessionResult.TryoutUserAnswer.reduce(
      (acc, item) => acc + (item.TryoutAnswers?.value || 0),
      0,
    );
    const totalCorrect = sessionResult.TryoutUserAnswer.filter((_, i) =>
      getIsCorrect(i),
    ).length;
    const accuracy = (
      (totalCorrect / sessionResult.TryoutUserAnswer.length) *
      100
    ).toFixed(2);
    return { total, accuracy, thresholdValue };
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-8 pt-4">
      {!showResult ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white py-4">
          <IconTimer2 className="my-2 text-main-gray-text w-46" />
          <p className="font-semibold">Penilaian dapat dilihat dalam</p>
          <div className="flex flex-col items-center">
            <p className="text-2xl font-medium text-orange-500/80">
              <CountdownResult targetDate={resultDate} />
            </p>
            <p className="mt-2 text-sm text-main-gray-text">
              ({getDateString(resultDate)} - {getHoursDetail(resultDate)})
            </p>
          </div>
        </div>
      ) : (
        <Scores data={getFinalScore()} />
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex gap-2 rounded-2xl bg-white p-4">
          <IconCircleLoop className="mt-0.5 text-main" />
          <div className="flex w-full flex-col">
            <h1 className="font-medium">Jawaban Benar</h1>
            <p className="text-sm text-main-gray-text">
              {showResult ? correctAnswer : '....'}/
              {sessionResult?.TryoutUserAnswer.length} soal
            </p>
          </div>
        </div>
        <div className="flex gap-2 rounded-2xl bg-white p-4">
          <IconTimer className="mt-0.5 text-main" />
          <div className="flex w-full flex-col">
            <h1 className="font-medium">Waktu pengerjaaan</h1>
            <p className="text-sm text-main-gray-text">
              {showResult ? getSessionDuration() : '....'}
            </p>
          </div>
        </div>
      </div>
      {session?.user.role === 'USER' && false ? (
        <div className="flex flex-col rounded-2xl bg-white">
          <div className="flex w-full items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-center text-xl font-bold">
                Upgrade akunmu untuk melihat <br /> pembahasan
              </h1>
              <ButtonPayment />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col rounded-2xl bg-white">
          {sessionResult?.TryoutUserAnswer.map((item, i) => (
            <div
              key={i}
              id={`question${i + 1}`}
              className={cn(
                'grid w-full grid-cols-1 gap-3 border-b border-main-gray-input p-6 md:grid-cols-2',
                i === sessionResult.TryoutUserAnswer.length - 1 && 'border-b-0',
              )}
            >
              <div className="flex flex-col justify-between gap-2">
                <h1 className="text-lg font-medium">Soal Nomor {i + 1}</h1>
                <div className="text-sm text-main-gray-text">
                  <ReactMarkdown
                    value={replaceLatexNotation(item.TryoutQuestion.question)}
                  />
                </div>
                <h1 className="text-sm">
                  <span className="font-semibold">Jawaban:</span> <br />
                  <ReactMarkdown
                    value={replaceLatexNotation(
                      showResult && assessmentType !== '+4/-1/0'
                        ? item.TryoutQuestion.TryoutAnswers.find(
                            (answer) => answer.value === 5,
                          )?.answer || ''
                        : showResult && assessmentType === '+4/-1/0'
                          ? item.TryoutQuestion.TryoutAnswers.find(
                              (answer) => answer.value === 4,
                            )?.answer || ''
                          : '....',
                    )}
                  />
                </h1>
              </div>
              <div className="flex flex-col justify-start gap-2">
                <h1 className="text-lg font-medium">Jawabanmu</h1>
                {showResult ? (
                  <div className="flex flex-col gap-2 text-sm text-black">
                    {item.TryoutAnswers && item.TryoutAnswers.answer !== '' ? (
                      <>
                        <p>{item.TryoutAnswers.answer}</p>
                        {getIsCorrect(i) ? (
                          <p className="font-semibold text-blue-600">
                            Benar{' '}
                            <span className="text-xs text-main-gray-text">
                              ( bobot : {item.TryoutAnswers.value} )
                            </span>
                          </p>
                        ) : (
                          <p className="font-semibold text-main-red">
                            Salah{' '}
                            <span className="text-xs text-main-gray-text">
                              ( bobot : {item.TryoutAnswers.value} )
                            </span>
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="font-semibold text-main-gray-text2">
                        Belum Dijawab{' '}
                        <span className="text-xs text-main-gray-text">
                          ( bobot : 0 )
                        </span>
                      </p>
                    )}
                  </div>
                ) : (
                  '....'
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ScoresProps {
  data: {
    total: number;
    accuracy: string;
    thresholdValue: number | null;
  };
}

const Scores: React.FC<ScoresProps> = ({ data }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-2xl bg-white py-6 font-medium',
        data.thresholdValue &&
          data.total > data.thresholdValue &&
          'bg-main text-white',
        data.thresholdValue &&
          data.total < data.thresholdValue &&
          'bg-main-red text-white',
      )}
    >
      {data.thresholdValue && data.total > data.thresholdValue ? (
        <>
          <IconSuccess className="w-46text-white" />
          <h1 className="text-xl">SELAMAT, KAMU LULUS!</h1>
          <p>{data.accuracy}% akurasi</p>
          <p>Nilai Akhir: {`${data.total}/${data.thresholdValue}`}</p>
        </>
      ) : data.thresholdValue && data.total < data.thresholdValue ? (
        <>
          <IconX className="w-46text-white" />
          <h1 className="text-xl">MAAF, KAMU BELUM LULUS!</h1>
          <p>{data.accuracy}% akurasi</p>
          <p>Nilai Akhir: {`${data.total}/${data.thresholdValue}`}</p>
        </>
      ) : !data.thresholdValue ? (
        <>
          <IconAward className="w-46 text-main" />
          <p>{data.accuracy}% akurasi</p>
          <p>Nilai Akhir: {data.total}</p>
        </>
      ) : null}
    </div>
  );
};
