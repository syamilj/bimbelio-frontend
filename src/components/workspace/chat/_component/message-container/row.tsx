'use client';

import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BimBot } from '@/components/ui/bim-brand';
import { env } from '@/env.mjs';
import { cn } from '@/lib/utils';
import { Bot, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { type MessageDataType, useProvider } from '../../provider';
import ChatTools from '../chat-tools';
import SubmitChatEdit from '../submit-chat-edit';
import 'katex/dist/katex.min.css';

type Props = {
  message: MessageDataType;
  index: number;
  isLast: boolean;
  isStreaming: boolean;
};

// ── Preprocessing helpers ──────────────────────────────────────────

/** Extract [SARAN_PERTANYAAN] block from AI output */
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

/** Preprocess content for Streamdown rendering */
function preprocessContent(content: string) {
  const { main, saran } = extractSaranPertanyaan(content);

  let processed = main
    // Convert LaTeX \(...\) → $ and \[...\] → $$ for Streamdown math plugin
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
    .replace(/\\\(/g, '$$')
    .replace(/\\\)/g, '$$');

  // Convert <PAGE#n> tags to clickable badge-style inline code
  processed = processed.replace(
    /<PAGE#(\d+)-(\d+)>/g,
    (_: string, start: string, end: string) => {
      const s = parseInt(start);
      const e = parseInt(end);
      return Array.from(
        { length: e - s + 1 },
        (_, i) => `\`📄${s + i}\``,
      ).join(' ');
    },
  );
  processed = processed.replace(/<PAGE#(\d+)>/g, '`📄$1`');

  return { main: processed, saran };
}

// ── Row component ──────────────────────────────────────────────────

export default function Row({ message, index, isLast, isStreaming }: Props) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const {
    editMessage,
    scrollToPdfPage,
    onClickPageNumber,
    useMessages: { appendMessages },
    setFirstMessage,
    prevChatMessages,
  } = useProvider();

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isBase64Image = message.content?.startsWith(
    env.NEXT_PUBLIC_SUPABASE_URL,
  );

  // Preprocess assistant content (memoised per content string)
  const { main: processedContent, saran } = useMemo(
    () =>
      isAssistant
        ? preprocessContent(message.content)
        : { main: message.content, saran: null },
    [message.content, isAssistant],
  );

  // Ref for marking page badge code elements after render
  const pageContentRef = useRef<HTMLDivElement>(null);

  // After each render, find code elements with 📄 prefix and add .page-badge class
  useEffect(() => {
    const el = pageContentRef.current;
    if (!el) return;
    el.querySelectorAll('code').forEach((code) => {
      if (code.textContent?.startsWith('📄')) {
        code.classList.add('page-badge');
        // Replace visible text to just the number
        code.textContent = code.textContent.replace('📄', '').trim();
      }
    });
  }, [processedContent]);

  // Handle click on page-tag badges rendered as inline code `📄 Hal. n`
  const handleContentClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'CODE' &&
        (target.classList.contains('page-badge') ||
          target.textContent?.startsWith('📄'))
      ) {
        const pageNum = parseInt(
          target.textContent?.replace(/[^0-9]/g, '') || '',
        );

        if (!isNaN(pageNum)) {
          scrollToPdfPage?.(pageNum);
          onClickPageNumber?.();
        }
      }
    },
    [scrollToPdfPage, onClickPageNumber],
  );

  // Handle clicking a suggested question
  const handleSaranClick = useCallback(
    (q: string) => {
      if (!appendMessages) return;
      if (
        setFirstMessage &&
        (!prevChatMessages || prevChatMessages.length === 0)
      ) {
        setFirstMessage(true);
      }
      appendMessages({
        id: crypto.randomUUID(),
        content: q,
        role: 'user',
        createdAt: new Date(),
      });
    },
    [appendMessages, setFirstMessage, prevChatMessages],
  );

  // ── User bubble ──────────────────────────────────────────────────

  if (isUser) {
    return (
      <Message from="user" className="items-end w-full">
        <MessageContent
          className={cn(
            'rounded-2xl rounded-br-md px-3.5 py-2 text-[13px] text-white leading-relaxed',
            'max-w-[85%] sm:max-w-[80%]',
          )}
          style={{ backgroundColor: mainColor }}
        >
          {isBase64Image ? (
            <div className="rounded-2xl overflow-hidden">
              <Image
                src={
                  message.content.includes('data:image/png;base64')
                    ? message.content.split('=')[0] || '/placeholder.svg'
                    : message.content || '/placeholder.svg'
                }
                className="h-auto max-w-full"
                alt="Bimbelio"
                width={500}
                height={300}
              />
            </div>
          ) : editMessage.index === index ? (
            <SubmitChatEdit />
          ) : (
            <p className="whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
        </MessageContent>
        {!editMessage.bool && message.content && (
          <div className="mt-1 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 flex justify-end">
            <ChatTools messageIndex={index} />
          </div>
        )}
      </Message>
    );
  }

  // ── Assistant bubble (Streamdown / AI Elements) ──────────────────

  return (
    <Message from="assistant" className="w-full">
      <div className="flex gap-2">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${websiteSubCategory?.secondary_color || mainColor})`,
            }}
          >
            <Bot className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 max-w-[90%] sm:max-w-[85%]">
          {/* Name badge */}
          <p className="text-[10px] font-semibold text-gray-400 mb-1 flex items-center gap-1">
            <BimBot />
            <span
              className="px-1 py-px text-[7px] font-extrabold text-white rounded"
              style={{ backgroundColor: mainColor }}
            >
              AI
            </span>
          </p>

          {/* Message body — Streamdown renderer */}
          <MessageContent className="w-full text-[13px] leading-relaxed text-gray-700 max-w-none">
            {isAssistant && isLast && isStreaming && !message.content ? (
              <div className="flex items-center gap-1.5 py-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{
                      backgroundColor: mainColor,
                      animationDelay: `${i * 150}ms`,
                      animationDuration: '0.8s',
                    }}
                  />
                ))}
              </div>
            ) : (
              <div ref={pageContentRef} onClick={handleContentClick}>
                <MessageResponse>
                  {processedContent}
                </MessageResponse>
              </div>
            )}
          </MessageContent>

          {/* Saran Pertanyaan section */}
          {saran && saran.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="text-white w-3 h-3" />
                </div>
                <h3 className="font-semibold text-blue-900 text-xs">
                  Saran Pertanyaan
                </h3>
              </div>
              <div className="space-y-1.5">
                {saran.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full text-left p-2.5 bg-white border border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-gray-700 text-xs leading-relaxed shadow-sm hover:shadow-md"
                    onClick={() => handleSaranClick(q)}
                  >
                    <span className="font-medium text-blue-600 mr-1.5">
                      {i + 1}.
                    </span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!editMessage.bool && message.content && (
            <div
              className={cn(
                'mt-1 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200',
                isLast && !isStreaming && 'opacity-100',
              )}
            >
              <ChatTools messageIndex={index} />
            </div>
          )}
        </div>
      </div>
    </Message>
  );
}
