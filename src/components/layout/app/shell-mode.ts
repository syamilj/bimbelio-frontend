/**
 * Mode kerangka aplikasi siswa, ditentukan dari URL saat render (bukan di
 * effect, agar tidak ada kedipan layout).
 * - `bare`: halaman ujian — tanpa sidebar/header agar siswa fokus.
 * - `immersive`: ruang belajar (workspace dokumen, course study) — layar penuh.
 * - `default`: halaman biasa.
 */
export type ShellMode = 'bare' | 'immersive' | 'default';

export function getShellMode(pathname: string): ShellMode {
  const parts = pathname.split('/').filter(Boolean);
  // parts: [track, 'user', feature, ...]
  const feature = parts.slice(2);

  // /bimarena/try-out/[id] dan /bimarena/quiz/[volumeId]/[id]
  if (feature[0] === 'bimarena') {
    if (feature[1] === 'try-out' && feature.length >= 3) return 'bare';
    if (feature[1] === 'quiz' && feature.length >= 4) return 'bare';
  }
  // /workspace/[category]/[docsid]
  if (feature[0] === 'workspace' && feature.length >= 3) return 'immersive';
  // /bimcourse/[categoryId]/study
  if (feature[0] === 'bimcourse' && feature[2] === 'study') return 'immersive';

  return 'default';
}
