import { useSession } from '@/components/provider/provider-session-auth';
import Chat from '@/components/workspace/chat';
import { MessageDataType } from '@/components/workspace/chat/provider';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper';
import { Document, User, UserDocument } from '@/types/database';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatContent() {
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];

  // const trpc = api.useUtils();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // const { data: prevChatMessages, isLoading: isLoadingPrevMessage } =
  //   api.message.getAllByDocIdAndUserId.useQuery(
  //     {
  //       documentId: docId as string,
  //     },
  //     { refetchOnWindowFocus: false },
  //   );

  const [prevChatMessages, setPrevChatMessages] = useState<MessageDataType[]>(
    [],
  );
  const [isLoadingPrevMessage, setIsLoadingPrevMessage] =
    useState<boolean>(true);
  const [messageError, setMessageError] = useState<string | null>(null);

  const getMessages = async () => {
    await getGeneral(`/message/getAllByDocIdAndUserId`, {
      params: {
        docId,
        userId: session?.user.id,
      },
      setData: setPrevChatMessages,
      setLoading: setIsLoadingPrevMessage,

      onError({ message }) {
        setMessageError(message);
      },
    });
  };

  const [userDocData, setUserDocData] = useState<
    UserDocument & {
      document: Document;
      user: User;
    }
  >();
  const [isUserDocLoading, setIsUserDocLoading] = useState<boolean>(true);

  const fetchUserDocData = async () => {
    await getGeneral(`/document/getUserDocData`, {
      params: {
        documentId: docId,
        userId: session?.user.id,
      },
      setData: setUserDocData,
      setLoading: setIsUserDocLoading,
      onError({ message }) {
        setMessageError(message);
      },
    });
  };

  useEffect(() => {
    getMessages();
    fetchUserDocData();
  }, []);

  const [isVectorising, setIsVectorising] = useState<boolean>(false);

  const vectoriseDocMutation = async () => {
    await mutateGeneral('/document/vectorise', {
      payload: {
        documentId: docId,
        userId: session?.user.id,
      },
      type: 'post',
      setLoading: setIsVectorising,
      onSuccess: async () => {
        //       await trpc.document.getHistoryByUser.refetch();
        //       await trpc.document.getDocumentTotalPage.refetch();
        fetchUserDocData();
      },
    });
  };

  if (messageError) {
    return <div>{messageError}</div>;
  }

  return (
    <Chat
      // apiChat="/api/chat"
      apiChat={`${env.NEXT_PUBLIC_API_URL}/ai/chatWorkspace?website_sub_category_id=${website_sub_category_id}`}
      body={{ docId, userId }}
      messages={{
        prevChatMessages,
        isLoadingPrevMessage,
      }}
      vectorize={{
        isVectorising,
        vectoriseDocMutation,
      }}
      userDoc={{
        isUserDocLoading,
        userDocData,
      }}
      fetchMessages={getMessages}
    />
  );
}
