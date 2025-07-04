import { toaster } from '@/components/ui/toaster';
import { BlocknoteEditorType } from '@/components/workspace/editor/provider';
import { deleteGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { HighlightTypeEnum } from '@/types/database';
import { insertOrUpdateBlock } from '@blocknote/core';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useProvider } from '.';
import { DocDataType } from '..';

export const addHighlightMutation = async (
  payload: addHighlightMutationType,
  setHighlights: Dispatch<SetStateAction<DocDataType['highlights']>>,
) => {
  await mutateGeneral('/highlight/addHighlight', {
    payload,
    type: 'post',
    onSuccess: ({ data }) => {
      //     utils.document.getDocData.invalidate();
      //     trpc.notes.getNotes.refetch();
      setHighlights(data);
    },
  });
};

export const deleteHighlightMutation = async (
  params: deleteHighlightMutationType,
  setHighlights: Dispatch<SetStateAction<DocDataType['highlights']>>,
) => {
  await deleteGeneral('/highlight/deleteHighlight', {
    params,
    onSuccess({ data }) {
      setHighlights(data);
      //     utils.document.getDocData.invalidate();
    },
  });
};

export const addHighlightToNotes = async (
  content: string,
  highlightId: string,
  type: HighlightTypeEnum,
  editor: BlocknoteEditorType | null,
) => {
  if (!editor) {
    toaster({
      title: 'Gagal',
      description: 'Terjadi kesalahan!',
      condition: 'warning',
      duration: 3000,
    });
    return;
  }

  if (type === 'TEXT') {
    if (!content || !highlightId) return;
    insertOrUpdateBlock(editor, {
      content,
      props: {
        highlightId,
        textAlignment: 'justify',
      },
      type: 'highlight',
    });
  } else {
    if (!content || !highlightId) return;

    try {
      insertOrUpdateBlock(editor, {
        props: {
          url: content,
          textAlignment: 'center',
        },
        type: 'image',
      });
    } catch (err: any) {
      err;
    }
  }
};

export type addHighlightMutationType = {
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
  rects: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    pageNumber?: number;
  }[];
  pageNumber: number;
  type: HighlightTypeEnum;
};

export type deleteHighlightMutationType = {
  highlightId: string;
  documentId: string;
  userId: string;
};

export const PdfHelper = () => {
  const {
    useHighlights: { highlighterUtilsRef },
    useHeaderPdf: { vision, editPage, setCurrentPage },
  } = useProvider();

  // Enhanced page detection with better timing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 10;

    const waitForPdfAndSetupPages = () => {
      const setupPages = () => {
        const pagesOff = document.querySelectorAll(
          '#VisionOff .PdfHighlighter .page',
        ) as NodeListOf<HTMLDivElement>;
        const pagesOn = document.querySelectorAll(
          '#VisionOn .PdfHighlighter .page',
        ) as NodeListOf<HTMLDivElement>;

        pagesOff.forEach((page, i) => {
          page.id = `pdf-page-${i + 1}`;
        });

        pagesOn.forEach((page, i) => {
          page.id = `pdf-page-${i + 1}`;
        });

        return pagesOff.length > 0 || pagesOn.length > 0;
      };

      const pagesFound = setupPages();
      retryCount++;

      if (!pagesFound && retryCount < maxRetries) {
        timeoutId = setTimeout(waitForPdfAndSetupPages, 500 * retryCount);
      } else if (pagesFound) {
        setupScrollListeners();
      }
    };

    const setupScrollListeners = () => {
      const pdf = document.querySelector(
        '#VisionOff .PdfHighlighter',
      ) as HTMLDivElement;
      const pdfOn = document.querySelector(
        '#VisionOn .PdfHighlighter',
      ) as HTMLDivElement;

      const handleScrollChangePage = () => {
        if (editPage) return;

        const container = vision ? pdfOn : pdf;
        if (!container) return;

        const pages = document.querySelectorAll(
          `#${vision ? 'VisionOn' : 'VisionOff'} .page`,
        ) as NodeListOf<HTMLDivElement>;

        if (pages.length === 0) return;

        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;

        let currentPageNumber = 1;
        let minDistance = Infinity;

        pages.forEach((page, index) => {
          const pageRect = page.getBoundingClientRect();
          const pageCenter = pageRect.top + pageRect.height / 2;
          const distance = Math.abs(pageCenter - containerCenter);

          if (
            pageRect.bottom > containerRect.top &&
            pageRect.top < containerRect.bottom
          ) {
            if (distance < minDistance) {
              minDistance = distance;
              currentPageNumber = index + 1;
            }
          }
        });

        setCurrentPage(currentPageNumber);
      };

      // Add scroll listeners
      if (pdf) {
        pdf.addEventListener('scroll', handleScrollChangePage, {
          passive: true,
        });
      }
      if (pdfOn) {
        pdfOn.addEventListener('scroll', handleScrollChangePage, {
          passive: true,
        });
      }

      // Initial page detection
      setTimeout(handleScrollChangePage, 500);

      return () => {
        if (pdf) {
          pdf.removeEventListener('scroll', handleScrollChangePage);
        }
        if (pdfOn) {
          pdfOn.removeEventListener('scroll', handleScrollChangePage);
        }
      };
    };

    // Start the setup process
    waitForPdfAndSetupPages();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [highlighterUtilsRef.current, vision, setCurrentPage, editPage]);

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

      const handleScrollOff = () => {
        VisionOn.scrollTop = VisionOff.scrollTop;
        VisionOn.scrollLeft = VisionOff.scrollLeft;
        if (ContainerCourse) {
          ContainerCourse.scrollTop = VisionOff.scrollTop;
          ContainerCourse.scrollLeft = VisionOff.scrollLeft;
        }
      };
      const handleScrollOn = () => {
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

  return <></>;
};
