'use client';

import { MouseEvent } from 'react';
import {
  AreaHighlight,
  Highlight,
  MonitoredHighlightContainer,
  TextHighlight,
  Tip,
  ViewportHighlight,
  useHighlightContainerContext,
  usePdfHighlighterContext,
} from 'react-pdf-highlighter-extended';
import { updateAreaHighlightType } from '../pdf-reader';
import HighlightPopup from './HighlightPopup';

interface HighlightContainerProps {
  onContextMenu?: (
    event: MouseEvent<HTMLDivElement>,
    highlight: ViewportHighlight,
  ) => void;
  docId: string;
  updateAreaHighlight: (payload: updateAreaHighlightType) => any;
  deleteHighlight: (id: string) => void;
  userId: string;
}

const HighlightContainer = ({
  onContextMenu,
  docId,
  updateAreaHighlight,
  deleteHighlight,
  userId,
}: HighlightContainerProps) => {
  const {
    highlight,
    viewportToScaled,
    // screenshot,
    isScrolledTo,
    highlightBindings,
  } = useHighlightContainerContext<Highlight>();
  // const utils = api.useContext();

  // const deleteHighlight = (id: string) => {
  //   // todo check if user has edit/admin access
  //   deleteHighlightMutation({
  //     documentId: docId as string,
  //     highlightId: id,
  //   });
  // };

  console.log(
    'test===========================================================================3',
    highlight,
  );
  const { toggleEditInProgress } = usePdfHighlighterContext();

  // const isTextHighlight = !Boolean(
  //   highlight.content && highlight.content.image,
  // );
  const isTextHighlight = !(highlight.content && highlight.content.image);

  const component = isTextHighlight ? (
    <TextHighlight
      isScrolledTo={isScrolledTo}
      highlight={highlight}
      onContextMenu={(event) =>
        onContextMenu && onContextMenu(event, highlight)
      }
    />
  ) : (
    <AreaHighlight
      isScrolledTo={isScrolledTo}
      highlight={highlight}
      onChange={(boundingRect) => {
        updateAreaHighlight({
          id: highlight.id,
          boundingRect: viewportToScaled(boundingRect),
          userId,
          type: 'IMAGE',
          documentId: docId as string,
          pageNumber: boundingRect.pageNumber,
          // ...(boundingRect.pageNumber
          //   ? { pageNumber: boundingRect.pageNumber }
          //   : {}),
        });
        toggleEditInProgress(false);
      }}
      bounds={highlightBindings.textLayer}
      onContextMenu={(event) =>
        onContextMenu && onContextMenu(event, highlight)
      }
      onEditStart={() => toggleEditInProgress(true)}
    />
  );

  const highlightTip: Tip = {
    position: highlight.position,
    content: (
      <HighlightPopup
        id={highlight.id}
        deleteHighlight={deleteHighlight}
        // hideTip={hideTip}
      />
    ),
  };

  return (
    <MonitoredHighlightContainer
      highlightTip={highlightTip}
      key={highlight.id}
    >
      {component}
    </MonitoredHighlightContainer>
  );
};

export default HighlightContainer;
