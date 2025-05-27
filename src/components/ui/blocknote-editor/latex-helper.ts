import { PartialBlock } from '@blocknote/core';
import { BlocknoteEditorType } from './latex';

// Function to process LaTeX in a block
const processLatexInBlock = (
  block: PartialBlock,
  editor: BlocknoteEditorType,
) => {
  try {
    if (
      block.type !== 'paragraph' &&
      block.type !== 'numberedListItem' &&
      block.type !== 'bulletListItem' &&
      block.type !== 'checkListItem'
    ) {
      return false;
    }

    const content = block.content || [];
    if (!Array.isArray(content)) return false;

    let hasChanges = false;
    const newContent = [];
    let buffer = '';
    let inLatex = false;
    let inBlockLatex = false;
    let latexContent = '';
    let consecutiveDollars = 0;

    for (let i = 0; i < content.length; i++) {
      const item = content[i];

      if (
        typeof item === 'object' &&
        item !== null &&
        'type' in item &&
        item.type === 'text'
      ) {
        const text = item.text || '';
        const styles = item.styles || {};

        for (let j = 0; j < text.length; j++) {
          const char = text[j];

          if (char === '$') {
            consecutiveDollars++;

            if (consecutiveDollars === 2 && !inLatex && !inBlockLatex) {
              if (buffer.length > 0) {
                newContent.push({
                  type: 'text',
                  text: buffer,
                  styles: { ...styles },
                });
                buffer = '';
              }
              inBlockLatex = true;
              latexContent = '';
              consecutiveDollars = 0;
            } else if (consecutiveDollars === 2 && inBlockLatex) {
              inBlockLatex = false;
              if (latexContent.length > 0) {
                newContent.push({
                  type: 'latex',
                  props: {
                    formula: `$${latexContent}$`,
                    display: true,
                  },
                });
                hasChanges = true;
              } else {
                buffer += '$$' + latexContent + '$$';
              }
              latexContent = '';
              consecutiveDollars = 0;
            } else if (consecutiveDollars === 1) {
              if (!inLatex && !inBlockLatex) {
                if (buffer.length > 0) {
                  newContent.push({
                    type: 'text',
                    text: buffer,
                    styles: { ...styles },
                  });
                  buffer = '';
                }
                inLatex = true;
                latexContent = '';
              } else if (inLatex) {
                inLatex = false;
                if (latexContent.length > 0) {
                  newContent.push({
                    type: 'latex',
                    props: {
                      formula: `$${latexContent}$`,
                      display: false,
                    },
                  });
                  hasChanges = true;
                } else {
                  buffer += latexContent;
                }
                latexContent = '';
              }
            }
          } else {
            consecutiveDollars = 0;

            if (inLatex || inBlockLatex) {
              latexContent += char;
            } else {
              buffer += char;
            }
          }
        }

        if (!inLatex && !inBlockLatex && buffer.length > 0) {
          newContent.push({
            type: 'text',
            text: buffer,
            styles: { ...styles },
          });
          buffer = '';
        }
      } else {
        newContent.push(item);
      }
    }

    if ((inLatex || inBlockLatex) && latexContent.length > 0) {
      newContent.push({
        type: 'text',
        text: (inBlockLatex ? '$$' : '$') + latexContent,
        styles: {},
      });
    }

    if (hasChanges) {
      try {
        if (block.id) {
          editor.updateBlock({ id: block.id }, { content: newContent });
        }

        return true;
      } catch (error) {
        console.error('Error updating block:', error);
      }
    }

    return false;
  } catch (error) {
    console.error('Error processing LaTeX in block:', error);
    return false;
  }
};

const processLatexInCurrentBlock = (editor: BlocknoteEditorType) => {
  try {
    const cursorPosition = editor.getTextCursorPosition();
    if (!cursorPosition || !cursorPosition.block) {
      return;
    }

    const currentBlock = cursorPosition.block;

    processLatexInBlock(currentBlock as PartialBlock, editor);
  } catch (error) {
    console.error('Error processing LaTeX:', error);
  }
};

export const processAllLatex = (editor: BlocknoteEditorType) => {
  try {
    const blocks = editor.topLevelBlocks;
    let processedCount = 0;

    console.log({ blocks });

    blocks.forEach((block) => {
      if (
        block.type === 'paragraph' ||
        block.type === 'numberedListItem' ||
        block.type === 'bulletListItem' ||
        block.type === 'checkListItem'
      ) {
        const isTextItem = (
          item: unknown,
        ): item is { type: 'text'; text: string; styles?: any } =>
          typeof item === 'object' &&
          item !== null &&
          'type' in item &&
          (item as any).type === 'text';

        const hasLatex = block.content?.some((item) => {
          return isTextItem(item) && item.text.includes('$');
        });

        if (hasLatex) {
          const success = processLatexInBlock(block as PartialBlock, editor);
          if (success) {
            processedCount++;
          }
        }
      }
    });

    return processedCount;
  } catch (error) {
    console.error('Error processing all LaTeX:', error);
    return 0;
  }
};

export const handleKeyDown = (
  e: KeyboardEvent,
  editor: BlocknoteEditorType,
) => {
  if (e.key === ' ' || e.key === 'Enter') {
    // Check if there's LaTeX to process
    const cursorPosition = editor.getTextCursorPosition();
    if (cursorPosition && cursorPosition.block) {
      const blockContent = cursorPosition.block.content || [];

      const isTextItem = (
        item: unknown,
      ): item is { type: 'text'; text: string; styles?: any } =>
        typeof item === 'object' &&
        item !== null &&
        'type' in item &&
        (item as any).type === 'text';

      const hasLatex = (blockContent as { text: string; type: string }[])?.some(
        (item) => {
          return isTextItem(item) && item.text.includes('$');
        },
      );

      if (hasLatex) {
        if (e.key === ' ') {
          e.preventDefault();
        }

        setTimeout(() => {
          processLatexInCurrentBlock(editor);
        }, 10);
      }
    }
  }
};

export const handlePaste = (e: ClipboardEvent, editor: BlocknoteEditorType) => {
  setTimeout(() => {
    processAllLatex(editor);
  }, 100);
};
