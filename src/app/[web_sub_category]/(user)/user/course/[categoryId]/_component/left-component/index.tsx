import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { ResizablePanel } from '@/components/ui/resizable';
import { Fragment } from 'react';
import { useProvider } from '../../_provider/provider';
import CourseLocked from '../z_other/course-locked';
import HeaderCourse from '../z_other/header';
import NavigationButtons from '../z_other/navigation';
import CourseReport from '../z_other/report';
import DocumentType from './_components/type-document';
import MateriType from './_components/type-materi';
import TryoutType from './_components/type-tryout';
import VideoType from './_components/type-video';

export default function LeftComponent() {
  const {
    useParams: { sub },
    useData: { CourseData },
    useDoc: { doc },
  } = useProvider();
  const { mobileScreen, setMobileScreen } = useAppContext();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const isLocked = CourseData?.premium && !session?.user.feature.course;

  return (
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
          className="flex md:hidden"
          onlyMobile
        />
        {isLocked ? (
          <CourseLocked />
        ) : sub === 'report' ? (
          <CourseReport />
        ) : (
          <Fragment>
            {CourseData?.type === 'DOCUMENT' && doc && userId ? (
              <DocumentType />
            ) : CourseData?.type === 'VIDEO' ? (
              <VideoType />
            ) : CourseData?.type === 'TRYOUT' ? (
              <TryoutType />
            ) : CourseData?.type === 'MATERI' ? (
              <MateriType />
            ) : null}
          </Fragment>
        )}
      </div>

      {!isLocked && (
        <div className="absolute items-center justify-center hidden md:flex w-full bottom-6 md:left-2 z-[100]">
          <NavigationButtons />
        </div>
      )}
    </ResizablePanel>
  );
}
