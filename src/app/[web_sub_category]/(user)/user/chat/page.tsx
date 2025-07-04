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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: mainColor }}
          >
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: mainColor }}
          >
            Bimbot AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Tanyakan apapun tentang materi pembelajaran. Saya siap membantu Anda
            belajar lebih efektif!
          </p>
        </div>

        {/* Enhanced Chat Input with Animation */}
        <div className="mb-8">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleInputChange}
            onSubmit={handleNewChatAdvanced}
          />
          {loading && (
            <div className="flex justify-center mt-4">
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: mainColor }}
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
            className="h-14 justify-start gap-4 rounded-xl border-2 hover:shadow-md transition-all"
            onClick={() => setIsHistoryOpen(true)}
            style={{ borderColor: `${mainColor}20` }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Clock
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
            </div>
            <span>Lanjutkan Percakapan</span>
          </Button>

          <Button
            variant="outline"
            className="h-14 justify-start gap-4 rounded-xl border-2 hover:shadow-md transition-all"
            style={{ borderColor: `${mainColor}20` }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Sparkles
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
            </div>
            <span>Eksplorasi Materi</span>
          </Button>
        </div>

        {/* Suggested Topics */}
        <div className="max-w-2xl mx-auto mb-12">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Topik Populer
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {placeholders.slice(0, 6).map((topic) => (
              <button
                key={topic}
                onClick={() => setNewChatInput(topic)}
                className="px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all hover:shadow-md"
                style={{
                  borderColor: `${mainColor}20`,
                  backgroundColor: `${mainColor}05`,
                  color: mainColor,
                }}
              >
                {topic.length > 30 ? topic.slice(0, 30) + '...' : topic}
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
          <h3 className="text-xl font-bold mb-4">Powered by Advanced AI</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-90">Siap Membantu</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">∞</div>
              <div className="text-sm opacity-90">Topik Pembelajaran</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">🚀</div>
              <div className="text-sm opacity-90">Respons Cepat</div>
            </div>
          </div>
        </div>

        {/* Chat History Dialog */}
        <Dialog
          open={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-hidden">
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
                      className="flex items-center justify-between p-4 rounded-xl border-2 hover:shadow-md transition-all cursor-pointer"
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
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${mainColor}15` }}
                        >
                          <MessageSquare
                            className="w-5 h-5"
                            style={{ color: mainColor }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {chat.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {getDateString(chat.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 text-muted-foreground hover:text-red-600"
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
                  <div className="text-center py-8 text-muted-foreground">
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
