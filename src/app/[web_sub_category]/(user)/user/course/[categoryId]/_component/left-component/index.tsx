import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { ResizablePanel } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';
import StartCourse from '../../_components/start-course';
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
    useData: { CourseData, showStartCourse, setShowStartCourse, Course },
    useDoc: { doc },
  } = useProvider();
  const { mobileScreen, setMobileScreen } = useAppContext();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const isNotYet =
    !!CourseData?.publishedAt && new Date(CourseData?.publishedAt) > new Date();

  const isUpcoming = CourseData?.status === 'UPCOMING';

  // Handle start course flow
  const handleStartCourse = () => {
    setShowStartCourse(false);
    // Navigate to first chapter if available
    if (Course && Course.length > 0 && Course[0].CourseSubChapter.length > 0) {
      const firstSubChapter = Course[0].CourseSubChapter[0];
      // Remove start parameter and add sub and tab parameters
      const newUrl = `${window.location.pathname}?sub=${firstSubChapter.id}&tab=chat`;
      window.history.replaceState({}, '', newUrl);
      // Force reload to update provider state
      window.location.reload();
    }
  };

  // Prepare course data for StartCourse component
  const courseDataForStart = Course
    ? {
        id: Course[0]?.id || '',
        title: Course[0]?.title || 'Course',
        description:
          'Start your learning journey with this comprehensive course.',
        totalChapters: Course.length,
        totalSubChapters: Course.reduce(
          (total, chapter) => total + chapter.CourseSubChapter.length,
          0,
        ),
        estimatedDuration: Course.reduce(
          (total, chapter) =>
            total +
            chapter.CourseSubChapter.reduce(
              (subTotal, subChapter) => subTotal + subChapter.spendTime,
              0,
            ),
          0,
        ),
        level: 'BEGINNER' as const, // You can make this dynamic based on course data
        category: Course[0]?.title || 'General',
        enrolledCount: 0, // You can add this to your database if needed
        // Add full course structure for detailed view
        chapters: Course.map((chapter, index) => ({
          id: chapter.id,
          title: chapter.title,
          number: index + 1,
          subChapters: chapter.CourseSubChapter.map((subChapter, subIndex) => ({
            id: subChapter.id,
            title: subChapter.title,
            type: subChapter.type,
            spendTime: subChapter.spendTime,
            number: subIndex + 1,
            premium: subChapter.premium,
            description: subChapter.description,
            img: subChapter.Document?.img || null, // Get thumbnail from Document
          })),
        })),
      }
    : null;

  // If showing start course, render full screen without ResizablePanel
  if (showStartCourse && courseDataForStart) {
    return (
      <div
        className="h-screen overflow-y-auto"
        // style={{ height: '100vh', overflowY: 'auto' }}
      >
        <StartCourse
          courseData={courseDataForStart}
          onStart={handleStartCourse}
        />
      </div>
    );
  }

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
