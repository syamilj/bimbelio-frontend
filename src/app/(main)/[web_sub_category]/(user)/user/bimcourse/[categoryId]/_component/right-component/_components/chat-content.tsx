// src/components/workspace-course/chat/index.tsx

import { useSession } from '@/components/provider/provider-session-auth';
import Chat from '@/components/workspace/chat';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Document, User, UserDocument } from '@/types/database';
import 'katex/dist/katex.min.css';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatContent({
  docId,
  onClose,
}: {
  docId: string;
  onClose?: () => void;
}) {
  const { data: session } = useSession();
  const params = useParams();
  const categoryId = Array.isArray(params?.categoryId)
    ? params.categoryId[0]
    : params?.categoryId || null;
  const userId = session?.user?.id;

  // const {
  //   data: prevChatMessages,
  //   isLoading: isLoadingPrevMessage,
  //   error: messageError,
  // } = api.message.getAllByCourseCategoryIdAndUserId.useQuery(
  //   { courseCategoryId: categoryId },
  //   { refetchOnWindowFocus: false },
  // );

  const [messageError, setMessageError] = useState<string | null>(null);

  const {
    data: prevChatMessages,
    isLoading: isLoadingPrevMessage,
    refetch,
    error,
  } = useGet('/message/getAllByCourseCategoryIdAndUserId', {
    params: { courseCategoryId: categoryId },
    useEffectDependencies: [categoryId],
  });

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
    fetchUserDocData();
  }, [session]);

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

  console.log({ userDocData });

  const errorMessage = error?.message || messageError;

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }
  return (
    <Chat
      apiChat={`${env.NEXT_PUBLIC_API_URL}/ai/chatCourse?website_sub_category_id=${website_sub_category_id}`}
      body={{
        docId: docId as string,
        courseCategoryId: categoryId as string,
        userId,
      }}
      messages={{
        prevChatMessages,
        isLoadingPrevMessage,
      }}
      onClickPageNumber={onClose}
      vectorize={{
        isVectorising,
        vectoriseDocMutation,
      }}
      userDoc={{
        isUserDocLoading,
        userDocData,
      }}
      fetchMessages={refetch}
    />
  );
}
