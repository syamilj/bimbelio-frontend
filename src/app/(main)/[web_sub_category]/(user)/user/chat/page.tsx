'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  deleteGeneral,
  getGeneral,
  mutateGeneral,
} from '@/lib/fetch-helper/fetch-helper';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { getDateString } from '@/lib/utils';
import { ChatHistory } from '@/types/database';
import {
  Bot,
  Clock,
  MessageSquare,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AIChatPage() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newChatInput, setNewChatInput] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState('');

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  // const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [_isLoadingDeleteChat, setIsLoadingDeleteChat] =
    useState<boolean>(false);

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

  const deleteChat = async ({ id }: { id: string }) => {
    let sendData: any = null;
    await deleteGeneral(`/chat/deleteChat?id=${id}`, {
      setLoading: setIsLoadingDeleteChat,
      toast: {
        errorMsg: 'Gagal menghapus chat',
        successMsg: 'Berhasil menghapus chat',
      },
      onSuccess() {
        refetch();
        setLoading(false);
      },
      onError() {
        setLoading(false);
      },
    });
    return sendData;
  };

  const refetch = async () => {
    await getGeneral(`/chat/getAllHistoryByUserId?userId=${session?.user.id}`, {
      setData: setChatHistory,
      setLoading: setIsLoadingHistory,
    });
  };

  useEffect(() => {
    refetch();
  }, [session]);

  // const handleNewChat = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   if (newChatInput.trim()) {
  //     const res = await createNewChat({ title: newChatInput.slice(0, 50) });
  //     router.push(
  //       `/${website_sub_category_id}/user/chat/${res.id}?new=${newChatInput}`,
  //     );
  //   } else {
  //     setLoading(false);
  //   }
  // };

  const filteredHistory =
    chatHistory?.filter((chat) =>
      chat.title.toLowerCase().includes(searchHistory.toLowerCase()),
    ) || [];

  const placeholders = [
    'Jelaskan konsep integral dalam matematika',
    'Bagaimana cara kerja fotosintesis pada tumbuhan?',
    'Apa perbedaan antara mitosis dan meiosis?',
    'Tolong jelaskan hukum Newton yang pertama',
    'Bagaimana cara menghitung luas lingkaran?',
    'Apa yang dimaksud dengan revolusi industri?',
    'Jelaskan struktur atom menurut Bohr',
    'Bagaimana proses pembentukan hujan?',
    'Apa itu teorema Pythagoras dan bagaimana menggunakannya?',
    'Jelaskan perbedaan antara DNA dan RNA',
  ];

  const handleNewChatAdvanced = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (newChatInput.trim()) {
      const res = await createNewChat({ title: newChatInput.slice(0, 50) });
      router.push(
        `/${website_sub_category_id}/user/chat/${res.id}?new=${newChatInput}`,
      );
    } else {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatInput(e.target.value);
  };

  // const suggestedTopics = [
  //   'Matematika Dasar',
  //   'Fisika Kuantum',
  //   'Kimia Organik',
  //   'Bahasa Inggris',
  //   'Sejarah Indonesia',
  //   'Biologi Sel',
  // ];

  useEffect(() => {
    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Chat AI',
        content_type: 'page',
        content_id: 'chat_ai_page',
      },
      user: session?.user
        ? {
            email: session.user.email,
            phone: session.user.phone || undefined,
            userId: session.user.id,
            firstName: session.user.name?.split(' ')[0],
            lastName: session.user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    });
  }, [session]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header Section - Match Dashboard Style */}
        <section className="mb-12">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
            {/* Welcome Card */}
            <div className="md:col-span-2 bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    Selamat Datang di
                  </p>
                  <h1
                    className="text-3xl md:text-4xl font-black"
                    style={{ color: mainColor }}
                  >
                    Bimbot AI Assistant
                  </h1>
                </div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: mainColor }}
                >
                  <Bot className="w-8 h-8" />
                </div>
              </div>
              <p className="text-gray-600 text-base mb-6">
                Tanyakan apapun tentang materi pembelajaran. Aku siap membantu
                Kamu belajar lebih efektif!
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-blue-50 text-blue-700 border border-blue-200 font-medium px-4 py-2 rounded-full text-sm">
                  <Sparkles className="w-3 h-3 inline mr-2" />
                  AI Powered
                </div>
                <div className="bg-green-50 text-green-700 border border-green-200 font-medium px-4 py-2 rounded-full text-sm">
                  24/7 Available
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <p className="text-purple-700 font-bold">Chat History</p>
              </div>
              <div className="text-4xl font-black text-purple-700 mb-2">
                {chatHistory?.length || 0}
              </div>
              <p className="text-sm text-purple-600">Percakapan tersimpan</p>
            </div>
          </div>
        </section>

        {/* Enhanced Chat Input with Animation */}
        <section className="mb-12">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleInputChange}
            onSubmit={handleNewChatAdvanced}
          />
          {loading && (
            <div className="flex justify-center mt-4">
              <div
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl"
                style={{
                  backgroundColor: `${mainColor}10`,
                  color: mainColor,
                }}
              >
                <div
                  className="animate-spin rounded-full h-4 w-4 border-b-2"
                  style={{ borderColor: mainColor }}
                />
                <span>Memulai percakapan...</span>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions - Match Dashboard Style */}
        <section className="mb-12">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
            {/* Lanjutkan Percakapan - Blue */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-5 text-center hover:shadow-md transition-all"
            >
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-blue-700">Lanjutkan</div>
              <p className="text-xs text-blue-600 font-medium mt-1">
                Chat History
              </p>
            </button>

            {/* Eksplorasi Materi - Green */}
            <button className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-5 text-center hover:shadow-md transition-all">
              <Sparkles className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-green-700">Eksplorasi</div>
              <p className="text-xs text-green-600 font-medium mt-1">
                Topik Baru
              </p>
            </button>

            {/* Chat Aktif - Orange */}
            <button className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-5 text-center hover:shadow-md transition-all">
              <MessageSquare className="w-5 h-5 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-orange-700">
                {chatHistory?.length || 0}
              </div>
              <p className="text-xs text-orange-600 font-medium mt-1">
                Total Chat
              </p>
            </button>

            {/* AI Powered - Purple */}
            <button className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-5 text-center hover:shadow-md transition-all">
              <Bot className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-purple-700">24/7</div>
              <p className="text-xs text-purple-600 font-medium mt-1">
                Siap Bantu
              </p>
            </button>
          </div>
        </section>

        {/* Suggested Topics */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: mainColor }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Topik Populer</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholders.slice(0, 6).map((topic, index) => (
              <button
                key={topic}
                onClick={() => setNewChatInput(topic)}
                className="p-6 text-left rounded-3xl border-2 border-gray-100 hover:shadow-md transition-all duration-200 bg-white group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: mainColor }}
                  >
                    <span className="text-sm font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {topic}
                    </p>
                    <p className="text-xs text-gray-500">
                      Klik untuk mulai chat
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Stats or Features - Simplified */}
        <section className="mb-12">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {/* 24/7 Available */}
            <div
              className="p-6 rounded-2xl border-2 text-center"
              style={{
                background: `linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))`,
                borderColor: 'rgb(191 219 254)',
              }}
            >
              <div className="text-4xl font-black text-blue-700 mb-2">24/7</div>
              <div className="text-sm font-bold text-blue-600 mb-1">
                Siap Membantu
              </div>
              <div className="text-xs text-blue-600">Kapan saja dibutuhkan</div>
            </div>

            {/* Unlimited Topics */}
            <div
              className="p-6 rounded-2xl border-2 text-center"
              style={{
                background: `linear-gradient(to bottom right, rgb(240 253 244), rgb(220 252 231))`,
                borderColor: 'rgb(187 247 208)',
              }}
            >
              <div className="text-4xl font-black text-green-700 mb-2">∞</div>
              <div className="text-sm font-bold text-green-600 mb-1">
                Topik Pembelajaran
              </div>
              <div className="text-xs text-green-600">Tanpa batas materi</div>
            </div>

            {/* Fast Response */}
            <div
              className="p-6 rounded-2xl border-2 text-center"
              style={{
                background: `linear-gradient(to bottom right, rgb(250 245 255), rgb(243 232 255))`,
                borderColor: 'rgb(233 213 255)',
              }}
            >
              <div className="text-4xl font-black text-purple-700 mb-2">🚀</div>
              <div className="text-sm font-bold text-purple-600 mb-1">
                Respons Cepat
              </div>
              <div className="text-xs text-purple-600">Jawaban instan</div>
            </div>
          </div>
        </section>

        {/* Chat History Dialog */}
        <Dialog
          open={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
        >
          <DialogContent className="md:max-w-2xl max-h-[80vh] p-0 overflow-hidden mx-4 rounded-3xl">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle className="text-xl font-black">
                Riwayat Percakapan
              </DialogTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari percakapan..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  className="pl-10 h-10 rounded-xl border-2"
                />
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-3">
                {isLoadingHistory ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-20 w-full rounded-2xl"
                    />
                  ))
                ) : filteredHistory.length > 0 ? (
                  filteredHistory.map((chat) => (
                    <Link
                      key={chat.id}
                      href={`/${website_sub_category_id}/user/chat/${chat.id}`}
                      className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:shadow-md transition-all cursor-pointer bg-white"
                      onClick={() => {
                        setIsHistoryOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: mainColor }}
                        >
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm line-clamp-2 mb-1 text-gray-900">
                            {chat.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {getDateString(chat.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-gray-500 hover:text-red-600 rounded-xl"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteChat({ id: chat.id });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada riwayat percakapan</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
