//src/components/workspace-course/_component/type-materi/index.tsx

import ReactMarkdownBlog from '@/components/ui/react-markdown-blog';
import { IconCheckList } from '@/styles/icon';
import 'katex/dist/katex.min.css';
import { ClockIcon, Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useProvider } from '../../../../_provider/provider';
import EmojiRating from '../../../z_other/emoji-rating';
import SubmitCourse from '../../../z_other/submit-course';

export default function MateriType() {
  const {
    useData: { CourseData, CourseProgress },
  } = useProvider();

  useEffect(() => {
    const materi = document.getElementById('course-materi') as HTMLDivElement;
    if (materi) {
      materi.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      });
    }

    return () => {
      const materi = document.getElementById('course-materi') as HTMLDivElement;
      if (materi) {
        materi.removeEventListener('contextmenu', function (event) {
          event.preventDefault();
        });
      }
    };
  }, []);

  // Jika sub-chapter ini sudah pernah disubmit, CourseProgress akan terisi -> isDone = true
  const isDone = CourseData && CourseData.CourseProgress.length > 0;

  // Markdown setting
  // const remarkMathOptions = {
  //   singleDollarTextMath: false,
  // };

  // Jika belum ada CourseData? materi, jangan render apapun
  if (!CourseData?.materi) return null;

  return (
    <div
      id="course-materi"
      className="w-full h-full max-w-[1000px] mx-auto px-4 py-4"
    >
      <div className="flex w-full justify-between items-center my-4">
        {/* Bagian progress */}
        <div className="flex items-center gap-2 text-blue-600">
          <Loader className="h-4 w-4" />
          <span>{CourseProgress?.percentageProgress.toFixed(2)}% Selesai</span>
        </div>

        {/* Bagian estimasi waktu atau durasi */}
        <div className="flex items-center gap-2 text-gray-600">
          <ClockIcon className="h-4 w-4" />
          <span>{CourseData.spendTime ?? 0} Menit</span>
        </div>
        {isDone && (
          // Penanda Selesai
          <div className="flex items-center gap-2 text-primary">
            <p>Selesai</p>
            <IconCheckList className="text-green-500" />
          </div>
        )}
      </div>

      {/* Jika sub-chapter belum disubmit / belum selesai */}
      {!isDone && (
        <div className="flex w-full justify-between items-center my-4">
          {/* Estimasi waktu baca atau durasi di sini juga */}
          <div className="flex items-center gap-2 text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>{CourseData.spendTime ?? 0} Menit</span>
          </div>

          {/* Tombol Submit jika belum selesai */}
          <SubmitCourse />
        </div>
      )}

      {/* Konten materi (Markdown) */}

      {/* <BlocknoteEditor
        value={CourseData.materi}
        viewOnly
        className="pt-4 pb-12"
      /> */}

      <ReactMarkdownBlog
        value={CourseData.materi}
        className="pt-4 pb-12"
      />
      <div className="w-full flex justify-center pb-28">
        <EmojiRating />
      </div>
    </div>
  );
}
