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
import Provider, { BlocknoteEditorType, schema, useProvider } from './provider';

type Props = {
  onChange?: (editor: BlocknoteEditorType | null) => void;
};

export default function Editor({
  docId,
  editor,
  setEditor,
  value,
  onChange,
}: {
  docId: string;
  editor: BlocknoteEditorType | null;
  setEditor: Dispatch<SetStateAction<BlocknoteEditorType | null>>;
  value?: string;
  onChange?: (editor: BlocknoteEditorType | null) => void;
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
      <MainContent onChange={onChange} />
    </Provider>
  );
  // <div className="">awd</div>
}

function MainContent({ onChange }: Props) {
  const { editorRef, editor, rect, change, setChange } = useProvider();

  const handleOnChange = (editor: BlocknoteEditorType | null) => {
    if (!editor) return;
    if (!change && editor.document.length > 1) {
      setChange(true);
    }
    if (onChange && change) onChange(editor);
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
        {/* {change && <SaveNote />} */}
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
