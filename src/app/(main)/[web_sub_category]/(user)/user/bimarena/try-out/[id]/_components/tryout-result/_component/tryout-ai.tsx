import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BimBot } from '@/components/ui/bim-brand';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Chat from '@/components/workspace/chat';
import { MessageDataType } from '@/components/workspace/chat/provider';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Bot, X } from 'lucide-react';
import { ReactNode } from 'react';

export const TryoutAI = ({
  participantId,
  children,
  number,
}: {
  participantId: string;
  children: ReactNode;
  number: number;
}) => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  // const [prevChatMessages, setPrevChatMessages] = useState<MessageDataType[]>(
  //   [],
  // );

  const {
    data: Messages,
    isLoading: isLoadingPrevMessage,
    refetch: fetchMessages,
    error: messageError,
  } = useGet<MessageDataType[]>(
    `/chatTryout/getAllMessageByParticipantId?participantId=${participantId}&userId=${session?.user.id}`,
  );

  const prevChatMessages = Messages || [];

  if (!number) return 'Number is required2';

  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col">
        {/* Clean Header */}
        <SheetHeader className="relative px-4 py-3 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-center gap-2 pr-6">
            <div
              className="w-8 h-8 rounded-3xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${mainColor}cc)`,
              }}
            >
              <Bot className="w-4 h-4 text-white" />
            </div>
            <SheetTitle className="text-sm font-bold text-slate-800">
              <BimBot /> AI
              <span className="mx-1.5 text-slate-300">|</span>
              <span className="font-medium text-slate-500">Soal {number}</span>
            </SheetTitle>
          </div>
          <SheetClose className="absolute top-1/2 -translate-y-1/2 right-3 p-1.5 rounded-full cursor-pointer duration-200 hover:bg-slate-100">
            <X className="w-4 h-4 text-slate-400" />
          </SheetClose>
        </SheetHeader>

        {/* Chat Container */}
        <div className="flex flex-1 flex-col relative overflow-hidden">
          <Chat
            apiChat={`${env.NEXT_PUBLIC_API_URL}/ai/chatTryout?website_sub_category_id=${websiteSubCategory?.id}`}
            body={{ participantId, userId: session?.user.id, number }}
            messages={{
              prevChatMessages,
              isLoadingPrevMessage,
            }}
            fetchMessages={fetchMessages}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
