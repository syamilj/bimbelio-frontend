/* eslint-disable @typescript-eslint/no-unused-vars */
// index.tsx
import { useAppContext } from "@/components/provider/provider-app";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { SpinnerCentered } from "@/components/ui/spinner";
import { toaster } from "@/components/ui/toaster";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { env } from "@/env.mjs";
// import { useChatStore } from "@/lib/store";
import { cn, getDate, getHours } from "@/lib/utils";
import { IconTailedArrowNext } from "@/styles/icon";
import { Document, User, UserDocument, UserRoleEnum } from "@/types/database";
import { useChat } from "ai/react";
import "katex/dist/katex.min.css";
import { BotMessageSquareIcon, Loader2, User2Icon } from "lucide-react";

import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import ChatTools from "./_component/chat-tools";
import LoadingChat from "./_component/loading-chat";
import Start from "./_component/start";
import SubmitChat from "./_component/submit-chat";
import SubmitChatEdit from "./_component/submit-chat-edit";
import ThreeQuestions from "./_component/three-questions";
import { useSession } from "@/components/provider/session-provider-auth";
import { getGeneral } from "@/lib/fetch-helper";

interface Props {
  apiChat: string;
  body: object;
  fetchMessages: () => Promise<any>;
  messages: {
    prevChatMessages:
      | {
          id: any;
          content: any;
          role: string;
          createdAt: any;
          like: any;
          dislike: any;
        }[]
      | undefined;
    isLoadingPrevMessage: boolean;
  };
  vectorize?: {
    isVectorising: boolean;
    vectoriseDocMutation: ({ documentId }: { documentId: string }) => void;
  };
  userDoc?: {
    userDocData:
      | (UserDocument & {
          user: User;
          document: Document;
        })
      | null
      | undefined;
    isUserDocLoading: boolean;
  };
  onClickPageNumber?: () => void;
}

export default function Chat({
  body,
  apiChat,
  fetchMessages,
  messages: { prevChatMessages, isLoadingPrevMessage },
  vectorize,
  userDoc,
  onClickPageNumber,
}: Props) {
  const isVectorising = vectorize?.isVectorising;
  const vectoriseDocMutation = vectorize?.vectoriseDocMutation;

  const userDocData = userDoc?.userDocData;
  const isUserDocLoading = userDoc?.isUserDocLoading;

  const { data: session } = useSession();
  const pathname = usePathname();
  const pathnameArray = pathname?.split("/");
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];
  const userId = session?.user?.id;

  // const trpc = api.useUtils();

  const { imageMessageLoading, messageData, setMessageData, scrollToPdfPage } =
    useAppContext();

  const [showUpgrade, setShowUpgrade] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState<any>({
    bool: false,
    index: 99999,
    value: "111",
  });
  const [tempData, setTempData] = useState<any>([
    {
      id: "id",
      content:
        "Selamat datang di **TutorSNBT**! Saya siap membantu Kamu. Jangan ragu untuk bertanya atau berdiskusi tentang SNBT/UTBK. Mari kita maksimalkan pembelajaran Kamu!",
      role: "assistant",
      createAt: null,
      like: false,
      dislike: false,
    },
  ]);
  const [firstMessage, setFirstMessage] = useState<boolean>(false);
  const [first, setFirst] = useState<boolean>(true);

  // const { data: limitaionUsed }: any = api.user.getCurrentLimitation.useQuery(
  //   undefined,
  //   { refetchOnWindowFocus: false }
  // );

  type LimitationUsedType = {
    user: {
      id: string;
      Role: UserRoleEnum;
    };
    chat: number;
    quiz: number;
    notes: number;
    vision: number;
    chatLimit: number;
    notesLimit: number;
    visionLimit: number;
    quizLimit: number;
  };
  const [limitaionUsed, setLimitaionUsed] = useState<
    (LimitationUsedType & { Limit: LimitationUsedType }) | null
  >();

  useEffect(() => {
    getGeneral(`/user/getCurrentLimitation?userId=${session?.user.id}`, {
      setData: setLimitaionUsed,
    });
  }, [session]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    append,
  } = useChat({
    api: apiChat,
    body,
    streamProtocol: "text",
    onError: (error: any) => {
      console.log("error", error);
      toaster({
        title: "Gagal",
        description: "Terjadi kesalahan2!",
        condition: "warning",
        duration: 3000,
      });
    },
    onFinish: () => {
      console.log("Finish1");
      setFirstMessage(false);
      // await trpc.message.getAllByDocIdAndUserId.refetch();
      fetchMessages();
    },
  });

  const {
    messages: messageEdit,
    input: edit,
    handleInputChange: editOnChange,
    handleSubmit: submitEdit,
    isLoading: isLoadingEditMessage,
  } = useChat({
    api: apiChat,
    body,
    streamProtocol: "text",
    onError: (error) => {
      toaster({
        title: "Gagal",
        description: error?.message ?? "Terjadi kesalahan!",
        condition: "warning",
        duration: 3000,
      });
    },
    onFinish: () => {
      console.log("Finish2");
      // await trpc.message.getAllByDocIdAndUserId.refetch();
      fetchMessages();
    },
  });

  // const { data: prevChatMessages, isLoading: isLoadingPrevMessage } =
  //   api.message.getAllByDocIdAndUserId.useQuery(
  //     {
  //       documentId: docId as string,
  //     },
  //     { refetchOnWindowFocus: false },
  //   );

  // const { mutate: vectoriseDocMutation, isPending: isVectorising } =
  //   api.document.vectorise.useMutation({
  //     onSettled: async () => {
  //       await trpc.document.getHistoryByUser.refetch();
  //       await trpc.document.getDocumentTotalPage.refetch();
  //     },
  //     onSuccess: () => {
  //       toaster({
  //         title: 'Sukses',
  //         description: 'Semangat belajarnya!',
  //         duration: 3000,
  //       });
  //       refetchUserDocData();
  //     },
  //     onError: (err: any) => {
  //       toaster({
  //         title: 'Gagal',
  //         description: err.message ?? 'Terjadi kesalahan!',
  //         condition: 'warning',
  //         duration: 3000,
  //       });
  //     },
  //   });

  // const {
  //   data: userDocData,
  //   isLoading: isUserDocLoading,
  //   refetch: refetchUserDocData,
  // } = api.document.getUserDocData.useQuery(
  //   {
  //     userId: userId!,
  //     documentId: docId as string,
  //   },
  //   { refetchOnWindowFocus: false },
  // );

  useEffect(() => {
    const input = document.getElementById("editInput");

    const handleInputChange = (e: any) => {
      setEditMessage((prev: any) => ({ ...prev, value: e.target.value }));
    };

    if (input) {
      input.addEventListener("input", handleInputChange);
    }

    return () => {
      if (input) {
        input.removeEventListener("input", handleInputChange);
      }
    };
  }, []);

  // const { setSendMessage } = useChatStore();
  // useEffect(() => {
  //   const sendMessage = (message: string) => {
  //     append({
  //       id: crypto.randomUUID(),
  //       content: message,
  //       role: 'user',
  //       createdAt: new Date(),
  //     });
  //   };
  //   setSendMessage(sendMessage);
  // }, []);

  useEffect(() => {
    if (edit.length > 0) {
      const submit = document.getElementById(
        "editMessage"
      ) as HTMLButtonElement;
      submit.click();
    }
  }, [edit]);

  useEffect(() => {
    if (prevChatMessages && prevChatMessages?.length > 0 && !firstMessage) {
      setTempData([
        {
          id: "id",
          content:
            "Selamat datang di **TutorSNBT**! Saya siap membantu Kamu. Jangan ragu untuk bertanya atau berdiskusi tentang SNBT/UTBK. Mari kita maksimalkan pembelajaran Kamu!",
          role: "assistant",
          createAt: null,
          like: false,
          dislike: false,
        },
        ...prevChatMessages,
      ]);
      setMessageData([
        {
          id: "id",
          content:
            "Selamat datang di **TutorSNBT**! Saya siap membantu Kamu. Jangan ragu untuk bertanya atau berdiskusi tentang SNBT/UTBK. Mari kita maksimalkan pembelajaran Kamu!",
          role: "assistant",
          createAt: null,
          like: false,
          dislike: false,
        },
        ...prevChatMessages,
      ]);
    }
  }, [prevChatMessages]);

  useEffect(() => {
    if (isLoading) {
      if (messages.length % 2 == 0) {
        const data = [...tempData, ...messages.slice(-2)];
        setMessageData(() => [...data]);
      }
      if (messages.length % 2 !== 0) {
        const data = [...tempData, ...messages.slice(-1)];
        setMessageData(() => [...data]);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isLoadingEditMessage) {
      if (messageEdit.length % 2 == 0) {
        const data = [...tempData, ...messageEdit.slice(-2)];
        setMessageData(() => [...data]);
      }
      if (messageEdit.length % 2 !== 0) {
        const data = [...tempData, ...messageEdit.slice(-1)];
        setMessageData(() => [...data]);
      }
    }
  }, [messageEdit]);

  // ======== Render Chat ========== //

  const [showButtonScroll, setShowButtonScroll] = useState<boolean>(true);

  const listRef = useRef<any>(null);
  const rowHeights: any = useRef({});

  const getRowHeight = (index: any) => {
    return rowHeights.current[index] + 16 || 82;
  };
  const setRowHeight = (index: any, size: any) => {
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  };
  const scrollToBottom = () => {
    listRef.current?.scrollToItem(messageData.length - 1, "end");
  };

  const handleScroll = ({ scrollOffset, scrollHeight, clientHeight }: any) => {
    const scrollPercentage =
      (scrollOffset / (scrollHeight - clientHeight)) * 100;
    if (scrollPercentage > 98) {
      setShowButtonScroll(false);
    } else {
      setShowButtonScroll(true);
    }
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const isBase64Image = messageData[index]?.content?.startsWith(
      env.NEXT_PUBLIC_SUPABASE_URL
    );

    // Scroll down when new messages come in
    useEffect(() => {
      if (isLoading || isLoadingEditMessage) {
        scrollToBottom();
        setTimeout(() => scrollToBottom(), 100);
      }
    }, [isLoading, isLoadingEditMessage]);

    // Scroll to bottom on first render
    useEffect(() => {
      if (first && listRef?.current) {
        scrollToBottom();
        setTimeout(() => {
          scrollToBottom();
          setShowButtonScroll(false);
        }, 100);
        setFirst(false);
      }
    }, [listRef]);

    // Update row height
    useEffect(() => {
      if (rowRef.current) {
        setRowHeight(index, rowRef.current.clientHeight);
      }
    }, [rowRef.current?.clientHeight]);

    // ========== Markdown Helpers =========== //
    const replaceLatexNotation = (content: string) => {
      return content
        .replace(/\\\[/g, "$$$") // Replace \[ -> $$
        .replace(/\\\]/g, "$$$") // Replace \] -> $$
        .replace(/\\\(/g, "$$$") // Replace \( -> $$
        .replace(/\\\)/g, "$$$"); // Replace \) -> $$
    };

    const formatMessage = (content: string) => {
      // Hanya contoh: Memastikan <PAGE#(x)>
      return content.replace(
        /<PAGE#(\d+)>/g,
        (_match, pageNum) => `<PAGE#${pageNum}>`
      );
    };

    const remarkMathOptions = {
      singleDollarTextMath: false,
    };

    // Tag <PAGE#x> => tombol scroll PDF
    const processPageTags = (content: React.ReactNode): React.ReactNode => {
      if (typeof content !== "string") {
        // Rekursif ke child
        return React.Children.map(content, (child) =>
          typeof child === "string" ? processPageTags(child) : child
        );
      }

      const parts = content.split(/(<PAGE#\d+>)/g);
      return parts.map((part, idx) => {
        if (part.match(/<PAGE#\d+>/)) {
          const pageNum = part.match(/\d+/)?.[0] ?? "";
          return (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="mx-0.5 px-1.5 py-0.5 h-5 rounded-full text-[10px] align-super font-semibold bg-blue-100 hover:bg-blue-200 border-blue-200"
                    onClick={() => {
                      scrollToPdfPage(parseInt(pageNum, 10));
                      if (onClickPageNumber) {
                        onClickPageNumber();
                      }
                    }}
                  >
                    {pageNum}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="rounded-full h-8 w-full text-white font-medium bg-main font-center flex justify-center items-center">
                  <p>Scroll ke Hal. {pageNum}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        return part;
      });
    };

    const isAssistant = messageData[index].role === "assistant";
    const isUser = messageData[index].role === "user";
    // ========== Row JSX =========== //
    const isAlignedLeft =
      index === messageData.length - 1 && isLoading && isUser;

    return (
      <div
        style={{
          ...style,
          overflow: "hidden",
          paddingRight: "1rem",
          paddingBottom: "1rem",
          paddingTop: "1rem",
        }}
      >
        <div
          ref={rowRef}
          className={cn("text-left flex flex-col w-full", "max-w-[95%]")}
        >
          {/* Jika loading dan index terakhir adalah user, maka tampilkan <LoadingChat/> */}

          <Card
            className={cn(
              "rounded-xl shadow-none bg-transparent",
              isUser ? "bg-white ml-auto" : "mr-auto"
            )}
          >
            <div className="p-4">
              <div
                className={cn(
                  "flex items-start gap-2",
                  isUser && "justify-start flex-row-reverse"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className={cn(
                      isUser ? "bg-green-50 border" : "bg-blue-50 border"
                    )}
                  >
                    {isUser ? (
                      <User2Icon className="h-5 w-5 text-gray-300" />
                    ) : (
                      <BotMessageSquareIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "flex flex-col flex-1",
                    isUser && "flex-none text-end"
                  )}
                >
                  <div className="relative justify-between items-center mb-2">
                    <p className="font-semibold text-sm">
                      {isUser ? session?.user?.name : "TutorSNBT"}
                    </p>
                    {!isUser && (
                      <span className="absolute -top-2 left-[-20px] bg-red-500 rounded-full px-[0.35rem] py-1 text-white font-bold text-[0.5rem]">
                        AI
                      </span>
                    )}
                    {messageData[index].createdAt && (
                      <p className="text-xs text-muted-foreground">
                        {getHours(messageData[index].createdAt)} |{" "}
                        {getDate(messageData[index].createdAt)}
                      </p>
                    )}
                  </div>

                  {/* {index === messageData.length - 1 &&
                      isLoading &&
                      messageData[index].role === 'user' && <LoadingChat />} */}
                  {isBase64Image ? (
                    <div>
                      {imageMessageLoading.value &&
                      imageMessageLoading.index === index ? (
                        <div className="min-h-[200px] w-fit min-w-[300px] rounded-lg bg-muted animate-pulse" />
                      ) : (
                        messageData[index].content && (
                          <div className="w-fit rounded-lg overflow-hidden">
                            <Image
                              src={
                                messageData[index].content.includes(
                                  "data:image/png;base64"
                                )
                                  ? messageData[index].content.split("=")[0] ||
                                    "/placeholder.svg"
                                  : messageData[index].content ||
                                    "/placeholder.svg"
                              }
                              className="h-auto max-w-full"
                              alt="TutorSNBT - Bimbel AI"
                              width={500}
                              height={300}
                            />
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <>
                      {editMessage.index !== index ? (
                        <ReactMarkdown
                          remarkPlugins={[
                            [remarkMath, remarkMathOptions],
                            remarkGfm,
                          ]}
                          rehypePlugins={[rehypeKatex]}
                          className="prose max-w-none break-words ReactMarkdown"
                          components={{
                            p: ({ node, children, ...props }) => {
                              const hasBlockChild = React.Children.toArray(
                                children
                              ).some(
                                (child: any) =>
                                  typeof child !== "string" &&
                                  [
                                    "h1",
                                    "h2",
                                    "h3",
                                    "h4",
                                    "h5",
                                    "h6",
                                    "ul",
                                    "ol",
                                    "li",
                                    "blockquote",
                                    "div",
                                  ].includes(child?.type)
                              );

                              if (hasBlockChild) {
                                return (
                                  <div {...props}>
                                    {processPageTags(children)}
                                  </div>
                                );
                              }
                              return (
                                <p {...props}>{processPageTags(children)}</p>
                              );
                            },
                            h1: ({ children, ...props }) => (
                              <h1 {...props}>{processPageTags(children)}</h1>
                            ),
                            h2: ({ children, ...props }) => (
                              <h2 {...props}>{processPageTags(children)}</h2>
                            ),
                            h3: ({ children, ...props }) => (
                              <h3 {...props}>{processPageTags(children)}</h3>
                            ),
                            h4: ({ children, ...props }) => (
                              <h4 {...props}>{processPageTags(children)}</h4>
                            ),
                            h5: ({ children, ...props }) => (
                              <h5 {...props}>{processPageTags(children)}</h5>
                            ),
                            h6: ({ children, ...props }) => (
                              <h6 {...props}>{processPageTags(children)}</h6>
                            ),
                            li: ({ children, ...props }) => (
                              <li {...props}>{processPageTags(children)}</li>
                            ),
                            strong: ({ children, ...props }) => (
                              <strong {...props}>
                                {processPageTags(children)}
                              </strong>
                            ),
                            em: ({ children, ...props }) => (
                              <em {...props}>{processPageTags(children)}</em>
                            ),
                          }}
                        >
                          {formatMessage(
                            replaceLatexNotation(messageData[index].content)
                          )}
                        </ReactMarkdown>
                      ) : (
                        <SubmitChatEdit
                          editMessage={editMessage}
                          setEditMessage={setEditMessage}
                          setTempData={setTempData}
                          editOnChange={editOnChange}
                          docId={``}
                        />
                      )}
                    </>
                  )}

                  {!editMessage.bool && (
                    <div
                      className={cn(
                        "mt-4 flex justify-between items-center text-sm text-muted-foreground",
                        isUser && "justify-end"
                      )}
                    >
                      <ChatTools
                        role={messageData[index].role}
                        data={messageData[index]}
                        index={index}
                        setEdit={setEditMessage}
                        submitRegenerate={submitEdit}
                        onChangeRegenerate={editOnChange}
                        setTempData={setTempData}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
          {index === messageData.length - 1 &&
            isLoading &&
            messageData[index].role === "user" && <LoadingChat />}
          {index === messageData.length - 1 &&
            isLoadingEditMessage &&
            messageData[index].role === "user" && <LoadingChat />}
        </div>
      </div>
    );
  };

  // ======== End- Render Chat ========== //
  useEffect(() => {
    if (isLoading) {
      console.log("messageData", messageData);
    }
  }, [messageData, isLoading]);
  if (isUserDocLoading) {
    return <SpinnerCentered />;
  }

  const isVectorised = userDocData?.isVectorised || false;

  if (!isVectorised && userDoc) {
    return (
      <Start
        isLoading={isVectorising || false}
        onClick={() => {
          if (!vectoriseDocMutation) return;
          vectoriseDocMutation({ documentId: docId as string });
        }}
      />
    );
  }

  if (isLoadingPrevMessage) {
    <div className="flex justify-center items-center h-full w-full">
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>;
  }

  return (
    <div className="absolute left-0 top-0 flex h-full w-full flex-col gap-2 overflow-hidden md:relative md:left-[unset] md:top-[unset]">
      <form
        className="absolute z-[100] w-0 overflow-hidden p-0 text-black"
        onSubmit={(e) => {
          submitEdit(e);
        }}
      >
        <input type="text" value={edit} onChange={() => {}} />
        <button id="editMessage">submit</button>
      </form>

      <div
        id="chatAI"
        className="mt-[calc(60px+5px)] flex flex-1 flex-col gap-[3rem] overflow-hidden px-[1rem] pb-[1rem] md:mt-[unset]"
      >
        {messageData?.length !== 0 ? (
          <div className="absolute left-0 top-0 h-full w-full pb-[1rem] pl-[1rem]">
            {showButtonScroll && (
              <div
                id="scrollBottom"
                className="absolute bottom-[90px] right-4 z-[100] cursor-pointer duration-200 md:hover:scale-105"
                onClick={() => {
                  scrollToBottom();
                  setShowButtonScroll(false);
                }}
              >
                <IconTailedArrowNext
                  w={25}
                  className="rotate-90 rounded-[.5rem] bg-main p-[.3rem] text-white"
                />
              </div>
            )}
            <AutoSizer>
              {({ height, width }) => (
                <List
                  className="List messageContainer relative"
                  height={height - 74}
                  itemCount={messageData.length}
                  itemSize={getRowHeight}
                  ref={listRef}
                  width={width}
                  onScroll={({
                    scrollDirection,
                    scrollOffset,
                    scrollUpdateWasRequested,
                  }) => {
                    if (listRef.current && !scrollUpdateWasRequested) {
                      const scrollHeight =
                        listRef.current._outerRef.scrollHeight;
                      const clientHeight =
                        listRef.current._outerRef.clientHeight;
                      handleScroll({
                        scrollOffset,
                        scrollHeight,
                        clientHeight,
                      });
                    }
                  }}
                >
                  {Row}
                </List>
              )}
            </AutoSizer>
          </div>
        ) : messageData?.length === 0 && prevChatMessages?.length === 0 ? (
          <ThreeQuestions
            session={session}
            handleInputChange={handleInputChange}
            setFirstMessage={setFirstMessage}
          />
        ) : null}
      </div>
      <SubmitChat
        prevChatMessages={prevChatMessages}
        handleInputChange={handleInputChange}
        setFirstMessage={setFirstMessage}
        limitaionUsed={limitaionUsed}
        isLoading={isLoading}
        setShowUpgrade={setShowUpgrade}
        showUpgrade={showUpgrade}
        handleSubmit={handleSubmit}
        input={input}
      />
    </div>
  );
}
