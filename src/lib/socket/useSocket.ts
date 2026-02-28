'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from '@/lib/socket/socket';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SocketEvent {
  eventName: string;
  callback: (data: any) => void;
}

export const useSocket = (serverUrl?: string) => {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const listenersRef = useRef<Map<string, (data: any) => void>>(new Map());

  useEffect(() => {
    // ✅ Hanya connect jika session ada
    if (!session?.user?.id) {
      disconnectSocket();
      setIsConnected(false);
      setSocketId(null);
      return;
    }

    const socket = connectSocket();
    if (!socket) {
      setIsConnected(false);
      setSocketId(null);
      return;
    }

    socket.on('connect', () => {
      setIsConnected(true);
      setSocketId(socket.id || null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setSocketId(null);
    });

    // // ✅ Auto authenticate saat connect
    // socket.emit('user:auth', { userId: session.user.id });
    // console.log('[AUTH] Authenticated as:', session.user.id);

    // Re-attach listeners yang sudah terdaftar
    listenersRef.current.forEach((callback, eventName) => {
      socket.on(eventName, callback);
    });

    return () => {
      // Cleanup: remove listeners saat unmount
      listenersRef.current.forEach((callback, eventName) => {
        socket.off(eventName, callback);
      });
    };
  }, [session?.user?.id, serverUrl]);

  const on = useCallback((eventName: string, callback: (data: any) => void) => {
    const socket = getSocket();
    if (socket) {
      listenersRef.current.set(eventName, callback);
      socket.on(eventName, callback);
    }
  }, []);

  const off = useCallback((eventName: string) => {
    const socket = getSocket();
    const callback = listenersRef.current.get(eventName);
    if (socket && callback) {
      socket.off(eventName, callback);
      listenersRef.current.delete(eventName);
    }
  }, []);

  const emit = useCallback(
    (eventName: string, data?: any) => {
      const socket = getSocket();
      if (socket && isConnected) {
        socket.emit(eventName, data);
      }
    },
    [isConnected],
  );

  // const authenticate = useCallback(
  //   (userId: string) => {
  //     const socket = getSocket();
  //     if (socket && isConnected) {
  //       socket.emit('user:auth', { userId });
  //       console.log('[AUTH] User authenticated:', userId);
  //     }
  //   },
  //   [isConnected],
  // );

  const disconnect = useCallback(() => {
    disconnectSocket();
    listenersRef.current.clear();
  }, []);

  if (isConnected) {
    console.log('useSocket:', { isConnected, socketId });
  }

  return {
    isConnected,
    socketId,
    on,
    off,
    emit,
    // authenticate,
    disconnect,
  };
};
