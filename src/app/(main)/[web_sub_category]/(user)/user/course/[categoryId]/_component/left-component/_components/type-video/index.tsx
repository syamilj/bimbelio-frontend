import ReactMarkdownBlog from '@/components/ui/react-markdown-blog';
import { env } from '@/env.mjs';
import { hideVideoLink } from '@/lib/utils';
import { IconCheckList } from '@/styles/icon';
import 'katex/dist/katex.min.css';
import { ClockIcon, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useProvider } from '../../../../_provider/provider';
import EmojiRating from '../../../z_other/emoji-rating';
import SubmitCourse from '../../../z_other/submit-course';

const VideoType = () => {
  const {
    useData: { CourseData, CourseProgress },
  } = useProvider();
  const [videoUrl, setVideoUrl] = useState<string>('');

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

  useEffect(() => {
    hideVideoLink({
      link: `${env.NEXT_PUBLIC_SUPABASE_VIDEO_URL}/course/${CourseData?.video}`,
      setUrl: setVideoUrl,
    });
  }, []);

  const isDone =
    CourseData && CourseData.CourseProgress.length > 0 ? true : false;

  // const remarkMathOptions = {
  //   singleDollarTextMath: false,
  // };

  return (
    <div
      id="course-video"
      className="flex flex-col gap-4 p-6 h-full w-full max-w-[1000px] mx-auto"
    >
      {isDone && (
        // <div className="mb-8 mt-4 flex w-full justify-start text-[1.3rem] font-semibold">
        //   <div className="relative flex items-center gap-[.5rem]">
        //     <p>Course Ini Telah Selesai</p>
        //     <IconCheckList className="text-green-600" />
        //     <div className="absolute top-[90%] h-[2px] w-[90%] bg-green-600" />
        //   </div>
        // </div>
        <div className="flex w-full justify-between items-center my-4">
          {/* Bagian progress */}
          <div className="flex items-center gap-2 text-blue-600">
            <Loader className="h-4 w-4" />
            <span>
              {/* Pastikan CourseProgress tidak undefined */}
              {CourseProgress
                ? `${CourseProgress.percentageProgress}% Selesai`
                : 'Progress tidak tersedia'}
            </span>
          </div>

          {/* Bagian estimasi waktu atau durasi */}
          <div className="flex items-center gap-2 text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>{CourseData?.spendTime ?? 0} Menit</span>
          </div>

          {/* Penanda Selesai */}
          <div className="flex items-center gap-2 text-primary">
            <p>Selesai</p>
            <IconCheckList className="text-green-500" />
          </div>
        </div>
      )}
      {!isDone && (
        <div className="flex w-full justify-end">
          <SubmitCourse />
        </div>
      )}
      {videoUrl.length > 0 && (
        <div
          className={`flex h-fit w-full flex-col p-0 pb-0 duration-300 ease-in-out`}
        >
          <video
            controls
            controlsList="nodownload"
            className="h-fit w-full rounded-[.8rem] bg-black"
          >
            <source
              src={videoUrl}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <h2 className="text-2xl">{CourseData?.title}</h2>
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
        className="pt-4 pb-12"
      />
      <div className="w-full flex justify-center pb-28">
        <EmojiRating />
      </div>
    </div>
  );
};

export default VideoType;
