//src/components/_shared/other/card-plan/_components/render-limitation.tsx

'use client';

import { formatDateRange } from '@/lib/utils/date';
import {
  Brain,
  Calendar,
  CheckCircle2,
  Eye,
  FileText,
  Infinity,
  MessageSquare,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useProvider } from '../_provider/provider';

const formatDuration = (days: number) => {
  if (days === 7) return '1 Minggu';
  if (days === 14) return '2 Minggu';
  if (days === 21) return '3 Minggu';
  if (days === 30) return '1 Bulan';
  if (days === 45) return '1.5 Bulan';
  if (days === 60) return '2 Bulan';
  if (days === 90) return '3 Bulan';
  if (days === 120) return '4 Bulan';
  if (days === 180) return '6 Bulan';
  if (days === 365) return '1 Tahun';
  if (days === 730) return '2 Tahun';
  return `${days} Hari`;
};

export const RenderLimitationTab = () => {
  const {
    useData: { plan, hideFeatures },
  } = useProvider();

  const getLimitationIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return MessageSquare;
      case 'notes':
        return FileText;
      case 'vision':
        return Eye;
      case 'quiz':
        return Brain;
      case 'tryout':
        return Target;
      default:
        return CheckCircle2;
    }
  };

  const getLimitationLabel = (type: string) => {
    switch (type) {
      case 'chat':
        return 'Chat AI';
      case 'notes':
        return 'Smart Notes';
      case 'vision':
        return 'Vision AI';
      case 'quiz':
        return 'Quiz Attempt';
      case 'tryout':
        return 'Tryout Test';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const renderLimitationItem = (type: string, limit: number) => {
    const Icon = getLimitationIcon(type);
    const label = getLimitationLabel(type);
    const isUnlimited = limit === -1 || limit === 0;

    if (hideFeatures.includes(type)) return null;

    return (
      <div
        key={type}
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Icon
              size={16}
              className="text-blue-600"
            />
          </div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-semibold">
          {isUnlimited ? (
            <div className="flex items-center gap-1 text-green-600">
              <Infinity size={16} />
              <span className="text-xs">Unlimited</span>
            </div>
          ) : (
            <span className="text-blue-700 font-bold">{limit}</span>
          )}
        </span>
      </div>
    );
  };
  if (!plan.PlanLimitation) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Infinity
          size={48}
          className="mx-auto mb-4 text-green-300"
        />
        <p className="text-sm font-medium">
          Plan ini tidak memiliki limitasi usage
        </p>
        <p className="text-xs text-gray-400">
          Unlimited access untuk semua fitur dasar
        </p>
      </div>
    );
  }

  const limitations = plan.PlanLimitation;
  const limitationEntries = [
    ['chat', limitations.chat],
    ['notes', limitations.notes],
    ['vision', limitations.vision],
    ['quiz', limitations.quiz],
    ['tryout', limitations.tryout],
  ] as const;

  // const hasUnlimited = limitationEntries.some(
  //   ([, limit]) => limit === -1 || limit === 0,
  // );
  const hasUnlimited = false;

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg">
        <TrendingUp
          size={24}
          className="mx-auto mb-2 text-blue-600"
        />
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          Usage Limitations
        </h4>
        <p className="text-xs text-blue-600">
          Batas penggunaan fitur-fitur platform per periode
        </p>
      </div>

      <div className="space-y-2">
        {limitationEntries
          .filter((item) => item[1] > 0)
          .map(([type, limit]) => renderLimitationItem(type, limit))}
      </div>

      {!limitations.isTimebound && limitations.expireDays && (
        <div className="p-3 bg-linear-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2">
            <Calendar
              size={16}
              className="text-indigo-600"
            />
            <span className="text-sm font-semibold text-indigo-800">
              Durasi Akses:{' '}
              {formatDuration(plan.PlanSubscription.expireDays || 0)}
            </span>
          </div>
          <p className="text-xs text-indigo-600 mt-1">
            Akses live class berlaku selama periode subscription aktif
          </p>
        </div>
      )}

      {limitations.isTimebound &&
        limitations.validFrom &&
        limitations.validUntil && (
          <div className="p-3 bg-linear-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <Calendar
                size={16}
                className="text-indigo-600"
              />
              <span className="text-sm font-semibold text-indigo-800">
                Durasi Akses:{' '}
                {formatDateRange(
                  plan.PlanLimitation.validFrom,
                  plan.PlanLimitation.validUntil,
                )}
              </span>
            </div>
            <p className="text-xs text-indigo-600 mt-1">
              Akses live class berlaku selama periode subscription aktif
            </p>
          </div>
        )}

      {hasUnlimited && (
        <div className="p-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Infinity
              size={16}
              className="text-green-600"
            />
            <span className="text-sm font-semibold text-green-800">
              Unlimited Features Available!
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Beberapa fitur tersedia tanpa batas dalam plan ini
          </p>
        </div>
      )}
    </div>
  );
};
