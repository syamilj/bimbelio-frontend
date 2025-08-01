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

  // Badge <PAGE#n> dan <PAGE#n-m> - Fixed to avoid nested elements
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
              <button
                key={`${idx}-${pageNum}`}
                className="mx-0.5 px-1.5 py-0.5 h-5 rounded-full text-[10px] align-super font-semibold bg-blue-100 hover:bg-blue-200 border-blue-200 transition-colors duration-200 inline-block"
                onClick={() => {
                  if (scrollToPdfPage) scrollToPdfPage(pageNum);
                  if (onClickPageNumber) onClickPageNumber();
                }}
                title={`Scroll ke Hal. ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          });
        }
      }
      const singleMatch = part.match(/^<PAGE#(\d+)>$/);
      if (singleMatch) {
        const pageNum = parseInt(singleMatch[1], 10);
        return (
          <button
            key={idx}
            className="mx-0.5 px-1.5 py-0.5 h-5 rounded-full text-[10px] align-super font-semibold bg-blue-100 hover:bg-blue-200 border-blue-200 transition-colors duration-200 inline-block"
            onClick={() => {
              if (scrollToPdfPage) scrollToPdfPage(pageNum);
              if (onClickPageNumber) onClickPageNumber();
            }}
            title={`Scroll ke Hal. ${pageNum}`}
          >
            {pageNum}
          </button>
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

  // Fixed Markdown components to avoid nested issues
  const markdownComponents = {
    p: ({ node, children, ...props }: any) => {
      // Convert any PAGE tags in children to avoid nesting issues
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return processPageTags(child);
        }
        return child;
      });

      // Check if we have any interactive elements that shouldn't be in a p tag
      const hasInteractiveElements = React.Children.toArray(
        processedChildren,
      ).some(
        (child: any) =>
          React.isValidElement(child) &&
          (child.type === 'button' ||
            child.type === 'a' ||
            child.type === 'div'),
      );

      if (hasInteractiveElements) {
        return (
          <span
            {...props}
            className="block"
          >
            {processedChildren}
          </span>
        );
      }

      return <p {...props}>{processedChildren}</p>;
    },
    h1: ({ children, ...props }: any) => (
      <h1
        {...props}
        className="text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-gray-100"
      >
        {processPageTags(children)}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2
        {...props}
        className="text-xl font-semibold mb-3 mt-5 text-gray-900 dark:text-gray-100"
      >
        {processPageTags(children)}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3
        {...props}
        className="text-lg font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100"
      >
        {processPageTags(children)}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4
        {...props}
        className="text-base font-medium mb-2 mt-3 text-gray-900 dark:text-gray-100"
      >
        {processPageTags(children)}
      </h4>
    ),
    h5: ({ children, ...props }: any) => (
      <h5
        {...props}
        className="text-sm font-medium mb-2 mt-3 text-gray-900 dark:text-gray-100"
      >
        {processPageTags(children)}
      </h5>
    ),
    h6: ({ children, ...props }: any) => (
      <h6
        {...props}
        className="text-sm font-medium mb-2 mt-3 text-gray-900 dark:text-gray-100"
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
        className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2 mb-4 bg-gray-50 dark:bg-gray-800 italic"
      >
        {children}
      </blockquote>
    ),
    code: ({ inline, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            {...props}
            className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
          >
            {children}
          </code>
        );
      }
      return (
        <code
          {...props}
          className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto text-sm font-mono mb-4"
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
      <div
        className={cn(
          'prose break-words ReactMarkdown max-w-none dark:prose-invert',
          className,
        )}
      >
        <ReactMarkdown
          remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={markdownComponents}
        >
          {main}
        </ReactMarkdown>
      </div>

      {/* Blok Saran Pertanyaan */}
      {saran && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Lightbulb className="text-white w-4 h-4" />
            </div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Saran Pertanyaan
            </h3>
          </div>
          <div className="space-y-2">
            {saran.map((q, i) => (
              <button
                key={i}
                type="button"
                className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 text-gray-700 dark:text-gray-300 text-sm leading-relaxed shadow-sm hover:shadow-md"
                onClick={() => handleSaranClick(q)}
              >
                <span className="font-medium text-blue-600 dark:text-blue-400 mr-2">
                  {i + 1}.
                </span>
                <span className="inline prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
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
                        const isInline = (node as any)?.properties?.inline;
                        if (isInline) {
                          return (
                            <code
                              {...props}
                              className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono"
                            >
                              {children}
                            </code>
                          );
                        }
                        return (
                          <code
                            {...props}
                            className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono"
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {q}
                  </ReactMarkdown>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
