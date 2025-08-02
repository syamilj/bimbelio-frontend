// ======================== Event Type =================================

export type StandardEventType =
  | 'PageView' // ✅ Meta only — Dilacak saat halaman diload (event wajib di Meta)
  | 'ViewContent' // ✅ Meta & TikTok — User melihat halaman produk/konten penting
  | 'Search' // ✅ Meta & TikTok — User melakukan pencarian di situs
  | 'AddToCart' // ✅ Meta & TikTok — User menambahkan item ke keranjang
  | 'AddToWishlist' // ✅ Meta & TikTok — User menyimpan item ke wishlist
  | 'InitiateCheckout' // ✅ Meta & TikTok — User mulai proses checkout
  | 'AddPaymentInfo' // ✅ Meta & TikTok — User mengisi data pembayaran
  | 'Purchase' // ✅ Meta & TikTok — Transaksi/pembayaran berhasil
  | 'Lead' // ✅ Meta & TikTok — User isi form/daftar (calon pelanggan)
  | 'CompleteRegistration' // ✅ Meta & TikTok — User menyelesaikan proses registrasi
  | 'Subscribe' // ✅ Meta & TikTok — User berlangganan paket/produk
  | 'StartTrial' // ✅ Meta & TikTok — User memulai free trial
  | 'Contact' // ✅ Meta & TikTok — User menghubungi melalui WA/email/form
  | 'SubmitApplication' // ✅ Meta & TikTok — User mengirim lamaran/form pendaftaran
  | 'Schedule' // ✅ Meta & TikTok — User menjadwalkan janji atau sesi
  | 'CustomizeProduct' // ✅ Meta & TikTok — User melakukan kustomisasi produk
  | 'Donate' // ✅ Meta & TikTok — User melakukan donasi
  | 'StartCheckout'; // ✅ TikTok only — Event TikTok khusus untuk e-commerce (mirip InitiateCheckout)

export type MetaPixelEventType = Exclude<StandardEventType, 'StartCheckout'>;
export type TiktokPixelEventType = Exclude<StandardEventType, 'PageView'>;

// ======================== Custom Data Type =================================

export type StandardCustomDataType =
  | 'value' // ✅ Meta & TikTok — Nilai dari transaksi atau konversi
  | 'currency' // ✅ Meta & TikTok — Mata uang dalam format ISO 4217 (misal: 'IDR', 'USD')
  | 'order_id' // ✅ Meta & TikTok — ID unik dari pesanan atau transaksi
  | 'content_name' // ✅ Meta & TikTok — Nama dari konten/produk yang dilihat atau dibeli
  | 'content_type' // ✅ Meta only — Jenis konten seperti 'product', 'course', dll
  | 'contents' // ✅ Meta only — Daftar item dalam keranjang/beli, misalnya: [{ id, quantity }]
  | 'num_items' // ✅ Meta — Jumlah item yang terlibat dalam event
  | 'status' // ✅ Meta — Status transaksi, misal: 'success', 'pending', 'failed'
  | 'delivery_category' // ✅ Meta — Kategori pengiriman: 'in_store', 'curbside', 'home_delivery'
  | 'search_string' // ✅ Meta & TikTok — Kata kunci yang dicari user (untuk event 'Search')
  | 'page_path' // ✅ TikTok only — Jalur halaman yang dibuka (pengganti PageView)
  | 'email' // ✅ TikTok (hashed) — Email user dalam format SHA256 (server-side tracking)
  | 'phone_number'; // ✅ TikTok (hashed) — Nomor telepon user dalam SHA256 (server-side tracking)

export type MetaPixelCustomDataType = Exclude<
  StandardCustomDataType,
  'page_path'
>;
export type TiktokPixelCustomDataType = StandardCustomDataType;
