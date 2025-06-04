/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/workspace-course/chat/index.tsx

import { useSession } from '@/components/provider/provider-session-auth';
import Chat from '@/components/workspace/chat';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import 'katex/dist/katex.min.css';
import { useParams } from 'next/navigation';

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

  const {
    data: prevChatMessages,
    isLoading: isLoadingPrevMessage,
    refetch,
    error: messageError,
  } = useGet('/message/getAllByCourseCategoryIdAndUserId', {
    params: { courseCategoryId: categoryId },
    useEffectDependencies: [categoryId],
  });

  if (messageError) {
    return <div>{messageError.message}</div>;
  }
  return (
    <Chat
      apiChat={`${env.NEXT_PUBLIC_API_URL}/ai/chatWorkspace?website_sub_category_id=${website_sub_category_id}`}
      body={{
        docId: docId as string,
        courseCategoryId: categoryId as string,
      }}
      messages={{
        prevChatMessages,
        isLoadingPrevMessage,
      }}
      onClickPageNumber={onClose}
      fetchMessages={refetch}
    />
  );
}
