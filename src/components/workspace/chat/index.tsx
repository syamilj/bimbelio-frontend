// index.tsx
import { Document, User, UserDocument } from '@/types/database';
import { Loader2 } from 'lucide-react';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Spinner } from '@/components/ui/spinner';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import MessageList from './_component/message-container';
import Start from './_component/start';
import SubmitChat from './_component/submit-chat';
import ThreeQuestions from './_component/three-questions';
import Provider, { type MessageDataType, useProvider } from './provider';

interface Props {
  apiChat: string;
  body: object;
  fetchMessages: () => Promise<any>;
  onChatFinish?: () => void;
  messages: {
    prevChatMessages: MessageDataType[] | undefined;
    isLoadingPrevMessage: boolean;
  };
  vectorize?: {
    isVectorising: boolean;
    vectoriseDocMutation: ({ documentId }: { documentId: string }) => void;
  };
  userDoc?: {
    userDocData:
      | (UserDocument & {
          user: User;
          document: Document;
        })
      | null
      | undefined;
    isUserDocLoading: boolean;
  };
  onClickPageNumber?: () => void;
}

export default function Chat({
  body,
  apiChat,
  fetchMessages,
  onChatFinish,
  messages: { isLoadingPrevMessage, prevChatMessages },
  vectorize,
  userDoc,
  onClickPageNumber,
}: Props) {
  return (
    <Provider
      apiChat={apiChat}
      body={body}
      fetchMessages={fetchMessages}
      onChatFinish={onChatFinish}
      prevChatMessages={prevChatMessages}
      isLoadingPrevMessage={isLoadingPrevMessage}
      onClickPageNumber={onClickPageNumber}
      vectorize={vectorize}
      userDoc={userDoc}
    >
      <MainContent />
    </Provider>
  );
}

const MainContent = () => {
  const searchParams = useSearchParams();
  const newChat = searchParams.get('new');

  const {
    messageData,
    prevChatMessages,
    isLoadingPrevMessage,
    vectorize,
    userDoc,
  } = useProvider();

  const isVectorising = vectorize?.isVectorising;
  const vectoriseDocMutation = vectorize?.vectoriseDocMutation;
  const userDocData = userDoc?.userDocData;
  const isUserDocLoading = userDoc?.isUserDocLoading || false;
  const isVectorised = userDocData?.isVectorised || false;

  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];

  if (isLoadingPrevMessage && messageData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-0">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  const isMessages = messageData?.length !== 0;
  const isNoMessages =
    messageData?.length === 0 && prevChatMessages?.length === 0 && !newChat;

  if (isUserDocLoading === true) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-0">
        <Spinner />
      </div>
    );
  }

  if (!isVectorised && userDoc) {
    return (
      <Start
        isLoading={isVectorising || false}
        onClick={() => {
          if (!vectoriseDocMutation) return;
          vectoriseDocMutation({ documentId: docId as string });
        }}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      <FormMessageEdit />
      <Conversation>
        <ConversationContent className="chat-ai-messages flex flex-col gap-3 pt-3 px-3 sm:px-4 pb-8">
          {isMessages ? (
            <MessageList />
          ) : isNoMessages ? (
            <ThreeQuestions />
          ) : (
            <LoadingMessages />
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <SubmitChat />
    </div>
  );
};

const LoadingMessages = () => {
  return (
    <div className="flex flex-1 justify-center items-center min-h-[200px]">
      <Loader2 className="animate-spin w-4 h-4" />
    </div>
  );
};

const FormMessageEdit = () => {
  const {
    useMessagesEdit: {
      inputMessagesEdit,
      appendMessagesEdit,
    },
  } = useProvider();

  useEffect(() => {
    if (inputMessagesEdit.length > 0) {
      appendMessagesEdit({
        id: crypto.randomUUID(),
        content: inputMessagesEdit,
        role: 'user',
        createdAt: new Date(),
      });
    }
  }, [inputMessagesEdit]);

  return null;
};
