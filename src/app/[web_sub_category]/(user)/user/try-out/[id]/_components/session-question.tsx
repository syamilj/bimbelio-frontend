import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import Challenge from './challenge';
import QuestionBubble from './question-bubble';

interface SessionQuestionProps {
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
  timeRemaining?: string;
}

const SessionQuestion: React.FC<SessionQuestionProps> = ({
  currentQuestionIndex,
  currentQuestionData,
  selectedOptions,
  selectedOption,
  inputValue,
  setInputValue,
  sessionAnswer,
  setSessionAnswer,
  setCurrentQuestionIndex,
  questions = [], // Memberikan nilai default sebagai array kosong
  status,
  // timeRemaining,
}) => {
  const answers = currentQuestionData?.TryoutAnswers || [];

  // Mengatur currentQuestionIndex ke 0 jika questions tidak tersedia atau kosong
  useEffect(() => {
    if (!questions || questions.length === 0) {
      setCurrentQuestionIndex(0);
    } else if (currentQuestionIndex >= questions.length) {
      // Jika currentQuestionIndex melebihi jumlah questions, set ke 0
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

  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  // Jika questions masih kosong, tampilkan pesan atau loader
  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-full w-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pastikan currentQuestionIndex valid
  const safeCurrentQuestionIndex = Math.min(
    currentQuestionIndex,
    questions.length - 1,
  );

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-3xl font-bold text-primary">
            Soal {safeCurrentQuestionIndex + 1}
          </h2>
          <div className="flex flex-row sm:flex-row items-start sm:items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground bg-white/80 px-4 py-2 rounded-full shadow-sm">
              {safeCurrentQuestionIndex + 1} dari {questions.length}
            </span>
          </div>
        </div>
        <Progress
          value={progress}
          className="h-2 rounded-full"
        />
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <QuestionBubble question={currentQuestionData?.question} />
          <Separator className="my-6" />
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
          <div className="flex items-center space-x-3 mt-6 w-auto bg-yellow-50 p-4 rounded-xl">
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
              className="border-yellow-500 text-yellow-500"
            />
            <label
              htmlFor="notSure"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
            >
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-700">Jawaban belum yakin</span>
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t p-6 ">
        <Button
          variant="outline"
          className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-full"
          onClick={() => {
            if (safeCurrentQuestionIndex > 0)
              setCurrentQuestionIndex(safeCurrentQuestionIndex - 1);
          }}
          disabled={safeCurrentQuestionIndex === 0}
        >
          <span>Soal sebelumnya</span>
        </Button>
        <Button
          className="w-full sm:w-auto flex items-center justify-center bg-main hover:bg-main/85 space-x-2 rounded-full"
          onClick={() => {
            if (safeCurrentQuestionIndex < questions.length - 1)
              setCurrentQuestionIndex(safeCurrentQuestionIndex + 1);
          }}
          disabled={safeCurrentQuestionIndex + 1 === questions.length}
        >
          <span>Soal berikutnya</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionQuestion;
