import { env } from '@/env.mjs';
import {
  NotificationCategoryEnum,
  NotificationPriorityEnum,
  NotificationRelatedTypeEnum,
  NotificationTypeEnum,
} from '@/types/database';
import axios from 'axios';

export const addNotification = async ({
  id,
  userId,
  isBroadcast,
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
  whatsApp,
  email,
  retryCount,
  maxRetries,
}: {
  id?: string;
  userId?: string;
  isBroadcast: boolean;
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
  whatsApp?: string;
  email?: string;
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
      `${env.NEXT_PUBLIC_SOCKET_URL}/notification/queue`,
      {
        id,
        userId,
        isBroadcast,
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
        whatsApp,
        email,
        retryCount,
        maxRetries,
      },
    );
    console.log(
      `[SOCKET] Notification added for user ${userId}: ${res.data.data.id}`,
    );
    return true;
  } catch (error: any) {
    console.log(
      `[SOCKET] Failed to add notification for user ${userId}:`,
      error.message,
    );
    return false;
  }
};
