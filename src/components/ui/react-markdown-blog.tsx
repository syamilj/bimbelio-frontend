// File: src/components/ui/react-markdown.tsx

import { cn } from '@/lib/utils';
import { ParseHTMLtoMarkdown } from '@/lib/utils/editor';
import { useCreateBlockNote } from '@blocknote/react';
import 'katex/dist/katex.min.css';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface ReactMarkdownProps {
  value: string;
  className?: string;
}

const heading = 'text-[#3F3F3F] my-[3px] leading-normal font-[700]';

export default function ReactMarkdownBlog({
  value,
  className,
}: ReactMarkdownProps) {
  const editor = useCreateBlockNote();
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

  const [displayValue, setDisplayValue] = useState<string>('');

  // const markdownValue = replaceLatexNotation(value);

  const convertHtmlToMarkdown = async () => {
    const convertValue = await ParseHTMLtoMarkdown(value, editor);
    setDisplayValue(replaceLatexNotation(convertValue));
  };

  // console.log({ markdownValue });
  useEffect(() => {
    convertHtmlToMarkdown();
  }, [value]);

  return (
    <ReactMarkdown
      remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      className={cn(
        'prose break-words ReactMarkdown w-full max-w-[unset]',
        className,
      )}
      components={{
        p: ({ children }) => {
          return (
            <p className="text-[#3F3F3F] text-[16px] my-[3px]">{children}</p>
          );
        },
        h1: ({ children }) => {
          return (
            <h1
              id={slugify(`${children}`)}
              className="text-[#3F3F3F] text-[48px] my-[3px] leading-normal font-[700]"
            >
              {children}
            </h1>
          );
        },
        h2: ({ children }) => {
          return (
            <h2
              id={slugify(`${children}`)}
              className="text-[#3F3F3F] text-[32px] my-[3px] leading-normal font-[700]"
            >
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          return (
            <h3
              id={slugify(`${children}`)}
              className="text-[#3F3F3F] text-[20.8px] my-[3px] leading-normal font-[700]"
            >
              {children}
            </h3>
          );
        },
        strong: ({ children, ...props }) => (
          <strong {...props}>{children}</strong>
        ),
        em: ({ children, ...props }) => <em {...props}>{children}</em>,
      }}
    >
      {displayValue}
    </ReactMarkdown>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase() // Ubah ke huruf kecil
    .trim() // Hilangkan spasi di awal/akhir
    .replace(/[^\w\s-]/g, '') // Hapus karakter non-alfanumerik kecuali spasi & tanda hubung
    .replace(/\s+/g, '-') // Ganti spasi (satu atau lebih) dengan tanda hubung
    .replace(/-+/g, '-'); // Hindari tanda hubung ganda
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
