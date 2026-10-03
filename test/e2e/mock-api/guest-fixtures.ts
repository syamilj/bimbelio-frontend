// Agenda publik fiktif (fase 03e): tryout gratis & kelas live terdekat untuk
// beranda, /tryout, dan kalender bubble. Tanggal relatif ke hari ini (WIB) agar
// selalu "akan datang" dan jatuh di bulan berjalan bila memungkinkan.

const DAY = 86_400_000;

/** Tanggal `days` hari dari hari ini, pukul `hour`:00 WIB. */
const at = (days: number, hour: number) => {
  const now = new Date(Date.now() + 7 * 3_600_000); // geser ke WIB
  const d = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) +
      days * DAY,
  );
  d.setUTCHours(hour - 7);
  return d.toISOString();
};

export const UPCOMING_TRYOUTS = [
  {
    id: 'to-09',
    title: 'Tryout UTBK #09',
    image: null,
    startDate: at(2, 19),
    isDone: false,
    isRegistered: false,
    isJoin: false,
    isCouponOnly: false,
    WebsiteSubCategory: { id: 'utbk', name: 'UTBK-SNBT' },
    TryoutSession: [
      { duration: 30, _count: { TryoutQuestion: 30 } },
      { duration: 25, _count: { TryoutQuestion: 20 } },
      { duration: 20, _count: { TryoutQuestion: 20 } },
    ],
  },
  {
    id: 'to-simak',
    title: 'Tryout SIMAK UI Serentak',
    image: null,
    startDate: at(5, 9),
    isDone: false,
    isRegistered: false,
    isJoin: false,
    isCouponOnly: true,
    WebsiteSubCategory: { id: 'utbk', name: 'UTBK-SNBT' },
    TryoutSession: [{ duration: 60, _count: { TryoutQuestion: 40 } }],
  },
];

export const LANDING_LIVE_CLASSES = [
  {
    id: 'lc-pk',
    title: 'Bedah PK: perbandingan & persentase',
    image: null,
    startDate: at(1, 19),
    status: 'Akan Datang',
    accessType: 'FREE',
    websiteSubCategoryId: 'utbk',
    Category: { name: 'Pengetahuan Kuantitatif' },
    Instructor: { name: 'Kak Syamil', lastEducation: 'Manajemen, UI 2019' },
  },
  {
    id: 'lc-lbi',
    title: 'Membaca cepat teks panjang',
    image: null,
    startDate: at(3, 16),
    status: 'Akan Datang',
    accessType: 'PREMIUM',
    websiteSubCategoryId: 'utbk',
    Category: { name: 'Literasi Bahasa Indonesia' },
    Instructor: { name: 'Kak Okky', lastEducation: 'Sastra Arab, UI 2019' },
  },
];
