// index.tsx
import HeaderPdf from '@/components/pdf-reader/_component/header-pdf';
import PdfReader from '@/components/pdf-reader/pdf-reader';
import { useAppContext } from '@/components/provider/provider-app';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { useBlocknoteEditorStore } from '@/lib/store';
import { hideVideoLink } from '@/lib/utils';
import { IconDislike, IconLike } from '@/styles/icon';

import { deleteGeneral, mutateGeneral } from '@/lib/fetch-helper';
import { Cordinate, HighlightTypeEnum } from '@/types/database';
import { insertOrUpdateBlock } from '@blocknote/core';
import { createId } from '@paralleldrive/cuid2';
import { useEffect, useState } from 'react';
import { GhostHighlight } from 'react-pdf-highlighter-extended';
import { useSession } from '../provider/session-provider-auth';
import { ToolTip } from '../ui/tooltip';
import { DocDataType } from '../workspace';

type HighlightTypeData = {
  id: string;
  position: {
    boundingRect?: Cordinate;
    rects: Cordinate[];
    pageNumber: number | null;
  };
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

const DocViewer = ({
  canEdit,
  doc,
  userId,
  isCourseDone,
}: {
  canEdit: boolean;
  doc: DocDataType;
  userId: string;
  isCourseDone?: boolean;
}) => {
  // const { isReady } = useRouter();

  const { data: session } = useSession();

  const docId = doc?.id;
  const id = doc?.id;
  const url = doc?.url;

  // const utils = api.useContext();
  // const trpc = api.useUtils();

  const { editor } = useBlocknoteEditorStore();

  const { normalSize, setNormalSize, zoomValue, setZoomValue, vision } =
    useAppContext();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchPdf, setSearchPdf] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [hideVideo, setHideVideo] = useState<boolean>(false);
  const [editPage, setEditPage] = useState<boolean>(false);

  const addHighlightMutation = async (payload: addHighlightMutationType) => {
    await mutateGeneral('/highlight/add', {
      payload,
      type: 'post',
      onSuccess: () => {
        //     utils.document.getDocData.invalidate();
        //     trpc.notes.getNotes.refetch();
      },
      onLoading() {
        //     await utils.document.getDocData.cancel();
        //     const prevData = utils.document.getDocData.getData();
        //     utils.document.getDocData.setData(
        //       { docId: docId as string, userId: userId as string },
        //       (old: any) => {
        //         if (!old) return null;
        //         return {
        //           ...old,
        //           highlights: [
        //             ...old.highlights,
        //             {
        //               id: newHighlight.id,
        //               position: {
        //                 boundingRect: newHighlight.boundingRect,
        //                 rects: newHighlight.rects,
        //                 pageNumber: newHighlight.pageNumber,
        //               },
        //             },
        //           ],
        //         };
        //       },
        //     );
        //     return { prevData };
      },
    });
  };

  const deleteHighlightMutation = async (
    payload: deleteHighlightMutationType,
  ) => {
    await deleteGeneral('/highlight/delete', {
      onLoading() {
        //     await utils.document.getDocData.cancel();
        //     const prevData = utils.document.getDocData.getData();
        //     utils.document.getDocData.setData(
        //       { docId: docId as string, userId: userId as string },
        //       (old: any) => {
        //         if (!old) return undefined;
        //         return {
        //           ...old,
        //           highlights: old.highlights.filter(
        //             (highlight: HighlightTypeData) =>
        //               highlight.id !== oldHighlight.highlightId,
        //           ),
        //         };
        //       },
        //     );
        //     return { prevData };
      },
      onSuccess() {
        //     utils.document.getDocData.invalidate();
      },
    });
  };

  const addHighlightToNotes = async (
    content: string,
    highlightId: string,
    type: HighlightTypeEnum,
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

    if (!canEdit) {
      toaster({
        title: 'Gagal',
        description: 'Pengguna tidak dapat mengedit dokumen ini!',
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

  const getHighlightById = (id: string): HighlightTypeData | undefined => {
    return doc?.highlights?.find(
      (highlight: HighlightTypeData) => highlight.id === id,
    );
  };

  const addHighlight = async ({ content, position }: GhostHighlight) => {
    try {
      const highlightId = createId();

      if (!content.text && !content.image) return;
      const isTextHighlight = !content.image;

      addHighlightMutation({
        id: highlightId,
        userId: session?.user.id || '',
        boundingRect: position.boundingRect,
        type: isTextHighlight ? 'TEXT' : 'IMAGE',
        documentId: docId as string,
        pageNumber: position.boundingRect.pageNumber,
        rects: position.rects,
      });
      // addNote(content.text, highlightId)

      if (isTextHighlight) {
        if (!content.text) return;
        addHighlightToNotes(content.text, highlightId, 'TEXT');
      } else {
        if (!content.image) return;
        addHighlightToNotes(content.image, highlightId, 'IMAGE');
      }
    } catch (error) {
      toaster({
        title: 'Gagal',
        description: 'Gagal menambahkan highlight!',
        condition: 'warning',
        duration: 3000,
      });
    }
  };

  const deleteHighlight = async (id: string) => {
    try {
      deleteHighlightMutation({
        documentId: docId as string,
        highlightId: id,
        userId: session?.user.id || '',
      });
      console.log('id : ', id);
      const data = editor?.document
        .map((item: any) => {
          if (item.type === 'highlight') {
            if (item.props.highlightId === id) {
              return { ...item };
            }
          }
        })
        .filter((item: any) => item)[0];
      console.log('data : ', editor?.document);
      console.log('data2 : ', data?.id);
      editor?.removeBlocks([data?.id]);
    } catch (error) {
      toaster({
        title: 'Gagal',
        description: `${error}`,
        condition: 'warning',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const scrollToHighlightFromHash = () => {};

    window.addEventListener('hashchange', scrollToHighlightFromHash, false);

    return () => {
      window.removeEventListener('hashchange', scrollToHighlightFromHash);
    };
  }, []);

  useEffect(() => {
    if (doc.video?.url) {
      hideVideoLink({
        link: `${env.NEXT_PUBLIC_SUPABASE_VIDEO_URL}/${doc.video.url}` || '',
        setUrl: setVideoUrl,
      });
    }
    if (!doc.video) {
      setHideVideo(true);
    }
  }, []);

  useEffect(() => {
    if (window && window.PdfViewer) {
      setZoomValue(`${window.PdfViewer.viewer._currentScale}`);
      setNormalSize(`${window.PdfViewer.viewer._currentScale}`);
      setCurrentPage(window.PdfViewer.viewer.currentPageNumber);
    }
  }, [window.PdfViewer]);

  if (!doc?.highlights) {
    return;
  }

  return (
    <div
      id="DocViewer"
      className="flex h-full flex-1 flex-col"
    >
      <HeaderPdf
        doc={doc}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        editPage={editPage}
        setEditPage={setEditPage}
        searchPdf={searchPdf}
        setSearchPdf={setSearchPdf}
        isCourseDone={isCourseDone}
      />
      <div className={`flex h-full flex-col ${!hideVideo && 'gap-[0]'}`}>
        {doc?.video && (
          <div
            className={
              'relative h-fit w-full shrink-0 overflow-hidden bg-bg-workspace duration-300'
            }
          >
            <div
              className={`flex h-full w-full flex-col p-[1rem] pb-0 ${hideVideo && 'mt-[-100%]'} duration-300 ease-in-out`}
            >
              {doc.video && videoUrl !== '' && (
                <video
                  controls
                  controlsList="nodownload"
                  className="h-fit w-full rounded-[.8rem] bg-black"
                >
                  <source
                    src={videoUrl}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="z-[49] flex w-full shrink-0 justify-between px-[1rem] py-[.5rem] text-black">
                <div className="flex items-center overflow-hidden rounded-[1rem] bg-[rgba(0,0,0,0.05)]">
                  <ToolTip value="Like video">
                    <div className="border-r border-main-gray-input px-[1rem] py-[.3rem] duration-200 hover:bg-[rgba(0,0,0,0.15)]">
                      <IconLike className="text-main-gray-text2" />
                    </div>
                  </ToolTip>
                  <ToolTip value="Dislike video">
                    <div className="p-[.5rem] px-[1rem] py-[.3rem] duration-200 hover:bg-[rgba(0,0,0,0.15)]">
                      <IconDislike className="text-main-gray-text2" />
                    </div>
                  </ToolTip>
                </div>
                <button
                  className="rounded-[1rem] border border-main-gray-input px-[1rem] text-[.8rem] text-main-gray-text duration-200 hover:border-main hover:bg-main hover:text-white"
                  onClick={() => setHideVideo(true)}
                >
                  Hide Video
                </button>
              </div>
            </div>
          </div>
        )}
        <div
          id="DocumentViewPdf"
          className={`relative h-full w-full border-[2px] bg-bg-workspace ${vision ? 'border-main' : 'border-transparent'} `}
        >
          {}
          <div className="relative h-full w-full bg-bg-workspace">
            <PdfReader
              docId={id as string}
              userId={userId as string}
              deleteHighlight={deleteHighlight}
              docUrl={url}
              getHighlightById={getHighlightById}
              addHighlight={addHighlight}
              highlights={doc.highlights ?? []}
              vision={vision}
              zoomValue={zoomValue}
              normalSize={normalSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              editPage={editPage}
              setEditPage={setEditPage}
            />
            {hideVideo && doc?.video && (
              <button
                className="absolute right-[1rem] top-0 z-[49] rounded-[1rem] border border-main-gray-input px-[1rem] py-[.3rem] text-[.8rem] text-main-gray-text duration-200 hover:border-main hover:bg-main hover:text-white"
                onClick={() => {
                  setHideVideo(false);
                }}
              >
                Show video
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocViewer;
