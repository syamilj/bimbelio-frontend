'use client';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollWrapper } from '@/components/ui/scroll-wrapper';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import Chat from '@/components/workspace/chat';
import { MessageDataType } from '@/components/workspace/chat/provider';
import { env } from '@/env.mjs';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { ChatHistory } from '@/types/database';
import { motion } from 'framer-motion';
import { BotMessageSquare, Loader2, Plus, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const blacklistPaths = [
  '/user/bimarena/try-out',
  '/user/bimcourse',
  '/user/workspace',
  '/user/bimbot',
];

export const DialogBimbotAI = () => {
  const pathname = usePathname();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#4C94FF';
  const [isOpen, setIsOpen] = useState(false);

  const isBlocked = blacklistPaths.some((path) => {
    if (pathname.toLowerCase().includes(path)) {
      return true;
    }

    return false;
  });

  if (isBlocked) return null;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <motion.div
          className="fixed right-4 bottom-20 z-30 cursor-pointer rounded-full p-2 shadow-overlay lg:right-6 lg:bottom-6"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
          onClick={() => setIsOpen(true)}
          whileTap={{ scale: 1.2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Icon */}
          <BotMessageSquare
            className="h-8 w-8 scale-x-[-1] transform text-white"
            strokeWidth={2.1}
          />

          {/* Badge AI */}
          <span className="absolute -top-1 left-[-4px] rounded-full bg-red-500 px-[0.35rem] py-1 text-xs font-bold text-white shadow-md">
            AI
          </span>
        </motion.div>
      </DialogTrigger>
      <DialogContent
        hideClose
        className="fixed flex h-[85vh] max-h-[85vh] w-[95vw] flex-col gap-0 overflow-hidden rounded-3xl p-0 md:top-[unset] md:right-[1rem] md:bottom-[1rem] md:left-[unset] md:max-w-2xl md:translate-x-0 md:translate-y-0"
      >
        <VisuallyHidden>
          <DialogTitle>BimBot AI Chat</DialogTitle>
        </VisuallyHidden>
        <ChatContent onRequestClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

function ChatContent({ onRequestClose }: { onRequestClose: () => void }) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const [historyId, setHistoryId] = useState<undefined | string>();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isHistoryInitialized, setIsHistoryInitialized] = useState(false);

  const [prevChatMessages, setPrevChatMessages] = useState<MessageDataType[]>(
    [],
  );
  const [isLoadingPrevMessage, setIsLoadingPrevMessage] =
    useState<boolean>(true);
  const [messageError, setMessageError] = useState<string | null>(null);

  const userId = session?.user.id;
  const websiteSubCategoryId = websiteSubCategory?.id;

  // Stable callback: refresh chat history list (for title updates etc.)
  const refreshHistory = useCallback(() => {
    if (!userId || !websiteSubCategoryId) return;
    getGeneral(
      `/chat/getAllHistoryByUserId?userId=${userId}&website_sub_category_id=${websiteSubCategoryId}`,
      {
        setData: (data: ChatHistory[]) => {
          setChatHistory(data);
        },
      },
    );
  }, [userId, websiteSubCategoryId]);

  // Initial fetch of chat history
  useEffect(() => {
    if (!userId || !websiteSubCategoryId) return;
    getGeneral(
      `/chat/getAllHistoryByUserId?userId=${userId}&website_sub_category_id=${websiteSubCategoryId}`,
      {
        setData: (data: ChatHistory[]) => {
          setChatHistory(data);
          setIsHistoryInitialized(true);
        },
      },
    );
  }, [userId, websiteSubCategoryId]);

  // Stable callback: fetch messages for current historyId
  const getMessages = useCallback(async () => {
    if (!historyId || !websiteSubCategoryId) return;
    const res = await getGeneral(
      `/chat/getAllMessageByHistoryId?historyId=${historyId}&website_sub_category_id=${websiteSubCategoryId}`,
      {
        setData: setPrevChatMessages,
        setLoading: setIsLoadingPrevMessage,
        onError({ message }) {
          setMessageError(message);
        },
      },
    );
    if (res?.data?.length === 0) {
      setPrevChatMessages([]);
    }
    return res;
  }, [historyId, websiteSubCategoryId]);

  // Clear previous messages immediately when switching chats
  useEffect(() => {
    setPrevChatMessages([]);
    setIsLoadingPrevMessage(true);
  }, [historyId]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  // Memoize body so it doesn't recreate on every render
  const body = useMemo(() => ({ historyId, userId }), [historyId, userId]);

  if (messageError) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-red-500">Error loading messages</p>
          <p className="text-sm text-muted-foreground">{messageError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HeaderChat
        setHistoryId={setHistoryId}
        historyId={historyId}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        isHistoryInitialized={isHistoryInitialized}
        onRequestClose={onRequestClose}
      />

      {historyId ? (
        <Chat
          key={historyId}
          apiChat={`${env.NEXT_PUBLIC_API_URL}/ai/chatTutor?website_sub_category_id=${websiteSubCategory?.id}`}
          body={body}
          messages={{
            prevChatMessages,
            isLoadingPrevMessage,
          }}
          fetchMessages={getMessages}
          onChatFinish={refreshHistory}
        />
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
}

const HeaderChat = ({
  historyId,
  setHistoryId,
  chatHistory,
  setChatHistory,
  isHistoryInitialized,
  onRequestClose,
}: {
  historyId: string | undefined;
  setHistoryId: Dispatch<React.SetStateAction<string | undefined>>;
  chatHistory: ChatHistory[];
  setChatHistory: Dispatch<React.SetStateAction<ChatHistory[]>>;
  isHistoryInitialized: boolean;
  onRequestClose: () => void;
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const hasAutoCreated = useRef(false);

  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const websiteSubCategoryId = websiteSubCategory?.id;

  // Select first chat when history loads and no chat is selected
  useEffect(() => {
    if (chatHistory.length > 0 && !historyId) {
      setHistoryId(chatHistory[0].id);
    }
  }, [chatHistory, historyId, setHistoryId]);

  // Auto-create first chat if user has no history (guarded by ref)
  useEffect(() => {
    if (
      isHistoryInitialized &&
      chatHistory.length === 0 &&
      !historyId &&
      !hasAutoCreated.current
    ) {
      hasAutoCreated.current = true;
      createNewChat();
    }
  }, [isHistoryInitialized, chatHistory.length, historyId]);

  const createNewChat = async () => {
    if (!websiteSubCategoryId) return;
    setLoading(true);
    await mutateGeneral(
      `/chat/createNewChat?website_sub_category_id=${websiteSubCategoryId}`,
      {
        payload: {
          title: 'Chat Baru',
          userId: session?.user.id,
        },
        type: 'post',
        toast: {
          errorMsg: 'Gagal membuat chat baru',
        },
        onError() {
          setLoading(false);
          hasAutoCreated.current = false; // allow retry on error
        },
        onSuccess({ data }) {
          if (data?.id) {
            setHistoryId(data.id);
            getGeneral(
              `/chat/getAllHistoryByUserId?userId=${session?.user.id}&website_sub_category_id=${websiteSubCategoryId}`,
              {
                setData: setChatHistory,
              },
            );
          }
          setLoading(false);
        },
      },
    );
  };

  const deleteChat = async (chatId: string) => {
    if (!websiteSubCategoryId) return;
    await mutateGeneral(
      `/chat/deleteChat?id=${chatId}&website_sub_category_id=${websiteSubCategoryId}`,
      {
        type: 'delete',
        toast: {
          errorMsg: 'Gagal menghapus chat',
        },
        onSuccess() {
          // Remove from local state immediately
          const updated = chatHistory.filter((h) => h.id !== chatId);
          setChatHistory(updated);
          // If the deleted chat was active, switch to the first remaining or clear
          if (historyId === chatId) {
            if (updated.length > 0) {
              setHistoryId(updated[0].id);
            } else {
              setHistoryId(undefined);
              hasAutoCreated.current = false; // allow auto-create if no chats left
            }
          }
        },
      },
    );
  };

  return (
    <div className="shrink-0 border-b border-gray-100 px-4 pt-4 pb-2">
      <div className="flex items-center gap-2">
        {/* New chat button */}
        <button
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-40"
          title="Chat baru"
          onClick={() => createNewChat()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>

        {/* Scrollable tabs */}
        <ScrollWrapper className="scrollbar-none flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {chatHistory.map((history) => {
            const isActive = historyId === history.id;
            return (
              <div
                key={history.id}
                className={`group relative flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                style={isActive ? { backgroundColor: mainColor } : undefined}
              >
                <button
                  onClick={() => setHistoryId(history.id)}
                  className="cursor-pointer"
                >
                  {history.title.length > 14
                    ? history.title.substring(0, 14) + '…'
                    : history.title}
                </button>
                {/* Delete button — visible on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(history.id);
                  }}
                  className={`ml-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${
                    isActive
                      ? 'text-white/70 hover:bg-white/20 hover:text-white'
                      : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                  }`}
                  title="Hapus chat"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </ScrollWrapper>

        <button
          type="button"
          onClick={onRequestClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
          title="Tutup chat"
          aria-label="Tutup chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
