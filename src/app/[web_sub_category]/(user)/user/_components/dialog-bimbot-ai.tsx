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
import { Loader2, Plus, Send, SendIcon, Sparkles } from 'lucide-react';
import { Dispatch, useEffect, useState } from 'react';

export const DialogBimbotAI = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <button
          className="fixed z-30 bottom-6 right-6 group"
          onClick={() => setIsOpen(true)}
        >
          {/* Background glow effect */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-300 group-hover:scale-150 animate-pulse"
            style={{ backgroundColor: mainColor }}
          />

          {/* Main button container */}
          <div
            className="relative w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center cursor-pointer overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 animate-shimmer" />

            {/* Floating particles background */}
            <div className="absolute inset-0 rounded-full">
              <Sparkles className="absolute w-3 h-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse top-1 left-1" />
              <Sparkles
                className="absolute w-2 h-2 text-yellow-200 opacity-0 group-hover:opacity-75 transition-opacity duration-500 animate-pulse bottom-2 right-2"
                style={{ animationDelay: '200ms' }}
              />
            </div>

            {/* Main icon */}
            <Send className="w-7 h-7 text-white relative z-10 group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12" />

            {/* Pulsing dot indicator */}
            <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-400 shadow-lg animate-pulse" />
          </div>

          {/* Label badge */}
          <div
            className="absolute -top-3 -right-2 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75 origin-bottom-right whitespace-nowrap"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            💬 Tanya AI
          </div>

          {/* Top right accent sparkle */}
          <div
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-dashed opacity-0 group-hover:opacity-40 transition-opacity duration-300"
            style={{ borderColor: mainColor }}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden fixed md:left-[unset] md:right-[1rem] md:bottom-[1rem] md:top-[unset] px-2 py-4 md:px-6 md:py-6 md:translate-x-0 md:translate-y-0 flex flex-col rounded-2xl max-w-2xl h-[85vh]">
        <ChatContent />
      </DialogContent>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        :global(.animate-shimmer) {
          animation: shimmer 2s infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        :global(.animate-float) {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
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
            className="relative px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 group cursor-pointer"
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
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-300 shrink-0 group hover:scale-110"
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
