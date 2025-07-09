import {
  CourseChapter,
  CourseStatusEnum,
  CourseSubChapter,
  TypeCourseEnum,
} from '@/types/database';

// Mock data untuk live classes
export interface MockLiveClass {
  id: string;
  title: string;
  description: string;
  subject: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  scheduleDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  meetLink: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: LiveClassStatus;
  isRecorded: boolean;
  agenda: MockAgenda[];
  readingReferences: CourseReference[];
  recordingReferences: CourseReference[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface MockMaterial {
  id: string;
  category: string;
  subCategory: string;
  title: string;
  content: string;
  fileUrl?: string;
  order: number;
}

export interface MockAgenda {
  id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
}

export interface MockReference {
  id: string;
  title: string;
  type: TypeCourseEnum | 'URL' | 'CHAPTER';
  url?: string;
  chapterId?: string;
  subChapterId?: string;
  order: number;
}

// Course reference types untuk form integration
export interface CourseReference {
  id: string;
  // Untuk subchapter references
  courseId?: string;
  courseTitle?: string;
  chapterId?: string;
  chapterTitle?: string;
  subchapterId?: string;
  subchapterTitle?: string;
  // Untuk URL references
  title: string;
  description: string;
  url?: string;
  // Common fields
  type: 'reading' | 'video' | 'audio' | 'document' | 'website';
  source: 'subchapter' | 'url';
  content: string;
  fileUrl?: string;
  duration?: string;
  // Metadata
  createdAt?: Date;
  addedBy?: string;
}

// Helper type untuk form input
export interface URLReferenceInput {
  title: string;
  description: string;
  url: string;
  type: 'reading' | 'video' | 'audio' | 'document' | 'website';
}

// Interface untuk participant management
export interface LiveClassParticipant {
  id: string;
  liveClassId: string;
  userId: string;
  email: string;
  name: string;
  registeredAt: Date;
  invitedAt?: Date;
  status: 'registered' | 'invited' | 'expired';
  hasPackage: boolean;
  packageType?: string;
}

export type LiveClassStatus =
  | 'SCHEDULED'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED';

// Mock course chapters dan subchapters yang mengikuti struktur database
export const mockCourseChapters: CourseChapter[] = [
  {
    id: 'ch-math-1',
    number: 1,
    website_sub_category_id: 'snbt',
    categoryId: 'cat-math',
    title: 'Aljabar Linear',
    status: 'PUBLIC' as CourseStatusEnum,
  },
  {
    id: 'ch-math-2',
    number: 2,
    website_sub_category_id: 'snbt',
    categoryId: 'cat-math',
    title: 'Kalkulus Dasar',
    status: 'PUBLIC' as CourseStatusEnum,
  },
  {
    id: 'ch-physics-1',
    number: 1,
    website_sub_category_id: 'snbt',
    categoryId: 'cat-physics',
    title: 'Mekanika',
    status: 'PUBLIC' as CourseStatusEnum,
  },
  {
    id: 'ch-indo-1',
    number: 1,
    website_sub_category_id: 'snbt',
    categoryId: 'cat-indo',
    title: 'Teks Argumentasi',
    status: 'PUBLIC' as CourseStatusEnum,
  },
  {
    id: 'ch-chemistry-1',
    number: 1,
    website_sub_category_id: 'snbt',
    categoryId: 'cat-chemistry',
    title: 'Ikatan Kimia',
    status: 'PUBLIC' as CourseStatusEnum,
  },
];

export const mockCourseSubChapters: CourseSubChapter[] = [
  // Matematika - Aljabar Linear
  {
    id: 'sub-math-1-1',
    number: 1,
    website_sub_category_id: 'snbt',
    title: 'Pengantar Matriks',
    document: '/materials/math/matrix-intro.pdf',
    description: 'Konsep dasar matriks dan operasi-operasinya',
    premium: false,
    video: null,
    courseChapterId: 'ch-math-1',
    spendTime: 30,
    type: 'DOCUMENT' as TypeCourseEnum,
    tryoutSessionId: null,
    materi:
      'Pengenalan konsep matriks, operasi penjumlahan, pengurangan, dan perkalian matriks',
  },
  {
    id: 'sub-math-1-2',
    number: 2,
    website_sub_category_id: 'snbt',
    title: 'Video: Operasi Matriks',
    document: null,
    description: 'Tutorial video operasi matriks',
    premium: true,
    video: '/materials/math/matrix-operations.mp4',
    courseChapterId: 'ch-math-1',
    spendTime: 15,
    type: 'VIDEO' as TypeCourseEnum,
    tryoutSessionId: null,
    materi: null,
  },
  {
    id: 'sub-math-1-3',
    number: 3,
    website_sub_category_id: 'snbt',
    title: 'Determinan dan Invers',
    document: '/materials/math/determinant.pdf',
    description: 'Cara menghitung determinan dan matriks invers',
    premium: false,
    video: null,
    courseChapterId: 'ch-math-1',
    spendTime: 45,
    type: 'DOCUMENT' as TypeCourseEnum,
    tryoutSessionId: null,
    materi:
      'Penghitungan determinan matriks 2x2 dan 3x3, mencari matriks invers',
  },

  // Matematika - Kalkulus Dasar
  {
    id: 'sub-math-2-1',
    number: 1,
    website_sub_category_id: 'snbt',
    title: 'Limit Fungsi',
    document: '/materials/math/limits.pdf',
    description: 'Konsep limit dan kontinuitas fungsi',
    premium: false,
    video: null,
    courseChapterId: 'ch-math-2',
    spendTime: 40,
    type: 'DOCUMENT' as TypeCourseEnum,
    tryoutSessionId: null,
    materi: 'Pengertian limit, sifat-sifat limit, dan kontinuitas fungsi',
  },
  {
    id: 'sub-math-2-2',
    number: 2,
    website_sub_category_id: 'snbt',
    title: 'Video: Turunan Fungsi',
    document: null,
    description: 'Penjelasan konsep turunan',
    premium: true,
    video: '/materials/math/derivatives.mp4',
    courseChapterId: 'ch-math-2',
    spendTime: 20,
    type: 'VIDEO' as TypeCourseEnum,
    tryoutSessionId: null,
    materi: null,
  },

  // Fisika - Mekanika
  {
    id: 'sub-physics-1-1',
    number: 1,
    website_sub_category_id: 'snbt',
    title: 'Kinematika Gerak Lurus',
    document: '/materials/physics/kinematics.pdf',
    description: 'Gerak lurus beraturan dan berubah beraturan',
    premium: false,
    video: null,
    courseChapterId: 'ch-physics-1',
    spendTime: 35,
    type: 'DOCUMENT' as TypeCourseEnum,
    tryoutSessionId: null,
    materi: 'GLB, GLBB, persamaan gerak, dan grafik gerak',
  },
  {
    id: 'sub-physics-1-2',
    number: 2,
    website_sub_category_id: 'snbt',
    title: 'Video: Hukum Newton',
    document: null,
    description: 'Penjelasan hukum-hukum Newton',
    premium: true,
    video: '/materials/physics/newton-laws.mp4',
    courseChapterId: 'ch-physics-1',
    spendTime: 25,
    type: 'VIDEO' as TypeCourseEnum,
    tryoutSessionId: null,
    materi: null,
  },

  // Bahasa Indonesia - Teks Argumentasi
  {
    id: 'sub-indo-1-1',
    number: 1,
    website_sub_category_id: 'snbt',
    title: 'Struktur Teks Argumentasi',
    document: '/materials/indo/argumentation.pdf',
    description: 'Komponen-komponen dalam teks argumentasi',
    premium: false,
    video: null,
    courseChapterId: 'ch-indo-1',
    spendTime: 30,
    type: 'DOCUMENT' as TypeCourseEnum,
    tryoutSessionId: null,
    materi: 'Tesis, argumen, dan reiterasi dalam teks argumentasi',
  },

  // Kimia - Ikatan Kimia
  {
    id: 'sub-chemistry-1-1',
    number: 1,
    website_sub_category_id: 'snbt',
    title: 'Jenis-jenis Ikatan',
    document: '/materials/chemistry/chemical-bonds.pdf',
    description: 'Ikatan ionik, kovalen, dan logam',
    premium: false,
    video: null,
    courseChapterId: 'ch-chemistry-1',
    spendTime: 40,
    type: 'DOCUMENT' as TypeCourseEnum,
    tryoutSessionId: null,
    materi: 'Pembentukan ikatan ionik, kovalen, dan metalik',
  },
];

// Mock courses data untuk form references
export const mockCourses = [
  {
    id: 'course-math',
    title: 'Matematika Dasar',
    subject: 'Matematika',
    chapters: [
      {
        id: 'ch-math-1',
        title: 'Aljabar Linear',
        subchapters: [
          {
            id: 'sub-math-1-1',
            title: 'Pengantar Matriks',
            type: 'reading' as const,
            content: 'Konsep dasar matriks dan operasi-operasinya',
            fileUrl: '/materials/math/matrix-intro.pdf',
          },
          {
            id: 'sub-math-1-2',
            title: 'Video: Operasi Matriks',
            type: 'video' as const,
            content: 'Tutorial video operasi matriks',
            fileUrl: '/materials/math/matrix-operations.mp4',
            duration: '15 menit',
          },
          {
            id: 'sub-math-1-3',
            title: 'Determinan dan Invers',
            type: 'reading' as const,
            content: 'Cara menghitung determinan dan matriks invers',
            fileUrl: '/materials/math/determinant.pdf',
          },
        ],
      },
      {
        id: 'ch-math-2',
        title: 'Kalkulus Dasar',
        subchapters: [
          {
            id: 'sub-math-2-1',
            title: 'Limit Fungsi',
            type: 'reading' as const,
            content: 'Konsep limit dan kontinuitas fungsi',
            fileUrl: '/materials/math/limits.pdf',
          },
          {
            id: 'sub-math-2-2',
            title: 'Video: Turunan Fungsi',
            type: 'video' as const,
            content: 'Penjelasan konsep turunan',
            fileUrl: '/materials/math/derivatives.mp4',
            duration: '20 menit',
          },
        ],
      },
    ],
  },
  {
    id: 'course-physics',
    title: 'Fisika Umum',
    subject: 'Fisika',
    chapters: [
      {
        id: 'ch-physics-1',
        title: 'Mekanika',
        subchapters: [
          {
            id: 'sub-physics-1-1',
            title: 'Kinematika Gerak Lurus',
            type: 'reading' as const,
            content: 'Gerak lurus beraturan dan berubah beraturan',
            fileUrl: '/materials/physics/kinematics.pdf',
          },
          {
            id: 'sub-physics-1-2',
            title: 'Video: Hukum Newton',
            type: 'video' as const,
            content: 'Penjelasan hukum-hukum Newton',
            fileUrl: '/materials/physics/newton-laws.mp4',
            duration: '25 menit',
          },
        ],
      },
    ],
  },
  {
    id: 'course-indo',
    title: 'Bahasa Indonesia',
    subject: 'Bahasa Indonesia',
    chapters: [
      {
        id: 'ch-indo-1',
        title: 'Teks Argumentasi',
        subchapters: [
          {
            id: 'sub-indo-1-1',
            title: 'Struktur Teks Argumentasi',
            type: 'reading' as const,
            content: 'Komponen-komponen dalam teks argumentasi',
            fileUrl: '/materials/indo/argumentation.pdf',
          },
          {
            id: 'sub-indo-1-2',
            title: 'Audio: Contoh Debat',
            type: 'audio' as const,
            content: 'Rekaman debat yang baik',
            fileUrl: '/materials/indo/debate-example.mp3',
            duration: '12 menit',
          },
        ],
      },
    ],
  },
  {
    id: 'course-chemistry',
    title: 'Kimia Dasar',
    subject: 'Kimia',
    chapters: [
      {
        id: 'ch-chemistry-1',
        title: 'Ikatan Kimia',
        subchapters: [
          {
            id: 'sub-chemistry-1-1',
            title: 'Jenis-jenis Ikatan',
            type: 'reading' as const,
            content: 'Ikatan ionik, kovalen, dan logam',
            fileUrl: '/materials/chemistry/chemical-bonds.pdf',
          },
        ],
      },
    ],
  },
];

// Mock data live classes dengan kategori snbt
export const mockLiveClasses: MockLiveClass[] = [
  {
    id: '1',
    title: 'Matematika Dasar - Aljabar Linear',
    description:
      'Pembahasan lengkap tentang matriks, determinan, dan sistem persamaan linear',
    subject: 'Matematika',
    tutorId: '1',
    tutorName: 'Dr. Ahmad Sukri, M.Si',
    tutorAvatar: '/api/placeholder/40/40',
    scheduleDate: new Date('2025-01-15T19:00:00'),
    startTime: '19:00',
    endTime: '21:00',
    duration: 120,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    maxParticipants: 50,
    currentParticipants: 35,
    status: 'SCHEDULED',
    isRecorded: true,
    agenda: [
      {
        id: '1',
        title: 'Pembukaan & Review',
        description: 'Review materi sebelumnya dan pengantar',
        duration: 15,
        order: 1,
      },
      {
        id: '2',
        title: 'Materi Inti - Matriks',
        description: 'Pembahasan konsep matriks dan operasinya',
        duration: 80,
        order: 2,
      },
      {
        id: '3',
        title: 'Q&A dan Penutup',
        description: 'Sesi tanya jawab dan rangkuman',
        duration: 25,
        order: 3,
      },
    ],
    readingReferences: [
      {
        id: 'ref-1',
        source: 'subchapter',
        courseId: 'course-math',
        courseTitle: 'Matematika Dasar',
        chapterId: 'ch-math-1',
        chapterTitle: 'Aljabar Linear',
        subchapterId: 'sub-math-1-1',
        subchapterTitle: 'Operasi Matriks',
        title: 'Operasi Matriks',
        description: 'Penjumlahan, pengurangan, dan perkalian matriks',
        type: 'reading',
        content: 'Penjumlahan, pengurangan, dan perkalian matriks',
        fileUrl: '/materials/math/matrix-operations.pdf',
      },
      {
        id: 'url-ref-1',
        source: 'url',
        title: 'Khan Academy - Matrix Operations',
        description: 'Tutorial lengkap operasi matriks dari Khan Academy',
        url: 'https://www.khanacademy.org/math/algebra-home/alg-matrices',
        type: 'website',
        content: 'Tutorial lengkap operasi matriks dari Khan Academy',
      },
    ],
    recordingReferences: [
      {
        id: 'rec-1',
        source: 'subchapter',
        courseId: 'course-math',
        courseTitle: 'Matematika Dasar',
        chapterId: 'ch-math-1',
        chapterTitle: 'Aljabar Linear',
        subchapterId: 'sub-math-1-2',
        subchapterTitle: 'Video Tutorial Determinan',
        title: 'Video Tutorial Determinan',
        description: 'Cara menghitung determinan matriks 2x2 dan 3x3',
        type: 'video',
        content: 'Cara menghitung determinan matriks 2x2 dan 3x3',
        fileUrl: '/materials/math/determinant-video.mp4',
        duration: '15 menit',
      },
    ],
    createdAt: new Date('2025-01-10T10:00:00'),
    updatedAt: new Date('2025-01-12T14:30:00'),
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
  },
  {
    id: '2',
    title: 'Fisika - Mekanika Newton',
    description:
      'Hukum-hukum Newton dan aplikasinya dalam kehidupan sehari-hari',
    subject: 'Fisika',
    tutorId: '2',
    tutorName: 'Prof. Dr. Siti Nurhaliza',
    tutorAvatar: '/api/placeholder/40/40',
    scheduleDate: new Date('2025-01-16T20:00:00'),
    startTime: '20:00',
    endTime: '22:00',
    duration: 120,
    meetLink: 'https://meet.google.com/xyz-uvwx-yz',
    maxParticipants: 40,
    currentParticipants: 28,
    status: 'SCHEDULED',
    isRecorded: true,
    agenda: [
      {
        id: '4',
        title: 'Review Konsep Gaya',
        description: 'Pengulangan konsep gaya dan vektor',
        duration: 20,
        order: 1,
      },
      {
        id: '5',
        title: 'Hukum Newton I, II, III',
        description: 'Pembahasan ketiga hukum Newton',
        duration: 85,
        order: 2,
      },
      {
        id: '6',
        title: 'Contoh Soal dan Diskusi',
        description: 'Penerapan dalam soal-soal',
        duration: 15,
        order: 3,
      },
    ],
    readingReferences: [
      {
        id: 'ref-2',
        source: 'subchapter',
        courseId: 'course-physics',
        courseTitle: 'Fisika Dasar',
        chapterId: 'ch-physics-1',
        chapterTitle: 'Mekanika',
        subchapterId: 'sub-physics-1-1',
        subchapterTitle: 'Hukum Newton I',
        title: 'Hukum Newton I',
        description: 'Hukum kelembaman Newton',
        type: 'reading',
        content: 'Hukum kelembaman Newton',
        fileUrl: '/materials/physics/newton-law-1.pdf',
      },
    ],
    recordingReferences: [
      {
        id: 'rec-2',
        source: 'subchapter',
        courseId: 'course-physics',
        courseTitle: 'Fisika Dasar',
        chapterId: 'ch-physics-1',
        chapterTitle: 'Mekanika',
        subchapterId: 'sub-physics-1-2',
        subchapterTitle: 'Video: Eksperimen Hukum Newton',
        title: 'Video: Eksperimen Hukum Newton',
        description: 'Demonstrasi eksperimen hukum Newton',
        type: 'video',
        content: 'Demonstrasi eksperimen hukum Newton',
        fileUrl: '/materials/physics/newton-experiment.mp4',
        duration: '12 menit',
      },
    ],
    createdAt: new Date('2025-01-11T09:00:00'),
    updatedAt: new Date('2025-01-11T09:00:00'),
    createdBy: 'admin-002',
    updatedBy: 'admin-002',
  },
  {
    id: '3',
    title: 'Bahasa Indonesia - Teks Argumentasi',
    description:
      'Strategi menulis dan menganalisis teks argumentasi yang efektif',
    subject: 'Bahasa Indonesia',
    tutorId: '3',
    tutorName: 'Dra. Ratna Sari, M.Pd',
    tutorAvatar: '/api/placeholder/40/40',
    scheduleDate: new Date('2025-01-14T18:30:00'),
    startTime: '18:30',
    endTime: '20:00',
    duration: 90,
    meetLink: 'https://meet.google.com/def-ghij-klm',
    maxParticipants: 30,
    currentParticipants: 22,
    status: 'ONGOING',
    isRecorded: false,
    agenda: [
      {
        id: '7',
        title: 'Pengenalan Teks Argumentasi',
        description: 'Definisi dan karakteristik',
        duration: 25,
        order: 1,
      },
      {
        id: '8',
        title: 'Struktur dan Pola Pengembangan',
        description: 'Cara menyusun argumentasi yang logis',
        duration: 50,
        order: 2,
      },
      {
        id: '9',
        title: 'Latihan Menulis',
        description: 'Praktik menulis teks argumentasi',
        duration: 15,
        order: 3,
      },
    ],
    readingReferences: [
      {
        id: 'ref-3',
        source: 'subchapter',
        courseId: 'course-indo',
        courseTitle: 'Bahasa Indonesia',
        chapterId: 'ch-indo-1',
        chapterTitle: 'Teks Argumentasi',
        subchapterId: 'sub-indo-1-1',
        subchapterTitle: 'Contoh Teks Argumentasi Terbaik',
        title: 'Contoh Teks Argumentasi Terbaik',
        description: 'Koleksi teks argumentasi berkualitas tinggi',
        type: 'reading',
        content: 'Koleksi teks argumentasi berkualitas tinggi',
        fileUrl: '/materials/indo/argumentative-texts.pdf',
      },
    ],
    recordingReferences: [
      {
        id: 'url-rec-3',
        source: 'url',
        title: 'TED Talk: The Art of Persuasive Writing',
        description: 'Video tentang teknik menulis persuasif yang efektif',
        url: 'https://www.ted.com/talks/persuasive_writing',
        type: 'video',
        content: 'Video tentang teknik menulis persuasif yang efektif',
      },
    ],
    createdAt: new Date('2025-01-12T16:00:00'),
    updatedAt: new Date('2025-01-14T10:00:00'),
    createdBy: 'admin-001',
    updatedBy: 'admin-003',
  },
  {
    id: '4',
    title: 'Kimia - Ikatan Kimia',
    description: 'Memahami berbagai jenis ikatan kimia dan sifat-sifatnya',
    subject: 'Kimia',
    tutorId: '4',
    tutorName: 'Dr. Bambang Wijaya, M.Sc',
    scheduleDate: new Date('2025-01-12T19:30:00'),
    startTime: '19:30',
    endTime: '21:30',
    duration: 120,
    meetLink: 'https://meet.google.com/nop-qrst-uvw',
    maxParticipants: 45,
    currentParticipants: 45,
    status: 'COMPLETED',
    isRecorded: true,
    agenda: [
      {
        id: '10',
        title: 'Review Struktur Atom',
        description: 'Pengulangan konsep elektron valensi',
        duration: 20,
        order: 1,
      },
      {
        id: '11',
        title: 'Ikatan Ionik dan Kovalen',
        description: 'Pembentukan dan karakteristik',
        duration: 70,
        order: 2,
      },
      {
        id: '12',
        title: 'Ikatan Logam dan Intermolekul',
        description: 'Ikatan dalam logam dan antar molekul',
        duration: 30,
        order: 3,
      },
    ],
    readingReferences: [
      {
        id: 'ref-4',
        source: 'subchapter',
        courseId: 'course-chemistry',
        courseTitle: 'Kimia Dasar',
        chapterId: 'ch-chemistry-1',
        chapterTitle: 'Ikatan Kimia',
        subchapterId: 'sub-chemistry-1-1',
        subchapterTitle: 'Jenis-jenis Ikatan',
        title: 'Jenis-jenis Ikatan',
        description: 'Ikatan ionik, kovalen, dan logam',
        type: 'reading',
        content: 'Ikatan ionik, kovalen, dan logam',
        fileUrl: '/materials/chemistry/chemical-bonds.pdf',
      },
    ],
    recordingReferences: [
      {
        id: 'url-rec-4',
        source: 'url',
        title: 'Simulasi Ikatan Kimia',
        description: 'Simulasi interaktif pembentukan ikatan kimia',
        url: 'https://simulation.chemistry.edu/bonds',
        type: 'website',
        content: 'Simulasi interaktif pembentukan ikatan kimia',
      },
    ],
    createdAt: new Date('2025-01-08T14:00:00'),
    updatedAt: new Date('2025-01-10T11:00:00'),
    createdBy: 'admin-002',
    updatedBy: 'admin-002',
  },
  {
    id: '5',
    title: 'Biologi - Sistem Reproduksi',
    description: 'Anatomi dan fisiologi sistem reproduksi manusia',
    subject: 'Biologi',
    tutorId: '5',
    tutorName: 'Dr. Fitri Handayani, M.Si',
    scheduleDate: new Date('2025-01-18T19:00:00'),
    startTime: '19:00',
    endTime: '21:00',
    duration: 120,
    meetLink: 'https://meet.google.com/bio-repro-123',
    maxParticipants: 35,
    currentParticipants: 15,
    status: 'CANCELLED',
    isRecorded: false,
    agenda: [],
    readingReferences: [],
    recordingReferences: [],
    createdAt: new Date('2025-01-13T12:00:00'),
    updatedAt: new Date('2025-01-14T15:00:00'),
    createdBy: 'admin-003',
    updatedBy: 'admin-003',
  },
];

// Mock tutors data
export interface MockTutor {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  bio: string;
  subjects: string[];
  avatar?: string;
  rating: number;
  totalClasses: number;
  isActive: boolean;
}

export const mockTutors: MockTutor[] = [
  {
    id: '1',
    fullName: 'Dr. Ahmad Sukri, M.Si',
    email: 'ahmad.sukri@bimbelio.com',
    phone: '+6281234567890',
    bio: 'Dosen Matematika dengan pengalaman 15 tahun dalam bidang aljabar dan analisis. Lulusan PhD Matematika dari ITB.',
    subjects: ['Matematika', 'Statistika', 'Kalkulus'],
    avatar: '/api/placeholder/40/40',
    rating: 4.8,
    totalClasses: 45,
    isActive: true,
  },
  {
    id: '2',
    fullName: 'Prof. Dr. Siti Nurhaliza',
    email: 'siti.nurhaliza@bimbelio.com',
    phone: '+6281234567891',
    bio: 'Profesor Fisika dengan spesialisasi mekanika dan termodinamika. Aktif dalam penelitian dan pengajaran selama 20 tahun.',
    subjects: ['Fisika', 'Mekanika', 'Termodinamika'],
    avatar: '/api/placeholder/40/40',
    rating: 4.9,
    totalClasses: 38,
    isActive: true,
  },
  {
    id: '3',
    fullName: 'Dra. Ratna Sari, M.Pd',
    email: 'ratna.sari@bimbelio.com',
    phone: '+6281234567892',
    bio: 'Pengajar Bahasa Indonesia berpengalaman dengan fokus pada pembelajaran sastra dan tata bahasa modern.',
    subjects: ['Bahasa Indonesia', 'Sastra', 'Linguistik'],
    avatar: '/api/placeholder/40/40',
    rating: 4.7,
    totalClasses: 52,
    isActive: true,
  },
  {
    id: '4',
    fullName: 'Dr. Bambang Wijaya, M.Sc',
    email: 'bambang.wijaya@bimbelio.com',
    phone: '+6281234567893',
    bio: 'Ahli kimia dengan spesialisasi kimia organik dan anorganik. Berpengalaman mengajar di berbagai tingkat pendidikan.',
    subjects: ['Kimia', 'Kimia Organik', 'Kimia Anorganik'],
    rating: 4.6,
    totalClasses: 29,
    isActive: true,
  },
  {
    id: '5',
    fullName: 'Dr. Fitri Handayani, M.Si',
    email: 'fitri.handayani@bimbelio.com',
    phone: '+6281234567894',
    bio: 'Doktor Biologi dengan penelitian di bidang genetika dan biologi molekuler. Pengalaman mengajar 12 tahun.',
    subjects: ['Biologi', 'Genetika', 'Biologi Molekuler'],
    rating: 4.8,
    totalClasses: 33,
    isActive: true,
  },
];

// Helper functions
export const getStatusColor = (status: LiveClassStatus) => {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800';
    case 'ONGOING':
      return 'bg-green-100 text-green-800';
    case 'COMPLETED':
      return 'bg-gray-100 text-gray-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: LiveClassStatus) => {
  switch (status) {
    case 'SCHEDULED':
      return 'Terjadwal';
    case 'ONGOING':
      return 'Berlangsung';
    case 'COMPLETED':
      return 'Selesai';
    case 'CANCELLED':
      return 'Dibatalkan';
    default:
      return 'Unknown';
  }
};

export const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatTime = (time: string) => {
  return time;
};

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}j ${mins}m`;
  }
  return `${mins}m`;
};

// Helper functions untuk references
export const getCourseChapterById = (chapterId: string) => {
  return mockCourseChapters.find((chapter) => chapter.id === chapterId);
};

export const getCourseSubChapterById = (subChapterId: string) => {
  return mockCourseSubChapters.find(
    (subChapter) => subChapter.id === subChapterId,
  );
};

export const getCoursesBySubject = (subject: string) => {
  return mockCourses.filter((course) => course.subject === subject);
};

export const getSubjectList = () => {
  return [...new Set(mockCourses.map((course) => course.subject))];
};

export const getAllCourseChapters = () => {
  return mockCourseChapters;
};

export const getAllCourseSubChapters = () => {
  return mockCourseSubChapters;
};

// Mock tutors untuk form - diupdate agar konsisten dengan yang ada di live class
export const mockTutorsForForm = [
  {
    id: '1',
    name: 'Dr. Ahmad Sukri, M.Si',
    avatar: '/api/placeholder/40/40',
    specializations: ['Matematika', 'Fisika'],
    experience: '8 tahun',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Prof. Dr. Siti Nurhaliza',
    avatar: '/api/placeholder/40/40',
    specializations: ['Kimia', 'Biologi'],
    experience: '12 tahun',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Dra. Ratna Sari, M.Pd',
    avatar: '/api/placeholder/40/40',
    specializations: ['Bahasa Indonesia', 'Bahasa Inggris'],
    experience: '10 tahun',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Dr. Bambang Wijaya, M.Sc',
    avatar: '/api/placeholder/40/40',
    specializations: ['Kimia', 'Kimia Organik', 'Kimia Anorganik'],
    experience: '15 tahun',
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Dr. Fitri Handayani, M.Si',
    avatar: '/api/placeholder/40/40',
    specializations: ['Biologi', 'Genetika', 'Biologi Molekuler'],
    experience: '12 tahun',
    rating: 4.8,
  },
];

// Mock data untuk participants live class
export const mockLiveClassParticipants: LiveClassParticipant[] = [
  // Participants for Live Class 1
  {
    id: 'p1',
    liveClassId: '1',
    userId: 'user1',
    email: 'student1@bimbelio.com',
    name: 'Ahmad Fauzi',
    registeredAt: new Date('2025-01-12T10:00:00'),
    status: 'registered',
    hasPackage: true,
    packageType: 'SIMAK UI Premium 2024',
  },
  {
    id: 'p2',
    liveClassId: '1',
    userId: 'user2',
    email: 'student2@bimbelio.com',
    name: 'Siti Nurhaliza',
    registeredAt: new Date('2025-01-12T10:30:00'),
    invitedAt: new Date('2025-01-13T08:00:00'),
    status: 'invited',
    hasPackage: true,
    packageType: 'SIMAK UI Premium 2024',
  },
  {
    id: 'p3',
    liveClassId: '1',
    userId: 'user3',
    email: 'student3@bimbelio.com',
    name: 'Budi Santoso',
    registeredAt: new Date('2025-01-12T11:00:00'),
    invitedAt: new Date('2025-01-13T08:00:00'),
    status: 'invited',
    hasPackage: true,
    packageType: 'SIMAK UI Premium 2024',
  },
  {
    id: 'p4',
    liveClassId: '1',
    userId: 'user4',
    email: 'student4@bimbelio.com',
    name: 'Dewi Kartika',
    registeredAt: new Date('2025-01-12T14:00:00'),
    status: 'registered',
    hasPackage: true,
    packageType: 'SIMAK UI Premium 2024',
  },
  {
    id: 'p5',
    liveClassId: '1',
    userId: 'user5',
    email: 'student5@bimbelio.com',
    name: 'Ricky Pratama',
    registeredAt: new Date('2025-01-12T15:00:00'),
    status: 'registered',
    hasPackage: true,
    packageType: 'SIMAK UI Premium 2024',
  },
  // Participants for Live Class 2
  {
    id: 'p6',
    liveClassId: '2',
    userId: 'user6',
    email: 'student6@bimbelio.com',
    name: 'Maya Sari',
    registeredAt: new Date('2025-01-13T09:00:00'),
    invitedAt: new Date('2025-01-14T08:00:00'),
    status: 'invited',
    hasPackage: true,
    packageType: 'SIMAK UI Premium 2024',
  },
  {
    id: 'p7',
    liveClassId: '2',
    userId: 'user7',
    email: 'student7@bimbelio.com',
    name: 'Doni Setiawan',
    registeredAt: new Date('2025-01-13T10:00:00'),
    status: 'registered',
    hasPackage: true,
    packageType: 'SIMAK UI Premium 2024',
  },
  {
    id: 'p8',
    liveClassId: '2',
    userId: 'user8',
    email: 'student8@bimbelio.com',
    name: 'Lina Marlina',
    registeredAt: new Date('2025-01-13T11:00:00'),
    status: 'registered',
    hasPackage: true,
    packageType: 'SIMAK UI Premium 2024',
  },
  // Participants for Live Class 3 (Ongoing)
  {
    id: 'p9',
    liveClassId: '3',
    userId: 'user9',
    email: 'student9@bimbelio.com',
    name: 'Eko Prasetyo',
    registeredAt: new Date('2025-01-14T08:00:00'),
    invitedAt: new Date('2025-01-14T09:00:00'),
    status: 'invited',
    hasPackage: true,
    packageType: 'SIMAK UI Premium 2024',
  },
  {
    id: 'p10',
    liveClassId: '3',
    userId: 'user10',
    email: 'student10@bimbelio.com',
    name: 'Rina Wulandari',
    registeredAt: new Date('2025-01-14T08:30:00'),
    invitedAt: new Date('2025-01-14T09:00:00'),
    status: 'invited',
    hasPackage: true,
    packageType: 'SIMAK UI Premium 2024',
  },
];

// Helper functions untuk participant management
export const getParticipantsByLiveClass = (
  liveClassId: string,
): LiveClassParticipant[] => {
  return mockLiveClassParticipants.filter((p) => p.liveClassId === liveClassId);
};

export const getParticipantStats = (liveClassId: string) => {
  const participants = getParticipantsByLiveClass(liveClassId);
  const registered = participants.filter(
    (p) => p.status === 'registered',
  ).length;
  const invited = participants.filter((p) => p.status === 'invited').length;
  const expired = participants.filter((p) => p.status === 'expired').length;
  const total = participants.length;

  return {
    total,
    registered,
    invited,
    expired,
    pendingInvitation: registered,
  };
};

export const getParticipantEmails = (
  liveClassId: string,
  status?: 'registered' | 'invited' | 'expired',
): string[] => {
  let participants = getParticipantsByLiveClass(liveClassId);

  if (status) {
    participants = participants.filter((p) => p.status === status);
  }

  return participants.map((p) => p.email);
};
