import { addManyNotification } from './addManyNotification';
import { addNotification } from './addNotification';
import { deleteNotification } from './deleteNotification';
import { getNotificationQueue } from './getNotificationQueue';

export const socketApi = {
  addNotification,
  addManyNotification,
  getNotificationQueue,
  deleteNotification,
};
