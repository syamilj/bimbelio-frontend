import { useSession } from '@/components/provider/provider-session-auth';
import AiPopover from '@/components/workspace/editor/custom/ai/popover';
import { IconBook } from '@/styles/icon';
import {
  BlockNoteEditor,
  filterSuggestionItems,
  PartialBlock,
} from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import {
  BlockColorsItem,
  DefaultReactSuggestionItem,
  DragHandleMenu,
  getDefaultReactSlashMenuItems,
  SideMenu,
  SideMenuController,
  SuggestionMenuController,
  useCreateBlockNote,
} from '@blocknote/react';
import '@blocknote/react/style.css';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { AINote } from './components/ai-note';
import { DeleteNote } from './components/delete-note';
import { HandleEditor } from './components/handle-editor';
import { SaveNote } from './components/save-note';
import Provider, { BlocknoteEditorType, schema, useProvider } from './provider';

type Props = { docId: string };

export default function Editor({
  docId,
  editor,
  setEditor,
  value,
}: {
  docId: string;
  editor: BlocknoteEditorType | null;
  setEditor: Dispatch<SetStateAction<BlocknoteEditorType | null>>;
  value?: string;
}) {
  const initialEditor = useCreateBlockNote({
    schema,
  });

  useEffect(() => {
    if (!editor) {
      setEditor(initialEditor);
    }
  }, [initialEditor, editor]);

  return (
    <Provider
      docId={docId}
      editor={editor}
      value={value}
    >
      <MainContent docId={docId} />
    </Provider>
  );
  // <div className="">awd</div>
}

function MainContent({ docId }: Props) {
  const { editorRef, editor, rect, change, setChange } = useProvider();
  const { data: session } = useSession();

  const handleOnChange = () => {
    if (!editor) return;
    if (!change && editor.document.length > 1) {
      setChange(true);
    }
    if (editor.document.length > 1) {
      localStorage.setItem(
        `notes-${docId}-${session?.user}`,
        JSON.stringify(editor.document),
      );
    }
  };

  if (!editor) return null;

  return (
    <>
      <HandleEditor />
      <div
        id="Notes"
        ref={editorRef}
      >
        <BlockNoteView
          sideMenu={false}
          onChange={handleOnChange}
          className="w-full flex-1"
          theme="light"
          editor={editor}
          slashMenu={false}
        >
          <SuggestionMenuController
            triggerCharacter={'/'}
            getItems={async (query) => {
              return filterSuggestionItems(
                getCustomSlashMenuItems(editor),
                query,
              );
            }}
          />
          <SideMenuController
            sideMenu={(props) => (
              <div className="my-auto flex h-max items-center">
                <SideMenu
                  {...props}
                  dragHandleMenu={(props) => (
                    <DragHandleMenu {...props}>
                      <DeleteNote props={props} />
                      <AINote props={props} />
                      <BlockColorsItem {...props}>Colors</BlockColorsItem>
                    </DragHandleMenu>
                  )}
                />
              </div>
            )}
          />
          {rect && <AiPopover />}
        </BlockNoteView>
        {change && <SaveNote />}
      </div>
    </>
  );
}

const getCustomSlashMenuItems = (editor: any): DefaultReactSuggestionItem[] => [
  // ...getDefaultReactSlashMenuItems(editor).filter(
  //   (item: any, i: number) => i !== 8 && i !== 9 && i !== 10 && i !== 11,
  // ),
  ...getDefaultReactSlashMenuItems(editor),
  insertHelloWorldItem(editor),
];

const insertHelloWorldItem = (editor: BlockNoteEditor) => ({
  title: 'Insert Hello',
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;

    const helloWorldBlock: PartialBlock = {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Hello!', styles: { bold: true } }],
    };

    editor.insertBlocks([helloWorldBlock], currentBlock, 'after');
  },
  aliases: ['helloworld', 'hw'],
  group: 'Other',
  icon: <IconBook w={18} />,

  subtext: 'Used to insert a block with Hello World below.',
});
