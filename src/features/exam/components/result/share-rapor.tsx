'use client';

import { Lio } from '@/components/brand/lio';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { barsMax, scoreLio, type SubtestRow } from '../../model/result';
import {
  CARD_H,
  CARD_W,
  drawShareCard,
  readCardColors,
  shareCardLines,
  type ShareCardData,
} from '../../model/share-card';

type Props = {
  title: string;
  score: number;
  above: number | null;
  delta: number | null;
  rows: SubtestRow[];
  focusCode?: string;
};

const fontVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;

/** SVG Lio di DOM → gambar (CSS var diganti nilai nyata). */
async function svgToImage(svg: SVGSVGElement | null) {
  if (!svg) return null;
  const css = getComputedStyle(document.documentElement);
  const markup = new XMLSerializer()
    .serializeToString(svg)
    .replace(/var\((--[a-z-]+)\)/g, (_, name: string) =>
      css.getPropertyValue(name === '--accent' ? '--lime' : name).trim(),
    );
  const url = URL.createObjectURL(
    new Blob([markup], { type: 'image/svg+xml' }),
  );
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } catch {
    return null;
  } finally {
    // Gambar sudah ter-decode; URL boleh dilepas setelah digambar.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export async function renderShareCard(
  data: ShareCardData,
  lioSvg: SVGSVGElement | null,
) {
  await document.fonts?.ready;
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas tidak didukung');
  const fonts = {
    display: fontVar('--font-parkinsans', 'sans-serif'),
    mono: fontVar('--font-dm-mono', 'monospace'),
    sans: fontVar('--font-jakarta', 'sans-serif'),
  };
  drawShareCard(ctx, data, fonts, await svgToImage(lioSvg), readCardColors());
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Gagal membuat gambar'))),
      'image/png',
    ),
  );
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * "Bagikan rapor": kartu story 1080×1920 dirender di perangkat (canvas, tanpa
 * library), dibagikan lewat Web Share API; bila tidak didukung → diunduh.
 */
export function ShareRaporButton({
  title,
  score,
  above,
  delta,
  rows,
  focusCode,
}: Props) {
  const lioRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const onShare = async () => {
    setBusy(true);
    const data: ShareCardData = {
      title,
      score,
      above,
      delta,
      focusCode,
      max: barsMax(rows),
      subtests: rows.map((r) => ({ code: r.code, score: r.score })),
    };
    try {
      const blob = await renderShareCard(
        data,
        lioRef.current?.querySelector('svg') ?? null,
      );
      const file = new File([blob], 'rapor-bimbelio.png', {
        type: 'image/png',
      });
      const text = shareCardLines(data).shareText;
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Rapor TO', text });
          return;
        } catch (error) {
          // Dibatalkan pengguna → selesai tanpa unduh.
          if ((error as DOMException)?.name === 'AbortError') return;
        }
      }
      download(blob, 'rapor-bimbelio.png');
      toast.success('Kartu rapor tersimpan', {
        description: 'Unggah ke story atau kirim ke temanmu.',
      });
    } catch {
      toast.error('Kartu rapor gagal dibuat. Coba lagi, ya.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        variant="accent"
        onClick={onShare}
        loading={busy}
      >
        {!busy && <Share2 aria-hidden />}
        Bagikan rapor
      </Button>
      {/* Sumber gambar Lio untuk kartu; tidak tampil. */}
      <div
        ref={lioRef}
        hidden
        aria-hidden
      >
        <Lio
          expression={scoreLio(delta)}
          props={delta !== null && delta > 0 ? ['kilau'] : []}
          tone="white"
          size="m"
        />
      </div>
    </>
  );
}
