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

const LaTeXInline = createReactInlineContentSpec(
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
