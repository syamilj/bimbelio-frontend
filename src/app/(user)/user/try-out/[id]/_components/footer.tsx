import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface FooterProps {
  onShowAnswer?: () => void;
  onCheck: () => void;
  status: 'correct' | 'wrong' | 'none' | 'complete';
  disabled?: boolean;
}

const Footer = ({ onCheck, status, disabled, onShowAnswer }: FooterProps) => {
  return (
    <footer
      className={cn(
        'h-[100px] border-t-2 lg:h-[140px]',
        status === 'correct' && 'border-transparent bg-blue-100',
        status === 'wrong' && 'border-transparent bg-rose-100',
      )}
    >
      <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-6 lg:px-10">
        {status === 'correct' && (
          <div className="flex items-center text-base font-bold text-green-500 lg:text-2xl">
            <CheckCircle className="mr-4 size-6 lg:mr-2 lg:size-10" />
            Nicely done!
          </div>
        )}
        {status === 'wrong' && (
          <div className="flex items-center text-base font-bold text-rose-500 lg:text-2xl">
            <XCircle className="mr-4 size-6 lg:mr-2 lg:size-10" />
            Oops! Try again!
          </div>
        )}
        <Button
          disabled={disabled}
          className="ml-auto w-[100px]"
          onClick={onCheck}
          variant={status === 'wrong' ? 'destructive' : 'default'}
        >
          {status === 'none' && 'Check'}
          {status === 'correct' && 'Next'}
          {status === 'wrong' && 'Retry'}
          {status === 'complete' && 'Back'}
        </Button>
        {status !== 'complete' && (
          <Button
            variant="outline"
            className="ml-2"
            size="icon"
            onClick={onShowAnswer}
            disabled={status === 'correct'}
          >
            🔍
          </Button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
