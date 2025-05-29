import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { Button } from '@/components/ui/button';
import { SpinnerPageCentered } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
  loading: () => <SpinnerPageCentered />,
});

type Props = {
  value?: string;
  onChange?: (value: string) => any;
};

export default function BlogEditor({ value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      // Tidak perlu setIsFullscreen di sini karena listener akan menangani
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('grid grid-cols-2 w-full border bg-white relative')}
    >
      <Button
        onClick={toggleFullscreen}
        className="absolute top-2 right-2"
      >
        {!isFullscreen ? 'Fullscreen' : 'Exit Fullscren'}
      </Button>
      <div
        ref={editorRef}
        className={cn(
          'border rounded-lg p-8 h-[70vh] overflow-y-auto',
          isFullscreen && 'h-full',
        )}
        onScroll={() => {
          if (!editorRef.current || !previewRef.current) return;

          const editor = editorRef.current;
          const preview = previewRef.current;

          const scrollRatio =
            editor.scrollTop / (editor.scrollHeight - editor.clientHeight);

          preview.scrollTop =
            scrollRatio * (preview.scrollHeight - preview.clientHeight);
        }}
      >
        <BlocknoteEditor
          value={value}
          onValueChange={onChange}
        />
      </div>

      <div
        ref={previewRef}
        className={cn('h-[70vh] overflow-y-auto', isFullscreen && 'h-full')}
        onScroll={() => {
          if (!editorRef.current || !previewRef.current) return;

          const editor = editorRef.current;
          const preview = previewRef.current;

          const scrollRatio =
            preview.scrollTop / (preview.scrollHeight - preview.clientHeight);

          editor.scrollTop =
            scrollRatio * (editor.scrollHeight - editor.clientHeight);
        }}
      >
        <MarkdownPreview
          source={value}
          remarkPlugins={[
            [
              remarkMath,
              {
                singleDollarTextMath: false,
              },
            ],
            remarkGfm,
          ]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          wrapperElement={{ 'data-color-mode': 'light' }}
          className="ReactMarkdown max-w-none break-words leading-7 text-main-black p-4 "
        />
      </div>
    </div>
  );
}
