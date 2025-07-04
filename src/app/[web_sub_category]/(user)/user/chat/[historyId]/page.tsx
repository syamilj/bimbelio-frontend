'use client';

import ChatContent from '@/app/[web_sub_category]/(user)/user/chat/[historyId]/_components/chat-content';
import SidebarChat from '@/app/[web_sub_category]/(user)/user/chat/[historyId]/_components/sidebar-chat';
import ChatProvider from '@/app/[web_sub_category]/(user)/user/chat/[historyId]/provider';
import 'katex/dist/katex.min.css';
import { use } from 'react';

export default function ChatPage({
  params,
}: {
  params: Promise<{ historyId: string }>;
}) {
  const { historyId } = use(params);

  return (
    <ChatProvider>
      <div className="absolute inset-0 md:left-[75px] bg-gray-50 overflow-hidden">
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
