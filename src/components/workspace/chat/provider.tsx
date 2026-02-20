import { useAppContext } from '@/components/provider/provider-app';
import { toaster } from '@/components/ui/toaster';
import type { Document } from '@/types/database';
import { User, UserDocument } from '@/types/database';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const GREETING_MESSAGE: MessageDataType = {
  id: 'id',
  content:
    'Selamat datang di **Bimbelio**! Aku siap membantu Kamu. Jangan ragu untuk bertanya atau berdiskusi tentang PTN dan Kedinasan. Mari kita maksimalkan pembelajaran Kamu!',
  role: 'assistant',
  createdAt: null,
  like: false,
  dislike: false,
};

type Props = {
  children: React.ReactNode;
  apiChat: string;
  body: object;
  fetchMessages: () => Promise<any>;
  onChatFinish?: () => void;
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
  onChatFinish,
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

  // Ref to guard the unified effect during manual transitions (onFinish)
  const manualTransitionRef = useRef(false);

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

  // Manual input state management (useChat v5+ no longer manages input)
  const [inputMessages, setInputMessages] = useState('');
  const [inputMessagesEdit, setInputMessagesEdit] = useState('');

  // Use refs for callbacks to avoid stale closures in useChat's onFinish
  const fetchMessagesRef = useRef(fetchMessages);
  fetchMessagesRef.current = fetchMessages;
  const onChatFinishRef = useRef(onChatFinish);
  onChatFinishRef.current = onChatFinish;

  // Body ref: transport reads the latest body on every request,
  // preventing stale historyId when switching chats.
  const bodyRef = useRef(body);
  bodyRef.current = body;

  // Memoize transport — recreate when API or body changes.
  // Body is also passed as a getter for sub-render-cycle freshness.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: apiChat,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        body: () => bodyRef.current,
      }),
    [apiChat, body],
  );

  const transportEdit = useMemo(
    () =>
      new DefaultChatTransport({
        api: apiChat,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        body: () => bodyRef.current,
      }),
    [apiChat, body],
  );

  const {
    messages,
    status: statusMessages,
    sendMessage: sendMessageChat,
    setMessages,
    stop: stopChat,
  } = useChat({
    transport,
    experimental_throttle: 50,
    onError: (error: Error) => {
      toaster({
        title: 'Gagal',
        description: 'Terjadi kesalahan!',
        condition: 'warning',
        duration: 3000,
      });
    },
    onFinish: () => {
      setFirstMessage(false);
      // Wait for backend to save, then atomically swap messages.
      // Guard BEFORE fetching so intermediate renders (from setPrevChatMessages
      // inside fetchMessages) don't cause scroll jumps via StickToBottom.
      const tryClearStreaming = (attempt: number) => {
        manualTransitionRef.current = true;
        fetchMessagesRef
          .current()
          .then((res) => {
            const savedMessages = Array.isArray(res?.data) ? res.data : [];
            if (savedMessages.length > 0) {
              // Atomically set final data and clear streaming in one batch
              setMessageData([GREETING_MESSAGE, ...savedMessages]);
              setMessages([]);
              // Unguard after React processes the batched state updates
              requestAnimationFrame(() => {
                manualTransitionRef.current = false;
              });
              return;
            }
            // No saved messages yet — unguard and retry
            manualTransitionRef.current = false;
            if (attempt < 2) {
              setTimeout(() => tryClearStreaming(attempt + 1), 1500);
            }
          })
          .catch(() => {
            manualTransitionRef.current = false;
          });
      };
      setTimeout(() => tryClearStreaming(0), 2000);
      // Refresh chat history after delay for AI-generated title
      setTimeout(() => {
        onChatFinishRef.current?.();
      }, 5000);
    },
  });

  const isLoadingMessages =
    statusMessages === 'streaming' || statusMessages === 'submitted';
  const isStreamingMessages =
    statusMessages === 'streaming' || statusMessages === 'submitted';

  const handleInputChangeMessages = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputMessages(e.target.value);
  };

  const handleSubmitMessages = () => {
    if (inputMessages.trim()) {
      sendMessageChat({ text: inputMessages });
      setInputMessages('');
    }
  };

  const appendMessages = async (message: {
    content: string;
    role: string;
    id?: string;
    createdAt?: Date;
  }): Promise<string | null | undefined> => {
    // Fire-and-forget: don't await so the caller can clear input immediately
    sendMessageChat({ text: message.content });
    return null;
  };

  const {
    messages: messageEdit,
    status: statusMessagesEdit,
    sendMessage: sendMessageEditChat,
    setMessages: setMessagesEdit,
    stop: stopChatEdit,
  } = useChat({
    transport: transportEdit,
    experimental_throttle: 50,
    onError: (error: Error) => {
      toaster({
        title: 'Gagal',
        description: error?.message ?? 'Terjadi kesalahan!',
        condition: 'warning',
        duration: 3000,
      });
    },
    onFinish: () => {
      setTimeout(() => {
        manualTransitionRef.current = true;
        fetchMessagesRef
          .current()
          .then((res) => {
            const savedMessages = Array.isArray(res?.data) ? res.data : [];
            if (savedMessages.length > 0) {
              setMessageData([GREETING_MESSAGE, ...savedMessages]);
              setMessagesEdit([]);
              requestAnimationFrame(() => {
                manualTransitionRef.current = false;
              });
              return;
            }
            manualTransitionRef.current = false;
            setTimeout(() => {
              manualTransitionRef.current = true;
              fetchMessagesRef
                .current()
                .then((retryRes) => {
                  const retrySaved = Array.isArray(retryRes?.data)
                    ? retryRes.data
                    : [];
                  if (retrySaved.length > 0) {
                    setMessageData([GREETING_MESSAGE, ...retrySaved]);
                    setMessagesEdit([]);
                    requestAnimationFrame(() => {
                      manualTransitionRef.current = false;
                    });
                  } else {
                    manualTransitionRef.current = false;
                  }
                })
                .catch(() => {
                  manualTransitionRef.current = false;
                });
            }, 1200);
          })
          .catch(() => {
            manualTransitionRef.current = false;
          });
      }, 2000);
    },
  });

  const isLoadingMessagesEdit =
    statusMessagesEdit === 'streaming' || statusMessagesEdit === 'submitted';

  const handleInputChangeMessagesEdit = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputMessagesEdit(e.target.value);
  };

  const handleSubmitMessagesEdit = () => {
    if (inputMessagesEdit.trim()) {
      sendMessageEditChat({ text: inputMessagesEdit });
      setInputMessagesEdit('');
    }
  };

  const appendMessagesEdit = async (message: {
    content: string;
    role: string;
    id?: string;
    createdAt?: Date;
  }): Promise<string | null | undefined> => {
    sendMessageEditChat({ text: message.content });
    return null;
  };

  // Helper function untuk convert UIMessage ke MessageDataType
  const convertToMessageDataType = (
    messages: UIMessage[],
  ): MessageDataType[] => {
    return messages.map((msg) => ({
      id: msg.id,
      createdAt: null,
      content:
        msg.parts
          ?.filter(
            (p): p is { type: 'text'; text: string } => p.type === 'text',
          )
          .map((p) => p.text)
          .join('') || '',
      role: msg.role as MessageDataType['role'],
      like: false,
      dislike: false,
    }));
  };

  // Memoized converted messages for display
  const convertedMessages = useMemo(() => {
    const converted = convertToMessageDataType(messages);
    if (
      statusMessages === 'submitted' &&
      converted.length > 0 &&
      converted[converted.length - 1].role === 'user'
    ) {
      converted.push({
        id: 'thinking-placeholder',
        createdAt: null,
        content: '',
        role: 'assistant' as const,
        like: false,
        dislike: false,
      });
    }
    return converted;
  }, [messages, statusMessages]);

  const convertedEditMessages = useMemo(() => {
    const converted = convertToMessageDataType(messageEdit);
    if (
      statusMessagesEdit === 'submitted' &&
      converted.length > 0 &&
      converted[converted.length - 1].role === 'user'
    ) {
      converted.push({
        id: 'thinking-placeholder-edit',
        createdAt: null,
        content: '',
        role: 'assistant' as const,
        like: false,
        dislike: false,
      });
    }
    return converted;
  }, [messageEdit, statusMessagesEdit]);

  // ─── UNIFIED MESSAGE DISPLAY EFFECT ───
  // Single source of truth for messageData. Priority: edit > stream > saved > empty.
  // Lives in provider so onFinish can guard it via manualTransitionRef.
  useEffect(() => {
    // Skip if onFinish is performing an atomic transition.
    // The ref is managed by onFinish: set to true before fetch starts,
    // and cleared after .then() completes or on error.
    if (manualTransitionRef.current) {
      return;
    }

    if (convertedEditMessages.length > 0) {
      const base = prevChatMessages || [];
      setMessageData([GREETING_MESSAGE, ...base, ...convertedEditMessages]);
      return;
    }

    if (convertedMessages.length > 0) {
      const base = prevChatMessages || [];
      setMessageData([GREETING_MESSAGE, ...base, ...convertedMessages]);
      return;
    }

    if (prevChatMessages && prevChatMessages.length > 0) {
      setMessageData([GREETING_MESSAGE, ...prevChatMessages]);
      return;
    }

    if (prevChatMessages !== undefined) {
      setMessageData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevChatMessages, convertedMessages, convertedEditMessages]);

  const useMessages = {
    messages: convertedMessages,
    inputMessages,
    handleInputChangeMessages,
    handleSubmitMessages,
    isLoadingMessages,
    appendMessages,
    stopChat,
  };

  const useMessagesEdit = {
    messageEdit: convertedEditMessages,
    inputMessagesEdit,
    handleInputChangeMessagesEdit,
    handleSubmitMessagesEdit,
    isLoadingMessagesEdit,
    appendMessagesEdit,
    stopChatEdit,
  };

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
    handleSubmitMessages: () => void;
    isLoadingMessages: boolean;
    appendMessages: (message: {
      content: string;
      role: string;
      id?: string;
      createdAt?: Date;
    }) => Promise<string | null | undefined>;
    stopChat: () => void;
  };
  useMessagesEdit: {
    messageEdit: MessageDataType[];
    inputMessagesEdit: string;
    handleInputChangeMessagesEdit: (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
    handleSubmitMessagesEdit: () => void;
    isLoadingMessagesEdit: boolean;
    appendMessagesEdit: (message: {
      content: string;
      role: string;
      id?: string;
      createdAt?: Date;
    }) => Promise<string | null | undefined>;
    stopChatEdit: () => void;
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
