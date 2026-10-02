import { CONTACT_CONFIG } from '@/config/contact';
import {
  LegalContact,
  LegalDocument,
  type LegalSection,
} from '@/features/legal/legal-document';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Syarat dan Ketentuan',
  description:
    'Syarat dan ketentuan penggunaan layanan bimbel, try out, dan fitur AI Bimbelio.',
  alternates: { canonical: '/terms' },
};

const SECTIONS: LegalSection[] = [
  {
    id: 'penerimaan',
    title: 'Penerimaan syarat',
    body: (
      <p>
        Dengan membuat akun, membeli paket, atau memakai layanan Bimbelio, kamu
        menyetujui Syarat dan Ketentuan ini serta{' '}
        <Link href="/privacy">Kebijakan Privasi</Link>. Jika kamu berusia di
        bawah 18 tahun, pastikan orang tua atau wali sudah membaca dan
        menyetujuinya.
      </p>
    ),
  },
  {
    id: 'layanan',
    title: 'Layanan Bimbelio',
    body: (
      <p>
        Bimbelio menyediakan materi belajar, video, try out, kuis, kelas live,
        mentoring, dan asisten AI untuk persiapan UTBK-SNBT, ujian mandiri, dan
        sekolah kedinasan. Isi setiap paket tercantum di halaman{' '}
        <Link href="/price">Paket belajar</Link>. Kami dapat menambah, mengubah,
        atau menghentikan fitur demi perbaikan layanan tanpa mengurangi isi
        paket yang sudah kamu bayar.
      </p>
    ),
  },
  {
    id: 'akun',
    title: 'Akun',
    body: (
      <ul>
        <li>
          Satu akun hanya untuk satu orang dan tidak boleh dipinjamkan atau
          dijual.
        </li>
        <li>
          Kamu bertanggung jawab menjaga keamanan akun Google yang dipakai untuk
          masuk.
        </li>
        <li>Data pendaftaran yang kamu isi harus benar dan terbaru.</li>
        <li>
          Kami dapat membatasi atau menutup akun yang dipakai bersama, dipakai
          dari banyak perangkat secara tidak wajar, atau melanggar ketentuan
          ini.
        </li>
      </ul>
    ),
  },
  {
    id: 'pembayaran',
    title: 'Harga, pembayaran, dan masa aktif',
    body: (
      <ul>
        <li>
          Harga dalam Rupiah dan sudah termasuk pajak yang berlaku, kecuali
          disebutkan lain.
        </li>
        <li>
          Pembayaran diproses oleh mitra pembayaran resmi. Akses aktif setelah
          pembayaran terkonfirmasi.
        </li>
        <li>
          Masa aktif paket dihitung sejak akses aktif dan tercantum di halaman
          paket. Materi dapat diakses kapan saja selama masa aktif.
        </li>
        <li>
          Untuk pembayaran cicilan, akses dapat ditangguhkan bila cicilan
          berikutnya tidak dibayar sampai jatuh tempo.
        </li>
        <li>
          Koin dipakai untuk fitur AI dan try out, satu koin untuk satu kali
          pakai, dan memiliki masa berlaku sesuai keterangan saat pembelian.
          Koin tidak dapat ditukar dengan uang.
        </li>
        <li>
          Voucher berlaku sesuai syarat masing-masing dan tidak dapat diuangkan.
        </li>
      </ul>
    ),
  },
  {
    id: 'pengembalian-dana',
    title: 'Garansi uang kembali',
    body: (
      <p>
        Jika program tidak sesuai ekspektasimu, ajukan pengembalian dana dalam 7
        hari sejak pembayaran lewat email ke{' '}
        <a href={`mailto:${CONTACT_CONFIG.email}`}>{CONTACT_CONFIG.email}</a>{' '}
        atau WhatsApp {CONTACT_CONFIG.whatsapp.display}, dengan menyertakan
        email akun dan bukti pembayaran. Dana dikembalikan 100% ke rekening atau
        metode pembayaran yang kamu tentukan, dan akses paket berakhir saat
        pengembalian diproses. Pembelian koin terpisah dan pembayaran cicilan
        mengikuti ketentuan mitra pembayaran.
      </p>
    ),
  },
  {
    id: 'penggunaan',
    title: 'Penggunaan yang dilarang',
    body: (
      <>
        <p>Kamu tidak boleh:</p>
        <ul>
          <li>
            menyalin, merekam, mengunduh massal, membagikan, atau menjual soal,
            pembahasan, video, dan materi Bimbelio;
          </li>
          <li>
            membagikan akses akun atau tautan kelas berbayar kepada orang lain;
          </li>
          <li>
            mengakali sistem try out, peringkat, voucher, atau koin, termasuk
            memakai bot atau banyak akun;
          </li>
          <li>
            mengganggu, meretas, atau membebani sistem, atau mengakses bagian
            yang bukan untukmu;
          </li>
          <li>
            mengunggah konten yang melanggar hukum, menyinggung SARA, atau
            melanggar hak pihak lain.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'hak-cipta',
    title: 'Hak kekayaan intelektual',
    body: (
      <p>
        Seluruh materi, soal, pembahasan, video, desain, merek, dan perangkat
        lunak Bimbelio dilindungi hak cipta dan merupakan milik Bimbelio atau
        pemberi lisensinya. Pembelian paket memberimu hak pakai pribadi dan
        nonkomersial selama masa aktif, bukan kepemilikan.
      </p>
    ),
  },
  {
    id: 'ai',
    title: 'Asisten AI, skor, dan prediksi',
    body: (
      <p>
        Jawaban asisten AI dibuat otomatis dan bisa keliru; periksa kembali
        dengan materi atau tanyakan ke tutor. Skor try out, peringkat, dan
        prediksi kelulusan adalah perkiraan untuk membantu belajar dan bukan
        jaminan hasil seleksi resmi.
      </p>
    ),
  },
  {
    id: 'tanggung-jawab',
    title: 'Batas tanggung jawab',
    body: (
      <p>
        Kami berusaha menjaga layanan tetap tersedia, tetapi gangguan karena
        pemeliharaan, jaringan, atau pihak ketiga dapat terjadi. Sejauh
        diizinkan hukum, tanggung jawab Bimbelio atas kerugian yang timbul dari
        layanan terbatas pada jumlah yang kamu bayar untuk paket terkait dalam
        12 bulan terakhir.
      </p>
    ),
  },
  {
    id: 'perubahan',
    title: 'Perubahan syarat',
    body: (
      <p>
        Kami dapat memperbarui syarat ini. Perubahan penting akan diumumkan
        lewat situs atau email sebelum berlaku. Dengan tetap memakai layanan
        setelah perubahan berlaku, kamu menyetujui syarat yang baru.
      </p>
    ),
  },
  {
    id: 'hukum',
    title: 'Hukum yang berlaku',
    body: (
      <p>
        Syarat ini tunduk pada hukum Republik Indonesia. Perselisihan
        diselesaikan secara musyawarah terlebih dahulu; bila tidak tercapai
        kesepakatan, diselesaikan melalui Pengadilan Negeri Jakarta Timur.
      </p>
    ),
  },
  {
    id: 'kontak',
    title: 'Hubungi kami',
    body: <LegalContact />,
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Syarat dan Ketentuan"
      effectiveDate="2 Oktober 2026"
      intro={
        <p>
          Syarat ini mengatur penggunaan situs, aplikasi, dan layanan yang
          disediakan oleh PT Bimbelio Edukasi Teknologi (&ldquo;Bimbelio&rdquo;,
          &ldquo;kami&rdquo;).
        </p>
      }
      sections={SECTIONS}
    />
  );
}
