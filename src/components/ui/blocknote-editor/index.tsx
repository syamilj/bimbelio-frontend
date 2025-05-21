import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useDebouncedCallback } from 'use-debounce';
import Latex, { schema } from './latex';
import { processAllLatex } from './latex-helper';
import './style.css';

async function uploadFile(file: File) {
  //   const convertedFile = await convertFileToBase64(file);
  console.log({ file });

  return file;
}

function BlocknoteEditor({
  value,
  onValueChange,
  viewOnly,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  viewOnly?: boolean;
}) {
  const id = crypto.randomUUID();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const editor = useCreateBlockNote({
    schema,
    // uploadFile,
  });

  const getValue = async (value?: string) => {
    if (value === undefined) return;
    if (!isFocused) {
      const markdownValue = await editor.tryParseMarkdownToBlocks(value);
      console.log({ value, markdownValue, editor: editor.document });
      const ids = editor.document.map((item) => item.id);
      editor.replaceBlocks(ids, markdownValue);
      processAllLatex(editor);
    }
  };

  const handleOnChange = useDebouncedCallback(async () => {
    if (!onValueChange) return;

    const value = await editor.blocksToMarkdownLossy(editor.document);
    onValueChange(value);
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

  return (
    <Latex
      editor={editor}
      id={id}
    >
      <BlockNoteView
        id={id}
        className={cn(viewOnly && 'viewOnly')}
        editor={editor}
        theme={'light'}
        onChange={async () => {
          handleOnChange();
        }}
        editable={viewOnly ? false : true}
      />
    </Latex>
  );
}

export default dynamic(() => Promise.resolve(BlocknoteEditor), { ssr: false });
