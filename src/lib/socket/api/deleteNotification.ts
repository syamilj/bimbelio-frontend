import { env } from '@/env.mjs';
import { authHeaders } from '@/lib/auth-helper';
import axios from 'axios';

export const deleteNotification = async ({ id }: { id: string }) => {
  try {
    const res = await axios.delete(
      `${env.NEXT_PUBLIC_SOCKET_URL}/notification/queue`,
      {
        headers: authHeaders(),
        params: {
          notifId: id,
        },
      },
    );
    console.log(res.data);
    console.log(`[SOCKET] Notification deleted: ${res?.data?.data?.id}`);
    return true;
  } catch (error: any) {
    console.log(`[SOCKET] Failed to delete notification:`, error?.message);
    return false;
  }
};
