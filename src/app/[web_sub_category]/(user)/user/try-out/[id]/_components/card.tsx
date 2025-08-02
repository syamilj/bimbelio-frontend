'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { QuestionTypeEnum } from '@/types/database';
import { motion } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { Check, Edit3, Keyboard } from 'lucide-react';

interface CardProps {
  text: string;
  selected?: boolean;
  onClick: () => void;
  onInput: (value: string) => void;
  inputValue?: string;
  shortcut: number;
  status?: 'correct' | 'wrong' | 'none' | 'complete';
  disabled?: boolean;
  type: QuestionTypeEnum;
}

const Card: React.FC<CardProps> = ({
  text,
  selected,
  onClick,
  onInput,
  inputValue,
  disabled,
  type,
  shortcut,
  status,
}) => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const isShortAnswer = type === 'SHORT_ANSWER';

  const getStatusIcon = () => {
    switch (status) {
      case 'correct':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'wrong':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case 'complete':
        return <Check className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'correct':
        return 'bg-green-100 border-green-300 text-green-700';
      case 'wrong':
        return 'bg-red-100 border-red-300 text-red-700';
      case 'complete':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'none':
        return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      default:
        return '';
    }
  };

  if (isShortAnswer) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              {shortcut}
            </div>
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Jawaban Singkat
              </span>
            </div>
            {status && (
              <div
                className={cn(
                  'px-2 py-1 rounded-lg border text-xs font-medium',
                  getStatusBadge(),
                )}
              >
                {status === 'correct' && 'Benar'}
                {status === 'wrong' && 'Salah'}
                {status === 'complete' && 'Selesai'}
                {status === 'none' && 'Belum Dijawab'}
              </div>
            )}
          </div>

          <div className="relative">
            <Input
              value={inputValue || ''}
              onChange={(e) => onInput(e.target.value)}
              disabled={disabled}
              placeholder="Ketik jawaban Anda di sini..."
              className={cn(
                'w-full h-12 rounded-xl border-2 px-4 transition-all duration-200 text-base',
                disabled
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-white hover:border-gray-300 focus:border-2',
                inputValue ? 'border-green-300 bg-green-50' : 'border-gray-200',
              )}
              style={{
                borderColor: inputValue && !disabled ? mainColor : undefined,
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Keyboard className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {inputValue && (
            <div className="mt-3 text-sm text-gray-600">
              <span className="font-medium">{inputValue.length}</span> karakter
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!disabled ? { scale: 1.01, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
    >
      <div
        className={cn(
          'relative p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group',
          'hover:shadow-lg',
          selected
            ? 'shadow-lg border-transparent'
            : 'bg-white border-gray-200 hover:border-gray-300',
          disabled && 'opacity-50 cursor-not-allowed hover:shadow-none',
        )}
        style={{
          backgroundColor: selected ? `${mainColor}08` : undefined,
          borderColor: selected ? mainColor : undefined,
        }}
        onClick={!disabled ? onClick : undefined}
      >
        {/* Selection Indicator */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
            selected && 'opacity-100',
          )}
          style={{
            background: selected
              ? `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}05)`
              : undefined,
          }}
        />

        <div className="relative z-10 flex items-start gap-4">
          {/* Shortcut Badge */}
          <div
            className={cn(
              'shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-bold text-sm md:text-base transition-all duration-300',
              'shadow-sm group-hover:shadow-md',
              selected ? 'text-white' : 'text-gray-600 bg-gray-100',
            )}
            style={{
              backgroundColor: selected ? mainColor : undefined,
            }}
          >
            {shortcut}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                'transition-colors duration-300',
                selected ? 'text-gray-900' : 'text-gray-700',
              )}
            >
              <BlocknoteEditor
                className={cn(
                  'prose prose-sm max-w-none',
                  selected &&
                    'prose-headings:text-gray-900 prose-p:text-gray-800',
                )}
                value={text}
                viewOnly
              />
            </div>
          </div>

          {/* Status & Selection Indicator */}
          <div className="shrink-0 flex items-center gap-2">
            {/* Status Icon */}
            {status && (
              <div className="flex items-center justify-center">
                {getStatusIcon()}
              </div>
            )}

            {/* Selection Check */}
            <div
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                selected
                  ? 'border-transparent shadow-sm'
                  : 'border-gray-300 group-hover:border-gray-400',
              )}
              style={{
                backgroundColor: selected ? mainColor : 'transparent',
              }}
            >
              {selected && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div
          className={cn(
            'absolute bottom-0 left-0 h-1 rounded-full transition-all duration-300',
            'opacity-0 group-hover:opacity-100',
          )}
          style={{
            width: selected ? '100%' : '0%',
            backgroundColor: mainColor,
          }}
        />

        {/* Keyboard Shortcut Hint */}
        {!disabled && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              {shortcut}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
