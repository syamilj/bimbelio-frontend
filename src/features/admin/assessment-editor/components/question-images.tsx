'use client';

import { Button } from '@/components/ui/button';
import { ImagePlus, ImageUp, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import {
  storagePublicUrl,
  useStorageUpload,
} from '../../hooks/use-storage-upload';

/** Potongan HTML gambar BlockNote (sama dengan `BlockNoteImageHtml` lama). */
export const blockNoteImageHtml = (url: string) =>
  `<div class="bn-block-outer" data-node-type="blockOuter"><div class="bn-block" data-node-type="blockContainer"><div class="bn-block-content" data-content-type="image" data-url="${url}" data-file-block="" contenteditable="false"><div class="bn-file-block-content-wrapper"><div class="bn-visual-media-wrapper"><img class="bn-visual-media" src="${url}" alt="" contenteditable="false" draggable="false"></div></div></div></div></div>`;

export const questionImageUrl = (name: string) =>
  storagePublicUrl('to-question', name);

/**
 * Gambar soal/opsi di bucket `to-question`:
 * unggah → "Sisipkan ke teks" (menambah gambar ke isi BlockNote) → hapus.
 */
export function QuestionImageControls({
  image,
  fileName,
  onUploaded,
  onInsert,
  onRemoved,
  label,
}: {
  image: string | null | undefined;
  /** Nama file baru, mis. `<uuid>-3`. */
  fileName: () => string;
  onUploaded: (name: string) => void;
  onInsert: (html: string) => void;
  onRemoved: () => void;
  /** Untuk label aksesibel, mis. "soal 3" atau "opsi B". */
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, remove, isUploading } = useStorageUpload({
    bucket: 'to-question',
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          try {
            const res = await upload(file, { name: fileName() });
            onUploaded(res.name);
          } catch {}
        }}
      />
      {image ? (
        <>
          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={() =>
              onInsert(blockNoteImageHtml(questionImageUrl(image)))
            }
            aria-label={`Sisipkan gambar ke teks ${label}`}
          >
            <ImagePlus />
            Sisipkan ke teks
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            loading={isUploading}
            onClick={async () => {
              try {
                await remove([image]);
                onRemoved();
              } catch {}
            }}
            aria-label={`Hapus gambar ${label}`}
          >
            {!isUploading && <Trash2 />}
            Hapus gambar
          </Button>
          <span className="font-mono text-xs text-ink-subtle">{image}</span>
        </>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          loading={isUploading}
          onClick={() => inputRef.current?.click()}
          aria-label={`Unggah gambar ${label}`}
        >
          {!isUploading && <ImageUp />}
          Unggah gambar
        </Button>
      )}
    </div>
  );
}
