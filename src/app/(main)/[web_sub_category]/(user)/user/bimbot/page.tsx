'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { ChatHistory } from '@/types/database';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BimBotPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams<{ web_sub_category: string }>();
  const [isFailedRedirect, setIsFailedRedirect] = useState(false);

  useEffect(() => {
    const userId = session?.user?.id;
    const webSubCategory = params?.web_sub_category;

    if (!userId || !webSubCategory) {
      return;
    }

    let isActive = true;

    const redirectToChat = async () => {
      let historyData: ChatHistory[] = [];

      await getGeneral(`/chat/getAllHistoryByUserId?userId=${userId}`, {
        setData: (data: ChatHistory[]) => {
          historyData = data || [];
        },
      });

      if (!isActive) {
        return;
      }

      const firstHistory = historyData?.[0];

      if (firstHistory?.id) {
        router.replace(`/${webSubCategory}/user/bimbot/${firstHistory.id}`);
        return;
      }

      let newChatId = '';

      await mutateGeneral('/chat/createNewChat', {
        payload: {
          title: 'Chat Baru',
          userId,
        },
        type: 'post',
        toast: {
          errorMsg: 'Gagal membuat chat baru',
        },
        onSuccess: ({ data }) => {
          newChatId = data?.id || '';
        },
      });

      if (!isActive) {
        return;
      }

      if (newChatId) {
        router.replace(`/${webSubCategory}/user/bimbot/${newChatId}`);
        return;
      }

      setIsFailedRedirect(true);
    };

    redirectToChat();

    return () => {
      isActive = false;
    };
  }, [params?.web_sub_category, router, session?.user?.id]);

  if (isFailedRedirect) {
    return null;
  }

  return <div className="min-h-screen" />;
}
