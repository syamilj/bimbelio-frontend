# Redesign Front End × Merek Bimbelio 2.1 — Rancangan

> Status: **disetujui pemilik 2026-10-03** — semua usulan di §10 diterima. Dokumen ini
> menggantikan `PLAN.md §3` (sistem desain); fase baru tercatat di `PLAN.md §6`.
> Arsitektur, data layer, domain, dan strategi testing di `PLAN.md` **tetap**.

Sumber merek: `Jutif/jutif-engine/branding/clients/bimbelio/`
(`brand.json`, `output/PANDUAN-MEREK.md`, `output/02-brand-book/bimbelio-brand-book.pdf`
halaman 001–112, `output/.build/ARAH-DESAIN.md`, `output/03-warna-font/brand-tokens.css`).

## 1. Ringkasan

Fondasi redesign sudah ada: Fase 1–3b selesai dengan sistem "Lembar Jawaban" v1, yaitu bubble LJK,
token tunggal, dan lint guard. Sistem itu dibuat **sebelum** brand book 2.1. Merek 2.1
mempertahankan gagasan LJK, tapi mengganti hampir semua nilainya:

| Aspek       | Sistem FE sekarang (v1)                   | Merek 2.1                                                                                              | Dampak                          |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------- |
| Warna utama | `#0091FF`, bisa diganti per track dari DB | **Biru Bimbelio `#0066FF`**, tetap                                                                     | token + keputusan track (§10.1) |
| Teks        | grafit `#1B2230`                          | **Tinta `#0B1736`**                                                                                    | token                           |
| Latar       | `#F6F8FB`                                 | **Kertas `#F4F7FC`**                                                                                   | token                           |
| Aksen       | stabilo kuning `#FCB930`                  | **stabilo pensiun**, diganti **Lime `#C6F432`** atau **Pink `#FF5FA2`**, satu per tampilan             | token + varian `marker` dihapus |
| Huruf       | Plus Jakarta Sans saja                    | **Parkinsans** (judul & angka) + Jakarta (UI) + **Shantell Sans** (coretan) + **DM Mono** (data ujian) | font + skala                    |
| Bentuk      | radius 10, tombol kotak membulat          | **kartu 18–22 px, tombol pil**                                                                         | token radius                    |
| Karakter    | tidak ada                                 | **Lio** (simbol logo berekspresi), BimBot = avatar simbol                                              | komponen baru                   |
| Chart       | Recharts, warna per chart                 | **4 chart bubble LJK standar**                                                                         | komponen baru                   |
| Logo        | `BrandMark` lama + 2 salinan lain         | **logo 2.1 "bulat penuh"**, 4 versi                                                                    | aset                            |
| Suara       | campur, ada kapital & "!!!"               | **kakak tingkat yang jujur**: "kamu", tanpa kapital semua, penafian peluang                            | copy                            |

Strategi: **re-skin dulu bagian yang sudah dimigrasi** (shell, guest, patterns, `ui/`).
Hasilnya murah karena semuanya sudah memakai token. Fase 4 (siswa) dan 5 (admin) lalu dibangun
langsung dengan sistem 2.1, jadi tidak ada pekerjaan dua kali.

## 2. Prinsip desain (diturunkan dari brand book)

1. **Jujur soal posisi.** Angka adalah pahlawan layar: skor, posisi, dan peluang
   tampil besar dalam Parkinsans. Setiap skor atau peluang **selalu** diberi penafian
   ("Perkiraan dari data tryout, bukan jaminan hasil seleksi.") dan **langkah berikutnya**.
2. **Terarah, bukan asal banyak.** Satu fokus per layar. Rekomendasi belajar paling banyak
   tiga (bubble A–C).
3. **Tenang di ruang kerja, hidup di momen.** Ruang kerja (soal, materi, admin)
   datar dan sunyi. Momen emosional (skor keluar, streak, TO baru, kosong, 404) boleh memakai
   Lio, stiker, dan coretan.
4. **Anggaran ekspresi.** Maks. **3 elemen ekspresi** per layar (stiker, coretan, Lio).
   Di aplikasi: Lio ≤ 1, coretan ≤ 1, stiker ≤ 1. Di marketing: coretan ≤ 2.
5. **60 · 30 · 10.** Kira-kira 60% Kertas/putih, 25–30% Tinta & netral, ±10% Biru, aksen ≤ 3–5%.
   Biru adalah bintangnya, jadi jangan dipakai di mana-mana.
6. **Bubble LJK = makna isian.** Kosong = belum, terisi = selesai/dipilih, setengah = ragu
   atau sebagian. Bubble hanya dipakai saat memang berarti isian atau progres, bukan hiasan.

## 3. Token 2.1 (`src/styles/tokens.css`)

### 3.1 Warna

```css
:root {
  /* Kertas & Tinta */
  --paper: #f4f7fc; /* Kertas: latar aplikasi */
  --surface: #ffffff; /* kartu, panel, input */
  --ink: #0b1736; /* Tinta: teks utama, permukaan gelap */
  --ink-muted: #485168; /* teks sekunder: 7,4:1 di Kertas */
  --ink-subtle: #666d7e; /* teks tersier (4,8:1). #797F90 dari paket merek gagal AA (3,7:1) */
  --line: #e2e3e7;
  --line-strong: #c9ced8;

  /* Biru Bimbelio (skala dari brand-tokens.css) */
  --brand: #0066ff; /* primary-500 */
  --brand-strong: #0258db; /* primary-600: hover, teks link kecil (6,1:1) */
  --brand-deep: #063b92; /* primary-800 */
  --brand-soft: #f0f6ff; /* primary-50: latar aktif/terpilih */
  --brand-muted: #bdd7ff; /* primary-200: bubble netral di chart, garis fokus */
  --brand-ink: #ffffff;

  /* Aksen: satu per tampilan, lewat data-accent di wrapper */
  --lime: #c6f432;
  --pink: #ff5fa2;
  --accent: var(--lime);
  --accent-ink: var(--ink); /* teks di atas aksen selalu Tinta */

  /* Status (hanya jawaban benar/salah, naik/turun; selalu + ikon/label) */
  --success: #0b7038;
  --danger: #c4234a;
  --success-soft: color-mix(in oklab, var(--success) 9%, white);
  --danger-soft: color-mix(in oklab, var(--danger) 10%, white);

  /* Warna program: hanya titik i logo & label nama program (§10.1) */
  --program: var(
    --brand
  ); /* UTBK #0066FF · Kedinasan #E0263B · Campus #0A8FD6 · Language #0A9468 */

  /* Chart: satu disorot, sisanya netral (bukan pelangi) */
  --chart-focus: var(--brand);
  --chart-base: var(--brand-muted);
  --chart-empty: var(--line-strong);
}
[data-accent='pink'] {
  --accent: var(--pink);
}
[data-surface='ink'] {
  /* permukaan Tinta: teks putih, aksen lime/pink boleh sebagai teks */
}
[data-surface='brand'] {
  /* permukaan Biru: teks putih, aksen hanya lime ≥ 24px/bidang, pink DILARANG */
}
```

Pemetaan shadcn: `primary` = `--brand` (bukan lagi `brand-strong`), `ring` = `--brand`,
`accent` = `--brand-soft`, `background` = `--paper`.

**Aturan kontras** (dihitung ulang untuk UI):

| Pasangan                                       | Rasio     | Boleh untuk                                                         |
| ---------------------------------------------- | --------- | ------------------------------------------------------------------- |
| Putih di Biru `#0066FF`                        | 4,83      | semua teks (tombol utama)                                           |
| Biru di Kertas                                 | 4,50      | teks ≥ 14px semibold, link. Teks kecil pakai `--brand-strong` (6,1) |
| Tinta di Lime                                  | 13,8      | CTA lime, stiker, sorotan                                           |
| Tinta di Pink                                  | 6,2       | stiker, sorotan                                                     |
| Lime di Biru                                   | 3,8       | **hanya** angka/judul besar (≥ 24px)                                |
| Lime/Pink sebagai teks di putih                | 1,3 / 2,6 | **dilarang**. Pakai sebagai sorotan di balik teks Tinta             |
| Pink menempel Biru                             | 1,7       | **dilarang**                                                        |
| Putih di Campus `#0A8FD6` / Language `#0A9468` | 3,6 / 3,9 | **gagal AA**, jadi warna program tidak boleh jadi latar tombol      |

### 3.2 Huruf

| Token          | Font                          | Pakai                                                                                                                                | Jangan                        |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| `font-display` | Parkinsans 600/700/800        | judul halaman & seksi, angka besar (skor, hitung mundur, harga), hero                                                                | < 16px, paragraf, KAPITAL     |
| `font-sans`    | Plus Jakarta Sans 400/500/600 | semua UI, soal & pembahasan, paragraf                                                                                                | judul hero                    |
| `font-hand`    | Shantell Sans 700             | coretan Lio/mentor, stiker (≤ 8 kata)                                                                                                | judul, harga, isi soal, admin |
| `font-mono`    | DM Mono 500                   | nomor soal, timer, skor di tabel, kode voucher, label subtes (PU, PPU, PK, LBI), label kepala huruf kecil (`rapor TO · data contoh`) | kalimat biasa                 |

- Self-host via `next/font/local` dari `03-warna-font/font/` (lisensi OFL ikut disalin).
- **Shantell Sans 1,28 MB.** Subset ke `wght` + Latin (target < 60 KB) dan muat hanya di
  route marketing & komponen `Scribble` (preload: false).
- Skala web (min 12px tetap):

| Peran                          | Ukuran                     | Font                                   | Catatan                                |
| ------------------------------ | -------------------------- | -------------------------------------- | -------------------------------------- |
| Fokus (skor rapor, hero angka) | `clamp(64px, 12vw, 160px)` | Parkinsans 800, ls −0.065em, lh 0.85   | angka/kata pendek saja, `tabular-nums` |
| Hero marketing                 | `clamp(40px, 6vw, 80px)`   | Parkinsans 800, ls −0.04em, lh 1.0     |                                        |
| Judul halaman app              | 28 / 36                    | Parkinsans 700, ls −0.025em            |                                        |
| Judul seksi/kartu              | 18–22                      | Parkinsans 700 (≥ 16px)                |                                        |
| Isi                            | 14–16                      | Jakarta 400, lh 1.5, maks ±70 karakter |                                        |
| Label/tombol                   | 14                         | Jakarta 600                            |                                        |
| Label data                     | 12–13                      | DM Mono 500, huruf kecil               |                                        |

Aturan: maks. dua ketebalan per komponen, judul huruf kalimat (bukan Title Case atau KAPITAL).

### 3.3 Bentuk, ruang, gerak

- Radius: `xs` 6 (badge kecil) · `sm` 10 (input, chip) · `md` 18 (**kartu**) · `lg` 22
  (dialog, sheet, foto) · `full` (tombol pil, bubble, avatar, pil info).
- Tombol: semua **pil**. Tinggi 44 (default) / 36 (sm) / 52 (lg, CTA hero).
- Bayangan: hanya untuk objek melayang (popover, dialog, kartu skor di hero, stiker):
  `--shadow-float: 0 2px 4px rgb(11 23 54/.06), 0 16px 40px -8px rgb(11 23 54/.18)`.
- Grid web: 12 kolom, margin 120 di desktop dan 20 di HP (brand book hlm. 103). App `max-w-6xl`.
- Gerak: `bubble-fill` (isi bubble 180 ms), angka skor _count-up_ sekali, stiker _pop_ miring.
  Semuanya mematuhi `prefers-reduced-motion`. Tidak ada animasi loop di ruang kerja.

## 4. Elemen merek → komponen

Lokasi baru: `src/components/brand/` (merek) dan `src/components/patterns/` (pola UI).

| Komponen       | Isi                                                                                                      | Sumber brand book          | Aturan                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Logo`         | 4 versi (horizontal, vertikal, simbol, tulisan) × (utama, putih, hitam) dari SVG 2.1                     | hlm. 14–25, `01-logo/svg/` | min. horizontal 96px, simbol 16px. Di Biru/Tinta titik i = aksen tampilan; di putih logo Biru satu warna                                |
| `Lio`          | `<Lio expression="senang" size="s" />`, 12 ekspresi + properti, port dari `bm-lio.js` (SVG murni, ±5 KB) | hlm. 39–48                 | di app hanya `netral`, `fokus`, `senang`, `bintang`, `ngantuk`, `licik`. **Tidak pernah `sedih`/`ko` saat skor turun** (pakai `netral`) |
| `BimBotAvatar` | simbol dalam lingkaran Biru                                                                              | hlm. 48                    | BimBot = suara produk, bukan Lio penuh                                                                                                  |
| `Bubble`       | bubble LJK: kosong / setengah / terisi / berhuruf (A–E)                                                  | hlm. 55                    | sudah ada sebagai `AnswerBubble`, diperluas                                                                                             |
| `Sticker`      | pil Shantell, garis Tinta 3–4 px, miring −4° s.d. −8°, isi aksen                                         | hlm. 58                    | ≤ 5 kata, 1 per layar                                                                                                                   |
| `Highlight`    | sorotan aksen di balik 1 kata Tinta (`<mark>`)                                                           | hlm. 58                    | menggantikan varian `marker`                                                                                                            |
| `Scribble`     | coretan Shantell + panah SVG, miring −3° s.d. −6°                                                        | hlm. 56                    | 1 kalimat, ikut alur, tidak menimpa teks; tidak dipakai di admin                                                                        |
| `InfoPill`     | pil Biru (isi atau garis 3 px) untuk jadwal, kategori, skor kecil                                        | hlm. 58                    |                                                                                                                                         |
| `SeriesLabel`  | pil berikon: kategori blog, jenis notifikasi, label TO                                                   | hlm. 57                    | ikon Lucide dalam lingkaran aksen                                                                                                       |
| `MonoLabel`    | kepala DM Mono huruf kecil kiri/kanan (`rapor TO #08 · data contoh`)                                     | semua halaman              |                                                                                                                                         |
| `Disclaimer`   | penafian skor/peluang                                                                                    | hlm. 101–102               | wajib di bawah setiap skor/peluang                                                                                                      |
| `Supergraphic` | simbol diperbesar dan terpotong di tepi, senada latar (putih 12% di Biru)                                | ARAH-DESAIN                | hanya hero & kartu besar                                                                                                                |

**Chart bubble LJK** (`src/components/charts/bubble/`, SVG, tanpa Recharts):

| Chart                          | Data                                                            | Dipakai di                  |
| ------------------------------ | --------------------------------------------------------------- | --------------------------- |
| `BubbleLadder` (tangga, A1)    | skor per TO, kenaikan dari TO pertama                           | Rapor, BimInsight, BimBoard |
| `BubbleBars` (batang, B1)      | profil 7 subtes 0–800, 1 bubble = 100, sebagian = isian parsial | Rapor, Prediction           |
| `BubbleSpread` (sebaran, C1)   | posisi di antara peserta, 1 bubble = 2%                         | Rapor, Leaderboard          |
| `BubbleHeatmap` (peta jam, D1) | hari × jam belajar                                              | BimInsight                  |

Aturan chart: satu data disorot (`--chart-focus`, atau aksen di permukaan Tinta), sisanya netral.
Selalu ada skala dan label. Data contoh selalu diberi label "data contoh". Recharts **tetap**
untuk analitik admin, dengan warna dari token.

**Ikon:** Lucide saja, garis 2px. Ukuran 20 (tombol), 24 (menu), 44 (label seri).
`src/styles/icon.tsx` (2.656 baris, 32 file), `simple-icons`, `bim-brand.tsx`, dan
`styles/logo-svg.tsx` dipensiunkan bertahap.

## 5. Primitive `ui/` yang berubah

| Primitive               | Perubahan                                                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                | pil. Varian: `primary` (Biru), `accent` (Lime + teks Tinta, **hanya di permukaan Biru/Tinta**), `outline` (garis Tinta 1.5px), `ghost`, `destructive`, `link`. Varian `marker` dihapus |
| `Card`                  | radius 18, border `--line`, tanpa bayangan. Varian `brand` (Biru, angka utama) dan `ink` (Tinta, fokus/rekomendasi)                                                                    |
| `Badge` → `InfoPill`    | pil. `mono` untuk kode subtes                                                                                                                                                          |
| `Input/Select/Textarea` | radius 10, tinggi 44, fokus ring Biru 2px + offset                                                                                                                                     |
| `RadioGroup`            | = bubble (sudah)                                                                                                                                                                       |
| `Checkbox`              | bubble kotak-bulat. Terisi = Biru                                                                                                                                                      |
| `Progress`              | deret bubble untuk ≤ 10 langkah, batang pil untuk persentase                                                                                                                           |
| `Tabs`                  | pil tersegmentasi, aktif = Tinta isi                                                                                                                                                   |
| `Dialog/Sheet`          | radius 22, `--shadow-float`                                                                                                                                                            |
| `Skeleton`              | Kertas → `--line`, tanpa denyut biru                                                                                                                                                   |
| `Toaster` (sonner)      | kartu Tinta, teks putih, ikon status                                                                                                                                                   |
| `Table`                 | header DM Mono huruf kecil, angka `tabular-nums` rata kanan                                                                                                                            |

## 6. Rancangan per area

### 6.1 Situs publik (`www`), sudah dimigrasi dan tinggal di-re-skin

**Beranda.** Urutan seksi dengan satu aksen per seksi, dan aksen bergantian antar seksi:

1. **Hero Biru** (hlm. 103): "Selesai TO, langsung tahu jalan ke **PTN-mu**." (kata kunci Lime),
   CTA Lime "Ikut tryout" + outline putih "Lihat contoh rapor", Lio M ekspresi `ambis` + ikat kepala,
   supergrafis. Varian B (mockup laptop): latar Kertas + foto siswa + kartu skor melayang (§10.5).
2. **Cara kerja = bubble A–B–C**: Kerjakan TO → Lihat posisimu → Belajar topik yang paling menaikkan skor.
3. **Contoh rapor** (permukaan Tinta + Lime): angka 614 raksasa, `BubbleBars`, `BubbleSpread`,
   label "data contoh" dan penafian.
4. **BimBot**: chat contoh ("Bingung jam 11 malam? Tanya BimBot dulu."), avatar simbol.
5. **Kelas live & mentor**: foto mentor asli, `InfoPill` jadwal.
6. **Persaingan kampus**: statistik bubble yang sudah ada, ditata ulang.
7. **Paket belajar**: 2–3 kartu, satu disorot Biru.
8. **Cerita alumni**: label seri `Cerita Alumni`, foto nyata (bukan toga + jempol).
9. **FAQ** `<details>`, lalu **footer Tinta**: logo putih dengan titik i Lime, coretan "Lio liat. Lio selalu liat."

Halaman lain: `/price` (kartu paket, harga dalam Parkinsans, perbandingan dalam tabel mono),
checkout (tenang, tanpa Lio), `/blog` (kategori = `SeriesLabel`, artikel dengan lebar baca 70ch),
`/calendar` (kalender bubble: TO = bubble terisi, kelas = cincin), `/tryout`, `/about`, `/scholarship`,
404/error (Lio `pusing`/`ko` + jalan keluar).

### 6.2 App siswa (`app.`), Fase 4

**Shell:** sidebar putih, item aktif = bubble terisi Biru + teks Tinta 600, logo horizontal
(titik i = warna program). Topbar: ⌘K, koin & paket (`InfoPill`), notifikasi. Tab bar HP 5 item.
Mode `immersive` untuk ujian.

| Layar                            | Rancangan                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BimBoard** (beranda)           | kartu Biru "TO #09 · Sabtu, 24 Okt 19.00 WIB" + CTA Lime + Lio `ambis` S (hlm. 101). Skor terakhir + `BubbleLadder` mini. "Lanjutkan belajar" maks. 3 item dengan persentase. Satu kartu Tinta "Fokus minggu ini: PK"                                                                                                                              |
| **Tryout: ruang ujian**          | permukaan tenang. Bar atas Tinta: nama subtes (mono), **timer DM Mono**, tombol selesai. Soal di kartu putih, lebar baca. Opsi = bubble A–E `radiogroup` + pintasan keyboard. **Ragu-ragu = bubble setengah** (menggantikan stabilo). Navigator soal = grid bubble (kosong/terisi/setengah/aktif bercincin). Tanpa Lio, tanpa coretan, tanpa aksen |
| **Istirahat antar subtes**       | permukaan Tinta, hitung mundur Parkinsans raksasa, Lio `ngantuk`/`fokus` S                                                                                                                                                                                                                                                                         |
| **Rapor TO (hasil)**             | "momen Wrapped": angka skor Fokus, "di atas 78% peserta · ▲ +13" (status hijau + ikon), `BubbleBars` dengan sorotan pada subtes fokus (bukan andalan), `BubbleSpread`, kartu Tinta "Fokus A–C", penafian. Lio `bintang`/`senang` bila naik, `netral` bila turun. Tombol **"Bagikan rapor"** menghasilkan kartu story 1080×1920 (§10.6)             |
| **Pembahasan**                   | dua kolom: soal + pembahasan. Benar/salah = bubble status + ikon, bukan warna saja                                                                                                                                                                                                                                                                 |
| **BimArena kuis & leaderboard**  | leaderboard = daftar dengan posisi mono, baris pengguna disorot `--brand-soft`. `BubbleSpread` untuk posisi                                                                                                                                                                                                                                        |
| **BimInsight**                   | `BubbleLadder`, `BubbleHeatmap` jam belajar, ringkasan dalam kalimat kakak tingkat                                                                                                                                                                                                                                                                 |
| **Prediction (peluang lolos)**   | per pilihan PTN: peluang dalam kata (aman/sedang/berat) + angka, jarak poin ke target, `Disclaimer` besar                                                                                                                                                                                                                                          |
| **BimCourse & Workspace**        | ruang kerja tenang: daftar bab = checklist bubble, panel catatan/PDF datar, progres bubble                                                                                                                                                                                                                                                         |
| **BimBot**                       | header avatar simbol "online 24 jam". Pesan pengguna = gelembung Biru, BimBot = gelembung putih ber-border. Saran pertanyaan = `InfoPill`                                                                                                                                                                                                          |
| **BimLive**                      | kartu jadwal `InfoPill`, status LIVE = titik pink berdenyut di permukaan Tinta saja                                                                                                                                                                                                                                                                |
| **Paket, langganan, pembayaran** | kartu paket, status pembayaran sebagai langkah bubble                                                                                                                                                                                                                                                                                              |
| **Kosong / error / onboarding**  | Lio + satu kalimat + satu tombol ("Belum ada TO. Lio udah siap pensil.")                                                                                                                                                                                                                                                                           |

### 6.3 Admin (`admin.`), Fase 5

Merek **rendah suara**: token, huruf, radius, dan tombol pil yang sama, tapi **tanpa Lio,
coretan, stiker, dan aksen**. Kepadatan lebih tinggi (baris tabel 44px), ID/kode/skor IRT dalam DM Mono,
judul halaman Parkinsans 28. Chart analitik memakai Recharts dengan token `--chart-*` netral + fokus.
Pola utama tetap seperti di `PLAN.md` (`DataTable`, `ResourceForm`, `AssessmentEditor`).

### 6.4 Di luar halaman

`api/og` (OG 1200×630 gaya hlm. 29: Biru/Tinta + angka + simbol), favicon/manifest/ikon
maskable dari `04-aset/web/`, `theme-color` = `#0066FF` (situs) / `#F4F7FC` (app),
template email & notifikasi push (copy 2.1), PDF rapor cetak (hlm. 102).

## 7. Suara & copy

- Sapa "kamu". Kakak tingkat yang sudah lolos: santai, jelas, jujur. Angka disebut lalu
  diberi langkah berikutnya.
- Dilarang: KAPITAL SEMUA, "!!!", "dijamin lolos", nada menakut-nakuti, "fitur AI revolusioner".
- Contoh pengganti di UI:
  - Hasil turun: ~~"Skor kamu menurun!"~~ → "Skormu 598, turun 16 dari TO #07. PK yang paling bergeser. Mulai dari 10 soal ini, yuk."
  - Tombol kosong: ~~"Submit"~~ → "Kumpulkan jawaban"
  - Konfirmasi keluar ujian: "Jawabanmu sudah tersimpan. Waktu tetap berjalan kalau kamu keluar."
- Sisa string bahasa Inggris ("Save", "Cancel", "Loading...") diterjemahkan dalam fase migrasi masing-masing.
- Lio di UI bicara lewat ekspresi, bukan kalimat panjang. Humor "mengancam dengan sayang"
  hanya untuk sosmed dan notifikasi pengingat, tidak di rapor.

## 8. Aset yang dipindah dari Jutif

| Dari `output/`         | Ke FE                                                                        | Catatan                                                                               |
| ---------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `01-logo/svg/*`        | `src/components/brand/logo.tsx` (path inline) + `public/brand/`              | ganti `BrandMark` lama, hapus `bim-brand.tsx`, `styles/logo-svg.tsx`, `_assets/logo*` |
| `04-aset/web/*`        | `public/` (favicon set, `icon-192/512`, `icon-maskable-512`, `og-image.png`) | ganti `logo.png` 2600², `apple-touch-icon` 4501², `og.webp` 4500×5625                 |
| `03-warna-font/font/*` | `src/fonts/` + lisensi OFL                                                   | subset Shantell. Gochi Hand **tidak** dipakai (pensiun di 2.1)                        |
| `.build/bm-lio.js`     | `src/components/brand/lio.tsx`                                               | port ke React. Ekspresi = data, bukan string HTML                                     |
| `.build/bm-chart.js`   | `src/components/charts/bubble/*`                                             | port logika tata letak, render SVG React                                              |
| `foto/*` (Pexels)      | `public/photos/`                                                             | sementara. Ganti foto siswa & mentor asli (izin tertulis)                             |

## 9. Urutan kerja

Disisipkan ke `PLAN.md §6`. Setiap fase tetap wajib lolos `bun run check`, `bun run test`, `bun run build`.

### Fase 3c+ — Merek 2.1: fondasi (`redesign/03d-brand-2.1`)

- [ ] Token warna/radius/bayangan 2.1 + pemetaan shadcn. Hapus `marker*`. Perbarui `legacy.css` agar halaman lama ikut Biru 2.1
- [ ] Font: Parkinsans, Shantell (subset), DM Mono via `next/font/local`; token `font-display/hand/mono`; skala tipe web
- [ ] Logo 2.1 (4 versi) + aset web (favicon, manifest, OG, theme-color)
- [ ] Komponen merek: `Lio`, `BimBotAvatar`, `Sticker`, `Highlight`, `Scribble`, `InfoPill`, `SeriesLabel`, `MonoLabel`, `Disclaimer`, `Supergraphic`
- [ ] Chart bubble: `BubbleLadder`, `BubbleBars`, `BubbleSpread`, `BubbleHeatmap` + tes unit tata letak
- [ ] Primitive `ui/` di-re-skin (§5); `patterns/` disesuaikan (`AnswerBubble` + setengah, `StatCard` angka Parkinsans)
- [ ] Lint guard: larang `text-lime`/`text-pink` di permukaan terang, larang `font-hand` di `admin/`, larang ikon selain Lucide di kode baru
- [ ] Halaman `/_brand` (dev-only) berisi semua token & komponen sebagai _living styleguide_ + snapshot Playwright + axe

### Fase 3e — Re-skin shell & guest

- [ ] SiteHeader/Footer (footer Tinta), AppShell/AdminShell (item aktif bubble)
- [ ] Beranda baru (§6.1) + copy 2.1; `/price`, checkout, blog, calendar, tryout, about, scholarship, 404/error
- [ ] Visual regression (Playwright screenshot desktop + HP) dan axe untuk semua halaman guest

### Fase 4 — Siswa (dengan sistem 2.1)

Urutan berdasarkan dampak: **mesin ujian + Rapor TO** → BimBoard → Prediction & BimInsight →
BimBot → BimCourse/Workspace → BimLive, leaderboard, explore, paket/langganan.
Halaman yang dimigrasi wajib bebas `mainColor`, hex, `text-[px]`, dan `rounded-3xl`.

### Fase 5 — Admin (merek rendah suara, §6.3)

### Fase 7 — Penutup

Hapus `legacy.css`, `styles/icon.tsx`, `simple-icons`, aset logo lama. Audit Lighthouse (LCP hero, CLS
font), ukuran font (total < 250 KB), kontras otomatis.

## 10. Keputusan pemilik

Semua usulan di bawah **disetujui 2026-10-03**. Catatan pelaksanaan butir 1: warna track
di database (SNBT `#006CFA`, SIMAK UI oranye, UM UGM navy, Kedinasan **hijau** `#00843B`,
TKA abu) bertentangan dengan warna program merek. Karena itu `--program` diambil dari peta
merek per track (`lib/theme/track-theme.ts`), bukan dari `main_color` DB. Kolom warna di admin
"Kategori website" tidak lagi memengaruhi tampilan.

1. **Warna track dari DB.** Merek 2.1 menetapkan Biru `#0066FF` sebagai warna UI dan warna program
   (Kedinasan merah, Campus, Language) **hanya** di titik i logo + label nama program. Usul: `--brand`
   dikunci ke `#0066FF`, warna track DB dipakai sebagai `--program`. Kedinasan juga tetap Biru di
   tombol. Alasan: Campus dan Language gagal kontras AA untuk teks putih (3,6 dan 3,9).
2. **Layar tryout.** Brand book menyebut Tinta untuk "layar tryout". Usul: hanya **bar atas + layar
   istirahat** yang Tinta, sedangkan soal tetap di kartu putih supaya nyaman dibaca 2–3 jam.
3. **Mode belajar malam (gelap).** `PLAN.md` menghapus dark mode. Brand book menyebut Tinta untuk belajar
   malam. Usul: token sudah siap, fitur ini ditunda sampai setelah Fase 4.
4. **Lio di aplikasi.** Usul: ukuran kecil saja, 6 ekspresi positif/netral, dan tidak pernah sedih saat skor turun.
5. **Hero beranda.** A = Biru penuh + Lio (hlm. 103, lebih berani) atau B = Kertas + foto siswa + kartu
   skor (mockup laptop, lebih "produk"). Usul: **A** di desktop, kartu skor dari B dipakai di seksi 3.
6. **Foto.** Butuh foto siswa & mentor Bimbelio asli dengan izin tertulis. Sampai ada, pakai foto Pexels dari paket merek.
7. **Fitur "Bagikan rapor" (kartu story ala Wrapped).** Ini fitur baru di luar redesign murni, tapi menurut
   persona "yang bikin dia share" = rapor ala Wrapped. Usul: masuk Fase 4 setelah Rapor TO.
8. **Klaim & harga.** Semua angka di materi merek berlabel contoh (mis. Blue Prints Rp999.000).
   Data nyata diambil dari API, dan klaim pemasaran tetap mengikuti `PLAN.md §8.6`.
