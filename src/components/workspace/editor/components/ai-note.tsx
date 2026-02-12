import { useProvider } from '../provider';

export function AINote({ props }: { props: any }) {
  const { editor, setRect } = useProvider();

  return (
    <div
      className="font-regular rounded-3xl px-[12px] py-[6.6px] text-[.8rem] text-black hover:bg-[rgb(239,239,239)]"
      onClick={async () => {
        const blockDiv = document.querySelector(
          `div[data-id="${props.block.id}"]`,
        ) as HTMLElement;
        if (!blockDiv) return;
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(blockDiv);
        selection?.removeAllRanges();
        selection?.addRange(range);
        blockDiv.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        const rect = blockDiv.getBoundingClientRect();
        const top = rect.top + rect.height;
        const left = rect.left;
        const width = rect.width;
        const text = await editor?.blocksToMarkdownLossy([props.block]);
        setRect({
          top,
          left,
          width,
          blockId: props.block.id,
          text: text || '',
        });
      }}
    >
      AI
    </div>
  );
}
