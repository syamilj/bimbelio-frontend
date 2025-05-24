'use client';

import { DocDataType } from '@/components/pdf-reader';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { IconHamburger, IconSetting } from '@/styles/icon';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

type Props = {
  doc: DocDataType;
};

const DocViewer = dynamic(() => import('@/components/pdf-reader'), {
  ssr: false,
});

export default function LeftComponent({ doc }: Props) {
  const { mobileScreen, setSidebarMobile } = useAppContext();
  const { data: session } = useSession();
  const userId = session?.user.id;

  return (
    <>
      {mobileScreen === 'minimize' && (
        <div className="absolute left-0 top-0 z-[50] flex w-full items-center justify-between bg-bg-workspace p-[1.5rem] md:hidden">
          <div
            onClick={() => {
              setSidebarMobile(true);
            }}
          >
            <IconHamburger
              w={20}
              className="text-main-gray-text"
            />
          </div>
          <p className="absolute left-[4rem]">
            {doc.title.length > 20 ? `${doc.title.slice(0, 20)}...` : doc.title}
          </p>
          <div>
            <IconSetting
              w={20}
              className="text-main-gray-text"
            />
          </div>
        </div>
      )}
      {userId ? (
        <DocViewer
          doc={doc}
          userId={userId}
          canEdit={true}
        />
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
    </>
  );
}
