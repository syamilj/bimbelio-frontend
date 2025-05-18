'use client';

import { useChatStore } from '@/lib/store';

import { useEffect, useRef, useState } from 'react';
// import {
//   AreaHighlight,
//   Highlight,
//   PdfHighlighter,
//   PdfLoader,
//   Popup,
// } from 'react-pdf-highlighter';
import { env } from '@/env.mjs';
import { mutateGeneral } from '@/lib/fetch-helper';
import { Cordinate, HighlightTypeEnum } from '@/types/database';
import { Loader2 } from 'lucide-react';
import {
  GhostHighlight,
  PdfHighlighter,
  PdfHighlighterUtils,
  PdfLoader,
  ScaledPosition,
} from 'react-pdf-highlighter-extended';
import ExpandableTip from './_component/ExpandableTip';
import HighlightContainer from './_component/HighlightContainer';

type PdfHighlightType = {
  id: string;
  type?: 'area' | 'text';
  content?: {
    text?: string;
    image?: string;
  };
  position: ScaledPosition;
};

interface HighlightPositionType {
  boundingRect: {
    id?: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    pageNumber: number;
  };
  rects: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    pageNumber: number;
  }[];
  pageNumber: number;
}

const parseIdFromHash = () => document.location.hash.slice(1);

const resetHash = () => {
  document.location.hash = '';
};
type HighlightTypeData = {
  id: string;
  position: {
    boundingRect?: Cordinate;
    rects: Cordinate[];
    pageNumber: number | null;
  };
};

interface AddHighlighType {
  content: {
    text?: string;
    image?: string;
  };
  position: HighlightPositionType;
}

declare global {
  interface Window {
    PdfViewer: any;
  }
}

export type updateAreaHighlightType = {
  userId: string;
  documentId: string;
  id: string;
  boundingRect: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    pageNumber?: number;
  };
  pageNumber: number;
  type: HighlightTypeEnum;
};

function PdfReader({
  docUrl,
  userId,
  getHighlightById,
  addHighlight,
  deleteHighlight,
  highlights,
  docId,
  vision,
  setCurrentPage,
  zoomValue,
  normalSize,
  editPage,
}: {
  docId: string;
  docUrl: string;
  userId: string;
  getHighlightById: (id: string) => HighlightTypeData | undefined;
  addHighlight: ({ content, position }: GhostHighlight) => void;
  deleteHighlight: (id: string) => void;
  highlights: HighlightTypeData[];
  vision: boolean;
  currentPage: any;
  setCurrentPage: any;
  zoomValue: any;
  normalSize: any;
  editPage: boolean;
  setEditPage: any;
}) {
  // const utils = api.useContext();

  const [pdfOff] = useState<number>(1);
  const [pdfOn] = useState<number>(1);

  const [render, setRender] = useState<boolean>(false);
  const highlighterUtilsRef = useRef<PdfHighlighterUtils | undefined>(
    undefined,
  );

  const updateAreaHighlight = async (payload: updateAreaHighlightType) => {
    await mutateGeneral('/highlight/updateAreaHighlight', {
      payload,
      type: 'put',
      onSuccess: () => {
        //       utils.document.getDocData.invalidate();
      },
      onLoading() {
        // await utils.document.getDocData.cancel();
        //       const prevData = utils.document.getDocData.getData();
        //       utils.document.getDocData.setData(
        //         { docId: docId as string, userId: userId as string },
        //         (old: any) => {
        //           if (!old) return undefined;
        //           return {
        //             ...old,
        //             highlights: [
        //               ...old.highlights.filter(
        //                 (highlight: HighlightTypeData) =>
        //                   highlight.id !== newHighlight.id,
        //               ),
        //               {
        //                 ...newHighlight,
        //                 position: {
        //                   boundingRect: newHighlight.boundingRect,
        //                   pageNumber: newHighlight.pageNumber,
        //                   rects: [],
        //                 },
        //               },
        //             ],
        //           };
        //         },
        //       );
        //       return { prevData };
      },
    });
  };

  const scrollViewerTo = (highlight: any) => {};

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      scrollViewerTo(highlight);
    }
  };

  const { sendMessage } = useChatStore();

  useEffect(() => {
    const VisionOn = document.querySelector(
      '#VisionOn .PdfHighlighter',
    ) as HTMLDivElement;

    const VisionOff = document.querySelector(
      '#VisionOff .PdfHighlighter',
    ) as HTMLDivElement;

    if (!VisionOff || !VisionOn) {
      return;
    }
    if (vision) {
      VisionOn?.classList.add('up');
    } else {
      VisionOn?.classList.remove('up');
    }
  }, [vision]);

  useEffect(() => {
    if (window && window.PdfViewer) {
      window.PdfViewer.viewer.enablePrintAutoRotate = vision;
    }
  }, [window.PdfViewer, vision]);

  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/document/pdf?title=${docUrl}`,
        {
          method: 'POST',
        },
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        // console.log(url, docUrl)
        setPdfUrl(url);
        setRender(true);
      } else {
        console.error('Error fetching PDF');
      }
    };

    if (!render) {
      fetchPdf();
    }
  }, [render]);

  useEffect(() => {
    if (highlighterUtilsRef.current) {
      console.log(
        'anjayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
      );
      const pdf = document.querySelector(
        '#VisionOff .PdfHighlighter',
      ) as HTMLDivElement;
      const pages = document.querySelectorAll(
        '#VisionOff .PdfHighlighter .page',
      ) as NodeListOf<HTMLDivElement>;
      pages.forEach((page, i) => {
        page.id = `pdf-page-${i + 1}`;
      });
      const pages2 = document.querySelectorAll(
        '#VisionOn .PdfHighlighter .page',
      ) as NodeListOf<HTMLDivElement>;
      pages2.forEach((page, i) => {
        page.id = `pdf-page-${i + 1}`;
      });

      const handleScrollChangePage = () => {
        // console.log('====');
        const pageNumber =
          highlighterUtilsRef.current?.getViewer()?._currentPageNumber || 1;
        setCurrentPage(pageNumber);
      };

      if (pdf) {
        pdf.addEventListener('scroll', handleScrollChangePage);
      }

      return () => {
        if (pdf) {
          pdf.removeEventListener('scroll', handleScrollChangePage);
        }
      };
    }
  }, [highlighterUtilsRef.current]);

  useEffect(() => {
    if (highlighterUtilsRef.current) {
      const VisionOn = document.querySelector(
        '#VisionOn .PdfHighlighter',
      ) as HTMLDivElement;
      const VisionOff = document.querySelector(
        '#VisionOff .PdfHighlighter',
      ) as HTMLDivElement;
      const ContainerCourse = document.getElementById(
        'container-course',
      ) as HTMLDivElement;
      // console.log(
      //   '==33333===================================================\n',
      //   VisionOn,
      // );
      // console.log(
      //   '==44444===================================================\n',
      //   VisionOff,
      // );

      const handleScrollOff = () => {
        console.log('2222222');
        VisionOn.scrollTop = VisionOff.scrollTop;
        VisionOn.scrollLeft = VisionOff.scrollLeft;
        if (ContainerCourse) {
          ContainerCourse.scrollTop = VisionOff.scrollTop;
          ContainerCourse.scrollLeft = VisionOff.scrollLeft;
        }
      };
      const handleScrollOn = () => {
        // console.log('3333333');
        VisionOff.scrollTop = VisionOn.scrollTop;
        VisionOff.scrollLeft = VisionOn.scrollLeft;
      };

      if (VisionOff && VisionOn) {
        if (!vision && !editPage) {
          VisionOff.addEventListener('scroll', handleScrollOff);
        } else if (vision && !editPage) {
          VisionOn.addEventListener('scroll', handleScrollOn);
        }
      }

      return () => {
        if (VisionOff && VisionOn) {
          VisionOff.removeEventListener('scroll', handleScrollOff);
          VisionOn.removeEventListener('scroll', handleScrollOn);
        }
      };
    }
  }, [vision, editPage, highlighterUtilsRef.current]);

  if (pdfUrl.length === 0) return;
  <div className="flex items-center justify-center h-[80vh] w-full">
    <Loader2 className="w-4 h-4 animate-spin" />
  </div>;

  console.log('zoomValue', zoomValue);
  // console.log('highlighterUtilsRef', highlighterUtilsRef);

  return (
    <>
      <div id="VisionOn">
        <PdfLoader
          document={`${pdfUrl}`}
          workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs"
        >
          {(pdfDocument) => (
            <PdfHighlighter
              enableAreaSelection={() => true}
              pdfDocument={pdfDocument}
              onScrollAway={resetHash}
              utilsRef={(_pdfHighlighterUtils) => {
                highlighterUtilsRef.current = _pdfHighlighterUtils;
              }}
              pdfScaleValue={
                zoomValue === 'page-width' ? zoomValue : parseFloat(zoomValue)
              }
              selectionTip={
                <ExpandableTip
                  addHighlight={addHighlight}
                  sendMessage={sendMessage}
                />
              }
              highlights={highlights as PdfHighlightType[]}
              style={{
                height: 'calc(100% - 41px)',
              }}
            >
              <HighlightContainer
                updateAreaHighlight={updateAreaHighlight}
                deleteHighlight={deleteHighlight}
                docId={docId}
                // onContextMenu={handleContextMenu}
              />
            </PdfHighlighter>
          )}
        </PdfLoader>
      </div>
      <div id="VisionOff">
        <PdfLoader
          document={`${pdfUrl}`}
          workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs"
        >
          {(pdfDocument) => (
            <PdfHighlighter
              enableAreaSelection={() => false}
              pdfDocument={pdfDocument}
              onScrollAway={resetHash}
              utilsRef={(_pdfHighlighterUtils) => {
                highlighterUtilsRef.current = _pdfHighlighterUtils;
              }}
              pdfScaleValue={
                zoomValue === 'page-width' ? zoomValue : parseFloat(zoomValue)
              }
              selectionTip={
                <ExpandableTip
                  addHighlight={addHighlight}
                  sendMessage={sendMessage}
                />
              }
              highlights={highlights as PdfHighlightType[]}
              style={{
                height: 'calc(100% - 41px)',
              }}
            >
              <HighlightContainer
                updateAreaHighlight={updateAreaHighlight}
                deleteHighlight={deleteHighlight}
                docId={docId}
                // onContextMenu={handleContextMenu}
              />
            </PdfHighlighter>
          )}
        </PdfLoader>
      </div>
    </>
  );
}

export default PdfReader;
