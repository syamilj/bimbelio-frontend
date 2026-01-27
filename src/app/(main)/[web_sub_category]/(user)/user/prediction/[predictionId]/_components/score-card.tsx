import { cn } from '@/lib/utils';

export default function ScoreCard({
  title,
  value,
  subtitle,
  color = 'blue',
}: {
  title: string;
  value: string;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
  };

  return (
    <div className={cn('p-4 rounded-3xl border-2', colorClasses[color])}>
      <div className="text-xs font-semibold opacity-75 mb-1">{title}</div>
      <div className="text-xl font-bold">{value}</div>
      {subtitle && (
        <div className="text-xs font-medium opacity-75 mt-1">{subtitle}</div>
      )}
    </div>
  );
}
