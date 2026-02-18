import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutGrid,
  Target,
  Trophy,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useProvider } from '../../../../_provider/provider';
import ReviewTabTypeTryout from './result';
import SubmitTryout from './submit-tryout';

type userAnswersProps = {
  number: number;
  questionId: string;
  answerId: string;
  answer: string;
  notSure: boolean;
};

const ANSWER_LABELS = ['A', 'B', 'C', 'D', 'E'];

const TryoutType = () => {
  const {
    useParams: { sub },
    useData: { CourseData },
  } = useProvider();

  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const TryoutSession = CourseData?.TryoutSession;
  const subCourseId = CourseData?.id;

  const [userAnswers, setUserAnswers] = useState<userAnswersProps[] | null>(null);
  const [currentSub, setCurrentSub] = useState<string | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [currentIndexQuestion, setCurrentIndexQuestion] = useState<number>(0);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  useEffect(() => {
    const savedAnswer = localStorage.getItem(`tryout-sub-chapter-${sub}`);
    const savedAnswerArray = savedAnswer ? JSON.parse(savedAnswer) : null;
    if (savedAnswerArray) {
      setUserAnswers(savedAnswerArray.sort((a: userAnswersProps, b: userAnswersProps) => a.number - b.number));
    } else if (TryoutSession) {
      const initialAnswers = TryoutSession.TryoutQuestion.map((item) => ({
        number: item.number,
        questionId: item.id,
        answerId: '',
        answer: '',
        notSure: false,
      })).sort((a, b) => a.number - b.number);
      setUserAnswers(initialAnswers);
    }
    if ((TryoutSession?.TryoutSessionResult?.length ?? 0) > 0 && (TryoutSession?.TryoutSessionParticipant?.length ?? 0) > 0) {
      setIsDone(true);
    }
  }, [TryoutSession]);

  useEffect(() => {
    if (userAnswers && currentSub === sub) {
      localStorage.setItem(`tryout-sub-chapter-${sub}`, JSON.stringify(userAnswers));
    }
    if (sub !== currentSub && typeof sub === 'string') setCurrentSub(sub);
  }, [userAnswers, sub, currentSub]);

  if (!TryoutSession) return null;

  const totalQ = userAnswers?.length || 0;
  const answeredCount = userAnswers?.filter((a) => a.answerId).length || 0;
  const progressPercentage = totalQ > 0 ? (answeredCount / totalQ) * 100 : 0;

  const getSelectedAnswer = () =>
    userAnswers?.find((a) => a.questionId === TryoutSession.TryoutQuestion[currentIndexQuestion]?.id)?.answerId ?? '';

  const isAnswered = (index: number) => !!(userAnswers?.[index]?.answerId);

  const currentQuestion = TryoutSession.TryoutQuestion[currentIndexQuestion];
  const isFirst = currentIndexQuestion === 0;
  const isLast = currentIndexQuestion === TryoutSession.TryoutQuestion.length - 1;

  if (isDone) {
    return (
      <div className="p-4">
        <ReviewTabTypeTryout sessionResult={TryoutSession.TryoutSessionParticipant[0]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${mainColor}18` }}
              >
                <Trophy className="w-5 h-5" style={{ color: mainColor }} />
              </div>
              <div>
                <h1 className="text-sm font-black text-gray-900 line-clamp-1">{TryoutSession.name}</h1>
                <p className="text-xs text-gray-500 font-medium">Uji Progress</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black"
                style={{ backgroundColor: `${mainColor}18`, color: mainColor }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {answeredCount}/{totalQ}
              </div>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <LayoutGrid className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
          <div className="mt-3">
            <Progress value={progressPercentage} className="h-1.5 bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-4 lg:px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Question Card */}
          <div className="lg:col-span-3">
            <Card className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm"
                      style={{ backgroundColor: mainColor }}
                    >
                      {currentIndexQuestion + 1}
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900">Soal {currentIndexQuestion + 1}</h2>
                      <p className="text-xs text-slate-500 font-medium">dari {totalQ} soal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500">Pilihan Ganda</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-5">
                <div className="flex items-start">
                  <BlocknoteEditor
                    value={currentQuestion.question}
                    viewOnly
                    className="question-content flex-1"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-slate-400 font-medium">Pilih jawaban yang tepat</span>
                  </div>
                </div>

                <RadioGroup value={getSelectedAnswer()} onValueChange={() => {}}>
                  {currentQuestion.TryoutAnswers.map((answer, aIndex) => {
                    const isSelected = getSelectedAnswer() === answer.id;
                    const label = ANSWER_LABELS[aIndex] ?? String(aIndex + 1);
                    return (
                      <div
                        key={aIndex}
                        onClick={() => {
                          if (!userAnswers) return;
                          setUserAnswers(
                            userAnswers.map((ua) =>
                              ua.questionId === currentQuestion.id
                                ? { ...ua, answer: answer.answer, answerId: answer.id }
                                : ua,
                            ),
                          );
                        }}
                        className={cn(
                          'group flex items-start gap-3 rounded-2xl p-3.5 cursor-pointer border-2 transition-all duration-150',
                          isSelected
                            ? 'border-blue-500 bg-blue-50/60 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black transition-colors',
                            isSelected ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600',
                          )}
                          style={isSelected ? { backgroundColor: mainColor } : undefined}
                        >
                          {label}
                        </div>
                        <div className="flex flex-1 items-center gap-2 min-w-0">
                          <RadioGroupItem
                            id={answer.id}
                            value={answer.id}
                            className={cn('shrink-0', isSelected && 'border-blue-600 text-blue-600')}
                          />
                          <div className="flex-1 min-w-0 text-sm [&_.bn-block-content]:text-sm [&_p]:text-sm">
                            <BlocknoteEditor
                              value={answer.answer}
                              viewOnly
                              className="question-content"
                            />
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: mainColor }} />}
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-3 border-t bg-gradient-to-r from-slate-50 to-white p-4">
                <button
                  onClick={() => !isFirst && setCurrentIndexQuestion((p) => p - 1)}
                  disabled={isFirst}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm border transition-all',
                    isFirst ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-white' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50',
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </button>
                <span className="text-xs text-slate-500 font-medium">{answeredCount} dari {totalQ} terjawab</span>
                {!isLast ? (
                  <button
                    onClick={() => setCurrentIndexQuestion((p) => p + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm text-white transition-all shadow-sm hover:opacity-90"
                    style={{ backgroundColor: mainColor }}
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <SubmitTryout
                    sessionAnswer={userAnswers}
                    sessionId={TryoutSession.id}
                    subCourseId={subCourseId || ''}
                  />
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              <Card className="rounded-3xl border shadow-sm" style={{ borderColor: `${mainColor}25` }}>
                <CardContent className="p-5">
                  <h3 className="font-black text-sm mb-4 flex items-center gap-2" style={{ color: mainColor }}>
                    <BookOpen className="w-4 h-4" />
                    Statistik
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="text-center">
                      <div className="text-xl font-black" style={{ color: mainColor }}>{answeredCount}</div>
                      <div className="text-xs text-slate-500 font-medium">Terjawab</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-black text-slate-400">{totalQ - answeredCount}</div>
                      <div className="text-xs text-slate-500 font-medium">Tersisa</div>
                    </div>
                  </div>
                  <Progress value={progressPercentage} className="h-1.5" />
                  <p className="text-center text-xs font-black mt-1.5" style={{ color: mainColor }}>{Math.round(progressPercentage)}%</p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border shadow-sm" style={{ borderColor: `${secondaryColor}25` }}>
                <CardContent className="p-5">
                  <h3 className="font-black text-sm mb-4 flex items-center gap-2 text-slate-700">
                    <Target className="w-4 h-4" style={{ color: secondaryColor }} />
                    Navigasi Soal
                  </h3>
                  <div className="grid grid-cols-5 gap-1.5 max-h-64 overflow-y-auto no-scrollbar">
                    {TryoutSession.TryoutQuestion.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndexQuestion(i)}
                        className={cn(
                          'h-9 w-9 rounded-xl font-black text-xs transition-all border shadow-sm',
                          currentIndexQuestion === i
                            ? 'text-white border-transparent'
                            : isAnswered(i)
                              ? 'text-white border-transparent bg-emerald-500'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                        )}
                        style={currentIndexQuestion === i ? { backgroundColor: mainColor } : undefined}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5 mt-4 pt-3 border-t border-slate-100">
                    {[
                      { cls: 'bg-emerald-500', label: 'Terjawab' },
                      { cls: 'bg-white border border-slate-200', label: 'Belum Dijawab' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <div className={cn('w-4 h-4 rounded-md', item.cls)} />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border shadow-sm" style={{ borderColor: `${mainColor}25` }}>
                <CardContent className="p-5">
                  <h3 className="font-black text-sm mb-3 flex items-center gap-2" style={{ color: mainColor }}>
                    <FileText className="w-4 h-4" />
                    Selesaikan
                  </h3>
                  <SubmitTryout
                    sessionAnswer={userAnswers}
                    sessionId={TryoutSession.id}
                    subCourseId={subCourseId || ''}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {showSidebar && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSidebar(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[75vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-slate-800">Navigasi Soal</h3>
              <button onClick={() => setShowSidebar(false)} className="text-slate-400 text-sm font-medium">
                Tutup
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-slate-50 rounded-2xl">
              <div className="text-center">
                <div className="text-lg font-black" style={{ color: mainColor }}>{answeredCount}</div>
                <div className="text-xs text-slate-500">Terjawab</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-slate-400">{totalQ - answeredCount}</div>
                <div className="text-xs text-slate-500">Tersisa</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-slate-700">{totalQ}</div>
                <div className="text-xs text-slate-500">Total</div>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {TryoutSession.TryoutQuestion.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIndexQuestion(i); setShowSidebar(false); }}
                  className={cn(
                    'h-10 w-10 rounded-xl font-black text-sm transition-all border shadow-sm',
                    currentIndexQuestion === i
                      ? 'text-white border-transparent'
                      : isAnswered(i)
                        ? 'text-white border-transparent bg-emerald-500'
                        : 'border-slate-200 bg-white text-slate-600',
                  )}
                  style={currentIndexQuestion === i ? { backgroundColor: mainColor } : undefined}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <SubmitTryout
              sessionAnswer={userAnswers}
              sessionId={TryoutSession.id}
              subCourseId={subCourseId || ''}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TryoutType;
