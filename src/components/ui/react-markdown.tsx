// File: src/components/ui/react-markdown.tsx

import { cn, replaceLatexNotation } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import Image from 'next/image';
import MarkdownView from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface ReactMarkdownProps {
  value: string;
  className?: string;
}

export default function ReactMarkdown({
  value,
  className,
}: ReactMarkdownProps) {
  return (
    <MarkdownView
      className={cn('prose bg-transparent', className)}
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        code({ className, children, ...props }) {
          return (
            <code
              className={className}
              {...props}
            >
              {children}
            </code>
          );
        },
        img({ ...props }) {
          return (
            <div
              className={cn(
                'my-4',
                !props.title && 'w-20',
                // Jika Kamu memiliki judul dengan ukuran tertentu, Kamu dapat menambahkannya di sini.
                // Misalnya:
                // props.title === 'small' && 'w-16',
                // props.title === 'large' && 'w-32',
              )}
            >
              <Image
                style={{ maxWidth: '100%' }}
                alt={props.alt || 'Image'}
                src={props.src as string}
                layout="responsive"
                width={props.width ? Number(props.width) : 200}
                height={props.height ? Number(props.height) : 200}
              />
            </div>
          );
        },
        a({ ...props }) {
          return (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
              {...props}
            />
          );
        },
      }}
    >
      {replaceLatexNotation(value)}
    </MarkdownView>
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
