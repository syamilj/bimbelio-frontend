'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { LoadingRetro } from '@/components/ui/loading-retro';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import {
  CourseChapter,
  CourseProgress,
  CourseSubChapter,
  Document,
  Tryout,
  TryoutAnswer,
  TryoutQuestion,
  TryoutSession,
  TryoutSessionParticipant,
  TryoutSessionResult,
  TryoutUserAnswer,
} from '@/types/database';
import { motion } from 'framer-motion';
import { BotMessageSquare, Loader2 } from 'lucide-react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import useMedia from 'use-media';
import HeaderCourse from './_component/header';
import NavigationButtons from './_component/navigation';
import CourseReport from './_component/report';
import DocumentType from './_component/type-document';
import MateriType from './_component/type-materi';
import TryoutType from './_component/type-tryout';
import VideoType from './_component/type-video';
import Sidebar from './sidebar';

// interface QuestionWithAnswers extends TryoutQuestion {
//   TryoutAnswers: TryoutAnswer[];
// }

// interface UserAnswerWithAnswer extends TryoutUserAnswer {
//   TryoutAnswers: TryoutAnswer | null;
// }

// interface SessionParticipantWithUserAnswer extends TryoutSessionParticipant {
//   TryoutUserAnswer: UserAnswerWithAnswer[];
// }

export type TryoutSessionWithQuestion = TryoutSession & {
  TryoutQuestion: (TryoutQuestion & { TryoutAnswers: TryoutAnswer[] })[];
  TryoutSessionResult: TryoutSessionResult[];
  TryoutSessionParticipant: (TryoutSessionParticipant & {
    TryoutUserAnswer: (TryoutUserAnswer & {
      TryoutAnswers: TryoutAnswer | null;
    })[];
  })[];
};

export type Data = {
  id: string;
  number: number;
  title: string;
  chapterTitle: string;
  spendTime: number;
  description: string;
  type: 'TRYOUT' | 'VIDEO' | 'DOCUMENT' | 'MATERI';
  // tryoutSessionId: string | null;
  video: string | null;
  document: string | null;
  premium: boolean;
  materi: string | null;
  TryoutSession: CourseType[0]['CourseSubChapter'][0]['TryoutSession'];
  CourseProgress: CourseProgress[];
};

const WorkspaceCourse = () => {
  const isDekstop = useMedia({ minWidth: '768px' });
  const { data: session } = useSession();
  // const tab = query.tab as string;
  const router = useRouter();

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');
  const sub = searchParams?.get('sub');

  // const [isPlaying, setIsPlaying] = useState(false)
  const pathname = usePathname();
  const userId = session?.user.id;

  const params = useParams();
  const categoryId = Array.isArray(params?.categoryId)
    ? params.categoryId[0]
    : params?.categoryId || null;

  const [data, setData] = useState<Data | null>(null);
  const [indexChapter, setIndexChapter] = useState<number>(0);
  // const [loading, setLoading] = useState<boolean>(true);
  const [showList, setShowList] = useState<boolean>(false);
  const [showAI, setShowAI] = useState<boolean>(false);
  // const [showProgress, setShowProgress] = useState<boolean>(
  //   window.innerWidth > 767 ? false : true,
  // );
  const [docId, setDocId] = useState<string>('');
  const [isHistoryUpdated, setIsHistoryUpdated] = useState(false);

  const { mobileScreen, setMobileScreen } = useAppContext();

  const isMobile = useMedia({ maxWidth: '768px' });

  // const trpc = api.useUtils();

  // const { data: Course, isLoading: CourseLoading } =
  //   api.course.getCourseUserByCategoryId.useQuery(
  //     { categoryId },
  //     { refetchOnWindowFocus: false },
  //   );

  const { data: Course, isLoading: CourseLoading } = useGet<CourseType>(
    '/course/getCourseUserByCategoryId',
    { params: { categoryId }, useEffectDependencies: [categoryId] },
  );
  console.log({ Course });

  // const { data: CourseProgress } = api.course.getProgressByCategory.useQuery(
  //   { categoryId },
  //   { refetchOnWindowFocus: false },
  // );

  const { data: CourseProgress } = useGet('/course/getProgressByCategory', {
    params: { categoryId },
    useEffectDependencies: [categoryId],
  });

  // const { data: doc } = api.document.getDocData.useQuery(
  //   { docId: docId as string, userId: userId as string },
  //   {
  //     enabled: !!docId && !!userId,
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   },
  // );

  const { data: doc } = useGet('/document/getDocData', {
    params: { docId, userId: userId },
    enabled: !!docId,
    useEffectDependencies: [categoryId, docId],
  });

  // const updateHistory = api.document.updateHistory.useMutation({
  //   onSettled: async () => {
  //     await trpc.document.getHistoryByUser.refetch();
  //     await trpc.document.getDocumentTotalPage.refetch();
  //   },
  // });

  const { mutate: updateHistory } = useMutation(
    '/document/updateHistory',
    'put',
    {
      payload: {
        documentId: docId as string,
      },
      onSuccess() {
        //     await trpc.document.getHistoryByUser.refetch();
        //     await trpc.document.getDocumentTotalPage.refetch();
      },
    },
  );

  console.log('Course', Course);
  // console.log('CourseProgress', CourseProgress);

  useEffect(() => {
    setData(null);
  }, [categoryId, pathname]);

  useEffect(() => {
    if (Course) {
      if (sub) {
        // const findData = Course[indexChapter].CourseSubChapter.find(
        //   sChapter => sChapter.id === sub,
        // );
        let findData: any;
        Course.forEach((item) => {
          item.CourseSubChapter.forEach((sChapter) => {
            if (sChapter.id === sub) {
              findData = { ...sChapter, chapterTitle: item.title };
            }
          });
        });
        if (findData) {
          setData({
            id: findData.id,
            number: findData.number,
            title: findData.title,
            chapterTitle: findData.chapterTitle,
            description: findData.description,
            spendTime: findData.spendTime,
            premium: findData.premium,
            type: findData.type,
            document: findData.document,
            video: findData.video,
            materi: findData.materi,
            TryoutSession: findData.TryoutSession,
            CourseProgress: findData.CourseProgress,
          });
        } else {
          setData({
            id: Course[0].CourseSubChapter[0].id,
            number: Course[0].CourseSubChapter[0].number,
            title: Course[0].CourseSubChapter[0].title,
            chapterTitle: Course[0].title,
            description: Course[0].CourseSubChapter[0].description,
            spendTime: Course[0].CourseSubChapter[0].spendTime,
            premium: Course[0].CourseSubChapter[0].premium,
            type: Course[0].CourseSubChapter[0].type,
            document: Course[0].CourseSubChapter[0].document,
            video: Course[0].CourseSubChapter[0].video,
            materi: Course[0].CourseSubChapter[0].materi,
            TryoutSession: Course[0].CourseSubChapter[0].TryoutSession,
            CourseProgress: Course[0].CourseSubChapter[0].CourseProgress,
          });
        }
      } else {
        if (Course.length > 0) {
          setData({
            id: Course[0].CourseSubChapter[0].id,
            number: Course[0].CourseSubChapter[0].number,
            title: Course[0].CourseSubChapter[0].title,
            chapterTitle: Course[0].title,
            description: Course[0].CourseSubChapter[0].description,
            spendTime: Course[0].CourseSubChapter[0].spendTime,
            premium: Course[0].CourseSubChapter[0].premium,
            type: Course[0].CourseSubChapter[0].type,
            document: Course[0].CourseSubChapter[0].document,
            video: Course[0].CourseSubChapter[0].video,
            materi: Course[0].CourseSubChapter[0].materi,
            TryoutSession: Course[0].CourseSubChapter[0].TryoutSession,
            CourseProgress: Course[0].CourseSubChapter[0].CourseProgress,
          });
          router.push(
            `${window.location.pathname}?sub=${Course[0].CourseSubChapter[0].id}&tab=chat`,
          );
        } else {
          setData(null);
        }
      }
    }
    // setLoading(false);
  }, [Course, sub, indexChapter]);

  useEffect(() => {
    if (data?.document) {
      setDocId(data.document);
    }
  }, [data]);

  console.log('Data==========', data);
  console.log('docId==========', docId);

  console.log('tab', tab);

  useEffect(() => {
    if (docId && !isHistoryUpdated) {
      const Run = async () => {
        await updateHistory();
        setIsHistoryUpdated(true);
      };
      Run();
    }
  }, [isHistoryUpdated]);

  useEffect(() => {
    const chatAIContainer = document.querySelector(
      '.chatAIContainer',
    ) as HTMLDivElement;
    const DocumentContainer = document.querySelector(
      '.DocumentContainer',
    ) as HTMLDivElement;
    if (chatAIContainer && DocumentContainer && data?.type === 'TRYOUT') {
      chatAIContainer.setAttribute('data-panel-size', '0.0');
      chatAIContainer.style.cssText = 'flex: 0 1 0px; overflow: hidden;';
      DocumentContainer.setAttribute('data-panel-size', '100.0');
      DocumentContainer.style.cssText =
        'flex: 100.0 1 0px; overflow: hidden; position: relative;';
      setMobileScreen('fullscreen');
    } else if (chatAIContainer && DocumentContainer) {
      DocumentContainer.setAttribute('data-panel-size', '50.0');
      DocumentContainer.style.cssText = 'flex: 50.0 1 0px; overflow: hidden;';
      chatAIContainer.setAttribute('data-panel-size', '50.0');
      chatAIContainer.style.cssText =
        'flex: 50.0 1 0px; overflow: hidden; position: relative;';
      setMobileScreen('minimize');
    }
  }, [data?.type]);

  useEffect(() => {
    if (!tab && sub) {
      router.push(`${window.location.pathname}?sub=${sub}&tab=chat`);
    }
  }, [tab, sub]);

  if (!docId && data?.document) {
    return <p>Document ID not found in the URL.</p>;
  }

  if (!data && CourseLoading) {
    return <LoadingRetro />;
  }

  // if (!data && CourseLoading) {
  //   return <RetroGridDemo />;
  // }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        Course Belum Ada
      </div>
    );
  }

  // if (data.premium && !session?.user.feature.course) {
  //   return (
  //     <div className="flex justify-center items-center h-screen text-xl font-bold">
  //       Course Terkunci
  //     </div>
  //   );
  // }

  return (
    <Fragment>
      <HeaderCourse
        CourseProgress={CourseProgress}
        data={data}
        setShowList={setShowList}
        showList={showList}
        Course={Course}
        categoryId={categoryId}
        setIndexChapter={setIndexChapter}
        className="hidden md:flex"
      />
      <ResizablePanelGroup
        autoSaveId="window-layout"
        direction={isMobile ? 'vertical' : 'horizontal'}
        onLayout={() => {}}
        className="flex-col h-full bg-bg-workspace"
      >
        <ResizablePanel
          defaultSize={50}
          minSize={0}
          className={`DocumentContainer relative ${mobileScreen === 'minimize' && ''} h-[calc(100vh-120px)] bg-bg-workspace`}
        >
          <div
            id="container-course"
            className="overflow-y-auto h-full absolute top-0 left-0 w-full mb-10 bg-bg-workspace"
          >
            <HeaderCourse
              CourseProgress={CourseProgress}
              data={data}
              setShowList={setShowList}
              showList={showList}
              Course={Course}
              categoryId={categoryId}
              setIndexChapter={setIndexChapter}
              className="flex md:hidden"
              onlyMobile
            />
            {sub === 'report' ? (
              <CourseReport />
            ) : (
              <Fragment>
                {data?.type === 'DOCUMENT' && doc && userId ? (
                  <DocumentType
                    doc={doc}
                    userId={userId}
                    data={data}
                  />
                ) : data.type === 'VIDEO' ? (
                  <VideoType
                    data={data}
                    CourseProgress={CourseProgress}
                  />
                ) : data.type === 'TRYOUT' ? (
                  <TryoutType
                    TryoutSession={data.TryoutSession}
                    subCourseId={data.id}
                  />
                ) : data.type === 'MATERI' ? (
                  <MateriType
                    data={data}
                    CourseProgress={CourseProgress}
                  />
                ) : null}
              </Fragment>
            )}
          </div>

          <div className="absolute items-center justify-center hidden md:flex w-full bottom-6 md:left-2 z-[100]">
            <NavigationButtons data={data} />
          </div>
        </ResizablePanel>
        {data.type !== 'TRYOUT' && data.type !== 'MATERI' && (
          <div
            className={`relative ${mobileScreen === 'minimize' ? 'flex' : 'h-0 w-0 overflow-hidden p-0'} items-center justify-center`}
          >
            <ResizableHandle
              className="relative z-[42] h-full w-[.5px] rounded-full bg-main-gray-input duration-300 after:w-[1px] data-[panel-group-direction=vertical]:h-[1px]"
              withHandle
            />
            <div className="absolute z-[41] ml-[-.2px] h-[6px] w-[100px] rounded-[2rem] bg-main-gray-input md:h-[100px] md:w-[6px]"></div>
          </div>
        )}
        {data.type !== 'TRYOUT' && data.type !== 'MATERI' && (
          <>
            {isDekstop ? (
              <ResizablePanel
                defaultSize={50}
                minSize={0}
                className="chatAIContainer relative"
              >
                {userId ? (
                  <Sidebar
                    canEdit={true}
                    userId={userId}
                    docId={docId}
                    courseType={data.type}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[80vh] w-full">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
              </ResizablePanel>
            ) : (
              <>
                <motion.div
                  className="fixed bottom-6 right-4 bg-main shadow-default p-2 rounded-full z-[102]"
                  onClick={() => setShowAI((prev) => !prev)}
                  whileTap={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* Icon */}
                  <BotMessageSquare
                    className="text-white w-8 h-8 transform scale-x-[-1]"
                    strokeWidth={2.1}
                  />

                  {/* Pangkat AI */}
                  <span className="absolute -top-1 left-[-4px] bg-red-500 rounded-full px-[0.35rem] py-1 text-white font-bold text-xs">
                    AI
                  </span>
                </motion.div>
                {userId ? (
                  <Sidebar
                    canEdit={true}
                    userId={userId}
                    docId={docId}
                    courseType={data.type}
                    onClose={() => {
                      setShowAI(false);
                    }}
                    className={cn(
                      'fixed z-[999] left-0 w-full h-full top-[130%] duration-300',
                      showAI && 'top-0',
                    )}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[80vh] w-full">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
              </>
            )}
          </>
        )}
        <div className="fixed md:hidden items-center justify-center flex w-full bottom-6 md:left-2 z-[100]">
          <NavigationButtons data={data} />
        </div>
      </ResizablePanelGroup>
    </Fragment>
  );
};

export default WorkspaceCourse;

export type CourseType = (CourseChapter & {
  CourseSubChapter: (CourseSubChapter & {
    TryoutSession:
      | (TryoutSession & {
          TryoutSessionParticipant: (TryoutSessionParticipant & {
            TryoutUserAnswer: (TryoutUserAnswer & {
              TryoutAnswers: TryoutAnswer | null;
              TryoutQuestion: TryoutQuestion & {
                TryoutAnswers: TryoutAnswer[];
              };
            })[];
            TryoutSession: TryoutSession & {
              Tryout: Tryout;
              Document: {
                id: string;
                category: {
                  id: string;
                };
              } | null;
            };
          })[];
          TryoutQuestion: (TryoutQuestion & {
            TryoutAnswers: TryoutAnswer[];
          })[];
          TryoutSessionResult: TryoutSessionResult[];
        })
      | null;
    CourseProgress: CourseProgress[];
    Document: Document;
  })[];
})[];
