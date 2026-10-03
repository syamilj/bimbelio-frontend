'use client';

import { env } from '@/env.mjs';
import { storage } from '@/supabaseClient';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export type StorageBucket =
  'img' | 'to-question' | 'dump-images' | 'pdf' | 'video';

/** URL publik file di storage (sama dengan pola kode lama). */
export function storagePublicUrl(bucket: StorageBucket, path: string) {
  const base = {
    img: env.NEXT_PUBLIC_SUPABASE_IMG_URL,
    'to-question': env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL,
    'dump-images': env.NEXT_PUBLIC_SUPABASE_DUMP_IMAGES_URL,
    pdf: env.NEXT_PUBLIC_SUPABASE_PDF_URL,
    video: env.NEXT_PUBLIC_SUPABASE_VIDEO_URL,
  }[bucket];
  return `${base}/${path}`;
}

const joinPath = (folder: string | undefined, name: string) =>
  folder ? `${folder}/${name}` : name;

export class StorageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageUploadError';
  }
}

type UploadOptions = {
  /** Nama file di storage (tanpa folder). Default: `<prefix>-<uuid>`. */
  name?: string;
  /** Path lama (relatif terhadap folder) yang dihapus setelah unggahan berhasil. */
  replace?: string | null;
};

export type UploadResult = {
  /** Nama file tanpa folder, seperti yang disimpan backend. */
  name: string;
  /** Path lengkap di bucket (folder/nama). */
  path: string;
  url: string;
};

/**
 * Unggah/hapus file ke storage Bimbelio dengan state memuat dan pesan error
 * yang konsisten. Meniru perilaku kode lama: bila nama sudah dipakai, file
 * ditimpa (`update`); file lama dihapus setelah file baru tersimpan.
 *
 * ```ts
 * const { upload, isUploading } = useStorageUpload({ bucket: 'img', folder: 'tryout', prefix: 'tryout' });
 * const { name } = await upload(file, { replace: currentImage });
 * ```
 */
export function useStorageUpload({
  bucket,
  folder,
  prefix,
  toastError = true,
}: {
  bucket: StorageBucket;
  folder?: string;
  prefix?: string;
  toastError?: boolean;
}) {
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <R>(fn: () => Promise<R>): Promise<R> => {
      setPending((n) => n + 1);
      setError(null);
      try {
        return await fn();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'File gagal diproses.';
        setError(message);
        if (toastError) toast.error(message);
        throw err;
      } finally {
        setPending((n) => n - 1);
      }
    },
    [toastError],
  );

  const upload = useCallback(
    (file: File | Blob, options: UploadOptions = {}) =>
      run(async (): Promise<UploadResult> => {
        const name =
          options.name ?? `${prefix ? `${prefix}-` : ''}${crypto.randomUUID()}`;
        const path = joinPath(folder, name);
        const bucketApi = storage.from(bucket);
        const asFile =
          file instanceof File
            ? file
            : new File([file], name, { type: file.type });
        const res = await bucketApi.upload(path, asFile);
        if (res.error) {
          if (res.error.message === 'The resource already exists') {
            const updated = await bucketApi.update(path, asFile);
            if (updated.error)
              throw new StorageUploadError(
                `Gambar gagal diunggah: ${updated.error.message}`,
              );
          } else {
            throw new StorageUploadError(
              `Gambar gagal diunggah: ${res.error.message}`,
            );
          }
        }
        if (options.replace && options.replace !== name) {
          await bucketApi.remove([joinPath(folder, options.replace)]);
        }
        return { name, path, url: storagePublicUrl(bucket, path) };
      }),
    [run, bucket, folder, prefix],
  );

  const remove = useCallback(
    (names: string[]) =>
      run(async () => {
        const res = await storage
          .from(bucket)
          .remove(names.map((n) => joinPath(folder, n)));
        if (res.error)
          throw new StorageUploadError(
            `File gagal dihapus: ${res.error.message}`,
          );
      }),
    [run, bucket, folder],
  );

  const move = useCallback(
    (from: string, to: string) =>
      run(async () => {
        const res = await storage
          .from(bucket)
          .move(joinPath(folder, from), joinPath(folder, to));
        if (res.error)
          throw new StorageUploadError(
            `File gagal dipindah: ${res.error.message}`,
          );
      }),
    [run, bucket, folder],
  );

  return {
    upload,
    remove,
    move,
    isUploading: pending > 0,
    error,
    publicUrl: (name: string) =>
      storagePublicUrl(bucket, joinPath(folder, name)),
  };
}
