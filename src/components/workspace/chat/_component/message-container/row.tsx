import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BimBot } from '@/components/ui/bim-brand';
import ReactMarkdownChatAI from '@/components/ui/react-markdown-chat-ai';
import { env } from '@/env.mjs';
import { cn, getDate, getHours } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useProvider } from '../../provider';
import ChatTools from '../chat-tools';
import LoadingChat from '../loading-chat';
import SubmitChatEdit from '../submit-chat-edit';

export default function Row({
  index,
  style,
  data: {
    listRef,
    rowHeights,
    setShowButtonScroll,
    firstRender,
    setFirstRender,
    scrollToBottom,
  },
}: {
  index: number;
  style: React.CSSProperties;
  data: {
    listRef: React.RefObject<any>;
    rowHeights: any;
    setShowButtonScroll: React.Dispatch<React.SetStateAction<boolean>>;
    firstRender: boolean;
    setFirstRender: React.Dispatch<React.SetStateAction<boolean>>;
    scrollToBottom: () => void;
  };
}) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const {
    messageData,
    useMessages: { isLoadingMessages },
    useMessagesEdit: { isLoadingMessagesEdit },
    editMessage,
    scrollToPdfPage,
    onClickPageNumber,
    setEditMessage,
  } = useProvider();

  const currentMessage = messageData[index];
  const rowRef = useRef<HTMLDivElement>(null);
  const isBase64Image = currentMessage?.content?.startsWith(
    env.NEXT_PUBLIC_SUPABASE_URL,
  );

  const setRowHeight = (index: any, size: any) => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
      rowHeights.current = { ...rowHeights.current, [index]: size };
    }
  };

  useEffect(() => {
    const input = document.getElementById('editInput');
    const handleInputChange = (e: any) => {
      setEditMessage((prev) => ({ ...prev, value: e.target.value }));
    };
    if (input) {
      input.addEventListener('input', handleInputChange);
    }
    return () => {
      if (input) {
        input.removeEventListener('input', handleInputChange);
      }
    };
  }, []);

  // Simplified scroll down when new messages come in
  useEffect(() => {
    if (isLoadingMessages || isLoadingMessagesEdit) {
      // Single smooth scroll call
      setTimeout(() => scrollToBottom(), 150);
    }
  }, [
    isLoadingMessages,
    isLoadingMessagesEdit,
    messageData.length,
    scrollToBottom,
  ]);

  // Simplified scroll to bottom on first render
  useEffect(() => {
    if (firstRender && listRef?.current) {
      setTimeout(() => {
        scrollToBottom();
        setShowButtonScroll(false);
        setFirstRender(false);
      }, 200);
    }
  }, [
    firstRender,
    listRef,
    scrollToBottom,
    setFirstRender,
    setShowButtonScroll,
  ]);

  // Simplified row height update
  useEffect(() => {
    if (rowRef.current) {
      const height = rowRef.current.clientHeight;
      if (rowHeights.current[index] !== height) {
        setRowHeight(index, height);
      }
    }
  }, [index, rowRef.current?.clientHeight]);

  const isUser = currentMessage?.role === 'user' || currentMessage === null;

  return (
    <div
      style={{
        ...style,
        overflow: 'hidden',
        paddingLeft: '0.75rem',
        paddingRight: '0.75rem',
        paddingBottom: '0.75rem',
        paddingTop: '0.5rem',
      }}
    >
      <div
        ref={rowRef}
        className={cn(
          'flex w-full max-w-4xl mx-auto',
          isUser ? 'justify-end' : 'justify-start',
        )}
      >
        <div
          className={cn(
            'flex gap-2.5 max-w-[92%] sm:max-w-[85%]',
            isUser ? 'flex-row-reverse' : 'flex-row',
          )}
        >
          {/* Avatar */}
          <div className="shrink-0 mt-1">
            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-200/80 shadow-sm">
              <AvatarFallback
                className={cn(
                  'text-white font-semibold',
                  isUser
                    ? 'bg-linear-to-br from-green-500 to-emerald-600'
                    : 'bg-linear-to-br',
                )}
                style={{
                  backgroundImage: !isUser
                    ? `linear-gradient(135deg, ${mainColor}, ${websiteSubCategory?.secondary_color || mainColor})`
                    : undefined,
                }}
              >
                {isUser ? (
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            {/* Message Header */}
            <div
              className={cn(
                'flex items-center gap-1.5 mb-1.5',
                isUser ? 'flex-row-reverse' : 'flex-row',
              )}
            >
              <div
                className={cn(
                  'flex items-center gap-1.5',
                  isUser ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                <span className="font-semibold text-xs sm:text-sm text-slate-800">
                  {isUser ? (
                    session?.user?.name || 'You'
                  ) : (
                    <>
                      <BimBot /> AI
                    </>
                  )}
                </span>
                {!isUser && (
                  <div
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: mainColor }}
                  >
                    AI
                  </div>
                )}
              </div>
              {currentMessage.createdAt && (
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {getHours(currentMessage.createdAt)} •{' '}
                  {getDate(currentMessage.createdAt)}
                </span>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={cn(
                'relative rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm border transition-all duration-200',
                isUser
                  ? 'bg-white border-gray-200/80'
                  : 'border-transparent shadow-md',
              )}
              style={{
                backgroundColor: !isUser ? `${mainColor}08` : undefined,
                borderColor: !isUser ? `${mainColor}20` : undefined,
              }}
            >
              {/* Message Content */}
              {isBase64Image && currentMessage ? (
                <div className="rounded-3xl overflow-hidden">
                  <Image
                    src={
                      currentMessage.content.includes('data:image/png;base64')
                        ? currentMessage.content.split('=')[0] ||
                          '/placeholder.svg'
                        : currentMessage.content || '/placeholder.svg'
                    }
                    className="h-auto max-w-full"
                    alt="Bimbelio - Bimbel AI"
                    width={500}
                    height={300}
                  />
                </div>
              ) : (
                currentMessage && (
                  <>
                    {editMessage.index !== index ? (
                      <ReactMarkdownChatAI
                        value={currentMessage?.content}
                        onClickPageNumber={onClickPageNumber}
                        scrollToPdfPage={scrollToPdfPage}
                        className={cn(
                          'prose prose-base max-w-none prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-code:text-inherit prose-pre:text-inherit prose-li:text-inherit prose-blockquote:text-inherit',
                          // Additional styling for user messages
                          isUser && 'prose-p:text-gray-700',
                        )}
                      />
                    ) : (
                      <SubmitChatEdit />
                    )}
                  </>
                )
              )}

              {/* Message Actions */}
              {!editMessage.bool && currentMessage && (
                <div
                  className={cn(
                    'mt-3 pt-2 border-t border-gray-100',
                    isUser ? 'text-right' : 'text-left',
                  )}
                >
                  <ChatTools messageIndex={index} />
                </div>
              )}

              {/* Message Tail */}
              <div
                className={cn(
                  'absolute top-3 w-0 h-0',
                  isUser
                    ? 'right-[-8px] border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent'
                    : 'left-[-8px] border-r-8 border-t-4 border-t-transparent border-b-4 border-b-transparent',
                )}
                style={{
                  borderRightColor: !isUser ? `${mainColor}08` : undefined,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator - Positioned separately below the current message */}
      {index === messageData.length - 1 &&
        (isLoadingMessages || isLoadingMessagesEdit) &&
        currentMessage.role === 'user' && (
          <div className="mt-4">
            <LoadingChat />
          </div>
        )}
    </div>
  );
}
