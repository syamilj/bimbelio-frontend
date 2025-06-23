import { cn } from '@/lib/utils';
import { LockOpen } from 'lucide-react';
import { useProvider } from '../../_provider/provider';
import PaymentPrediction from './payment-prediction';

export const StatusIndicator = ({
  status,
  count,
  isLocked,
}: {
  status: string;
  count: number;
  isLocked?: boolean;
}) => {
  const { isLock: lock } = useProvider();

  const isLock = isLocked !== undefined ? isLocked : lock;

  const statusConfig = {
    Lolos: { color: 'bg-green-500', textColor: 'text-green-700' },
    Nyaris: { color: 'bg-yellow-500', textColor: 'text-yellow-700' },
    'Tidak Lolos': { color: 'bg-red-500', textColor: 'text-red-700' },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig['Tidak Lolos'];

  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-3 h-3 rounded-full', config.color)} />
      <div
        className={cn(
          'text-sm font-medium flex items-center',
          config.textColor,
        )}
      >
        <span>{status}: </span>
        {isLock ? (
          <PaymentPrediction>
            <span className="bg-yellow-100 w-6 h-6 flex justify-center items-center rounded-full ml-1 hover:scale-125 duration-300 cursor-pointer">
              <LockOpen className="w-4 h-4 text-yellow-600" />
            </span>
          </PaymentPrediction>
        ) : (
          <span>{count}</span>
        )}
      </div>
    </div>
  );
};
