import { toaster } from '@/components/ui/toaster';
import { useCompletion } from '@ai-sdk/react';
import { useEffect } from 'react';
import { useProvider } from '../provider';

export function HandleEditor() {
  const { editor } = useProvider();

  const { complete, completion, isLoading, stop } = useCompletion({
    onFinish: () => {
      editor?._tiptapEditor.commands.focus('end');
    },
    onError: () => {
      toaster({
        title: 'Gagal',
        description: 'Coba lagi nanti!',
        condition: 'warning',
        duration: 3000,
      });
    },
  });

  useEffect(() => {
    if (!editor) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.metaKey && e.key === 'z')) {
        stop();

        if (e.key === 'Escape') {
          editor._tiptapEditor.commands.deleteRange({
            from: editor._tiptapEditor.state.selection.from - completion.length,
            to: editor._tiptapEditor.state.selection.from,
          });
        }
        editor._tiptapEditor.commands.insertContent('++');
      }
    };
    const mousedownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
    };
    if (isLoading) {
      document.addEventListener('keydown', onKeyDown);
      window.addEventListener('mousedown', mousedownHandler);
    } else {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', mousedownHandler);
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', mousedownHandler);
    };
  }, [stop, isLoading, editor, complete, completion.length]);

  return null;
}
