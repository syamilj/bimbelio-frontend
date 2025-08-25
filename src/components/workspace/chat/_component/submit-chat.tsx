import ButtonPayment from '@/app/[web_sub_category]/(user)/user/_components/button-payment';
import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { IconLock, IconUnlimited } from '@/styles/icon';
import { AlertCircle, Crown, Send, Square, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useDebouncedCallback } from 'use-debounce';
import { useProvider } from '../provider';

const SubmitChat = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const searchParams = useSearchParams();
  const newChat = searchParams.get('new');

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const {
    useSendMessage: { sendMessage, setSendMessage },
  } = useAppContext();

  const {
    prevChatMessages,
    useMessages: {
      handleInputChangeMessages,
      inputMessages,
      isLoadingMessages,
      handleSubmitMessages,
      appendMessages,
    },
    setFirstMessage,
  } = useProvider();
  const { userLimitation, checkLimitation } = useUserLimitation();

  const [send, setSend] = useState<boolean>(false);
  const [showUpgrade, setShowUpgrade] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(0);
  const { setTransactionPopUp } = useAppContext();

  const handleSubmitChatDefault = async () => {
    try {
      const data = await checkLimitation({ chat: true });
      const inputChat = document.getElementById(
        'inputChat',
      ) as HTMLTextAreaElement;
      const e = {
        target: {
          value: inputChat.value,
        },
      };
      if (data && !data.status) {
        toaster({
          title: 'Uppss',
          condition: 'warning',
          description: data.message,
          duration: 5000,
        });
        return;
      } else if (data && data.status) {
        if (prevChatMessages?.length === 0) {
          setFirstMessage(true);
          handleInputChangeMessages(e as any);
        } else {
          handleInputChangeMessages(e as any);
        }
      }
    } catch (error) {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Coba lagi nanti!',
      });
      return;
    }
  };

  useEffect(() => {
    const inputChat = document.getElementById(
      'inputChat',
    ) as HTMLTextAreaElement;
    if (inputMessages.length > 0) {
      handleSubmitMessages();
      // Immediate clear without delay
      if (inputChat) {
        inputChat.value = '';
      }
      setCharCount(0);
      setSend(false);
    }
  }, [inputMessages, handleSubmitMessages]);

  const handleNewChat = useDebouncedCallback(async () => {
    if (!newChat) return;
    appendMessages({
      id: crypto.randomUUID(),
      content: newChat,
      role: 'user',
      createdAt: new Date(),
    });
    router.push(`${window.location.pathname}`);
  }, 1000);

  useEffect(() => {
    handleNewChat();
  }, [newChat]);

  const handleMessageFromPdf = async () => {
    if (!sendMessage) return;
    appendMessages({
      id: crypto.randomUUID(),
      content: sendMessage,
      role: 'user',
      createdAt: new Date(),
    });
    setSendMessage(null);
  };

  useEffect(() => {
    handleMessageFromPdf();
  }, [sendMessage]);

  const isLimitReached =
    session?.user.role !== 'ADMIN' &&
    userLimitation &&
    userLimitation?.chat >= userLimitation?.Limit?.chat;

  const hasLimitWarning =
    userLimitation &&
    userLimitation?.chat < userLimitation?.chatLimit &&
    session?.user.role !== 'ADMIN';

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Compact Limitation Warnings */}
        {isLimitReached && (
          <div className="mb-3 flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="text-sm text-red-700 flex-1">
              Limit chat tercapai
            </span>
            <Button
              size="sm"
              className="h-7 px-3 text-xs bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setTransactionPopUp(true)}
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          </div>
        )}

        {hasLimitWarning && (
          <div className="mb-3 flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
            <Zap
              className="w-4 h-4 shrink-0"
              style={{ color: mainColor }}
            />
            <span className="text-sm text-orange-700 flex-1">
              <span style={{ color: mainColor, fontWeight: '600' }}>
                {userLimitation?.chat}/{userLimitation?.chatLimit}
              </span>{' '}
              chat tersisa
            </span>
            <Button
              size="sm"
              className="h-7 px-3 text-xs text-white"
              style={{ backgroundColor: mainColor }}
              onClick={() => setTransactionPopUp(true)}
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          </div>
        )}

        {(session?.user.role === 'ADMIN' ||
          session?.user.role === 'SUPER_ADMIN') && (
          <div className="mb-3 flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-1 text-green-700 text-sm">
              <IconUnlimited w={14} />
              <span>/</span>
              <IconUnlimited w={14} />
              <span className="font-medium ml-1">Admin - Unlimited</span>
            </div>
          </div>
        )}

        {/* Chat Input */}
        <form
          id="chatAI"
          onSubmit={(e) => {
            handleSubmitChatDefault();
            e.preventDefault();
          }}
        >
          <div className="relative">
            <TextareaAutosize
              id="inputChat"
              maxLength={1000}
              placeholder="Ketik pesan Anda di sini..."
              className={cn(
                'w-full resize-none rounded-2xl border-2 py-3 px-4 pr-14 text-sm font-normal outline-none transition-all duration-200',
                'placeholder:text-gray-400',
                'bg-gray-50 border-gray-200',
                'focus:bg-white',
                send && !isLimitReached ? 'focus:border-2' : '',
              )}
              style={{
                borderColor:
                  send && !isLimitReached ? `${mainColor}80` : undefined,
              }}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  !isLoadingMessages &&
                  !isLimitReached
                ) {
                  e.preventDefault();
                  handleSubmitChatDefault();
                } else if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const length = e.target.value.length;
                setCharCount(length);
                setSend(length > 0);

                if (length > 1000) {
                  e.target.value = e.target.value.slice(0, 1000);
                  setCharCount(1000);
                }

                if (length === 1000) {
                  toaster({
                    title: 'Upss',
                    condition: 'warning',
                    description: 'Maksimal 1000 karakter input chat!',
                    duration: 3000,
                  });
                }
              }}
              autoFocus
              maxRows={4}
              minRows={1}
              disabled={isLimitReached}
            />

            {/* Send Button - Fixed positioning */}
            <div className="absolute right-3 bottom-3 z-20">
              {isLimitReached ? (
                <div className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 rounded-xl bg-gray-200 p-0"
                    onMouseEnter={() => setShowUpgrade(true)}
                    onMouseLeave={() => setShowUpgrade(false)}
                    disabled
                  >
                    <IconLock
                      w={14}
                      className="text-gray-500"
                    />
                  </Button>

                  {showUpgrade && (
                    <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-gray-900 text-white rounded-xl shadow-xl z-50">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs">
                          Limit Chat Tercapai
                        </h4>
                        <p className="text-xs text-gray-300">
                          Upgrade untuk chat unlimited
                        </p>
                        <ButtonPayment text="Upgrade Sekarang" />
                      </div>
                      <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {isLoadingMessages ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 p-0"
                      onClick={() => {
                        // Add stop functionality here if available
                      }}
                    >
                      <Square className="w-3 h-3" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!send || isLimitReached}
                      className={cn(
                        'w-8 h-8 rounded-xl shadow-lg transition-all duration-200 border-0 p-0',
                        send && !isLimitReached
                          ? 'hover:shadow-xl hover:scale-105'
                          : 'opacity-50 cursor-not-allowed',
                      )}
                      style={{
                        backgroundColor:
                          send && !isLimitReached ? mainColor : '#9ca3af',
                        color: 'white',
                      }}
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-xs text-gray-500">
              Enter untuk kirim • Shift+Enter untuk baris baru
            </span>
            <span
              className={cn(
                'text-xs',
                charCount > 900 ? 'text-orange-500' : 'text-gray-400',
              )}
            >
              {charCount}/1000
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitChat;
