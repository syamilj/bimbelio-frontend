// import { createClient } from "@supabase/supabase-js";
// import {
//   NEXT_PUBLIC_SUPABASE_SECRET_KEY,
//   NEXT_PUBLIC_SUPABASE_URL,
// } from "../env";

import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from './components/provider/provider-session-auth';
import { env } from './env.mjs';
import { responseError } from './lib/response';

// const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL || "";
// const supabaseKey = NEXT_PUBLIC_SUPABASE_SECRET_KEY || "";

// export const supabase = createClient(supabaseUrl, supabaseKey);

const STORAGE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const STORAGE_UPLOAD_URL = env.NEXT_PUBLIC_SUPABASE_UPLOAD_URL;
const PRIVATE_KEY = env.NEXT_PUBLIC_SUPABASE_SECRET_KEY;
const PUBLIC_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type BucketList =
  | 'dump-images'
  | 'img'
  | 'to-question'
  | 'pdf'
  | 'video'
  | 'dump-embedding';

export const storage = {
  from: (bucket: BucketList, showToast?: boolean) => {
    return {
      upload: async (filePath: string, file: File | Buffer<ArrayBuffer>) => {
        const loadingId = crypto.randomUUID().slice(0, 6);
        try {
          if (socket) {
            console.log('✅ Emitting join:loading event', { loadingId });
            socket.emit(`join:loading`, { loadingId });
          }
          console.log(`Uploading file to bucket: ${bucket}`);
          const formData = new FormData();
          let fileToAppend: File | Blob;
          if (file instanceof Buffer) {
            fileToAppend = new Blob([file], {
              type: mimeTypesForBlob[bucket] || 'application/octet-stream',
            });
          } else if (file instanceof File) {
            fileToAppend = file;
          } else {
            // Fallback for other Blob-like objects
            fileToAppend = new Blob([file], {
              type: mimeTypesForBlob[bucket] || 'application/octet-stream',
            });
          }
          formData.append('file', fileToAppend);
          formData.append('path', filePath);
          const res = await axios.post(
            `${STORAGE_UPLOAD_URL}/storage/buckets/${bucket}/files`,
            formData,
            {
              params: { loadingId },
              headers: {
                Authorization: `Bearer ${PUBLIC_KEY}`,
              },
              timeout: 6000000, // 100 menit dalam milliseconds
            },
          );

          console.log('Upload response:', res.data);
          if (socket) {
            socket.emit(`leave:loading`, { loadingId });
          }
          return { data: res.data, error: null };
        } catch (error) {
          responseError(error, showToast === true ? true : false);
          const errorData = {
            message:
              (error as any)?.response?.data?.message || 'Storage Server Error',
          };
          console.log({ errorData });
          if (socket) {
            socket.emit(`leave:loading`, { loadingId });
          }
          return {
            data: null,
            error: errorData,
          };
        }
      },
      update: async (filePath: string, file: File | Buffer<ArrayBuffer>) => {
        try {
          console.log(`Updating file to bucket: ${bucket}`);
          const formData = new FormData();
          let fileToAppend: File | Blob;
          if (file instanceof Buffer) {
            fileToAppend = new Blob([file], {
              type: 'application/octet-stream',
            });
          } else if (file instanceof File) {
            fileToAppend = file;
          } else {
            // Fallback for other Blob-like objects
            fileToAppend = new Blob([file], {
              type: 'application/octet-stream',
            });
          }
          formData.append('file', fileToAppend);
          formData.append('path', filePath);
          const res = await axios.put(
            `${STORAGE_UPLOAD_URL}/storage/buckets/${bucket}/files`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${PUBLIC_KEY}`,
              },
              timeout: 6000000, // 100 menit dalam milliseconds
            },
          );

          console.log('Update response:', res.data);
          return { data: res.data, error: null };
        } catch (error) {
          responseError(error, showToast === true ? true : false);
          const errorData = {
            message:
              (error as any)?.response?.data?.message || 'Storage Server Error',
          };
          console.log({ errorData });
          return {
            data: null,
            error: errorData,
          };
        }
      },
      move: async (oldPath: string, newPath: string) => {
        try {
          console.log(`Moving file to bucket: ${bucket}`);
          const res = await axios.put(
            `${STORAGE_UPLOAD_URL}/storage/buckets/${bucket}/move`,
            {
              oldPath,
              newPath,
            },
            {
              headers: {
                Authorization: `Bearer ${PUBLIC_KEY}`,
              },
              timeout: 6000000, // 100 menit dalam milliseconds
            },
          );

          console.log('Move response:', res.data);
          return { data: res.data, error: null };
        } catch (error) {
          responseError(error, showToast === true ? true : false);
          const errorData = {
            message:
              (error as any)?.response?.data?.message || 'Storage Server Error',
          };
          console.log({ errorData });
          return {
            data: null,
            error: errorData,
          };
        }
      },
      remove: async (filePathArray: string[]) => {
        try {
          console.log(`Removing files from bucket: ${bucket}`);
          console.log({ filePathArray });
          const res = await axios.delete(
            `${STORAGE_URL}/storage/buckets/${bucket}/files`,
            {
              data: { pathArray: filePathArray },
              headers: {
                Authorization: `Bearer ${PUBLIC_KEY}`,
              },
            },
          );

          console.log('Upload response:', res.data);
          return { data: res.data, error: null };
        } catch (error) {
          responseError(error, showToast === true ? true : false);
          const errorData = {
            message:
              (error as any)?.response?.data?.message || 'Storage Server Error',
          };
          console.log({ errorData });
          return {
            data: null,
            error: errorData,
          };
        }
      },
      download: async (filePath: string) => {
        try {
          console.log(`Uploading file to bucket: ${bucket}`);
          const res = await axios.post(
            `${STORAGE_URL}/storage/buckets/${bucket}/files/download`,
            {
              filepath: filePath,
            },
            {
              headers: {
                Authorization: `Bearer ${PUBLIC_KEY}`,
              },
              responseType: 'blob',
            },
          );
          // Extract filename dari Content-Disposition header atau dari filePath
          const contentDisposition = res.headers['content-disposition'];
          let filename = 'download';

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
            if (filenameMatch) {
              filename = filenameMatch[1];
            }
          } else {
            // Fallback: ambil dari filePath
            filename = filePath.split('/').pop() || 'download';
          }

          // Create blob URL dan trigger download otomatis
          const url = window.URL.createObjectURL(res.data);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
          window.URL.revokeObjectURL(url);

          console.log('Download completed:', filename);

          console.log('Download response:', res.data);
          return { data: res.data, error: null };
        } catch (error) {
          responseError(error, showToast === true ? true : false);
          const errorData = {
            message:
              (error as any)?.response?.data?.message || 'Storage Server Error',
          };
          console.log({ errorData });
          return {
            data: null,
            error: errorData,
          };
        }
      },
      listFiles: async (
        { page, take }: { page: number; take: number },
        folderId?: number,
        folderLevel?: number,
      ) => {
        try {
          const res = await axios.get(
            `${STORAGE_URL}/storage/buckets/${bucket}/files`,
            {
              params: {
                folderId,
                folderLevel,
                page,
                take,
              },
              headers: {
                Authorization: `Bearer ${PUBLIC_KEY}`,
              },
            },
          );

          console.log('list files response:', res.data);

          return {
            data: {
              files: res.data.data.files as ListDataType[],
              folders: res.data.data.folders as {
                name: string;
                id: number;
                level: number;
              }[],
              page: res.data.page as number,
              take: res.data.take as number,
              totalPages: res.data.total_pages as number,
              totalData: res.data.total_data as number,
            },
            error: null,
          };
        } catch (error) {
          responseError(error, showToast === true ? true : false);
          const errorData = {
            message:
              (error as any)?.response?.data?.message || 'Storage Server Error',
          };
          console.log({ errorData });
          return {
            data: null,
            error: errorData,
          };
        }
      },
    };
  },
};

export type ListDataType = {
  id: number;
  folderId: number | null;
  bucketId: number;
  userId: number;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
  publicUrl: string;
  createdAt: string;
};
export type BucketDataType = {
  id: number;
  userId: number;
  name: string;
  public: boolean;
  createdAt: string;
};

export type BucketFolderType = {
  id: number;
  name: string;
  level: number;
};

const mimeTypesForBlob: Record<BucketList, string> = {
  'dump-images': 'image/png',
  img: 'image/png',
  'to-question': 'image/png',
  pdf: 'application/pdf',
  video: 'video/mp4',
  'dump-embedding': 'application/msword',
};

// ======================================================

let socket: Socket | null = null;

const serverUrl = STORAGE_UPLOAD_URL;

const connectSocket = () => {
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

const getSocket = () => socket;

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const useStorageSocket = (serverUrl?: string) => {
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

  const disconnect = useCallback(() => {
    disconnectSocket();
    listenersRef.current.clear();
  }, []);

  if (isConnected) {
    console.log('useStorageSocket:', { isConnected, socketId });
  }

  return {
    isConnected,
    socketId,
    on,
    off,
    emit,
    disconnect,
  };
};
