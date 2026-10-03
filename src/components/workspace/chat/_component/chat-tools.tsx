import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { Copy, Edit3, RotateCcw, ThumbsDown, ThumbsUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useProvider } from '../provider';

type Props = {
  messageIndex: number;
};

const ChatTools = ({ messageIndex }: Props) => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0066FF';

  const {
    messageData,
    setMessageData,
    useMessagesEdit: { handleInputChangeMessagesEdit },
    setEditMessage,
  } = useProvider();

  const { checkLimitation } = useUserLimitation();

  const data = messageData[messageIndex];
  const role = messageData[messageIndex].role;

  const like = async (payload: { messageId: string }) => {
    const type = pathname.includes('chat') ? 'chat' : 'doc';
    await mutateGeneral('/message/likeMessage', {
      payload: {
        ...payload,
        userId: session?.user.id,
        type,
      },
      type: 'post',
      onLoading() {
        const upData = messageData.filter((_, i) => i < messageIndex);
        const downData = messageData.filter((_, i) => i > messageIndex);
        setMessageData([...upData, { ...data, like: !data.like }, ...downData]);
      },
      onSuccess() {
        //     await trpc.message.getAllByDocIdAndUserId.refetch();
      },
    });
  };

  const dislike = async (payload: { messageId: string }) => {
    const type = pathname.includes('chat') ? 'chat' : 'doc';
    await mutateGeneral('/message/dislikeMessage', {
      payload: {
        ...payload,
        userId: session?.user.id,
        type,
      },
      type: 'post',
      onLoading() {
        const upData = messageData.filter((_, i) => i < messageIndex);
        const downData = messageData.filter((_, i) => i > messageIndex);
        setMessageData([
          ...upData,
          { ...data, dislike: !data.dislike },
          ...downData,
        ]);
      },
      onSuccess() {
        //     await trpc.message.getAllByDocIdAndUserId.refetch();
      },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.content).then(
      () => {
        toaster({
          title: 'Disalin',
          description: 'Pesan telah disalin!',
          duration: 2000,
        });
      },
      () => {
        toaster({
          title: 'Gagal',
          description: 'Gagal menyalin pesan!',
          condition: 'warning',
          duration: 2000,
        });
      },
    );
  };

  const handleEditMessage = () => {
    setEditMessage((prev) => ({
      ...prev,
      bool: true,
      index: messageIndex,
      value: data.content,
    }));
    setTimeout(() => {
      const inputChatEdit = document.getElementById(
        'editInput',
      ) as HTMLInputElement;
      if (inputChatEdit) {
        inputChatEdit.value = data.content;
      }
    }, 100);
  };

  const regenerateApi = async (payload: {
    docId: string;
    messageIndex: number;
  }) => {
    await mutateGeneral('/message/regenerateMessage', {
      payload: {
        ...payload,
        userId: session?.user.id,
      },
      type: 'post',
    });
  };

  const regenerateMessage = async () => {
    try {
      const data = await checkLimitation({ chat: true });
      if (data && !data.status) {
        toaster({
          title: 'Uppss',
          condition: 'warning',
          description: data.message,
        });
        return;
      } else if (data && data.status) {
        regenerateApi({
          docId: `${docId}`,
          messageIndex: messageIndex,
        });
        const submit = document.getElementById(
          'editMessage',
        ) as HTMLButtonElement;
        const newMessage = messageData.slice(0, -2);
        const e: any = {
          target: {
            value: messageData[messageIndex - 1].content,
          },
        };
        // setTempData([...newMessage]);
        setMessageData([...newMessage]);
        handleInputChangeMessagesEdit(e);
        setTimeout(() => {
          submit.click();
        }, 500);
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

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        role === 'user' ? 'justify-end' : 'justify-start',
      )}
    >
      {role === 'user' ? (
        // User Message Tools
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-3xl p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleCopy}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-3xl p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleEditMessage}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ) : (
        // AI Message Tools
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-3xl p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={handleCopy}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 rounded-3xl p-0 transition-all duration-200',
              data?.like
                ? 'text-white shadow-sm hover:shadow-md'
                : 'text-gray-500 hover:text-green-600 hover:bg-green-50',
            )}
            style={{
              backgroundColor: data?.like ? mainColor : 'transparent',
            }}
            onClick={() => like({ messageId: data?.id })}
          >
            <ThumbsUp
              className={cn(
                'w-3.5 h-3.5 transition-transform',
                data?.like && 'scale-110',
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 rounded-3xl p-0 transition-all duration-200',
              data?.dislike
                ? 'bg-red-500 text-white shadow-sm hover:shadow-md hover:bg-red-600'
                : 'text-gray-500 hover:text-red-600 hover:bg-red-50',
            )}
            onClick={() => dislike({ messageId: data?.id })}
          >
            <ThumbsDown
              className={cn(
                'w-3.5 h-3.5 transition-transform',
                data?.dislike && 'scale-110',
              )}
            />
          </Button>

          {messageData.length - 1 === messageIndex && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-3xl p-0 text-gray-500 hover:bg-gray-100 transition-colors"
              style={{
                color: mainColor,
              }}
              onClick={regenerateMessage}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatTools;
