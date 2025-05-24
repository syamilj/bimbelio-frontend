'use client';

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
import { createReactInlineContentSpec } from '@blocknote/react';
import 'katex/dist/katex.min.css';
import { useEffect } from 'react';
import LatexWrapper from 'react-latex-next';
import { handleKeyDown, handlePaste } from './latex-helper';

export default function Latex({
  children,
  editor,
  id,
}: {
  children: React.ReactNode;
  editor: BlocknoteEditorType;
  id: string;
}) {
  useEffect(() => {
    if (!editor) return;

    const editorElement = document.getElementById(id) as
      | HTMLDivElement
      | undefined;
    if (editorElement) {
      editorElement.addEventListener('keydown', (e) => {
        handleKeyDown(e, editor);
      });
      editorElement.addEventListener('paste', (e) => {
        handlePaste(e, editor);
      });
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener('keydown', (e) => {
          handleKeyDown(e, editor);
        });
        editorElement.removeEventListener('paste', (e) => {
          handlePaste(e, editor);
        });
      }
    };
  }, [editor]);

  return <>{children}</>;
}

export type BlocknoteEditorType = BlockNoteEditor<
  BlockSchemaFromSpecs<typeof defaultBlockSpecs>,
  InlineContentSchemaFromSpecs<typeof inlineContentSpecs>,
  StyleSchemaFromSpecs<typeof defaultStyleSpecs>
>;

export const LaTeXInline = createReactInlineContentSpec(
  {
    type: 'latex',
    propSchema: {
      formula: {
        default: '',
      },
      display: {
        default: false,
      },
    },
    content: 'none',
  },
  {
    render: (props) => {
      const { formula } = props.inlineContent.props;

      return (
        <span>
          <span className="hidden">$</span>
          <LatexWrapper>{formula}</LatexWrapper>
          <span className="hidden">$</span>
        </span>
      );
    },
  },
);

const inlineContentSpecs = {
  ...defaultInlineContentSpecs,
  latex: LaTeXInline,
};

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
  },
  inlineContentSpecs,
});

export const BlockNoteImageHtml = (url: string) => {
  return `
    <div class="bn-block-outer" data-node-type="blockOuter" data-id="c5aea8d8-fcfe-4fe4-8f43-8f646445345d">
        <div class="bn-block" data-node-type="blockContainer" data-id="c5aea8d8-fcfe-4fe4-8f43-8f646445345d">
            <div class="bn-block-content" data-content-type="image" data-name="4a769d27-ac12-40d9-be1b-6cd46e8bf7ed-1"
                data-url="${url}"
                data-file-block="" contenteditable="false">
                <div class="bn-file-block-content-wrapper" style="width: fit-content;">
                    <div class="bn-visual-media-wrapper">
                      <img class="bn-visual-media"
                        src="${url}"
                        alt="4a769d27-ac12-40d9-be1b-6cd46e8bf7ed-1" contenteditable="false" draggable="false">
                    </div>
                </div>
            </div>
        </div>
    </div>

`;
};
