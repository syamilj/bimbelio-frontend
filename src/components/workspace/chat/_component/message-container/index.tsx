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
    return rowHeights.current[index] + 16 || 82;
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
    <div className="absolute left-0 top-0 h-full w-full pb-[1rem] pl-[1rem]">
      {showButtonScroll && (
        <div
          id="scrollBottom"
          className="absolute bottom-[90px] right-4 z-[100] cursor-pointer duration-200 md:hover:scale-105"
          onClick={() => {
            scrollToBottom();
            setShowButtonScroll(false);
          }}
        >
          <IconTailedArrowNext
            w={25}
            className="rotate-90 rounded-[.5rem] bg-main p-[.3rem] text-white"
          />
        </div>
      )}
      <AutoSizer>
        {({ height, width }) => (
          <List
            className="List messageContainer relative"
            height={height - 74}
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
