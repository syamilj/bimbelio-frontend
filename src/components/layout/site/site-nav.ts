// Navigasi situs publik. Satu sumber untuk header desktop & menu mobile.
// Anchor beranda ditulis lengkap (`/#timeline`) agar berfungsi dari halaman mana pun.

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
            label: 'Jadwal 8 bulan',
            href: '/#timeline',
            description: 'Intensitas naik bertahap dari Januari sampai Agustus',
          },
          {
            label: 'Ekosistem belajar',
            href: '/#ecosystem',
            description: 'Kelas, materi, try out, dan AI dalam satu tempat',
          },
          {
            label: 'Tutor, mentor & BimBot',
            href: '/#3-layer',
            description: 'Tiga lapis pendampingan, termasuk AI 24 jam',
          },
        ],
      },
      {
        title: 'Coba gratis',
        links: [
          {
            label: 'Try out online',
            href: '/#tryout',
            description: 'Simulasi ujian dengan waktu sungguhan',
          },
          {
            label: 'Live learning',
            href: '/#live-learning',
            description: 'Kelas langsung bersama tutor',
          },
        ],
      },
    ],
  },
  { label: 'Program', href: '/price', badge: 'Promo' },
  { label: 'Kalender', href: '/calendar' },
  { label: 'Blog', href: '/blog' },
  { label: 'Beasiswa', href: '/scholarship' },
];
