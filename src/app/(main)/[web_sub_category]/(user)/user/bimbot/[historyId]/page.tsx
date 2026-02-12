'use client';

import ChatContent from '@/app/(main)/[web_sub_category]/(user)/user/bimbot/[historyId]/_components/chat-content';
import { use } from 'react';

export default function ChatPage({
  params,
}: {
  params: Promise<{ historyId: string }>;
}) {
  const { historyId } = use(params);

  return <ChatContent historyId={historyId} />;
}
