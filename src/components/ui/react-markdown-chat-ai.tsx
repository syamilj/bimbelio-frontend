// File: src/components/ui/react-markdown.tsx

import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
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
      .replace(/\\\[/g, '$$$') // Replace \[ -> $$
      .replace(/\\\]/g, '$$$') // Replace \] -> $$
      .replace(/\\\(/g, '$$$') // Replace \( -> $$
      .replace(/\\\)/g, '$$$'); // Replace \) -> $$
  };

  const processPageTags = (content: React.ReactNode): React.ReactNode => {
    if (typeof content !== 'string') {
      // Rekursif ke child
      return React.Children.map(content, (child) =>
        typeof child === 'string' ? processPageTags(child) : child,
      );
    }

    const parts = content.split(/(<PAGE#\d+>)/g);
    return parts.map((part, idx) => {
      if (part.match(/<PAGE#\d+>/)) {
        const pageNum = part.match(/\d+/)?.[0] ?? '';
        return (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="mx-0.5 px-1.5 py-0.5 h-5 rounded-full text-[10px] align-super font-semibold bg-blue-100 hover:bg-blue-200 border-blue-200"
                  onClick={() => {
                    if (scrollToPdfPage) {
                      scrollToPdfPage(parseInt(pageNum, 10));
                    }
                    if (onClickPageNumber) {
                      onClickPageNumber();
                    }
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

  const formatMessage = (content: string) => {
    // Hanya contoh: Memastikan <PAGE#(x)>
    return content.replace(
      /<PAGE#(\d+)>/g,
      (_match, pageNum) => `<PAGE#${pageNum}>`,
    );
  };
  return (
    <ReactMarkdown
      remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      className={cn('prose break-words ReactMarkdown', className)}
      components={{
        p: ({ node, children, ...props }) => {
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
              ].includes(child?.type),
          );

          if (hasBlockChild) {
            return <div {...props}>{processPageTags(children)}</div>;
          }
          return <p {...props}>{processPageTags(children)}</p>;
        },
        h1: ({ children, ...props }) => (
          <h1 {...props}>{processPageTags(children)}</h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 {...props}>{processPageTags(children)}</h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 {...props}>{processPageTags(children)}</h3>
        ),
        h4: ({ children, ...props }) => (
          <h4 {...props}>{processPageTags(children)}</h4>
        ),
        h5: ({ children, ...props }) => (
          <h5 {...props}>{processPageTags(children)}</h5>
        ),
        h6: ({ children, ...props }) => (
          <h6 {...props}>{processPageTags(children)}</h6>
        ),
        li: ({ children, ...props }) => (
          <li {...props}>{processPageTags(children)}</li>
        ),
        strong: ({ children, ...props }) => (
          <strong {...props}>{processPageTags(children)}</strong>
        ),
        em: ({ children, ...props }) => (
          <em {...props}>{processPageTags(children)}</em>
        ),
      }}
    >
      {formatMessage(replaceLatexNotation(value))}
    </ReactMarkdown>
  );
}

// // File: src/components/ui/react-markdown.tsx

// import { cn, replaceLatexNotation } from '@/lib/utils';
// import 'katex/dist/katex.min.css';
// import Image from 'next/image';
// import MarkdownView from 'react-markdown';
// import rehypeKatex from 'rehype-katex';
// import rehypeRaw from 'rehype-raw';
// import remarkGfm from 'remark-gfm';
// import remarkMath from 'remark-math';

// interface ReactMarkdownProps {
//   value: string;
//   className?: string;
// }

// const remarkMathOptions = {
//   singleDollarTextMath: false,
// };

// export default function ReactMarkdown({
//   value,
//   className,
// }: ReactMarkdownProps) {
//   return (
//     <MarkdownView
//       className={cn('prose bg-transparent', className)}
//       remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
//       rehypePlugins={[rehypeKatex, rehypeRaw]}
//       components={{
//         code({ className, children, ...props }) {
//           return (
//             <code
//               className={className}
//               {...props}
//             >
//               {children}
//             </code>
//           );
//         },
//         img({ ...props }) {
//           return (
//             <div
//               className={cn(
//                 'my-4',
//                 !props.title && 'w-20',
//                 // Jika Kamu memiliki judul dengan ukuran tertentu, Kamu dapat menambahkannya di sini.
//                 // Misalnya:
//                 // props.title === 'small' && 'w-16',
//                 // props.title === 'large' && 'w-32',
//               )}
//             >
//               <Image
//                 style={{ maxWidth: '100%' }}
//                 alt={props.alt || 'Image'}
//                 src={props.src as string}
//                 layout="responsive"
//                 width={props.width ? Number(props.width) : 200}
//                 height={props.height ? Number(props.height) : 200}
//               />
//             </div>
//           );
//         },
//         a({ ...props }) {
//           return (
//             <a
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 underline"
//               {...props}
//             />
//           );
//         },
//       }}
//     >
//       {replaceLatexNotation(value)}
//     </MarkdownView>
//   );
// }
