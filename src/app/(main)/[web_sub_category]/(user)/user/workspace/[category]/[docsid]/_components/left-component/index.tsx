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
    <div className="h-full flex flex-col bg-white">
      {/* Mobile Workspace Header */}
      {mobileScreen === 'minimize' && (
        <div className="md:hidden flex items-center justify-between px-3 py-2.5 bg-white border-b border-slate-200/80 shrink-0">
          <button
            onClick={() => setSidebarMobile(true)}
            className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-3xl transition-colors"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-semibold text-sm text-slate-800 truncate flex-1 px-3">
            {doc.title.length > 30 ? `${doc.title.slice(0, 30)}...` : doc.title}
          </h1>
        </div>
      )}

      {/* Document Viewer */}
      <div className="flex-1 min-h-0">
        {userId ? (
          <DocViewer doc={doc} userId={userId} canEdit={true} />
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
}
