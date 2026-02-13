import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { toaster } from '@/components/ui/toaster';
import Editor from '@/components/workspace/editor';
import { BlocknoteEditorType } from '@/components/workspace/editor/provider';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useProvider } from '../../../_provider/provider';

type Props = {
  docId: string;
};

export default function NotesContent({ docId }: Props) {
  const {
    useEditor: { editor, setEditor },
  } = useAppContext();
  const {
    useParams: { categoryId },
  } = useProvider();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [value, setValue] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: getNotesQuery } = useGet('/notes/getNotesForCourse', {
    params: { userId, courseCategoryId: categoryId },
    toast: { hideError: true },
    onError({ message, status }) {
      if (status !== 404) {
        toaster({
          title: 'Error',
          condition: 'warning',
          description: message,
          duration: 3000,
        });
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (getNotesQuery) {
      const HtmlContent = getNotesQuery.content;
      setValue(HtmlContent);
      // Mark as initialized after a short delay to prevent onChange firing on initial load
      setTimeout(() => setIsInitialized(true), 500);
    } else {
      setIsInitialized(true);
    }
  }, [getNotesQuery]);

  const { mutate } = useMutation('/notes/saveNoteForCourse', 'post', {
    toast: { hideSuccess: true },
  });

  const saveNoteMutation = useDebouncedCallback(
    async (editor: BlocknoteEditorType | null) => {
      if (!editor) return;
      const data = await editor.blocksToFullHTML(editor.document);
      await mutate({
        payload: {
          courseCategoryId: categoryId,
          content: data,
          userId: session?.user.id,
        },
      });
    },
    1000,
  );

  return (
    <Editor
      docId={docId}
      editor={editor}
      setEditor={setEditor}
      value={value}
      onChange={(editor) => {
        if (isInitialized && value.length > 0) {
          saveNoteMutation(editor);
        }
      }}
    />
  );
}
