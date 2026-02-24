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
    // Only connect if session exists
    if (!session?.user?.id) {
      setIsConnected(false);
      setSocketId(null);
      return;
    }

    const socket = connectSocket();

    const handleConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id || null);
      // ✅ Authenticate user into their personal room after connect
      socket.emit('user:auth', { userId: session.user.id });
      console.log('[AUTH] Authenticated as:', session.user.id);
    };

    socket.on('connect', handleConnect);

    // ✅ If socket already connected (singleton reuse across navigations),
    // fire user:auth immediately — 'connect' event won't fire again
    if (socket.connected) {
      handleConnect();
    }

    const handleDisconnect = () => {
      setIsConnected(false);
      setSocketId(null);
    };

    socket.on('disconnect', handleDisconnect);

    // Re-attach listeners yang sudah terdaftar
    listenersRef.current.forEach((callback, eventName) => {
      socket.off(eventName, callback); // remove duplicate before re-adding
      socket.on(eventName, callback);
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      // Cleanup: remove listeners saat unmount
      listenersRef.current.forEach((callback, eventName) => {
        socket.off(eventName, callback);
      });
    };
  }, [session?.user?.id, serverUrl]);

  const on = useCallback((eventName: string, callback: (data: any) => void) => {
    // ✅ Always store in ref first — even if socket not ready yet.
    // useSocket's effect re-attaches all listenersRef entries when socket connects.
    const existing = listenersRef.current.get(eventName);
    const socket = getSocket();
    if (socket && existing) {
      socket.off(eventName, existing); // remove old to avoid duplicates
    }
    listenersRef.current.set(eventName, callback);
    if (socket) {
      socket.on(eventName, callback);
    }
  }, []);

  const off = useCallback((eventName: string) => {
    const callback = listenersRef.current.get(eventName);
    if (callback) {
      listenersRef.current.delete(eventName);
      const socket = getSocket();
      if (socket) socket.off(eventName, callback);
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
