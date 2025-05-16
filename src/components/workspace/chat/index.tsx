/* eslint-disable @typescript-eslint/no-unused-vars */
// index.tsx
import { SpinnerCentered } from '@/components/ui/spinner';
// import { useChatStore } from "@/lib/store";
import { Document, User, UserDocument } from '@/types/database';
import 'katex/dist/katex.min.css';
import { Loader2 } from 'lucide-react';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import MessageContainer from './_component/message-container';
import Start from './_component/start';
import SubmitChat from './_component/submit-chat';
import ThreeQuestions from './_component/three-questions';
import Provider, { MessageDataType, useProvider } from './provider';

interface Props {
  apiChat: string;
  body: object;
  fetchMessages: () => Promise<any>;
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
  const {
    messageData,
    setMessageData,
    useMessages: { messages, isLoadingMessages },
    useMessagesEdit: { messageEdit, isLoadingMessagesEdit },
    firstMessage,
    prevChatMessages,
    isLoadingPrevMessage,
    vectorize,
    userDoc,
  } = useProvider();

  const isVectorising = vectorize?.isVectorising;
  const vectoriseDocMutation = vectorize?.vectoriseDocMutation;

  const userDocData = userDoc?.userDocData;
  const isUserDocLoading = userDoc?.isUserDocLoading;

  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];

  useEffect(() => {
    if (prevChatMessages && prevChatMessages?.length > 0 && !firstMessage) {
      setMessageData([GreetingMessage, ...prevChatMessages]);
    }
  }, [prevChatMessages]);

  useEffect(() => {
    if (isLoadingMessages) {
      if (prevChatMessages) {
        const data = [GreetingMessage, ...prevChatMessages, ...messages];
        setMessageData(() => [...data]);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isLoadingMessagesEdit) {
      if (prevChatMessages) {
        const data = [GreetingMessage, ...prevChatMessages, ...messages];
        setMessageData(() => [...data]);
      }
    }
  }, [messageEdit]);

  if (isUserDocLoading) {
    return <SpinnerCentered />;
  }

  const isVectorised = userDocData?.isVectorised || false;

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

  if (isLoadingPrevMessage) {
    <div className="flex justify-center items-center h-full w-full">
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>;
  }

  return (
    <div className="absolute left-0 top-0 flex h-full w-full flex-col gap-2 overflow-hidden md:relative md:left-[unset] md:top-[unset]">
      <FormMessageEdit />
      <div
        id="chatAI"
        className="mt-[calc(60px+5px)] flex flex-1 flex-col gap-[3rem] overflow-hidden px-[1rem] pb-[1rem] md:mt-[unset]"
      >
        {messageData?.length !== 0 ? (
          <MessageContainer />
        ) : messageData?.length === 0 && prevChatMessages?.length === 0 ? (
          <ThreeQuestions />
        ) : null}
      </div>
      <SubmitChat />
    </div>
  );
};

const FormMessageEdit = () => {
  const {
    useMessagesEdit: { inputMessagesEdit, handleSubmitMessagesEdit },
  } = useProvider();

  useEffect(() => {
    if (inputMessagesEdit.length > 0) {
      const submit = document.getElementById(
        'editMessage',
      ) as HTMLButtonElement;
      submit.click();
    }
  }, [inputMessagesEdit]);

  return (
    <form
      className="absolute z-[100] w-0 overflow-hidden p-0 text-black"
      onSubmit={(e) => {
        handleSubmitMessagesEdit(e);
      }}
    >
      <input
        type="text"
        value={inputMessagesEdit}
        onChange={() => {}}
      />
      <button id="editMessage">submit</button>
    </form>
  );
};

const GreetingMessage: MessageDataType = {
  id: 'id',
  content:
    'Selamat datang di **Bimbelio**! Saya siap membantu Kamu. Jangan ragu untuk bertanya atau berdiskusi tentang PTN dan Kedinasan. Mari kita maksimalkan pembelajaran Kamu!',
  role: 'assistant',
  createdAt: null,
  like: false,
  dislike: false,
};
