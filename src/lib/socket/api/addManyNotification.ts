import { env } from '@/env.mjs';
import {
  NotificationCategoryEnum,
  NotificationPriorityEnum,
  NotificationRelatedTypeEnum,
  NotificationTypeEnum,
} from '@/types/database';

import { authHeaders } from '@/lib/auth-helper';
import axios from 'axios';

export const addManyNotification = async ({
  users,
  isPopUp,
  title,
  content,
  description,
  type,
  category,
  priority,
  relatedResourceId,
  relatedResourceType,
  actionUrl,
  metadata,
  runAt,
  sendAt,
  retryCount,
  maxRetries,
}: {
  users: {
    userId: string;
    email?: string;
    whatsApp?: string;
  }[];
  isPopUp: boolean;
  title: string;
  content: string;
  description?: string;
  type: NotificationTypeEnum;
  category: NotificationCategoryEnum;
  priority: NotificationPriorityEnum;
  relatedResourceId?: string;
  relatedResourceType?: NotificationRelatedTypeEnum;
  actionUrl?: string;
  metadata?: any[] | Record<string, any>;
  runAt?: Date;
  sendAt?: Date;
  retryCount: number;
  maxRetries: number;
}) => {
  try {
    if (runAt) {
      console.log('new Date runAt : ', new Date(runAt));
    }
    console.log('new Date : ', new Date());
    const res = await axios.post(
      `${env.NEXT_PUBLIC_SOCKET_URL}/notification/queue/addMany`,
      {
        users,
        isPopUp,
        title,
        content,
        description: description || null,
        type,
        category,
        priority,
        relatedResourceId: relatedResourceId || null,
        relatedResourceType: relatedResourceType || null,
        actionUrl: actionUrl || null,
        metadata: metadata || null,
        runAt,
        sendAt,
        retryCount,
        maxRetries,
      },
      { headers: authHeaders(), withCredentials: true },
    );
    console.log(
      `[SOCKET] Notification added for ${users.length} users : ${res?.data?.data?.id}`,
    );
    return true;
  } catch (error: any) {
    console.log(
      `[SOCKET] Failed to add notification for ${users.length} users :`,
      error?.message,
    );
    return false;
  }
};
