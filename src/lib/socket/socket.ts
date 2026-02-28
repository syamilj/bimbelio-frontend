import { env } from '@/env.mjs';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;
let hasLoggedSocketSkip = false;

const serverUrl = env.NEXT_PUBLIC_SOCKET_URL;

const shouldSkipSocketConnection = () => {
  if (typeof window === 'undefined') return false;

  const isProdEnv =
    env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';
  const isLocalSocketUrl =
    serverUrl.includes('localhost') || serverUrl.includes('127.0.0.1');
  const isLocalHost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  return isProdEnv && isLocalSocketUrl && !isLocalHost;
};

export const connectSocket = () => {
  if (shouldSkipSocketConnection()) {
    if (!hasLoggedSocketSkip) {
      console.warn(
        '[SOCKET] Skip connecting to localhost socket in production environment.',
      );
      hasLoggedSocketSkip = true;
    }
    return null;
  }

  if (!socket) {
    socket = io(serverUrl, {
      transports: ['websocket'],
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
