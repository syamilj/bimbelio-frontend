'use client';

import SubmitCourse from '@/app/(main)/[web_sub_category]/(user)/user/bimcourse/[categoryId]/_component/z_other/submit-course';
import { useAppContext } from '@/components/provider/provider-app';
import { buttonVariants } from '@/components/ui/button';
import { ToolTip } from '@/components/ui/tooltip';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import {
  IconCheckList,
  IconFullscreen,
  IconMinimizeScreen,
  IconMinus,
  IconPlus,
  IconRegenerateMessage,
  IconVision,
} from '@/styles/icon';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMedia } from 'use-media';
import { useProvider } from '../_provider';

interface Props {
  doc: any;
  isCourseDone?: boolean;
}

const HeaderPdf = ({ doc, isCourseDone }: Props) => {
  const docId = doc?.id;
  const id = doc?.id;
  const [onSearchPdf, setOnSearchPdf] = useState<boolean>(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sub = searchParams?.get('sub');
  const inCourse = pathname?.includes('course');

  const isMobile = useMedia({ maxWidth: '768px' });

  const { mobileScreen, setMobileScreen } = useAppContext();
  const {
    useHeaderPdf: {
      currentPage,
      setCurrentPage,
      editPage,
      setEditPage,
      searchPdf,
      setSearchPdf,
      zoomValue,
      setZoomValue,
      vision,
      setVision,
      scrollToPdfPage, // Get from provider
    },
  } = useProvider();

  // Remove the local scrollToPdfPage function and use the one from provider
  const scrollToPage = () => {
    if (currentPage > 0 && currentPage <= (totalPage || 1)) {
      scrollToPdfPage(currentPage);
    } else {
      // fallback, misal ke halaman 1
      scrollToPdfPage(1);
    }
  };

  // const { data: totalPage } = api.document.getDocumentTotalPage.useQuery(
  //   {
  //     docId: docId as string,
  //   },
  //   { refetchOnWindowFocus: false },
  // );

  const [totalPage, setTotalPage] = useState<number>(1);
  useEffect(() => {
    if (!docId) return;
    getGeneral('/document/getDocumentTotalPage', {
      setData: setTotalPage,
      params: {
        docId,
      },
    });
  }, [docId]);

  const handleZoom = (parameter: 'plus' | 'min' | 'reset') => {
    const zoom = zoomValue === 'page-width' ? 1.0 : parseFloat(zoomValue);
    if (parameter === 'plus') {
      if (zoom < 4) setZoomValue(`${zoom + 0.1}`);
    }
    if (parameter === 'min') {
      if (zoom > 0.2) setZoomValue(`${zoom - 0.1}`);
    }
    if (parameter === 'reset') {
      setZoomValue('page-width');
    }
  };

  return (
    <div className="flex h-[48px] items-center justify-between border-b border-slate-200/60 bg-white px-3 py-1.5 relative z-99">
      {/* Left: Back + Title */}
      <div className="hidden items-center gap-1 md:flex min-w-0 flex-1">
        <Link
          href={'/explore'}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'w-8 h-8 p-0 rounded-3xl shrink-0',
          )}
        >
          <ChevronLeftIcon className="h-4 w-4 text-slate-500" />
        </Link>
        <p className="line-clamp-1 text-sm font-semibold text-slate-800">
          {doc?.title ?? id}
        </p>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1 md:gap-1.5 w-full md:w-auto justify-between md:justify-end">
        {/* Page Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-3xl px-2 py-1 border border-slate-200/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              scrollToPage();
            }}
          >
            <input
              type="text"
              value={editPage ? currentPage : !editPage && currentPage}
              className="w-[28px] text-center text-xs font-medium bg-white rounded-3xl py-0.5 border border-slate-200 outline-none focus:border-blue-400 transition-colors"
              onChange={(e: any) => {
                if (
                  !isNaN(e.target.value) &&
                  totalPage &&
                  e.target.value <= totalPage
                ) {
                  setCurrentPage(e.target.value);
                }
              }}
              onFocus={() => setEditPage(true)}
              onBlur={() => scrollToPage()}
            />
          </form>
          <span className="text-xs text-slate-400 font-medium">
            / {totalPage || '-'}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center">
          <ToolTip value="Zoom out">
            <button
              className="w-7 h-7 rounded-3xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              onClick={() => handleZoom('min')}
            >
              <IconMinus
                className="text-slate-400"
                w={12}
              />
            </button>
          </ToolTip>
          <ToolTip value="Reset zoom">
            <button
              className="w-7 h-7 rounded-3xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              onClick={() => handleZoom('reset')}
            >
              <IconRegenerateMessage
                w={14}
                className="text-slate-400"
              />
            </button>
          </ToolTip>
          <ToolTip value="Zoom in">
            <button
              className="w-7 h-7 rounded-3xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              onClick={() => handleZoom('plus')}
            >
              <IconPlus
                className="text-slate-400"
                w={12}
              />
            </button>
          </ToolTip>
        </div>

        {/* Vision Toggle */}
        <ToolTip
          value="Vision"
          className="hidden md:flex"
        >
          <button
            className={cn(
              'w-7 h-7 rounded-3xl flex items-center justify-center transition-all duration-200 border',
              vision
                ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50',
            )}
            onClick={() => setVision(!vision)}
          >
            <IconVision
              active={vision}
              w={14}
            />
          </button>
        </ToolTip>

        {/* Fullscreen/Minimize */}
        {mobileScreen === 'minimize' && (
          <ToolTip
            value="Fullscreen"
            className={cn(inCourse && 'hidden md:block')}
          >
            <button
              className="w-7 h-7 rounded-3xl flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-colors"
              onClick={() => {
                const chatAIContainer = document.querySelector(
                  '.chatAIContainer',
                ) as HTMLDivElement;
                const DocumentContainer = document.querySelector(
                  '.DocumentContainer',
                ) as HTMLDivElement;
                if (chatAIContainer && DocumentContainer) {
                  chatAIContainer.setAttribute('data-panel-size', '0.0');
                  chatAIContainer.style.cssText =
                    'flex: 0 1 0px; overflow: hidden;';
                  DocumentContainer.setAttribute('data-panel-size', '100.0');
                  DocumentContainer.style.cssText =
                    'flex: 100.0 1 0px; overflow: hidden; position: relative;';
                }
                setMobileScreen('fullscreen');
              }}
            >
              <IconFullscreen w={isMobile ? 13 : 14} />
            </button>
          </ToolTip>
        )}
        {mobileScreen === 'fullscreen' && (
          <ToolTip
            value="Minimize"
            className={cn(inCourse && 'hidden md:block')}
          >
            <button
              className="w-7 h-7 rounded-3xl flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-colors"
              onClick={() => {
                const chatAIContainer = document.querySelector(
                  '.chatAIContainer',
                ) as HTMLDivElement;
                const DocumentContainer = document.querySelector(
                  '.DocumentContainer',
                ) as HTMLDivElement;
                if (chatAIContainer && DocumentContainer) {
                  DocumentContainer.setAttribute('data-panel-size', '50.0');
                  DocumentContainer.style.cssText =
                    'flex: 50.0 1 0px; overflow: hidden;';
                  chatAIContainer.setAttribute('data-panel-size', '50.0');
                  chatAIContainer.style.cssText =
                    'flex: 50.0 1 0px; overflow: hidden; position: relative;';
                }
                setMobileScreen('minimize');
              }}
            >
              <IconMinimizeScreen w={isMobile ? 13 : 14} />
            </button>
          </ToolTip>
        )}

        {inCourse && sub && isCourseDone === false && <SubmitCourse />}
        {inCourse && sub && isCourseDone === true && (
          <div className="flex items-center gap-1 rounded-3xl bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600 font-medium">
            <IconCheckList className="text-emerald-500 w-2.5 h-2.5" />
            Selesai
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderPdf;
