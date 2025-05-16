import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/session-provider-auth';
import { toaster } from '@/components/ui/toaster';
import { ToolTip } from '@/components/ui/tooltip';
import { mutateGeneral } from '@/lib/fetch-helper';
import {
  IconCopy,
  IconDislike,
  IconEdit,
  IconLike,
  IconRegenerateMessage,
  IconSettingMessage,
} from '@/styles/icon';
import { usePathname } from 'next/navigation';
import { useProvider } from '../provider';

type Props = {
  messageIndex: number;
};

const ChatTools = ({ messageIndex }: Props) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];

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
    console.log(data.content);
    setTimeout(() => {
      const inputChatEdit = document.getElementById(
        'editInput',
      ) as HTMLInputElement;
      if (inputChatEdit) {
        console.log(inputChatEdit);
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
    <>
      {role === 'user' ? (
        <div className="flex items-center gap-[.5rem] text-[1.2rem]">
          {}
          <ToolTip value="Copy text">
            <div
              className="rounded-[50%] p-[.2rem] text-main-gray-text duration-200 hover:bg-main-gray-input"
              onClick={() => {
                handleCopy();
              }}
            >
              <IconCopy
                w={18}
                className={''}
              />
            </div>
          </ToolTip>
          <ToolTip value="Edit message">
            <div
              className="hidden rounded-[50%] p-[.2rem] text-main-gray-text duration-200 hover:bg-main-gray-input"
              onClick={() => {
                handleEditMessage();
              }}
            >
              <IconEdit
                w={18}
                className={''}
              />
            </div>
          </ToolTip>
        </div>
      ) : (
        <div className="flex items-center gap-[.2rem] text-[1.2rem]">
          <ToolTip value="Copy text">
            <div
              className="rounded-[50%] p-[.2rem] text-main-gray-text duration-200 hover:bg-main-gray-input"
              onClick={() => {
                handleCopy();
              }}
            >
              <IconCopy
                w={18}
                className={''}
              />
            </div>
          </ToolTip>
          <ToolTip value="Like message">
            <div
              className="rounded-[50%] p-[.2rem] text-main-gray-text duration-200 hover:bg-main-gray-input"
              onClick={() => {
                like({ messageId: data?.id });
              }}
            >
              {data?.like ? (
                <IconLike
                  w={18}
                  className={''}
                  active={true}
                />
              ) : (
                <IconLike
                  w={18}
                  className={''}
                />
              )}
            </div>
          </ToolTip>
          <ToolTip value="Dislike message">
            <div
              className="rounded-[50%] p-[.2rem] text-main-gray-text duration-200 hover:bg-main-gray-input"
              onClick={() => {
                dislike({ messageId: data?.id });
              }}
            >
              {data?.dislike ? (
                <IconDislike
                  w={18}
                  className={''}
                  active={true}
                />
              ) : (
                <IconDislike
                  w={18}
                  className={''}
                />
              )}
            </div>
          </ToolTip>
          <ToolTip value="Regenerate message">
            <div className="rounded-[50%] p-[.2rem] text-main-gray-text duration-200 hover:bg-main-gray-input">
              <IconSettingMessage
                w={18}
                className={''}
              />
            </div>
          </ToolTip>
          {messageData.length - 1 === messageIndex && (
            <ToolTip value="Regenerate message">
              <div
                className="rounded-[50%] p-[.2rem] text-main-gray-text duration-200 hover:bg-main-gray-input"
                onClick={() => regenerateMessage()}
              >
                <IconRegenerateMessage
                  w={18}
                  className={''}
                />
              </div>
            </ToolTip>
          )}
        </div>
      )}
    </>
  );
};

export default ChatTools;
