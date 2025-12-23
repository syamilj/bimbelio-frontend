// src/components/_shared/other/card-plan/_components/render-feature.tsx

'use client';

import { Badge } from '@/components/ui/badge';
import { formatDateRange } from '@/lib/utils/date';
import { BookOpen, Calendar, FileText, Star, Users, Video } from 'lucide-react';
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

export const RenderFeatureTab = () => {
  const {
    useData: { plan, isCourse, isDocument, isPrivate },
  } = useProvider();
  if (
    !plan.PlanSubscription?.PlanFeature ||
    plan.PlanSubscription?.PlanFeature.length === 0
  ) {
    if (plan.Pivot_LiveClass_Plan && plan.Pivot_LiveClass_Plan.length > 0) {
      // Show LiveClass features instead
      return (
        <div className="space-y-4">
          <div className="text-center p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg">
            <Video
              size={24}
              className="mx-auto mb-2 text-green-600"
            />
            <h4 className="text-sm font-semibold text-green-800 mb-2">
              Live Class Features
            </h4>
            <p className="text-xs text-green-600">
              Akses ke pembelajaran live interaktif
            </p>
          </div>

          <div className="space-y-3">
            {plan.Pivot_LiveClass_Plan.map((assignment, index) => (
              <div
                key={assignment.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Video
                    size={16}
                    className="text-green-600"
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    {assignment.LiveClass?.title || `Live Class ${index + 1}`}
                  </span>
                </div>
                {assignment.LiveClass?.description && (
                  <p className="text-xs text-gray-600 mb-2">
                    {assignment.LiveClass.description}
                  </p>
                )}
                <div className="flex gap-2">
                  {assignment.LiveClass?.Instructor && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                      <Users
                        size={10}
                        className="mr-1"
                      />
                      {assignment.LiveClass.Instructor.name}
                    </Badge>
                  )}
                  {assignment.LiveClass?.categoryId && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                      <BookOpen
                        size={10}
                        className="mr-1"
                      />
                      {/* {getCategoryName(assignment.LiveClass.categoryId)} */}
                      {plan.PlanSubscription?.WebsiteSubCategory?.name ||
                        'Kategori'}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {plan.PlanSubscription && (
            <div className="p-3 bg-linear-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2">
                <Calendar
                  size={16}
                  className="text-indigo-600"
                />
                <span className="text-sm font-semibold text-indigo-800">
                  Durasi Akses:{' '}
                  {plan.PlanSubscription?.expireDays
                    ? formatDuration(plan.PlanSubscription.expireDays)
                    : plan.PlanSubscription?.PlanFeature?.[0]
                      ? formatDateRange(
                          plan.PlanSubscription.PlanFeature[0].validFrom,
                          plan.PlanSubscription.PlanFeature[0].validUntil,
                        )
                      : 'Tidak terbatas'}
                </span>
              </div>
              <p className="text-xs text-indigo-600 mt-1">
                Akses live class berlaku selama periode subscription aktif
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-center py-8 text-gray-500">
        <BookOpen
          size={48}
          className="mx-auto mb-4 text-gray-300"
        />
        <p className="text-sm">
          Plan ini tidak memiliki fitur subscription khusus
        </p>
        <p className="text-xs text-gray-400">
          Fokus pada limitasi usage atau benefits saja
        </p>
      </div>
    );
  }

  // const getCategorySpecificFeatures = () => {
  //   if (!plan.PlanSubscription.PlanFeature) return {};

  //   const categoryFeatures: {
  //     [categoryId: string]: { course: boolean; document: boolean };
  //   } = {};

  //   plan.PlanSubscription.PlanFeature.filter((f) => f.).forEach(
  //     (feature) => {
  //       if (!categoryFeatures[feature.categoryId!]) {
  //         categoryFeatures[feature.categoryId!] = {
  //           course: false,
  //           document: false,
  //         };
  //       }

  //       if (feature.type === 'COURSE') {
  //         categoryFeatures[feature.categoryId!].course = true;
  //       } else if (feature.type === 'DOCUMENT') {
  //         categoryFeatures[feature.categoryId!].document = true;
  //       }
  //     },
  //   );

  //   return categoryFeatures;
  // };

  // const globalAccess = getGlobalAccessFeatures();
  // const categoryFeatures = getCategorySpecificFeatures();

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg">
        <Star
          size={24}
          className="mx-auto mb-2 text-purple-600"
        />
        <h4 className="text-sm font-semibold text-purple-800 mb-2">
          Subscription Features
        </h4>
        <p className="text-xs text-purple-600">
          Akses ke konten dan fitur premium platform
        </p>
        {/* {plan.PlanSubscription && (
          <p className="text-xs text-purple-500 mt-1">
            Platform: {plan.PlanSubscription.WebsiteSubCategory?.name}
          </p>
        )} */}
      </div>

      {/* Global Access */}
      {(isCourse || isDocument || isPrivate) && (
        <div className="p-3 bg-linear-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
          <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
            <Star
              size={14}
              className="text-emerald-600"
            />
            Global Access
          </h4>
          <div className="space-y-2">
            {isCourse && (
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <BookOpen size={14} />
                <span>✓ Semua Video Course tersedia</span>
              </div>
            )}
            {isDocument && (
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <FileText size={14} />
                <span>✓ Semua Dokumen & Materi tersedia</span>
              </div>
            )}
            {isPrivate && (
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <FileText size={14} />
                <span>✓ Private Sesion dengan Tutor</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category-Specific Access */}
      {/* {Object.keys(categoryFeatures).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin size={14} />
            Akses Per Kategori
          </h4>
          {Object.entries(categoryFeatures).map(([categoryId, access]) => (
            <div
              key={categoryId}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-800">
                  {getCategoryName(categoryId)}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {access.course && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                    <BookOpen
                      size={10}
                      className="mr-1"
                    />
                    Video Course
                  </Badge>
                )}
                {access.document && (
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    <FileText
                      size={10}
                      className="mr-1"
                    />
                    Dokumen & Materi
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )} */}

      {plan.PlanSubscription && (
        <div className="p-3 bg-linear-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2">
            <Calendar
              size={16}
              className="text-indigo-600"
            />
            <span className="text-sm font-semibold text-indigo-800">
              Durasi Akses:{' '}
              {plan.PlanSubscription.expireDays
                ? formatDuration(plan.PlanSubscription.expireDays)
                : plan.PlanSubscription?.PlanFeature?.[0]
                  ? formatDateRange(
                      plan.PlanSubscription.PlanFeature[0].validFrom,
                      plan.PlanSubscription.PlanFeature[0].validUntil,
                    )
                  : 'Tidak terbatas'}
            </span>
          </div>
          <p className="text-xs text-indigo-600 mt-1">
            Akses berlaku selama periode subscription aktif
          </p>
        </div>
      )}
    </div>
  );
};
