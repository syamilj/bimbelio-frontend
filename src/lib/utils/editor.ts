import { BlockNoteEditor } from '@blocknote/core';

export const ParseMarkdownToHTML = async (
  markdownValue: string,
  editor: BlockNoteEditor,
) => {
  const BlockValye = await editor.tryParseMarkdownToBlocks(markdownValue);
  const HTMLValue = await editor.blocksToFullHTML(BlockValye);

  return HTMLValue;
};

export const ParseHTMLtoMarkdown = async (
  HtmlValue: string,
  editor: BlockNoteEditor,
) => {
  const BlockValye = await editor.tryParseHTMLToBlocks(HtmlValue);
  const MarkdownValue = await editor.blocksToMarkdownLossy(BlockValye);

  return MarkdownValue;
};
