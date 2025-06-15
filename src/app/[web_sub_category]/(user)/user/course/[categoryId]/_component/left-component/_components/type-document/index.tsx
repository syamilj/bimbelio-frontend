import DocViewer from '@/components/pdf-reader';
import { useSession } from '@/components/provider/provider-session-auth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
          <Accordion
            type="single"
            collapsible
            className=""
          >
            <AccordionItem
              value="item-1"
              className="border-none"
            >
              <AccordionTrigger className="flex cursor-pointer items-start gap-[.5rem] rounded-[.5rem] px-[1rem] py-[.5rem] text-start text-[1rem] font-semibold duration-300 md:md:hover:bg-surface-primary-light truncate">
                Berikan Rating
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="w-full h-full flex justify-center items-center">
                  <EmojiRating />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <DocViewer
            doc={doc as any}
            userId={userId}
            canEdit={true}
            isCourseDone={isDone}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-[80vh] w-full">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
    </>
  );
};

export default DocumentType;
