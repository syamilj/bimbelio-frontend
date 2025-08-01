//src/components/_shared/other/card-plan/_components/render-overview.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Crown,
  FileText,
  Gift,
  MapPin,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useProvider } from '../_provider/provider';

export const RenderOverviewTab = () => {
  const {
    useData: { plan, isCourse, isDocument },
    useState: { setShowAllBenefits, showAllBenefits },
  } = useProvider();

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

  return (
    <div className="space-y-4">
      {/* Plan Type Badge */}
      <div className="flex items-center justify-center">
        <Badge className={`flex items-center gap-2`}>
          Statis
          <span className="font-semibold">Statis</span>
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg">
          {/* Limitation Stats (jika ada) */}
          {plan.PlanLimitation && (
            <div className="text-center">
              <TrendingUp
                size={20}
                className="mx-auto mb-1 text-blue-600"
              />
              <div className="text-lg font-bold text-blue-600">
                {Object.entries(plan.PlanLimitation)
                  .filter(([key]) => key !== 'id' && key !== 'planId')
                  .some(([, value]) => value === -1 || value === 0)
                  ? '∞'
                  : 'Limited'}
              </div>
              <div className="text-xs text-blue-600">Usage Limits</div>
            </div>
          )}

          {/* Subscription Stats (jika ada) */}
          {plan.PlanSubscription && (
            <div className="text-center">
              <Calendar
                size={20}
                className="mx-auto mb-1 text-green-600"
              />
              <div className="text-lg font-bold text-green-600">
                {formatDuration(plan.PlanSubscription.expireDays)}
              </div>
              <div className="text-xs text-green-600">Duration</div>
            </div>
          )}

          {/* Features Count (jika ada) */}
          {plan.PlanSubscription.PlanFeature &&
            plan.PlanSubscription.PlanFeature.length > 0 && (
              <div className="text-center">
                <Star
                  size={20}
                  className="mx-auto mb-1 text-purple-600"
                />
                <div className="text-lg font-bold text-purple-600">
                  {plan.PlanSubscription.PlanFeature.length}
                </div>
                <div className="text-xs text-purple-600">Features</div>
              </div>
            )}

          {/* Benefits Count */}
          <div className="text-center">
            <Gift
              size={20}
              className="mx-auto mb-1 text-pink-600"
            />
            <div className="text-lg font-bold text-pink-600">
              {plan.PlanBenefit.length}
            </div>
            <div className="text-xs text-pink-600">Benefits</div>
          </div>
        </div>

        {/* Global Access Info */}
        {(isCourse || isDocument) && (
          <div className="p-3 bg-linear-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
            <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
              <Star
                size={14}
                className="text-emerald-600"
              />
              Global Access
            </h4>
            <div className="flex gap-2 flex-wrap">
              {isCourse && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                  <BookOpen
                    size={12}
                    className="mr-1"
                  />
                  All Courses
                </Badge>
              )}
              {isDocument && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                  <FileText
                    size={12}
                    className="mr-1"
                  />
                  All Documents
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Platform/WebSubCategory Info (jika subscription) */}
      {plan.PlanSubscription && (
        <div className="p-3 bg-linear-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <div className="text-center">
            <div className="text-sm font-semibold text-indigo-700 flex items-center justify-center gap-2">
              <MapPin size={14} />
              Platform: {plan.PlanSubscription.WebsiteSubCategory?.name}
            </div>
            <div className="text-xs text-indigo-600 mt-1">
              Tier: {plan.PlanSubscription.tier}
            </div>
          </div>
        </div>
      )}

      {/* Top Benefits */}
      {plan.PlanBenefit.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Star
              size={14}
              className="text-yellow-500"
            />
            Keuntungan Utama
          </h4>

          {plan.PlanBenefit.slice(0, 3).map((benefit, index) => (
            <div
              key={benefit.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${
                index === 0
                  ? 'bg-linear-to-r from-yellow-50 to-orange-50 border-yellow-500'
                  : index === 1
                    ? 'bg-linear-to-r from-blue-50 to-purple-50 border-blue-500'
                    : 'bg-linear-to-r from-green-50 to-teal-50 border-green-500'
              }`}
            >
              <div className="shrink-0 mt-1">
                {index === 0 ? (
                  <Crown
                    size={16}
                    className="text-yellow-600"
                  />
                ) : index === 1 ? (
                  <Award
                    size={16}
                    className="text-blue-600"
                  />
                ) : (
                  <CheckCircle2
                    size={16}
                    className="text-green-600"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800 mb-1">
                  {benefit.title}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}

          {plan.PlanBenefit.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllBenefits(!showAllBenefits)}
              className="w-full text-blue-600 hover:text-blue-700"
            >
              {showAllBenefits ? (
                <>
                  <ChevronUp
                    size={16}
                    className="mr-1"
                  />
                  Sembunyikan
                </>
              ) : (
                <>
                  <ChevronDown
                    size={16}
                    className="mr-1"
                  />
                  Lihat {plan.PlanBenefit.length - 3} benefit lainnya
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
