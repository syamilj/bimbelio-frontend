import { useSession } from "@/components/provider/session-provider-auth";
import Chat from "@/components/workspace/chat";
import { env } from "@/env.mjs";
import { getGeneral } from "@/lib/fetch-helper";
import { useEffect, useState } from "react";

type PrevChatMessagesType = {
  id: any;
  content: any;
  role: string;
  createdAt: any;
  like: any;
  dislike: any;
};

export default function ChatContent({ historyId }: { historyId: string }) {
  const { data: session } = useSession();

  // const {
  //   data: prevChatMessages,
  //   isLoading: isLoadingPrevMessage,
  //   error: messageError,
  // } = api.chat.getAllMessageByHistoryId.useQuery(
  //   { historyId },
  //   { refetchOnWindowFocus: false }
  // );

  const [prevChatMessages, setPrevChatMessages] = useState<
    PrevChatMessagesType[]
  >([]);
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
    return <div>{messageError}</div>;
  }
  return (
    <div className="flex h-auto w-full max-w-[800px] mx-auto flex-col gap-2 overflow-hidden md:relative md:left-auto md:top-auto">
      <Chat
        apiChat={`${env.NEXT_PUBLIC_API_URL}/ai/chatTutor`}
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
