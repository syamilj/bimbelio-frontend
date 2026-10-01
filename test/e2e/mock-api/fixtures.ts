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

const planBase = {
  description: 'Program lengkap SNBT dengan live class, try out, dan BimBot.',
  image: null,
  roleDiscord: null,
  status: 'ACTIVE',
  maxUsers: null,
  totalUsers: 12,
  timeline: 'Batch Januari',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
  PlanBenefit: [
    {
      id: 'b1',
      title: 'Live class 4× seminggu',
      description: 'Bersama tutor alumni PTN',
      order: 1,
    },
  ],
  Pivot_LiveClass_Plan: [],
  Pivot_Voucher_Plan: [],
};

export const PLANS = [
  {
    ...planBase,
    id: 'plan-utbk',
    slug: 'blueprint-utbk',
    name: 'Blueprint UTBK',
    price: 1_499_000,
    originalPrice: 2_000_000,
    recommended: true,
    PlanLimitation: null,
    PlanSubscription: {
      id: 'ps1',
      planId: 'plan-utbk',
      tier: 'PREMIUM',
      expireDays: 150,
      websiteSubCategoryId: 'utbk',
      PlanSubscriptionBundle: [{ websiteSubCategoryId: 'utbk' }],
      PlanFeature: [
        {
          id: 'f1',
          type: 'COURSE',
          isTimebound: false,
          Pivot_Plan_Category: [],
        },
      ],
      WebsiteSubCategory: { id: 'utbk', name: 'UTBK-SNBT' },
    },
    PlanInstallmentConfig: {
      totalInstallments: 3,
      totalAmount: 1_499_000,
      gracePeriodDays: 3,
      PlanInstallmentSchedule: [
        {
          id: 'i1',
          installmentNumber: 1,
          amount: 499_000,
          daysAfterFirstPayment: 0,
          PlanInstallmentScheduleLimitation: null,
        },
        {
          id: 'i2',
          installmentNumber: 2,
          amount: 500_000,
          daysAfterFirstPayment: 30,
          PlanInstallmentScheduleLimitation: null,
        },
        {
          id: 'i3',
          installmentNumber: 3,
          amount: 500_000,
          daysAfterFirstPayment: 60,
          PlanInstallmentScheduleLimitation: null,
        },
      ],
    },
  },
  {
    ...planBase,
    id: 'plan-koin',
    slug: 'sprint-try-out-10x',
    name: 'Sprint Try Out 10x',
    description: 'Tambahan 10 koin try out.',
    price: 149_000,
    originalPrice: null,
    recommended: false,
    PlanSubscription: null,
    PlanInstallmentConfig: null,
    PlanLimitation: {
      id: 'l1',
      planId: 'plan-koin',
      chat: 0,
      notes: 0,
      vision: 0,
      quiz: 0,
      tryout: 10,
      isTimebound: false,
      expireDays: 90,
    },
  },
];

export const POSTS = [
  {
    id: 'post-1',
    title: 'Strategi Penalaran Umum',
    slug: 'strategi-penalaran-umum',
    description: 'Cara mengeliminasi pilihan jawaban dengan cepat.',
    value:
      '<h2>Kenali tipe soal</h2><p>Penalaran umum menguji logika.</p><h3>Silogisme</h3><p>Rumus peluang \\(\\frac{1}{2}\\).</p><h2>Latihan rutin</h2><p>Kerjakan try out tiap minggu.</p>',
    thumbnail: null,
    views: 1200,
    tags: ['snbt', 'tips'],
    isEditorPick: true,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-10T00:00:00.000Z',
  },
  {
    id: 'post-2',
    title: 'Jadwal UM UGM',
    slug: 'jadwal-um-ugm',
    description: 'Tanggal penting ujian mandiri UGM.',
    value: '<p>Catat tanggalnya.</p>',
    thumbnail: null,
    views: 300,
    tags: ['mandiri'],
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
  },
];

export const INSTRUCTORS = [
  {
    id: 't1',
    name: 'Kak Rani',
    lastEducation: 'Kedokteran, UI',
    description: 'Biologi itu cerita, bukan hafalan.',
    image: null,
  },
];

export const LINK_PAGES: Record<
  string,
  { password?: string; data: Record<string, unknown> }
> = {
  komunitas: {
    data: {
      id: 'lp1',
      slug: 'komunitas',
      title: 'Komunitas Bimbelio',
      description: 'Semua tautan komunitas',
      backgroundType: 'COLOR',
      backgroundColor: '#0140ed',
      socialLinks: {},
      buttons: [
        {
          id: 'btn1',
          title: 'Grup WhatsApp',
          url: 'https://wa.me/1',
          order: 1,
          type: 'PRIMARY',
        },
      ],
    },
  },
  rahasia: {
    password: 'kunci123',
    data: {
      id: 'lp2',
      slug: 'rahasia',
      title: 'Halaman Khusus Peserta',
      backgroundType: 'COLOR',
      socialLinks: {},
      buttons: [],
    },
  },
};
