'use client';

import ConsultationDialog from '@/components/_shared/contact/consultation-dialog';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { PlanDataType } from './components/_helper';
import CompactSidebar from './components/compact-sidebar';
import Hero from './components/hero';
import { LoadingSkeleton } from './components/loading-skeleton';
import TabClasses from './components/tab-classes';
import TabCourse from './components/tab-course';
import TabFeatures from './components/tab-features';
import TabLimits from './components/tab-limits';
import TabOverview from './components/tab-overview';

export default function PlanDetailPage() {
  const { planId } = useParams();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'course' | 'features' | 'classes' | 'limits'
  >('overview');
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
    useState(false);
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  // const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const { data: plan, isLoading: planIsLoading } = useGet<PlanDataType>(
    `/plan/getSinglePlan?slug=${planId}`,
    {
      useEffectDependencies: [planId],
    },
  );

  const tabCourseAvailable = plan?.PlanSubscription?.PlanFeature.find(
    (feature) => feature.type === 'COURSE',
  );

  const tabFeatureAvailable =
    plan?.PlanSubscription?.PlanFeature &&
    plan?.PlanSubscription?.PlanFeature.length > 0;

  if (planIsLoading) {
    return <LoadingSkeleton />;
  }

  if (!plan) {
    return <div className="">Not Found</div>;
  }

  return (
    <>
      <div className="min-h-screen pt-[50px] bg-slate-50/50">
        {/* Hero Section - Compact BimArena Style */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Hero
            plan={plan}
            setIsConsultationDialogOpen={setIsConsultationDialogOpen}
          />
        </div>

        {/* Main Content - Adjusted spacing */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {/* Compact Navigation Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab as any}
                className="w-full"
              >
                <TabsList
                  className={cn(
                    'grid w-full h-full grid-cols-5 mb-6 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-1 shadow-sm',
                    !tabCourseAvailable &&
                      !tabFeatureAvailable &&
                      'grid-cols-3',
                    ((!tabCourseAvailable && tabFeatureAvailable) ||
                      (tabCourseAvailable && !tabFeatureAvailable)) &&
                      'grid-cols-4',
                  )}
                >
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:text-white data-[state=active]:shadow-sm rounded-3xl transition-all duration-200 text-xs py-2"
                    style={{
                      backgroundColor:
                        activeTab === 'overview' ? mainColor : 'transparent',
                    }}
                  >
                    Overview
                  </TabsTrigger>
                  {tabCourseAvailable && (
                    <TabsTrigger
                      value="course"
                      className="data-[state=active]:text-white data-[state=active]:shadow-sm rounded-3xl transition-all duration-200 text-xs py-2"
                      style={{
                        backgroundColor:
                          activeTab === 'course' ? mainColor : 'transparent',
                      }}
                    >
                      Course
                    </TabsTrigger>
                  )}
                  {tabFeatureAvailable && (
                    <TabsTrigger
                      value="features"
                      className="data-[state=active]:text-white data-[state=active]:shadow-sm rounded-3xl transition-all duration-200 text-xs py-2"
                      style={{
                        backgroundColor:
                          activeTab === 'features' ? mainColor : 'transparent',
                      }}
                    >
                      Fitur
                    </TabsTrigger>
                  )}

                  <TabsTrigger
                    value="classes"
                    className="data-[state=active]:text-white data-[state=active]:shadow-sm rounded-3xl transition-all duration-200 text-xs py-2"
                    style={{
                      backgroundColor:
                        activeTab === 'classes' ? mainColor : 'transparent',
                    }}
                  >
                    Live Class
                  </TabsTrigger>
                  <TabsTrigger
                    value="limits"
                    className="data-[state=active]:text-white data-[state=active]:shadow-sm rounded-3xl transition-all duration-200 text-xs py-2"
                    style={{
                      backgroundColor:
                        activeTab === 'limits' ? mainColor : 'transparent',
                    }}
                  >
                    Koin
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent
                  value="overview"
                  className="space-y-6"
                >
                  <TabOverview
                    plan={plan}
                    setActiveTab={setActiveTab}
                  />
                </TabsContent>

                {/* Course Tab - Chapter & SubChapter */}
                <TabsContent
                  value="course"
                  className="space-y-6"
                >
                  <TabCourse plan={plan} />
                </TabsContent>

                {/* Features Tab - BimArena Style */}
                <TabsContent
                  value="features"
                  className="space-y-6"
                >
                  <TabFeatures plan={plan} />
                </TabsContent>

                {/* Live Classes Tab - BimArena Style */}
                <TabsContent
                  value="classes"
                  className="space-y-6"
                >
                  <TabClasses plan={plan} />
                </TabsContent>

                {/* Limits Tab - BimArena Style */}
                <TabsContent value="limits">
                  <TabLimits plan={plan} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Compact Sidebar - BimArena Style */}
            <CompactSidebar
              plan={plan}
              setIsConsultationDialogOpen={setIsConsultationDialogOpen}
            />
          </div>
        </div>
      </div>

      {/* Consultation Dialog */}
      <ConsultationDialog
        isOpen={isConsultationDialogOpen}
        onOpenChange={setIsConsultationDialogOpen}
        title="Wujudkan Impian PTN-mu!"
        description="Pilih langkah pertama untuk memulai journey menuju PTN idaman"
        showStats={true}
      />
    </>
  );
}
