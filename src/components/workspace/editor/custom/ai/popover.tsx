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
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Input } from '@/components/ui/input';
import { env } from '@/env.mjs';
import { markdownSanitizeSchema } from '@/lib/utils/markdown-sanitize';
import { useCompletion } from '@ai-sdk/react';
import { useBlockNoteEditor } from '@blocknote/react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';

import Cookies from 'js-cookie';
import 'katex/dist/katex.min.css';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { useProvider } from '../../provider';

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export type AiPopoverPropsRect = {
  top: number;
  left: number;
  width: number;
  blockId: string;
  text: string;
} | null;

const replaceLatexNotation = (content: any) => {
  if (!content) return '';
  return content
    .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$$ $1 $$$$$$') // \[...\] → $$...$$ (display math)
    .replace(/\\\(([\s\S]*?)\\\)/g, '$ $1 $'); // \(...\) → $...$ (inline math)
};

const remarkMathOptions = {
  singleDollarTextMath: false,
};

const AiPopover = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { editorRef, rect, setRect } = useProvider();

  const [completions, setCompletions] = useState<string[]>([]);
  const [curIndex, setCurIndex] = useState<null | number>(null);
  const editor = useBlockNoteEditor();

  const { checkLimitation } = useUserLimitation();

  const { complete, completion, stop, isLoading } = useCompletion({
    api: `${env.NEXT_PUBLIC_API_URL}/ai/chatNotes?website_sub_category_id=${websiteSubCategory?.id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
    // Backend mengirim UI message stream (pipeUIMessageStreamToResponse), bukan teks mentah
    streamProtocol: 'data',
    onFinish: (_prompt: string, completion: string) => {
      setCompletions((prev) => [...prev, completion]);
      inputRef.current?.focus();
    },
    onError: () => {
      toaster({
        title: 'Gagal',
        description: 'Terjadi kesalahan dengan pembuatan teks!',
        condition: 'warning',
        duration: 3000,
      });
    },
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

  const handleSubmit = async (prompt: string) => {
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
        complete(prompt);
      }
    } catch (error) {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Coba lagi nanti!',
      });
      return;
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = document.getElementById('notes-ai-input') as
      HTMLInputElement | undefined;
    input?.focus();
    if (inputRef) {
      inputRef.current?.focus();
    }
  }, [rect, inputRef]);

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
        className="absolute z-1000 border-gray-300 bg-white p-0 text-black"
      >
        <DropdownMenu
          modal={false}
          open={!isLoading}
        >
          <DropdownMenuTrigger className="flex w-full flex-col items-start hover:cursor-auto">
            {(isLoading || responseExists) && (
              <div className="ReactMarkdown prose px-2 py-1 text-start">
                <ReactMarkdown
                  remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
                  rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, markdownSanitizeSchema],
                    rehypeKatex,
                  ]}
                >
                  {replaceLatexNotation(
                    responseExists ? completions[curIndex] : completion,
                  )}
                </ReactMarkdown>
              </div>
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
            {!responseExists && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const input = document.getElementById('notes-ai-input') as
                    HTMLInputElement | undefined;
                  if (input) {
                    await handleSubmit(`${input.value}: ${rect.text}`);
                    input.value = '';
                  }
                }}
                className="relative flex items-center justify-center"
              >
                <Input
                  ref={inputRef}
                  id="notes-ai-input"
                />
                <button
                  type="submit"
                  className="absolute right-2 rounded-3xl bg-main p-1 text-white duration-300 hover:bg-main/80"
                >
                  <ArrowRight className="h-4 w-4 text-white" />
                </button>
              </form>
            )}
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
                            handleSubmit(`${inner}: ${rect.text}`);
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
