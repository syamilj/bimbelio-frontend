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
import Quiz from '@/components/workspace/quiz';
import { deleteGeneral, getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import {
  IconFullscreen,
  IconMinimizeScreen,
  IconRegenerateMessage,
  IconTabsChat,
  IconTabsNotes,
  IconTabsQuiz,
  IconWarning,
} from '@/styles/icon';
import { storage } from '@/supabaseClient';
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
  {
    value: 'quiz',
    title: 'Quiz',
    tooltip: 'Generate Quiz with the document',
    icon: <IconTabsQuiz w={18} />,
    isNew: false,
  },
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
        const { data, error } = await storage.from('img').remove([...res]);

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
    <div className="absolute left-0 top-0 h-full w-full bg-slate-50/80 md:relative">
      {tab === 'chat' ? (
        <OnBoarding open={onBoarding.chat} type="chat" />
      ) : tab === 'notes' ? (
        <OnBoarding open={onBoarding.notes} type="notes" />
      ) : tab === 'quiz' ? (
        <OnBoarding open={onBoarding.quiz} type="quiz" />
      ) : null}

      {/* Reset Confirmation Modal */}
      {(isLoading ? true : isResetModalOpen) && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex w-[380px] flex-col items-center rounded-2xl bg-white p-6 text-center shadow-xl border border-slate-200/50">
            <div className="flex flex-col gap-3">
              {tab === 'chat' ? (
                <p className="text-sm text-slate-600">
                  Seluruh chat dalam material ini akan dihapus.
                </p>
              ) : tab === 'quiz' ? (
                <p className="text-sm text-slate-600">Quiz ini akan dihapus.</p>
              ) : null}
              <p className="font-semibold text-red-500 text-sm">
                Apa kamu yakin ingin melanjutkan?
              </p>
            </div>
            <div className="mt-5 flex gap-3 w-full">
              <button
                className="flex-1 rounded-xl bg-red-50 border border-red-200 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
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
                  <Loader2 className="animate-spin w-4 h-4 text-red-500 mx-auto" />
                ) : (
                  tab === 'chat' ? 'Hapus Chat' : tab === 'quiz' ? 'Hapus Quiz' : null
                )}
              </button>
              <button
                className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
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
        }}
        defaultValue="notes"
        className="max-h-screen max-w-full overflow-hidden flex flex-col h-full"
      >
        {/* Tab Header */}
        <div className="relative z-8 flex h-[52px] items-center justify-between border-b border-slate-200/80 bg-white px-3 shrink-0">
          <TabsList className="h-full bg-transparent gap-1">
            {TABS.map((item) => (
              <div className="relative" key={item.value} onClick={() => setHeaderTab(item.value)}>
                {((onBoarding.notes && item.value === 'notes') ||
                  (onBoarding.chat && item.value === 'chat') ||
                  (onBoarding.quiz && item.value === 'quiz')) && (
                  <div className="absolute right-2 top-1.5 z-10 h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
                <CustomTooltip content={item.tooltip}>
                  <TabsTrigger
                    value={item.value}
                    className={cn(
                      'relative flex items-center gap-1.5 rounded-xl border border-transparent px-3 py-1.5 text-xs font-medium text-slate-500 transition-all duration-200',
                      'data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm',
                      'hover:bg-slate-100/80',
                      headerTab === item.value && 'gap-1.5 border-slate-200 bg-white text-slate-800 shadow-sm',
                    )}
                  >
                    {item.icon}
                    <p className={cn(
                      'overflow-hidden w-0 md:w-fit transition-all',
                      headerTab === item.value && 'w-fit',
                    )}>
                      {item.title}
                    </p>
                  </TabsTrigger>
                </CustomTooltip>
              </div>
            ))}
          </TabsList>

          {/* Toolbar Actions */}
          <div className="flex items-center gap-1">
            <ToolTip value="Laporkan Bug">
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors"
                onClick={() => {
                  setIsReportBugOpen(true);
                  setShowSidebar(false);
                }}
              >
                <IconWarning w={isMobile ? 15 : 16} />
              </button>
            </ToolTip>
            {tab !== 'notes' && (
              <ToolTip value={tab === 'chat' ? 'Reset Message' : 'Reset Quiz'}>
                <button
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors"
                  onClick={() => {
                    setIsResetModalOpen(true);
                    setShowSidebar(false);
                  }}
                >
                  <IconRegenerateMessage w={isMobile ? 15 : 16} />
                </button>
              </ToolTip>
            )}
            {mobileScreen === 'minimize' && (
              <ToolTip value="Fullscreen">
                <button
                  className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-200 hover:bg-slate-50 text-slate-400 transition-colors"
                  onClick={() => {
                    const chatAIContainer = document.querySelector('.chatAIContainer') as HTMLDivElement;
                    const DocumentContainer = document.querySelector('.DocumentContainer') as HTMLDivElement;
                    DocumentContainer.setAttribute('data-panel-size', '0.0');
                    DocumentContainer.style.cssText = 'flex: 0 1 0px; overflow: hidden;';
                    chatAIContainer.setAttribute('data-panel-size', '100.0');
                    chatAIContainer.style.cssText = 'flex: 100.0 1 0px; overflow: hidden; position: relative;';
                    setMobileScreen('fullscreen');
                  }}
                >
                  <IconFullscreen w={isMobile ? 13 : 14} />
                </button>
              </ToolTip>
            )}
            {mobileScreen === 'fullscreen' && (
              <ToolTip value="Minimize">
                <button
                  className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-200 hover:bg-slate-50 text-slate-400 transition-colors"
                  onClick={() => {
                    const chatAIContainer = document.querySelector('.chatAIContainer') as HTMLDivElement;
                    const DocumentContainer = document.querySelector('.DocumentContainer') as HTMLDivElement;
                    DocumentContainer.setAttribute('data-panel-size', '50.0');
                    DocumentContainer.style.cssText = 'flex: 50.0 1 0px; overflow: hidden;';
                    chatAIContainer.setAttribute('data-panel-size', '50.0');
                    chatAIContainer.style.cssText = 'flex: 50.0 1 0px; overflow: hidden; position: relative;';
                    setMobileScreen('minimize');
                  }}
                >
                  <IconMinimizeScreen w={isMobile ? 13 : 14} />
                </button>
              </ToolTip>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {[
          {
            value: 'notes',
            tw: 'flex-1 bg-white px-0 pr-1 overflow-auto w-full absolute md:relative top-[52px] md:top-[unset] left-0 md:left-[unset] h-[calc(100%-52px)] md:h-[calc(100vh-3.5rem)]',
            children: <NotesContent docId={docId} />,
          },
          {
            value: 'chat',
            tw: 'flex flex-col p-2 pb-0 break-words bg-slate-50/50 px-0 pr-1 h-[calc(100vh-3.5rem)] w-full',
            children: <ChatContent />,
          },
          {
            value: 'quiz',
            tw: 'break-words bg-white h-[calc(100vh-3.5rem)] w-full',
            children: <Quiz />,
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
