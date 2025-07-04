'use client';

import { useProvider } from '@/components/workspace/chat/provider';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import { Lightbulb } from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

interface ReactMarkdownProps {
  value: string;
  className?: string;
  scrollToPdfPage?: (pageNum: number) => void;
  onClickPageNumber?: () => void;
}

// Ekstrak saran pertanyaan dari output AI
function extractSaranPertanyaan(content: string) {
  const match = content.match(
    /\[SARAN_PERTANYAAN\]([\s\S]*?)\[\/SARAN_PERTANYAAN\]/,
  );
  if (!match) return { main: content, saran: null };

  const main = content.replace(match[0], '').trim();
  const saranLines = match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && /^\d+\./.test(line))
    .map((line) => line.replace(/^\d+\.\s?/, ''));

  return { main, saran: saranLines };
}

export default function ReactMarkdownChatAI({
  value,
  onClickPageNumber,
  scrollToPdfPage,
  className,
}: ReactMarkdownProps) {
  const remarkMathOptions = {
    singleDollarTextMath: false,
  };

  const replaceLatexNotation = (content: string) => {
    return content
      .replace(/\\\[/g, '$$$')
      .replace(/\\\]/g, '$$$')
      .replace(/\\\(/g, '$$$')
      .replace(/\\\)/g, '$$$');
  };

  // Badge <PAGE#n> dan <PAGE#n-m>
  const processPageTags = (content: React.ReactNode): React.ReactNode => {
    if (typeof content !== 'string') {
      return React.Children.map(content, (child) =>
        typeof child === 'string' ? processPageTags(child) : child,
      );
    }
    const parts = content.split(/(<PAGE#\d+(?:-\d+)?>)/g);
    return parts.flatMap((part, idx) => {
      const rangeMatch = part.match(/^<PAGE#(\d+)-(\d+)>$/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 10);
        const end = parseInt(rangeMatch[2], 10);
        if (start <= end && end - start < 10) {
          return Array.from({ length: end - start + 1 }).map((_, i) => {
            const pageNum = start + i;
            return (
              <TooltipProvider key={`${idx}-${pageNum}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="mx-0.5 px-1.5 py-0.5 h-5 rounded-full text-[10px] align-super font-semibold bg-blue-100 hover:bg-blue-200 border-blue-200 transition-colors duration-200"
                      onClick={() => {
                        if (scrollToPdfPage) scrollToPdfPage(pageNum);
                        if (onClickPageNumber) onClickPageNumber();
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
          });
        }
      }
      const singleMatch = part.match(/^<PAGE#(\d+)>$/);
      if (singleMatch) {
        const pageNum = parseInt(singleMatch[1], 10);
        return (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="mx-0.5 px-1.5 py-0.5 h-5 rounded-full text-[10px] align-super font-semibold bg-blue-100 hover:bg-blue-200 border-blue-200 transition-colors duration-200"
                  onClick={() => {
                    if (scrollToPdfPage) scrollToPdfPage(pageNum);
                    if (onClickPageNumber) onClickPageNumber();
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

  const { useMessages, setFirstMessage, prevChatMessages } = useProvider();
  const { handleInputChangeMessages } = useMessages || {};

  const handleSaranClick = (q: string) => {
    const inputChat = document.getElementById(
      'inputChat',
    ) as HTMLTextAreaElement;
    if (inputChat && handleInputChangeMessages) {
      inputChat.value = q;
      handleInputChangeMessages({ target: { value: q } } as any);
      if (
        setFirstMessage &&
        (!prevChatMessages || prevChatMessages.length === 0)
      ) {
        setFirstMessage(true);
      }
      setTimeout(() => {
        const submit = document.getElementById(
          'submitMessages',
        ) as HTMLButtonElement;
        if (submit) submit.click();
      }, 80);
    }
  };

  const { main, saran } = extractSaranPertanyaan(replaceLatexNotation(value));

  // Markdown components (anti-nested <p>)
  const markdownComponents = {
    p: ({ node, children, ...props }: any) => {
      // Cek apakah children mengandung block element
      const hasBlockChild = React.Children.toArray(children).some(
        (child: any) =>
          typeof child !== 'string' &&
          [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'ul',
            'ol',
            'li',
            'blockquote',
            'div',
            'p',
          ].includes(child?.type),
      );
      // Jangan render <p> jika ada block element, ganti <div>
      if (hasBlockChild) {
        return <div {...props}>{processPageTags(children)}</div>;
      }
      return <p {...props}>{processPageTags(children)}</p>;
    },
    h1: ({ children, ...props }: any) => (
      <h1
        {...props}
        className="text-2xl font-bold mb-4 mt-6 text-gray-900"
      >
        {processPageTags(children)}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2
        {...props}
        className="text-xl font-semibold mb-3 mt-5 text-gray-900"
      >
        {processPageTags(children)}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3
        {...props}
        className="text-lg font-semibold mb-2 mt-4 text-gray-900"
      >
        {processPageTags(children)}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4
        {...props}
        className="text-base font-medium mb-2 mt-3 text-gray-900"
      >
        {processPageTags(children)}
      </h4>
    ),
    h5: ({ children, ...props }: any) => (
      <h5
        {...props}
        className="text-sm font-medium mb-2 mt-3 text-gray-900"
      >
        {processPageTags(children)}
      </h5>
    ),
    h6: ({ children, ...props }: any) => (
      <h6
        {...props}
        className="text-sm font-medium mb-2 mt-3 text-gray-900"
      >
        {processPageTags(children)}
      </h6>
    ),
    li: ({ children, ...props }: any) => (
      <li
        {...props}
        className="mb-1"
      >
        {processPageTags(children)}
      </li>
    ),
    ul: ({ children, ...props }: any) => (
      <ul
        {...props}
        className="list-disc pl-6 mb-4 space-y-1"
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol
        {...props}
        className="list-decimal pl-6 mb-4 space-y-1"
      >
        {children}
      </ol>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote
        {...props}
        className="border-l-4 border-gray-300 pl-4 py-2 mb-4 bg-gray-50 italic"
      >
        {children}
      </blockquote>
    ),
    code: ({ inline, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            {...props}
            className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
          >
            {children}
          </code>
        );
      }
      return (
        <code
          {...props}
          className="block bg-gray-100 p-3 rounded-lg overflow-x-auto text-sm font-mono mb-4"
        >
          {children}
        </code>
      );
    },
    strong: ({ children, ...props }: any) => (
      <strong
        {...props}
        className="font-semibold"
      >
        {processPageTags(children)}
      </strong>
    ),
    em: ({ children, ...props }: any) => (
      <em
        {...props}
        className="italic"
      >
        {processPageTags(children)}
      </em>
    ),
  };

  return (
    <div className="space-y-4">
      <ReactMarkdown
        remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        className={cn('prose break-words ReactMarkdown max-w-none', className)}
        components={markdownComponents}
      >
        {main}
      </ReactMarkdown>

      {/* Blok Saran Pertanyaan */}
      {saran && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Lightbulb className="text-white w-4 h-4" />
            </div>
            <h3 className="font-semibold text-blue-900">Saran Pertanyaan</h3>
          </div>
          <div className="space-y-2">
            {saran.map((q, i) => (
              <button
                key={i}
                type="button"
                className="w-full text-left p-3 bg-white border border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-gray-700 text-sm leading-relaxed shadow-sm hover:shadow-md"
                onClick={() => handleSaranClick(q)}
              >
                <span className="font-medium text-blue-600 mr-2">{i + 1}.</span>
                <ReactMarkdown
                  remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                  className="inline prose prose-sm max-w-none"
                  components={{
                    p: ({ children, ...props }) => (
                      <span {...props}>{processPageTags(children)}</span>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong
                        {...props}
                        className="font-semibold"
                      >
                        {processPageTags(children)}
                      </strong>
                    ),
                    em: ({ children, ...props }) => (
                      <em
                        {...props}
                        className="italic"
                      >
                        {processPageTags(children)}
                      </em>
                    ),
                    code: ({ node, children, ...props }) => {
                      // node.inline is the correct way to check for inline code in react-markdown v8+
                      const isInline = (node as any)?.inline;
                      if (isInline) {
                        return (
                          <code
                            {...props}
                            className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono"
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code
                          {...props}
                          className="block bg-gray-100 p-2 rounded text-xs font-mono"
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {q}
                </ReactMarkdown>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
