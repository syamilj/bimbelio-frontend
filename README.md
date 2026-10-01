# Bimbelio Frontend

Next.js 16 (App Router) + React 19 + Tailwind 4. Backend: repo `bimbelio-backend`
(satu service di `be.bimbelio.com`, `socket.bimbelio.com`, `storage.bimbelio.com`,
`storage-upload.bimbelio.com`).

## Menjalankan lokal (terhubung ke backend VPS)

```bash
bun install
cp .env.example .env.local   # URL backend VPS, nilai publik saja
bun run dev                  # http://localhost:3000 (atau: bun run dev -- -p 3001)
```

Backend mengizinkan `http://localhost:<port berapa pun>` (env `CORS_ALLOW_LOCALHOST=true`
di server), jadi port bebas. Login memakai Google; agar tombol login muncul di lokal,
origin `http://localhost:<port>` harus terdaftar di Google Cloud Console →
Credentials → OAuth Client → *Authorized JavaScript origins*.

Data yang dipakai saat lokal adalah **data produksi** (database VPS). Hati-hati
dengan aksi yang mengubah data (membuat try-out, voucher, mengirim notifikasi).

## Perintah

| Perintah | Fungsi |
|---|---|
| `bun run dev` | Dev server |
| `bun run build` / `bun run start` | Build & jalankan versi produksi |
| `bun run lint` | ESLint |
| `bun run typecheck` | TypeScript |

## Deploy

Vercel men-deploy otomatis dari branch `main`. Env produksi diatur di Vercel
(sama dengan `.env.example`).
