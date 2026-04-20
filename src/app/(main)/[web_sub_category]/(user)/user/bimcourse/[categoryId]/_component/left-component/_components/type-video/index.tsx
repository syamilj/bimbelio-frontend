import ReactMarkdownBlog from '@/components/ui/react-markdown-blog';
import { env } from '@/env.mjs';
import { useVideoHLS } from '@/hooks/use-hls-video';
import { IconCheckList } from '@/styles/icon';
import 'katex/dist/katex.min.css';
import { ClockIcon, Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useProvider } from '../../../../_provider/provider';
import EmojiRating from '../../../z_other/emoji-rating';
import SubmitCourse from '../../../z_other/submit-course';

const VideoType = () => {
  const {
    useData: { CourseData, CourseProgress },
  } = useProvider();

  useEffect(() => {
    const video = document.getElementById('course-video') as HTMLDivElement;
    if (video) {
      video.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      });
    }

    return () => {
      const video = document.getElementById('course-video') as HTMLDivElement;
      if (video) {
        video.removeEventListener('contextmenu', function (event) {
          event.preventDefault();
        });
      }
    };
  }, []);

  // useEffect(() => {
  //   hideVideoLink({
  //     link: `${env.NEXT_PUBLIC_SUPABASE_VIDEO_URL}/course/${CourseData?.video}`,
  //     setUrl: setVideoUrl,
  //   });
  // }, []);

  const isDone =
    CourseData && CourseData.CourseProgress.length > 0 ? true : false;

  const { videoRef } = useVideoHLS(
    `${env.NEXT_PUBLIC_SUPABASE_VIDEO_URL}/course/${CourseData?.video}`,
  );

  // const remarkMathOptions = {
  //   singleDollarTextMath: false,
  // };

  return (
    <div
      id="course-video"
      className="flex flex-col gap-4 p-4 md:p-6 h-full w-full max-w-[1000px] mx-auto"
    >
      {isDone && (
        <div className="flex w-full justify-between items-center rounded-3xl bg-slate-50 border border-slate-200/60 px-4 py-2.5">
          <div className="flex items-center gap-2 text-blue-600 text-sm">
            <Loader className="h-3.5 w-3.5" />
            <span>
              {CourseProgress
                ? `${CourseProgress.percentageProgress}% Selesai`
                : 'Progress tidak tersedia'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <ClockIcon className="h-3.5 w-3.5" />
            <span>{CourseData?.spendTime ?? 0} Menit</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            <IconCheckList
              className="text-emerald-500"
              w={16}
            />
            <span>Selesai</span>
          </div>
        </div>
      )}
      {!isDone && (
        <div className="flex w-full justify-end">
          <SubmitCourse />
        </div>
      )}
      {CourseData?.video && CourseData?.video?.length > 0 && (
        <div className="flex h-fit w-full flex-col">
          <video
            ref={videoRef}
            controls
            controlsList="nodownload"
            className="h-fit w-full rounded-3xl bg-black shadow-sm"
          ></video>
        </div>
      )}
      <h2 className="text-xl font-semibold text-slate-800">
        {CourseData?.title}
      </h2>
      {/* <p className="">{CourseData?.description}</p> */}
      {/* <MarkdownPreview
        source={CourseData?.description}
        remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        wrapperElement={{
          'data-color-mode': 'light',
        }}
        className="ReactMarkdown course select-none pb-20"
      /> */}

      <ReactMarkdownBlog
        value={CourseData?.description || ''}
        className="pt-2 pb-8"
      />
      <div className="flex items-center justify-between rounded-3xl bg-slate-50 border border-slate-200/60 px-4 py-2.5 mb-28">
        <span className="text-xs font-semibold text-slate-600">
          Berikan Rating
        </span>
        <EmojiRating />
      </div>
    </div>
  );
};

export default VideoType;
