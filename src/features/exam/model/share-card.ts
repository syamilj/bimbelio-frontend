import { LOGO_PATHS } from '@/components/brand/logo-paths';
import { SCORE_DISCLAIMER } from '@/components/brand/disclaimer';
import { fillLevels } from '@/components/charts/bubble/geometry';
import { formatScore } from './result';

/**
 * Kartu story "Bagikan rapor" 1080×1920 ala Wrapped, digambar di <canvas>
 * tanpa library: Tinta + lime, logo, skor raksasa, profil subtes bubble, Lio,
 * "bimbelio.com". Huruf memakai font halaman (Parkinsans, DM Mono) yang
 * sudah dimuat — `document.fonts.ready` ditunggu dulu.
 */

export const CARD_W = 1080;
export const CARD_H = 1920;

// Cadangan nilai token merek; saat menggambar, nilai dibaca dari CSS var
// (`readCardColors`) agar tetap satu sumber dengan tokens.css.
export const CARD_COLORS = {
  ink: '#0b1736',
  brand: '#0066ff',
  lime: '#c6f432',
  white: '#ffffff',
  muted: 'rgba(255,255,255,0.72)',
  faint: 'rgba(255,255,255,0.22)',
  success: '#0b7038',
};

export type CardColors = typeof CARD_COLORS;

/** Baca warna dari token CSS (canvas tidak bisa memakai `var(--…)`). */
export function readCardColors(): CardColors {
  if (typeof window === 'undefined') return CARD_COLORS;
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) =>
    css.getPropertyValue(name).trim() || fallback;
  return {
    ...CARD_COLORS,
    ink: v('--ink', CARD_COLORS.ink),
    brand: v('--brand', CARD_COLORS.brand),
    lime: v('--lime', CARD_COLORS.lime),
    success: v('--success', CARD_COLORS.success),
  };
}

export type ShareCardData = {
  title: string;
  score: number;
  /** "di atas X% peserta"; null bila terkunci/tidak ada. */
  above: number | null;
  delta: number | null;
  subtests: { code: string; score: number }[];
  focusCode?: string;
  max: number;
};

export type ShareCardFonts = { display: string; mono: string; sans: string };

/** Teks yang tampil di kartu (juga dipakai tes & teks bagikan). */
export function shareCardLines(d: ShareCardData) {
  return {
    label: 'rapor TO',
    score: formatScore(d.score),
    position: d.above !== null ? `di atas ${d.above}% peserta` : null,
    delta:
      d.delta === null || d.delta === 0
        ? null
        : d.delta > 0
          ? `▲ +${d.delta}`
          : `▼ ${d.delta}`,
    shareText:
      `Skor TO-ku ${formatScore(d.score)}` +
      (d.above !== null ? `, di atas ${d.above}% peserta` : '') +
      '. Latihan bareng di bimbelio.com',
  };
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/\s+\S*$/, '')}…`;
    return kept;
  }
  return lines;
}

function drawLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  c: CardColors,
) {
  const p = LOGO_PATHS.horizontal;
  const [vx, vy, vw, vh] = p.viewBox.split(/\s+/).map(Number);
  const scale = width / vw;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(-vx, -vy);
  ctx.fillStyle = c.white;
  ctx.fill(new Path2D(p.body));
  if (p.dots) {
    ctx.fillStyle = c.lime;
    ctx.fill(new Path2D(p.dots));
  }
  ctx.restore();
  return vh * scale;
}

function bubble(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  fill: number,
  color: string,
  empty: string,
) {
  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = fill > 0 ? color : empty;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  if (fill > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = color;
    // Isian sebagian = bubble terisi dari bawah.
    ctx.fillRect(cx - r, cy + r - 2 * r * fill, 2 * r, 2 * r * fill);
  }
  ctx.restore();
}

export function drawShareCard(
  ctx: CanvasRenderingContext2D,
  d: ShareCardData,
  fonts: ShareCardFonts,
  lio?: CanvasImageSource | null,
  c: CardColors = CARD_COLORS,
) {
  const L = shareCardLines(d);
  const X = 96;
  const W = CARD_W - X * 2;

  ctx.fillStyle = c.ink;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Logo + Lio di pojok kanan atas
  drawLogo(ctx, X, 120, 360, c);
  if (lio) {
    const s = 220;
    ctx.drawImage(lio, CARD_W - X - s, 60, s, s);
  }

  // Label + judul
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = c.muted;
  ctx.font = `500 40px ${fonts.mono}`;
  ctx.fillText(L.label, X, 340);
  ctx.fillStyle = c.white;
  ctx.font = `700 60px ${fonts.display}`;
  const titleLines = wrap(ctx, d.title, W, 2);
  titleLines.forEach((line, i) => ctx.fillText(line, X, 420 + i * 72));

  // Skor raksasa
  const scoreY = 420 + titleLines.length * 72 + 300;
  ctx.fillStyle = c.lime;
  let size = 320;
  ctx.font = `800 ${size}px ${fonts.display}`;
  while (ctx.measureText(L.score).width > W && size > 160) {
    size -= 20;
    ctx.font = `800 ${size}px ${fonts.display}`;
  }
  ctx.fillText(L.score, X - 10, scoreY);

  // Posisi + selisih
  let y = scoreY + 100;
  if (L.position) {
    ctx.font = `700 64px ${fonts.display}`;
    ctx.fillStyle = c.white;
    ctx.fillText(L.position, X, y);
    y += 40;
  }
  if (L.delta) {
    y += 30;
    ctx.font = `700 44px ${fonts.display}`;
    const tw = ctx.measureText(L.delta).width;
    ctx.fillStyle = d.delta! > 0 ? c.success : c.faint;
    ctx.beginPath();
    ctx.roundRect(X, y - 50, tw + 56, 72, 36);
    ctx.fill();
    ctx.fillStyle = c.white;
    ctx.fillText(L.delta, X + 28, y + 2);
    y += 40;
  }

  // Profil subtes (maks. 7 baris)
  const rows = d.subtests.slice(0, 7);
  if (rows.length) {
    y += 80;
    ctx.fillStyle = c.muted;
    ctx.font = `500 34px ${fonts.mono}`;
    ctx.fillText('profil subtes', X, y);
    y += 40;
    const per = 100;
    const n = Math.ceil(d.max / per);
    const r = 24;
    const gap = 12;
    const labelW = 150;
    rows.forEach((row) => {
      y += 2 * r + 20;
      const on = row.code === d.focusCode;
      ctx.fillStyle = on ? c.lime : c.white;
      ctx.font = `500 36px ${fonts.mono}`;
      ctx.fillText(row.code, X, y + 12);
      fillLevels(row.score, per, n).forEach((f, b) => {
        bubble(
          ctx,
          X + labelW + r + b * (2 * r + gap),
          y,
          r,
          f,
          on ? c.lime : c.white,
          c.faint,
        );
      });
      ctx.textAlign = 'right';
      ctx.font = `700 40px ${fonts.display}`;
      ctx.fillText(formatScore(row.score), X + W, y + 14);
      ctx.textAlign = 'left';
    });
  }

  // Kaki: situs + penafian
  ctx.fillStyle = c.white;
  ctx.font = `500 44px ${fonts.mono}`;
  ctx.fillText('bimbelio.com', X, CARD_H - 130);
  ctx.fillStyle = c.muted;
  ctx.font = `400 28px ${fonts.sans}`;
  wrap(ctx, SCORE_DISCLAIMER, W, 2).forEach((line, i) =>
    ctx.fillText(line, X, CARD_H - 80 + i * 38),
  );
}
