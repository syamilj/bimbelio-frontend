// Footer configuration data

export const socialLinks = [
  {
    href: 'https://instagram.com/bimbelio.official',
    label: 'Instagram',
    svgPath:
      'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.069 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z',
  },
  {
    href: 'https://tiktok.com/@bimbelio.official',
    label: 'TikTok',
    svgPath:
      'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.89 2.89 0 1 1-5.92-2.4c.3-.84 1-1.64 1.9-2.09V9.9a6.72 6.72 0 0 0-1.02.15A4.84 4.84 0 0 0 5 13.75a4.85 4.85 0 0 0 9.57.3V9.2a6.33 6.33 0 0 0 3.02 1.48v-3.7a4.9 4.9 0 0 1-.53-.05z',
  },
  {
    href: 'https://youtube.com/@bimbelio',
    label: 'YouTube',
    svgPath:
      'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
];

export const productLinks = ['Kursus Online', 'Tryout', 'Konsultasi', 'Premium'];
export const legalLinks = ['Privasi', 'Syarat', 'Kebijakan', 'Bantuan'];

export interface PaymentGroup {
  label: string;
  items: { src: string; alt: string; height: string }[];
  cols?: number;
}

export const paymentGroups: PaymentGroup[] = [
  {
    label: 'Kartu',
    items: [
      { src: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg', alt: 'Visa', height: 'h-7' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg', alt: 'Mastercard', height: 'h-10' },
    ],
  },
  {
    label: 'E-Wallet',
    items: [
      { src: '/hero/astrapay-logo.svg', alt: 'AstraPay', height: 'h-8' },
      { src: '/hero/ovo-logo.svg', alt: 'OVO', height: 'h-8' },
      { src: '/hero/shopeepay-logo.svg', alt: 'ShopeePay', height: 'h-8' },
    ],
  },
  {
    label: 'Virtual Account',
    cols: 4,
    items: [
      { src: '/hero/bca-logo.svg', alt: 'BCA', height: 'h-8' },
      { src: '/hero/bni-logo.svg', alt: 'BNI', height: 'h-8' },
      { src: '/hero/bri-logo.svg', alt: 'BRI', height: 'h-8' },
      { src: '/hero/mandiri-logo.svg', alt: 'Mandiri', height: 'h-8' },
      { src: '/hero/bsi-logo.svg', alt: 'BSI', height: 'h-8' },
      { src: '/hero/bjb-logo.svg', alt: 'BJB', height: 'h-8' },
      { src: '/hero/cimb-logo.svg', alt: 'CIMB', height: 'h-8' },
      { src: '/hero/permata-logo.svg', alt: 'Permata', height: 'h-8' },
    ],
  },
  {
    label: 'PayLater',
    items: [
      { src: '/hero/akulaku-logo.svg', alt: 'Akulaku', height: 'h-8' },
    ],
  },
  {
    label: 'Retail & QRIS',
    items: [
      { src: '/hero/qris-logo.svg', alt: 'QRIS', height: 'h-8' },
      { src: '/hero/alfamart-logo.svg', alt: 'Alfamart', height: 'h-8' },
      { src: '/hero/indomaret-logo.svg', alt: 'Indomaret', height: 'h-8' },
    ],
  },
];
