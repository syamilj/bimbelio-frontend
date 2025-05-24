import { toaster } from '@/components/ui/toaster';
import { BlocknoteEditorType } from '@/components/workspace/editor/provider';
import { deleteGeneral, mutateGeneral } from '@/lib/fetch-helper';
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
    console.log('jalan1');
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
      console.log('jalan2');
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

  useEffect(() => {
    if (highlighterUtilsRef.current) {
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
