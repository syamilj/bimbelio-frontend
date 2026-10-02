# Redesign Bimbelio Frontend — Rancangan & Progres

Dokumen tunggal untuk redesign total FE (dan perubahan backend pendukung).
Semua keputusan, aturan desain, urutan kerja, dan checklist progres ada di sini.

## 1. Keputusan

| Topik | Keputusan |
|---|---|
| Arah visual | **"Lembar Jawaban"** — bahasa visual dari dunia ujian (LJK) |
| Git | Branch integrasi `redesign/v2`; tiap fase = branch `redesign/NN-nama` + PR ke `redesign/v2`. Merge `redesign/v2` → `main` hanya atas keputusan pemilik |
| Dark mode | Dihapus (tidak pernah aktif). Token disusun agar bisa ditambah nanti |
| Backend | Ikut dikerjakan: autosave jawaban tryout + endpoint status langganan gabungan. Deploy backend = keputusan pemilik |
| Package manager | bun saja |

## 2. Temuan audit (ringkas, Okt 2026)

- 723 file / ~186rb baris. Admin ~66rb, siswa ~57rb, `_shared` ~16rb, `ui` ~10rb.
- 89% `page.tsx` client component. Halaman guest SSR **hanya spinner**
  (`ProviderSessionAuth` mulai `isLoading=true`) → SEO & LCP buruk.
- 3 root layout (`(guest)`, `(link)`, `(main)`) → full reload antar grup; tracking
  script disalin 3x. 13 provider client, waterfall, kategori di-refetch tiap navigasi.
- Brand `#0091FF` tidak ada di token (`--primary` = hitam shadcn). 1.075 hex
  hardcode, ~700 inline style `mainColor`, 883 ukuran font arbitrer (30 nilai,
  `text-[10px]` ×431, sampai 6px), `rounded-3xl` ×1.033, gray+slate dicampur.
- 6 jenis loader, 2 library toast (6 halaman admin pakai `react-hot-toast` tanpa
  `<Toaster>` → toast tidak pernah tampil). Dark mode mati.
- Data layer: `useGet`/`getGeneral` berbasis `useEffect` (300+ call site), tanpa
  cache/invalidasi/abort; `useMutation` men-spread payload (FormData rusak).
- Duplikasi: editor tryout 4 salinan (18,6rb baris), ~35 tabel admin manual,
  3 mesin ujian, 7 timer, >10 empty/error state, 2.600 baris kode dikomentari,
  42 file mati, ~17 dependency tidak terpakai.
- Ujian: jawaban hanya di localStorage sampai submit, 12× `window.location.reload()`,
  BlockNote penuh per soal & per opsi, opsi `div` tanpa keyboard.
  (Kunci jawaban **tidak** bocor — backend menyembunyikan `value`/`explanation`.)
- Navbar `import * as LucideIcons` (seluruh ikon ke bundle guest); BimBot global
  memuat mermaid/shiki/katex di semua halaman siswa.
- Footer: link legal `href="#"`, © tahun hardcode. Homepage tanpa `<h1>`.
  Sitemap memuat route 404.
- Testing: nol. Dev lokal memakai **database produksi**.

## 3. Sistem desain "Lembar Jawaban"

**Gagasan.** Siswa Bimbelio hidup di antara lembar soal dan lembar jawaban. Elemen
khasnya **bubble LJK** (lingkaran A–E yang diisi). Bubble dipakai di tempat yang
memang bermakna "isian/progres": opsi jawaban, navigator soal, progres modul,
status. Semua yang lain tenang: datar, garis tipis, tanpa gradien dekoratif,
tanpa bayangan kecuali lapisan melayang.

### Warna (light)

| Token | Nilai | Peran |
|---|---|---|
| `--paper` | `#F6F8FB` | Latar aplikasi (kertas) |
| `--surface` | `#FFFFFF` | Panel, kartu, input |
| `--ink` | `#1B2230` | Teks utama (grafit) |
| `--ink-muted` | `#5B6475` | Teks sekunder |
| `--line` | `#E3E8EF` | Garis/border |
| `--brand` | `#0091FF` | Warna track (di-override per `web_sub_category`) |
| `--marker` | `#FCB930` | Stabilo: penanda "ragu-ragu", sorotan |
| `--success` | `#12A150` | Benar / berhasil |
| `--danger` | `#DA2850` | Salah / destruktif |

Turunan (`--brand-soft`, `--brand-strong`, dll.) dihitung dengan `color-mix()` dari
`--brand`, sehingga warna track tenant otomatis konsisten. Shadcn token
(`--primary`, `--muted`, ...) dipetakan ke token di atas.

### Tipografi

Satu keluarga: **Plus Jakarta Sans** (variable, buatan Indonesia, OFL), di-host
lokal. Angka skor/timer memakai `tabular-nums`.

Skala (px): 12 · 14 · 16 · 18 · 22 · 28 · 36 · 48. **Minimum 12px.**
Judul halaman 28/700, judul seksi 18/700, body 14–16/400–500.

### Bentuk & ruang

- Radius: `sm` 6px (input kecil, badge) · `md` 10px (tombol, kartu) · `lg` 16px
  (dialog, sheet) · `full` (bubble, avatar).
- Shadow: hanya `overlay` (popover/dialog/dropdown). Kartu memakai border.
- Spasi kelipatan 4. Konten rata kiri, `max-w-6xl` untuk aplikasi.
- Breakpoint: default Tailwind (sm/md/lg/xl/2xl) saja. Layout responsif lewat
  CSS, bukan `useMedia`.
- Motion: hanya sebagai respon aksi (buka/tutup, isi bubble). Hormati
  `prefers-reduced-motion`.

### Pagar pembatas (lint)

- Dilarang: hex arbitrer di className (`bg-[#...]`), `text-[Npx]`, `style={{ color }}`
  untuk warna tenant, `window.location.reload()` untuk perubahan state.
- Wajib: ikon dari `lucide-react` (import bernama), toast lewat `@/components/ui/toaster`.

## 4. Arsitektur target

```
src/
  app/
    layout.tsx                 # SATU root: <html>, font, metadata, analytics, Providers
    (guest)/ ...               # halaman marketing — server component + island client
    (link)/link/[slug]
    (main)/[web_sub_category]/
      layout.tsx               # resolve track di server → CSS var --brand
      (user)/user/...          # AppShell siswa
      (admin)/admin/...        # AdminShell
  components/
    ui/                        # primitive (shadcn, ditata ulang ke token)
    patterns/                  # PageHeader, EmptyState, ErrorState, StatCard,
                               # AnswerBubble, Countdown, ConfirmDialog, QueryState
    layout/                    # SiteHeader, SiteFooter, AppShell, AdminShell
  features/<fitur>/            # exam, course, workspace, chat, live, insight,
    api.ts                     # query/mutation (TanStack Query)
    components/  hooks/  model/
  lib/
    api/                       # apiClient, ApiError, queryKeys
    auth/  theme/  utils/
```

- **Data:** TanStack Query v5 di atas satu `apiClient` (axios) dengan `ApiError`
  bertipe, penanganan 401 global, AbortSignal. `useGet`/`useMutation` lama
  menjadi adapter tipis di atas Query selama migrasi, lalu dihapus.
- **Sesi:** tidak lagi memblokir render. Proxy sudah memverifikasi token; client
  memuat sesi sebagai query.
- **Tema track:** CSS var `--brand` diset di `<html>`/wrapper dari data track;
  `main-styles.ts` dan inline `mainColor` dihapus.
- **Mesin ujian tunggal** (`features/exam`): state machine
  `belum-mulai → sesi → istirahat → hasil`, tanpa reload; renderer soal ringan
  (HTML + KaTeX, bukan BlockNote); opsi `radiogroup` + pintasan A–E;
  autosave ke server (debounce) + cadangan lokal; peringatan sebelum keluar.
- **Admin:** `DataTable` (state di URL, reset halaman saat filter berubah),
  `ResourceForm` (react-hook-form + zod), satu route untuk new/edit,
  `ConfirmDialog`/`useConfirm`, `useStorageUpload`, `AssessmentEditor`
  (tryout & quiz), `CategoryManager`.

## 5. Strategi testing

| Lapis | Alat | Cakupan |
|---|---|---|
| Unit | Vitest | util (currency, date, phone, slug, subtest), apiClient, queryKeys, state machine ujian, scoring, proxy (role gating) |
| Komponen | Vitest + Testing Library + happy-dom + MSW | primitive & pattern, form + validasi, DataTable, mesin ujian (keyboard, autosave, timer) |
| E2E | Playwright + API mock (route interception + mock server untuk proxy) | alur guest, login (sesi palsu), dashboard, tryout end-to-end, course study, admin CRUD |
| Aksesibilitas | `@axe-core/playwright` | halaman utama tiap area |
| CI | GitHub Actions (bun) | lint, typecheck, unit, build, e2e |

**Aturan keamanan tes:** env tes mengarahkan `NEXT_PUBLIC_API_URL` ke host yang
tidak bisa dirutekan; semua request ke host produksi diblokir oleh fixture.
Tidak ada tes yang boleh menyentuh database produksi.

## 6. Fase & checklist

Setiap fase wajib lolos `bun run check`, `bun run test`, `bun run build`
(dan e2e yang relevan) sebelum PR.

### Fase 1 — Fondasi (`redesign/01-foundation`) ✅
- [x] Semua dependency ke versi terbaru (Next 16.3.8, React 19.3, TS 7 + TS 6 compat, ESLint 10, zod 4, AI SDK 7, BlockNote 0.55, lucide 1, react-day-picker 10, resizable-panels 4, Vitest 5, MSW 3)
- [x] Hapus 41 file & 30+ dependency mati; satu library: sonner, framer-motion, lucide, `radix-ui`
- [x] Infrastruktur tes: Vitest + RTL + MSW (request tak di-mock = gagal), Playwright + mock API server + blokir host eksternal + axe, CI GitHub
- [x] Lint guard sistem desain untuk kode baru (hex/px arbitrer, reload, impor lama)
- [x] Token desain (`styles/tokens.css`), `vendor.css`, `legacy.css` (sementara), font Plus Jakarta Sans
- [x] Primitive `ui/` ditata ulang ke token (tanpa hack MutationObserver); radio = bubble LJK
- [x] Pattern: AnswerBubble, BubbleLoader/PageLoader, PageHeader, EmptyState, ErrorState, QueryState, StatCard, ConfirmDialog/useConfirm, Countdown
- [x] `apiClient` (ApiError bertipe) + TanStack Query. **Tanpa adapter**: `useGet` lama tetap, dihapus saat fitur dimigrasi
- [x] Satu root layout; sesi tidak memblokir SSR halaman publik; tier dihitung per track aktif
- [x] Tema track via CSS var `--brand` (kelas `bg-main` lama otomatis ikut), 404 & error global baru

### Fase 2 — Shell (`redesign/02-shell`)
- [ ] SiteHeader + menu mobile (Sheet), SiteFooter server component, halaman legal
- [ ] AppShell siswa (sidebar desktop + tab bar mobile), AdminShell
- [ ] Provider langganan/limitasi/notifikasi/onboarding dipindah ke layout user & dirampingkan

### Fase 3 — Guest (`redesign/03-guest`)
- [ ] Landing (server, `<h1>` nyata), about, beasiswa, blog, price, calendar, tryout, link, `/l/[code]`
- [ ] Metadata per halaman, sitemap & robots dari env

### Fase 4 — Siswa (`redesign/04-*`)
- [ ] Mesin ujian tunggal (tryout, quiz, tryout course, quiz workspace) + hasil
- [ ] Course study & workspace (StudyLayout bersama, panel berat via `dynamic`)
- [ ] BimBot, BimBoard, BimInsight, BimLive, prediction, explore, leaderboard, langganan/pembayaran

### Fase 5 — Admin (`redesign/05-*`)
- [ ] Building block admin (DataTable, ResourceForm, ConfirmDialog, upload)
- [ ] AssessmentEditor (tryout/quiz), CategoryManager, plan form berbasis zod
- [ ] Migrasi semua seksi; role gating dari satu config (proxy + sidebar)

### Fase 6 — Backend (`bimbelio-backend`, branch `feat/redesign-support`)
- [ ] Endpoint autosave jawaban tryout + tes
- [ ] Endpoint status langganan gabungan + tes

### Fase 7 — Penutup
- [ ] E2E menyeluruh + axe, audit bundle & Lighthouse, hapus kode lama tersisa
- [ ] PR `redesign/v2` → `main`

## 7. Log progres

### Fase 1 — 2026-10-02
- Baseline sebelum mulai: typecheck/lint/build lolos, 0 tes.
- Bug yang ditemukan & diperbaiki saat fondasi:
  - Toast di 6 halaman admin (react-hot-toast tanpa `<Toaster>`) tidak pernah tampil.
  - AI popover catatan & evaluasi quiz menampilkan baris SSE mentah sejak backend
    pindah ke UI message stream (Feb 2026) — `streamProtocol` diperbaiki.
  - `@keyframes pulse` kustom menimpa `animate-pulse` (skeleton berdenyut bayangan biru).
  - Sesi: tier langganan dihitung sekali dari URL saat mount; kini per track aktif.
  - URL satu segmen tak dikenal memunculkan dialog pemilih track, bukan 404.
  - Kategori track di-refetch + overlay layar penuh di setiap navigasi.
  - `console.log` sesi (berisi token) dihapus.
- Upgrade: `react-resizable-panels` v4 menafsirkan angka sebagai **piksel**; wrapper
  menjaga kontrak lama (angka = persen) agar panel course/workspace tidak rusak.
- TS 7 tidak punya JS API: `tsc` (typecheck) = TS 7; `typescript` = alias TS 6
  untuk typescript-eslint, prettier, dan type-check `next build`.
- Hack `font-size: 85%` mobile dihapus → halaman lama tampil lebih besar di
  mobile sampai dimigrasi (navbar lama meluber — diganti di Fase 2).

## 8. Rekomendasi yang butuh keputusan pemilik

1. **Optimasi gambar Next** (`images.unoptimized: true` saat ini) — menyalakannya
   memperbaiki LCP tapi menambah biaya Vercel per gambar sumber.
2. **Token di cookie httpOnly** — sekarang dibaca JS (rentan XSS). Butuh perubahan
   kontrak login di backend.
3. **Role FINANCE** bisa membuka semua halaman admin lewat URL (hanya sidebar yang
   membatasi). Akan dirapikan di Fase 5 dengan satu konfigurasi role.
4. **`/admin/login`** = masuk sebagai pengguna mana pun lewat email. Pastikan
   backend membatasi pemanggilnya.
