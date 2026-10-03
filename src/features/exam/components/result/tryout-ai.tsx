'use client';

import { BimBotAvatar } from '@/components/brand/lio';
import { useSession } from '@/components/provider/provider-session-auth';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { MessageDataType } from '@/components/workspace/chat/provider';
import { env } from '@/env.mjs';
import { api } from '@/lib/api/client';
import { useTrackId } from '@/lib/track';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Chat (markdown, katex, mermaid) baru dimuat saat sheet dibuka.
const Chat = dynamic(() => import('@/components/workspace/chat'), {
  ssr: false,
});

/**
 * "Tanya BimBot" untuk satu soal di pembahasan (tryout-ai). Riwayat chat per
 * peserta sesi; nomor soal dikirim ke `/ai/chatTryout`.
 */
export function TryoutAI({
  participantId,
  number,
  children,
}: {
  participantId: string;
  number: number;
  children: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user.id;
  const trackId = useTrackId();

  const messages = useQuery({
    queryKey: ['exam', 'ai-messages', participantId],
    enabled: open && !!participantId && !!userId,
    queryFn: ({ signal }) =>
      api.get<MessageDataType[]>('/chatTryout/getAllMessageByParticipantId', {
        params: { participantId, userId },
        signal,
      }),
  });

  if (!number || !participantId) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md md:max-w-lg">
        <SheetHeader className="flex-row items-center gap-3 border-b border-line">
          <BimBotAvatar />
          <div className="flex flex-col">
            <SheetTitle>Tanya BimBot</SheetTitle>
            <SheetDescription className="font-mono text-xs lowercase">
              soal {number}
            </SheetDescription>
          </div>
        </SheetHeader>
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {open && (
            <Chat
              apiChat={`${env.NEXT_PUBLIC_API_URL}/ai/chatTryout?website_sub_category_id=${trackId ?? ''}`}
              body={{ participantId, userId, number }}
              messages={{
                prevChatMessages: messages.data ?? [],
                isLoadingPrevMessage: messages.isPending,
              }}
              fetchMessages={() => messages.refetch()}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
