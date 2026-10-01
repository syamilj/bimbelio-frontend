import { env } from '@/env.mjs';
import {
  NotificationCategoryEnum,
  NotificationPriorityEnum,
  NotificationRelatedTypeEnum,
  NotificationTypeEnum,
} from '@/types/database';
import { authHeaders } from '@/lib/auth-helper';
import axios from 'axios';

export const getNotificationQueue = async ({
  page,
  take,
  search,
  userType,
}: {
  page: number;
  take: number;
  search?: string;
  userType?: 'PERSONAL' | 'BROADCAST';
}): Promise<{
  data: NotificationQueueType[];
  page: number;
  take: number;
  total_pages: number;
  total_data: number;
  error: string | null;
}> => {
  try {
    const res = await axios.get(
      `${env.NEXT_PUBLIC_SOCKET_URL}/notification/queue`,
      {
        headers: authHeaders(),
        params: {
          page,
          take,
          search: search && search.length > 0 ? search : undefined,
          userType,
        },
      },
    );
    console.log(
      `[SOCKET] Notification queue fetched successfully for page ${page} with take ${take}:`,
    );

    const resData = res.data as {
      data: NotificationQueueType[];
      page: number;
      take: number;
      total_pages: number;
      total_data: number;
    };

    return {
      ...resData,
      error: null,
    };
  } catch (error: any) {
    console.log(
      `[SOCKET] Failed to fetch notification queue for page ${page} with take ${take}:`,
      error?.message,
    );
    return {
      data: [] as NotificationQueueType[],
      page: 1,
      take: 10,
      total_pages: 0,
      total_data: 0,
      error: error.message as string,
    };
  }
};

export type NotificationQueueType = {
  id: string;
  status: NotificationQueueStatusEnum;
  userId: string | null;
  title: string;
  content: string;
  description: string | null;
  type: NotificationTypeEnum;
  category: NotificationCategoryEnum;
  priority: NotificationPriorityEnum;
  isBroadcast: boolean;
  isPopUp: boolean;
  relatedResourceId: string | null;
  relatedResourceType: NotificationRelatedTypeEnum;
  whatsApp: string | null;
  email: string | null;
  actionUrl: string | null;
  metadata: any | null;
  runAt: string;
  sentAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    runAt: string;
  };
};

type NotificationQueueStatusEnum =
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'BOUNCED'
  | 'UNSUBSCRIBED';
