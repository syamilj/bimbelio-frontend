import { useSession } from '@/components/provider/provider-session-auth';
import { toaster } from '@/components/ui/toaster';
import { HighlightTypeEnum } from '@/types/database';
import { createId } from '@paralleldrive/cuid2';
import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  GhostHighlight,
  PdfHighlighterUtils,
  Scaled,
} from 'react-pdf-highlighter-extended';
import { DocDataType } from '..';
import { useAppContext } from '../../provider/provider-app';
import {
  addHighlightMutation,
  addHighlightToNotes,
  deleteHighlightMutation,
  PdfHelper,
} from './helper';

type Props = {
  children: React.ReactNode;
  doc: DocDataType;
};

export default function Provider({ children, doc }: Props) {
  const { data: session } = useSession();
  const {
    normalSize,
    setNormalSize,
    zoomValue,
    setZoomValue,
    vision,
    setVision,
    useEditor: { editor },
  } = useAppContext();

  const highlighterUtilsRef = useRef<PdfHighlighterUtils | undefined>(
    undefined,
  );
  const [highlights, setHighlights] = useState<DocDataType['highlights']>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchPdf, setSearchPdf] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [hideVideo, setHideVideo] = useState<boolean>(false);
  const [editPage, setEditPage] = useState<boolean>(false);

  useEffect(() => {
    if (doc.highlights.length > 0) {
      setHighlights(doc.highlights);
    }
  }, [doc]);

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

      addHighlightMutation(
        {
          id: highlightId,
          userId: session?.user.id || '',
          boundingRect: position.boundingRect,
          type: isTextHighlight ? 'TEXT' : 'IMAGE',
          documentId: doc.id as string,
          pageNumber: position.boundingRect.pageNumber,
          rects: position.rects,
        },
        setHighlights,
      );
      // addNote(content.text, highlightId)

      if (isTextHighlight) {
        if (!content.text) return;
        addHighlightToNotes(content.text, highlightId, 'TEXT', editor);
      } else {
        if (!content.image) return;
        addHighlightToNotes(content.image, highlightId, 'IMAGE', editor);
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
      deleteHighlightMutation(
        {
          documentId: doc.id as string,
          highlightId: id,
          userId: session?.user.id || '',
        },
        setHighlights,
      );
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

  const scrollToHighlightById = (highlightId: string) => {
    console.log('jalan');
    const highlight = getHighlightById(highlightId);
    if (
      highlight &&
      highlight.position.pageNumber &&
      highlighterUtilsRef.current
    ) {
      highlighterUtilsRef.current.scrollToHighlight({
        id: highlight.id,
        position: {
          rects: highlight.position.rects,
          boundingRect:
            highlight.position.boundingRect || highlight.position.rects[0],
        },
      });
    } else {
      console.warn('Highlight not found or invalid highlight structure');
    }
  };

  useEffect(() => {
    const updateHash = () => {
      const currentHash = window.location.hash.slice(1);
      console.log({ currentHash });
      scrollToHighlightById(currentHash);
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);

    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  const Context = {
    useVideo: {
      videoUrl,
      setVideoUrl,
      hideVideo,
      setHideVideo,
    },
    useHeaderPdf: {
      normalSize,
      setNormalSize,
      zoomValue,
      setZoomValue,
      vision,
      setVision,
      currentPage,
      setCurrentPage,
      searchPdf,
      setSearchPdf,
      editPage,
      setEditPage,
    },
    useHighlights: {
      highlights,
      setHighlights,
      addHighlight,
      deleteHighlight,
      getHighlightById,
      scrollToHighlightById,
      highlighterUtilsRef,
    },
  };

  return (
    <ProviderContext.Provider value={Context}>
      <PdfHelper />
      {children}
    </ProviderContext.Provider>
  );
}

const ProviderContext = createContext<undefined | ProviderType>(undefined);

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within an ProviderContext');
  }
  return context;
};

type ProviderType = {
  useVideo: {
    videoUrl: string;
    setVideoUrl: Dispatch<SetStateAction<string>>;
    hideVideo: boolean;
    setHideVideo: Dispatch<SetStateAction<boolean>>;
  };
  useHeaderPdf: {
    normalSize: string;
    setNormalSize: Dispatch<SetStateAction<string>>;
    zoomValue: string;
    setZoomValue: Dispatch<SetStateAction<string>>;
    vision: boolean;
    setVision: Dispatch<SetStateAction<boolean>>;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    searchPdf: string;
    setSearchPdf: Dispatch<SetStateAction<string>>;
    editPage: boolean;
    setEditPage: Dispatch<SetStateAction<boolean>>;
  };
  useHighlights: {
    highlights: DocDataType['highlights'];
    setHighlights: Dispatch<SetStateAction<DocDataType['highlights']>>;
    addHighlight: ({ content, position }: GhostHighlight) => Promise<void>;
    deleteHighlight: (id: string) => Promise<void>;
    getHighlightById: (id: string) => HighlightTypeData | undefined;
    scrollToHighlightById: (highlightId: string) => void;
    highlighterUtilsRef: RefObject<PdfHighlighterUtils | undefined>;
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
