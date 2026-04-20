import { PartialBlock } from '@blocknote/core';
import { BlocknoteEditorType } from './latex';

/**
 * Pre-process HTML/Markdown content to consolidate multi-line LaTeX blocks.
 * This prevents BlockNote's HTML parser from splitting $$...$$ blocks across
 * multiple paragraph elements, which would lose \\ line breaks inside
 * environments like \begin{cases}, \begin{matrix}, \begin{aligned}, etc.
 *
 * Also converts \[...\] → $$...$$ and \(...\) → $...$
 */
export function preprocessLatexInValue(value: string): string {
  if (!value || typeof value !== 'string') return value;

  let processed = value;

  // Step 1: Convert \[...\] → $$...$$ and \(...\) → $...$
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_, c) => `$$${c}$$`);
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, c) => `$${c}$`);

  // Step 2: Find $$...$$ blocks and consolidate into single-line LaTeX.
  // When $$...$$ spans across <p>, <br>, or newlines, HTML breaks get
  // inserted inside the LaTeX, splitting environments. We convert these
  // HTML breaks back into LaTeX \\ line breaks and strip stray tags.
  processed = processed.replace(
    /\$\$([\s\S]*?)\$\$/g,
    (_match, content: string) => {
      // If no HTML tags inside, no fixing needed
      if (!/<[^>]+>/.test(content) && !content.includes('\n')) {
        return _match;
      }

      // Replace HTML paragraph/line breaks with newline markers.
      // IMPORTANT: Use </p> alone (not </p><p>) because BlockNote wraps
      // paragraphs in deep nesting: </p></div></div></div><div...><p...>
      // So </p>\s*<p> would NOT match BlockNote's internal HTML structure.
      const cleaned = content
        .replace(/<\/p>/gi, '\n') // every closing </p> = line break
        .replace(/<br\s*\/?>/gi, '\n') // <br> = line break
        .replace(
          /<\/?(div|span|section|article|main|header|td|tr|th|table)[^>]*>/gi,
          '\n',
        ) // block-level tags = line break
        .replace(/<\/?[a-z][^>]*>/gi, '') // strip remaining inline tags
        .trim();

      // Split into non-empty lines
      const lines = cleaned
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length <= 1) {
        return '$$' + cleaned + '$$';
      }

      // Join lines with proper \\ separators, being careful:
      //  - Don't double-add \\ if previous line already ends with \\
      //  - Don't add \\ right before \end{...}
      //  - Don't add \\ right after a standalone \begin{...}
      let result = lines[0];
      for (let i = 1; i < lines.length; i++) {
        const prevTrimmed = result.trimEnd();
        const nextTrimmed = lines[i].trimStart();

        const prevEndsWithBreak = prevTrimmed.endsWith('\\\\');
        const nextIsEnd = nextTrimmed.startsWith('\\end{');
        // Check if prev line ends with \begin{...} (possibly with [...] options)
        const prevEndsWithBegin = /\\begin\{[^}]+\}(\[[^\]]*\])?$/.test(
          prevTrimmed,
        );

        if (prevEndsWithBreak || nextIsEnd || prevEndsWithBegin) {
          result += ' ' + lines[i];
        } else {
          result += ' \\\\ ' + lines[i];
        }
      }

      return '$$' + result + '$$';
    },
  );

  return processed;
}

/**
 * Extract LaTeX formulas from a text string.
 * Supports both $$...$$ (display/block math) and $...$ (inline math).
 * Handles matrix environments like \begin{pmatrix}...\end{pmatrix} correctly.
 */
function processLatexInText(
  text: string,
  styles: Record<string, any>,
): { items: any[]; hasLatex: boolean } {
  const items: any[] = [];
  let hasLatex = false;
  let lastIndex = 0;

  // Match $$...$$ (display math, can be multiline) or $...$ (inline math)
  // $$...$$ is matched first due to alternation order
  const regex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push text before this match
    if (match.index > lastIndex) {
      items.push({
        type: 'text' as const,
        text: text.slice(lastIndex, match.index),
        styles: { ...styles },
      });
    }

    if (match[1] !== undefined) {
      // Display math: $$...$$
      items.push({
        type: 'latex' as const,
        props: { formula: `$$${match[1]}$$`, display: true },
      });
    } else if (match[2] !== undefined) {
      // Inline math: $...$
      items.push({
        type: 'latex' as const,
        props: { formula: `$${match[2]}$`, display: false },
      });
    }

    lastIndex = match.index + match[0].length;
    hasLatex = true;
  }

  // Remaining text after last match
  if (lastIndex < text.length) {
    items.push({
      type: 'text' as const,
      text: text.slice(lastIndex),
      styles: { ...styles },
    });
  }

  return { items: hasLatex ? items : [], hasLatex };
}

/**
 * Normalize formula content: handle newlines from multi-node spanning.
 * Inside environments (\begin{...}), newlines become \\ (LaTeX line breaks).
 * Outside environments, newlines are just whitespace.
 */
function normalizeFormula(formula: string): string {
  const hasEnvironment = /\\begin\{/.test(formula);

  if (hasEnvironment) {
    // Step 0: Restore single \ followed by whitespace to \\ (LaTeX row separator).
    // BlockNote/markdown often strips \\ to \ (treated as escape character).
    // Inside environments like \begin{bmatrix}, a lone \ before whitespace
    // should always be \\ (row separator). (?<!\\) ensures we don't touch
    // already-correct \\ pairs.
    const result = formula.replace(/(?<!\\)\\(?=\s)/g, '\\\\');

    return result
      .replace(/\\\\\s*[\r\n]+\s*/g, ' \\\\ ') // \\ + newlines → \\
      .replace(/[\r\n]+\s*/g, ' \\\\ ') // bare newlines → \\
      .replace(/\\\\\s*\\\\/g, ' \\\\ ') // double \\ → single \\
      .replace(/(\\begin\{[^}]*\})\s*\\\\\s*/g, '$1 ') // no \\ after \begin
      .replace(/\s*\\\\\s*(\\end\{[^}]*\})/g, ' $1') // no \\ before \end
      .replace(/\s+/g, ' ')
      .trim();
  } else {
    return formula
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

/**
 * Process inline content using a character-by-character state machine.
 * This handles formulas that span multiple text nodes, which the regex
 * approach cannot. When BlockNote splits content across nodes (e.g.,
 * different styles, pasted content, or HTML parsing), a formula like
 * $x = 5$ might end up as [{text:"$x = 5"}, {text:"$ world"}].
 * The state machine maintains mode across node boundaries.
 */
function processInlineContent(content: any[]): {
  newContent: any[];
  hasChanges: boolean;
} {
  const out: any[] = [];
  let buf = ''; // plain text buffer
  let latex = ''; // formula content buffer
  let mode: 'text' | 'inline' | 'block' = 'text';
  let currentStyles: Record<string, any> = {};
  let hasChanges = false;

  for (const item of content) {
    // Skip items that are already latex nodes (idempotency)
    if (
      typeof item === 'object' &&
      item !== null &&
      'type' in item &&
      item.type === 'latex'
    ) {
      if (mode !== 'text') {
        // Flush partial formula as text
        out.push({
          type: 'text' as const,
          text: mode === 'block' ? `$$${latex}` : `$${latex}`,
          styles: {},
        });
        latex = '';
        mode = 'text';
      }
      if (buf) {
        out.push({
          type: 'text' as const,
          text: buf,
          styles: { ...currentStyles },
        });
        buf = '';
      }
      out.push(item);
      continue;
    }

    if (
      typeof item === 'object' &&
      item !== null &&
      'type' in item &&
      item.type === 'text' &&
      typeof (item as any).text === 'string'
    ) {
      const { text = '', styles } = item as any;
      currentStyles = styles || {};
      let j = 0;

      while (j < text.length) {
        if (text[j] === '$') {
          // Check for block ($$)
          if (j + 1 < text.length && text[j + 1] === '$') {
            if (mode === 'text') {
              if (buf) {
                out.push({
                  type: 'text' as const,
                  text: buf,
                  styles: { ...currentStyles },
                });
                buf = '';
              }
              mode = 'block';
              latex = '';
            } else if (mode === 'block') {
              // End of block math
              const normalized = normalizeFormula(latex);
              out.push({
                type: 'latex' as const,
                props: { formula: `$$${normalized}$$`, display: true },
              });
              hasChanges = true;
              latex = '';
              mode = 'text';
            }
            j += 2;
            continue;
          } else {
            // Single $
            if (mode === 'text') {
              if (buf) {
                out.push({
                  type: 'text' as const,
                  text: buf,
                  styles: { ...currentStyles },
                });
                buf = '';
              }
              mode = 'inline';
              latex = '';
            } else if (mode === 'inline') {
              // End of inline math
              const normalized = normalizeFormula(latex);
              out.push({
                type: 'latex' as const,
                props: { formula: `$${normalized}$`, display: false },
              });
              hasChanges = true;
              latex = '';
              mode = 'text';
            } else if (mode === 'block') {
              // $ inside block mode — just add to formula
              latex += '$';
            }
            j += 1;
            continue;
          }
        } else {
          if (mode === 'text') {
            buf += text[j];
          } else {
            latex += text[j];
          }
          j++;
        }
      }

      // At end of this text node:
      // If in text mode, flush buffer
      if (mode === 'text' && buf) {
        out.push({
          type: 'text' as const,
          text: buf,
          styles: { ...currentStyles },
        });
        buf = '';
      }
      // If in formula mode, DON'T flush — the formula may continue in the next node.
      // Add a newline to represent the node boundary (normalizeFormula handles these).
      if (mode !== 'text') {
        latex += '\n';
      }
    } else {
      // Non-text, non-latex node (link, hardBreak, image, etc.)
      if (mode !== 'text') {
        // In formula mode — add newline to represent the break
        latex += '\n';
      } else {
        if (buf) {
          out.push({
            type: 'text' as const,
            text: buf,
            styles: { ...currentStyles },
          });
          buf = '';
        }
        out.push(item);
      }
    }
  }

  // Flush remaining
  if (mode !== 'text') {
    // Unclosed delimiter — put back as text (trim trailing \n from node boundaries)
    const rawLatex = latex.replace(/\n+$/, '');
    out.push({
      type: 'text' as const,
      text: mode === 'block' ? `$$${rawLatex}` : `$${rawLatex}`,
      styles: {},
    });
  }
  if (mode === 'text' && buf) {
    out.push({
      type: 'text' as const,
      text: buf,
      styles: { ...currentStyles },
    });
  }

  return { newContent: out, hasChanges };
}

/**
 * Check if a cell is a TableCell object (as opposed to a plain InlineContent[]).
 * BlockNote v0.35 returns table cells as { type: "tableCell", content: [...], props: {...} }
 */
function isTableCellObject(cell: any): boolean {
  return (
    cell !== null &&
    cell !== undefined &&
    typeof cell === 'object' &&
    !Array.isArray(cell) &&
    cell.type === 'tableCell'
  );
}

/**
 * Get the inline content array from a cell, handling both TableCell objects and plain InlineContent[] arrays.
 */
function getCellInlineContent(cell: any): any[] | null {
  if (isTableCellObject(cell)) {
    return Array.isArray(cell.content) ? cell.content : null;
  }
  if (Array.isArray(cell)) {
    return cell;
  }
  return null;
}

/**
 * Process LaTeX in table cells.
 * Tables have content: { type: 'tableContent', rows: [{ cells: TableCell[] | InlineContent[][] }] }
 * Each TableCell is: { type: "tableCell", content: InlineContent[], props: { colspan, rowspan, ... } }
 */
function processLatexInTable(
  block: PartialBlock,
  editor: BlocknoteEditorType,
): boolean {
  try {
    const tableContent = block.content as any;
    if (!tableContent?.rows || tableContent.type !== 'tableContent') {
      return false;
    }

    let tableHasChanges = false;
    const newRows = tableContent.rows.map((row: any) => ({
      cells: row.cells.map((cell: any) => {
        const inlineContent = getCellInlineContent(cell);
        if (!inlineContent) return cell;

        const { newContent, hasChanges } = processInlineContent(inlineContent);
        if (hasChanges) {
          tableHasChanges = true;
          // If the cell was a TableCell object, preserve its structure
          if (isTableCellObject(cell)) {
            return {
              type: 'tableCell' as const,
              content: newContent,
              props: cell.props ? { ...cell.props } : undefined,
            };
          }
          // Otherwise return the processed inline content array
          return newContent;
        }
        return cell;
      }),
    }));

    if (tableHasChanges && block.id) {
      const updateContent: any = {
        type: 'tableContent',
        rows: newRows,
      };
      // Preserve table metadata
      if (tableContent.columnWidths) {
        updateContent.columnWidths = tableContent.columnWidths;
      }
      if (tableContent.headerRows !== undefined) {
        updateContent.headerRows = tableContent.headerRows;
      }
      if (tableContent.headerCols !== undefined) {
        updateContent.headerCols = tableContent.headerCols;
      }

      editor.updateBlock(block.id, {
        type: 'table',
        content: updateContent,
      } as any);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error processing LaTeX in table:', error);
    return false;
  }
}

// Supported block types for regular inline content processing
const INLINE_BLOCK_TYPES = [
  'paragraph',
  'heading',
  'numberedListItem',
  'bulletListItem',
  'checkListItem',
];

// Function to process LaTeX in a block
const processLatexInBlock = (
  block: PartialBlock,
  editor: BlocknoteEditorType,
): boolean => {
  try {
    // Handle table blocks separately
    if (block.type === 'table') {
      return processLatexInTable(block, editor);
    }

    if (!INLINE_BLOCK_TYPES.includes(block.type as string)) {
      return false;
    }

    const content = block.content || [];
    if (!Array.isArray(content)) return false;

    const { newContent, hasChanges } = processInlineContent(content);

    if (hasChanges && block.id) {
      try {
        editor.updateBlock({ id: block.id }, { content: newContent });
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

/**
 * Check whether an inline content array contains any $ delimiter
 */
function inlineContentHasLatex(content: any[]): boolean {
  return content?.some(
    (item: any) =>
      item.type === 'text' &&
      typeof item.text === 'string' &&
      item.text.includes('$'),
  );
}

/**
 * Check whether a table block has LaTeX in any of its cells
 */
function tableHasLatex(block: any): boolean {
  const tableContent = block.content as any;
  if (!tableContent?.rows) return false;
  return tableContent.rows.some((row: any) =>
    row.cells.some((cell: any) => {
      const inlineContent = getCellInlineContent(cell);
      return inlineContent !== null && inlineContentHasLatex(inlineContent);
    }),
  );
}

/**
 * Get the full text content of a block's inline content
 */
function getBlockText(block: any): string {
  const content = block.content;
  if (!Array.isArray(content)) return '';
  return content
    .filter((item: any) => item.type === 'text')
    .map((item: any) => item.text)
    .join('');
}

/**
 * Smart-join two lines of LaTeX text, adding \\ only when needed.
 */
function joinLatexLines(prev: string, next: string): string {
  const prevTrimmed = prev.trimEnd();
  const nextTrimmed = next.trimStart();

  // Don't add \\ if previous line already ends with \\
  if (prevTrimmed.endsWith('\\\\')) return prev + ' ' + next;
  // Don't add \\ right before \end{...}
  if (nextTrimmed.startsWith('\\end{')) return prev + ' ' + next;
  // Don't add \\ right after \begin{...} (even if preceded by other text)
  if (/\\begin\{[^}]+\}(\[[^\]]*\])?$/.test(prevTrimmed)) {
    return prev + ' ' + next;
  }

  return prev + ' \\\\ ' + next;
}

export const processAllLatex = (editor: BlocknoteEditorType) => {
  try {
    let processedCount = 0;

    // First pass: handle multi-block $$...$$ display math.
    // When $$...$$ spans multiple paragraph blocks (e.g., pasted content),
    // merge them into a single block with proper \\ line breaks.
    // Loop until no more merges are found.
    let merged = true;
    while (merged) {
      merged = false;
      const blocks = editor.topLevelBlocks;

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block.type !== 'paragraph' || !Array.isArray(block.content)) {
          continue;
        }

        const text = getBlockText(block);
        const dollarCount = (text.match(/\$\$/g) || []).length;

        // Check: text contains an opening $$ but no closing $$ (unpaired)
        if (dollarCount === 1 && text.trimStart().startsWith('$$')) {
          let mergedText = text;
          let j = i + 1;
          let found = false;

          while (j < blocks.length) {
            const nextBlock = blocks[j];
            if (
              nextBlock.type !== 'paragraph' ||
              !Array.isArray(nextBlock.content)
            )
              break;
            const nextText = getBlockText(nextBlock);

            // Use smart join to add \\ between lines when appropriate
            mergedText = joinLatexLines(mergedText, nextText);

            const totalDollarPairs = (mergedText.match(/\$\$/g) || []).length;
            if (totalDollarPairs >= 2 && totalDollarPairs % 2 === 0) {
              found = true;
              break;
            }
            j++;
          }

          if (found) {
            const { items, hasLatex } = processLatexInText(mergedText, {});
            if (hasLatex) {
              try {
                editor.updateBlock({ id: block.id }, { content: items } as any);
                const blockIdsToRemove: string[] = [];
                for (let k = i + 1; k <= j; k++) {
                  blockIdsToRemove.push(blocks[k].id);
                }
                editor.removeBlocks(blockIdsToRemove);
                processedCount++;
                merged = true; // restart outer loop to find more
                break; // break inner for-loop, re-fetch blocks
              } catch (error) {
                console.error('Error merging multi-block LaTeX:', error);
              }
            }
          }
        }
      }
    }

    // Second pass: process individual blocks (paragraphs, headings, tables, etc.)
    const updatedBlocks = editor.topLevelBlocks;
    updatedBlocks.forEach((block) => {
      let hasLatex = false;

      if (block.type === 'table') {
        hasLatex = tableHasLatex(block);
      } else if (INLINE_BLOCK_TYPES.includes(block.type)) {
        hasLatex = inlineContentHasLatex(block.content as any[]);
      }

      if (hasLatex) {
        const success = processLatexInBlock(block as PartialBlock, editor);
        if (success) {
          processedCount++;
        }
      }
    });

    return processedCount;
  } catch (error) {
    console.error('Error processing all LaTeX:', error);
    return 0;
  }
};

/**
 * Check if a text string has a complete $...$ or $$...$$ formula ready to convert.
 */
const COMPLETE_FORMULA_REGEX = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/;

export const handleKeyDown = (
  e: KeyboardEvent,
  editor: BlocknoteEditorType,
) => {
  if (e.key === ' ' || e.key === 'Enter') {
    const cursorPosition = editor.getTextCursorPosition();
    if (cursorPosition && cursorPosition.block) {
      const block = cursorPosition.block;
      let hasLatex = false;

      if (block.type === 'table') {
        hasLatex = tableHasLatex(block);
      } else {
        hasLatex = inlineContentHasLatex(block.content as any[]);
      }

      if (hasLatex) {
        if (e.key === ' ') {
          // Only prevent space if the block has a COMPLETE formula to convert.
          // Previously, space was always prevented when any $ existed,
          // which made it impossible to type spaces inside formulas like $x + y = z$.
          const text = getBlockText(block);
          if (COMPLETE_FORMULA_REGEX.test(text)) {
            e.preventDefault();
          }
        }

        setTimeout(() => {
          // For Enter key, check if there's an unclosed $$ that might
          // span multiple blocks (e.g., typing multi-line matrix).
          // If so, run the full processAllLatex to trigger the merger.
          if (e.key === 'Enter') {
            const text = getBlockText(block);
            const dollarPairs = (text.match(/\$\$/g) || []).length;
            if (dollarPairs % 2 !== 0) {
              // Unclosed $$ detected — run full merger
              processAllLatex(editor);
              return;
            }
          }
          processLatexInCurrentBlock(editor);
        }, 10);
      }
    }
  }
};

export const handlePaste = (
  _e: ClipboardEvent,
  editor: BlocknoteEditorType,
) => {
  // Multiple passes with increasing delays to handle different paste speeds.
  // BlockNote's paste processing may take varying time depending on content.
  setTimeout(() => processAllLatex(editor), 50);
  setTimeout(() => processAllLatex(editor), 200);
  setTimeout(() => processAllLatex(editor), 500);
};

/**
 * Auto-detect and convert any unconverted $...$ or $$...$$ in the editor.
 * Intended to be called from onChange with debounce as a safety net.
 */
export const autoProcessLatex = (editor: BlocknoteEditorType) => {
  try {
    const blocks = editor.topLevelBlocks;
    let needsProcessing = false;

    for (const block of blocks) {
      if (block.type === 'table') {
        if (tableHasLatex(block)) {
          needsProcessing = true;
          break;
        }
      } else if (INLINE_BLOCK_TYPES.includes(block.type)) {
        if (inlineContentHasLatex(block.content as any[])) {
          needsProcessing = true;
          break;
        }
      }
    }

    if (needsProcessing) {
      processAllLatex(editor);
    }
  } catch {
    // Silently ignore - this is a background safety net
  }
};
