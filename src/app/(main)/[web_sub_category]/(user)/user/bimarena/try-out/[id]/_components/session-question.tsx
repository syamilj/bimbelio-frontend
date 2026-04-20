import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import React, { useEffect } from 'react';
import Challenge from './challenge';
import QuestionBubble from './question-bubble';
import SubmitTryout from './submit-tryout';

interface SessionQuestionProps {
  sessionId: string;
  currentQuestionIndex: number;
  currentQuestionData: any;
  selectedOptions: string[];
  selectedOption: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  sessionAnswer: any;
  setSessionAnswer: React.Dispatch<React.SetStateAction<any>>;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  questions?: any[];
  status: any;
}

const SessionQuestion: React.FC<SessionQuestionProps> = ({
  sessionId,
  currentQuestionIndex,
  currentQuestionData,
  selectedOptions,
  selectedOption,
  inputValue,
  setInputValue,
  sessionAnswer,
  setSessionAnswer,
  setCurrentQuestionIndex,
  questions = [],
  status,
}) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const answers = currentQuestionData?.TryoutAnswers || [];

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  useEffect(() => {
    if (!questions || questions.length === 0) {
      setCurrentQuestionIndex(0);
    } else if (currentQuestionIndex >= questions.length) {
      setCurrentQuestionIndex(0);
    }
  }, [questions, currentQuestionIndex, setCurrentQuestionIndex]);

  const onInput = (value: string) => {
    setInputValue(value);
    setSessionAnswer((prev: any) =>
      prev.map((item: any, i: number) =>
        i === currentQuestionIndex
          ? { ...item, answerId: `${answers[0]?.id || ''}`, answer: value }
          : item,
      ),
    );
  };

  if (questions.length === 0) {
    return (
      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="p-8">
          <div className="flex justify-center items-center h-32">
            <div
              className="animate-spin rounded-full h-8 w-8 border"
              style={{ borderColor: mainColor }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  const safeCurrentQuestionIndex = Math.min(
    currentQuestionIndex,
    questions.length - 1,
  );

  const answeredCount =
    sessionAnswer?.filter((item: any) => {
      const answerId = (item?.answerId || '').trim();
      const answerText = (item?.answer || '').trim();
      return answerId.length > 0 || answerText.length > 0;
    }).length || 0;

  return (
    <div className="w-full">
      <Card className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-3xl flex items-center justify-center text-white font-black text-base md:text-lg shadow-sm"
                style={{ backgroundColor: mainColor }}
              >
                {safeCurrentQuestionIndex + 1}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-900">
                  Soal {safeCurrentQuestionIndex + 1}
                </h2>
                <p className="text-xs md:text-sm text-slate-600 font-medium">
                  dari {questions.length} soal
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">
                {currentQuestionData?.type || 'Pilihan Ganda'}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <div className="space-y-5 md:space-y-6">
            {/* Question */}
            <QuestionBubble question={currentQuestionData?.question} />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs md:text-sm">
                <span className="bg-white px-3 md:px-4 text-slate-500 font-medium">
                  Pilih jawaban yang tepat
                </span>
              </div>
            </div>

            {/* Answers */}
            <Challenge
              answers={answers}
              index={safeCurrentQuestionIndex}
              onInput={onInput}
              inputValue={inputValue}
              status={status}
              selectedOption={selectedOption}
              selectedOptions={selectedOptions}
              disabled={false}
              type={currentQuestionData?.type}
              setSessionAnswer={setSessionAnswer}
              sessionAnswer={sessionAnswer}
            />

            {/* Not Sure Checkbox */}
            <div className="flex items-center space-x-3 p-3 md:p-4 bg-yellow-50 rounded-3xl border border-yellow-200">
              <Checkbox
                id="notSure"
                checked={
                  sessionAnswer?.[safeCurrentQuestionIndex]?.notSure || false
                }
                onCheckedChange={(checked) => {
                  setSessionAnswer((prev: any) =>
                    prev.map((item: any, i: number) =>
                      i === safeCurrentQuestionIndex
                        ? { ...item, notSure: checked }
                        : item,
                    ),
                  );
                }}
                className="border-yellow-400 data-[state=checked]:bg-yellow-500"
              />
              <label
                htmlFor="notSure"
                className="text-xs md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-800">
                  Tandai jawaban belum yakin
                </span>
              </label>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t bg-gradient-to-r from-slate-50 to-white p-4 md:p-5">
          <Button
            variant="outline"
            className={cn(
              'w-full sm:w-auto flex items-center justify-center space-x-2 rounded-3xl border shadow-sm text-sm font-medium',
              safeCurrentQuestionIndex === 0 && 'opacity-50 cursor-not-allowed',
            )}
            onClick={() => {
              if (safeCurrentQuestionIndex > 0)
                setCurrentQuestionIndex(safeCurrentQuestionIndex - 1);
            }}
            disabled={safeCurrentQuestionIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </Button>

          <div className="text-xs md:text-sm text-slate-600 text-center">
            <span className="font-black">{answeredCount}</span> dari{' '}
            {questions.length} terjawab
          </div>

          {safeCurrentQuestionIndex + 1 === questions.length ? (
            <div className="w-full sm:w-auto sm:min-w-[220px]">
              <SubmitTryout
                sessionAnswer={sessionAnswer}
                sessionId={sessionId}
              />
            </div>
          ) : (
            <Button
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-3xl text-sm font-bold shadow-sm"
              style={{ backgroundColor: mainColor }}
              onClick={() => {
                if (safeCurrentQuestionIndex < questions.length - 1)
                  setCurrentQuestionIndex(safeCurrentQuestionIndex + 1);
              }}
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SessionQuestion;
