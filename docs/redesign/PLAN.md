# Redesign Bimbelio Frontend — Rancangan & Progres

Dokumen tunggal untuk redesign total FE (dan perubahan backend pendukung).
Semua keputusan, aturan desain, urutan kerja, dan checklist progres ada di sini.

## 1. Keputusan

| Topik           | Keputusan                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Arah visual     | **"Lembar Jawaban"** — bahasa visual dari dunia ujian (LJK)                                                                                            |
| Git             | Branch integrasi `redesign/v2`; tiap fase = branch `redesign/NN-nama` + PR ke `redesign/v2`. Merge `redesign/v2` → `main` hanya atas keputusan pemilik |
| Dark mode       | Dihapus (tidak pernah aktif). Token disusun agar bisa ditambah nanti                                                                                   |
| Backend         | Ikut dikerjakan: autosave jawaban tryout + endpoint status langganan gabungan. Deploy backend = keputusan pemilik                                      |
| Package manager | bun saja                                                                                                                                               |

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

> **Diganti oleh merek 2.1 (2026-10-03).** Nilai warna, huruf, radius, dan elemen
> merek kini mengikuti [`BRAND-2.1.md`](./BRAND-2.1.md) (disetujui pemilik).
> Bagian di bawah dipertahankan sebagai sejarah; gagasan bubble LJK tetap berlaku.

**Gagasan.** Siswa Bimbelio hidup di antara lembar soal dan lembar jawaban. Elemen
khasnya **bubble LJK** (lingkaran A–E yang diisi). Bubble dipakai di tempat yang
memang bermakna "isian/progres": opsi jawaban, navigator soal, progres modul,
status. Semua yang lain tenang: datar, garis tipis, tanpa gradien dekoratif,
tanpa bayangan kecuali lapisan melayang.

### Warna (light)

| Token         | Nilai     | Peran                                            |
| ------------- | --------- | ------------------------------------------------ |
| `--paper`     | `#F6F8FB` | Latar aplikasi (kertas)                          |
| `--surface`   | `#FFFFFF` | Panel, kartu, input                              |
| `--ink`       | `#1B2230` | Teks utama (grafit)                              |
| `--ink-muted` | `#5B6475` | Teks sekunder                                    |
| `--line`      | `#E3E8EF` | Garis/border                                     |
| `--brand`     | `#0091FF` | Warna track (di-override per `web_sub_category`) |
| `--marker`    | `#FCB930` | Stabilo: penanda "ragu-ragu", sorotan            |
| `--success`   | `#12A150` | Benar / berhasil                                 |
| `--danger`    | `#DA2850` | Salah / destruktif                               |

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

### Penamaan URL

- Segmen URL memakai **bahasa Inggris**, huruf kecil, dipisah tanda hubung
  (`/scholarship`, `/<track>/user/plans`). Isi halaman tetap berbahasa Indonesia.
- Nama produk (`bimboard`, `bimarena`, …) tetap sebagai merek.
- Mengganti URL wajib disertai redirect permanen (301) di `next.config.ts`.
  Diganti: `/beasiswa` → `/scholarship`, `/<track>/user/paket-belajar` →
  `/<track>/user/plans`, `/tutor` → `/#tutors`.
- Folder non-rute di dalam `app/` diberi awalan `_` (`_components`).

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

### Domain terpisah (situs / app / admin)

Satu codebase dan satu deploy, tiga host. Rute di filesystem tidak berubah
(`/[track]/user/...`, `/[track]/admin/...`); `proxy.ts` menerjemahkan per host
lewat `routeByHost` (`src/lib/surface.ts`, murni dan diuji unit):

| Host                 | URL publik                 | Rute internal                   |
| -------------------- | -------------------------- | ------------------------------- |
| `www.bimbelio.com`   | `/`, `/price`, `/blog/...` | sama                            |
| `app.bimbelio.com`   | `/utbk/bimboard`           | `/utbk/user/bimboard` (rewrite) |
| `admin.bimbelio.com` | `/utbk/voucher`            | `/utbk/admin/voucher` (rewrite) |

- URL lama `www/<track>/user/...` dan `www/<track>/admin/...` → **308** ke subdomain.
  Link lama di notifikasi dan kode juga ikut teralihkan.
- Di subdomain: `/` → dashboard track terakhir (cookie `bimbelio_track`),
  halaman marketing → 308 ke situs, area lain → domainnya, bentuk lama
  `/<track>/user/...` → bentuk baru. Semua respons subdomain `X-Robots-Tag: noindex`.
- Tanpa sesi → beranda situs. Role tidak cukup → dashboard subdomain itu.
- Link: `appPath`/`adminPath` menghasilkan URL absolut subdomain. Next tetap
  menavigasi client-side bila origin sama, jadi satu href benar dari host mana pun.
  `siteHref()` dipakai untuk link marketing dari komponen yang tampil di app.
- `useRoutePathname('app' | 'admin')` dan `toRoutePath()` menyamakan pathname
  publik dan internal untuk mode shell, status menu aktif, dan breadcrumb.
- Cookie `token` dan `bimbelio_track` ber-domain `NEXT_PUBLIC_COOKIE_DOMAIN` (`.bimbelio.com`).
- **Env kosong = satu domain** (lokal, preview Vercel): perilaku persis seperti sebelumnya.

## 5. Strategi testing

| Lapis         | Alat                                                                 | Cakupan                                                                                                              |
| ------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Unit          | Vitest                                                               | util (currency, date, phone, slug, subtest), apiClient, queryKeys, state machine ujian, scoring, proxy (role gating) |
| Komponen      | Vitest + Testing Library + happy-dom + MSW                           | primitive & pattern, form + validasi, DataTable, mesin ujian (keyboard, autosave, timer)                             |
| E2E           | Playwright + API mock (route interception + mock server untuk proxy) | alur guest, login (sesi palsu), dashboard, tryout end-to-end, course study, admin CRUD                               |
| Aksesibilitas | `@axe-core/playwright`                                               | halaman utama tiap area                                                                                              |
| CI            | GitHub Actions (bun)                                                 | lint, typecheck, unit, build, e2e                                                                                    |

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

### Fase 2 — Shell (`redesign/02-shell`) ✅

- [x] SiteHeader (Radix NavigationMenu, tautan nyata termasuk `/#anchor`), menu mobile (Sheet), SiteFooter server component, dialog kontak berbasis state (`useContact`)
- [x] AppShell siswa: sidebar (ciut tersimpan), topbar (pencarian ⌘K, paket & koin, notifikasi, akun), tab bar mobile, mode shell dari URL (`bare`/`immersive`/`default`)
- [x] AdminShell: satu konfigurasi menu + filter role, status aktif per segmen, breadcrumb
- [x] 4 provider cek langganan → `SubscriptionChecks` (refresh sesi, bukan reload); cek pembayaran tanpa klik DOM; "upgrade" = navigasi ke Paket Belajar
- [x] Pemilih track (TrackPicker) dengan bubble; BimBot dimuat lazy
- [x] Halaman legal `/privacy` & `/terms` (Fase 3c), ditautkan dari footer & sitemap

### Fase 3 — Guest (`redesign/03-guest`) ✅

- [x] Beranda server-rendered dengan `<h1>` nyata, hero kartu LJK, statistik persaingan bubble, FAQ `<details>` + JSON-LD
- [x] `/price` + `/price/[slug]` server-rendered (404 nyata, Product JSON-LD); checkout ditulis ulang (voucher teruji, satu instance kartu, resume `?checkout=`)
- [x] Login (dialog + One Tap) tanpa reload, redirect aman (`//price` & open redirect dicegah)
- [x] Blog: daftar & artikel dirender server (HTML tersanitasi, KaTeX, daftar isi dari id yang sama), 404 nyata, view sekali per sesi
- [x] About, scholarship, calendar, tryout sebagai server component dengan metadata
- [x] `/l/[code]` redirect server; halaman link: password via POST + cookie httpOnly
- [x] URL bahasa Inggris + redirect 301; sitemap (artikel, paket, link) & robots dari `siteConfig`
- [x] E2E: SEO/SSR, checkout, redirect, sitemap, password link, axe (desktop & mobile)

### Fase 3b — Domain terpisah (`redesign/03b-domains`) ✅ (aktif setelah env diisi)

- [x] Routing per host di `proxy.ts` (rewrite, redirect 308, noindex), matcher semua halaman
- [x] Link builder & pathname helper sadar subdomain; cookie sesi lintas subdomain
- [x] Logout dari subdomain kembali ke beranda situs; ganti track tetap di host yang sama
- [x] Tes unit `surface.test.ts`; E2E project `domains` (`www./app./admin.localhost` via `next dev`)

### Fase 3c — Keputusan pemilik (`redesign/03c-owner-decisions`) ✅

- [x] Tanpa biaya tambahan Vercel: proxy hanya di area aplikasi & host app/admin, `/price` dan `/price/[planId]` ISR, optimasi gambar tetap mati, cache gambar publik setahun
- [x] Halaman Kebijakan Privasi & Syarat dan Ketentuan
- [x] Klaim pemasaran dikonfirmasi benar oleh pemilik (tidak diubah)
- [x] Sesi di cookie httpOnly (backend `feat/httponly-session-finance-scope`), aktif dengan `NEXT_PUBLIC_SESSION_COOKIE=httponly`
- [x] FINANCE hanya membuka Transaksi (proxy + menu dari satu aturan `lib/auth/access.ts`); prefetch tidak lagi lolos dengan JWT tanpa verifikasi
- [x] CI: `typecheck` menjalankan `next typegen` dulu (deklarasi impor gambar)

### Fase 3d — Merek 2.1: fondasi (`redesign/03d-brand-2.1`)

- [x] Token 2.1 (Biru `#0066FF`, Tinta, Kertas, lime/pink satu per tampilan, `data-surface`), stabilo dihapus
- [x] Huruf Parkinsans, Shantell Sans (subset 54 KB), DM Mono via `next/font/local`
- [x] Logo 2.1 (4 versi, titik i = aksen/program), favicon, ikon aplikasi, manifest, OG 1200×630
- [x] Warna track DB → `--program` (peta merek); `--brand` dan `mainColor` lama dikunci Biru
- [x] Komponen merek: Lio, BimBotAvatar, Sticker, Highlight, Scribble, InfoPill, SeriesLabel, MonoLabel, Disclaimer, Supergraphic
- [x] Chart bubble LJK: tangga, batang, sebaran, peta jam (+ tes geometri)
- [x] Primitive & pattern di-re-skin (tombol pil, kartu 18, toast Tinta, ragu = bubble setengah)
- [x] `/styleguide` (bukan produksi) + lint guard kelas merek lama

### Fase 3e — Re-skin shell & halaman publik (`redesign/03e-brand-guest`)

- [ ] SiteHeader/Footer (footer Tinta), AppShell/AdminShell
- [ ] Beranda baru (hero Biru + Lio), price, checkout, blog, calendar, tryout, about, scholarship, legal, 404/error, OG dinamis
- [ ] Snapshot visual + axe halaman publik

### Fase 4 — Siswa (`redesign/04-*`)

- [ ] Mesin ujian tunggal (tryout, quiz, tryout course, quiz workspace) + hasil
- [ ] Course study & workspace (StudyLayout bersama, panel berat via `dynamic`)
- [ ] BimBot, BimBoard, BimInsight, BimLive, prediction, explore, leaderboard, langganan/pembayaran
- [ ] Rapor TO 2.1 + kartu "Bagikan rapor" (story 1080×1920)

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

### Fase 2 — 2026-10-02

- Spesifikasi fungsional shell lama disusun lebih dulu agar tidak ada fitur hilang.
- Bug lama yang hilang bersama rewrite: link Kalender/WhatsApp ke halaman induk,
  link dashboard `/null/...`, nomor WhatsApp footer tidak cocok, navbar ganda di
  blog/kalender & footer ganda di /tryout, dua instance sidebar mobile, menu admin
  "Dashboard" selalu aktif & `tryout` aktif di `tryout-coupon`, tombol admin mati,
  `ProviderLimitation` memblokir SSR halaman publik.
- Disederhanakan dengan sengaja: submenu mata pelajaran di sidebar (diganti
  halaman BimCourse), fetch plan untuk dropdown navbar, komponen `payment.tsx`
  (1.144 baris, hanya redirect).

### Fase 3b — 2026-10-02

- `usePathname()` bisa mengembalikan bentuk publik (`/utbk/bimboard`) maupun
  internal, tergantung rewrite dan prerender. Semua logika yang membaca path
  kini lewat `toRoutePath`, jadi hasilnya sama di server dan client.
- Next dev menganggap `localhost` sebagai origin sendiri dan membuat redirect ke
  `http://localhost:…` menjadi relatif (loop). Karena itu E2E memakai `www.localhost`.
- Tidak terdampak di produksi: host situs (`www.bimbelio.com`) berbeda dari host app.

## 8. Rekomendasi yang butuh keputusan pemilik

1. **Optimasi gambar Next — DIPUTUSKAN: tetap mati.** Tidak boleh ada biaya
   tambahan Vercel. Hal lain yang menambah biaya (proxy di setiap halaman,
   `/price` dinamis) sudah dikembalikan di Fase 3c.
2. **Token di cookie httpOnly — DIKERJAKAN (Fase 3c).** Backend memasang cookie
   `bimbelio_session` (httpOnly, `Domain=.bimbelio.com`) saat login dan tetap
   menerima Bearer (aplikasi mobile, preview). Request pengubah data lewat cookie
   wajib `Origin` terdaftar. Token lama di cookie JS dipindahkan otomatis lewat
   `POST /auth/sessionCookie`, jadi pengguna tidak perlu login ulang. Urutan
   aktivasi: butir 7, langkah 7.
3. **Role FINANCE — DIKERJAKAN (Fase 3c).** Frontend: FINANCE hanya membuka
   Transaksi. Backend: FINANCE tidak lagi bebas memakai `userId` user lain,
   kecuali di endpoint `financeOrAdmin`.
4. **`/admin/login` — DIPERIKSA.** Backend hanya mengizinkan ADMIN/SUPER_ADMIN
   (ADMIN tidak bisa masuk sebagai akun staff), kini dengan log audit
   `[impersonation]`. Frontend kini juga menolak FINANCE di halaman ini.
5. **Halaman legal — DIKERJAKAN (Fase 3c)** dari praktik data di kode (login
   Google, Midtrans/Xendit, piksel Meta/TikTok/GA, OpenAI/Gemini, Discord).
   Disarankan ditinjau konsultan hukum sebelum dianggap final.
6. **Klaim pemasaran yang di-hardcode — DIKONFIRMASI BENAR oleh pemilik**, tidak
   diubah: FAQ (garansi 7 hari, durasi 3/6/12 bulan,
   cicilan 0% 3/6/12 bulan — paket aktif saat ini cicilan 3×), tabel perbandingan
   (Rp1.499.000 / Rp799.000, cicilan 3×), statistik about (10.000+ siswa, 85%,
   4,9/5), statistik pendaftar SNBT/SIMAK/UM UGM/STAN. Klaim "koin tidak pernah
   kedaluwarsa" **dihapus** karena bertentangan dengan data (koin punya masa berlaku).
7. **Pemisahan subdomain — DIPUTUSKAN: app + admin.** Kode siap (Fase 3b) dan
   baru aktif setelah env produksi diisi. Langkah pemilik, berurutan:
   1. Vercel → Project → Domains: tambah `app.bimbelio.com` dan `admin.bimbelio.com`
      (project yang sama). DNS: CNAME keduanya ke `cname.vercel-dns.com`.
   2. Google Cloud Console → OAuth client → _Authorized JavaScript origins_:
      tambah `https://app.bimbelio.com` dan `https://admin.bimbelio.com`.
   3. Backend: izinkan origin `https://app.bimbelio.com` dan
      `https://admin.bimbelio.com` di CORS API dan socket.
   4. Env Vercel (Production saja, biarkan Preview kosong):
      `NEXT_PUBLIC_SITE_URL=https://www.bimbelio.com`,
      `NEXT_PUBLIC_APP_URL=https://app.bimbelio.com`,
      `NEXT_PUBLIC_ADMIN_URL=https://admin.bimbelio.com`,
      `NEXT_PUBLIC_COOKIE_DOMAIN=.bimbelio.com`. Lalu redeploy.
   5. Midtrans/Xendit: perbarui URL redirect selesai bayar bila mengarah ke
      `/<track>/user/...`. Tanpa ini pun tetap jalan lewat redirect 308.
   6. Sesi lama ikut pindah otomatis. Token host-only disalin ke `.bimbelio.com`
      oleh proxy saat URL lama dialihkan, dan oleh client saat sesi dimuat di
      situs, jadi pengguna tidak perlu login ulang. Preferensi di localStorage
      (sidebar ciut, dsb.) per origin dan kembali ke default sekali.
      Belum termasuk: halaman login khusus di subdomain. Pengguna tanpa sesi
      diarahkan ke beranda situs dan login di sana.
   7. Cookie httpOnly, setelah backend `feat/httponly-session-finance-scope`
      ter-deploy: env backend `SESSION_COOKIE_DOMAIN=.bimbelio.com` dan
      `CORS_ORIGINS` berisi www, apex, app, dan admin; restart. Lalu env Vercel
      Production `NEXT_PUBLIC_SESSION_COOKIE=httponly` dan redeploy.
