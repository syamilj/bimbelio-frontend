import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { QuestionTypeEnum } from '@/types/database';
import 'katex/dist/katex.min.css';

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
  const isShortAnswer = type === 'SHORT_ANSWER';

  const cardClasses = cn(
    'flex items-center gap-4 rounded-xl p-2 text-sm font-medium border',
    {
      'bg-main text-white': selected,
      'bg-white text-gray-700 hover:bg-main/10': !selected && !disabled,
      'opacity-50 cursor-not-allowed': disabled,
      'cursor-pointer': !disabled && !isShortAnswer,
    },
  );

  const shortcutClasses = cn(
    'flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold',
    {
      'bg-white text-main': selected,
      'bg-main/10 text-main': !selected,
    },
  );

  const statusClasses = cn('absolute top-2 right-2 w-3 h-3 rounded-full', {
    'bg-green-500': status === 'correct',
    'bg-red-500': status === 'wrong',
    'bg-yellow-500': status === 'none',
    'bg-blue-500': status === 'complete',
  });

  return (
    <div
      className={cardClasses}
      onClick={!disabled && !isShortAnswer ? onClick : undefined}
    >
      {!isShortAnswer && (
        <>
          <div className={shortcutClasses}>{shortcut}</div>
          <div className="flex-grow">
            <BlocknoteEditor
              value={text}
              viewOnly
            />
          </div>
          {status && <div className={statusClasses} />}
        </>
      )}
      {isShortAnswer && (
        <Input
          value={inputValue}
          onChange={(e) => onInput(e.target.value)}
          disabled={disabled}
          placeholder="Masukkan jawaban singkat..."
          className="w-full"
        />
      )}
    </div>
  );
};

export default Card;
