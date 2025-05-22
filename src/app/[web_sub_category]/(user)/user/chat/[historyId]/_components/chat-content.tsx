import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import Chat from '@/components/workspace/chat';
import { MessageDataType } from '@/components/workspace/chat/provider';
import { env } from '@/env.mjs';
import { getGeneral } from '@/lib/fetch-helper';
import { useEffect, useState } from 'react';

export default function ChatContent({ historyId }: { historyId: string }) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // const {
  //   data: prevChatMessages,
  //   isLoading: isLoadingPrevMessage,
  //   error: messageError,
  // } = api.chat.getAllMessageByHistoryId.useQuery(
  //   { historyId },
  //   { refetchOnWindowFocus: false }
  // );

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
      onSuccess({ message, status, data }) {
        console.log({ data });
      },
      onError({ message }) {
        setMessageError(message);
      },
    });
  };

  useEffect(() => {
    getMessages();
  }, [historyId]);

  if (messageError) {
    return <div>{messageError}</div>;
  }
  return (
    <div className="flex h-auto w-full max-w-[800px] mx-auto flex-col gap-2 overflow-hidden md:relative md:left-auto md:top-auto">
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
