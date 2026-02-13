'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { LoadingRetro } from '@/components/ui/loading-retro';
import {
  ResizableHandle,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { cn } from '@/lib/utils';
import {
  CourseProgress,
  TryoutAnswer,
  TryoutQuestion,
  TryoutSession,
  TryoutSessionParticipant,
  TryoutSessionResult,
  TryoutUserAnswer,
} from '@/types/database';
import { useParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import useMedia from 'use-media';
import LeftComponent from '../_component/left-component';
import RightComponent from '../_component/right-component';
import CourseNotFound from '../_component/z_other/course-not-found';
import HeaderCourse from '../_component/z_other/header';
import NavigationButtons from '../_component/z_other/navigation';
import { CourseType, useProvider } from '../_provider/provider';

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
  const {
    useData: { CourseData, CourseLoading, Course },
    useDoc: { docId },
  } = useProvider();
  const { data: session } = useSession();

  const params = useParams();
  const categoryId = Array.isArray(params?.categoryId)
    ? params.categoryId[0]
    : params?.categoryId || null;

  // const [showList, setShowList] = useState<boolean>(false);
  // const [showAI, setShowAI] = useState<boolean>(false);

  const [isHistoryUpdated, setIsHistoryUpdated] = useState(false);

  const isMobile = useMedia({ maxWidth: '768px' });

  const { mutate: updateHistory } = useMutation(
    '/document/updateHistory',
    'put',
    {
      payload: {
        documentId: docId as string,
      },
      toast: {
        hideSuccess: true,
        hideError: true,
      },
      onSuccess() {
        //     await trpc.document.getHistoryByUser.refetch();
        //     await trpc.document.getDocumentTotalPage.refetch();
      },
    },
  );

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
    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Course Detail',
        content_type: 'page',
        content_id: `course_detail_${categoryId}`,
      },
      user: session?.user
        ? {
            email: session.user.email,
            phone: session.user.phone || undefined,
            userId: session.user.id,
            firstName: session.user.name?.split(' ')[0],
            lastName: session.user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    });
  }, [categoryId, session]);

  if (!docId && CourseData?.document) {
    return <p>Document ID not found in the URL.</p>;
  }

  if (!CourseData && CourseLoading) {
    return <LoadingRetro />;
  }

  // if (!data && CourseLoading) {
  //   return <RetroGridDemo />;
  // }

  if (Course?.length === 0 && !CourseLoading) {
    return <CourseNotFound />;
  }

  // if (CourseData?.premium && !session?.user.feature.course) {
  //   return (
  //     <Fragment>
  //       <HeaderCourse className="hidden md:flex" />
  //       <CourseLocked />
  //     </Fragment>
  //   );
  // }
  return (
    <Fragment>
      <HeaderCourse className="hidden md:flex" />
      <ResizablePanelGroup
        autoSaveId="window-layout"
        direction={isMobile ? 'vertical' : 'horizontal'}
        onLayout={() => {}}
        className="flex-col h-full bg-slate-50/50"
      >
        <LeftComponent />
        <ResizableHandleComponent />
        <RightComponent />
        <div className="fixed bottom-4 left-1/2 z-100 flex w-full -translate-x-1/2 items-center justify-center px-3 md:hidden">
          <NavigationButtons />
        </div>
      </ResizablePanelGroup>
    </Fragment>
  );
};

export default WorkspaceCourse;

const ResizableHandleComponent = () => {
  const {
    useData: { CourseData },
  } = useProvider();
  const { mobileScreen } = useAppContext();

  if (CourseData?.type === 'TRYOUT' || CourseData?.type === 'MATERI') {
    return null;
  }

  return (
    <ResizableHandle
      className={cn(
        'relative z-42 w-[5px] bg-slate-200/80 transition-colors duration-200 data-[panel-group-direction=vertical]:h-[5px] data-[panel-group-direction=vertical]:w-full hover:bg-blue-400 active:bg-blue-500',
        mobileScreen !== 'minimize' && 'h-0 w-0 overflow-hidden',
      )}
      withHandle
    />
  );
};
