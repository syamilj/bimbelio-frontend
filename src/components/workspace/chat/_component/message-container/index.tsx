import { IconTailedArrowNext } from '@/styles/icon';
import { useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import { useProvider } from '../../provider';
import Row from './row';

export default function MessageContainer() {
  const { messageData } = useProvider();

  const [showButtonScroll, setShowButtonScroll] = useState<boolean>(true);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  const listRef = useRef<any>(null);
  const rowHeights: any = useRef({});

  const getRowHeight = (index: any) => {
    // Add extra height when loading is active for the last message
    const baseHeight = rowHeights.current[index] + 16 || 82;

    // Check if this is the last message and loading is active
    const isLastMessage = index === messageData.length - 1;
    const isUserMessage = messageData[index]?.role === 'user';

    // Add extra space for loading component
    if (isLastMessage && isUserMessage) {
      return baseHeight + 100; // Extra space for loading component
    }

    return baseHeight;
  };
  const scrollToBottom = () => {
    listRef.current?.scrollToItem(messageData.length - 1, 'end');
  };

  const handleScroll = ({ scrollOffset, scrollHeight, clientHeight }: any) => {
    const scrollPercentage =
      (scrollOffset / (scrollHeight - clientHeight)) * 100;
    if (scrollPercentage > 98) {
      setShowButtonScroll(false);
    } else {
      setShowButtonScroll(true);
    }
  };

  return (
    <div className="absolute left-0 top-0 h-full w-full z-0">
      {showButtonScroll && (
        <div
          id="scrollBottom"
          className="fixed bottom-[200px] right-4 z-[9999] cursor-pointer duration-200 md:hover:scale-105"
          onClick={() => {
            scrollToBottom();
            setShowButtonScroll(false);
          }}
        >
          <IconTailedArrowNext
            w={25}
            className="rotate-90 rounded-full bg-main p-[.3rem] text-white"
          />
        </div>
      )}
      <AutoSizer>
        {({ height, width }) => (
          <List
            className="List messageContainer relative"
            height={height - 180}
            itemCount={messageData.length}
            itemSize={getRowHeight}
            ref={listRef}
            width={width}
            onScroll={({ scrollOffset, scrollUpdateWasRequested }) => {
              if (listRef.current && !scrollUpdateWasRequested) {
                const scrollHeight = listRef.current._outerRef.scrollHeight;
                const clientHeight = listRef.current._outerRef.clientHeight;
                handleScroll({
                  scrollOffset,
                  scrollHeight,
                  clientHeight,
                });
              }
            }}
            itemData={{
              listRef,
              rowHeights,
              setShowButtonScroll,
              firstRender,
              setFirstRender,
              scrollToBottom,
            }}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}
