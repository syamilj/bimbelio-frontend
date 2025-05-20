import { useSession } from '@/components/provider/provider-session-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import ReactMarkdownChatAI from '@/components/ui/react-markdown-chat-ai';
import { env } from '@/env.mjs';
import { cn, getDate, getHours } from '@/lib/utils';
import { BotMessageSquareIcon, User2Icon } from 'lucide-react';
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
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
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

  // Scroll down when new messages come in
  useEffect(() => {
    if (isLoadingMessages || isLoadingMessagesEdit) {
      console.log('scroll');
      scrollToBottom();
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [isLoadingMessages, isLoadingMessagesEdit, messageData]);

  // Scroll to bottom on first render
  useEffect(() => {
    if (firstRender && listRef?.current) {
      scrollToBottom();
      setTimeout(() => {
        scrollToBottom();
        setShowButtonScroll(false);
      }, 100);
      setFirstRender(false);
    }
  }, [listRef]);

  // Update row height
  useEffect(() => {
    if (rowRef.current) {
      setRowHeight(index, rowRef.current.clientHeight);
    }
  }, [rowRef.current?.clientHeight]);

  const isUser = currentMessage?.role === 'user' || currentMessage === null;

  return (
    <div
      style={{
        ...style,
        overflow: 'hidden',
        paddingRight: '1rem',
        paddingBottom: '1rem',
        paddingTop: '1rem',
      }}
    >
      <div
        ref={rowRef}
        className={cn(
          'text-left flex flex-col w-full',
          'max-w-[95%]',
          isUser && 'ml-4',
        )}
      >
        <Card
          className={cn(
            'rounded-xl shadow-none bg-transparent',
            isUser ? 'bg-white ml-auto' : 'mr-auto',
          )}
        >
          <div className="p-4">
            <div
              className={cn(
                'flex items-start gap-2',
                isUser && 'justify-start flex-row-reverse',
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback
                  className={cn(
                    isUser ? 'bg-green-50 border' : 'bg-blue-50 border',
                  )}
                >
                  {isUser ? (
                    <User2Icon className="h-5 w-5 text-gray-300" />
                  ) : (
                    <BotMessageSquareIcon className="h-5 w-5 text-main" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className={cn('flex flex-col flex-1', isUser && 'text-end')}>
                <div className="relative justify-between items-center mb-2">
                  <p className="font-semibold text-sm">
                    {isUser ? session?.user?.name : 'Bimbelio'}
                  </p>
                  {!isUser && (
                    <span className="absolute -top-2 left-[-20px] bg-red-500 rounded-full px-[0.35rem] py-1 text-white font-bold text-[0.5rem]">
                      AI
                    </span>
                  )}
                  {currentMessage.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      {getHours(currentMessage.createdAt)} |{' '}
                      {getDate(currentMessage.createdAt)}
                    </p>
                  )}
                </div>

                {isBase64Image && currentMessage && (
                  <div>
                    <div className="w-fit rounded-lg overflow-hidden">
                      <Image
                        src={
                          currentMessage.content.includes(
                            'data:image/png;base64',
                          )
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
                  </div>
                )}

                {!isBase64Image && currentMessage && (
                  <>
                    {editMessage.index !== index ? (
                      <ReactMarkdownChatAI
                        value={currentMessage?.content}
                        onClickPageNumber={onClickPageNumber}
                        scrollToPdfPage={scrollToPdfPage}
                        className={cn(isUser && 'text-start')}
                      />
                    ) : (
                      <SubmitChatEdit />
                    )}
                  </>
                )}

                {!editMessage.bool && currentMessage && (
                  <div
                    className={cn(
                      'mt-4 flex justify-between items-center text-sm text-muted-foreground',
                      isUser && 'justify-end',
                    )}
                  >
                    <ChatTools messageIndex={index} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        {index === messageData.length - 1 &&
          isLoadingMessages &&
          currentMessage.role === 'user' && <LoadingChat />}
        {index === messageData.length - 1 &&
          isLoadingMessagesEdit &&
          currentMessage.role === 'user' && <LoadingChat />}
      </div>
    </div>
  );
}
