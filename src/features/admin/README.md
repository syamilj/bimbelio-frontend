# Building block admin

Bahan bersama untuk semua halaman admin (Fase 5). Gaya admin = merek **rendah
suara** (`docs/redesign/BRAND-2.1.md` §6.3): token, huruf, radius, dan tombol pil
yang sama dengan bagian lain, **tanpa** Lio/coretan/stiker/aksen lime-pink. Tabel
padat (baris ±44 px), ID/kode/skor IRT dalam DM Mono (`font-mono`), judul
halaman Parkinsans 28 (`AdminPageHeader`). Chart analitik memakai Recharts
dengan warna `var(--chart-*)`.

| Blok               | Lokasi                                 | Untuk                                                                           |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------- |
| `AdminPageHeader`  | `components/admin-page-header.tsx`     | judul, deskripsi, aksi, breadcrumb/tautan kembali                               |
| `DataTable`        | `data-table/data-table.tsx`            | tabel standar: state di URL, cari/filter/urut, paginasi, dst.                   |
| `useTableState`    | `data-table/use-table-state.ts`        | state tabel di URL (dipakai `DataTable`)                                        |
| `ResourceForm`     | `resource-form/resource-form.tsx`      | form buat/ubah (react-hook-form + zod 4, error bahasa Indonesia)                |
| field form         | `resource-form/fields.tsx`             | teks, angka, select, combobox, multi-select, tanggal, switch, unggah, BlockNote |
| `useStorageUpload` | `hooks/use-storage-upload.ts`          | unggah/hapus/pindah file storage                                                |
| `CategoryManager`  | `components/category-manager.tsx`      | CRUD kategori bertingkat (tab per level)                                        |
| `AssessmentEditor` | `assessment-editor/`                   | editor try out & quiz (sesi, soal, opsi, kunci, IRT, impor)                     |
| `useConfirm`       | `@/components/patterns/confirm-dialog` | dialog konfirmasi (sudah ada; jangan buat modal hapus sendiri)                  |
| `exportXlsx/Csv`   | `lib/export.ts`                        | unduh tabel ke Excel/CSV (exceljs dimuat saat dipakai)                          |
| `formatDate`, dll. | `lib/format.ts`                        | format tanggal/angka, `toLocalInput`, `shortId`                                 |
| `useUrlParam`      | `hooks/use-url-param.ts`               | satu query param sebagai state (mis. tab aktif)                                 |

Data selalu lewat TanStack Query + `@/lib/api/client` (`api.get/paginated/post/…`).
Mutasi memakai `meta.successMessage` untuk toast sukses; error API otomatis
ditampilkan sebagai toast oleh `MutationCache`.

> **Suspense.** `useTableState`, `useUrlParam`, dan komponen yang memakainya
> membaca `useSearchParams()`. Bungkus komponen halaman dengan `<Suspense>` di
> `page.tsx` (aturan Next 16).

## Halaman daftar

```tsx
// src/app/(main)/[web_sub_category]/(admin)/admin/voucher/page.tsx
import { Suspense } from 'react';
import { VoucherListPage } from '@/features/admin-voucher/voucher-list';

export default function Page() {
  return (
    <Suspense>
      <VoucherListPage />
    </Suspense>
  );
}
```

```tsx
'use client';
import { AdminPageHeader } from '@/features/admin/components/admin-page-header';
import { DataTable, type DataTableColumn } from '@/features/admin/data-table/data-table';
import { useTableState } from '@/features/admin/data-table/use-table-state';
import { useConfirm } from '@/components/patterns/confirm-dialog';

const columns: DataTableColumn<Voucher>[] = [
  { id: 'code', header: 'Kode', cell: (v) => v.code, mono: true, sortable: true },
  { id: 'discount', header: 'Diskon', cell: (v) => `${v.discount}%`, align: 'right' },
  { id: 'status', header: 'Status', cell: (v) => <StatusBadge value={v.status} />, hideOnMobile: true },
];

export function VoucherListPage() {
  const table = useTableState({ filterKeys: ['status'], defaultPageSize: 20 });
  // Endpoint berhalaman: kirim state tabel sebagai params.
  const query = useQuery({
    queryKey: ['admin', 'vouchers', table.page, table.pageSize, table.q, table.filters, table.sort],
    queryFn: ({ signal }) =>
      api.paginated<Voucher[]>('/voucher/getVoucher', {
        params: { page: table.page, take: table.pageSize, search: table.q, ...table.filters },
        signal,
      }),
    placeholderData: keepPreviousData,
  });
  const confirm = useConfirm();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Voucher" description="…" actions={<Button asChild><Link href="…/new">Tambah voucher</Link></Button>} />
      <DataTable
        caption="Daftar voucher"
        table={table}
        columns={columns}
        rows={query.data?.items}
        total={query.data?.totalData}
        pageCount={query.data?.totalPages ?? 1}
        getRowId={(v) => v.id}
        getRowLabel={(v) => v.code}
        isLoading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
        searchPlaceholder="Cari kode voucher"
        filters={[{ id: 'status', label: 'Status', options: [{ value: 'ACTIVE', label: 'Aktif' }] }]}
        rowActions={(v) => [
          { label: 'Ubah', icon: Pencil, href: `…/${v.id}` },
          { label: 'Hapus', icon: Trash2, destructive: true,
            onSelect: () => confirm({ title: `Hapus voucher ${v.code}?`, confirmLabel: 'Hapus voucher', destructive: true, onConfirm: () => remove.mutateAsync(v.id) }) },
        ]}
        bulkActions={(rows, clear) => <Button size="sm" onClick={…}>Nonaktifkan {rows.length}</Button>}
        empty={{ title: 'Belum ada voucher', action: <Button …>Tambah voucher</Button> }}
      />
    </div>
  );
}
```

Endpoint yang mengembalikan **semua** data sekaligus: pakai
`applyClientTableState(rows, table, { searchText, sortValue, filterFn })` —
hasilnya `{ rows, total, pageCount, filtered }`; URL tetap jadi sumber state.

Perilaku `DataTable`:

- Kunci URL: `page`, `size`, `sort` (`kolom` / `-kolom`), `q`, dan satu kunci per
  filter. Dua tabel di satu halaman → beri `prefix` (`useTableState({ prefix: 'sub.' })`).
- Mengubah cari, filter, urutan, atau ukuran halaman **mengembalikan halaman ke 1**.
- Keadaan: memuat (kerangka baris, `aria-busy`), gagal (`ErrorState` + coba lagi),
  kosong (pesan sendiri, atau "Tidak ada yang cocok" + **Hapus filter** bila
  sedang memfilter).
- Seleksi massal muncul bila `bulkActions` diisi; pilihan direset saat
  tampilan berganti. Aksi per baris di menu "Aksi untuk <label>" (aksi destruktif
  dipisah di bawah). `renderExpanded` membuat baris bisa dibuka.
- `< md`: baris tampil sebagai kartu (kolom pertama = judul, sisanya daftar
  `dt/dd`; sembunyikan kolom dengan `hideOnMobile`).

## Form buat/ubah (satu route)

Satu komponen untuk `new` dan `[id]`. Untuk URL baru, pakai satu segmen
dinamis `[id]` dengan `id === 'new'` (`isNewId(id)`).

```tsx
const schema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi'),
  number: z.number().int().min(1),
  status: z.enum(['DRAFT', 'PUBLIC']),
  startDate: z.string().min(1),
  image: z.string().nullable(),
  tags: z.array(z.string()),
  active: z.boolean(),
  body: z.string(),
});

<ResourceForm
  schema={schema}
  defaultValues={EMPTY}
  values={isEdit ? toFormValues(query.data) : undefined}   // reset saat data datang
  requireDirty={isEdit}
  cancelHref={adminPath(trackId, 'quiz-volume')}
  onSubmit={async (values) => { await save.mutateAsync(values); router.push(…); }}
>
  <FormSection title="Detail">
    <TextField name="title" label="Judul" />
    <NumberField name="number" label="Nomor" suffix="menit" />
    <SelectField name="status" label="Status" options={[…]} />
    <ComboboxField name="volumeId" label="Volume" options={…} onSearchChange={setQ} loading={…} />
    <MultiSelectField name="tags" label="Tag" options={…} />
    <DateField name="startDate" label="Mulai" type="datetime-local" />
    <SwitchField name="active" label="Aktif" description="…" />
    <UploadField name="image" label="Gambar" bucket="img" folder="quiz-volume" prefix="quiz-volume" optional />
    <RichTextField name="body" label="Isi" />
  </FormSection>
</ResourceForm>
```

- Error zod tampil dalam bahasa Indonesia (`resource-form/error-map.ts`):
  "Wajib diisi", "Minimal 3 karakter", "Harus berupa angka", "Pilih minimal satu",
  dst. Pesan khusus di skema tetap diutamakan.
- `layout="dialog"` untuk form di dalam dialog (dipakai `CategoryManager`).
- `warnUnsaved` (default di halaman) memperingatkan sebelum menutup tab.
- `Combobox`, `MultiSelect`, `ImageUpload`, `RichTextEditor` juga diekspor
  sebagai kontrol mandiri (tanpa react-hook-form).

## useStorageUpload

```ts
const { upload, remove, move, isUploading, publicUrl } = useStorageUpload({
  bucket: 'img',
  folder: 'tryout',
  prefix: 'tryout',
});
const { name, path, url } = await upload(file, { replace: oldName });
```

Perilaku sama dengan kode lama: nama yang sudah ada ditimpa (`update`), file lama
dihapus setelah unggahan berhasil, error ditampilkan sebagai toast (matikan
dengan `toastError: false`). Bucket: `img`, `to-question`, `dump-images`, `pdf`,
`video`; `storagePublicUrl(bucket, path)` membangun URL publiknya.

## CategoryManager

```tsx
<CategoryManager
  levels={[
    defineCategoryLevel<Category, typeof schema>({
      key: 'category', label: 'Kategori', noun: 'kategori',
      query: categoriesQuery,
      columns: [...], getId: (c) => c.id, getName: (c) => c.name,
      schema, emptyValues: { name: '' }, toValues: (c) => ({ name: c.name }),
      renderFields: () => <TextField name="name" label="Nama kategori" />,
      onCreate: (v) => create.mutateAsync(v),
      onUpdate: (c, v) => update.mutateAsync({ id: c.id, ...v }),
      onDelete: (c) => remove.mutateAsync(c.id),
    }),
    defineCategoryLevel<SubCategory, typeof subSchema>({ key: 'sub', … }),
  ]}
/>
```

Tab aktif di `?tab=`, tiap tabel memakai awalan `<key>.` di URL.

## AssessmentEditor

```tsx
<AssessmentEditor kind="tryout" />            // buat try out
<AssessmentEditor kind="tryout" id={id} />    // ubah try out
<AssessmentEditor kind="quiz" id={id} />      // quiz = satu sesi + volume quiz
```

Menggantikan 4 salinan `question-session-tryout.tsx`. Fitur:

- Detail: judul, status, Instagram & thumbnail (try out), volume quiz yang
  mengisi jadwal (quiz), jadwal mulai/berakhir/hasil, waktu istirahat.
- Sesi/subtes: tambah, urutkan, hapus; kategori tes → subtes, durasi, tipe
  penilaian (`1-5`, `+5/0`, `IRT`, `+4/-1/0`, `+1/0`, `0-100`; quiz tanpa IRT &
  `+1/0`), ambang batas, ID dokumen pembahasan. IRT harus di semua sesi.
- Soal: navigator bernomor, tambah/hapus/pindah nomor, subkategori &
  sub-subkategori, isi/opsi/pembahasan dengan BlockNote (+ bantuan LaTeX
  `$…$`), gambar soal/opsi (unggah → sisipkan → hapus, bucket `to-question`),
  nilai per opsi (1–5 = bobot bertukar; tipe lain = benar/salah), urutan opsi,
  bab materi terkait.
- Ganti tipe penilaian mengonversi nilai semua soal (jawaban benar tetap benar).
- Impor CSV (gambar base64 → `dump-images`, markdown → HTML), buat soal dengan
  AI (`/tryout/generateTryout`), AI Match kategori & bab (per sesi / semua /
  yang belum, sumber & filter per sesi, bisa dihentikan), kunci jawaban.
- Draf otomatis di localStorage (kunci & format sama dengan versi lama),
  konflik draf vs versi server yang lebih baru, buang draf, hapus try out/quiz.

Logika murni ada di `assessment-editor/model/*` (diuji di `model.test.ts`):
`scoring.ts` (aturan nilai per tipe), `editor.ts` (operasi sesi/soal),
`payload.ts` (server ↔ editor, payload simpan, validasi), `draft.ts`,
`csv-import.ts`.

## Tes

- Unit/komponen: `*.test.ts(x)` di folder ini (Vitest + Testing Library + MSW).
- Mock `next/navigation` dengan URL di memori:
  `vi.mock('next/navigation', () => import('<root>/test/utils/next-navigation'))`
  lalu `navigation.set('/utbk/admin/…?page=2')` dan baca `navigation.search`.
