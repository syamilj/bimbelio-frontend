'use client';

import ChatContent from '@/app/[web_sub_category]/(user)/user/chat/[historyId]/_components/chat-content';
import SidebarChat from '@/app/[web_sub_category]/(user)/user/chat/[historyId]/_components/sidebar-chat';
import ChatProvider from '@/app/[web_sub_category]/(user)/user/chat/[historyId]/provider';
import { useAppContext } from '@/components/provider/provider-app';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import { use } from 'react';

export default function ChatPage({
  params,
}: {
  params: Promise<{ historyId: string }>;
}) {
  const { minimizeSidebar } = useAppContext();
  const { historyId } = use(params);

  return (
    <ChatProvider>
      <div
        className={cn(
          'absolute inset-0 top-0 bg-gray-50 overflow-hidden mt-[-13px]',
          !minimizeSidebar && 'md:left-[2rem]',
          minimizeSidebar && ' md:left-[40px]',
        )}
      >
        <div className="flex h-full w-full">
          <SidebarChat />
          <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
            <ChatContent historyId={historyId} />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}
