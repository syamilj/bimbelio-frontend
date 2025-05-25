'use client';

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
  IconSearch,
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
    },
  } = useProvider();

  const scrollToPdfPage = (pageNum: number) => {
    const containerId = vision ? 'VisionOn' : 'VisionOff';
    const selector = `#${containerId} #pdf-page-${pageNum}`;
    const pageElement = document.querySelector(selector);

    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth' });
      setCurrentPage(pageNum);
    } else {
      console.warn(`Halaman ${pageNum} tidak ditemukan di ${selector}`);
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

  // Contoh panggilan scroll ke halaman PDF
  const scrollToPage = () => {
    if (currentPage > 0) {
      // Panggil fungsi context
      scrollToPdfPage(currentPage);
    } else {
      // fallback, misal ke halaman 1
      scrollToPdfPage(1);
    }
  };

  return (
    <div className="flex h-[60px] items-center justify-between border-main-gray-input bg-bg-workspace py-[1rem] pl-[1rem] pr-[1rem] md:border-b md:bg-bg-workspace md:pl-0 relative z-[99]">
      <div className="hidden items-center md:flex">
        <Link
          href={'/explore'}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'w-fit justify-start md:hover:scale-110',
          )}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
        </Link>

        <p className="line-clamp-1 text-[.9rem] font-semibold">
          {doc?.title ?? id}
        </p>
      </div>
      <div className="flex w-full items-center justify-between gap-[1.5rem] text-[1.5rem] md:w-[unset] md:justify-start">
        <div
          id="Pages"
          className="flex w-fit shrink-0 items-center gap-[.2rem] pr-[1rem] text-[1rem] font-medium md:border-r"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              scrollToPage(); // panggil scroll
            }}
          >
            <input
              type="text"
              value={editPage ? currentPage : !editPage && currentPage}
              className={`font-regular w-[30px] whitespace-nowrap rounded-[.5rem] bg-bg-workspace py-[.3rem] text-center text-black outline-none ${
                !editPage ? 'md:border' : 'border border-main'
              }`}
              onChange={(e: any) => {
                if (
                  !isNaN(e.target.value) &&
                  totalPage &&
                  e.target.value <= totalPage
                ) {
                  setCurrentPage(e.target.value);
                }
              }}
              onFocus={() => {
                setEditPage(true);
              }}
              onBlur={() => {
                scrollToPage();
              }}
            />
          </form>
          <span className="font-regular"> /</span>
          <p className="font-regular">{totalPage ? totalPage : '-'}</p>
        </div>
        <div
          id="Zoom"
          className="flex items-center gap-[.2rem]"
        >
          <ToolTip value="Zoom out">
            <div
              id="zoomMin"
              className="h-fit w-fit rounded-[50%] p-[.4rem] duration-200 hover:bg-main-gray-input active:bg-main-gray-input2"
              onClick={() => {
                handleZoom('min');
              }}
            >
              <IconMinus
                className={'text-main-gray-text2'}
                w={15}
              />
            </div>
          </ToolTip>
          <ToolTip value="Reset zoom">
            <div
              onClick={() => {
                handleZoom('reset');
              }}
              className="h-fit w-fit rounded-[50%] p-[.4rem] duration-200 hover:bg-main-gray-input active:bg-main-gray-input2"
            >
              <IconRegenerateMessage
                w={20}
                className={'text-main-gray-text2'}
              />
            </div>
          </ToolTip>
          <ToolTip value="Zoom in">
            <div
              id="zoomPlus"
              className={
                'h-fit w-fit cursor-default rounded-[50%] p-[.4rem] duration-200 hover:bg-main-gray-input active:bg-main-gray-input2'
              }
              onClick={() => {
                handleZoom('plus');
              }}
            >
              <IconPlus
                className={'text-main-gray-text2'}
                w={15}
              />
            </div>
          </ToolTip>
        </div>
        <ToolTip
          value="Search PDF"
          className="hidden"
        >
          <div className="relative z-[110111]">
            <div onClick={() => setOnSearchPdf(!onSearchPdf)}>
              <IconSearch
                className={
                  'shrink-0 text-main-gray-text2 duration-200 hover:text-main'
                }
              />
            </div>
            <form
              className={`absolute right-[100%] top-[100%] z-[110111] flex items-center ${
                onSearchPdf ? 'w-[300px]' : 'w-0'
              } duration-300`}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="text"
                className={`w-full rounded-[1rem] ${
                  onSearchPdf
                    ? 'rounded-tr-none border-2 border-white py-[.5rem] pl-[1rem] pr-[2.5rem] shadow-default outline-none focus:border-2 focus:border-main'
                    : 'p-0'
                } duration-300`}
                placeholder="Search..."
                onChange={(e) => setSearchPdf(e.target.value)}
                value={searchPdf}
              />
              <IconSearch
                className={`absolute right-[1rem] shrink-0 text-main-gray-text2 duration-200 hover:text-main ${
                  !onSearchPdf && 'hidden'
                }`}
              />
            </form>
          </div>
        </ToolTip>
        <ToolTip
          value="Vision"
          className="hidden md:flex"
        >
          <div
            className={`relative border border-main-gray-input2 ${
              vision
                ? 'bg-main text-white md:hover:bg-main-hover'
                : 'bg-transparent text-main-gray-text2 md:hover:bg-main-gray-input2'
            }   capitalize text-[.95rem] font-regular px-[.5rem] py-[.5rem] rounded-[.7rem] duration-200 cursor-pointer`}
            onClick={() => {
              setVision(!vision);
            }}
          >
            <IconVision
              active={vision}
              w={20}
            />
          </div>
        </ToolTip>

        {mobileScreen === 'minimize' && (
          <ToolTip
            value="Fullscreen"
            className={cn(inCourse && 'hidden md:block')}
          >
            <div
              className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
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
              <IconFullscreen w={isMobile ? 15 : 20} />
            </div>
          </ToolTip>
        )}
        {mobileScreen === 'fullscreen' && (
          <ToolTip
            value="Minimize"
            className={cn(inCourse && 'hidden md:block')}
          >
            <div
              className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
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
              <IconMinimizeScreen w={isMobile ? 15 : 20} />
            </div>
          </ToolTip>
        )}

        {/* {inCourse && sub && isCourseDone === false && (
          <div className="flex">
            <SubmitCourse subCourseId={sub} />
          </div>
        )} */}
        {inCourse && sub && isCourseDone === true && (
          <div className="flex w-fit cursor-default items-center justify-center gap-[.5rem] rounded-[.8rem] bg-bg-workspace px-[1rem] py-[.7rem] text-[.9rem] text-primary duration-300">
            <p>Selesai</p>
            <IconCheckList className="text-green-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderPdf;
