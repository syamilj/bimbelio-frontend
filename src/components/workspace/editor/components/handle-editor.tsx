import { useSession } from '@/components/provider/provider-session-auth';
import { toaster } from '@/components/ui/toaster';
import { useCompletion } from 'ai/react';
import { useCallback, useEffect } from 'react';
import { useProvider } from '../provider';

export function HandleEditor() {
  const { docId, editor, setChange } = useProvider();

  const { data: session } = useSession();
  const userId = session?.user.id;
  // const { data: getNotesQuery } = api.notes.getNotes.useQuery(
  //   { userId, docId },
  //   { refetchOnWindowFocus: false },
  // );

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

  const handleDeleteAllBlocks = useCallback(async () => {
    if (!editor) {
      return;
    }

    const allBlockIds = editor.document.map((block: any) => ({
      id: block.id,
    }));

    if (allBlockIds.length > 0) {
      try {
        editor.removeBlocks(allBlockIds);
      } catch (error) {
        console.error('Error removing blocks:', error);
      }
    } else {
      console.warn('No blocks to remove');
    }
  }, [editor]);

  // const [getNotesQuery, setGetNotesQuery] = useState<any>();

  // useEffect(() => {
  //   if (!userId || !docId) return;
  //   getGeneral('/notes/getNotes', {
  //     setData: setGetNotesQuery,
  //     params: { userId, docId },
  //     toast: {
  //       hideError: true,
  //     },
  //   });
  // }, [userId, docId]);

  // const getValue = async (value: string) => {
  //   const HtmlValue = await editor.tryParseHTMLToBlocks(value);
  //   const ids = editor.document.map((item) => item.id);
  //   editor.replaceBlocks(ids, HtmlValue);
  // };

  // useEffect(() => {
  //   if (!editor) return;
  //   // setEditor(editor);
  //   // const localNote = localStorage.getItem(`notes-${docId}-${session?.user}`);
  //   // setTimeout(() => {
  //   //   if (getNotesQuery) {
  //   //     if (localNote) {
  //   //       setChange(true);
  //   //       handleDeleteAllBlocks();
  //   //       setChange(true);
  //   //       const localNoteJson = JSON.parse(localNote).filter(
  //   //         (item: any) => item.content.length > 0,
  //   //       );
  //   //       try {
  //   //         editor.insertBlocks(
  //   //           localNoteJson,
  //   //           { id: editor.document[0]?.id },
  //   //           'before',
  //   //         );
  //   //       } catch (error) {
  //   //         console.error('Error inserting blocks:', error);
  //   //       }

  //   //       //streamCompletion();
  //   //     } else {
  //   //       setChange(false);
  //   //       handleDeleteAllBlocks();
  //   //       setChange(false);
  //   //       const data: any = getNotesQuery;
  //   //       try {
  //   //         editor.insertBlocks(
  //   //           data.content,
  //   //           { id: editor.document[0]?.id },
  //   //           'before',
  //   //         );
  //   //       } catch (error) {
  //   //       }
  //   //       setChange(false);
  //   //     }
  //   //   } else if (!getNotesQuery && localNote) {
  //   //     setChange(true);
  //   //     handleDeleteAllBlocks();
  //   //     setChange(true);
  //   //     const localNoteJson = JSON.parse(localNote).filter(
  //   //       (item: any) => item.content.length > 0,
  //   //     );
  //   //     try {
  //   //       editor.insertBlocks(
  //   //         localNoteJson,
  //   //         { id: editor.document[0]?.id },
  //   //         'before',
  //   //       );
  //   //     } catch (error) {
  //   //       console.error('Error inserting blocks:', error);
  //   //     }
  //   //   }
  //   // }, 500);

  //   if (getNotesQuery) {
  //     const HtmlContent = getNotesQuery.content;
  //     getValue(HtmlContent);
  //   }
  // }, [getNotesQuery]);

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
