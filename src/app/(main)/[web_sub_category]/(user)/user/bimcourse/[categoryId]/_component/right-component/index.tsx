import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomTooltip, ToolTip } from '@/components/ui/tooltip';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ReportBug from '@/components/_shared/other/report-bug';
import { useAppContext } from '@/components/provider/provider-app';
import { useUserOnBoarding } from '@/components/provider/provider-on-boarding';
import { useSession } from '@/components/provider/provider-session-auth';
import { ResizablePanel } from '@/components/ui/resizable';
import { toaster } from '@/components/ui/toaster';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import {
  IconFullscreen,
  IconMinimizeScreen,
  IconRegenerateMessage,
  IconTabsChat,
  IconTabsNotes,
  IconWarning,
  IconX2,
} from '@/styles/icon';
import { storage } from '@/supabaseClient';
import { motion } from 'framer-motion';
import { BotMessageSquare, Loader2 } from 'lucide-react';
import { useMedia } from 'use-media';
import { useProvider } from '../../_provider/provider';
import OnBoarding from '../z_other/onboarding';
import ChatContent from './_components/chat-content';
import NotesContent from './_components/notes-content';
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
    title: 'Chat',
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

// const tabNames = TABS.map((tab) => tab.value);

export default function RightComponent() {
  const {
    isLocked,
    useData: { CourseData },
    useOther: { setShowAI, showAI },
  } = useProvider();
  const isDekstop = useMedia({ minWidth: '768px' });
  const { data: session } = useSession();
  const userId = session?.user.id;

  if (
    CourseData?.type === 'TRYOUT' ||
    CourseData?.type === 'PROGRESS_TEST' ||
    CourseData?.type === 'MATERI' ||
    isLocked
  ) {
    return null;
  }
  return (
    <>
      {isDekstop ? (
        <ResizablePanel
          defaultSize={50}
          minSize={0}
          className="chatAIContainer relative"
        >
          {userId ? (
            <Sidebar />
          ) : (
            <div className="flex items-center justify-center h-[80vh] w-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}
        </ResizablePanel>
      ) : (
        <>
          <motion.div
            className="fixed bottom-6 right-4 bg-blue-600 shadow-lg shadow-blue-600/25 p-3 rounded-3xl z-102 cursor-pointer"
            onClick={() => setShowAI((prev) => !prev)}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <BotMessageSquare
              className="text-white w-6 h-6 transform scale-x-[-1]"
              strokeWidth={2}
            />
          </motion.div>
          {userId ? (
            <Sidebar
              onClose={() => {
                setShowAI(false);
              }}
              className={cn(
                'fixed z-999 left-0 w-full h-full top-[130%] duration-300',
                showAI && 'top-0',
              )}
            />
          ) : (
            <div className="flex items-center justify-center h-[80vh] w-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}
        </>
      )}
    </>
  );
}

const Sidebar = ({
  className,
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) => {
  // const { data: session } = useSession();
  const {
    useData: { CourseData },
    useDoc: { docId },
    useParams: { sub, tab, categoryId },
  } = useProvider();

  const { userOnBoarding } = useUserOnBoarding();

  const courseType = CourseData?.type;

  const [headerTab, setHeaderTab] = useState<string>('notes');

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isReportBugOpen, setIsReportBugOpen] = useState(false);

  const { mutate: resetChat } = useMutation('/message/resetMessage', 'delete', {
    payload: { docId },
  });
  const { mutate: getNameImage } = useMutation(
    '/message/getNameImage',
    'post',
    { payload: { docId } },
  );
  const router = useRouter();

  const { setMobileScreen, mobileScreen, setShowSidebar } = useAppContext();

  const isMobile = useMedia({ maxWidth: '768px' });
  const [activeIndex, setActiveIndex] = useState(tab || 'chat');

  const { mutate: deleteQuiz } = useMutation(
    '/quiz/deleteQuizCourse',
    'delete',
    {
      params: {
        courseCategoryId: categoryId,
      },
    },
  );

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

  const handleResetChat = async () => {
    try {
      const res = await getNameImage();
      const resData = res?.data;
      if (resData.length > 0) {
        const { data, error } = await storage.from('img').remove([...resData]);

        if (data) {
          try {
            await resetChat();
            router.refresh();
          } catch (error) {
            toaster({
              title: 'Upss',
              description: 'Gagal hapus pesan, coba lagi!',
              condition: 'warning',
              duration: 2000,
            });
            return;
          }
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
        try {
          await resetChat();
          router.refresh();
        } catch (error) {
          toaster({
            title: 'Upss',
            description: 'Gagal hapus pesan, coba lagi!',
            condition: 'warning',
            duration: 2000,
          });
          return;
        }
      }
    } catch (error) {
      error;
    }
  };

  return (
    <div
      className={cn(
        'absolute left-0 top-0 h-full w-full bg-white md:relative',
        className,
      )}
    >
      {tab === 'chat' ? (
        <OnBoarding type="chat" />
      ) : tab === 'notes' ? (
        <OnBoarding type="notes" />
      ) : tab === 'quiz' ? (
        <OnBoarding type="quiz" />
      ) : null}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex w-[380px] flex-col items-center rounded-3xl bg-white p-7 text-center shadow-xl">
            <div className="flex flex-col gap-3">
              {tab === 'chat' ? (
                <p className="text-sm text-slate-600">
                  Seluruh chat dalam material{' '}
                  <span className="font-semibold text-slate-800">
                    [nama material]
                  </span>{' '}
                  akan dihapus.
                </p>
              ) : tab === 'quiz' ? (
                <p className="text-sm text-slate-600">
                  {' '}
                  Quiz ini akan dihapus.
                </p>
              ) : null}
              <p className="text-sm font-medium text-red-500">
                Apa kamu yakin ingin melanjutkan?
              </p>
            </div>
            <div className="mt-5 flex gap-3 w-full">
              <button
                className="flex-1 rounded-3xl bg-red-50 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                onClick={async () => {
                  if (tab === 'chat') {
                    handleResetConfirmation();
                  } else if (tab === 'quiz') {
                    await deleteQuiz();
                    router.refresh();
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
                className="flex-1 rounded-3xl py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
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
          router.push(`${window.location.pathname}?sub=${sub}&tab=${value}`);
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
        defaultValue="chat"
        className="max-h-screen max-w-full overflow-hidden"
      >
        <div className="relative z-8 flex h-[52px] items-center justify-between border-b border-slate-200/60 bg-white px-3">
          <TabsList className="h-full rounded-none bg-transparent gap-1.5">
            {TABS.filter((item) => {
              if (courseType === 'DOCUMENT') return true;
              else if (courseType === 'TRYOUT') return false;
              else if (courseType === 'VIDEO') {
                if (item.value === 'notes') return true;
                else if (item.value === 'chat') return false;
                else if (item.value === 'quiz') return false;
              } else return false;

              // if (courseType === 'DOCUMENT') return true;
              // else if (item.value === 'notes') return true;
              // else if (item.value === 'chat') return false;
              // else if (item.value === 'quiz') return false;
            }).map((item) => (
              <div
                className="relative"
                key={item.value}
                onClick={() => {
                  setHeaderTab(item.value);
                }}
              >
                {!userOnBoarding.DOCUMENT_NOTES && item.value === 'notes' ? (
                  <div className="absolute right-2 top-0.5 z-10 h-1.5 w-1.5 rounded-full bg-red-500" />
                ) : !userOnBoarding.DOCUMENT_CHAT_AI &&
                  item.value === 'chat' ? (
                  <div className="absolute right-2 top-0.5 z-10 h-1.5 w-1.5 rounded-full bg-red-500" />
                ) : !userOnBoarding.DOCUMENT_QUIZ && item.value === 'quiz' ? (
                  <div className="absolute right-2 top-0.5 z-10 h-1.5 w-1.5 rounded-full bg-red-500" />
                ) : null}
                <CustomTooltip content={item.tooltip}>
                  <TabsTrigger
                    value={item.value}
                    className={cn(
                      'relative flex items-center rounded-3xl border border-transparent bg-transparent px-3 py-1.5 text-sm font-medium text-slate-500 gap-0 md:gap-1.5 transition-all duration-200 hover:bg-slate-100 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm',
                      headerTab === item.value &&
                        'gap-1.5 border-slate-200 bg-white text-slate-800 shadow-sm',
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
            <ToolTip value={'Laporkan Bug'}>
              <div
                className="relative cursor-pointer rounded-3xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                onClick={() => {
                  setIsReportBugOpen(true);
                  setShowSidebar(false);
                }}
              >
                <IconWarning w={isMobile ? 16 : 18} />
              </div>
            </ToolTip>
            {tab !== 'notes' && (
              <ToolTip value={tab === 'chat' ? 'Reset Message' : 'Reset Quiz'}>
                <div
                  className="relative cursor-pointer rounded-3xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  onClick={() => {
                    setIsResetModalOpen(true);
                    setShowSidebar(false);
                  }}
                >
                  <IconRegenerateMessage w={isMobile ? 16 : 18} />
                </div>
              </ToolTip>
            )}
            {mobileScreen === 'minimize' && (
              <ToolTip
                value="Fullscreen"
                className="hidden md:block"
              >
                <div
                  className="relative cursor-pointer rounded-3xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
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
                  <IconFullscreen w={isMobile ? 14 : 18} />
                </div>
              </ToolTip>
            )}
            {mobileScreen === 'fullscreen' && (
              <ToolTip
                value="Minimize"
                className="hidden md:block"
              >
                <div
                  className="relative cursor-pointer rounded-3xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
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
                  <IconMinimizeScreen w={isMobile ? 14 : 18} />
                </div>
              </ToolTip>
            )}

            <ToolTip
              value="Close"
              className="block md:hidden"
            >
              <div
                className="relative cursor-pointer rounded-3xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <IconX2 w={14} />
              </div>
            </ToolTip>
          </div>
        </div>

        {[
          {
            value: 'notes',
            tw: 'flex-1 bg-white px-0 pr-1 overflow-auto w-full absolute md:relative top-[52px] md:top-[unset] left-0 md:left-[unset] h-[calc(100%-52px)] md:h-[calc(100vh-10rem)]',
            children: <NotesContent docId={docId} />,
          },
          {
            value: 'chat',
            tw: 'flex flex-col break-words bg-slate-50/50 h-[calc(100vh-10rem)] w-full',
            children: (
              <ChatContent
                docId={docId}
                onClose={onClose}
              />
            ),
          },
          {
            value: 'quiz',
            tw: 'break-words bg-white h-[calc(100vh-10rem)] w-full',
            children: (
              // <Quiz docId={docId} />

              <></>
            ),
          },
        ]
          .filter((item) => {
            if (courseType === 'DOCUMENT') return true;
            else if (courseType === 'TRYOUT') return false;
            else if (courseType === 'VIDEO') {
              if (item.value === 'notes') return true;
              else if (item.value === 'chat') return false;
              else if (item.value === 'quiz') return false;
            } else return false;
          })
          .map((item) => (
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
