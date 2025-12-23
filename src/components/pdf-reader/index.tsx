'use client';

import HeaderPdf from '@/components/pdf-reader/_components/header-pdf';
import PdfReader from '@/components/pdf-reader/pdf-reader';
import { useAppContext } from '@/components/provider/provider-app';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { hideVideoLink } from '@/lib/utils';
import { IconDislike, IconLike } from '@/styles/icon';

import { deleteGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { HighlightTypeEnum, Message, Video } from '@/types/database';
import { insertOrUpdateBlock } from '@blocknote/core';
import { createId } from '@paralleldrive/cuid2';
import { useEffect } from 'react';
import { GhostHighlight, Scaled } from 'react-pdf-highlighter-extended';
import { useSession } from '../provider/provider-session-auth';
import { ToolTip } from '../ui/tooltip';
import Provider, { useProvider } from './_provider';

export type DocDataType = {
  id: string;
  website_sub_category_id: string;
  title: string;
  highlights: {
    id: string;
    position: {
      boundingRect?: Scaled;
      rects: Scaled[];
      pageNumber: number | null;
    };
  }[];
  message: Message[];
  premium: boolean;
  url: string;
  video: Video | null;
  userPermissions: {
    canEdit: boolean;
  };
};

type HighlightTypeData = {
  id: string;
  position: {
    boundingRect?: Scaled;
    rects: Scaled[];
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

type Props = {
  canEdit: boolean;
  doc: DocDataType;
  userId: string;
  isCourseDone?: boolean;
};

const DocViewer = ({ canEdit, doc, userId, isCourseDone }: Props) => {
  return (
    <Provider doc={doc}>
      <MainContent
        canEdit={canEdit}
        doc={doc}
        userId={userId}
        isCourseDone={isCourseDone}
      />
    </Provider>
  );
};

const MainContent = ({ canEdit, doc, userId, isCourseDone }: Props) => {
  // const { isReady } = useRouter();

  const { data: session } = useSession();

  const docId = doc?.id;
  const id = doc?.id;
  const url = doc?.url;

  // const utils = api.useContext();
  // const trpc = api.useUtils();

  // const { editor } = useBlocknoteEditorStore();

  const {
    useEditor: { editor },
  } = useAppContext();

  const {
    useHeaderPdf: { setNormalSize, setZoomValue, vision, setCurrentPage },
    useVideo: { hideVideo, setHideVideo, videoUrl, setVideoUrl },
    useHighlights: { setHighlights },
  } = useProvider();

  const addHighlightMutation = async (payload: addHighlightMutationType) => {
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

  const deleteHighlightMutation = async (
    params: deleteHighlightMutationType,
  ) => {
    await deleteGeneral('/highlight/deleteHighlight', {
      params,
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
      onSuccess({ data }) {
        setHighlights(data);
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
      const data = editor?.document
        .map((item: any) => {
          if (item.type === 'highlight') {
            if (item.props.highlightId === id) {
              return { ...item };
            }
          }
        })
        .filter((item: any) => item)[0];
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
        link:
          `${env.NEXT_PUBLIC_SUPABASE_VIDEO_URL}/document/${doc.video.url}` ||
          '',
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

  console.log({ videoUrl });

  if (!doc?.highlights) {
    return;
  }

  return (
    <div
      id="DocViewer"
      className="flex h-full flex-1 flex-col bg-linear-to-br from-slate-50 via-white to-blue-50"
    >
      <HeaderPdf
        doc={doc}
        isCourseDone={isCourseDone}
      />
      <div className={`flex h-full flex-col ${!hideVideo && 'gap-[0]'}`}>
        {doc?.video && (
          <div
            className={
              'relative h-fit w-full shrink-0 overflow-hidden bg-linear-to-r from-slate-100 to-slate-50 duration-300'
            }
          >
            <div
              className={`flex h-full w-full flex-col p-4 pb-0 ${hideVideo && 'mt-[-100%]'} duration-300 ease-in-out`}
            >
              {doc.video && videoUrl !== '' && (
                <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black">
                  <video
                    controls
                    controlsList="nodownload"
                    className="h-fit w-full rounded-2xl bg-black"
                  >
                    <source
                      src={videoUrl}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  {/* Video overlay for modern look */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
                </div>
              )}
              <div className="z-49 flex w-full shrink-0 justify-between px-4 py-4 text-slate-700">
                <div className="flex items-center overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm shadow-sm border border-white/20">
                  <ToolTip value="Like video">
                    <div className="border-r border-slate-200/50 px-4 py-[.5rem] duration-200 hover:bg-white/80 transition-all">
                      <IconLike className="text-slate-600 w-5 h-5" />
                    </div>
                  </ToolTip>
                  <ToolTip value="Dislike video">
                    <div className="px-4 py-[.5rem] duration-200 hover:bg-white/80 transition-all">
                      <IconDislike className="text-slate-600 w-5 h-5" />
                    </div>
                  </ToolTip>
                </div>
                <button
                  className="rounded-xl bg-white/70 backdrop-blur-sm border border-white/20 px-6 py-[.5rem] text-[.85rem] text-slate-700 font-medium duration-200 hover:bg-white hover:shadow-md transition-all"
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
          className={`relative flex-1 w-full bg-white shadow-inner ${vision ? 'ring-2 ring-blue-500 ring-opacity-50' : ''} transition-all duration-300`}
          style={{
            height: 'calc(100vh - 120px)', // Ensure minimum height for mobile
            minHeight: '500px',
          }}
        >
          <div className="relative h-full w-full bg-linear-to-br from-slate-50/30 to-white">
            <PdfReader
              docId={id as string}
              userId={userId as string}
              deleteHighlight={deleteHighlight}
              docUrl={url}
              getHighlightById={getHighlightById}
              addHighlight={addHighlight}
            />
            {hideVideo && doc?.video && (
              <button
                className="absolute right-4 top-4 z-49 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-[.5rem] text-[.85rem] font-medium duration-200 shadow-lg hover:shadow-xl transition-all"
                onClick={() => {
                  setHideVideo(false);
                }}
              >
                Show Video
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocViewer;
