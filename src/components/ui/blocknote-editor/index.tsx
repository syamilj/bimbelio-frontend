import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useDebouncedCallback } from 'use-debounce';
import Latex, { schema } from './latex';
import { preprocessLatexInValue, processAllLatex, autoProcessLatex } from './latex-helper';
import './style.css';

async function uploadFile(file: File) {
  //   const convertedFile = await convertFileToBase64(file);

  return file;
}

function BlocknoteEditor({
  value,
  onValueChange,
  viewOnly,
  className,
  isMarkdown,
  type,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  viewOnly?: boolean;
  className?: string;
  isMarkdown?: boolean;
  type?: 'BORDERED';
}) {
  const id = useRef(crypto.randomUUID()).current;
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const editor = useCreateBlockNote({
    schema,
    // uploadFile,
  });

  const getValue = async (value?: string) => {
    if (value === undefined) return;
    if (!isFocused) {
      // Pre-process to consolidate multi-line LaTeX before BlockNote parsing
      const processed = preprocessLatexInValue(value);
      let initialValue;
      if (isMarkdown) {
        initialValue = await editor.tryParseMarkdownToBlocks(processed);
      } else {
        initialValue = await editor.tryParseHTMLToBlocks(processed);
      }
      const ids = editor.document.map((item) => item.id);
      editor.replaceBlocks(ids, initialValue);
      // Multiple passes to ensure LaTeX is processed after ProseMirror settles.
      // Also handles cases where content takes longer to finalize.
      setTimeout(() => processAllLatex(editor), 50);
      setTimeout(() => processAllLatex(editor), 200);
      setTimeout(() => processAllLatex(editor), 500);
    }
  };

  // Debounced auto-detect for LaTeX conversion as a safety net.
  // Catches any $...$ or $$...$$ that wasn't converted by keydown/paste handlers.
  const debouncedAutoProcess = useDebouncedCallback(() => {
    autoProcessLatex(editor);
  }, 300);

  const handleOnChange = useDebouncedCallback(async () => {
    if (!onValueChange) return;

    let newValue;
    if (isMarkdown) {
      newValue = await editor.blocksToMarkdownLossy(editor.document);
    } else {
      newValue = await editor.blocksToFullHTML(editor.document);
    }
    onValueChange(newValue);
  }, 1000);

  useEffect(() => {
    getValue(value);
  }, [value]);

  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const editorElement = editor.domElement;

    if (editorElement) {
      editorElement.addEventListener('focus', handleFocus);
      editorElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener('focus', handleFocus);
        editorElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [editor]);

  // useEffect(() => {
  //   editor.
  // }, [editor]);

  return (
    <Latex
      editor={editor}
      id={id}
    >
      <BlockNoteView
        id={id}
        className={cn(
          viewOnly && 'viewOnly',
          className && className,
          type === 'BORDERED' &&
            'rounded-3xl border border-input px-3 py-2 shadow-sm',
        )}
        editor={editor}
        theme={'light'}
        onChange={async () => {
          handleOnChange();
          debouncedAutoProcess();
        }}
        editable={viewOnly ? false : true}
      />
    </Latex>
  );
}

export default dynamic(() => Promise.resolve(BlocknoteEditor), { ssr: false });
