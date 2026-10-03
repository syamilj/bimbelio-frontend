// Navigasi situs publik. Satu sumber untuk header desktop & menu mobile.
// Anchor beranda ditulis lengkap (`/#rapor`) agar berfungsi dari halaman mana pun.

export type SiteNavLink = {
  label: string;
  href: string;
  description?: string;
};

export type SiteNavGroup = {
  label: string;
  /** Halaman induk (tautan langsung pada label). Tanpa ini, label hanya membuka menu. */
  href?: string;
  badge?: string;
  sections?: { title: string; links: SiteNavLink[] }[];
};

export const SITE_NAV: SiteNavGroup[] = [
  {
    label: 'Fitur',
    sections: [
      {
        title: 'Cara belajar',
        links: [
          {
            label: 'Cara kerja',
            href: '/#cara-kerja',
            description:
              'Kerjakan TO, lihat posisimu, lalu kejar topik yang paling menaikkan skor',
          },
          {
            label: 'Contoh rapor TO',
            href: '/#rapor',
            description: 'Skor IRT per subtes dan posisimu di antara peserta',
          },
          {
            label: 'BimBot',
            href: '/#bimbot',
            description: 'Tanya soal yang bikin buntu, kapan saja',
          },
          {
            label: 'Kelas live & mentor',
            href: '/#live-learning',
            description: 'Tutor alumni PTN, mentor, dan jadwal 8 bulan',
          },
        ],
      },
      {
        title: 'Coba gratis',
        links: [
          {
            label: 'Tryout gratis',
            href: '/tryout',
            description: 'Simulasi ujian dengan waktu sungguhan dan skor IRT',
          },
          {
            label: 'Jadwal 8 bulan',
            href: '/#timeline',
            description: 'Intensitas naik bertahap dari Januari sampai Agustus',
          },
        ],
      },
    ],
  },
  { label: 'Paket belajar', href: '/price', badge: 'Promo' },
  { label: 'Kalender', href: '/calendar' },
  { label: 'Blog', href: '/blog' },
  { label: 'Beasiswa', href: '/scholarship' },
];
