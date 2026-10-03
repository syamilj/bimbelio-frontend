'use client';

import ButtonPayment from '@/app/(main)/[web_sub_category]/(user)/user/_components/button-payment';
import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BimBot } from '@/components/ui/bim-brand';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { IconLock, IconUnlimited } from '@/styles/icon';
import { AlertCircle, ArrowUp, Crown, Square, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useDebouncedCallback } from 'use-debounce';
import { useProvider } from '../provider';

const SubmitChat = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const searchParams = useSearchParams();
  const newChat = searchParams.get('new');

  const mainColor = websiteSubCategory?.main_color || '#0066FF';

  const {
    useSendMessage: { sendMessage, setSendMessage },
  } = useAppContext();

  const {
    prevChatMessages,
    useMessages: { isLoadingMessages, appendMessages, stopChat },
    setFirstMessage,
  } = useProvider();

  const { userLimitation, checkLimitation } = useUserLimitation();
  const { setTransactionPopUp } = useAppContext();

  const [input, setInput] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const canSend = input.trim().length > 0 && !isLimitReached;

  // Submit message
  const handleSubmit = useCallback(async () => {
    if (!canSend || isLoadingMessages) return;

    try {
      const data = await checkLimitation({ chat: true });
      if (data && !data.status) {
        toaster({
          title: 'Uppss',
          condition: 'warning',
          description: data.message,
          duration: 5000,
        });
        return;
      }

      if (data && data.status) {
        const text = input.trim();
        if (prevChatMessages?.length === 0) {
          setFirstMessage(true);
        }
        await appendMessages({
          id: crypto.randomUUID(),
          content: text,
          role: 'user',
          createdAt: new Date(),
        });
        setInput('');
        textareaRef.current?.focus();
      }
    } catch {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Coba lagi nanti!',
      });
    }
  }, [
    canSend,
    isLoadingMessages,
    input,
    prevChatMessages,
    checkLimitation,
    appendMessages,
    setFirstMessage,
  ]);

  // Handle ?new= query param for auto-chat
  const handleNewChat = useDebouncedCallback(async () => {
    if (!newChat) return;
    await appendMessages({
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

  // Handle message from PDF viewer
  useEffect(() => {
    if (!sendMessage) return;
    appendMessages({
      id: crypto.randomUUID(),
      content: sendMessage,
      role: 'user',
      createdAt: new Date(),
    });
    setSendMessage(null);
  }, [sendMessage]);

  return (
    <div className="shrink-0 px-3 pb-3 pt-1.5">
      {/* Limitation Banners */}
      <div className="max-w-2xl mx-auto">
        {isLimitReached && (
          <div className="mb-2 flex items-center gap-2 p-2.5 rounded-3xl bg-red-50 border border-red-100">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-xs text-red-600 flex-1 font-medium">
              Limit chat tercapai
            </span>
            <Button
              size="sm"
              className="h-7 px-3 text-[10px] bg-red-500 hover:bg-red-600 text-white rounded-full"
              onClick={() => setTransactionPopUp(true)}
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          </div>
        )}

        {hasLimitWarning && (
          <div className="mb-2 flex items-center gap-2 p-2.5 rounded-3xl bg-amber-50/80 border border-amber-100/80">
            <Zap
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: mainColor }}
            />
            <span className="text-xs text-amber-700 flex-1">
              <span style={{ color: mainColor, fontWeight: '600' }}>
                {userLimitation?.chat}/{userLimitation?.chatLimit}
              </span>{' '}
              chat tersisa
            </span>
            <Button
              size="sm"
              className="h-7 px-3 text-[10px] text-white rounded-full"
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
          <div className="mb-2 flex items-center gap-1 px-3 py-1.5 rounded-3xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-1 text-slate-500 text-[11px]">
              <IconUnlimited w={11} />
              <span>/</span>
              <IconUnlimited w={11} />
              <span className="font-medium ml-0.5 text-slate-600">
                Admin - Unlimited
              </span>
            </div>
          </div>
        )}

        {/* Chat Input — Gemini-style card */}
        <div
          className={cn(
            'relative rounded-3xl border transition-all duration-200',
            isLimitReached
              ? 'bg-gray-50 border-gray-200 opacity-60'
              : 'bg-white border-slate-200 hover:border-slate-300 focus-within:border-slate-400 focus-within:shadow-sm',
          )}
        >
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            maxLength={1000}
            placeholder="Tanyakan sesuatu..."
            className={cn(
              'w-full resize-none bg-transparent py-3 pl-4 pr-14 text-sm outline-none',
              'placeholder:text-gray-400',
              isLimitReached && 'cursor-not-allowed',
            )}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                !isLoadingMessages &&
                !isLimitReached
              ) {
                e.preventDefault();
                handleSubmit();
              } else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 1000) {
                setInput(value);
              }
              if (value.length >= 1000) {
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

          {/* Action Button */}
          <div className="absolute right-2 bottom-1.5 z-20">
            {isLimitReached ? (
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 rounded-full bg-gray-100 p-0"
                  onMouseEnter={() => setShowUpgrade(true)}
                  onMouseLeave={() => setShowUpgrade(false)}
                  disabled
                >
                  <IconLock
                    w={12}
                    className="text-gray-400"
                  />
                </Button>

                {showUpgrade && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-gray-900 text-white rounded-3xl shadow-xl z-50">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-xs">
                        Limit Chat Tercapai
                      </h4>
                      <p className="text-[10px] text-gray-300">
                        Upgrade untuk chat unlimited
                      </p>
                      <ButtonPayment text="Upgrade Sekarang" />
                    </div>
                    <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                )}
              </div>
            ) : isLoadingMessages ? (
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 p-0 transition-colors"
                onClick={() => stopChat()}
              >
                <Square className="w-3 h-3 fill-current" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={!canSend}
                onClick={handleSubmit}
                className={cn(
                  'w-8 h-8 rounded-full transition-all duration-200 border-0 p-0',
                  canSend
                    ? 'shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                    : 'opacity-30 cursor-not-allowed',
                )}
                style={{
                  backgroundColor: canSend ? mainColor : '#d1d5db',
                  color: 'white',
                }}
              >
                <ArrowUp
                  className="w-4 h-4"
                  strokeWidth={2.5}
                />
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-1.5 px-2">
          <span className="text-[10px] text-gray-400">
            <BimBot /> bisa salah, kroscek lagi ya!
          </span>
          <span
            className={cn(
              'text-[10px] tabular-nums',
              input.length > 900 ? 'text-amber-500' : 'text-gray-300',
            )}
          >
            {input.length}/1000
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubmitChat;
