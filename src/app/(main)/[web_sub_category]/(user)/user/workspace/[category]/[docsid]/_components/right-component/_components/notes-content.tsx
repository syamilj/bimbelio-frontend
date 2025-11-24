import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import Editor from '@/components/workspace/editor';
import { BlocknoteEditorType } from '@/components/workspace/editor/provider';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  docId: string;
};

export default function NotesContent({ docId }: Props) {
  const {
    useEditor: { editor, setEditor },
  } = useAppContext();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [value, setValue] = useState<string>('');
  const [getNotesQuery, setGetNotesQuery] = useState<any>();

  useEffect(() => {
    if (!userId || !docId) return;
    getGeneral('/notes/getNotes', {
      setData: setGetNotesQuery,
      params: { userId, docId },
      toast: {
        hideError: true,
      },
      onError() {
        setValue('');
      },
    });
  }, [userId, docId]);

  useEffect(() => {
    if (!editor) return;
    if (getNotesQuery) {
      const HtmlContent = getNotesQuery.content;
      setValue(HtmlContent);
    }
  }, [getNotesQuery]);

  const { mutate } = useMutation('/notes/saveNote', 'post', {
    // toast: { hideSuccess: true },
  });

  const saveNoteMutation = useDebouncedCallback(
    async (editor: BlocknoteEditorType | null) => {
      if (!editor) return;
      const data = await editor.blocksToFullHTML(editor.document);
      await mutate({
        payload: {
          docId,
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
        saveNoteMutation(editor);
      }}
    />
  );
}
