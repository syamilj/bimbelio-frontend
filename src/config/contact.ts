// Configuration untuk floating contact button
// Update nomor telepon dan pesan sesuai kebutuhan bisnis

export const CONTACT_CONFIG = {
  whatsapp: {
    // Nomor WhatsApp bisnis (format: 62xxx tanpa +)
    number: '6282174653020',
    // Pesan default yang akan muncul di WhatsApp
    message: 'Halo! Aku ingin konsultasi mengenai program bimbel Bimbelio.',
  },
  phone: {
    // Nomor telepon bisnis (format: +62xxx)
    number: '+6285161112223',
  },
  // Stats yang ditampilkan di dialog
  // Jadwal operasional (opsional untuk info tambahan)
  operationalHours: {
    weekdays: '08:00 - 21:00 WIB',
    weekend: '09:00 - 18:00 WIB',
  },
};

// Untuk development/testing, bisa gunakan nomor dummy
// Untuk production, ganti dengan nomor bisnis yang sebenarnya
