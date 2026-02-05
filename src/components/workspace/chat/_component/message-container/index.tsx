import { useCallback, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

  const scrollToBottom = useCallback(() => {
    if (listRef.current && messageData.length > 0) {
      // Single smooth scroll without multiple calls
      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollToItem(messageData.length - 1, 'end');
        }
      });
    }
  }, [messageData.length]);

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
    <div className="relative h-full w-full">
      {showButtonScroll && (
        <button
          id="scrollBottom"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-slate-300 active:scale-95"
          onClick={() => {
            scrollToBottom();
            setShowButtonScroll(false);
          }}
        >
          <ChevronDown className="w-4 h-4 text-slate-600" />
          <span className="text-xs font-medium text-slate-600">Pesan baru</span>
        </button>
      )}
      <AutoSizer>
        {({ height, width }) => (
          <List
            className="List messageContainer"
            height={height}
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
            overscanCount={5}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}
