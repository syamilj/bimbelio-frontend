'use client';

import HeaderPdf from '@/components/pdf-reader/_components/header-pdf';
import PdfReader from '@/components/pdf-reader/pdf-reader';
import { useAppContext } from '@/components/provider/provider-app';
import { toaster } from '@/components/ui/toaster';

import { env } from '@/env.mjs';
import { useVideoHLS } from '@/hooks/use-hls-video';
import { deleteGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { HighlightTypeEnum, Message, Video } from '@/types/database';
import { insertOrUpdateBlock } from '@blocknote/core';
import { createId } from '@paralleldrive/cuid2';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
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
  const searchParams = useSearchParams();
  const subChapterId = searchParams?.get('sub') || '';

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

  // useEffect(() => {
  //   if (doc.video?.url) {
  //     hideVideoLink({
  //       link:
  //         `${env.NEXT_PUBLIC_SUPABASE_VIDEO_URL}/document/${doc.video.url}` ||
  //         '',
  //       setUrl: setVideoUrl,
  //     });
  //   }
  //   if (!doc.video) {
  //     setHideVideo(true);
  //   }
  // }, []);

  const { videoRef } = useVideoHLS(
    `${env.NEXT_PUBLIC_SUPABASE_VIDEO_URL}/document/${doc.video?.url}`,
  );

  const videoData = doc.video as (Video & {
    rating?: number;
    starReview?: number;
    reviewCount?: number;
    totalReviews?: number;
  }) | null;

  const starRating =
    typeof videoData?.rating === 'number'
      ? videoData.rating
      : typeof videoData?.starReview === 'number'
        ? videoData.starReview
        : 4.9;

  const reviewCount =
    typeof videoData?.reviewCount === 'number'
      ? videoData.reviewCount
      : typeof videoData?.totalReviews === 'number'
        ? videoData.totalReviews
        : null;

  const { data: userRatingData, isLoading: isLoadingUserRating, refetch } =
    useGet<{ id: string; value: number }>('/course/getUserRatingBySubChapterId', {
      params: { subChapterId },
      enabled: !!subChapterId,
      useEffectDependencies: [subChapterId],
    });

  const { mutate: addRating, isLoading: isSubmittingRating } = useMutation(
    '/course/addRatingSubChapter',
    'post',
    {
      toast: {
        hideSuccess: true,
      },
      onSuccess: async () => {
        await refetch();
      },
    },
  );

  const [userRating, setUserRating] = useState<number | null>(null);
  const emojis = ['😞', '😕', '😐', '😊', '😍'];

  useEffect(() => {
    if (typeof userRatingData?.value === 'number') {
      setUserRating(userRatingData.value);
    }
  }, [userRatingData]);

  const handleSubmitRating = async (value: number) => {
    if (!subChapterId) {
      toaster({
        title: 'Gagal',
        description: 'Sub chapter tidak ditemukan.',
        condition: 'warning',
      });
      return;
    }

    setUserRating(value);
    await addRating({ payload: { subChapterId, value } });
  };

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
      className="flex h-full flex-1 flex-col bg-white"
    >
      <HeaderPdf
        doc={doc}
        isCourseDone={isCourseDone}
      />
      <div className="flex h-full flex-col">
        {doc?.video && (
          <div
            className={`relative w-full shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${hideVideo ? 'h-0' : 'h-auto'}`}
          >
            <div className="px-2 pb-0 pt-2 sm:p-3 sm:pb-0">
              {doc.video?.url?.length > 0 && (
                <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-black">
                  <video
                    ref={videoRef}
                    controls
                    controlsList="nodownload"
                    className="w-full bg-black"
                  />
                </div>
              )}
              {doc.video?.url?.length > 0 && (
                <div className="mt-2 rounded-2xl border border-slate-200/70 bg-white px-2.5 py-2 sm:px-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <button
                          key={item}
                          className="rounded p-0.5 disabled:cursor-not-allowed"
                          onClick={() => handleSubmitRating(item)}
                          disabled={isSubmittingRating || isLoadingUserRating}
                          aria-label={`Rating ${item}`}
                          type="button"
                        >
                          <Star
                            className={`h-3.5 w-3.5 transition-colors ${
                              (userRating ?? 0) >= item
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-1 truncate text-xs text-slate-600">
                        {userRating ? emojis[userRating - 1] : 'Beri rating'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-500">
                        {userRating
                          ? 'Rating tersimpan'
                          : reviewCount !== null
                            ? `${reviewCount.toLocaleString('id-ID')} ulasan`
                            : `${starRating.toFixed(1)} · Ulasan siswa`}
                      </span>
                      <button
                        className="rounded-3xl border border-slate-200/70 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-100"
                        onClick={() => setHideVideo(true)}
                        type="button"
                      >
                        Sembunyikan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div
          id="DocumentViewPdf"
          className="relative flex-1 w-full bg-slate-50/50"
          style={{
            height: 'calc(100dvh - 120px)',
            minHeight: '420px',
          }}
        >
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
              className="absolute right-3 top-3 z-49 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-4 py-1.5 text-xs font-medium shadow-sm hover:shadow transition-all"
              onClick={() => {
                setHideVideo(false);
              }}
            >
              Tampilkan Video
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocViewer;
