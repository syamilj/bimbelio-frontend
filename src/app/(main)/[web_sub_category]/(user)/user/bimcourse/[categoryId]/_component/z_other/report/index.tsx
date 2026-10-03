'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingRetro } from '@/components/ui/loading-retro';
import { Trophy } from 'lucide-react';
import { useParams } from 'next/navigation';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { useGet } from '@/lib/fetch-helper/useGet';
import { CourseReportStats } from './course-report-stats';

export default function CourseReport() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0066FF';

  const params = useParams();
  const categoryId = Array.isArray(params?.categoryId)
    ? params.categoryId[0]
    : params?.categoryId || '';

  // const { data: courseReport, isLoading } =
  //   api.course.getReportByCategory.useQuery(
  //     { categoryId },
  //     { refetchOnWindowFocus: false },
  //   );

  const { data: courseReport, isLoading } = useGet(
    '/course/getReportByCategory',
    {
      params: { categoryId },
      useEffectDependencies: [categoryId],
    },
  );

  // Jika loading
  if (isLoading || !courseReport) {
    return <LoadingRetro />;
  }

  const { categoryName } = courseReport;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="relative bg-linear-to-br from-gray-50 to-white pb-8">
          <div
            className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-20"
            style={{ backgroundColor: mainColor }}
          />
          <div className="flex items-start gap-4 relative z-10">
            <div
              className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-black text-gray-900">
                BimCourse Report
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                {session?.user?.name} &middot; {categoryName}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <CourseReportStats report={courseReport} />
        </CardContent>
      </Card>
    </div>
  );
}
