'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { LoadingRetro } from '@/components/ui/loading-retro';
import {
  BlocknoteEditorType,
  schema,
} from '@/components/workspace/editor/provider';
import { useGet } from '@/lib/fetch-helper/useGet';
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
import { useCreateBlockNote } from '@blocknote/react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Provider({ children }: Props) {
  const { setMobileScreen } = useAppContext();

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // ===== Params ================================
  const tab = searchParams?.get('tab');
  const sub = searchParams?.get('sub');
  const startParam = searchParams?.get('start'); // New parameter to detect start flow
  const categoryId = Array.isArray(params?.categoryId)
    ? params.categoryId[0]
    : params?.categoryId || null;

  useEffect(() => {
    if (!pathname || !sub) return;

    const isStudyPath = pathname.endsWith('/study');
    const currentQuery = searchParams?.toString();
    const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;

    if (!isStudyPath) {
      const targetUrl = `${pathname}/study?sub=${sub}&tab=${tab || 'chat'}`;
      if (currentUrl !== targetUrl) {
        router.replace(targetUrl);
      }
      return;
    }

    if (!tab) {
      const targetUrl = `${pathname}?sub=${sub}&tab=chat`;
      if (currentUrl !== targetUrl) {
        router.replace(targetUrl);
      }
    }
  }, [pathname, tab, sub, router, searchParams]);

  // ===== Editor ================================
  const editor = useCreateBlockNote({
    schema,
  });

  // ===== Data & IndexChapter ================================
  const [CourseData, setCourseData] = useState<Data | null>(null);
  const [indexChapter, setIndexChapter] = useState<number>(0);

  const {
    data: Course,
    isLoading: CourseLoading,
    refetch: CourseRefetch,
  } = useGet<CourseType>('/course/getCourseUserByCategoryId', {
    params: { categoryId },
    enabled: !!categoryId,
    useEffectDependencies: [categoryId],
  });

  const { data: CourseProgress, refetch: CourseProgressRefetch } = useGet(
    '/course/getProgressByCategory',
    {
      params: { categoryId },
      enabled: !!categoryId,
      useEffectDependencies: [categoryId],
    },
  );

  const { data: CourseAnalytics, isLoading: AnalyticsLoading } = useGet(
    '/course/getCourseAnalytics',
    {
      params: { categoryId },
      enabled: !!categoryId,
      useEffectDependencies: [categoryId],
    },
  );

  useEffect(() => {
    setCourseData(null);
  }, [categoryId]);

  useEffect(() => {
    if (Course && CourseProgress) {
      // Check if user has any progress in this course category
      const hasProgress =
        Array.isArray(CourseProgress) &&
        CourseProgress.some(
          (progress: any) =>
            progress.courseSubChapterId &&
            Array.isArray(Course) &&
            Course.some(
              (chapter: any) =>
                Array.isArray(chapter.CourseSubChapter) &&
                chapter.CourseSubChapter.some(
                  (subChapter: any) =>
                    subChapter.id === progress.courseSubChapterId,
                ),
            ),
        );

      if (sub) {
        let findData: any;
        Course.forEach((item) => {
          item.CourseSubChapter.forEach((sChapter) => {
            if (sChapter.id === sub) {
              findData = { ...sChapter, chapterTitle: item.title };
            }
          });
        });
        if (findData) {
          setCourseData({
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
            status: findData.status,
            publishedAt: findData.publishedAt,
            TryoutSession: findData.TryoutSession,
            CourseProgress: findData.CourseProgress,
          });
        } else {
          if (Course.length > 0 && Course[0].CourseSubChapter.length > 0) {
            setCourseData({
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
              status: Course[0].CourseSubChapter[0].status,
              publishedAt: Course[0].CourseSubChapter[0].publishedAt
                ? new Date(Course[0].CourseSubChapter[0].publishedAt)
                : null,
              TryoutSession: Course[0].CourseSubChapter[0].TryoutSession,
              CourseProgress: Course[0].CourseSubChapter[0].CourseProgress,
            });
          }
        }
      } else {
        // Keep overview page stable when opening /bimcourse/[categoryId]
        // and only auto-navigate when already inside /study.
        if (Course.length > 0 && Course[0].CourseSubChapter.length > 0) {
          setCourseData({
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
            status: Course[0].CourseSubChapter[0].status,
            publishedAt: Course[0].CourseSubChapter[0].publishedAt
              ? new Date(Course[0].CourseSubChapter[0].publishedAt)
              : null,
            TryoutSession: Course[0].CourseSubChapter[0].TryoutSession,
            CourseProgress: Course[0].CourseSubChapter[0].CourseProgress,
          });
          if (pathname?.endsWith('/study')) {
            const targetUrl = `${pathname}?sub=${Course[0].CourseSubChapter[0].id}&tab=chat`;
            const currentQuery = searchParams?.toString();
            const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;
            if (currentUrl !== targetUrl) {
              router.replace(targetUrl);
            }
          }
        } else {
          setCourseData(null);
        }
      }
    }
  }, [Course, CourseProgress, sub, router, pathname, searchParams]);

  useEffect(() => {
    const chatAIContainer = document.querySelector(
      '.chatAIContainer',
    ) as HTMLDivElement;
    const DocumentContainer = document.querySelector(
      '.DocumentContainer',
    ) as HTMLDivElement;
    if (chatAIContainer && DocumentContainer && CourseData?.type === 'TRYOUT') {
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
  }, [CourseData?.type, setMobileScreen]);

  // ===== Doc ================================
  const [docId, setDocId] = useState<string>('');

  const { data: doc } = useGet('/document/getDocData', {
    params: { docId, userId: userId },
    enabled: !!docId && !!userId,
    useEffectDependencies: [categoryId, docId, userId],
  });

  useEffect(() => {
    if (CourseData?.document) {
      setDocId(CourseData.document);
    }
  }, [CourseData]);

  const [showList, setShowList] = useState<boolean>(false);
  const [showAI, setShowAI] = useState<boolean>(false);

  const courseFeatures = session?.user?.feature.course;

  const isPremium = CourseData?.premium || false;
  const isAdmin = courseFeatures === 'ALLOW';
  const isBuy =
    !!categoryId &&
    !!courseFeatures &&
    Array.isArray(courseFeatures) &&
    courseFeatures.includes(categoryId);

  const isLocked = (isPremium && !isAdmin && !isBuy) || false;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [sub]);

  const Context = {
    isLocked,
    useParams: {
      tab,
      sub,
      categoryId,
    },
    useData: {
      CourseProgressRefetch,
      CourseRefetch,
      CourseProgress,
      Course,
      CourseLoading,
      CourseData,
      setCourseData,
      indexChapter,
      setIndexChapter,
      CourseAnalytics,
      AnalyticsLoading,
    },
    useDoc: {
      docId,
      setDocId,
      doc,
    },
    useOther: {
      showList,
      setShowList,
      showAI,
      setShowAI,
    },
    editor,
  };

  if (isLoading) return <LoadingRetro />;

  return (
    <ProviderContext.Provider value={Context}>
      {children}
    </ProviderContext.Provider>
  );
}

const ProviderContext = createContext<undefined | ProviderType>(undefined);

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within an ProviderContext');
  }
  return context;
};

type ProviderType = {
  isLocked: boolean;
  useParams: {
    tab: string | null;
    sub: string | null;
    categoryId: string | null;
  };
  useData: {
    CourseProgressRefetch: () => Promise<
      | {
          message: string;
          status: number;
          data?: any;
          page?: number;
          total_pages?: number;
        }
      | undefined
    >;
    CourseRefetch: () => Promise<
      | {
          message: string;
          status: number;
          data?: any;
          page?: number;
          total_pages?: number;
        }
      | undefined
    >;
    CourseProgress: any;
    Course: CourseType | null;
    CourseLoading: boolean;
    CourseData: Data | null;
    setCourseData: Dispatch<SetStateAction<Data | null>>;
    indexChapter: number;
    setIndexChapter: Dispatch<SetStateAction<number>>;
    CourseAnalytics: any;
    AnalyticsLoading: boolean;
  };
  useDoc: {
    docId: string;
    setDocId: Dispatch<SetStateAction<string>>;
    doc: any;
  };
  useOther: {
    showList: boolean;
    setShowList: Dispatch<SetStateAction<boolean>>;
    showAI: boolean;
    setShowAI: Dispatch<SetStateAction<boolean>>;
  };
  editor: BlocknoteEditorType;
};

export type Data = {
  id: string;
  number: number;
  title: string;
  chapterTitle: string;
  spendTime: number;
  description: string;
  type: 'TRYOUT' | 'VIDEO' | 'DOCUMENT' | 'MATERI' | 'PROGRESS_TEST';
  // tryoutSessionId: string | null;
  video: string | null;
  document: string | null;
  premium: boolean;
  materi: string | null;
  status: 'DRAFT' | 'PUBLISH' | 'UPCOMING';
  publishedAt: Date | null;
  TryoutSession: CourseType[0]['CourseSubChapter'][0]['TryoutSession'];
  CourseProgress: CourseProgress[];
};

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
