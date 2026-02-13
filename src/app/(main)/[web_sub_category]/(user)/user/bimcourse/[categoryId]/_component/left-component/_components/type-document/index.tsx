import DocViewer from '@/components/pdf-reader';
import { useSession } from '@/components/provider/provider-session-auth';
import { Loader2 } from 'lucide-react';
import { useProvider } from '../../../../_provider/provider';
import EmojiRating from '../../../z_other/emoji-rating';

const DocumentType = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const {
    useDoc: { doc },
    useData: { CourseData },
  } = useProvider();

  const isDone =
    CourseData && CourseData.CourseProgress.length > 0 ? true : false;

  return (
    <>
      {userId ? (
        <>
          <DocViewer
            doc={doc as any}
            userId={userId}
            canEdit={true}
            isCourseDone={isDone}
          />
          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-white">
            <span className="text-[11px] text-slate-400">Rating Materi</span>
            <EmojiRating />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[80vh] w-full">
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        </div>
      )}
    </>
  );
};

export default DocumentType;
