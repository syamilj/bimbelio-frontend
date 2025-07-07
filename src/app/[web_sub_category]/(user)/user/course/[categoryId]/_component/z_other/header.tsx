import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import {
  IconChat,
  IconCheckList,
  IconCrown,
  IconHamburger,
  IconPen,
  IconTabsQuiz,
  IconUnlimited,
  IconVision,
  IconX,
} from '@/styles/icon';
// import { getCourseUserByCategoryIdProps } from '@/trpc/router/course';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { motion } from 'framer-motion';
import {
  BookAIcon,
  CircleChevronUp,
  GaugeIcon,
  GemIcon,
  List,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Pie, PieChart } from 'recharts';
import useMedia from 'use-media';
import ButtonPayment from '../../../../_components/button-payment';
import { useProvider } from '../../_provider/provider';

export default function HeaderCourse({
  className,
  onlyMobile,
}: {
  className?: string;
  onlyMobile?: true;
}) {
  const { data: session } = useSession();
  const isMobile = useMedia({ maxWidth: '768px' });
  const userCourseFeatures = session?.user.feature.course || false;

  const {
    useParams: { sub, categoryId },
    useData: { Course, setIndexChapter, CourseProgress, CourseData },
    useOther: { setShowList, showList },
  } = useProvider();
  const { setSidebarMobile, setTransactionPopUp } = useAppContext();

  const isHide = (premium: boolean) => {
    return premium && !userCourseFeatures;
  };

  const ListOfContent = () => {
    return (
      <div className="flex flex-col h-full max-h-[70vh] w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-100">
              <List className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Daftar Isi</h3>
          </div>
          <motion.button
            onClick={() => setShowList(false)}
            className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconX
              className="text-gray-500"
              w={16}
            />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {Course?.map((chapter, cIndex) => (
              <Accordion
                key={chapter.id || cIndex}
                type="single"
                collapsible
                defaultValue="item-1"
              >
                <AccordionItem
                  value="item-1"
                  className="border-none"
                >
                  <AccordionTrigger className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-semibold duration-200 hover:bg-blue-50 [&[data-state=open]]:bg-blue-50 [&[data-state=open]]:text-blue-700 [&>svg]:w-4 [&>svg]:h-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">
                          {cIndex + 1}
                        </span>
                      </div>
                      <span className="truncate text-left">
                        {chapter.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pl-2">
                    <div className="space-y-1">
                      {chapter.CourseSubChapter.map((sChapter, sIndex) => (
                        <div
                          key={sChapter.id || sIndex}
                          className="relative group"
                        >
                          <Link
                            href={`/${website_sub_category_id_params}/user/course/${categoryId}?sub=${sChapter.id}`}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 duration-200 hover:bg-gray-50 relative w-full group text-sm',
                              sChapter.id === sub &&
                                'bg-blue-50 text-blue-700 shadow-sm border border-blue-200',
                            )}
                            onClick={() => {
                              setShowList(false);
                              setIndexChapter(cIndex);
                            }}
                          >
                            {/* Completion Status */}
                            <div className="flex-shrink-0">
                              {sChapter.CourseProgress.length > 0 ? (
                                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                                  <IconCheckList
                                    w={10}
                                    className="text-green-600"
                                  />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-50"></div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-medium truncate text-sm">
                                  {sChapter.title}
                                </div>
                                {/* Premium Badge */}
                                {sChapter.premium && (
                                  <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    <span className="font-medium">Pro</span>
                                    <GemIcon className="w-2.5 h-2.5" />
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    'text-xs px-2 py-0.5 rounded-full font-medium uppercase',
                                    sChapter.type === 'VIDEO' &&
                                      'bg-red-50 text-red-600',
                                    sChapter.type === 'DOCUMENT' &&
                                      'bg-blue-50 text-blue-600',
                                    sChapter.type === 'TRYOUT' &&
                                      'bg-orange-50 text-orange-600',
                                    sChapter.type === 'MATERI' &&
                                      'bg-green-50 text-green-600',
                                    sChapter.id === sub &&
                                      'bg-blue-100 text-blue-700',
                                  )}
                                >
                                  {sChapter.type === 'TRYOUT'
                                    ? 'QUIZ'
                                    : sChapter.type === 'DOCUMENT'
                                      ? 'MATERI'
                                      : sChapter.type}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {sChapter.spendTime}m
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}

            {/* Report Link */}
            <Link
              href={`/${website_sub_category_id_params}/user/course/${categoryId}?sub=report`}
              className="flex cursor-pointer items-center gap-3 text-blue-600 rounded-lg px-3 py-2.5 text-sm font-semibold duration-200 hover:bg-blue-50 mt-3 border-t border-gray-100 pt-4"
              onClick={() => setShowList(false)}
            >
              <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
                <GaugeIcon className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-sm">Laporan Progress</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // const { data: limitationUsed } = api.user.getCurrentLimitation.useQuery(
  //   undefined,
  //   { refetchOnWindowFocus: false },
  // );

  const { userLimitation } = useUserLimitation();

  function renderLimitInfo(
    icon: React.ReactNode,
    used?: number,
    limit?: number,
  ) {
    if (session?.user.role !== 'ADMIN') {
      return (
        <p className="text-[.9rem] text-main-gray-text">
          {used}/{limit}
        </p>
      );
    }
    // Jika ADMIN => unlimited
    return (
      <div className="flex items-center text-[.9rem] text-main-gray-text">
        <IconUnlimited w={15} />/<IconUnlimited w={15} />
      </div>
    );
  }

  return (
    <>
      {showList && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
          onClick={() => setShowList(false)}
        />
      )}

      {/* Modern Mobile Header */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm items-center justify-center',
          className,
        )}
      >
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between px-4 py-3">
          {/* Left: Menu Button */}
          <motion.div
            className="flex items-center"
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => setSidebarMobile(true)}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <IconHamburger
                w={18}
                className="text-gray-700"
              />
            </button>
          </motion.div>

          {/* Center: Course Info */}
          <div className="flex-1 mx-3">
            <div className="text-center">
              <h1 className="text-sm font-semibold text-gray-900 truncate">
                {sub === 'report'
                  ? 'Report'
                  : CourseData?.chapterTitle || 'Course'}
              </h1>
              <p className="text-xs text-gray-500 truncate">
                {sub === 'report'
                  ? 'Report course'
                  : CourseData?.title || 'Learning'}
              </p>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Compact Progress */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2.5 py-1.5">
              <span className="text-xs font-medium text-gray-600">
                {Math.round(CourseProgress?.percentageProgress || 0)}%
              </span>
              <ChartProgress
                percentage={CourseProgress?.percentageProgress || 0}
              />
            </div>

            {/* List Toggle */}
            <motion.button
              onClick={() => setShowList(!showList)}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <List
                className="w-4 h-4 text-blue-600"
                strokeWidth={2.5}
              />
            </motion.button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-center px-4 py-3">
          <motion.div
            className="flex items-center justify-between w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Left: List Toggle */}
            <motion.button
              onClick={() => setShowList(!showList)}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List
                className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors"
                strokeWidth={2}
              />
            </motion.button>

            {/* Center: Course Information */}
            <div className="flex items-center gap-4 flex-1 mx-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <BookAIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900 text-sm truncate">
                    {sub === 'report'
                      ? 'Course Report'
                      : CourseData?.chapterTitle}
                  </h2>
                  <p className="text-xs text-gray-500 truncate">
                    {sub === 'report'
                      ? 'Analisis progres pembelajaran Anda'
                      : CourseData?.title}
                  </p>
                </div>
              </div>

              {/* Progress Info */}
              <div className="flex items-center gap-3 ml-auto">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {Math.round(CourseProgress?.percentageProgress || 0)}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {CourseProgress?.finishedSubChapter || 0} /{' '}
                    {CourseProgress?.totalSubChapter || 0} chapters
                  </p>
                </div>
                <ChartProgress
                  percentage={CourseProgress?.percentageProgress || 0}
                />
              </div>
            </div>

            {/* Right: Scroll to Top */}
            <motion.button
              onClick={() => {
                const courseContainer =
                  document.getElementById('container-course');
                const docs = document.querySelectorAll('.PdfHighlighter');

                if (courseContainer) {
                  courseContainer.scrollTo({ top: 0, behavior: 'smooth' });
                }
                docs.forEach((doc) => {
                  doc.scrollTo({ top: 0, behavior: 'smooth' });
                });
              }}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CircleChevronUp className="w-5 h-5 text-gray-600 group-hover:text-gray-700 transition-colors" />
            </motion.button>
          </motion.div>
        </div>

        {/* Course List Dropdown */}
        <motion.div
          className={cn(
            'absolute z-50 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden',
            // Mobile positioning
            'md:hidden left-4 right-4 top-full mt-2',
            // Desktop positioning - centered
            'md:block md:top-full md:mt-2 md:w-[520px] md:left-1/3 md:-translate-x-1/2',
            showList
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          )}
          initial={false}
          animate={{
            scale: showList ? 1 : 0.95,
            opacity: showList ? 1 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.2,
          }}
        >
          {showList && <ListOfContent />}
        </motion.div>
      </header>

      {/* Mobile Floating Limits Bar */}
      <div className="md:hidden sticky top-14 z-30 mx-4 mt-2">
        <motion.div
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-200/50 p-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-x-auto">
              {/* Chat Limit */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="p-1.5 rounded-lg bg-blue-50">
                  <IconChat
                    w={14}
                    className="text-blue-600"
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                  {renderLimitInfo(
                    null,
                    userLimitation?.chat,
                    userLimitation?.chatLimit,
                  )}
                </span>
              </div>

              {/* Notes Limit */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="p-1.5 rounded-lg bg-green-50">
                  <IconPen
                    w={14}
                    className="text-green-600"
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                  {renderLimitInfo(
                    null,
                    userLimitation?.notes,
                    userLimitation?.notesLimit,
                  )}
                </span>
              </div>

              {/* Quiz Limit */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="p-1.5 rounded-lg bg-purple-50">
                  <IconTabsQuiz
                    w={14}
                    className="text-purple-600"
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                  {renderLimitInfo(
                    null,
                    userLimitation?.quiz,
                    userLimitation?.quizLimit,
                  )}
                </span>
              </div>

              {/* Vision Limit */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="p-1.5 rounded-lg bg-orange-50">
                  <IconVision
                    w={14}
                    className="text-orange-600"
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                  {renderLimitInfo(
                    null,
                    userLimitation?.vision,
                    userLimitation?.visionLimit,
                  )}
                </span>
              </div>
            </div>

            {/* Premium Status */}
            <div className="ml-3 flex-shrink-0">
              {!userCourseFeatures ? (
                <ButtonPayment>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
                    <IconCrown
                      w={12}
                      className="text-white"
                    />
                    <span className="text-xs font-medium text-white">Pro</span>
                  </div>
                </ButtonPayment>
              ) : (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full">
                  <IconCrown
                    w={12}
                    className="text-white"
                  />
                  <span className="text-xs font-medium text-white">
                    Premium
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

const ChartProgress = ({ percentage }: { percentage: number }) => {
  const isDekstop = useMedia({ minWidth: '768px' });
  // const chartData = [
  //   { browser: 'percent', visitors: 100, fill: 'var(--color-percent)' },
  //   { browser: 'track', visitors: 100, fill: 'var(--color-track)' },
  // ];

  const [chartData, setChartData] = useState<
    { browser: string; visitors: number; fill: string }[]
  >([
    { browser: 'percent', visitors: 100, fill: 'var(--color-track)' },
    { browser: 'track', visitors: 100, fill: 'var(--color-track)' },
  ]);

  useEffect(() => {
    if (percentage >= 0) {
      setChartData([
        {
          browser: 'percent',
          visitors: percentage,
          fill: 'var(--color-percent)',
        },
        {
          browser: 'track',
          visitors: 100 - percentage,
          fill: 'var(--color-track)',
        },
      ]);
    }
  }, [percentage]);

  const chartConfig = {
    percent: {
      label: 'Percent',
      color: '#0091FF',
    },
    track: {
      label: 'track',
      color: '#F0F0F0',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-[40px] md:w-[50px] h-[40px] md:h-[50px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={isDekstop ? 10 : 8}
        />
      </PieChart>
    </ChartContainer>
  );
};
