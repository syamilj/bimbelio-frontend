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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  IconChat,
  IconCheckList,
  IconCrown,
  IconDocument,
  IconHamburger,
  IconPen,
  IconPlay,
  IconQuiz,
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
  CalendarClock,
  CircleChevronUp,
  GaugeIcon,
  GemIcon,
  List,
  Rocket,
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
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">Daftar Isi</h3>
          <div
            onClick={() => {
              setShowList(false);
            }}
          >
            <IconX
              className="text-main-gray-text cursor-pointer md:hover:text-main-gray-text2"
              w={
                typeof window !== 'undefined' && window.innerWidth < 769
                  ? 20
                  : 25
              }
            />
          </div>
        </div>
        <div className="flex flex-col">
          {Course?.map((chapter, cIndex) => (
            <Accordion
              key={cIndex}
              type="single"
              collapsible
              defaultValue="item-1"
            >
              <AccordionItem
                value="item-1"
                className="border-none"
              >
                <AccordionTrigger className="flex cursor-pointer items-start gap-[.5rem] rounded-[.5rem] px-4 py-[.5rem] text-start text-[1rem] font-semibold duration-300 md:md:hover:bg-surface-primary-light truncate">
                  {chapter.title}
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="ml-[.5rem] flex flex-col gap-[.5rem]">
                    {chapter.CourseSubChapter.map((sChapter, sIndex) => (
                      <div
                        key={sIndex}
                        className="relative flex items-center"
                      >
                        <div className="absolute right-4 z-2 flex items-center gap-2">
                          {sChapter.status === 'UPCOMING' && (
                            <Rocket className="w-4 h-4 text-purple-500" />
                          )}
                          {sChapter.publishedAt &&
                            new Date(sChapter.publishedAt) > new Date() && (
                              <CalendarClock className="w-4 h-4 text-orange-500" />
                            )}
                          {sChapter.premium && (
                            <div
                              className="flex items-center gap-1 bg-main text-xs text-white px-3 p-1 rounded-3xl cursor-pointer hover:bg-main/90"
                              onClick={() => {
                                if (isHide(sChapter.premium)) {
                                  setTransactionPopUp(true);
                                }
                              }}
                            >
                              Premium{' '}
                              {isHide(sChapter.premium) ? (
                                <GemIcon className="w-4 h-4" />
                              ) : (
                                <GemIcon className="w-4 h-4" />
                              )}
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/${website_sub_category_id_params}/user/bimcourse/${categoryId}/study?sub=${sChapter.id}`}
                          key={sIndex}
                          className={cn(
                            'flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 duration-300 md:hover:bg-surface-primary-light relative w-full',
                            sChapter.id === sub && 'bg-main/10 text-main',
                            // isHide(sChapter.premium) &&
                            //   'pointer-events-none select-none md:hover:bg-transparent',
                          )}
                          onClick={() => {
                            setShowList(false);
                            setIndexChapter(cIndex);
                          }}
                        >
                          {sChapter.CourseProgress.length > 0 ? (
                            <IconCheckList
                              w={18}
                              className="mt-[.2rem] text-green-500"
                            />
                          ) : sChapter.type === 'VIDEO' ? (
                            <IconPlay
                              w={18}
                              className={cn(
                                'mt-[.2rem]',
                                isHide(sChapter.premium) && 'opacity-50',
                              )}
                            />
                          ) : sChapter.type === 'DOCUMENT' ? (
                            <IconDocument
                              w={18}
                              className={cn(
                                'mt-[.2rem]',
                                isHide(sChapter.premium) && 'opacity-50',
                              )}
                            />
                          ) : sChapter.type === 'TRYOUT' ? (
                            <IconQuiz
                              w={18}
                              className={cn(
                                'mt-[.2rem]',
                                isHide(sChapter.premium) && 'opacity-50',
                              )}
                            />
                          ) : (
                            <IconDocument
                              w={18}
                              className={cn(
                                'mt-[.2rem]',
                                isHide(sChapter.premium) && 'opacity-50',
                              )}
                            />
                          )}
                          <div
                            className={cn(
                              'flex flex-col gap-[.5rem] w-full',
                              isHide(sChapter.premium) && 'opacity-50',
                            )}
                          >
                            <div className="text-sm font-medium w-[200px] truncate">
                              {sChapter.title}
                            </div>
                            <div
                              className={cn(
                                'text-xs capitalize flex justify-start gap-1 items-center text-main-gray-text2',
                                sChapter.id === sub && 'text-main',
                              )}
                            >
                              <div>
                                {sChapter.type === 'TRYOUT'
                                  ? 'QUIZ'
                                  : sChapter.type === 'DOCUMENT'
                                    ? 'MATERI'
                                    : sChapter.type === 'MATERI'
                                      ? 'MATERI'
                                      : sChapter.type}{' '}
                              </div>
                              <div className={cn('flex items-center gap-1')}>
                                - {sChapter.spendTime} Menit
                              </div>
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
          <Link
            href={`/${website_sub_category_id_params}/user/bimcourse/${categoryId}/study?sub=report`}
            className={cn(
              'flex cursor-pointer items-center gap-[.5rem] text-main rounded-[.5rem] px-4 py-[.5rem] text-start text-[1rem] font-semibold duration-300 md:md:hover:bg-surface-primary-light',
            )}
            onClick={() => {
              setShowList(false);
            }}
          >
            <GaugeIcon className="h-5 w-5" />
            Rapor
          </Link>
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
          className="fixed top-0 left-0 w-full h-full"
          onClick={() => setShowList(false)}
        />
      )}
      <header
        className={cn(
          'flex w-full items-center justify-between md:justify-center border-b py-4 px-4 bg-white md:bg-white z-100',
          className,
        )}
      >
        <div
          className="md:hidden"
          onClick={() => setSidebarMobile(true)}
        >
          <IconHamburger
            w={20}
            className="text-main-gray-text"
          />
        </div>
        {/* <div
          className="md:hidden"
          onClick={() => setSidebarMobile(true)}
        >
          <p className="font-semibold">
            <AnimatedGradientText>Limitasi</AnimatedGradientText>
          </p>
        </div> */}
        <div className="flex items-center justify-center gap-4 md:hidden">
          {/* Chat limit */}
          <div className="flex items-center gap-[.5rem]">
            <IconChat
              w={18}
              className="text-main-gray-text"
            />
            {renderLimitInfo(
              <IconChat w={18} />,
              userLimitation?.chat,
              userLimitation?.chatLimit,
            )}
          </div>

          {/* Notes limit */}
          <div className="flex items-center gap-[.5rem]">
            <IconPen
              w={18}
              className="text-main-gray-text"
            />
            {renderLimitInfo(
              <IconPen w={18} />,
              userLimitation?.notes,
              userLimitation?.notesLimit,
            )}
          </div>

          {/* Quiz limit */}
          <div className="flex items-center gap-[.5rem]">
            <IconTabsQuiz
              w={18}
              className="text-main-gray-text"
            />
            {renderLimitInfo(
              <IconTabsQuiz w={18} />,
              userLimitation?.quiz,
              userLimitation?.quizLimit,
            )}
          </div>

          {/* Vision limit */}
          <div className="flex items-center gap-[.5rem]">
            <IconVision
              active
              w={20}
              className="text-main-gray-text"
            />
            {renderLimitInfo(
              <IconVision w={18} />,
              userLimitation?.vision,
              userLimitation?.visionLimit,
            )}
          </div>

          {/* Role-based status or button */}
          {!userCourseFeatures ? (
            <ButtonPayment>
              <IconCrown w={15} />
              <p className="font-regular hidden md:block">Upgrade</p>
            </ButtonPayment>
          ) : (
            <div className="flex items-center rounded-xl p-2 bg-main-yellow text-white">
              <IconCrown className="text-white" />
              {/* <p>Admin</p> */}
            </div>
          )}
        </div>
        {/* <motion.div
          className="md:hidden bg-white roun✨ded-full shadow-default p-2"
          onClick={() => setShowProgress((prev) => !prev)}
          whileTap={{ scale: 1.2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Book className="text-main-gray-text w-6 h-6" />
        </motion.div> */}

        <motion.div
          id="1"
          className={cn(
            'bg-white py-0 px-4 rounded-[3rem] md:w-full max-w-[990px] justify-between items-center gap-4 left-2 right-2 sticky top-0 md:relative hidden md:flex ',
            isMobile && 'pointer-events-none',
          )}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div
            className="hover:bg-gray-300 rounded-full p-1 cursor-pointer duration-300 relative"
            onClick={() => {
              setShowList((prev) => !prev);
            }}
          >
            <List
              className="text-main"
              strokeWidth={2}
            />
          </div>
          <div className="flex items-center justify-between px-4 w-full border-x-2 ">
            <div className="flex items-center text-sm gap-4">
              <div className="hidden md:block">
                <BookAIcon className="text-main" />
              </div>
              <div className="text-start text-nowrap">
                <p>{sub === 'report' ? 'Report' : CourseData?.chapterTitle}</p>
                <p className="text-main-gray-text">
                  {sub === 'report'
                    ? 'Report untuk course ini'
                    : CourseData?.title}
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="text-end hidden md:block">
                <p className="text-[#a8a8a8] font-normal">
                  {CourseProgress?.percentageProgress?.toFixed(2)}%
                </p>
                <p className="text-[#a8a8a8] font-normal">
                  {CourseProgress?.finishedSubChapter}/
                  {CourseProgress?.totalSubChapter} chapters
                </p>
              </div>
              <ChartProgress
                percentage={CourseProgress?.percentageProgress || -1}
              />
            </div>
          </div>
          <div
            className="md:hover:bg-gray-300 active:bg-gray-300 md:active:bg-transparent rounded-full p-1 cursor-pointer duration-300 relative"
            onClick={() => {
              const courseContainer = document.getElementById(
                'container-course',
              ) as HTMLDivElement;
              const doc = document.querySelectorAll('.PdfHighlighter');
              if (courseContainer) {
                courseContainer.scrollTo({ top: 0, behavior: 'smooth' });
              }
              if (doc) {
                doc.forEach((item) => {
                  item.scrollTo({ top: 0, behavior: 'smooth' });
                });
              }
            }}
          >
            <CircleChevronUp className="text-main" />
          </div>

          <motion.div
            className={cn(
              'absolute left-0 top-[calc(100%)] z-102 w-[400px] h-[700px] border border-main-gray-input bg-white p-2 shadow-xl duration-100 overflow-y-auto overflow-x-hidden rounded-xl mt-2',
              !showList && 'w-0 h-0 p-0',
            )}
          >
            <ListOfContent />
          </motion.div>
        </motion.div>
      </header>
      {onlyMobile && (
        <motion.div
          id="10"
          className={cn(
            'bg-[#ffff] mr-4 ml-4 border p-2 rounded-[3rem] md:w-full max-w-[990px] justify-center items-center gap-4 px-4 sticky z-120 top-4 md:relative flex md:hidden mt-4',
          )}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div
            className="hover:bg-gray-300 rounded-full p-1 cursor-pointer duration-300 relative"
            onClick={() => {
              setShowList((prev) => !prev);
            }}
          >
            <List
              className="text-main"
              strokeWidth={2}
              size={20}
            />
          </div>
          <div className="flex items-center justify-between px-4 w-full border-x-2">
            <div className="flex items-center text-sm gap-4">
              <div className="hidden md:block">
                <BookAIcon className="text-primary" />
              </div>
              <div className="text-start max-w-[160px]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="truncate">{CourseData?.chapterTitle}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{CourseData?.chapterTitle}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-muted-foreground truncate">
                        {CourseData?.title}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{CourseData?.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex items-center text-sm gap-4">
              <div className="text-end hidden md:block">
                <p className="text-muted-foreground font-normal">
                  {CourseProgress?.percentageProgress ?? 0}%
                </p>
                <p className="text-muted-foreground font-normal">
                  {CourseProgress?.finishedSubChapter ?? 0}/
                  {CourseProgress?.totalSubChapter ?? 0} chapters
                </p>
              </div>
              <ChartProgress
                percentage={CourseProgress?.percentageProgress ?? 0}
              />
            </div>
          </div>
          <div
            className="md:hover:bg-gray-300 active:bg-gray-300 md:active:bg-transparent rounded-full p-1 cursor-pointer duration-300 relative"
            onClick={() => {
              const courseContainer = document.getElementById(
                'container-course',
              ) as HTMLDivElement;
              const doc = document.querySelectorAll('.PdfHighlighter');
              if (courseContainer) {
                courseContainer.scrollTo({ top: 0, behavior: 'smooth' });
              }
              if (doc) {
                doc.forEach((item) => {
                  item.scrollTo({ top: 0, behavior: 'smooth' });
                });
              }
            }}
          >
            {/* <ArrowUp
              fill="#a8a8a8"
              strokeWidth={1}
            /> */}

            <CircleChevronUp className="text-main" />
          </div>

          <motion.div
            className={cn(
              'absolute left-4 top-[calc(100%)] mt-2 z-102 w-[300px] h-[500px] border border-main-gray-input bg-white p-2 shadow-sm duration-100 overflow-y-auto overflow-x-hidden rounded-xl',
              !showList && 'w-0 h-0 p-0',
            )}
          >
            <ListOfContent />
          </motion.div>
        </motion.div>
      )}
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

// import { useAppContext } from '@/components/provider/provider-app';
// import { useUserLimitation } from '@/components/provider/provider-limitation';
// import { useSession } from '@/components/provider/provider-session-auth';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@/components/ui/chart';
// import { cn } from '@/lib/utils';
// import {
//   IconChat,
//   IconCheckList,
//   IconCrown,
//   IconHamburger,
//   IconPen,
//   IconTabsQuiz,
//   IconUnlimited,
//   IconVision,
//   IconX,
// } from '@/styles/icon';
// // import { getCourseUserByCategoryIdProps } from '@/trpc/router/course';
// import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
// import { motion } from 'framer-motion';
// import {
//   BookAIcon,
//   CircleChevronUp,
//   GaugeIcon,
//   GemIcon,
//   List,
// } from 'lucide-react';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { Pie, PieChart } from 'recharts';
// import useMedia from 'use-media';
// import ButtonPayment from '../../../../_components/button-payment';
// import { useProvider } from '../../_provider/provider';

// export default function HeaderCourse({
//   className,
//   onlyMobile,
// }: {
//   className?: string;
//   onlyMobile?: true;
// }) {
//   const { data: session } = useSession();
//   const isMobile = useMedia({ maxWidth: '768px' });
//   const userCourseFeatures = session?.user.feature.course || false;

//   const {
//     useParams: { sub, categoryId },
//     useData: { Course, setIndexChapter, CourseProgress, CourseData },
//     useOther: { setShowList, showList },
//   } = useProvider();
//   const { setSidebarMobile, setTransactionPopUp } = useAppContext();

//   const isHide = (premium: boolean) => {
//     return premium && !userCourseFeatures;
//   };

//   const ListOfContent = () => {
//     return (
//       <div className="flex flex-col h-full max-h-[70vh] w-full">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
//           <div className="flex items-center gap-2">
//             <div className="p-1.5 rounded-md bg-blue-100">
//               <List className="w-4 h-4 text-blue-600" />
//             </div>
//             <h3 className="font-semibold text-gray-900 text-sm">Daftar Isi</h3>
//           </div>
//           <motion.button
//             onClick={() => setShowList(false)}
//             className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <IconX
//               className="text-gray-500"
//               w={16}
//             />
//           </motion.button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-3">
//           <div className="space-y-2">
//             {Course?.map((chapter, cIndex) => (
//               <Accordion
//                 key={chapter.id || cIndex}
//                 type="single"
//                 collapsible
//                 defaultValue="item-1"
//               >
//                 <AccordionItem
//                   value="item-1"
//                   className="border-none"
//                 >
//                   <AccordionTrigger className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-semibold duration-200 hover:bg-blue-50 data-[state=open]:bg-blue-50 data-[state=open]:text-blue-700 [&>svg]:w-4 [&>svg]:h-4">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                       <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
//                         <span className="text-xs font-bold text-blue-600">
//                           {cIndex + 1}
//                         </span>
//                       </div>
//                       <span className="truncate text-left">
//                         {chapter.title}
//                       </span>
//                     </div>
//                   </AccordionTrigger>
//                   <AccordionContent className="pb-1 pl-2">
//                     <div className="space-y-1">
//                       {chapter.CourseSubChapter.map((sChapter, sIndex) => (
//                         <div
//                           key={sChapter.id || sIndex}
//                           className="relative group"
//                         >
//                           <Link
//                             href={`/${website_sub_category_id_params}/user/bimcourse/${categoryId}?sub=${sChapter.id}`}
//                             className={cn(
//                               'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 duration-200 hover:bg-gray-50 relative w-full group text-sm',
//                               sChapter.id === sub &&
//                                 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200',
//                             )}
//                             onClick={() => {
//                               setShowList(false);
//                               setIndexChapter(cIndex);
//                             }}
//                           >
//                             {/* Completion Status */}
//                             <div className="shrink-0">
//                               {sChapter.CourseProgress.length > 0 ? (
//                                 <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
//                                   <IconCheckList
//                                     w={10}
//                                     className="text-green-600"
//                                   />
//                                 </div>
//                               ) : (
//                                 <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-50"></div>
//                               )}
//                             </div>

//                             {/* Content */}
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <div className="font-medium truncate text-sm">
//                                   {sChapter.title}
//                                 </div>
//                                 {/* Premium Badge */}
//                                 {sChapter.premium && (
//                                   <div className="flex items-center gap-1 bg-linear-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
//                                     <span className="font-medium">Pro</span>
//                                     <GemIcon className="w-2.5 h-2.5" />
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <span
//                                   className={cn(
//                                     'text-xs px-2 py-0.5 rounded-full font-medium uppercase',
//                                     sChapter.type === 'VIDEO' &&
//                                       'bg-red-50 text-red-600',
//                                     sChapter.type === 'DOCUMENT' &&
//                                       'bg-blue-50 text-blue-600',
//                                     sChapter.type === 'TRYOUT' &&
//                                       'bg-orange-50 text-orange-600',
//                                     sChapter.type === 'MATERI' &&
//                                       'bg-green-50 text-green-600',
//                                     sChapter.id === sub &&
//                                       'bg-blue-100 text-blue-700',
//                                   )}
//                                 >
//                                   {sChapter.type === 'TRYOUT'
//                                     ? 'QUIZ'
//                                     : sChapter.type === 'DOCUMENT'
//                                       ? 'MATERI'
//                                       : sChapter.type}
//                                 </span>
//                                 <span className="text-xs text-gray-500">
//                                   {sChapter.spendTime}m
//                                 </span>
//                               </div>
//                             </div>
//                           </Link>
//                         </div>
//                       ))}
//                     </div>
//                   </AccordionContent>
//                 </AccordionItem>
//               </Accordion>
//             ))}

//             {/* Report Link */}
//             <Link
//               href={`/${website_sub_category_id_params}/user/bimcourse/${categoryId}?sub=report`}
//               className="flex cursor-pointer items-center gap-3 text-blue-600 rounded-lg px-3 py-2.5 text-sm font-semibold duration-200 hover:bg-blue-50 mt-3 border-t border-gray-100 pt-4"
//               onClick={() => setShowList(false)}
//             >
//               <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
//                 <GaugeIcon className="w-3 h-3 text-blue-600" />
//               </div>
//               <span className="text-sm">Laporan Progress</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // const { data: limitationUsed } = api.user.getCurrentLimitation.useQuery(
//   //   undefined,
//   //   { refetchOnWindowFocus: false },
//   // );

//   const { userLimitation } = useUserLimitation();

//   function renderLimitInfo(
//     icon: React.ReactNode,
//     used?: number,
//     limit?: number,
//   ) {
//     if (session?.user.role !== 'ADMIN') {
//       return (
//         <p className="text-[.9rem] text-main-gray-text">
//           {used}/{limit}
//         </p>
//       );
//     }
//     // Jika ADMIN => unlimited
//     return (
//       <div className="flex items-center text-[.9rem] text-main-gray-text">
//         <IconUnlimited w={15} />/<IconUnlimited w={15} />
//       </div>
//     );
//   }

//   return (
//     <>
//       {showList && (
//         <div
//           className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
//           onClick={() => setShowList(false)}
//         />
//       )}

//       {/* Modern Mobile Header */}
//       <header
//         className={cn(
//           'sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm items-center justify-center',
//           className,
//         )}
//       >
//         {/* Mobile Layout */}
//         <div className="flex md:hidden items-center justify-between px-4 py-3">
//           {/* Left: Menu Button */}
//           <motion.div
//             className="flex items-center"
//             whileTap={{ scale: 0.95 }}
//           >
//             <button
//               onClick={() => setSidebarMobile(true)}
//               className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
//             >
//               <IconHamburger
//                 w={18}
//                 className="text-gray-700"
//               />
//             </button>
//           </motion.div>

//           {/* Center: Course Info */}
//           <div className="flex-1 mx-3">
//             <div className="text-center">
//               <h1 className="text-sm font-semibold text-gray-900 truncate">
//                 {sub === 'report'
//                   ? 'Report'
//                   : CourseData?.chapterTitle || 'Course'}
//               </h1>
//               <p className="text-xs text-gray-500 truncate">
//                 {sub === 'report'
//                   ? 'Report course'
//                   : CourseData?.title || 'Learning'}
//               </p>
//             </div>
//           </div>

//           {/* Right: Quick Actions */}
//           <div className="flex items-center gap-2">
//             {/* Compact Progress */}
//             <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2.5 py-1.5">
//               <span className="text-xs font-medium text-gray-600">
//                 {Math.round(CourseProgress?.percentageProgress || 0)}%
//               </span>
//               <ChartProgress
//                 percentage={CourseProgress?.percentageProgress || 0}
//               />
//             </div>

//             {/* List Toggle */}
//             <motion.button
//               onClick={() => setShowList(!showList)}
//               className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
//               whileTap={{ scale: 0.95 }}
//             >
//               <List
//                 className="w-4 h-4 text-blue-600"
//                 strokeWidth={2.5}
//               />
//             </motion.button>
//           </div>
//         </div>

//         {/* Desktop Layout */}
//         <div className="hidden md:flex items-center justify-center px-4 py-3">
//           <motion.div
//             className="flex items-center justify-between w-full max-w-5xl bg-white rounded-3xl shadow-sm border border-gray-100 px-4 py-2"
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//           >
//             {/* Left: List Toggle */}
//             <motion.button
//               onClick={() => setShowList(!showList)}
//               className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 group relative"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <List
//                 className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors"
//                 strokeWidth={2}
//               />
//             </motion.button>

//             {/* Center: Course Information */}
//             <div className="flex items-center gap-4 flex-1 mx-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-blue-50">
//                   <BookAIcon className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div className="text-left min-w-0 flex-1">
//                   <h2 className="font-semibold text-gray-900 text-sm truncate">
//                     {sub === 'report'
//                       ? 'Course Report'
//                       : CourseData?.chapterTitle}
//                   </h2>
//                   <p className="text-xs text-gray-500 truncate">
//                     {sub === 'report'
//                       ? 'Analisis progres pembelajaran Kamu'
//                       : CourseData?.title}
//                   </p>
//                 </div>
//               </div>

//               {/* Progress Info */}
//               <div className="flex items-center gap-3 ml-auto">
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-gray-900">
//                     {Math.round(CourseProgress?.percentageProgress || 0)}%
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {CourseProgress?.finishedSubChapter || 0} /{' '}
//                     {CourseProgress?.totalSubChapter || 0} chapters
//                   </p>
//                 </div>
//                 <ChartProgress
//                   percentage={CourseProgress?.percentageProgress || 0}
//                 />
//               </div>
//             </div>

//             {/* Right: Scroll to Top */}
//             <motion.button
//               onClick={() => {
//                 const courseContainer =
//                   document.getElementById('container-course');
//                 const docs = document.querySelectorAll('.PdfHighlighter');

//                 if (courseContainer) {
//                   courseContainer.scrollTo({ top: 0, behavior: 'smooth' });
//                 }
//                 docs.forEach((doc) => {
//                   doc.scrollTo({ top: 0, behavior: 'smooth' });
//                 });
//               }}
//               className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <CircleChevronUp className="w-5 h-5 text-gray-600 group-hover:text-gray-700 transition-colors" />
//             </motion.button>
//           </motion.div>
//         </div>

//         {/* Course List Dropdown */}
//         <motion.div
//           className={cn(
//             'absolute z-50 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden',
//             // Mobile positioning
//             'md:hidden left-4 right-4 top-full mt-2',
//             // Desktop positioning - centered
//             'md:block md:top-full md:mt-2 md:w-[520px] md:left-1/3 md:-translate-x-1/2',
//             showList
//               ? 'opacity-100 pointer-events-auto'
//               : 'opacity-0 pointer-events-none',
//           )}
//           initial={false}
//           animate={{
//             scale: showList ? 1 : 0.95,
//             opacity: showList ? 1 : 0,
//           }}
//           transition={{
//             type: 'spring',
//             stiffness: 300,
//             damping: 30,
//             duration: 0.2,
//           }}
//         >
//           {showList && <ListOfContent />}
//         </motion.div>
//       </header>

//       {/* Mobile Floating Limits Bar */}
//       <div className="md:hidden sticky top-14 z-30 mx-4 mt-2">
//         <motion.div
//           className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-200/50 p-3"
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3 overflow-x-auto">
//               {/* Chat Limit */}
//               <div className="flex items-center gap-1.5 shrink-0">
//                 <div className="p-1.5 rounded-lg bg-blue-50">
//                   <IconChat
//                     w={14}
//                     className="text-blue-600"
//                   />
//                 </div>
//                 <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
//                   {renderLimitInfo(
//                     null,
//                     userLimitation?.chat,
//                     userLimitation?.chatLimit,
//                   )}
//                 </span>
//               </div>

//               {/* Notes Limit */}
//               <div className="flex items-center gap-1.5 shrink-0">
//                 <div className="p-1.5 rounded-lg bg-green-50">
//                   <IconPen
//                     w={14}
//                     className="text-green-600"
//                   />
//                 </div>
//                 <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
//                   {renderLimitInfo(
//                     null,
//                     userLimitation?.notes,
//                     userLimitation?.notesLimit,
//                   )}
//                 </span>
//               </div>

//               {/* Quiz Limit */}
//               <div className="flex items-center gap-1.5 shrink-0">
//                 <div className="p-1.5 rounded-lg bg-purple-50">
//                   <IconTabsQuiz
//                     w={14}
//                     className="text-purple-600"
//                   />
//                 </div>
//                 <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
//                   {renderLimitInfo(
//                     null,
//                     userLimitation?.quiz,
//                     userLimitation?.quizLimit,
//                   )}
//                 </span>
//               </div>

//               {/* Vision Limit */}
//               <div className="flex items-center gap-1.5 shrink-0">
//                 <div className="p-1.5 rounded-lg bg-orange-50">
//                   <IconVision
//                     w={14}
//                     className="text-orange-600"
//                   />
//                 </div>
//                 <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
//                   {renderLimitInfo(
//                     null,
//                     userLimitation?.vision,
//                     userLimitation?.visionLimit,
//                   )}
//                 </span>
//               </div>
//             </div>

//             {/* Premium Status */}
//             <div className="ml-3 shrink-0">
//               {!userCourseFeatures ? (
//                 <ButtonPayment>
//                   <div className="flex items-center gap-1 px-3 py-1.5 bg-linear-to-r from-amber-400 to-orange-500 rounded-full">
//                     <IconCrown
//                       w={12}
//                       className="text-white"
//                     />
//                     <span className="text-xs font-medium text-white">Pro</span>
//                   </div>
//                 </ButtonPayment>
//               ) : (
//                 <div className="flex items-center gap-1 px-3 py-1.5 bg-linear-to-r from-green-400 to-emerald-500 rounded-full">
//                   <IconCrown
//                     w={12}
//                     className="text-white"
//                   />
//                   <span className="text-xs font-medium text-white">
//                     Premium
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// }

// const ChartProgress = ({ percentage }: { percentage: number }) => {
//   const isDekstop = useMedia({ minWidth: '768px' });
//   // const chartData = [
//   //   { browser: 'percent', visitors: 100, fill: 'var(--color-percent)' },
//   //   { browser: 'track', visitors: 100, fill: 'var(--color-track)' },
//   // ];

//   const [chartData, setChartData] = useState<
//     { browser: string; visitors: number; fill: string }[]
//   >([
//     { browser: 'percent', visitors: 100, fill: 'var(--color-track)' },
//     { browser: 'track', visitors: 100, fill: 'var(--color-track)' },
//   ]);

//   useEffect(() => {
//     if (percentage >= 0) {
//       setChartData([
//         {
//           browser: 'percent',
//           visitors: percentage,
//           fill: 'var(--color-percent)',
//         },
//         {
//           browser: 'track',
//           visitors: 100 - percentage,
//           fill: 'var(--color-track)',
//         },
//       ]);
//     }
//   }, [percentage]);

//   const chartConfig = {
//     percent: {
//       label: 'Percent',
//       color: '#0091FF',
//     },
//     track: {
//       label: 'track',
//       color: '#F0F0F0',
//     },
//   } satisfies ChartConfig;

//   return (
//     <ChartContainer
//       config={chartConfig}
//       className="mx-auto aspect-square w-[40px] md:w-[50px] h-[40px] md:h-[50px]"
//     >
//       <PieChart>
//         <ChartTooltip
//           cursor={false}
//           content={<ChartTooltipContent hideLabel />}
//         />
//         <Pie
//           data={chartData}
//           dataKey="visitors"
//           nameKey="browser"
//           innerRadius={isDekstop ? 10 : 8}
//         />
//       </PieChart>
//     </ChartContainer>
//   );
// };
