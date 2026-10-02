import { CONTACT_CONFIG } from '@/config/contact';
import {
  LegalContact,
  LegalDocument,
  type LegalSection,
} from '@/features/legal/legal-document';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description:
    'Cara Bimbelio mengumpulkan, memakai, menyimpan, dan melindungi data pribadi pengguna sesuai UU Pelindungan Data Pribadi.',
  alternates: { canonical: '/privacy' },
};

const SECTIONS: LegalSection[] = [
  {
    id: 'data-yang-dikumpulkan',
    title: 'Data yang kami kumpulkan',
    body: (
      <>
        <p>
          Kami hanya mengumpulkan data yang dibutuhkan untuk menjalankan
          layanan:
        </p>
        <ul>
          <li>
            <strong>Data akun:</strong> nama, alamat email, dan foto profil dari
            akun Google yang kamu pakai untuk masuk.
          </li>
          <li>
            <strong>Data pendaftaran try out dan kelas:</strong> jenis kelamin,
            usia, nomor WhatsApp, nomor WhatsApp orang tua (opsional),
            kabupaten/kota, provinsi, asal sekolah, jurusan, tahun lulus, dan
            bukti pendaftaran yang kamu unggah.
          </li>
          <li>
            <strong>Data belajar:</strong> jawaban dan hasil try out atau kuis,
            progres materi, catatan, sorotan, rating, kehadiran kelas live, dan
            percakapan dengan asisten AI.
          </li>
          <li>
            <strong>Data transaksi:</strong> paket yang dibeli, nominal,
            voucher, status, dan riwayat pembayaran. Data kartu atau rekening
            tidak disimpan oleh Bimbelio; data tersebut diproses langsung oleh
            penyedia pembayaran.
          </li>
          <li>
            <strong>Data teknis:</strong> cookie sesi, preferensi tampilan,
            langganan notifikasi browser, jenis perangkat dan browser, serta
            catatan akses untuk keamanan.
          </li>
          <li>
            <strong>Data yang kamu kirim sendiri:</strong> laporan bug, dokumen
            unggahan, dan pesan ke tim kami. Jika kamu menautkan akun Discord,
            kami menyimpan ID dan nama pengguna Discord-mu.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'penggunaan-data',
    title: 'Cara kami memakai data',
    body: (
      <ul>
        <li>
          Membuat dan mengelola akun serta memberi akses ke paket yang kamu
          beli.
        </li>
        <li>
          Menilai try out, menyusun peringkat, prediksi kelulusan, dan analisis
          belajar.
        </li>
        <li>
          Menjawab pertanyaan lewat asisten AI dan memberi rekomendasi materi.
        </li>
        <li>Memproses pembayaran, cicilan, voucher, dan pengembalian dana.</li>
        <li>
          Mengirim notifikasi layanan (jadwal, hasil, status pembayaran) dan,
          bila kamu setuju, informasi program.
        </li>
        <li>
          Menjaga keamanan akun, mencegah penyalahgunaan, dan memperbaiki bug.
        </li>
        <li>Mengukur efektivitas iklan dan meningkatkan kualitas layanan.</li>
      </ul>
    ),
  },
  {
    id: 'dasar-pemrosesan',
    title: 'Dasar pemrosesan',
    body: (
      <p>
        Kami memproses data pribadi berdasarkan Undang-Undang Nomor 27 Tahun
        2022 tentang Pelindungan Data Pribadi: pelaksanaan perjanjian layanan
        denganmu, persetujuanmu (misalnya untuk notifikasi dan pemasaran),
        kewajiban hukum (misalnya pencatatan transaksi), dan kepentingan yang
        sah untuk keamanan dan pengembangan layanan.
      </p>
    ),
  },
  {
    id: 'pihak-ketiga',
    title: 'Pihak ketiga yang memproses data',
    body: (
      <>
        <p>
          Kami tidak menjual data pribadimu. Data dibagikan hanya kepada mitra
          berikut sebatas yang diperlukan untuk menjalankan layanan:
        </p>
        <ul>
          <li>
            <strong>Google:</strong> login dengan akun Google, Google Analytics,
            dan model AI.
          </li>
          <li>
            <strong>OpenAI:</strong> model AI untuk asisten belajar. Isi
            pertanyaanmu dikirim untuk diproses dan tidak dipakai untuk
            mengidentifikasi dirimu.
          </li>
          <li>
            <strong>Midtrans dan Xendit:</strong> pemrosesan pembayaran.
          </li>
          <li>
            <strong>Meta dan TikTok:</strong> piksel iklan untuk mengukur
            kunjungan dan pembelian dari iklan.
          </li>
          <li>
            <strong>Penyedia hosting dan infrastruktur:</strong> server,
            penyimpanan berkas, email, dan notifikasi.
          </li>
          <li>
            <strong>Discord:</strong> bila kamu menautkan akun untuk bergabung
            ke komunitas.
          </li>
        </ul>
        <p>
          Sebagian mitra menyimpan data di luar Indonesia. Kami hanya memakai
          mitra yang menerapkan perlindungan data setara atau lebih tinggi. Data
          juga dapat kami berikan kepada otoritas bila diwajibkan hukum.
        </p>
      </>
    ),
  },
  {
    id: 'cookie',
    title: 'Cookie dan teknologi serupa',
    body: (
      <p>
        Kami memakai cookie untuk menjaga kamu tetap masuk, mengingat jalur
        ujian terakhir dan preferensi tampilan, serta untuk analitik dan
        pengukuran iklan. Kamu bisa menghapus atau memblokir cookie lewat
        pengaturan browser, tetapi tanpa cookie sesi kamu tidak bisa masuk ke
        akun.
      </p>
    ),
  },
  {
    id: 'penyimpanan',
    title: 'Penyimpanan dan keamanan',
    body: (
      <p>
        Data disimpan selama akunmu aktif dan selama dibutuhkan untuk tujuan di
        atas. Data transaksi disimpan sesuai kewajiban hukum perpajakan dan
        akuntansi. Kami melindungi data dengan koneksi terenkripsi (HTTPS),
        pembatasan akses berdasarkan peran, dan pemantauan akses. Tidak ada
        sistem yang sepenuhnya aman; bila terjadi kegagalan pelindungan data
        yang berdampak padamu, kami akan memberitahumu paling lambat 3 × 24 jam
        sesuai ketentuan UU PDP.
      </p>
    ),
  },
  {
    id: 'hak-pengguna',
    title: 'Hakmu atas data pribadi',
    body: (
      <>
        <p>Kamu berhak untuk:</p>
        <ul>
          <li>mendapat informasi tentang pemrosesan datamu;</li>
          <li>mengakses dan meminta salinan data pribadimu;</li>
          <li>memperbaiki data yang salah atau tidak lengkap;</li>
          <li>menarik persetujuan dan berhenti berlangganan pemasaran;</li>
          <li>meminta penghapusan akun beserta data pribadimu.</li>
        </ul>
        <p>
          Ajukan permintaan lewat email ke{' '}
          <a href={`mailto:${CONTACT_CONFIG.email}`}>{CONTACT_CONFIG.email}</a>{' '}
          dari alamat email akunmu. Kami menanggapi paling lambat 3 × 24 jam dan
          menyelesaikannya sesuai jangka waktu dalam UU PDP. Penghapusan akun
          mengakhiri akses ke paket yang masih aktif.
        </p>
      </>
    ),
  },
  {
    id: 'anak',
    title: 'Pengguna di bawah 18 tahun',
    body: (
      <p>
        Banyak pengguna Bimbelio adalah pelajar di bawah 18 tahun. Pengguna di
        bawah 18 tahun wajib mendapat izin orang tua atau wali sebelum mendaftar
        dan melakukan pembelian. Orang tua atau wali dapat menghubungi kami
        untuk mengakses, memperbaiki, atau menghapus data anaknya.
      </p>
    ),
  },
  {
    id: 'perubahan',
    title: 'Perubahan kebijakan',
    body: (
      <p>
        Kami dapat memperbarui kebijakan ini. Tanggal berlaku di atas selalu
        menunjukkan versi terbaru, dan perubahan penting akan kami umumkan lewat
        situs atau email. Lihat juga{' '}
        <Link href="/terms">Syarat dan Ketentuan</Link>.
      </p>
    ),
  },
  {
    id: 'kontak',
    title: 'Hubungi kami',
    body: (
      <>
        <p>Pertanyaan atau keluhan tentang data pribadi dapat dikirim ke:</p>
        <LegalContact />
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Kebijakan Privasi"
      effectiveDate="2 Oktober 2026"
      intro={
        <p>
          Kebijakan ini menjelaskan bagaimana PT Bimbelio Edukasi Teknologi
          (&ldquo;Bimbelio&rdquo;, &ldquo;kami&rdquo;) memproses data pribadimu
          saat memakai situs dan aplikasi Bimbelio.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
