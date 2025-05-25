'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomTooltip, ToolTip } from '@/components/ui/tooltip';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import ReportBug from '@/components/_shared/other/report-bug';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { toaster } from '@/components/ui/toaster';
import OnBoarding from '@/components/workspace/_component/onboarding';
import { deleteGeneral, getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import {
  IconFullscreen,
  IconMinimizeScreen,
  IconRegenerateMessage,
  IconTabsChat,
  IconTabsNotes,
  IconWarning,
} from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import { Loader2 } from 'lucide-react';
import { useMedia } from 'use-media';
import ChatContent from './_components/chat-content';
import NotesContent from './_components/notes-content';

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
  // {
  //   value: 'quiz',
  //   title: 'Quiz',
  //   tooltip: 'Generate Quiz with the document',
  //   icon: <IconTabsQuiz w={18} />,
  //   isNew: false,
  // },
];

const tabNames = TABS.map((tab) => tab.value);

export function RightComponent({ docId: initialDocId }: { docId: string }) {
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];
  const { data: session } = useSession();
  const userId = session?.user.id;

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');
  const [headerTab, setHeaderTab] = useState<string>('chat');
  const [documentId, setDocumentId] = useState(initialDocId || docId || '');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isReportBugOpen, setIsReportBugOpen] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetChat = async () => {
    deleteGeneral('/message/resetMessage', {
      params: { docId, userId: session?.user.id },
    });
  };

  const getNameImage = async () => {
    const res = await getGeneral('/message/getNameImage', {
      params: { userId: session?.user.id },
    });
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
  const [activeIndex, setActiveIndex] = useState(tab || 'chat');

  const deleteQuiz = async () => {
    deleteGeneral('/quiz/deleteQuiz');
  };

  useEffect(() => {
    if (tab) {
      setActiveIndex(tab);
      setHeaderTab(tab);
    }
  }, [tab]);

  const handleResetConfirmation = async () => {
    setIsResetModalOpen(false);
    await handleResetChat();
  };

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
  }, []);

  const handleResetChat = async () => {
    setIsLoading(true);
    try {
      const res = await getNameImage();
      if (res.length > 0) {
        const { data, error } = await supabase.storage
          .from('img')
          .remove([...res]);

        if (data) {
          await resetChat();
          window.location.reload();
        }
        if (error) {
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
        window.location.reload();
      }
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

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
      {(isLoading ? true : isResetModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
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
                disabled={isLoading}
                onClick={async () => {
                  if (tab === 'chat') {
                    handleResetConfirmation();
                  } else if (tab === 'quiz') {
                    await deleteQuiz();
                    window.location.reload();
                  }
                }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4 text-main-red mx-auto" />
                ) : (
                  <>
                    {tab === 'chat'
                      ? 'Hapus Chat'
                      : tab === 'quiz'
                        ? 'Hapus Quiz'
                        : null}
                  </>
                )}
              </button>
              <button
                className="w-[156px] rounded-[.7rem] py-2 text-[.85rem] font-medium text-main-gray-text duration-200 md:hover:text-main-gray-text2"
                disabled={isLoading}
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
                    className={cn(
                      'font-regular relative mr-[.5rem] flex items-center rounded-[.7rem] border border-main-gray-input2 bg-transparent px-3 py-[.5rem] text-[.95rem] capitalize text-main-gray-text data-[state=active]:border-main data-[state=active]:bg-main data-[state=active]:text-white  duration-300 hover:bg-main-gray-input2 gap-0 md:gap-[.5rem]',
                      headerTab === item.value &&
                        'gap-[.5rem] bg-main text-white hover:bg-main',
                    )}
                  >
                    {item.icon}
                    <p
                      className={cn(
                        'overflow-hidden w-0 md:w-fit',
                        headerTab === item.value && 'w-fit',
                      )}
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
            children: <NotesContent docId={docId} />,
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
}
