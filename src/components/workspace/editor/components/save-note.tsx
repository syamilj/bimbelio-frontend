import { useSession } from '@/components/provider/provider-session-auth';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper';
import { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useProvider } from '../provider';

export function SaveNote() {
  const { editor, docId, setChange } = useProvider();
  const { data: session } = useSession();
  // const { mutateAsync: saveNoteMutation } = api.notes.saveNote.useMutation();

  const saveNoteMutation = async (payload: { content: any }) => {
    mutateGeneral('/notes/saveNote', {
      payload: {
        docId,
        content: payload.content,
        userId: session?.user.id,
      },
      toast: {
        hideSuccess: true,
      },
      type: 'post',
    });
  };

  const saveNoteToDb = useDebouncedCallback(async () => {
    if (!editor) return;
    try {
      // const data = editor.document;
      let length = 0;
      editor.document.forEach((item: any) => {
        if (item.content[0]) length = item.content[0].text.length;
      });
      const data = await editor.blocksToFullHTML(editor.document);
      if (length < 25000) {
        localStorage.removeItem(`notes-${docId}-${session?.user}`);
        await saveNoteMutation({
          content: data,
        });

        setChange(false);
      } else {
        toaster({
          title: 'Upss',
          description: 'Maksimal 1000 karakter input chat!',
          condition: 'warning',
          duration: 2000,
        });
      }
    } catch (error) {
      return;
    }
  }, 1000);

  useEffect(() => {
    saveNoteToDb();
  }, [editor?.document]);

  return <></>;
  // return (
  //   <button
  //     id="saveNoteSubmit"
  //     className="fixed bottom-[1rem] right-[1rem] rounded-[.8rem] bg-main px-[1rem] py-[.5rem] text-white duration-300 hover:bg-main-hover active:bg-main md:absolute"
  //     onClick={saveNoteToDb}
  //   >
  //     Save
  //   </button>
  // );
}
