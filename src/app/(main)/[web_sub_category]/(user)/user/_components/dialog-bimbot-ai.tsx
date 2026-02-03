'use client';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Chat from '@/components/workspace/chat';
import { MessageDataType } from '@/components/workspace/chat/provider';
import { env } from '@/env.mjs';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { ChatHistory } from '@/types/database';
import { motion } from 'framer-motion';
import { BotMessageSquare, Loader2, Plus, SendIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Dispatch, useEffect, useState } from 'react';

const blacklistPaths = ['/user/bimarena/try-out', '/user/bimcourse', '/user/workspace'];

export const DialogBimbotAI = () => {
  const pathname = usePathname();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
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
          className="fixed bottom-6 right-6 shadow-lg p-2 rounded-full z-30 cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
          onClick={() => setIsOpen(true)}
          whileTap={{ scale: 1.2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Icon */}
          <BotMessageSquare
            className="text-white w-8 h-8 transform scale-x-[-1]"
            strokeWidth={2.1}
          />

          {/* Badge AI */}
          <span className="absolute -top-1 left-[-4px] bg-red-500 rounded-full px-[0.35rem] py-1 text-white font-bold text-xs shadow-md">
            AI
          </span>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="overflow-hidden fixed md:left-[unset] md:right-[1rem] md:bottom-[1rem] md:top-[unset] px-2 py-4 md:px-6 md:py-6 md:translate-x-0 md:translate-y-0 flex flex-col rounded-3xl md:max-w-2xl h-[85vh]">
        <ChatContent />
      </DialogContent>
    </Dialog>
  );
};

function ChatContent() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [historyId, setHistoryId] = useState<undefined | string>();

  const [prevChatMessages, setPrevChatMessages] = useState<MessageDataType[]>(
    [],
  );
  const [isLoadingPrevMessage, setIsLoadingPrevMessage] =
    useState<boolean>(true);
  const [messageError, setMessageError] = useState<string | null>(null);

  const getMessages = async () => {
    console.log({ historyId });
    if (!historyId) return;
    const res = await getGeneral(
      `/chat/getAllMessageByHistoryId?historyId=${historyId}`,
      {
        setData: setPrevChatMessages,
        setLoading: setIsLoadingPrevMessage,
        onError({ message }) {
          setMessageError(message);
        },
      },
    );
    console.log({ res });
    if (res?.data?.length === 0) {
      console.log({ res: 'masuk' });
      setPrevChatMessages([]);
    }
  };

  useEffect(() => {
    getMessages();
  }, [historyId]);

  if (messageError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading messages</p>
          <p className="text-sm text-muted-foreground">{messageError}</p>
        </div>
      </div>
    );
  }

  if (!historyId) {
    <Loader2 className="w-4 h-4 animate-spin" />;
  }

  return (
    <div className="flex flex-col h-full w-full absolute top-0 left-0 overflow-hidden px-6 pb-6 pt-[6rem]">
      <HeaderChat
        setHistoryId={setHistoryId}
        historyId={historyId}
      />

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

const HeaderChat = ({
  historyId,
  setHistoryId,
}: {
  historyId: string | undefined;
  setHistoryId: Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const { data: session } = useSession();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [newChatInput, setNewChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewChatInput, setShowNewChatInput] = useState(false);

  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  useEffect(() => {
    getGeneral(`/chat/getAllHistoryByUserId?userId=${session?.user.id}`, {
      setData: setChatHistory,
    });
  }, [session]);

  useEffect(() => {
    if (chatHistory.length > 0) {
      setHistoryId(chatHistory[0].id);
    }
  }, [chatHistory]);

  const createNewChat = async (payload: { title: string }) => {
    let sendData: any = null;
    await mutateGeneral('/chat/createNewChat', {
      payload: {
        ...payload,
        userId: session?.user.id,
      },
      type: 'post',
      toast: {
        errorMsg: 'Gagal membuat chat baru',
      },
      onError() {
        setLoading(false);
      },
      onSuccess({ data }) {
        sendData = data;
        if (data?.id) {
          setHistoryId(data?.id);
          getGeneral(`/chat/getAllHistoryByUserId?userId=${session?.user.id}`, {
            setData: setChatHistory,
          });
        }
        setLoading(false);
      },
    });
    return sendData;
  };

  const handleNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (newChatInput.trim()) {
      await createNewChat({ title: newChatInput });
      setNewChatInput('');
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 p-2 overflow-x-hidden overflow-y-hidden absolute left-6 right-10 top-6 z-[10] bg-white">
      {/* Chat history tabs */}
      <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
        {chatHistory.map((history, index) => (
          <button
            key={history.id}
            onClick={() => setHistoryId(history.id)}
            className="relative px-4 py-2 rounded-3xl text-sm font-medium whitespace-nowrap shrink-0 group cursor-pointer"
            style={{
              backgroundColor:
                historyId === history.id ? `${mainColor}10` : 'transparent',
              color: historyId === history.id ? mainColor : '#666',
              borderBottom:
                historyId === history.id
                  ? `2px solid ${mainColor}`
                  : '2px solid transparent',
            }}
          >
            {/* Tab content */}
            <span className="truncate max-w-[120px] inline-block">
              {history.title.length > 20
                ? history.title.substring(0, 20) + '...'
                : history.title}
            </span>

            {/* Active indicator dot */}
            {historyId === history.id && (
              <div
                className="absolute -top-1 right-0 w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: mainColor }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Add new chat button */}
      <div
        className="relative"
        onMouseOver={() => setShowNewChatInput(true)}
        onMouseLeave={() => setShowNewChatInput(false)}
      >
        <button
          className="p-2 rounded-3xl text-gray-600 hover:bg-gray-100 transition-all duration-300 shrink-0 group hover:scale-110"
          title="Chat baru"
        >
          <Plus className="w-4 h-4" />
        </button>
        {showNewChatInput && (
          <form
            onSubmit={handleNewChat}
            className="absolute right-[100%] top-0 bottom-0 w-[200px] flex items-center"
          >
            <Input
              type="text"
              value={newChatInput}
              onChange={(e) => setNewChatInput(e.target.value)}
              placeholder="Tulis topik chat..."
            />
            <button
              type="submit"
              className="bg-white border-l h-full flex items-center absolute right-0 top-0 bottom-0 px-2 rounded-r-xl cursor-pointer hover:scale-105"
            >
              <SendIcon className="w-5 h-5 text-main mr-2" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
