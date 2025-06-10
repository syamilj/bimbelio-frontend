import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomTooltip, ToolTip } from '@/components/ui/tooltip';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import ReportBug from '@/components/_shared/other/report-bug';
import { useAppContext } from '@/components/provider/provider-app';
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
import { supabase } from '@/supabaseClient';
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

const tabNames = TABS.map((tab) => tab.value);

export default function RightComponent() {
  const {
    useData: { CourseData },
    useOther: { setShowAI, showAI },
  } = useProvider();
  const isDekstop = useMedia({ minWidth: '768px' });
  const { data: session } = useSession();
  const userId = session?.user.id;

  if (CourseData?.type === 'TRYOUT' || CourseData?.type === 'MATERI') {
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
            className="fixed bottom-6 right-4 bg-main shadow-default p-2 rounded-full z-[102]"
            onClick={() => setShowAI((prev) => !prev)}
            whileTap={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* Icon */}
            <BotMessageSquare
              className="text-white w-8 h-8 transform scale-x-[-1]"
              strokeWidth={2.1}
            />

            {/* Pangkat AI */}
            <span className="absolute -top-1 left-[-4px] bg-red-500 rounded-full px-[0.35rem] py-1 text-white font-bold text-xs">
              AI
            </span>
          </motion.div>
          {userId ? (
            <Sidebar
              onClose={() => {
                setShowAI(false);
              }}
              className={cn(
                'fixed z-[999] left-0 w-full h-full top-[130%] duration-300',
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
  const { data: session } = useSession();
  const {
    useData: { CourseData },
    useDoc: { docId },
  } = useProvider();

  const courseType = CourseData?.type;

  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const categoryId =
    (pathnameArray && pathnameArray[pathnameArray?.length - 1]) || null;

  const searchParams = useSearchParams();
  const sub = searchParams?.get('sub');
  const tab = searchParams?.get('tab');

  const [headerTab, setHeaderTab] = useState<string>(tab ? tab : '');
  const [documentId] = useState(docId || '');

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isReportBugOpen, setIsReportBugOpen] = useState(false);

  const { mutate: resetChat } = useMutation('/message/resetMessage', 'delete', {
    payload: { docId: `${documentId}` },
  });
  const { mutate: getNameImage } = useMutation(
    '/message/getNameImage',
    'post',
    { payload: { docId: `${documentId}` } },
  );
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
    if (tab && tabNames.includes(tab)) {
      setActiveIndex(tab);
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
    console.log('getOnboarding', getOnboarding);
  }, []);

  const handleResetChat = async () => {
    try {
      const res = await getNameImage();
      const resData = res?.data;
      if (resData.length > 0) {
        const { data, error } = await supabase.storage
          .from('img')
          .remove([...resData]);

        if (data) {
          console.log('berhasil delete', data);
          try {
            await resetChat();
            router.refresh();
          } catch (error) {
            console.log(error);
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
        try {
          await resetChat();
          router.refresh();
        } catch (error) {
          console.log(error);
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
        defaultValue="notes"
        className="max-h-screen max-w-full overflow-hidden"
      >
        <div className="relative z-[8] flex h-[60px] items-center justify-between border-b border-main-gray-input bg-white px-[1rem]">
          <TabsList className="h-full rounded-xl bg-transparent">
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
                      `font-regular relative mr-[.5rem] flex items-center rounded-[.7rem] border border-main-gray-input2 bg-transparent px-3 py-[.5rem] text-[.95rem] capitalize text-main-gray-text data-[state=active]:border-main data-[state=active]:bg-main data-[state=active]:text-white gap-0 md:gap-[.5rem] duration-300 md:hover:bg-main-gray-input2`,
                      activeIndex === item.value &&
                        'bg-main text-white md:hover:bg-main border-main',
                      headerTab === item.value && 'gap-[.5rem]',
                    )}
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
                className="hidden md:block"
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
                className="hidden md:block"
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

            <ToolTip
              value="Close"
              className="block md:hidden"
            >
              <div
                className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <IconX2 w={15} />
              </div>
            </ToolTip>
          </div>
        </div>

        {[
          {
            value: 'notes',
            tw: 'flex-1 bg-white px-0 pr-[.5rem] overflow-auto sm:shadow-lg  w-full absolute md:relative top-[60px] md:top-[unset] left-0 md:left-[unset] h-[calc(100%-60px)] md:h-[calc(100vh-10rem)]',
            children: <NotesContent docId={docId} />,
          },
          {
            value: 'chat',
            tw: ' p-2 pb-0 break-words bg-white px-0 pr-[.5rem] sm:shadow-lg h-[calc(100vh-10rem)] w-full',
            children: (
              <ChatContent
                docId={docId}
                onClose={onClose}
              />
            ),
          },
          {
            value: 'quiz',
            tw: ' break-words bg-white sm:shadow-lg  h-[calc(100vh-10rem)] w-full ',
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
              else if (item.value === 'chat') return true;
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
