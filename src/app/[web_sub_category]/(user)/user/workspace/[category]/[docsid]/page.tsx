'use client';

import { useAppContext } from '@/components/provider/provider-app';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SpinnerPage } from '@/components/ui/spinner';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useMedia from 'use-media';

import { DocDataType } from '@/components/pdf-reader';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CrownIcon, LockIcon, PlayIcon } from 'lucide-react';
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

  console.log('tab', tab);

  const [doc, setDoc] = useState<DocDataType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tryoutId, setTryoutId] = useState<string | null>(null);
  const [tryoutLink, setTryoutLink] = useState<string | null>(null);

  const fetchDocData = useDebouncedCallback(async () => {
    await getGeneral('/document/getDocData', {
      setData: setDoc,
      setLoading: setIsLoading,
      params: {
        docId: docId,
        userId: userId,
      },
      onError({ data: resData, message }) {
        const data = resData as {
          tryoutId: string;
          website_sub_category_id: string;
        };
        // const
        setError(message);
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

  const { mobileScreen, setSidebarMobile } = useAppContext();

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

  if (!docId) {
    return <p>Document ID not found in the URL.</p>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-full min-h-[90vh]">
        <Card className="mb-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400 rounded-3xl">
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ButtonUpgradeTryout tryoutId={tryoutId || ''}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3"
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
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !doc) {
    return <SpinnerPage />;
  }

  // console.log('doc', doc)

  return (
    <ResizablePanelGroup
      autoSaveId="window-layout"
      direction={isMobile ? 'vertical' : 'horizontal'}
      onLayout={() => {}}
      className="flex-col"
    >
      <ResizablePanel
        defaultSize={50}
        minSize={0}
        className={cn(
          `DocumentContainer relative border-b`,
          mobileScreen === 'minimize' && 'pt-[68px] md:pt-0',
        )}
      >
        <LeftComponent doc={doc} />
      </ResizablePanel>
      <ResizableHandleComponent />
      <ResizablePanel
        defaultSize={50}
        minSize={0}
        className="chatAIContainer relative"
      >
        <RightComponent docId={docId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DocViewerPage;

const ResizableHandleComponent = () => {
  const { mobileScreen } = useAppContext();
  return (
    <div
      className={cn(
        `relative items-center justify-center`,
        mobileScreen === 'minimize' ? 'flex' : 'h-0 w-0 overflow-hidden p-0',
      )}
    >
      <ResizableHandle
        className="relative z-[42] h-full w-[.5px] rounded-full bg-main-gray-input duration-300 after:w-[1px] data-[panel-group-direction=vertical]:h-[1px]"
        withHandle
      />
      <div className="absolute z-[41] ml-[-.2px] h-[6px] w-[100px] rounded-[2rem] bg-main-gray-input md:h-[100px] md:w-[6px]" />
    </div>
  );
};
