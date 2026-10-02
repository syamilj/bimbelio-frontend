// Kontak resmi Bimbelio — satu sumber untuk footer, dialog, dan tombol kontak.
export const CONTACT_CONFIG = {
  whatsapp: {
    /** Format 62xxx tanpa +. */
    number: '6285128056771',
    display: '+62 851-2805-6771',
    message: 'Halo! Aku ingin konsultasi mengenai program bimbel Bimbelio.',
  },
  phone: {
    number: '+6285161112223',
    display: '+62 851-6111-2223',
  },
  email: 'bimbelio.official@gmail.com',
  communityUrl: 'https://www.bimbelio.com/link/komunitas',
  whatsappGroupPath: '/l/wa-grup',
  address: [
    'PT Bimbelio Edukasi Teknologi',
    'Jl. Pulo Asem No. 62, RT 001/RW 001, Jati, Pulogadung',
    'Jakarta Timur, DKI Jakarta 13220',
  ],
  operationalHours: {
    weekdays: '08.00–21.00 WIB',
    weekend: '09.00–18.00 WIB',
  },
  social: {
    instagram: 'https://instagram.com/bimbelio.official',
    tiktok: 'https://tiktok.com/@bimbelio.official',
    youtube: 'https://youtube.com/@bimbelio',
  },
};

export const whatsappUrl = (message = CONTACT_CONFIG.whatsapp.message) =>
  `https://wa.me/${CONTACT_CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`;
