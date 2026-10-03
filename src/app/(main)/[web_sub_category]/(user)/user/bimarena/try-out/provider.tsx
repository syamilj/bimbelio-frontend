/**
 * Dulu memuat daftar universitas untuk seluruh area try out (sekali per
 * halaman, termasuk yang tidak memakainya). Kini daftar diambil lewat
 * TanStack Query (`useUniversities`) hanya di tab Analisis. Komponen ini
 * tinggal pembungkus agar halaman uji admin yang masih mengimpornya tidak rusak.
 */
export default function Provider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
