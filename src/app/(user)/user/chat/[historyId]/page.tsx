'use client';

import ChatContent from '@/app/(user)/user/chat/[historyId]/_components/chat-content';
import SidebarChat from '@/app/(user)/user/chat/[historyId]/_components/sidebar-chat';
import ChatProvider from '@/app/(user)/user/chat/[historyId]/provider';
import 'katex/dist/katex.min.css';
import { use } from 'react';

export default function Index({
  params,
}: {
  params: Promise<{ historyId: string }>;
}) {
  const { historyId } = use(params);

  return (
    <ChatProvider>
      <div className="absolute top-0 left-0 md:left-[75px] w-full h-full flex">
        <SidebarChat />
        <ChatContent historyId={historyId} />
      </div>
    </ChatProvider>
  );
}
