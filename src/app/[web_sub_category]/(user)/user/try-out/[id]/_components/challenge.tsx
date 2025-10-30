'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { cn } from '@/lib/utils';
import { QuestionTypeEnum, TryoutAnswer } from '@/types/database';
import { motion } from 'framer-motion';
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
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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
    <div className="space-y-6">
      {/* Question Type Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 rounded-2xl border-2 bg-white shadow-sm"
        style={{ borderColor: `${typeInfo.color}20` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${typeInfo.color}15` }}
          >
            <div style={{ color: typeInfo.color }}>{typeInfo.icon}</div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{typeInfo.title}</h3>
            <p className="text-sm text-gray-600">{typeInfo.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Answer Status */}
          <div
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border',
              hasAnswer
                ? 'bg-green-100 border-green-300 text-green-700'
                : 'bg-gray-100 border-gray-300 text-gray-600',
            )}
          >
            {hasAnswer ? 'Terjawab' : 'Belum Dijawab'}
          </div>

          {/* Question Counter */}
          <div
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: typeInfo.color }}
          >
            {answers.length} opsi
          </div>
        </div>
      </motion.div>

      {/* Answer Options */}
      <div className={cn('grid gap-4', 'grid-cols-1')}>
        {answers?.map((answer, i) => (
          <Card
            key={answer.id}
            text={answer.answer}
            shortcut={i + 1}
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

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showHint ? 1 : 0 }}
        className={cn(
          'p-4 rounded-xl border bg-blue-50 border-blue-200 transition-all duration-300',
          showHint ? 'block' : 'hidden',
        )}
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">
              💡 Tips Menjawab:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
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
                  <li>• Hati-hati dengan kata "selalu", "tidak pernah"</li>
                  <li>• Pastikan pernyataan 100% benar untuk pilih "Benar"</li>
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
          </div>
        </div>
      </motion.div>

      {/* Toggle Hint Button */}
      <div className="text-center">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          <HelpCircle className="w-4 h-4" />
          {showHint ? 'Sembunyikan Tips' : 'Lihat Tips Menjawab'}
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {answers.map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              selectedOption === answers[i]?.id ? 'w-6' : 'w-2',
            )}
            style={{
              backgroundColor:
                selectedOption === answers[i]?.id ? mainColor : '#e5e7eb',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Challenge;
