'use client';

import { DocDataType } from '@/components/pdf-reader';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
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
    <div className="h-full flex flex-col">
      {/* Mobile Workspace Header */}
      {mobileScreen === 'minimize' && (
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0">
          <button
            onClick={() => setSidebarMobile(true)}
            className="p-2 hover:bg-gray-100 rounded-3xl transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="font-medium text-gray-900 truncate flex-1 px-4">
            {doc.title.length > 25 ? `${doc.title.slice(0, 25)}...` : doc.title}
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-3xl transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Document Viewer */}
      <div className="flex-1 min-h-0">
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
      </div>
    </div>
  );
}
