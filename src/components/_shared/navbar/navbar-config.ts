import type { NavItem } from './navbar-types';

export const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Fitur',
    isLink: false,
    submenuColumns: [
      {
        title: 'Metode Belajar',
        items: [
          {
            href: '#solution',
            label: 'PRINTS',
            description: 'Metode pembelajaran',
            badge: { text: 'FRAMEWORK', variant: 'success' },
            icon: 'Sparkles',
          },
          {
            href: '#timeline',
            label: 'Timeline',
            badge: { text: 'KALENDER', variant: 'info' },
            description: 'Jadwal belajar terstruktur',
            icon: 'Calendar',
          },
          {
            href: '#ecosystem',
            label: 'Ekosistem',
            description: 'Lingkungan belajar lengkap',
            icon: 'Layers',
          },
        ],
      },
      {
        title: '3-Layer System',
        items: [
          {
            href: '#3-layer',
            label: 'Tutor',
            description: 'Diajar oleh yang terbaik',
            icon: 'UserCheck',
            badge: { text: 'TOP ONLY', variant: 'warning' },
          },
          {
            href: '#3-layer',
            label: 'Mentor',
            description: 'Dibimbing oleh yang relevan',
            icon: 'UserCheck',
          },
          {
            href: '#3-layer',
            label: 'Bimbot AI',
            description: '24/7 AI yang membantu belajar',
            icon: 'BotMessageSquare',
            badge: { text: 'AI', variant: 'premium' },
          },
        ],
      },
      {
        title: 'Informasi',
        items: [
          {
            href: '#tryout',
            label: 'Try Out Online',
            description: 'Simulasi ujian real-time',
            icon: 'Timer',
            badge: { text: 'GRATIS', variant: 'info' },
          },
          {
            href: '#live-learning',
            label: 'Live Learning Online',
            description: 'Simulasi ujian real-time',
            icon: 'Timer',
            badge: { text: 'GRATIS', variant: 'info' },
          },
        ],
      },
    ],
  },
  {
    href: '/price',
    label: 'Program',
    isLink: true,
    badge: { text: 'PROMO', variant: 'warning' },
    submenuColumns: [
      {
        title: 'Product',
        items: [
          {
            href: '#price-plan',
            label: 'All Program',
            description: 'Kelas eksklusif',
            badge: { text: '1-ON-1', variant: 'premium' },
            icon: 'UserPlus',
            isLink: true,
          },
        ],
      },
    ],
  },
  {
    href: '/calendar',
    label: 'Kalender',
    isLink: true,
    badge: { text: 'EVENT', variant: 'info' },
    submenuColumns: [
      {
        title: 'Jadwal Event',
        items: [
          {
            href: '/calendar',
            label: 'Semua Event',
            description: 'Lihat seluruh jadwal event',
            icon: 'Calendar',
            badge: { text: 'GRATIS', variant: 'success' },
            isLink: true,
          },
          {
            href: '/calendar?type=webinar',
            label: 'Webinar',
            description: 'Sesi belajar online bersama expert',
            icon: 'Video',
            badge: { text: 'LIVE', variant: 'info' },
            isLink: true,
          },
          {
            href: '/calendar?type=live-class',
            label: 'Live Class',
            description: 'Sesi belajar langsung bersama tutor',
            icon: 'Video',
            badge: { text: 'LIVE', variant: 'info' },
            isLink: true,
          },
          {
            href: '/calendar?type=ujian',
            label: 'Try Out',
            description: 'Try Out online dengan timer',
            icon: 'Clock',
            badge: { text: 'GRATIS', variant: 'success' },
            isLink: true,
          },
        ],
      },
    ],
  },
  {
    href: '/blog',
    label: 'Lainnya',
    isLink: false,
    submenuColumns: [
      {
        title: 'Lainnya',
        items: [
          {
            href: '/blog',
            label: 'Blog',
            description: 'Insight & tips belajar',
            icon: 'Users',
            badge: { text: 'GRATIS', variant: 'success' },
            isLink: true,
          },
          {
            href: '/l/wa-grup',
            label: 'WhatsApp',
            description: 'Grup belajar online',
            icon: 'Users',
            badge: { text: 'GRATIS', variant: 'success' },
            isLink: true,
          },
          {
            href: '/#contact',
            label: 'Konsultasi',
            description: 'Hubungi tim kami untuk bantuan',
            icon: 'PhoneCall',
            badge: { text: 'GRATIS', variant: 'success' },
            isLink: true,
          },
        ],
      },
    ],
  },
];
