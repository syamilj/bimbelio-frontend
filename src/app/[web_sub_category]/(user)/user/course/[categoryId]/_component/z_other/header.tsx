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
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 ">
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
                <AccordionTrigger className="flex cursor-pointer items-start gap-[.5rem] rounded-[.5rem] px-[1rem] py-[.5rem] text-start text-[1rem] font-semibold duration-300 md:md:hover:bg-surface-primary-light truncate">
                  {chapter.title}
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="ml-[.5rem] flex flex-col gap-[.5rem]">
                    {chapter.CourseSubChapter.map((sChapter, sIndex) => (
                      <div className="relative flex items-center">
                        <div className="absolute right-4 z-[2]">
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
                          href={`/${website_sub_category_id_params}/user/course/${categoryId}?sub=${sChapter.id}`}
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
            href={`/${website_sub_category_id_params}/user/course/${categoryId}?sub=report`}
            className={cn(
              'flex cursor-pointer items-center gap-[.5rem] text-main rounded-[.5rem] px-[1rem] py-[.5rem] text-start text-[1rem] font-semibold duration-300 md:md:hover:bg-surface-primary-light',
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
          'flex w-full items-center justify-between md:justify-center border-b py-4 px-4 bg-white md:bg-white z-[100]',
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
        <div
          className="md:hidden"
          onClick={() => setSidebarMobile(true)}
        >
          {/* <p className="font-semibold">
            <AnimatedGradientText>Limitasi</AnimatedGradientText>
          </p> */}
        </div>
        <div className="flex items-center justify-center gap-[1rem] md:hidden">
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
              'absolute left-0 top-[calc(100%)] z-[102] w-[400px] h-[700px] border p-2 shadow-xl duration-100 overflow-y-auto bg-white overflow-x-hidden rounded-xl mt-2',
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
            'bg-[#ffff] mr-4 ml-4 border p-2 rounded-[3rem] md:w-full max-w-[990px] justify-center items-center gap-4 px-4 sticky z-[120] top-4 md:relative flex md:hidden mt-4',
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
              'absolute left-4 top-[calc(100%)] mt-2 z-[102] w-[300px] h-[500px] border border-main-gray-input bg-white p-2 shadow-sm duration-100 overflow-y-auto overflow-x-hidden rounded-xl',
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
