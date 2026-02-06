'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { QuestionTypeEnum } from '@/types/database';
import 'katex/dist/katex.min.css';
import { Check, Edit3, Keyboard } from 'lucide-react';

interface CardProps {
  text: string;
  selected?: boolean;
  onClick: () => void;
  onInput: (value: string) => void;
  inputValue?: string;
  shortcut: string; // Changed to string to support A, B, C, D, E labels
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
      <div className="relative">
        <div className="p-4 md:p-5 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 md:w-9 md:h-9 rounded-3xl flex items-center justify-center font-black text-sm md:text-base text-white shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              {shortcut}
            </div>
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                Jawaban Singkat
              </span>
            </div>
            {status && (
              <div
                className={cn(
                  'px-2 py-1 rounded-3xl border text-xs font-medium',
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
              placeholder="Ketik jawaban Kamu di sini..."
              className={cn(
                'w-full h-11 md:h-12 rounded-3xl border px-4 transition-all duration-200 text-sm md:text-base',
                disabled
                  ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                  : 'bg-white hover:border-slate-300 focus:border-2',
                inputValue
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-200',
              )}
              style={{
                borderColor: inputValue && !disabled ? mainColor : undefined,
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Keyboard className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {inputValue && (
            <div className="mt-3 text-sm text-slate-600">
              <span className="font-bold">{inputValue.length}</span> karakter
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative p-3 md:p-4 rounded-3xl border transition-all duration-200 cursor-pointer group',
        selected
          ? 'shadow-md border-transparent'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm',
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
          'absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-200',
          selected && 'opacity-100',
        )}
        style={{
          background: selected
            ? `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}05)`
            : undefined,
        }}
      />

      <div className="relative z-10 flex items-start gap-3">
        {/* Shortcut Badge */}
        <div
          className={cn(
            'shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-3xl flex items-center justify-center font-black text-base transition-all duration-200',
            selected ? 'text-white shadow-sm' : 'text-slate-700 bg-slate-100',
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
              'transition-colors duration-200',
              selected ? 'text-slate-900' : 'text-slate-700',
            )}
          >
            <BlocknoteEditor
              className={cn(
                'prose prose-sm md:prose-base max-w-none option-text',
                selected &&
                  'prose-headings:text-slate-900 prose-p:text-slate-800',
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
              'w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
              selected
                ? 'border-transparent'
                : 'border-slate-300 group-hover:border-slate-400',
            )}
            style={{
              backgroundColor: selected ? mainColor : 'transparent',
            }}
          >
            {selected && <Check className="w-3 h-3 text-white" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
