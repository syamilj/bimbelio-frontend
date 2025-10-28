'use client';

import { useChatContext } from '@/app/[web_sub_category]/(user)/user/chat/[historyId]/provider';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn, getDateStringShort, getHours } from '@/lib/utils';
import { ChatHistory } from '@/types/database';
import {
  Bot,
  ChevronRight,
  Clock,
  Edit3,
  MessageSquare,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function SidebarChat() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isMinimized, setIsMinimized } = useChatContext();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [newChatInput, setNewChatInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    getGeneral(`/chat/getAllHistoryByUserId?userId=${session?.user.id}`, {
      setData: setChatHistory,
    });
  }, [session]);

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

  const handleNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (newChatInput.trim()) {
      const res = await createNewChat({ title: newChatInput });
      setNewChatInput('');
      router.push(`/${website_sub_category_id}/user/chat/${res.id}`);
    } else {
      setLoading(false);
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
      <div className="hidden md:flex w-80 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg flex-col relative overflow-hidden">
        {/* Decorative background elements */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-5"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute top-1/2 -left-20 w-32 h-32 rounded-full opacity-5"
          style={{ backgroundColor: mainColor }}
        />

        {/* Header */}
        <div
          className="p-6 border-b border-gray-200 relative overflow-hidden shrink-0 backdrop-blur-sm"
          style={{ backgroundColor: `${mainColor}08` }}
        >
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 group">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative overflow-hidden"
                style={{ backgroundColor: mainColor }}
              >
                <Bot className="w-6 h-6 text-white relative z-10" />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 animate-shimmer" />
              </div>
              <div className="flex-1">
                <h2
                  className="font-bold text-lg leading-tight group-hover:scale-105 transition-transform origin-left duration-300"
                  style={{ color: mainColor }}
                >
                  Bimbot AI
                </h2>
                <p className="text-xs text-gray-500">Smart Assistant</p>
              </div>
            </div>

            {/* Status indicator */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: `${mainColor}10` }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span
                className="text-xs font-medium"
                style={{ color: mainColor }}
              >
                Online & Ready
              </span>
            </div>
          </div>
        </div>

        {/* New Chat Input */}
        <div className="p-4 border-b border-gray-200 shrink-0">
          <form
            onSubmit={handleNewChat}
            className="space-y-3"
          >
            <div className="relative group">
              <Input
                placeholder="Tulis topik chat..."
                value={newChatInput}
                onChange={(e) => setNewChatInput(e.target.value)}
                className="h-11 rounded-xl pl-4 pr-3 border-2 border-gray-200 focus:border-transparent transition-all duration-300 group-hover:border-gray-300"
                style={
                  {
                    '--tw-ring-color': mainColor,
                  } as any
                }
                disabled={loading}
              />
              {newChatInput && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: mainColor }}
                  />
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={!newChatInput.trim() || loading}
              className="w-full h-11 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-white font-semibold group"
              style={{
                backgroundColor: newChatInput.trim() ? mainColor : '#ccc',
              }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Chat Baru
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Chat History */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 pb-2 shrink-0 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-700">Riwayat</h3>
              <p className="text-xs text-gray-500">Percakapan sebelumnya</p>
            </div>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 pb-4">
              {chatHistory?.map((chat) => {
                const isActive = pathname?.includes(chat.id);
                const isEditing = editingId === chat.id;

                return (
                  <div
                    key={chat.id}
                    className="group relative px-1"
                  >
                    <Link
                      href={`/${website_sub_category_id}/user/chat/${chat.id}`}
                    >
                      <div
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer border-2 group-hover:-translate-x-1',
                          isActive
                            ? 'shadow-lg scale-[1.02]'
                            : 'border-transparent hover:border-gray-200 hover:bg-gray-50',
                        )}
                        style={{
                          backgroundColor: isActive ? mainColor : 'transparent',
                          borderColor: isActive ? 'transparent' : undefined,
                          color: isActive ? 'white' : undefined,
                        }}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 relative',
                            isActive ? 'bg-white/20' : '',
                          )}
                          style={{
                            backgroundColor: !isActive
                              ? `${mainColor}15`
                              : undefined,
                          }}
                        >
                          <MessageSquare
                            className="w-4 h-4"
                            style={{ color: isActive ? 'white' : mainColor }}
                          />
                          {isActive && (
                            <ChevronRight
                              className="absolute w-3 h-3 -right-3 animate-pulse"
                              style={{ color: mainColor }}
                            />
                          )}
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
                              className="bg-transparent border-none outline-none w-full text-sm font-medium"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <h4
                              className={cn(
                                'text-sm font-medium line-clamp-2 mb-1',
                                isActive ? 'text-white' : 'text-gray-800',
                              )}
                            >
                              {chat.title}
                            </h4>
                          )}
                          <div
                            className={cn(
                              'flex items-center text-xs gap-1',
                              isActive ? 'text-white/70' : 'text-gray-500',
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
                        'absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 h-6 w-6 hover:scale-110',
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

        {/* Footer decoration */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <p className="text-xs text-gray-500 text-center">
            💬 Tanya apapun kepada Bimbot AI
          </p>
        </div>
      </div>

      {/* Mobile Sidebar - Shows when not minimized */}
      {!isMinimized && (
        <>
          <div className="fixed inset-y-0 left-0 w-80 z-9999 md:hidden bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-2xl flex flex-col overflow-hidden">
            {/* Decorative background elements */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-5"
              style={{ backgroundColor: mainColor }}
            />
            <div
              className="absolute top-1/2 -left-20 w-32 h-32 rounded-full opacity-5"
              style={{ backgroundColor: mainColor }}
            />

            {/* Header */}
            <div
              className="p-6 border-b border-gray-200 relative overflow-hidden shrink-0 backdrop-blur-sm"
              style={{ backgroundColor: `${mainColor}08` }}
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 group flex-1">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative overflow-hidden shrink-0"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Bot className="w-6 h-6 text-white relative z-10" />
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 animate-shimmer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        className="font-bold text-lg leading-tight truncate group-hover:scale-105 transition-transform origin-left duration-300"
                        style={{ color: mainColor }}
                      >
                        Bimbot AI
                      </h2>
                      <p className="text-xs text-gray-500">Smart Assistant</p>
                    </div>
                  </div>
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseSidebar}
                    className="p-1 h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Status indicator */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: `${mainColor}10` }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span
                    className="text-xs font-medium"
                    style={{ color: mainColor }}
                  >
                    Online & Ready
                  </span>
                </div>
              </div>
            </div>

            {/* New Chat Input */}
            <div className="p-4 border-b border-gray-200 shrink-0">
              <form
                onSubmit={handleNewChat}
                className="space-y-3"
              >
                <div className="relative group">
                  <Input
                    placeholder="Tulis topik chat..."
                    value={newChatInput}
                    onChange={(e) => setNewChatInput(e.target.value)}
                    className="h-11 rounded-xl pl-4 pr-3 border-2 border-gray-200 focus:border-transparent transition-all duration-300 group-hover:border-gray-300"
                    style={
                      {
                        '--tw-ring-color': mainColor,
                      } as any
                    }
                    disabled={loading}
                  />
                  {newChatInput && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: mainColor }}
                      />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!newChatInput.trim() || loading}
                  className="w-full h-11 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-white font-semibold group"
                  style={{
                    backgroundColor: newChatInput.trim() ? mainColor : '#ccc',
                  }}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      Chat Baru
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Chat History */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 pb-2 shrink-0 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Riwayat</h3>
                  <p className="text-xs text-gray-500">Percakapan sebelumnya</p>
                </div>
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-2 pb-4">
                  {chatHistory?.map((chat) => {
                    const isActive = pathname?.includes(chat.id);
                    const isEditing = editingId === chat.id;

                    return (
                      <div
                        key={chat.id}
                        className="group relative px-1"
                      >
                        <Link
                          href={`/${website_sub_category_id}/user/chat/${chat.id}`}
                        >
                          <div
                            className={cn(
                              'flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer border-2 group-hover:-translate-x-1',
                              isActive
                                ? 'shadow-lg scale-[1.02]'
                                : 'border-transparent hover:border-gray-200 hover:bg-gray-50',
                            )}
                            style={{
                              backgroundColor: isActive
                                ? mainColor
                                : 'transparent',
                              borderColor: isActive ? 'transparent' : undefined,
                              color: isActive ? 'white' : undefined,
                            }}
                          >
                            <div
                              className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 relative',
                                isActive ? 'bg-white/20' : '',
                              )}
                              style={{
                                backgroundColor: !isActive
                                  ? `${mainColor}15`
                                  : undefined,
                              }}
                            >
                              <MessageSquare
                                className="w-4 h-4"
                                style={{
                                  color: isActive ? 'white' : mainColor,
                                }}
                              />
                              {isActive && (
                                <ChevronRight
                                  className="absolute w-3 h-3 -right-3 animate-pulse"
                                  style={{ color: mainColor }}
                                />
                              )}
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
                                  className="bg-transparent border-none outline-none w-full text-sm font-medium"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <h4
                                  className={cn(
                                    'text-sm font-medium line-clamp-2 mb-1',
                                    isActive ? 'text-white' : 'text-gray-800',
                                  )}
                                >
                                  {chat.title}
                                </h4>
                              )}
                              <div
                                className={cn(
                                  'flex items-center text-xs gap-1',
                                  isActive ? 'text-white/70' : 'text-gray-500',
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
                            'absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 h-6 w-6 hover:scale-110',
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

            {/* Footer decoration */}
            <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <p className="text-xs text-gray-500 text-center">
                💬 Tanya apapun kepada Bimbot AI
              </p>
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
