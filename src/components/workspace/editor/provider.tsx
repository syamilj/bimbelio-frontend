'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { LaTeXInline } from '@/components/ui/blocknote-editor/latex';
import {
  BlockNoteEditor,
  BlockNoteSchema,
  BlockSchemaFromSpecs,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
  InlineContentSchemaFromSpecs,
  StyleSchemaFromSpecs,
} from '@blocknote/core';
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react';
import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AiPopoverPropsRect } from './custom/ai/popover';
import { AlertBlock, insertAlert } from './custom/alert';
import { HighlighBlock } from './custom/highlight';

type Props = {
  children: React.ReactNode;
  docId: string;
  editor: BlocknoteEditorType | null;
  value?: string;
};

export default function Provider({ children, docId, editor, value }: Props) {
  const { change, setChange } = useAppContext();
  const { data: session } = useSession();
  const userId = session?.user.id;

  // const editor = useCreateBlockNote({
  //   schema,
  // });

  const [rect, setRect] = useState<AiPopoverPropsRect | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  // const [getNotesQuery, setGetNotesQuery] = useState<any>();

  // useEffect(() => {
  //   if (!userId || !docId) return;
  //   getGeneral('/notes/getNotes', {
  //     setData: setGetNotesQuery,
  //     params: { userId, docId },
  //     toast: {
  //       hideError: true,
  //     },
  //     onError() {
  //       getValue(`<></>`);
  //     },
  //   });
  // }, [userId, docId]);

  // useEffect(() => {
  //   if (!editor) return;
  //   console.log({ getNotesQuery });
  //   if (getNotesQuery) {
  //     const HtmlContent = getNotesQuery.content;
  //     getValue(HtmlContent);
  //   }
  // }, [getNotesQuery]);

  useEffect(() => {
    if (value !== undefined) {
      getValue(value);
    }
  }, [value]);

  const getValue = async (value: string) => {
    if (!editor) return;
    const HtmlValue = await editor.tryParseHTMLToBlocks(value);
    console.log({ HtmlValue });
    const ids = editor.document.map((item) => item.id);
    editor.replaceBlocks(ids, HtmlValue);
  };

  const Context = {
    editor,
    docId,
    change,
    setChange,
    rect,
    setRect,
    editorRef,
  };

  return (
    <ProviderContext.Provider value={Context}>
      {/* {!editor ? <div>Loading...</div> : <>{children}</>} */}
      {children}
    </ProviderContext.Provider>
  );
}

const ProviderContext = createContext<undefined | ProviderType>(undefined);

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within an ProviderContext');
  }
  return context;
};

type ProviderType = {
  editor: BlocknoteEditorType | null;
  docId: string;
  change: boolean;
  setChange: Dispatch<SetStateAction<boolean>>;
  rect: AiPopoverPropsRect;
  setRect: Dispatch<SetStateAction<AiPopoverPropsRect>>;
  editorRef: RefObject<HTMLDivElement | null>;
};

const inlineContentSpecs = {
  ...defaultInlineContentSpecs,
  latex: LaTeXInline,
};

const blockSpecs = {
  ...defaultBlockSpecs,
  alert: AlertBlock,
  highlight: HighlighBlock,
};

export const schema = BlockNoteSchema.create({
  blockSpecs,
  inlineContentSpecs,
});

export type BlocknoteEditorType = BlockNoteEditor<
  BlockSchemaFromSpecs<typeof blockSpecs>,
  InlineContentSchemaFromSpecs<typeof inlineContentSpecs>,
  StyleSchemaFromSpecs<typeof defaultStyleSpecs>
>;

export const getSlashMenuItems = (
  editor: BlocknoteEditorType,
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertAlert(editor),
];
