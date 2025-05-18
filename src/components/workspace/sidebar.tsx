import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomTooltip, ToolTip } from '@/components/ui/tooltip';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/components/provider/provider-app';
import { toaster } from '@/components/ui/toaster';
import { deleteGeneral, getGeneral, mutateGeneral } from '@/lib/fetch-helper';
import {
  IconFullscreen,
  IconMinimizeScreen,
  IconRegenerateMessage,
  IconTabsChat,
  IconTabsNotes,
  IconTabsQuiz,
  IconWarning,
} from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import { Document, User, UserDocument } from '@/types/database';
import { useMedia } from 'use-media';
import ReportBug from '../_shared/other/report-bug';
import { useSession } from '../provider/session-provider-auth';
import OnBoarding from './_component/onboarding';
import Chat from './chat';
import { MessageDataType } from './chat/provider';
// import Editor from './editor';
// import Quiz from './quiz';
// import Editor from './editor';

const TABS = [
  {
    value: 'notes',
    title: 'Notes',
    tooltip: 'Take notes',
    icon: <IconTabsNotes w={18} />,
    isNew: false,
  },
  {
    value: 'chat',
    title: 'Chat AI',
    tooltip: 'Chat with the document',
    icon: <IconTabsChat w={18} />,
    isNew: false,
  },
  {
    value: 'quiz',
    title: 'Quiz',
    tooltip: 'Generate Quiz with the document',
    icon: <IconTabsQuiz w={18} />,
    isNew: false,
  },
];

const tabNames = TABS.map((tab) => tab.value);

const Sidebar = ({
  canEdit,
  userId,
  docId: initialDocId,
}: {
  canEdit: boolean;
  userId: string;
  docId: string;
}) => {
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];
  const { data: session } = useSession();

  // const { query, push, asPath } = useRouter();
  // const { query, push, asPath } = useRouter();
  // const tab = query.tab as string;
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');
  // const docId = searchParams?.get('docId');
  const [headerTab, setHeaderTab] = useState<string>(tab ? tab : '');
  const [documentId, setDocumentId] = useState(initialDocId || docId || '');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isReportBugOpen, setIsReportBugOpen] = useState(false);

  // const resetChat = api.message.resetMessage.useMutation({
  //   onSettled: async () => {},
  //   onMutate() {},
  // });

  const resetChat = async () => {
    deleteGeneral('/message/resetMessage', {
      params: { docId, userId: session?.user.id },
    });
  };

  // const getNameImage = api.message.getNameImage.useMutation({
  //   onSettled: async () => {},
  //   onMutate() {},
  // });

  const getNameImage = async () => {
    const res = await getGeneral('/message/getNameImage');
    return res?.data;
  };

  const router = useRouter();

  const {
    setMobileScreen,
    mobileScreen,
    onBoarding,
    setOnBoarding,
    setShowSidebar,
  } = useAppContext();

  const isMobile = useMedia({ maxWidth: '768px' });
  const [activeIndex, setActiveIndex] = useState(
    tab && tabNames.includes(tab) ? tab : 'notes',
  );

  console.log('onBoarding', onBoarding);

  // const deleteQuiz = api.quiz.deleteQuiz.useMutation();

  const deleteQuiz = async () => {
    deleteGeneral('/quiz/deleteQuiz');
  };

  useEffect(() => {
    if (tab && tabNames.includes(tab)) {
      setActiveIndex(tab);
    }
  }, [tab]);

  const handleResetConfirmation = async () => {
    setIsResetModalOpen(false);
    await handleResetChat();
  };

  // useEffect(() => {
  //   const parts = asPath.split('/');
  //   const documentIndex = parts.findIndex((part) => part === 'document');
  //   if (documentIndex !== -1 && documentIndex + 1 < parts.length) {
  //     const nextSegment = parts[documentIndex + 1].split('?')[0];
  //     setDocumentId(nextSegment);
  //   }
  // }, [asPath, tab]);

  useEffect(() => {
    if (docId) {
      setDocumentId(docId);
    }
  }, [docId]);

  useEffect(() => {
    const getOnboarding = localStorage.getItem('on-boarding');
    const onBoarding = {
      chat: true,
      notes: true,
      quiz: true,
      tryout: true,
    };
    if (!getOnboarding) {
      localStorage.setItem('on-boarding', JSON.stringify(onBoarding));
    } else {
      const data = JSON.parse(getOnboarding);
      const isValid =
        data &&
        typeof data.chat === 'boolean' &&
        typeof data.notes === 'boolean' &&
        typeof data.quiz === 'boolean' &&
        typeof data.tryout === 'boolean';
      if (isValid) {
        setOnBoarding({ ...data });
      }
    }
    console.log('getOnboarding', getOnboarding);
  }, []);

  // useEffect(() => {
  //   const isValid = onBoarding && typeof onBoarding.chat === "boolean" && typeof onBoarding.notes === "boolean" && typeof onBoarding.quiz === "boolean";
  //   if (isValid) {
  //     localStorage.setItem("on-boarding", JSON.stringify(onBoarding))
  //   }
  // }, [onBoarding])

  const handleResetChat = async () => {
    try {
      const res = await getNameImage();
      if (res.length > 0) {
        const { data, error } = await supabase.storage
          .from('img')
          .remove([...res]);

        if (data) {
          await resetChat();
          router.refresh();
        }
        if (error) {
          console.log('errror', error);
          toaster({
            title: 'Upss',
            description: 'Gagal hapus pesan, coba lagi!',
            condition: 'warning',
            duration: 2000,
          });
          return;
        }
      } else {
        await resetChat();
        router.refresh();
      }
    } catch (error) {
      error;
    }
  };

  return (
    <div className="absolute left-0 top-0 h-full w-full bg-bg-workspace md:relative">
      {tab === 'chat' ? (
        <OnBoarding
          open={onBoarding.chat}
          type="chat"
        />
      ) : tab === 'notes' ? (
        <OnBoarding
          open={onBoarding.notes}
          type="notes"
        />
      ) : tab === 'quiz' ? (
        <OnBoarding
          open={onBoarding.quiz}
          type="quiz"
        />
      ) : null}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex w-[380px] flex-col items-center rounded-[1.5rem] bg-white p-[2rem] text-center shadow-lg">
            <div className="flex flex-col gap-[1rem]">
              {tab === 'chat' ? (
                <p>
                  Seluruh chat dalam material{' '}
                  <span className="font-semibold">[nama material]</span> akan
                  dihapus.
                </p>
              ) : tab === 'quiz' ? (
                <p> Quiz ini akan dihapus.</p>
              ) : null}
              <p className="font-medium text-main-red">
                Apa kamu yakin ingin melanjutkan?
              </p>
            </div>
            <div className="mt-4 flex gap-4">
              <button
                className="w-[156px] rounded-[.7rem] bg-red-100 py-2 text-[.85rem] font-medium text-main-red duration-200 hover:bg-red-200"
                onClick={async () => {
                  if (tab === 'chat') {
                    handleResetConfirmation();
                  } else if (tab === 'quiz') {
                    await deleteQuiz();
                    window.location.reload();
                  }
                }}
              >
                {tab === 'chat'
                  ? 'Hapus Chat'
                  : tab === 'quiz'
                    ? 'Hapus Quiz'
                    : null}
              </button>
              <button
                className="w-[156px] rounded-[.7rem] py-2 text-[.85rem] font-medium text-main-gray-text duration-200 md:hover:text-main-gray-text2"
                onClick={() => {
                  setIsResetModalOpen(false);
                  setShowSidebar(true);
                }}
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
      <ReportBug
        setIsReportBugOpen={setIsReportBugOpen}
        isReportBugOpen={isReportBugOpen}
      />
      <Tabs
        value={activeIndex}
        onValueChange={(value) => {
          setActiveIndex(value);
          router.push(`${window.location.pathname}?tab=${value}`);
          // push(
          //   {
          //     query: {
          //       ...query,
          //       tab: value,
          //     },
          //   },
          //   undefined,
          //   { shallow: true },
          // );
        }}
        defaultValue="notes"
        className="max-h-screen max-w-full overflow-hidden"
      >
        <div className="relative z-[8] flex h-[60px] items-center justify-between border-b border-main-gray-input bg-bg-workspace px-[1rem]">
          <TabsList className="h-full rounded-xl bg-transparent">
            {TABS.map((item) => (
              <div
                className="relative"
                key={item.value}
                onClick={() => {
                  setHeaderTab(item.value);
                }}
              >
                {onBoarding.notes && item.value === 'notes' ? (
                  <div className="absolute right-3 top-1 z-[10] h-2 w-2 rounded-[50%] bg-red-700" />
                ) : onBoarding.chat && item.value === 'chat' ? (
                  <div className="absolute right-3 top-1 z-[10] h-2 w-2 rounded-[50%] bg-red-700" />
                ) : onBoarding.quiz && item.value === 'quiz' ? (
                  <div className="absolute right-3 top-1 z-[10] h-2 w-2 rounded-[50%] bg-red-700" />
                ) : null}
                <CustomTooltip content={item.tooltip}>
                  <TabsTrigger
                    value={item.value}
                    className={`font-regular relative mr-[.5rem] flex items-center rounded-[.7rem] border border-main-gray-input2 bg-transparent px-3 py-[.5rem] text-[.95rem] capitalize text-main-gray-text data-[state=active]:border-main data-[state=active]:bg-main data-[state=active]:text-white ${headerTab === item.value ? 'gap-[.5rem]' : 'gap-0 md:gap-[.5rem]'} duration-300 hover:bg-main-gray-input2`}
                  >
                    {item.icon}
                    <p
                      className={`${headerTab === item.value ? 'w-fit' : 'w-0 md:w-fit'} overflow-hidden`}
                    >
                      {item.title}
                    </p>
                  </TabsTrigger>
                </CustomTooltip>
              </div>
            ))}
          </TabsList>
          <div className="flex items-center gap-1">
            {/* Konten lainnya */}
            <ToolTip value={'Laporkan Bug'}>
              <div
                className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
                onClick={() => {
                  setIsReportBugOpen(true);
                  setShowSidebar(false);
                }}
              >
                <IconWarning w={isMobile ? 17 : 20} />
              </div>
            </ToolTip>
            {tab !== 'notes' && (
              <ToolTip value={tab === 'chat' ? 'Reset Message' : 'Reset Quiz'}>
                <div
                  className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
                  onClick={() => {
                    setIsResetModalOpen(true);
                    setShowSidebar(false);
                  }}
                >
                  <IconRegenerateMessage w={isMobile ? 17 : 20} />
                </div>
              </ToolTip>
            )}
            {mobileScreen === 'minimize' && (
              <ToolTip
                value="Fullscreen"
                className=""
              >
                <div
                  className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
                  onClick={() => {
                    const chatAIContainer = document.querySelector(
                      '.chatAIContainer',
                    ) as HTMLDivElement;
                    const DocumentContainer = document.querySelector(
                      '.DocumentContainer',
                    ) as HTMLDivElement;
                    DocumentContainer.setAttribute('data-panel-size', '0.0');
                    DocumentContainer.style.cssText =
                      'flex: 0 1 0px; overflow: hidden;';
                    chatAIContainer.setAttribute('data-panel-size', '100.0');
                    chatAIContainer.style.cssText =
                      'flex: 100.0 1 0px; overflow: hidden; position: relative;';
                    setMobileScreen('fullscreen');
                  }}
                >
                  <IconFullscreen w={isMobile ? 15 : 20} />
                </div>
              </ToolTip>
            )}
            {mobileScreen === 'fullscreen' && (
              <ToolTip
                value="Minimize"
                className=""
              >
                <div
                  className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
                  onClick={() => {
                    const chatAIContainer = document.querySelector(
                      '.chatAIContainer',
                    ) as HTMLDivElement;
                    const DocumentContainer = document.querySelector(
                      '.DocumentContainer',
                    ) as HTMLDivElement;
                    DocumentContainer.setAttribute('data-panel-size', '50.0');
                    DocumentContainer.style.cssText =
                      'flex: 50.0 1 0px; overflow: hidden;';
                    chatAIContainer.setAttribute('data-panel-size', '50.0');
                    chatAIContainer.style.cssText =
                      'flex: 50.0 1 0px; overflow: hidden; position: relative;';
                    setMobileScreen('minimize');
                  }}
                >
                  <IconMinimizeScreen w={isMobile ? 15 : 20} />
                </div>
              </ToolTip>
            )}
          </div>
        </div>

        {[
          {
            value: 'notes',
            tw: 'flex-1 bg-bg-workspace px-0 pr-[.5rem] overflow-auto sm:shadow-lg  w-full absolute md:relative top-[60px] md:top-[unset] left-0 md:left-[unset] h-[calc(100%-60px)] md:h-[calc(100vh-3.5rem)]',
            children: (
              // <Editor
              //   canEdit={canEdit}
              //   userId={userId}
              //   docId={documentId}
              // />
              <></>
            ),
          },
          {
            value: 'chat',
            tw: ' p-2 pb-0 break-words bg-bg-workspace px-0 pr-[.5rem] sm:shadow-lg h-[calc(100vh-3.5rem)] w-full',
            children: <ChatContent />,
          },
          {
            value: 'quiz',
            tw: ' break-words bg-bg-workspace sm:shadow-lg  h-[calc(100vh-3.5rem)] w-full ',
            children: (
              // <Quiz />
              <></>
            ),
          },
        ].map((item) => (
          <TabsContent
            key={item.value}
            forceMount
            hidden={item.value !== activeIndex}
            value={item.value}
            className={item.tw}
          >
            {item.children}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Sidebar;

const ChatContent = () => {
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];

  // const trpc = api.useUtils();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // const { data: prevChatMessages, isLoading: isLoadingPrevMessage } =
  //   api.message.getAllByDocIdAndUserId.useQuery(
  //     {
  //       documentId: docId as string,
  //     },
  //     { refetchOnWindowFocus: false },
  //   );

  const [prevChatMessages, setPrevChatMessages] = useState<MessageDataType[]>(
    [],
  );
  const [isLoadingPrevMessage, setIsLoadingPrevMessage] =
    useState<boolean>(true);
  const [messageError, setMessageError] = useState<string | null>(null);

  const getMessages = async () => {
    await getGeneral(`/message/getAllByDocIdAndUserId?documentId=${docId}`, {
      setData: setPrevChatMessages,
      setLoading: setIsLoadingPrevMessage,
      onSuccess({ message, status, data }) {
        console.log({ data });
      },
      onError({ message }) {
        setMessageError(message);
      },
    });
  };

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

  const [userDocData, setUserDocData] = useState<
    UserDocument & {
      document: Document;
      user: User;
    }
  >();
  const [isUserDocLoading, setIsUserDocLoading] = useState<boolean>(true);

  const fetchUserDocData = async () => {
    await getGeneral(`/document/getUserDocData`, {
      params: {
        documentId: docId,
        userId: session?.user.id,
      },
      setData: setUserDocData,
      setLoading: setIsUserDocLoading,
      onError({ message }) {
        setMessageError(message);
      },
    });
  };

  useEffect(() => {
    getMessages();
    fetchUserDocData();
  }, []);

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
  const [isVectorising, setIsVectorising] = useState<boolean>(false);

  const vectoriseDocMutation = async () => {
    await mutateGeneral('/document/vectorise', {
      payload: {
        documentId: docId,
        userId: session?.user.id,
      },
      type: 'post',
      setLoading: setIsVectorising,
      onSuccess: async () => {
        //       await trpc.document.getHistoryByUser.refetch();
        //       await trpc.document.getDocumentTotalPage.refetch();
        fetchUserDocData();
      },
    });
  };

  if (messageError) {
    return <div>{messageError}</div>;
  }

  return (
    <Chat
      apiChat="/api/chat"
      body={{ docId: docId as string }}
      messages={{
        prevChatMessages,
        isLoadingPrevMessage,
      }}
      vectorize={{
        isVectorising,
        vectoriseDocMutation,
      }}
      userDoc={{
        isUserDocLoading,
        userDocData,
      }}
      fetchMessages={getMessages}
    />
  );
};
