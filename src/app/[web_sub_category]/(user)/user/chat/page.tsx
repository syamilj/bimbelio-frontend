'use client';

import { useSession } from '@/components/provider/session-provider-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { deleteGeneral, getGeneral, mutateGeneral } from '@/lib/fetch-helper';
import { getDateString } from '@/lib/utils';
import { ChatHistory } from '@/types/database';
import {
  AwardIcon,
  BarChartIcon,
  BotIcon,
  ClockIcon,
  GraduationCapIcon,
  Loader2,
  MessageSquareIcon,
  Plus,
  Trash2,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; // Added ReactElement import

export default function AIChatHistoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newChatInput, setNewChatInput] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mutation untuk membuat chat baru
  // const { mutateAsync: createNewChat } = api.chat.createNewChat.useMutation({
  //   onError(error) {
  //     toaster({
  //       title: "Error",
  //       condition: "warning",
  //       description: error.message || "Gagal membuat chat baru",
  //       duration: 3000,
  //     });
  //     setLoading(false);
  //   },
  // });

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

  // Mutation untuk menghapus chat
  // const { mutateAsync: deleteChat, isPending: isLoadingDeleteChat } =
  //   api.chat.deleteChat.useMutation({
  //     onSuccess() {
  //       refetch();
  //       toaster({
  //         title: "Success",
  //         condition: "success",
  //         description: "Berhasil menghapus chat",
  //         duration: 3000,
  //       });
  //       setLoading(false);
  //     },
  //     onError(error) {
  //       toaster({
  //         title: "Error",
  //         condition: "warning",
  //         description: error.message || "Gagal menghapus chat",
  //         duration: 3000,
  //       });
  //       setLoading(false);
  //     },
  //   });

  const [isLoadingDeleteChat, setIsLoadingDeleteChat] = useState<boolean>(true);

  const deleteChat = async ({ id }: { id: string }) => {
    let sendData: any = null;
    await deleteGeneral(`/chat/deleteChat?id=${id}`, {
      setLoading: setIsLoadingDeleteChat,
      toast: {
        errorMsg: 'Gagal menghapus chat',
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

  // Query untuk mengambil riwayat chat dan dokumen
  // const {
  //   data: chatHistory,
  //   isLoading: isLoadingHistory,
  //   refetch,
  // } = api.chat.getAllHistoryByUserId.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  // });

  // const { data: documents, isLoading: isLoadingDocument } =
  //   api.chat.getAllDocument.useQuery(undefined, {
  //     refetchOnWindowFocus: false,
  //   });

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  const refetch = async () => {
    await getGeneral(`/chat/getAllHistoryByUserId?userId=${session?.user.id}`, {
      setData: setChatHistory,
      setLoading: setIsLoadingHistory,
    });
  };

  useEffect(() => {
    refetch();
  }, [session]);

  const features = [
    {
      icon: ZapIcon,
      title: 'Akses Instan',
      description: 'Dapatkan jawaban dan pengetahuan seketika',
    },
    {
      icon: ClockIcon,
      title: '24/7 Siap Membantu',
      description: 'Belajar kapan saja tanpa batas waktu',
    },
    {
      icon: UsersIcon,
      title: 'Pendekatan Personal',
      description: 'Pengetahuan disesuaikan dengan kebutuhan',
    },
    {
      icon: GraduationCapIcon,
      title: 'Materi Berkualitas',
      description: 'Konten pembelajaran dari pakar terkemuka',
    },
    {
      icon: AwardIcon,
      title: 'Sertifikasi',
      description: 'Dapatkan sertifikat untuk setiap pencapaian',
    },
    {
      icon: BarChartIcon,
      title: 'Analisis Kemajuan',
      description: 'Pantau perkembangan belajar secara real-time',
    },
  ];

  const handleNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (newChatInput.trim()) {
      const res = await createNewChat({ title: newChatInput.slice(0, 20) });
      router.push(`/${website_sub_category_id}/user/chat/${res.id}?new=${newChatInput}`);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {loading && (
        <div className="fixed bg-white/80 top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="flex items-center gap-2 flex-col text-main">
            <Loader2 className="animate-spin h-4 w-4" />
            <p>Membuat Chat Baru</p>
          </div>
        </div>
      )}
      <main className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="bg-main text-white rounded-full p-6 mb-6 w-24 h-24 flex items-center justify-center">
            <BotIcon className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tutor AI</h1>
          <h2 className="text-sm text-gray-600 mb-4">Powered by OpenAI</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Apa yang ingin Kamu pelajari hari ini? Bimbelio siap membantu.
          </p>

          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="w-full py-5 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsDialogOpen(true)}
              >
                <ClockIcon className="mr-2 h-4 w-4" />
                Lanjutkan Belajar
              </Button>
              {/* <Button
                variant="outline"
                className="w-full py-5 text-gray-700 hover:bg-gray-50"
                onClick={startDocumentConversation}
              >
                <FileTextIcon className="mr-2 h-4 w-4" />
                Eksplorasi Dokumen
              </Button> */}
            </div>

            {/* New Topic Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Topik baru yang ingin dipelajari"
                value={newChatInput}
                onChange={(e) => setNewChatInput(e.target.value)}
                className="flex-grow"
              />
              <Button
                onClick={handleNewChat}
                className="bg-main hover:bg-main/50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Mulai Baru
              </Button>
            </div>
          </div>

          {/* Popular Documents */}
          {/* <div className="mt-12 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Dokumen Populer
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {isLoadingDocument
                ? Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-32" />
                  ))
                : documents?.slice(0, 8).map((doc) => (
                    <Badge
                      key={doc.id}
                      variant="secondary"
                      className="py-2 px-4 bg-blue-50 text-[#2563EB] hover:bg-blue-100 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/user/workspace/${doc.categoryId}/${doc.id}?tab=chat`
                        )
                      }
                    >
                      {doc.title}
                    </Badge>
                  ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="text-gray-700 hover:bg-gray-50"
                onClick={startDocumentConversation}
              >
                Lainnya
              </Button>
            </div>
          </div> */}

          {/* Features */}
          <div className="mt-16 w-full">
            <h3 className="text-2xl font-bold mb-12 text-center">
              Keunggulan Bimbelio
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 border rounded-xl bg-white"
                >
                  <div className="text-main mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          {/* <div className="mt-16 w-full bg-[#2563EB] rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-8 text-center">
              Bimbelio dalam Angka
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center">
                <MessageSquareIcon className="h-8 w-8 mb-2" />
                <p className="text-3xl font-bold mb-1">1,000,000+</p>
                <p className="text-sm">Total Pertanyaan Diajukan</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <User2Icon className="h-8 w-8 mb-2" />
                <p className="text-3xl font-bold mb-1">100,000+</p>
                <p className="text-sm">Total Pengguna</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Dialog untuk Riwayat Chat */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px] mx-auto w-[90%]">
            <DialogHeader>
              <DialogTitle>Percakapan Sebelumnya</DialogTitle>
              <DialogDescription>
                Pilih percakapan yang ingin dilanjutkan
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {isLoadingHistory
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-[72px] w-full"
                      />
                    ))
                  : chatHistory?.map((chat) => (
                      <div
                        key={chat.id}
                        className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 transition-colors"
                      >
                        <button
                          onClick={() => {
                            router.push(`/${website_sub_category_id}/user/chat/${chat.id}`);
                            setIsDialogOpen(false);
                          }}
                          className="flex items-start flex-1 text-left"
                        >
                          <div className="flex-shrink-0 mr-4">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-50 border">
                                <MessageSquareIcon className="h-5 w-5 text-[#2563EB]" />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {chat.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {getDateString(chat.updatedAt)}
                            </p>
                          </div>
                        </button>
                        <ModalDelete
                          onDelete={async () => {
                            deleteChat({ id: chat.id });
                          }}
                          isDeleting={isLoadingDeleteChat}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </ModalDelete>
                      </div>
                    ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

const ModalDelete = ({
  children,
  onDelete,
  isDeleting,
}: {
  children: React.ReactNode;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Chat</DialogTitle>
          <DialogDescription>
            Apakah kamu yakin ingin menghapus chat ini?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await onDelete();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
