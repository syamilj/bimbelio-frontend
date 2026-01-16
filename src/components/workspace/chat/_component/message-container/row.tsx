import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingBottom: '1rem',
        paddingTop: '0.5rem',
      }}
    >
      <div
        ref={rowRef}
        className={cn(
          'flex w-full max-w-5xl mx-auto',
          isUser ? 'justify-end' : 'justify-start',
        )}
      >
        <div
          className={cn(
            'flex gap-3 max-w-[85%] md:max-w-[75%]',
            isUser ? 'flex-row-reverse' : 'flex-row',
          )}
        >
          {/* Avatar */}
          <div className="shrink-0">
            <Avatar className="w-8 h-8 border border-gray-200">
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
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            {/* Message Header */}
            <div
              className={cn(
                'flex items-center gap-2 mb-2',
                isUser ? 'flex-row-reverse' : 'flex-row',
              )}
            >
              <div
                className={cn(
                  'flex items-center gap-2',
                  isUser ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                <span className="font-semibold text-sm">
                  {isUser ? session?.user?.name || 'You' : 'BimBot AI'}
                </span>
                {!isUser && (
                  <div
                    className="px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: mainColor }}
                  >
                    AI
                  </div>
                )}
              </div>
              {currentMessage.createdAt && (
                <span className="text-xs text-gray-500">
                  {getHours(currentMessage.createdAt)} •{' '}
                  {getDate(currentMessage.createdAt)}
                </span>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={cn(
                'relative rounded-3xl px-4 py-3 shadow-sm border transition-all duration-200',
                isUser
                  ? 'bg-white border-gray-200'
                  : 'border-transparent shadow-md',
              )}
              style={{
                backgroundColor: !isUser ? `${mainColor}08` : undefined,
                borderColor: !isUser ? `${mainColor}20` : undefined,
              }}
            >
              {/* Message Content */}
              {isBase64Image && currentMessage ? (
                <div className="rounded-lg overflow-hidden">
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
