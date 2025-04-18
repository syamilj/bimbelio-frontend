"use client";

import { useChatContext } from "@/app/(user)/user/chat/[historyId]/provider";
import { useSession } from "@/components/provider/session-provider-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toaster } from "@/components/ui/toaster";
import { getGeneral, mutateGeneral } from "@/lib/fetch-helper";
import { cn, getDateStringShort, getHours } from "@/lib/utils";
import { ChatHistory } from "@/types/database";
import "katex/dist/katex.min.css";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Loader2,
  MessageCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SidebarChat() {
  const { data: session } = useSession();
  const params = useParams();
  const historyId = params?.historyId;
  const router = useRouter();
  const pathname = usePathname();
  // const { data: chatHistory } = api.chat.getAllHistoryByUserId.useQuery(
  //   undefined,
  //   {
  //     refetchOnWindowFocus: false,
  //   }
  // );

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  useEffect(() => {
    getGeneral(`/chat/getAllHistoryByUserId?userId=${session?.user.id}`, {
      setData: setChatHistory,
    });
  }, [session]);

  const [loading, setLoading] = useState(false);
  const [newChatInput, setNewChatInput] = useState("");
  const { isMinimized, setIsMinimized } = useChatContext();

  const [chatStates, setChatStates] = useState<{ [key: string]: boolean }>({});

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
    await mutateGeneral("/chat/createNewChat", {
      payload: {
        ...payload,
        userId: session?.user.id,
      },
      type: "post",
      toast: {
        errorMsg: "Gagal membuat chat baru",
      },
      onError() {
        setLoading(false);
      },
      onSuccess({ message, status, data }) {
        sendData = data;
      },
    });
    return sendData;
  };

  // const { mutate: editChat } = api.chat.editChat.useMutation({
  //   onSuccess() {
  //     toaster({
  //       title: "Success",
  //       condition: "success",
  //       description: "Berhasil mengedit title chat",
  //       duration: 3000,
  //     });
  //   },
  //   onError(error) {
  //     toaster({
  //       title: "Error",
  //       condition: "warning",
  //       description: error.message || "Gagal mengedit title chat",
  //       duration: 3000,
  //     });
  //   },
  // });

  const editChat = async (payload: { id: String; title: string }) => {
    await mutateGeneral("/chat/editChat", {
      payload,
      type: "post",
      toast: {
        errorMsg: "Gagal mengedit title chat",
        successMsg: "Berhasil mengedit title chat",
      },
      onError() {
        setLoading(false);
      },
    });
  };

  const handleNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (newChatInput.trim()) {
      const res = await createNewChat({ title: newChatInput });
      router.push(`/user/chat/${res.id}`);
    } else {
      setLoading(false);
    }
  };

  const handleEditChat = useDebouncedCallback(
    ({ title }: { title: string }) => {
      if (historyId && typeof historyId === "string") {
        editChat({ id: historyId, title });
      }
    },
    500
  );

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  return (
    <>
      <div
        className={cn(
          "w-64 h-auto border-r bg-white absolute left-0 md:left-0 top-[-80px] md:top-0 bottom-0 z-[9999] md:z-[1] md:relative md:block duration-300",
          isMinimized && "-left-72"
        )}
      >
        <div className="p-3 border-b flex justify-between items-center">
          <h2 className="font-semibold">Riwayat</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMinimize}
            className="shrink-0 md:hidden"
          >
            {isMinimized ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <ScrollArea className="px-3 py-4">
          <div className="space-y-2">
            {chatHistory?.map((chat, index) => {
              const showEdit = chatStates[chat.id] || false;
              return (
                <div
                  key={chat.id}
                  className="w-full relative"
                  onMouseOver={() =>
                    setChatStates((prev) => ({
                      ...prev,
                      [chat.id]: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setChatStates((prev) => ({
                      ...prev,
                      [chat.id]: false,
                    }))
                  }
                >
                  <Link href={`/user/chat/${chat.id}`}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left px-3 py-4 h-auto ${
                        pathname?.includes(chat.id)
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-4 w-4 mt-1 flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <input
                            id={`chat-history-${index}`}
                            className={cn(
                              "text-sm font-medium line-clamp-2 bg-transparent w-full focus:text-black",
                              showEdit && "cursor-pointer"
                            )}
                            disabled={!showEdit}
                            defaultValue={chat.title}
                            onChange={(e) => {
                              handleEditChat({ title: e.target.value });
                            }}
                          />
                          <div className="flex items-center text-xs text-muted-foreground cur">
                            <Clock className="h-3 w-3 mr-1" />
                            {getDateStringShort(chat.updatedAt)}{" "}
                            {getHours(chat.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                  {showEdit && (
                    <Edit
                      className="absolute right-2 top-2 w-6 h-6 md:hover:bg-gray-300 bg-white p-1 rounded-lg cursor-pointer"
                      onClick={() => {
                        const input = document.getElementById(
                          `chat-history-${index}`
                        );
                        if (input) {
                          input.focus();
                        }
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="p-3 border-t bg-background absolute bottom-0 left-0 w-full">
          <form onSubmit={handleNewChat} className="flex gap-2">
            <Input
              type="text"
              placeholder="Mulai chat baru..."
              value={newChatInput}
              onChange={(e) => setNewChatInput(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              className="shrink-0 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </div>
        {loading && (
          <div className="absolute bg-white/80 top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="flex items-center gap-2 flex-col text-main">
              <Loader2 className="animate-spin h-4 w-4" />
              <p>Membuat Chat Baru</p>
            </div>
          </div>
        )}
      </div>
      {!isMinimized && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-white/10 backdrop-blur-[5px] z-[9998] md:hidden"
          onClick={toggleMinimize}
        />
      )}
    </>
  );
}
