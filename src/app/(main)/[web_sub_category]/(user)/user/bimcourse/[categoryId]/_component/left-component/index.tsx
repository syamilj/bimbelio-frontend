import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { ResizablePanel } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';
import { useProvider } from '../../_provider/provider';
import CourseLocked from '../z_other/course-locked';
import HeaderCourse from '../z_other/header';
import NavigationButtons from '../z_other/navigation';
import CourseReport from '../z_other/report';
import CourseScheduled from './_components/course-scheduled';
import CourseUpcoming from './_components/course-upcoming';
import DocumentType from './_components/type-document';
import MateriType from './_components/type-materi';
import TryoutType from './_components/type-tryout';
import VideoType from './_components/type-video';

export default function LeftComponent() {
  const {
    isLocked,
    useParams: { sub },
    useData: { CourseData, Course },
    useDoc: { doc },
  } = useProvider();
  const { mobileScreen } = useAppContext();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const isNotYet =
    !!CourseData?.publishedAt && new Date(CourseData?.publishedAt) > new Date();

  const isUpcoming = CourseData?.status === 'UPCOMING';


  return (
    <ResizablePanel
      defaultSize={50}
      minSize={0}
      className={`DocumentContainer relative ${mobileScreen === 'minimize' && ''} h-[calc(100vh-120px)] bg-bg-workspace`}
    >
      <div
        id="container-course"
        className={cn(
          'absolute top-0 left-0 w-full h-full bg-bg-workspace overflow-y-auto mb-10',
        )}
      >
        <HeaderCourse
          className="flex md:hidden"
          onlyMobile
        />
        {isLocked ? (
          <CourseLocked />
        ) : isUpcoming ? (
          <CourseUpcoming
            courseTitle={CourseData?.title}
            courseDescription={CourseData?.description}
          />
        ) : isNotYet && CourseData?.publishedAt ? (
          <CourseScheduled
            publishedAt={CourseData.publishedAt}
            courseTitle={CourseData.title}
            courseDescription={CourseData.description}
          />
        ) : sub === 'report' ? (
          <CourseReport />
        ) : (
          <Fragment>
            {CourseData?.type === 'DOCUMENT' && doc && userId ? (
              <DocumentType />
            ) : CourseData?.type === 'VIDEO' ? (
              <VideoType />
            ) : CourseData?.type === 'TRYOUT' ||
              CourseData?.type === 'PROGRESS_TEST' ? (
              <TryoutType />
            ) : CourseData?.type === 'MATERI' ? (
              <MateriType />
            ) : null}
          </Fragment>
        )}
      </div>

      {!isLocked && !isNotYet && !isUpcoming && (
        <div className="absolute items-center justify-center hidden md:flex w-full bottom-6 md:left-2 z-100">
          <NavigationButtons />
        </div>
      )}
    </ResizablePanel>
  );
}
