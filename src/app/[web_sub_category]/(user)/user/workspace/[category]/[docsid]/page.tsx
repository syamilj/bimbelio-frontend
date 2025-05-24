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
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useDebouncedCallback } from 'use-debounce';
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
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    getGeneral('/document/getDocData', {
      setData: setDoc,
      setLoading: setIsLoading,
      params: {
        docId: docId,
        userId: userId,
      },
      onError() {
        setIsError(true);
      },
    });
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

  if (isError) {
    return <p>Error loading the document.</p>;
  }

  if (isLoading || !doc) {
    return <SpinnerPage />;
  }

  if (doc?.premium && session?.user.role === 'USER') {
    return <p>Upgrade to Premium</p>;
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
