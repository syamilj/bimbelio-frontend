'use client';

import { useAppContext } from '@/components/provider/provider-app';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SpinnerPage } from '@/components/ui/spinner';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useMedia from 'use-media';

import { DocDataType } from '@/components/pdf-reader';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { pixel } from '@/lib/pixel/_core';
import { cn } from '@/lib/utils';
import { CrownIcon, LockIcon, PlayIcon, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import ButtonUpgradeTryout from '../../../try-out/_components/ui/button-upgrade-tryout';
import LeftComponent from './_components/left-component';
import { RightComponent } from './_components/right-component';

const DocViewer = dynamic(() => import('@/components/pdf-reader'), {
  ssr: false,
});

const DocViewerPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  // const { query } = router;
  // const tab = query.tab as string;
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [doc, setDoc] = useState<DocDataType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<number>(200);
  const [error, setError] = useState<string | null>(null);
  const [tryoutId, setTryoutId] = useState<string | null>(null);
  const [tryoutLink, setTryoutLink] = useState<string | null>(null);

  const fetchDocData = useDebouncedCallback(async () => {
    await getGeneral('/document/getDocData', {
      setData: setDoc,
      setLoading: setIsLoading,
      toast: { hideError: true },
      params: {
        docId: docId,
        userId: userId,
      },
      onError({ data: resData, message, status }) {
        const data = resData as {
          tryoutId: string;
          website_sub_category_id: string;
        };
        // const
        setError(message);
        setStatus(status);
        setTryoutId(data.tryoutId);
        setTryoutLink(
          `/${data.website_sub_category_id}/user/try-out?id=${data.tryoutId}`,
        );
      },
    });
  }, 500);

  useEffect(() => {
    fetchDocData();
  }, []);

  useEffect(() => {
    if (!tab) {
      router.push(`${pathname}?tab=chat`);
    }
  }, [tab]);

  const { mobileScreen, setSidebarMobile, setTransactionPopUp } =
    useAppContext();

  const updateHistory = async (payload: { documentId: string }) => {
    await mutateGeneral('/document/updateHistory', {
      payload: {
        ...payload,
        userId: session?.user.id,
      },
      toast: {
        hideSuccess: true,
      },
      type: 'put',
      onSuccess: () => {
        //     await trpc.document.getHistoryByUser.refetch();
        //     await trpc.document.getDocumentTotalPage.refetch();
      },
    });
  };

  const test = useDebouncedCallback(() => {
    updateHistory({
      documentId: docId as string,
    });
  }, 1000);

  useEffect(() => {
    test();
  }, []);

  const isMobile = useMedia({ maxWidth: '768px' });

  useEffect(() => {
    pixel.meta.track(
      'ViewContent',
      {
        content_name: 'Workspace',
        content_type: 'page',
      },
      // ✅ Advanced Matching untuk Meta Pixel
      session?.user
        ? {
            em: session.user.email,
            ph: session.user.phone || undefined,
            fn: session.user.name?.split(' ')[0],
            ln: session.user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    );
    pixel.tiktok.track('ViewContent', {
      content_name: 'Workspace',
      content_id: `workspace_document_${docId}`, // ✅ Required untuk TikTok VSA
    });
  }, [session, docId]);

  if (!docId) {
    return <p>Document ID not found in the URL.</p>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-full min-h-[90vh]">
        <Card className="mb-8 bg-linear-to-r from-yellow-100 to-orange-100 border-yellow-400 rounded-3xl">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-yellow-100 p-4 rounded-full">
                <LockIcon className="h-12 w-12 text-yellow-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <p className="text-lg text-gray-600 mb-6">
              Dapatkan akses penuh ke pembahasan detail, analisis skor mendalam,
              dan fitur premium lainnya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {status === 400 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ButtonUpgradeTryout tryoutId={tryoutId || ''}>
                    <Button
                      size="lg"
                      className="bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3"
                    >
                      <CrownIcon className="mr-2 h-5 w-5" />
                      Beli Tryout
                    </Button>
                  </ButtonUpgradeTryout>
                  <Link href={tryoutLink || ''}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 px-8 py-3"
                    >
                      <PlayIcon className="mr-2 h-5 w-5" />
                      Ikut Tryout
                    </Button>
                  </Link>
                </div>
              )}
              {status === 401 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="hidden md:flex items-center gap-1 lg:gap-2 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2 h-8 lg:h-auto w-full bg-main"
                    onClick={() => setTransactionPopUp(true)}
                  >
                    <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">Beli Subscription</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !doc) {
    return <SpinnerPage />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup
          autoSaveId="workspace-layout"
          direction={isMobile ? 'vertical' : 'horizontal'}
          onLayout={() => {}}
          className="h-full"
        >
          <ResizablePanel
            defaultSize={50}
            minSize={30}
            className={cn(
              `DocumentContainer relative`,
              !isMobile && 'border-r border-gray-200',
              isMobile && 'border-b border-gray-200',
            )}
          >
            <LeftComponent doc={doc} />
          </ResizablePanel>
          <ResizableHandleComponent />
          <ResizablePanel
            defaultSize={50}
            minSize={30}
            className="chatAIContainer relative"
          >
            <RightComponent docId={docId} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DocViewerPage;

const ResizableHandleComponent = () => {
  const isMobile = useMedia({ maxWidth: '768px' });

  return (
    <div className="relative flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
      <ResizableHandle
        className="relative z-42 h-full w-[4px] bg-gray-300 duration-300 data-[panel-group-direction=vertical]:h-[4px] data-[panel-group-direction=vertical]:w-full hover:bg-blue-400 active:bg-blue-500"
        withHandle
      />
      <div className="absolute z-41 h-[40px] w-[12px] rounded-full bg-gray-400 md:h-[12px] md:w-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
