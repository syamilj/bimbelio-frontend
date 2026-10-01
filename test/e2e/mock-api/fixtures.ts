// Data fiktif untuk E2E. Bukan data produksi.

export const TRACKS = [
  {
    id: 'ptn',
    name: 'Perguruan Tinggi Negeri',
    main_color: '#0091ff',
    secondary_color: '#5aa4dd',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    WebsiteSubCategory: [
      {
        id: 'utbk',
        name: 'UTBK-SNBT',
        main_color: '#0091ff',
        secondary_color: '#5aa4dd',
        website_category_id: 'ptn',
        sharing_website_sub_category_ids: [],
        type: 'GENERAL',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'stan',
        name: 'PKN STAN',
        main_color: '#7c3aed',
        secondary_color: '#a78bfa',
        website_category_id: 'ptn',
        sharing_website_sub_category_ids: [],
        type: 'GENERAL',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  },
];

const baseUser = {
  email: 'siswa@contoh.test',
  image: null,
  emailVerified: '2026-01-01T00:00:00.000Z',
  expire: '2099-01-01T00:00:00.000Z',
  userTryOutId: null,
  type: 'SMA',
  phone: '+6281200000000',
  subsList: {},
  subsData: {},
  subsPendingData: {},
};

/** Token cookie → pengguna. Token lain dianggap tidak valid (401). */
export const USERS: Record<string, Record<string, unknown>> = {
  'e2e-student': {
    ...baseUser,
    id: 'u-student',
    name: 'Siswa Uji',
    role: 'USER',
  },
  'e2e-premium': {
    ...baseUser,
    id: 'u-premium',
    name: 'Siswa Premium',
    role: 'USER',
    subsList: {
      utbk: {
        tier: 'PREMIUM',
        feature: {
          document: true,
          course: 'ALLOW',
          quiz: 'ALLOW',
          liveClass: true,
        },
      },
    },
  },
  'e2e-admin': { ...baseUser, id: 'u-admin', name: 'Admin Uji', role: 'ADMIN' },
  'e2e-superadmin': {
    ...baseUser,
    id: 'u-super',
    name: 'Super Admin Uji',
    role: 'SUPER_ADMIN',
  },
  'e2e-finance': {
    ...baseUser,
    id: 'u-finance',
    name: 'Finance Uji',
    role: 'FINANCE',
  },
};

export const NOTIFICATIONS = [
  {
    id: 'n1',
    userId: 'u-student',
    isBroadcast: false,
    isPopUp: false,
    title: 'Try out minggu ini dibuka',
    content: 'Try out UTBK #12 bisa dikerjakan sampai Minggu.',
    description: null,
    type: 'INFO',
    category: 'TRYOUT',
    priority: 'NORMAL',
    relatedResourceId: null,
    relatedResourceType: null,
    isRead: false,
    readAt: null,
    isArchived: false,
    archivedAt: null,
    actionUrl: '/utbk/user/bimarena/try-out',
    metadata: null,
    isSendingWhatsApp: false,
    isSendingEmail: false,
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
];

export const COURSE_INDEX = [
  {
    id: 'mat',
    name: 'Penalaran Matematika',
    CourseChapter: [
      {
        title: 'Aljabar',
        CourseSubChapter: [
          {
            id: 'l1',
            title: 'Persamaan kuadrat',
            description: 'Akar-akar persamaan',
            type: 'VIDEO',
            CourseProgress: [],
          },
        ],
      },
    ],
  },
];
