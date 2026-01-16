'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { toaster } from '@/components/ui/toaster';
import { CustomTooltip } from '@/components/ui/tooltip';
import { env } from '@/env.mjs';
import { base64ToFile, copyTextToClipboard } from '@/lib/utils';
import { IconMagicWand } from '@/styles/icon';
import { storage } from '@/supabaseClient';
import {
  BookOpenCheck,
  ClipboardCopy,
  Highlighter,
  Lightbulb,
  Loader2,
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
  // sendMessage,
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
  const {
    useSendMessage: { setSendMessage: sendMessage },
    setVision,
  } = useAppContext();

  const { checkLimitation, userLimitation } = useUserLimitation();

  const [visionLoading, setVisionLoading] = useState(false);

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

  const handleContentImage = async () => {
    setVisionLoading(true);
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
        const file = base64ToFile(content.image, `${crypto.randomUUID()}`);
        const { data, error } = await storage
          .from('img')
          .upload(`chat-ai/${file.name}`, file);
        if (data && sendMessage) {
          sendMessage(
            `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/chat-ai/${file.name}=${content.image}`,
          );
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
    } finally {
      hideTipAndSelection();
      setVisionLoading(false);
    }
  };

  const handleOptionChat = async (message: string) => {
    sendMessage(message);
    switchSidebarTabToChat();
    hideTipAndSelection();
  };

  const OptionImage = [
    {
      onClick: () => {
        handleContentImage();
      },
      icon: IconMagicWand,
      tooltip: 'Analyze',
      title: 'Analisis',
    },
  ];

  const OptionText = [
    {
      onClick: () => {
        copyTextToClipboard(content.text);
        hideTipAndSelection();
      },
      icon: ClipboardCopy,
      tooltip: 'Copy the text',
      title: 'Salin',
    },
    {
      onClick: () => {
        addHighlight();
        hideTipAndSelection();
        router.push(`${window.location.pathname}?tab=notes`);
      },
      icon: Highlighter,
      tooltip: 'Highlight',
      title: 'Highlight',
    },
    {
      onClick: () => {
        handleOptionChat('**Analysis**: ' + content.text);
      },
      icon: Lightbulb,
      tooltip: 'Analysis the text',
      title: 'Analisis',
    },
    {
      onClick: () => {
        handleOptionChat('**Explain**: ' + content.text);
      },
      icon: Lightbulb,
      tooltip: 'Explain the text',
      title: 'Jelaskan',
    },
    {
      onClick: () => {
        handleOptionChat('**Summarise**: ' + content.text);
      },
      icon: BookOpenCheck,
      tooltip: 'Summarise the text',
      title: 'Ringkas',
    },
  ];

  const getOptions = () => {
    const options = [];
    if (content.image) {
      options.push(...OptionImage);
    }
    if (content.text) {
      options.push(OptionText.find((item) => item.title === 'Salin'));
    }
    if (content.text && tab === 'notes') {
      options.push(OptionText.find((item) => item.title === 'Highlight'));
    }
    if (content.text && tab === 'chat') {
      if (!!sendMessage) {
        options.push(
          ...OptionText.filter(
            (item) => item.title !== 'Highlight' && item.title !== 'Salin',
          ),
        );
      }
    }
    return options;
  };
  const OPTIONS = getOptions();

  return (
    <div className="relative rounded-3xl bg-black">
      <div className="absolute -bottom-[10px] left-[50%] h-0 w-0 -translate-x-[50%] border-l-10 border-r-10 border-t-10 border-solid border-black border-l-transparent border-r-transparent" />

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
                  <div className="flex items-center gap-[.5rem] justify-center">
                    <option.icon className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
                    <p className="w-fit whitespace-nowrap text-white">
                      {option.title}
                    </p>
                  </div>
                ) : option.title === 'Analisis' ? (
                  <div className="flex items-center gap-[.5rem] justify-center">
                    {!visionLoading && (
                      <>
                        <option.icon className="h-5 w-5 text-gray-300 group-hover:text-gray-50" />
                        <p className="w-fit whitespace-nowrap text-white">
                          {option.title}
                        </p>
                      </>
                    )}
                    {visionLoading && (
                      <Loader2 className="animate-spin w-4 h-4 text-gray-300" />
                    )}
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
//     <div className="relative rounded-3xl bg-black">
//       <div className="absolute -bottom-[10px] left-[50%] h-0 w-0 -translate-x-[50%] border-l-10 border-r-10 border-t-10 border-solid border-black border-l-transparent border-r-transparent " />

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
