// store.ts

import { create } from 'zustand';

import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
} from '@blocknote/core';
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react';
import { AlertBlock, HighlighBlock, insertAlert } from './store-temp';

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: AlertBlock,
    highlight: HighlighBlock,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
  },
});

export const getSlashMenuItems = (
  editor: BlockNoteEditorType,
): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor),
    insertAlert(editor),
  ];

export type BlockNoteEditorType = typeof schema.BlockNoteEditor;

export type YjsEditorProps = {
  canEdit: boolean;
  userId: string;
  docId: string;
};

type EditorStore = {
  editor: BlockNoteEditorType | null;
  setEditor: (editor: BlockNoteEditorType) => void;
};

export const useBlocknoteEditorStore = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (editor: any) => set({ editor }),
}));

interface ChatMessageStore {
  sendMessage: null | ((message: string) => void);
  setSendMessage: (sendMessage: (message: string) => void) => void;
}
export const useChatStore = create<ChatMessageStore>((set) => ({
  sendMessage: null,
  setSendMessage: (sendMessage: (message: string) => void) =>
    set({ sendMessage }),
}));
