Huruf merek Bimbelio 2.1 (lihat `docs/redesign/BRAND-2.1.md` §3.2), semua SIL Open Font License 1.1.

| Berkas                                      | Asal                                                  | Catatan                                                                      |
| ------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| `plus-jakarta-sans-latin-wght-normal.woff2` | Fontsource (`@fontsource-variable/plus-jakarta-sans`) | variable 200–800                                                             |
| `parkinsans-latin-wght-normal.woff2`        | paket merek Jutif (`03-warna-font/font`)              | variable 300–800, subset Latin                                               |
| `shantell-sans-latin-wght-normal.woff2`     | paket merek Jutif                                     | sumbu BNCE/INFM/SPAC dipatok 0, wght 500–800, subset Latin (1,28 MB → 54 KB) |
| `dm-mono-latin-500-normal.woff2`            | paket merek Jutif                                     | 500, subset Latin                                                            |

Subset dibuat dengan `fonttools` (`varLib.instancer` + `pyftsubset --flavor=woff2`).
Teks lisensi ada di `licenses/`. Dipakai lewat `src/lib/fonts.ts` (next/font/local).

Gambar OG (`src/app/api/og/route.tsx`) memakai TTF statis di `og/` karena Satori
tidak membaca woff2 maupun font variable: `parkinsans-800.ttf` (wght 800),
`jakarta-500.ttf` (wght 500), `dm-mono-500.ttf`, semuanya subset Latin
(`varLib.instancer` + `pyftsubset`, tanpa `--flavor`).
