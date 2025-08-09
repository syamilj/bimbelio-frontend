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
import { pixel } from '@/lib/pixel/_core';
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
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [isLoadingDeleteChat, setIsLoadingDeleteChat] =
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

  const handleNewChat = async (e: React.FormEvent) => {
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

  const suggestedTopics = [
    'Matematika Dasar',
    'Fisika Kuantum',
    'Kimia Organik',
    'Bahasa Inggris',
    'Sejarah Indonesia',
    'Biologi Sel',
  ];

  useEffect(() => {
    pixel.meta.track(
      'ViewContent',
      {
        content_name: 'Chat AI',
        content_type: 'page',
      },
      // ✅ Advanced Matching untuk Meta Pixel
      session?.user
        ? {
            em: session.user.email,
            ph: session.user.phone || undefined,
            fn: session.user.name?.split(' ')[0],
            ln: session.user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    );
    pixel.tiktok.track('ViewContent', {
      content_name: 'Chat AI',
      content_id: 'chat_ai_page', // ✅ Required untuk TikTok VSA
    });
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: mainColor }}
          >
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: mainColor }}
          >
            Bimbot AI Assistant
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Tanyakan apapun tentang materi pembelajaran. Saya siap membantu Anda
            belajar lebih efektif!
          </p>
        </div>

        {/* Enhanced Chat Input with Animation */}
        <div className="mb-10">
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
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
          <Button
            variant="outline"
            className="h-16 justify-start gap-4 rounded-xl border-2 hover:shadow-lg transition-all duration-200 bg-white"
            onClick={() => setIsHistoryOpen(true)}
            style={{ borderColor: `${mainColor}20` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Clock
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            <div className="text-left">
              <div className="font-semibold">Lanjutkan Percakapan</div>
              <div className="text-sm text-gray-500">Buka riwayat chat</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16 justify-start gap-4 rounded-xl border-2 hover:shadow-lg transition-all duration-200 bg-white"
            style={{ borderColor: `${mainColor}20` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Sparkles
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            <div className="text-left">
              <div className="font-semibold">Eksplorasi Materi</div>
              <div className="text-sm text-gray-500">Temukan topik baru</div>
            </div>
          </Button>
        </div>

        {/* Suggested Topics */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center text-gray-900">
            Topik Populer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {placeholders.slice(0, 6).map((topic, index) => (
              <button
                key={topic}
                onClick={() => setNewChatInput(topic)}
                className="p-4 text-left rounded-xl border-2 hover:shadow-lg transition-all duration-200 bg-white group"
                style={{
                  borderColor: `${mainColor}15`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: mainColor }}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      {topic.length > 40 ? topic.slice(0, 40) + '...' : topic}
                    </p>
                    <p className="text-xs text-gray-500">
                      Klik untuk mulai chat
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats or Features */}
        <div
          className="rounded-2xl p-8 text-white text-center"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <h3 className="text-2xl font-bold mb-6">Powered by Advanced AI</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-white/90 font-medium">Siap Membantu</div>
              <div className="text-sm text-white/70 mt-1">
                Kapan saja dibutuhkan
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">∞</div>
              <div className="text-white/90 font-medium">
                Topik Pembelajaran
              </div>
              <div className="text-sm text-white/70 mt-1">
                Tanpa batas materi
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🚀</div>
              <div className="text-white/90 font-medium">Respons Cepat</div>
              <div className="text-sm text-white/70 mt-1">Jawaban instan</div>
            </div>
          </div>
        </div>

        {/* Chat History Dialog */}
        <Dialog
          open={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-hidden mx-4">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle className="text-xl">Riwayat Percakapan</DialogTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari percakapan..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  className="pl-10 h-10 rounded-xl"
                />
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-3">
                {isLoadingHistory ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-16 w-full rounded-xl"
                    />
                  ))
                ) : filteredHistory.length > 0 ? (
                  filteredHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center justify-between p-4 rounded-xl border-2 hover:shadow-md transition-all cursor-pointer bg-white"
                      style={{ borderColor: `${mainColor}15` }}
                      onClick={() => {
                        router.push(
                          `/${website_sub_category_id}/user/chat/${chat.id}`,
                        );
                        setIsHistoryOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${mainColor}15` }}
                        >
                          <MessageSquare
                            className="w-5 h-5"
                            style={{ color: mainColor }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1 text-gray-800">
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
                        className="shrink-0 text-gray-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat({ id: chat.id });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
