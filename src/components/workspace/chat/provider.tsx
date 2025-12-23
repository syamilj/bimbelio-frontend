import { useAppContext } from '@/components/provider/provider-app';
import { toaster } from '@/components/ui/toaster';
import type { Document } from '@/types/database';
import { User, UserDocument } from '@/types/database';
import type {
  ChatRequestOptions,
  CreateMessage,
  Message,
} from '@ai-sdk/ui-utils';
import { useChat } from 'ai/react';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

type Props = {
  children: React.ReactNode;
  apiChat: string;
  body: object;
  fetchMessages: () => Promise<any>;
  prevChatMessages: MessageDataType[] | undefined;
  isLoadingPrevMessage: boolean;
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
};

export default function Provider({
  children,
  apiChat,
  body,
  fetchMessages,
  isLoadingPrevMessage,
  prevChatMessages,
  userDoc,
  vectorize,
  onClickPageNumber,
}: Props) {
  const pathname = usePathname();
  const { vision } = useAppContext();

  const [editMessage, setEditMessage] = useState({
    bool: false,
    index: 99999,
    value: '111',
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [messageData, setMessageData] = useState<MessageDataType[]>([]);
  const [firstMessage, setFirstMessage] = useState<boolean>(false);

  const scrollToPdfPage = (pageNum: number) => {
    const containerId = vision ? 'VisionOn' : 'VisionOff';
    const selector = `#${containerId} #pdf-page-${pageNum}`;

    // Check if we're in a document viewer context
    const isInDocViewer = document.querySelector('#DocViewer');

    if (!isInDocViewer) {
      return;
    }

    const pageElement = document.querySelector(selector);
    const container = document.querySelector(`#${containerId} .PdfHighlighter`);

    if (pageElement && container) {
      const containerRect = container.getBoundingClientRect();
      const pageRect = pageElement.getBoundingClientRect();
      const scrollTop =
        container.scrollTop + (pageRect.top - containerRect.top) - 50;

      container.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth',
      });

      setCurrentPage(pageNum);
    }
  };

  const {
    messages,
    input: inputMessages,
    handleInputChange: handleInputChangeMessages,
    handleSubmit: handleSubmitMessages,
    isLoading: isLoadingMessages,
    append: appendMessages,
  } = useChat({
    api: apiChat,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
    body,
    streamProtocol: 'text',
    onError: (error: any) => {
      toaster({
        title: 'Gagal',
        description: 'Terjadi kesalahan!',
        condition: 'warning',
        duration: 3000,
      });
    },
    onFinish: () => {
      setFirstMessage(false);
      // Reduced delay to prevent multiple scrolls
      setTimeout(() => {
        fetchMessages();
      }, 100);
    },
  });

  const {
    messages: messageEdit,
    input: inputMessagesEdit,
    handleInputChange: handleInputChangeMessagesEdit,
    handleSubmit: handleSubmitMessagesEdit,
    isLoading: isLoadingMessagesEdit,
    append: appendMessagesEdit,
  } = useChat({
    api: apiChat,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
    body,
    streamProtocol: 'text',
    onError: (error: Error) => {
      toaster({
        title: 'Gagal',
        description: error?.message ?? 'Terjadi kesalahan!',
        condition: 'warning',
        duration: 3000,
      });
    },
    onFinish: () => {
      // Reduced delay to prevent multiple scrolls
      setTimeout(() => {
        fetchMessages();
      }, 100);
    },
  });

  // Helper function untuk convert UIMessage ke MessageDataType
  const convertToMessageDataType = (messages: Message[]): MessageDataType[] => {
    return messages.map((msg) => ({
      id: msg.id,
      createdAt: msg.createdAt,
      content: msg.content,
      role: msg.role,
      like: false, // Default value
      dislike: false, // Default value
    }));
  };

  const useMessages = {
    messages: convertToMessageDataType(messages),
    inputMessages,
    handleInputChangeMessages,
    handleSubmitMessages,
    isLoadingMessages,
    appendMessages,
  };

  const useMessagesEdit = {
    messageEdit: convertToMessageDataType(messageEdit),
    inputMessagesEdit,
    handleInputChangeMessagesEdit,
    handleSubmitMessagesEdit,
    isLoadingMessagesEdit,
    appendMessagesEdit,
  };

  useEffect(() => {
    if (prevChatMessages?.length === 0) {
      setMessageData([]);
    }
  }, [prevChatMessages]);

  console.log({ prevChatMessages, messageData });

  const Context = {
    messageData,
    setMessageData,
    scrollToPdfPage,
    useMessages,
    useMessagesEdit,
    firstMessage,
    setFirstMessage,
    currentPage,
    setCurrentPage,
    isLoadingPrevMessage,
    prevChatMessages,
    userDoc,
    vectorize,
    onClickPageNumber,
    editMessage,
    setEditMessage,
  };

  return (
    <ProviderContext.Provider value={Context}>
      {children}
    </ProviderContext.Provider>
  );
}

const ProviderContext = createContext<undefined | ProviderType>(undefined);

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within an ProviderContext');
  }
  return context;
};

type ProviderType = {
  messageData: MessageDataType[];
  setMessageData: Dispatch<SetStateAction<MessageDataType[]>>;
  scrollToPdfPage: (pageNum: number) => void;
  useMessages: {
    messages: MessageDataType[];
    inputMessages: string;
    handleInputChangeMessages: (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
    handleSubmitMessages: (
      event?: {
        preventDefault?: () => void;
      },
      chatRequestOptions?: ChatRequestOptions,
    ) => void;
    isLoadingMessages: boolean;
    appendMessages: (
      message: Message | CreateMessage,
      chatRequestOptions?: ChatRequestOptions,
    ) => Promise<string | null | undefined>;
  };
  useMessagesEdit: {
    messageEdit: MessageDataType[];
    inputMessagesEdit: string;
    handleInputChangeMessagesEdit: (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
    handleSubmitMessagesEdit: (
      event?: {
        preventDefault?: () => void;
      },
      chatRequestOptions?: ChatRequestOptions,
    ) => void;
    isLoadingMessagesEdit: boolean;
    appendMessagesEdit: (
      message: Message | CreateMessage,
      chatRequestOptions?: ChatRequestOptions,
    ) => Promise<string | null | undefined>;
  };
  firstMessage: boolean;
  setFirstMessage: Dispatch<SetStateAction<boolean>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  isLoadingPrevMessage: boolean;
  prevChatMessages: MessageDataType[] | undefined;
  userDoc:
    | {
        userDocData:
          | (UserDocument & {
              user: User;
              document: Document;
            })
          | null
          | undefined;
        isUserDocLoading: boolean;
      }
    | undefined;
  vectorize:
    | {
        isVectorising: boolean;
        vectoriseDocMutation: ({ documentId }: { documentId: string }) => void;
      }
    | undefined;
  onClickPageNumber: (() => void) | undefined;
  editMessage: {
    bool: boolean;
    index: number;
    value: string;
  };
  setEditMessage: Dispatch<
    SetStateAction<{
      bool: boolean;
      index: number;
      value: string;
    }>
  >;
};

export type MessageDataType = {
  id: string;
  createdAt?: string | null | Date;
  content: string;
  role: 'system' | 'user' | 'assistant' | 'data';
  like: boolean;
  dislike: boolean;
};
