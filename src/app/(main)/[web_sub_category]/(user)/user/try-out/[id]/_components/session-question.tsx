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
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
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
      <Card className="rounded-2xl border-2 border-gray-100 shadow-lg">
        <CardContent className="p-8">
          <div className="flex justify-center items-center h-32">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2"
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

  return (
    <motion.div
      key={currentQuestionIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card className="rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden">
        <CardHeader className="border-b bg-gray-50/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                style={{ backgroundColor: mainColor }}
              >
                {safeCurrentQuestionIndex + 1}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Soal {safeCurrentQuestionIndex + 1}
                </h2>
                <p className="text-sm text-gray-600">
                  dari {questions.length} soal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                {currentQuestionData?.type || 'Pilihan Ganda'}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Question */}
            <QuestionBubble question={currentQuestionData?.question} />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200"
            >
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-800">
                  Tandai jawaban belum yakin
                </span>
              </label>
            </motion.div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t bg-gray-50/50 p-6">
          <Button
            variant="outline"
            className={cn(
              'w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border-2',
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

          <div className="text-sm text-gray-600 text-center">
            <span className="font-medium">
              {sessionAnswer?.filter((item: any) => item.answer !== '')
                .length || 0}
            </span>{' '}
            dari {questions.length} soal terjawab
          </div>

          <Button
            className={cn(
              'w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl',
              safeCurrentQuestionIndex + 1 === questions.length &&
                'opacity-50 cursor-not-allowed',
            )}
            style={{ backgroundColor: mainColor }}
            onClick={() => {
              if (safeCurrentQuestionIndex < questions.length - 1)
                setCurrentQuestionIndex(safeCurrentQuestionIndex + 1);
            }}
            disabled={safeCurrentQuestionIndex + 1 === questions.length}
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SessionQuestion;
