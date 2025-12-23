import { env } from '@/env.mjs';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

const serverUrl = env.NEXT_PUBLIC_SOCKET_URL;

export const connectSocket = () => {
  if (!socket) {
    socket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to socket server:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
