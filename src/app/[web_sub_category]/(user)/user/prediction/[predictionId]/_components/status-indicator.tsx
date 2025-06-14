import { cn } from '@/lib/utils';

export const StatusIndicator = ({
  status,
  count,
}: {
  status: string;
  count: number;
}) => {
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
      <span className={cn('text-sm font-medium', config.textColor)}>
        {status}: {count}
      </span>
    </div>
  );
};
