import ButtonPayment from '@/app/(main)/[web_sub_category]/(user)/user/_components/button-payment';
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
    session?.user.role !== 'SUPER_ADMIN' &&
    userLimitation &&
    userLimitation?.chat >= userLimitation?.Limit?.chat;

  const hasLimitWarning =
    userLimitation &&
    userLimitation?.chat < userLimitation?.chatLimit &&
    session?.user.role !== 'ADMIN' &&
    session?.user.role !== 'SUPER_ADMIN' &&
    session?.user.role !== 'PREMIUM';

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-10">
      <div className="max-w-2xl mx-auto px-3 py-2">
        {/* Compact Limitation Warnings */}
        {isLimitReached && (
          <div className="mb-2 flex items-center gap-2 p-2 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="text-xs text-red-700 flex-1">
              Limit chat tercapai
            </span>
            <Button
              size="sm"
              className="h-6 px-2 text-[10px] bg-red-600 hover:bg-red-700 text-white rounded-lg"
              onClick={() => setTransactionPopUp(true)}
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          </div>
        )}

        {hasLimitWarning && (
          <div className="mb-2 flex items-center gap-2 p-2 rounded-xl bg-orange-50 border border-orange-200">
            <Zap
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: mainColor }}
            />
            <span className="text-xs text-orange-700 flex-1">
              <span style={{ color: mainColor, fontWeight: '600' }}>
                {userLimitation?.chat}/{userLimitation?.chatLimit}
              </span>{' '}
              chat tersisa
            </span>
            <Button
              size="sm"
              className="h-6 px-2 text-[10px] text-white rounded-lg"
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
          <div className="mb-2 flex items-center gap-1 p-1.5 rounded-xl bg-green-50 border border-green-200">
            <div className="flex items-center gap-1 text-green-700 text-xs">
              <IconUnlimited w={12} />
              <span>/</span>
              <IconUnlimited w={12} />
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
              placeholder="Ketik pesan Kamu di sini..."
              className={cn(
                'w-full resize-none rounded-xl border py-2.5 px-3 pr-12 text-sm font-normal outline-none transition-all duration-200',
                'placeholder:text-slate-400',
                'bg-slate-50 border-slate-200',
                'focus:bg-white focus:border-slate-300',
                send && !isLimitReached ? 'focus:border-2' : '',
              )}
              style={{
                borderColor:
                  send && !isLimitReached ? `${mainColor}60` : undefined,
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
              maxRows={3}
              minRows={1}
              disabled={isLimitReached}
            />

            {/* Send Button - Fixed positioning */}
            <div className="absolute right-2.5 bottom-2 z-20">
              {isLimitReached ? (
                <div className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-7 h-7 rounded-lg bg-slate-200 p-0"
                    onMouseEnter={() => setShowUpgrade(true)}
                    onMouseLeave={() => setShowUpgrade(false)}
                    disabled
                  >
                    <IconLock
                      w={12}
                      className="text-slate-500"
                    />
                  </Button>

                  {showUpgrade && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl z-50">
                      <div className="space-y-1.5">
                        <h4 className="font-semibold text-[11px]">
                          Limit Chat Tercapai
                        </h4>
                        <p className="text-[10px] text-slate-300">
                          Upgrade untuk chat unlimited
                        </p>
                        <ButtonPayment text="Upgrade Sekarang" />
                      </div>
                      <div className="absolute -bottom-1 right-4 w-2 h-2 bg-slate-900 rotate-45" />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {isLoadingMessages ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 p-0"
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
                        'w-7 h-7 rounded-lg shadow-md transition-all duration-200 border-0 p-0',
                        send && !isLimitReached
                          ? 'hover:shadow-lg hover:scale-105'
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
          <div className="flex justify-between items-center mt-1.5 px-0.5">
            <span className="text-[10px] text-slate-500">
              Enter untuk kirim • Shift+Enter untuk baris baru
            </span>
            <span
              className={cn(
                'text-[10px]',
                charCount > 900 ? 'text-orange-500' : 'text-slate-400',
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
