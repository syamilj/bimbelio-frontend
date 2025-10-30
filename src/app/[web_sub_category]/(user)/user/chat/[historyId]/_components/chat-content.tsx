import { useChatContext } from '@/app/[web_sub_category]/(user)/user/chat/[historyId]/provider';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import Chat from '@/components/workspace/chat';
import { MessageDataType } from '@/components/workspace/chat/provider';
import { env } from '@/env.mjs';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { History } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ChatContent({ historyId }: { historyId: string }) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { isMinimized, setIsMinimized } = useChatContext();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [prevChatMessages, setPrevChatMessages] = useState<MessageDataType[]>(
    [],
  );
  const [isLoadingPrevMessage, setIsLoadingPrevMessage] =
    useState<boolean>(true);
  const [messageError, setMessageError] = useState<string | null>(null);

  const getMessages = async () => {
    await getGeneral(`/chat/getAllMessageByHistoryId?historyId=${historyId}`, {
      setData: setPrevChatMessages,
      setLoading: setIsLoadingPrevMessage,
      onError({ message }) {
        setMessageError(message);
      },
    });
  };

  useEffect(() => {
    getMessages();
  }, [historyId]);

  if (messageError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading messages</p>
          <p className="text-sm text-muted-foreground">{messageError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
      {/* Mobile History Toggle Button - Top Right */}
      {isMinimized && (
        <Button
          onClick={() => setIsMinimized(false)}
          className="fixed top-20 right-4 z-9999 md:hidden w-12 h-12 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-0"
          style={{ backgroundColor: mainColor }}
        >
          <History className="w-5 h-5 text-white" />
        </Button>
      )}

      <Chat
        apiChat={`${env.NEXT_PUBLIC_API_URL}/ai/chatTutor?website_sub_category_id=${websiteSubCategory?.id}`}
        body={{ historyId, userId: session?.user.id }}
        messages={{
          prevChatMessages,
          isLoadingPrevMessage,
        }}
        fetchMessages={getMessages}
      />
    </div>
  );
}
