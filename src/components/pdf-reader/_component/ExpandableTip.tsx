import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/session-provider-auth';
import { toaster } from '@/components/ui/toaster';
import { CustomTooltip } from '@/components/ui/tooltip';
import { env } from '@/env.mjs';
import { base64ToFile, copyTextToClipboard } from '@/lib/utils';
import { IconMagicWand } from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import {
  BookOpenCheck,
  ClipboardCopy,
  Highlighter,
  Lightbulb,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import {
  GhostHighlight,
  usePdfHighlighterContext,
} from 'react-pdf-highlighter-extended';

interface ExpandableTipProps {
  addHighlight: (highlight: GhostHighlight) => void;
  sendMessage: ((message: string) => void) | null;
}

const ExpandableTip = ({ addHighlight, sendMessage }: ExpandableTipProps) => {
  // const selectionRef = useRef<PdfSelection | null>(null);

  const {
    getCurrentSelection,
    // removeGhostHighlight,
    setTip,
    updateTipPosition,
  } = usePdfHighlighterContext();

  useLayoutEffect(() => {
    updateTipPosition!();
  }, []);

  return (
    <div className="Tip">
      <TextSelectionPopover
        addHighlight={() => {
          const highlight = getCurrentSelection();
          if (highlight) {
            addHighlight({
              content: highlight.content,
              position: highlight.position,
              type: highlight.type,
            });
          }

          // { content, position }
        }}
        hideTipAndSelection={() => setTip(null)}
        content={{
          text: getCurrentSelection()?.content.text || undefined,
          image: getCurrentSelection()?.content.image,
        }}
        sendMessage={sendMessage}
      />
    </div>
  );
};

const TextSelectionPopover = ({
  content,
  hideTipAndSelection,
  addHighlight,
  sendMessage,
}: {
  // position: any;
  addHighlight: () => void;
  content: {
    text?: string | undefined;
    image?: string | undefined;
  };
  hideTipAndSelection: () => void;
  sendMessage: ((message: string) => void) | null;
}) => {
  const router = useRouter();
  // const { query } = router;
  // const tab = query.tab as string;
  // const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');
  const sub = searchParams?.get('sub');
  // const pathnameArray = pathname?.split('/');
  // const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];
  const { data: session } = useSession();

  const { checkLimitation, userLimitation } = useUserLimitation();

  const { setImageMessageLoading, messageData, setVision } = useAppContext();

  const switchSidebarTabToChat = () => {
    // router.push({
    //   query: {
    //     ...router.query,
    //     tab: 'chat',
    //   },
    // });
    if (sub) {
      router.push(`${window.location.pathname}?sub=${sub}&tab=chat`);
    } else {
      router.push(`${window.location.pathname}?tab=chat`);
    }
  };

  const getOptions = () => {
    const options = [];
    if (content.text) {
      options.push({
        onClick: () => {
          copyTextToClipboard(content.text);
          hideTipAndSelection();
        },
        icon: (
          <ClipboardCopy className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
        ),
        tooltip: 'Copy the text',
        title: 'Salin',
      });
      if (session?.user.role !== 'ADMIN') {
        if (
          userLimitation &&
          userLimitation?.chat >= userLimitation?.chatLimit
        ) {
          options.push({
            onClick: () => {},
            icon: null,
            tooltip: 'Limit Tercapai',
            title: (
              <span className="cursor-default">
                Limit tercapai.{' '}
                <span className="text-green-500">Upgrade akun</span> untuk
                lanjut
              </span>
            ),
          });
        }
      }
    }
    if (content.text && tab === 'chat') {
      if (sendMessage) {
        if (session?.user.role !== 'ADMIN') {
          if (
            userLimitation &&
            userLimitation?.chat < userLimitation?.chatLimit
          ) {
            options.push(
              {
                onClick: () => {
                  sendMessage('**Analysis**: ' + content.text);
                  switchSidebarTabToChat();
                  hideTipAndSelection();
                },
                icon: (
                  <Lightbulb className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
                ),
                tooltip: 'Analysis the text',
                title: 'Analisis',
              },
              {
                onClick: () => {
                  sendMessage('**Explain**: ' + content.text);
                  switchSidebarTabToChat();
                  hideTipAndSelection();
                },
                icon: (
                  <Lightbulb className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
                ),
                tooltip: 'Explain the text',
                title: 'Jelaskan',
              },
              {
                onClick: () => {
                  sendMessage('**Summarise**: ' + content.text);
                  switchSidebarTabToChat();
                  hideTipAndSelection();
                },
                icon: (
                  <BookOpenCheck className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
                ),
                tooltip: 'Summarise the text',
                title: 'Ringkas',
              },
            );
          }
        }
        if (session?.user.role === 'ADMIN') {
          options.push(
            {
              onClick: () => {
                sendMessage('**Analysis**: ' + content.text);
                switchSidebarTabToChat();
                hideTipAndSelection();
              },
              icon: (
                <Lightbulb className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
              ),
              tooltip: 'Analysis the text',
              title: 'Analisis',
            },
            {
              onClick: () => {
                sendMessage('**Explain**: ' + content.text);
                switchSidebarTabToChat();
                hideTipAndSelection();
              },
              icon: (
                <Lightbulb className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
              ),
              tooltip: 'Explain the text',
              title: 'Jelaskan',
            },
            {
              onClick: () => {
                sendMessage('**Summarise**: ' + content.text);
                switchSidebarTabToChat();
                hideTipAndSelection();
              },
              icon: (
                <BookOpenCheck className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
              ),
              tooltip: 'Summarise the text',
              title: 'Ringkas',
            },
          );
        }
      }
    }
    if (content.text && tab === 'notes') {
      if (session?.user.role !== 'ADMIN') {
        if (
          userLimitation &&
          userLimitation?.chat < userLimitation?.chatLimit
        ) {
          options.push({
            onClick: () => {
              addHighlight();
              hideTipAndSelection();
              // router.push(
              //   { query: { ...router.query, tab: 'notes' } },
              //   undefined,
              //   { shallow: true },
              // );

              router.push(`${window.location.pathname}?tab=notes`);
            },
            icon: (
              <Highlighter className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
            ),
            tooltip: 'Highlight',
            title: 'Highlight',
          });
        }
      }
      if (session?.user.role === 'ADMIN') {
        options.push({
          onClick: () => {
            addHighlight();
            hideTipAndSelection();
            // router.push(
            //   { query: { ...router.query, tab: 'notes' } },
            //   undefined,
            //   { shallow: true },
            // );
            router.push(`${window.location.pathname}?tab=notes`);
          },
          icon: (
            <Highlighter className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
          ),
          tooltip: 'Highlight',
          title: 'Highlight',
        });
      }
    }
    if (content.image) {
      if (session?.user.role !== 'ADMIN') {
        if (
          userLimitation &&
          userLimitation?.vision < userLimitation?.visionLimit
        ) {
          options.push(
            {
              onClick: async () => {
                try {
                  const data = await checkLimitation({
                    vision: true,
                  });
                  if (data && !data.status) {
                    switchSidebarTabToChat();
                    setVision(false);
                    toaster({
                      title: 'Uppss',
                      condition: 'warning',
                      description: data.message,
                      duration: 5000,
                    });
                    return;
                  } else if (data && data.status) {
                    setImageMessageLoading({
                      value: true,
                      index: messageData.length - 1,
                    });
                    const file = base64ToFile(
                      content.image,
                      `${crypto.randomUUID()}`,
                    );
                    hideTipAndSelection();
                    const { data, error } = await supabase.storage
                      .from('img')
                      .upload(`${file.name}`, file);
                    if (data && sendMessage) {
                      sendMessage(
                        `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/img/${file.name}=${content.image}`,
                      );
                      setImageMessageLoading({
                        value: false,
                        index: 9999,
                      });
                    }
                    if (error) {
                      alert('Error');
                    }
                  }
                } catch (error) {
                  toaster({
                    title: 'Gagal',
                    condition: 'warning',
                    description: 'Coba lagi nanti!',
                  });
                  return;
                }
              },
              icon: <IconMagicWand className="text-white" />,
              tooltip: 'Analyze',
              title: 'Analisis',
            },
            {
              onClick: async () => {
                try {
                  const data = await checkLimitation({
                    vision: true,
                  });
                  if (data && !data.status) {
                    switchSidebarTabToChat();
                    setVision(false);
                    toaster({
                      title: 'Uppss',
                      condition: 'warning',
                      description: data.message,
                      duration: 5000,
                    });
                    return;
                  } else if (data && data.status) {
                    setImageMessageLoading({
                      value: true,
                      index: messageData.length - 1,
                    });
                    const file = base64ToFile(
                      content.image,
                      `${crypto.randomUUID()}`,
                    );
                    hideTipAndSelection();
                    const { data, error } = await supabase.storage
                      .from('img')
                      .upload(`${file.name}`, file);
                    if (data && sendMessage) {
                      sendMessage(
                        `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/img/${file.name}=${content.image}`,
                      );
                      setImageMessageLoading({
                        value: false,
                        index: 9999,
                      });
                    }
                    if (error) {
                      alert('Error');
                    }
                  }
                } catch (error) {
                  toaster({
                    title: 'Gagal',
                    condition: 'warning',
                    description: 'Coba lagi nanti!',
                  });
                  return;
                }
              },
              icon: <IconMagicWand className="text-white" />,
              tooltip: 'Explain',
              title: 'Jelaskan',
            },
            {
              onClick: async () => {
                try {
                  const data = await checkLimitation({
                    vision: true,
                  });
                  if (data && !data.status) {
                    switchSidebarTabToChat();
                    setVision(false);
                    toaster({
                      title: 'Uppss',
                      condition: 'warning',
                      description: data.message,
                      duration: 5000,
                    });
                    return;
                  } else if (data && data.status) {
                    setImageMessageLoading({
                      value: true,
                      index: messageData.length - 1,
                    });
                    const file = base64ToFile(
                      content.image,
                      `${crypto.randomUUID()}`,
                    );
                    hideTipAndSelection();
                    const { data, error } = await supabase.storage
                      .from('img')
                      .upload(`${file.name}`, file);
                    if (data && sendMessage) {
                      sendMessage(
                        `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/img/${file.name}=${content.image}`,
                      );
                      setImageMessageLoading({
                        value: false,
                        index: 9999,
                      });
                    }
                    if (error) {
                      alert('Error');
                    }
                  }
                } catch (error) {
                  toaster({
                    title: 'Gagal',
                    condition: 'warning',
                    description: 'Coba lagi nanti!',
                  });
                  return;
                }
              },
              icon: <IconMagicWand className="text-white" />,
              tooltip: 'Summarise',
              title: 'Ringkas',
            },
          );
        } else {
          options.push({
            onClick: () => {},
            icon: null,
            tooltip: 'Limit Tercapai',
            title: (
              <span className="cursor-default">
                Limit tercapai.{' '}
                <span className="text-green-500">Upgrade akun</span> untuk
                lanjut
              </span>
            ),
          });
        }
      }
      if (session?.user.role === 'ADMIN') {
        options.push(
          {
            onClick: async () => {
              try {
                const data = await checkLimitation({
                  vision: true,
                });
                if (data && !data.status) {
                  toaster({
                    title: 'Uppss',
                    condition: 'warning',
                    description: data.message,
                    duration: 5000,
                  });
                  return;
                } else if (data && data.status) {
                  switchSidebarTabToChat();
                  setVision(false);
                  setImageMessageLoading({
                    value: true,
                    index: messageData.length - 1,
                  });
                  const file = base64ToFile(
                    content.image,
                    `${crypto.randomUUID()}`,
                  );
                  hideTipAndSelection();
                  const { data, error } = await supabase.storage
                    .from('img')
                    .upload(`${file.name}`, file);
                  if (data && sendMessage) {
                    sendMessage(
                      `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/img/${file.name}=${content.image}`,
                    );
                    setImageMessageLoading({
                      value: false,
                      index: 9999,
                    });
                  }
                  if (error) {
                    alert('Error');
                  }
                }
              } catch (error) {
                toaster({
                  title: 'Gagal',
                  condition: 'warning',
                  description: 'Coba lagi nanti!',
                });
                return;
              }
            },
            icon: <IconMagicWand className="text-white" />,
            tooltip: 'Analyze',
            title: 'Analisis',
          },
          {
            onClick: async () => {
              try {
                const data = await checkLimitation({
                  vision: true,
                });
                if (data && !data.status) {
                  switchSidebarTabToChat();
                  setVision(false);
                  toaster({
                    title: 'Uppss',
                    condition: 'warning',
                    description: data.message,
                    duration: 5000,
                  });
                  return;
                } else if (data && data.status) {
                  setImageMessageLoading({
                    value: true,
                    index: messageData.length - 1,
                  });
                  const file = base64ToFile(
                    content.image,
                    `${crypto.randomUUID()}`,
                  );
                  hideTipAndSelection();
                  const { data, error } = await supabase.storage
                    .from('img')
                    .upload(`${file.name}`, file);
                  if (data && sendMessage) {
                    sendMessage(
                      `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/img/${file.name}=${content.image}`,
                    );
                    setImageMessageLoading({
                      value: false,
                      index: 9999,
                    });
                  }
                  if (error) {
                    alert('Error');
                  }
                }
              } catch (error) {
                toaster({
                  title: 'Gagal',
                  condition: 'warning',
                  description: 'Coba lagi nanti!',
                });
                return;
              }
            },
            icon: <IconMagicWand className="text-white" />,
            tooltip: 'Explain',
            title: 'Jelaskan',
          },
          {
            onClick: async () => {
              try {
                const data = await checkLimitation({
                  vision: true,
                });
                if (data && !data.status) {
                  switchSidebarTabToChat();
                  setVision(false);
                  toaster({
                    title: 'Uppss',
                    condition: 'warning',
                    description: data.message,
                    duration: 5000,
                  });
                  return;
                } else if (data && data.status) {
                  setImageMessageLoading({
                    value: true,
                    index: messageData.length - 1,
                  });
                  const file = base64ToFile(
                    content.image,
                    `${crypto.randomUUID()}`,
                  );
                  hideTipAndSelection();
                  const { data, error } = await supabase.storage
                    .from('img')
                    .upload(`${file.name}`, file);
                  if (data && sendMessage) {
                    sendMessage(
                      `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/img/${file.name}=${content.image}`,
                    );
                    setImageMessageLoading({
                      value: false,
                      index: 9999,
                    });
                  }
                  if (error) {
                    alert('Error');
                  }
                }
              } catch (error) {
                toaster({
                  title: 'Gagal',
                  condition: 'warning',
                  description: 'Coba lagi nanti!',
                });
                return;
              }
            },
            icon: <IconMagicWand className="text-white" />,
            tooltip: 'Summarise',
            title: 'Ringkas',
          },
        );
      }
    }
    return options;
  };
  const OPTIONS = getOptions();

  return (
    <div className="relative rounded-xl bg-black">
      <div className="absolute -bottom-[10px] left-[50%] h-0 w-0 -translate-x-[50%] border-l-[10px] border-r-[10px] border-t-[10px] border-solid border-black border-l-transparent border-r-transparent" />

      <div
        id="tooltips"
        className="flex divide-x divide-gray-800"
      >
        {OPTIONS.map((option, id) => {
          if (!option) return null;
          return (
            <div
              className="group p-2 hover:cursor-pointer"
              key={id}
              onClick={option.onClick}
            >
              <CustomTooltip content={option.tooltip}>
                {option.title === 'Salin' ? (
                  <div className="flex items-center gap-[.5rem]">
                    <>{option.icon}</>
                    <p className="w-fit whitespace-nowrap text-white">
                      {option.title}
                    </p>
                  </div>
                ) : option.title === 'Analisis' ? (
                  <div className="flex items-center gap-[.5rem]">
                    <>{option.icon}</>
                    <p className="w-fit whitespace-nowrap text-white">
                      {option.title}
                    </p>
                  </div>
                ) : (
                  <p className="w-fit whitespace-nowrap text-white">
                    {option.title}
                  </p>
                )}
              </CustomTooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpandableTip;

interface CommentFormProps {
  onSubmit: (input: string) => void;
  placeHolder?: string;
}

export const CommentForm = ({ onSubmit, placeHolder }: CommentFormProps) => {
  const [input, setInput] = useState<string>('');

  return (
    <form
      className="Tip__card"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(input);
      }}
    >
      <div>
        <textarea
          placeholder={placeHolder}
          autoFocus
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
      </div>
      <div>
        <input
          type="submit"
          value="Save"
        />
      </div>
    </form>
  );
};

// import { copyTextToClipboard } from "@/lib/utils";
// import { ClipboardCopy, Highlighter } from "lucide-react";
// import React, { useLayoutEffect, useState } from "react";
// import {
//   GhostHighlight,
//   usePdfHighlighterContext,
// } from "react-pdf-highlighter-extended";

// interface ExpandableTipProps {
//   addHighlight: (highlight: GhostHighlight) => void;
// }

// const ExpandableTip = ({ addHighlight }: ExpandableTipProps) => {
//   // const selectionRef = useRef<PdfSelection | null>(null);

//   const {
//     getCurrentSelection,
//     // removeGhostHighlight,
//     setTip,
//     updateTipPosition,
//   } = usePdfHighlighterContext();

//   useLayoutEffect(() => {
//     updateTipPosition!();
//   }, []);

//   return (
//     <div className="Tip">
//       <TextSelectionPopover
//         addHighlight={() => {
//           const highlight = getCurrentSelection();
//           if (highlight) {
//             addHighlight({
//               content: highlight.content,
//               position: highlight.position,
//               type: highlight.type
//             })
//           }

//           // { content, position }
//         }}
//         hideTipAndSelection={() => setTip(null)}
//         content={{ text: "acb" }}
//       />
//     </div>
//   );
// };

// const TextSelectionPopover = ({
//   content,
//   hideTipAndSelection,
//   addHighlight,
// }: {
//   // position: any;
//   addHighlight: () => void;
//   content: {
//     text?: string | undefined;
//     image?: string | undefined;
//   };
//   hideTipAndSelection: () => void;
// }) => {
//   const OPTIONS = [
//     {
//       onClick: () => {
//         addHighlight();
//         hideTipAndSelection();
//       },
//       icon: Highlighter,
//     },
//     {
//       onClick: () => {
//         copyTextToClipboard(content.text);
//         hideTipAndSelection()
//       },
//       icon: ClipboardCopy,
//     },
//   ];

//   return (
//     <div className="relative rounded-xl bg-black">
//       <div className="absolute -bottom-[10px] left-[50%] h-0 w-0 -translate-x-[50%] border-l-[10px] border-r-[10px] border-t-[10px] border-solid border-black border-l-transparent border-r-transparent " />

//       <div className="flex divide-x divide-gray-800">
//         {OPTIONS.map((option, id) => (
//           <div
//             className="group p-2 hover:cursor-pointer"
//             key={id}
//             onClick={option.onClick}
//           >
//             <option.icon
//               size={18}
//               className="rounded-full text-gray-300 group-hover:text-gray-50"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ExpandableTip;

// interface CommentFormProps {
//   onSubmit: (input: string) => void;
//   placeHolder?: string;
// }

// export const CommentForm = ({ onSubmit, placeHolder }: CommentFormProps) => {
//   const [input, setInput] = useState<string>("");

//   return (
//     <form
//       className="Tip__card"
//       onSubmit={(event) => {
//         event.preventDefault();
//         onSubmit(input);
//       }}
//     >
//       <div>
//         <textarea
//           placeholder={placeHolder}
//           autoFocus
//           onChange={(event) => {
//             setInput(event.target.value);
//           }}
//         />
//       </div>
//       <div>
//         <input type="submit" value="Save" />
//       </div>
//     </form>
//   );
// };
