import DocViewer from '@/components/pdf-reader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';
import { Data } from '../../page';
import EmojiRating from '../emoji-rating';

type DocProps = {
  id: any;
  title: any;
  highlights: any;
  messages: any;
  premium: boolean;
  url: any;
  video: any;
  userPermissions: {
    canEdit: boolean;
  };
};

const DocumentType = ({
  doc,
  userId,
  data,
}: {
  doc: DocProps;
  userId: string;
  data: Data;
}) => {
  const isDone = data.CourseProgress.length > 0 ? true : false;
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
