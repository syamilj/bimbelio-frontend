'use client';

import { useChatContext } from '@/app/(main)/[web_sub_category]/(user)/user/bimbot/[historyId]/provider';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BimBot } from '@/components/ui/bim-brand';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn, getDateStringShort, getHours } from '@/lib/utils';
import LogoSvg from '@/styles/logo-svg';
import { ChatHistory } from '@/types/database';
import { Bot, Clock, Edit3, MessageSquare, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function SidebarChat() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  // const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isMinimized, setIsMinimized, historyVersion } = useChatContext();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    getGeneral(`/chat/getAllHistoryByUserId?userId=${session?.user.id}`, {
      setData: setChatHistory,
    });
  }, [session]);

  // Refetch chat history when historyVersion changes (e.g. AI-generated title)
  useEffect(() => {
    if (historyVersion > 0) {
      getGeneral(`/chat/getAllHistoryByUserId?userId=${session?.user.id}`, {
        setData: setChatHistory,
      });
    }
  }, [historyVersion]);

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
        setLoading(false);
      },
    });
    return sendData;
  };

  const editChat = async (payload: { id: String; title: string }) => {
    const res = await mutateGeneral('/chat/editChat', {
      payload,
      type: 'put',
      toast: {
        errorMsg: 'Gagal mengedit title chat',
        successMsg: 'Berhasil mengedit title chat',
      },
      onSuccess({ data }) {
        setChatHistory((prev) =>
          prev.map((item) => {
            if (item.id === editingId) {
              return {
                ...item,
                title: data?.title,
              };
            }
            return item;
          }),
        );
        setEditingId(null);
      },
      onError({ status, message, error, data }) {
        console.log({ status, message, error, data });
        setEditingId(null);
      },
    });
    console.log({ res });
  };

  const handleNewChat = async () => {
    setLoading(true);
    const res = await createNewChat({ title: 'Chat Baru' });
    if (res?.id) {
      router.push(`/${website_sub_category_id}/user/bimbot/${res.id}`);
    }
  };

  const handleEditChat = useDebouncedCallback(
    ({ title }: { title: string }) => {
      if (editingId) {
        editChat({ id: editingId, title });
      }
    },
    500,
  );

  const handleCloseSidebar = () => {
    setIsMinimized(true);
  };

  return (
    <>
      {/* Desktop Sidebar - Always visible */}
      <div className="hidden md:flex w-80 h-full bg-white border-r border-slate-200 flex-col relative overflow-hidden">
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-200 relative overflow-hidden shrink-0">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3 group">
              <div className="flex items-center justify-center">
                <LogoSvg className="w-10 h-10 text-main" />
              </div>
              <div className="flex-1">
                <h2
                  className="font-bold text-2xl leading-tight"
                  style={{ color: mainColor }}
                >
                  <BimBot /> AI
                </h2>
                <p className="text-sm text-gray-500 font-medium">by Bimbelio</p>
              </div>
            </div>
          </div>
        </div>

        {/* New Chat */}
        <div className="p-4 border-b border-slate-200 shrink-0">
          <Button
            type="button"
            onClick={handleNewChat}
            disabled={loading}
            className="w-full h-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-white font-semibold"
            style={{ backgroundColor: mainColor }}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Chat Baru
              </>
            )}
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 pt-4 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-gray-900">Riwayat Chat</h3>
            <p className="text-xs text-gray-500 font-medium">
              {chatHistory?.length || 0} percakapan
            </p>
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 pb-4">
              {chatHistory?.map((chat) => {
                const isActive = pathname?.includes(chat.id);
                const isEditing = editingId === chat.id;

                return (
                  <div
                    key={chat.id}
                    className="group relative"
                  >
                    <Link
                      href={`/${website_sub_category_id}/user/bimbot/${chat.id}`}
                    >
                      <div
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border',
                          isActive
                            ? 'shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white',
                        )}
                        style={{
                          backgroundColor: isActive ? mainColor : 'white',
                          borderColor: isActive ? mainColor : undefined,
                        }}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
                          )}
                          style={{
                            backgroundColor: isActive
                              ? 'rgba(255,255,255,0.2)'
                              : `${mainColor}15`,
                          }}
                        >
                          <MessageSquare
                            className="w-4 h-4"
                            style={{ color: isActive ? 'white' : mainColor }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              autoFocus
                              defaultValue={chat.title}
                              onBlur={(e) => {
                                handleEditChat({ title: e.target.value });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditChat({
                                    title: e.currentTarget.value,
                                  });
                                }
                                if (e.key === 'Escape') {
                                  setEditingId(null);
                                }
                              }}
                              className="bg-transparent border-none outline-none w-full text-sm font-semibold"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <h4
                              className={cn(
                                'text-sm font-semibold line-clamp-2 mb-1',
                                isActive ? 'text-white' : 'text-gray-900',
                              )}
                            >
                              {chat.title}
                            </h4>
                          )}
                          <div
                            className={cn(
                              'flex items-center text-xs gap-1 font-medium',
                              isActive ? 'text-white/80' : 'text-gray-500',
                            )}
                          >
                            <Clock className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              {getDateStringShort(chat.updatedAt)}{' '}
                              {getHours(chat.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Edit Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 h-7 w-7 rounded-lg',
                        isActive
                          ? 'text-white hover:bg-white/20'
                          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingId(chat.id);
                      }}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Sidebar - Shows when not minimized */}
      {!isMinimized && (
        <>
          <div className="fixed inset-y-0 left-0 w-80 z-9999 md:hidden bg-white border-r border-slate-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4 py-4 border-b border-slate-200 relative overflow-hidden shrink-0">
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 group flex-1">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm shrink-0"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        className="font-bold text-2xl leading-tight"
                        style={{ color: mainColor }}
                      >
                        <BimBot /> AI
                      </h2>
                      <p className="text-sm text-gray-500 font-medium">
                        Smart Assistant
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseSidebar}
                    className="shrink-0 rounded-lg p-2 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* New Chat */}
            <div className="p-4 border-b border-slate-200 shrink-0">
              <Button
                type="button"
                onClick={handleNewChat}
                disabled={loading}
                className="w-full h-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-white font-semibold"
                style={{ backgroundColor: mainColor }}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Chat Baru
                  </>
                )}
              </Button>
            </div>

            {/* Chat History */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 pt-4 pb-2 shrink-0">
                <h3 className="text-sm font-bold text-gray-900">
                  Riwayat Chat
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {chatHistory?.length || 0} percakapan
                </p>
              </div>
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-2 pb-4">
                  {chatHistory?.map((chat) => {
                    const isActive = pathname?.includes(chat.id);
                    const isEditing = editingId === chat.id;

                    return (
                      <div
                        key={chat.id}
                        className="group relative"
                      >
                        <Link
                          href={`/${website_sub_category_id}/user/bimbot/${chat.id}`}
                          onClick={handleCloseSidebar}
                        >
                          <div
                            className={cn(
                              'flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border',
                              isActive
                                ? 'shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 bg-white',
                            )}
                            style={{
                              backgroundColor: isActive ? mainColor : 'white',
                              borderColor: isActive ? mainColor : undefined,
                            }}
                          >
                            <div
                              className={cn(
                                'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
                              )}
                              style={{
                                backgroundColor: isActive
                                  ? 'rgba(255,255,255,0.2)'
                                  : `${mainColor}15`,
                              }}
                            >
                              <MessageSquare
                                className="w-4 h-4"
                                style={{
                                  color: isActive ? 'white' : mainColor,
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <input
                                  autoFocus
                                  defaultValue={chat.title}
                                  onBlur={(e) => {
                                    handleEditChat({ title: e.target.value });
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditChat({
                                        title: e.currentTarget.value,
                                      });
                                    }
                                    if (e.key === 'Escape') {
                                      setEditingId(null);
                                    }
                                  }}
                                  className="bg-transparent border-none outline-none w-full text-sm font-semibold"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <h4
                                  className={cn(
                                    'text-sm font-semibold line-clamp-2 mb-1',
                                    isActive ? 'text-white' : 'text-gray-900',
                                  )}
                                >
                                  {chat.title}
                                </h4>
                              )}
                              <div
                                className={cn(
                                  'flex items-center text-xs gap-1 font-medium',
                                  isActive ? 'text-white/80' : 'text-gray-500',
                                )}
                              >
                                <Clock className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {getDateStringShort(chat.updatedAt)}{' '}
                                  {getHours(chat.updatedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 h-7 w-7 rounded-lg',
                            isActive
                              ? 'text-white hover:bg-white/20'
                              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingId(chat.id);
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Mobile Overlay */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-9998 md:hidden"
            onClick={handleCloseSidebar}
          />
        </>
      )}
    </>
  );
}

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
`}</style>;
