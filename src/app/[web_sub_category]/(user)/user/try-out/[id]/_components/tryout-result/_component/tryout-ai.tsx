import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Chat from '@/components/workspace/chat';
import { MessageDataType } from '@/components/workspace/chat/provider';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { X } from 'lucide-react';
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

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:w-[600px]">
        <SheetClose className="z-[99999] absolute top-2 right-2 bg-white border p-1 rounded-lg cursor-pointer duration-200 hover:scale-105">
          <X className="w-4 h-4 text-gray-500" />
        </SheetClose>
        <Chat
          apiChat={`${env.NEXT_PUBLIC_API_URL}/ai/chatTryout?website_sub_category_id=${websiteSubCategory?.id}`}
          body={{ participantId, userId: session?.user.id, number }}
          messages={{
            prevChatMessages,
            isLoadingPrevMessage,
          }}
          fetchMessages={fetchMessages}
        />
      </SheetContent>
    </Sheet>
  );
};
