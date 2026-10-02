'use client';

import { useChatStore } from '@/lib/store';

import { useEffect, useState } from 'react';
// import {
//   AreaHighlight,
//   Highlight,
//   PdfHighlighter,
//   PdfLoader,
//   Popup,
// } from 'react-pdf-highlighter';
import { env } from '@/env.mjs';
import { authHeaders } from '@/lib/auth-helper';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { HighlightTypeEnum } from '@/types/database';
import { Loader2 } from 'lucide-react';
import {
  GhostHighlight,
  PdfHighlighter,
  PdfLoader,
  Scaled,
  ScaledPosition,
} from 'react-pdf-highlighter-extended';
import { useDebouncedCallback } from 'use-debounce';
import ExpandableTip from './_components/ExpandableTip';
import HighlightContainer from './_components/HighlightContainer';
import { useProvider } from './_provider';

type PdfHighlightType = {
  id: string;
  type?: 'area' | 'text';
  content?: {
    text?: string;
    image?: string;
  };
  position: ScaledPosition;
};

const resetHash = () => {
  document.location.hash = '';
};
type HighlightTypeData = {
  id: string;
  position: {
    boundingRect?: Scaled;
    rects: Scaled[];
    pageNumber: number | null;
  };
};

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
  // getHighlightById,
  // addHighlight,
  // deleteHighlight,
  docId,
}: {
  docUrl: string;
  userId: string;
  getHighlightById: (id: string) => HighlightTypeData | undefined;
  addHighlight: ({ content, position }: GhostHighlight) => void;
  deleteHighlight: (id: string) => void;
  docId: string;
}) {
  const {
    useHeaderPdf: { zoomValue, vision },
    useHighlights: {
      highlighterUtilsRef,
      addHighlight,
      deleteHighlight,
      highlights,
    },
  } = useProvider();

  const updateAreaHighlight = async (payload: updateAreaHighlightType) => {
    await mutateGeneral('/highlight/updateAreaHighlight', {
      payload,
      type: 'patch',
      onSuccess: () => {
        //       utils.document.getDocData.invalidate();
      },
      onLoading() {},
    });
  };

  const { sendMessage } = useChatStore();

  const [pdfUrl, setPdfUrl] = useState<string>('');
  const fetchPdf = useDebouncedCallback(async () => {
    const response = await fetch(
      `${env.NEXT_PUBLIC_SUPABASE_PDF_URL}/document/${docUrl}`,
      {
        method: 'GET',
        // Bucket pdf bersifat privat: backend memverifikasi sesi.
        headers: authHeaders(),
        credentials: 'include',
      },
    );
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } else {
      console.error('Error fetching PDF');
    }
  }, 500);

  useEffect(() => {
    if (docUrl) {
      // Revoke previous blob URL to prevent memory leaks
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl('');
      }
      fetchPdf();
    }
  }, [docUrl]);

  if (pdfUrl.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-50 to-white">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-blue-200 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Loading Document
            </h3>
            <p className="text-gray-600">Preparing your PDF for viewing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div
        id="VisionOn"
        className="h-full w-full"
        style={{ display: vision ? 'block' : 'none' }}
      >
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
                height: '100%',
                minHeight: 'calc(100vh - 120px)', // Account for header height - VisionOn
                width: '100%',
              }}
            >
              <HighlightContainer
                updateAreaHighlight={updateAreaHighlight}
                deleteHighlight={deleteHighlight}
                docId={docId}
                userId={userId}
                // onContextMenu={handleContextMenu}
              />
            </PdfHighlighter>
          )}
        </PdfLoader>
      </div>

      <div
        id="VisionOff"
        className="h-full w-full"
        style={{ display: !vision ? 'block' : 'none' }}
      >
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
                height: '100%',
                minHeight: 'calc(100vh - 120px)', // Account for header height - VisionOff
                width: '100%',
              }}
            >
              <HighlightContainer
                updateAreaHighlight={updateAreaHighlight}
                deleteHighlight={deleteHighlight}
                docId={docId}
                userId={userId}
                // onContextMenu={handleContextMenu}
              />
            </PdfHighlighter>
          )}
        </PdfLoader>
      </div>
    </div>
  );
}

export default PdfReader;
