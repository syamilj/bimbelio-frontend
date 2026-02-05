'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { cn } from '@/lib/utils';
import { QuestionTypeEnum, TryoutAnswer } from '@/types/database';
import { HelpCircle, List, RotateCcw } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import Card from './card';

interface ChallengeProps {
  answers: TryoutAnswer[];
  onInput: (value: string) => void;
  inputValue?: string;
  status: 'correct' | 'wrong' | 'none' | 'complete';
  selectedOption?: string;
  selectedOptions?: string[];
  disabled?: boolean;
  type: QuestionTypeEnum;
  setSessionAnswer: Dispatch<SetStateAction<any>>;
  index: number;
  sessionAnswer: any;
}

// Convert number to letter (0 -> A, 1 -> B, etc.)
const getOptionLabel = (index: number): string => {
  return String.fromCharCode(65 + index); // 65 is ASCII code for 'A'
};

const Challenge = ({
  answers,
  onInput,
  status,
  inputValue,
  selectedOption,
  disabled,
  type,
  selectedOptions,
  setSessionAnswer,
  index,
  sessionAnswer,
}: ChallengeProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [showHint, setShowHint] = useState(false);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  // const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const handleSelect = (id: string, answer: string, index: number) => {
    if (sessionAnswer[index].answerId === id) {
      // Deselect if already selected
      setSessionAnswer((prev: any) =>
        prev.map((item: any, i: number) =>
          i === index
            ? { ...item, answerId: '', answer: '', type: type }
            : item,
        ),
      );
    } else {
      // Select new answer
      setSessionAnswer((prev: any) =>
        prev.map((item: any, i: number) =>
          i === index
            ? { ...item, answerId: id, answer: answer, type: type }
            : item,
        ),
      );
    }
  };

  const getQuestionTypeInfo = () => {
    switch (type) {
      case 'OBJECTIVE_5':
        return {
          title: 'Pilihan Ganda',
          description: 'Pilih satu jawaban yang paling tepat',
          icon: <List className="w-4 h-4" />,
          color: '#3B82F6',
        };
      case 'TRUE_FALSE':
        return {
          title: 'Benar/Salah',
          description: 'Pilih Benar atau Salah',
          icon: <HelpCircle className="w-4 h-4" />,
          color: '#10B981',
        };
      case 'SHORT_ANSWER':
        return {
          title: 'Jawaban Singkat',
          description: 'Ketik jawaban singkat Kamu',
          icon: <RotateCcw className="w-4 h-4" />,
          color: '#F59E0B',
        };
      default:
        return {
          title: 'Soal',
          description: 'Pilih jawaban yang tepat',
          icon: <List className="w-4 h-4" />,
          color: mainColor,
        };
    }
  };

  const typeInfo = getQuestionTypeInfo();
  const currentAnswer = sessionAnswer[index];
  const hasAnswer = currentAnswer?.answer && currentAnswer.answer.length > 0;

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Answer Options - Vertical Stacked */}
      <div className="grid gap-3">
        {answers?.map((answer, i) => (
          <Card
            key={answer.id}
            text={answer.answer}
            shortcut={getOptionLabel(i)}
            inputValue={inputValue}
            onClick={() => handleSelect(answer.id, answer.answer, index)}
            type={type}
            status={status}
            selected={
              type === 'OBJECTIVE_5' || type === 'TRUE_FALSE'
                ? selectedOption === answer.id
                : selectedOptions?.includes(answer.id)
            }
            disabled={disabled}
            onInput={onInput}
          />
        ))}
      </div>

      {/* Help Section - Simplified */}
      <div
        className={cn(
          'p-3 md:p-4 rounded-3xl border transition-all duration-200',
          showHint ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-200',
        )}
      >
        <button
          onClick={() => setShowHint(!showHint)}
          className="w-full flex items-center justify-between text-xs md:text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <span>💡 Tips Menjawab</span>
          <HelpCircle className="w-4 h-4" />
        </button>

        {showHint && (
          <ul className="text-xs md:text-sm text-slate-700 space-y-1 mt-3 pl-5">
            {type === 'OBJECTIVE_5' && (
              <>
                <li>• Baca semua pilihan dengan teliti</li>
                <li>• Eliminasi jawaban yang jelas salah</li>
                <li>• Pilih jawaban yang paling tepat</li>
              </>
            )}
            {type === 'TRUE_FALSE' && (
              <>
                <li>• Perhatikan kata kunci dalam pernyataan</li>
                <li>
                  • Hati-hati dengan kata "selalu", "tidak pernah"
                </li>
                <li>
                  • Pastikan pernyataan 100% benar untuk pilih "Benar"
                </li>
              </>
            )}
            {type === 'SHORT_ANSWER' && (
              <>
                <li>• Tulis jawaban yang singkat dan jelas</li>
                <li>• Gunakan istilah yang tepat</li>
                <li>• Periksa ejaan sebelum melanjutkan</li>
              </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Challenge;
