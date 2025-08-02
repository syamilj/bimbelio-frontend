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
import { Bot, Clock, Edit3, MessageSquare, Plus, X } from 'lucide-react';
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
    await mutateGeneral('/chat/editChat', {
      payload,
      type: 'post',
      toast: {
        errorMsg: 'Gagal mengedit title chat',
        successMsg: 'Berhasil mengedit title chat',
      },
    });
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
        setEditingId(null);
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
      <div className="hidden md:flex w-80 h-full bg-white border-r border-gray-200 shadow-lg flex-col">
        {/* Header */}
        <div
          className="p-4 border-b border-gray-200 relative overflow-hidden shrink-0"
          style={{ backgroundColor: `${mainColor}05` }}
        >
          <div className="relative z-10 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: mainColor }}
            >
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2
                className="font-bold text-lg"
                style={{ color: mainColor }}
              >
                Bimbot AI
              </h2>
              <p className="text-xs text-gray-500">Assistant</p>
            </div>
          </div>
          {/* Decorative elements */}
          <div
            className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: mainColor }}
          />
        </div>

        {/* New Chat Input */}
        <div className="p-4 border-b border-gray-200 shrink-0">
          <form
            onSubmit={handleNewChat}
            className="space-y-3"
          >
            <Input
              placeholder="Topik chat baru..."
              value={newChatInput}
              onChange={(e) => setNewChatInput(e.target.value)}
              className="h-11 rounded-xl"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={!newChatInput.trim() || loading}
              className="w-full h-10 rounded-xl shadow-md"
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
          </form>
        </div>

        {/* Chat History */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 pb-2 shrink-0">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Riwayat Percakapan
            </h3>
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
                      href={`/${website_sub_category_id}/user/chat/${chat.id}`}
                    >
                      <div
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer border-2',
                          isActive
                            ? 'shadow-md scale-[1.02]'
                            : 'border-transparent hover:border-gray-200',
                        )}
                        style={{
                          backgroundColor: isActive ? mainColor : 'transparent',
                          borderColor: isActive ? 'transparent' : undefined,
                          color: isActive ? 'white' : undefined,
                        }}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
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
                              'flex items-center text-xs',
                              isActive ? 'text-white/80' : 'text-gray-500',
                            )}
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            {getDateStringShort(chat.updatedAt)}{' '}
                            {getHours(chat.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Edit Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6',
                        isActive
                          ? 'text-white hover:bg-white/20'
                          : 'text-gray-500 hover:bg-gray-100',
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
          <div className="fixed inset-y-0 left-0 w-80 z-9999 md:hidden bg-white border-r border-gray-200 shadow-lg flex flex-col">
            {/* Header */}
            <div
              className="p-4 border-b border-gray-200 relative overflow-hidden shrink-0"
              style={{ backgroundColor: `${mainColor}05` }}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2
                      className="font-bold text-lg"
                      style={{ color: mainColor }}
                    >
                      Bimbot AI
                    </h2>
                    <p className="text-xs text-gray-500">Assistant</p>
                  </div>
                </div>
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseSidebar}
                  className="p-1 h-8 w-8 text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {/* Decorative elements */}
              <div
                className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10"
                style={{ backgroundColor: mainColor }}
              />
            </div>

            {/* New Chat Input */}
            <div className="p-4 border-b border-gray-200 shrink-0">
              <form
                onSubmit={handleNewChat}
                className="space-y-3"
              >
                <Input
                  placeholder="Topik chat baru..."
                  value={newChatInput}
                  onChange={(e) => setNewChatInput(e.target.value)}
                  className="h-11 rounded-xl"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={!newChatInput.trim() || loading}
                  className="w-full h-10 rounded-xl shadow-md"
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
              </form>
            </div>

            {/* Chat History */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 pb-2 shrink-0">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Riwayat Percakapan
                </h3>
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
                          href={`/${website_sub_category_id}/user/chat/${chat.id}`}
                        >
                          <div
                            className={cn(
                              'flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer border-2',
                              isActive
                                ? 'shadow-md scale-[1.02]'
                                : 'border-transparent hover:border-gray-200',
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
                                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
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
                                  'flex items-center text-xs',
                                  isActive ? 'text-white/80' : 'text-gray-500',
                                )}
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                {getDateStringShort(chat.updatedAt)}{' '}
                                {getHours(chat.updatedAt)}
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6',
                            isActive
                              ? 'text-white hover:bg-white/20'
                              : 'text-gray-500 hover:bg-gray-100',
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
