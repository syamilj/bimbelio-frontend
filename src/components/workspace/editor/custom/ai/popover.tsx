import BouncingLoader from '@/components/ui/bouncing-loader';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { toaster } from '@/components/ui/toaster';

import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useBlockNoteEditor } from '@blocknote/react';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useCompletion } from 'ai/react';
import 'katex/dist/katex.min.css';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { useProvider } from '../../provider';

export type AiPopoverPropsRect = {
  top: number;
  left: number;
  width: number;
  blockId: string;
  text: string;
} | null;

const replaceLatexNotation = (content: any) => {
  return content
    .replace(/\\\[/g, '$$$') // Replace all occurrences of \[ with $$
    .replace(/\\\]/g, '$$$') // Replace all occurrences of \] with $$
    .replace(/\\\(/g, '$$$') // Replace all occurrences of \( with $$
    .replace(/\\\)/g, '$$$'); // Replace all occurrences of \) with $$
};

const remarkMathOptions = {
  singleDollarTextMath: false,
};

const AiPopover = () => {
  const { editorRef, rect, setRect } = useProvider();

  const [completions, setCompletions] = useState<string[]>([]);
  const [curIndex, setCurIndex] = useState<null | number>(null);
  const editor = useBlockNoteEditor();

  const { checkLimitation } = useUserLimitation();

  const { complete, completion, stop, isLoading } = useCompletion({
    body: {},
    onFinish: (_prompt, completion) => {
      setCompletions((prev) => [...prev, completion]);
      inputRef.current?.focus();
    },
    onError: (error) => {
      console.log(' NOTEAI ', error);
      toaster({
        title: 'Gagal',
        description: 'Terjadi kesalahan dengan pembuatan teks!',
        condition: 'warning',
        duration: 3000,
      });
    },
    streamProtocol: 'text',
  });

  const closePopover = () => {
    setRect(null);
  };

  const responseExists =
    curIndex !== null &&
    curIndex < completions.length &&
    !!completions[curIndex];

  const incrementCur = () => {
    setCurIndex(completions.length);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [query, setQuery] = useState('');

  useEffect(() => {
    const scrollContainer = editorRef.current;
    if (!rect || !scrollContainer) return;

    const handleScroll = () => {
      const newRect = scrollContainer.getBoundingClientRect();
      setRect((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          top: newRect.top + newRect.height,
          left: newRect.left,
          width: newRect.width,
        };
      });
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [rect]);

  if (!rect) return null;

  const AI_OPTIONS_AFTER_COMPLETION = [
    {
      title: 'Ganti',
      onClick: () => {
        if (curIndex === null) return;
        const text = completions[curIndex];
        editor.updateBlock(rect.blockId, {
          content: text,
        });
        closePopover();
      },
    },
    {
      title: 'Sisipkan',
      onClick: () => {
        if (curIndex === null) return;
        const text = completions[curIndex];
        editor.insertBlocks(
          [
            {
              content: text,
              type: 'paragraph',
            },
          ],
          {
            id: rect.blockId,
          },
          'after',
        );
        closePopover();
      },
    },
  ];

  return (
    <Popover
      open={!!rect}
      onOpenChange={(open) => {
        if (!open) {
          closePopover();
        }
      }}
    >
      <PopoverContent
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
        }}
        className="absolute z-[1000] border-gray-300 bg-white p-0 text-black"
      >
        <DropdownMenu
          modal={false}
          open={!isLoading}
        >
          <DropdownMenuTrigger className="flex w-full flex-col items-start hover:cursor-auto">
            {(isLoading || responseExists) && (
              <ReactMarkdown
                className="ReactMarkdown prose px-2 py-1"
                remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
              >
                {replaceLatexNotation(
                  responseExists ? completions[curIndex] : completion,
                )}
              </ReactMarkdown>
            )}
            {isLoading && (
              <div className="flex w-full items-center justify-between px-2 py-1">
                <div className="flex items-center gap-1">
                  <p>AI Sedang Proses</p>
                  <div className="scale-75">
                    <BouncingLoader />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={stop}
                    size="sm"
                    className="p-1 hover:cursor-pointer"
                  >
                    <p>Stop</p>
                  </Button>
                </div>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[20rem] max-w-[80%] empty:hidden"
          >
            {responseExists
              ? AI_OPTIONS_AFTER_COMPLETION.map((item) => (
                  <div key={item.title}>
                    <DropdownMenuItem
                      onClick={() => {
                        item.onClick();
                      }}
                      key={item.title}
                    >
                      {item.title}
                    </DropdownMenuItem>
                  </div>
                ))
              : AI_COMPLETIONS.map((item) => {
                  const newItems = item.items.filter((inner) =>
                    inner.toLowerCase().includes(query.trim().toLowerCase()),
                  );
                  return {
                    ...item,
                    items: newItems,
                  };
                })
                  .filter((item) => item.items.length > 0)
                  .map((item) => (
                    <div key={item.category}>
                      <DropdownMenuLabel key={item.category}>
                        {item.category}
                      </DropdownMenuLabel>
                      {item.items.map((inner) => (
                        <DropdownMenuItem
                          onClick={async () => {
                            incrementCur();
                            try {
                              const data = await checkLimitation({
                                notes: true,
                              });
                              if (data && !data.status) {
                                toaster({
                                  title: 'Uppss',
                                  condition: 'warning',
                                  description: data.message,
                                });
                                return;
                              } else if (data && data.status) {
                                complete(`${inner}: ${rect.text}`);
                              }
                            } catch (error) {
                              toaster({
                                title: 'Gagal',
                                condition: 'warning',
                                description: 'Coba lagi nanti!',
                              });
                              return;
                            }
                          }}
                          key={inner}
                        >
                          {inner}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </PopoverContent>
    </Popover>
  );
};

export default AiPopover;

const AI_COMPLETIONS = [
  {
    category: 'Edit atau tinjau pilihan',
    items: [
      'Sempurnakan Tulisan',
      'Koreksi Ejaan & Tata Bahasa',
      'Buat Ringkasan',
      'Jelaskan Lebih Jelas',
      'Identifikasi Tindakan Selanjutnya',
    ],
  },
];
