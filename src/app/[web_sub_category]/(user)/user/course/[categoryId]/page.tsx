'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { LoadingRetro } from '@/components/ui/loading-retro';
import {
  ResizableHandle,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useMutation } from '@/lib/fetch-helper/useMutation';
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
import LeftComponent from './_component/left-component';
import RightComponent from './_component/right-component';
import CourseNotFound from './_component/z_other/course-not-found';
import HeaderCourse from './_component/z_other/header';
import NavigationButtons from './_component/z_other/navigation';
import { CourseType, useProvider } from './_provider/provider';

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
    useData: {
      CourseData,
      CourseLoading,
      setIndexChapter,
      Course,
      CourseProgress,
    },
    useDoc: { doc, docId },
    useParams: { sub, tab },
    useOther: { setShowAI, setShowList, showAI, showList },
  } = useProvider();
  const isDekstop = useMedia({ minWidth: '768px' });
  const { data: session } = useSession();

  const userId = session?.user.id;

  const params = useParams();
  const categoryId = Array.isArray(params?.categoryId)
    ? params.categoryId[0]
    : params?.categoryId || null;

  // const [showList, setShowList] = useState<boolean>(false);
  // const [showAI, setShowAI] = useState<boolean>(false);

  const [isHistoryUpdated, setIsHistoryUpdated] = useState(false);

  const { mobileScreen, setMobileScreen } = useAppContext();

  const isMobile = useMedia({ maxWidth: '768px' });

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

  useEffect(() => {
    if (docId && !isHistoryUpdated) {
      const Run = async () => {
        await updateHistory();
        setIsHistoryUpdated(true);
      };
      Run();
    }
  }, [isHistoryUpdated]);

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
        className="flex-col h-full bg-bg-workspace"
      >
        <LeftComponent />
        <ResizableHandleComponent />
        <RightComponent />
        <div className="fixed md:hidden items-center justify-center flex w-full bottom-6 md:left-2 z-[100]">
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
    <div
      className={`relative ${mobileScreen === 'minimize' ? 'flex' : 'h-0 w-0 overflow-hidden p-0'} items-center justify-center`}
    >
      <ResizableHandle
        className="relative z-[42] h-full w-[.5px] rounded-full bg-main-gray-input duration-300 after:w-[1px] data-[panel-group-direction=vertical]:h-[1px]"
        withHandle
      />
      <div className="absolute z-[41] ml-[-.2px] h-[6px] w-[100px] rounded-[2rem] bg-main-gray-input md:h-[100px] md:w-[6px]"></div>
    </div>
  );
};
