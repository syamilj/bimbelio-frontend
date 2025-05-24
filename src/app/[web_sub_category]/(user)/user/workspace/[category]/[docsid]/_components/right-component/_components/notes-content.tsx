import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import Editor from '@/components/workspace/editor';
import { getGeneral } from '@/lib/fetch-helper';
import { useEffect, useState } from 'react';

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
    console.log({ getNotesQuery });
    if (getNotesQuery) {
      const HtmlContent = getNotesQuery.content;
      setValue(HtmlContent);
    }
  }, [getNotesQuery]);

  return (
    <Editor
      docId={docId}
      editor={editor}
      setEditor={setEditor}
      value={value}
    />
  );
}
