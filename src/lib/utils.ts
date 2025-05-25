// utils.ts
import { clsx, type ClassValue } from 'clsx';
import Cookies from 'js-cookie';
import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertDaysToWords = (days: number): string => {
  if (days > 10000) return 'Lifetime';
  if (days <= 0) return 'Hari tidak valid';

  const tahun = Math.floor(days / 360);
  days %= 360;

  const bulan = Math.floor(days / 30);
  days %= 30;

  const minggu = Math.floor(days / 7);
  days %= 7;

  const result = [];

  if (tahun > 0) result.push(`${tahun} Tahun`);
  if (bulan > 0) result.push(`${bulan} Bulan`);
  if (minggu > 0) result.push(`${minggu} Minggu`);
  if (days > 0) result.push(`${days} Hari`);

  return result.join(' ');
};

export function formatDate(date: Date | string): string {
  // Pastikan kita punya objek Date
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    // Jika invalid date
    return '-';
  }

  // Contoh: format dd MMM yyyy (05 Jan 2025)
  // Boleh ganti 'id-ID' jika mau format bahasa Indonesia
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export const copyTextToClipboard = (text: string | undefined) => {
  if (text) {
    navigator.clipboard.writeText(text);
    toaster({
      title: 'Disalin',
    });
  }
};

export const DateTimeWithZone = (date: any) => {
  if (env.NODE_ENV === 'production') {
    // // Buat objek Date dari string ISO 8601
    const dateObj = new Date(date);

    // Kurangi 7 jam (dalam milidetik: 7 * 60 * 60 * 1000)
    dateObj.setHours(dateObj.getHours() - 7);

    // Format ulang ke ISO 8601 untuk pengiriman
    const send = dateObj.toISOString().slice(0, 16); // Mengambil bagian 'YYYY-MM-DDTHH:MM'

    return send;
  } else {
    return date;
  }
};

export const newDateWithTimeZone = () => {
  // if (env.NODE_ENV === 'production') {
  //   const dateObj = new Date();
  //   dateObj.setHours(dateObj.getHours() - 7);
  //   const send = dateObj.toISOString().slice(0, 16);
  //   return new Date(send);
  // } else {
  //   return new Date();
  // }

  return new Date();
};

export const getInitials = (input: string): string => {
  // Split the input string by spaces
  const words = input.trim().split(/\s+/);

  // Map each word to its first letter and convert to uppercase
  const initials = words
    .filter((word) => !word.includes('('))
    .map((word) => word.charAt(0).toUpperCase());

  // Join the initials into a single string
  return initials.join('');
};

export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Remove leading zeros if present
  const withoutLeadingZero = cleaned.replace(/^0+/, '');

  // Add +62 prefix if not present
  const withPrefix = withoutLeadingZero.startsWith('62')
    ? withoutLeadingZero
    : `62${withoutLeadingZero}`;

  return withPrefix;
}

export function formatSchoolName(school: string): string {
  if (!school) return '';

  // Remove extra spaces and convert to uppercase for processing
  let name = school.trim().toUpperCase();

  // Standardize school type abbreviations
  const typeMap: Record<string, string> = {
    SMAN: 'SMAN',
    'SMA N': 'SMAN',
    SMKN: 'SMKN',
    'SMK N': 'SMKN',
    MAN: 'MAN',
    MA: 'MA',
    SMK: 'SMK',
    SMA: 'SMA',
    SMAS: 'SMA',
  };

  // Replace known abbreviations
  for (const [key, value] of Object.entries(typeMap)) {
    if (name.startsWith(key)) {
      name = name.replace(key, value);
      break;
    }
  }

  // Special handling for Islamic schools
  if (name.includes('AL-') || name.includes('AL ')) {
    name = name.replace(/AL-?/g, 'Al-');
  }

  // Convert to title case for location names (after the school type)
  const parts = name.split(' ');
  const schoolType = parts[0];
  const rest = parts
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return `${schoolType} ${rest}`.trim();
}

export const imageProfile = Cookies.get('image-profile');

export const getDate = (date: any) => {
  const Dates = new Date(date);
  const day = Dates.getDate();
  const month = Dates.getMonth() + 1;
  const year = Dates.getFullYear();
  return `${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year}`;
};
export const getHours = (date: any) => {
  const Dates = new Date(date);
  const hours = Dates.getHours();
  const minute = Dates.getMinutes();
  return `${hours < 10 ? `0${hours}` : hours}:${
    minute < 10 ? `0${minute}` : minute
  }`;
};
export const getHoursDetail = (date: any) => {
  const Dates = new Date(date);
  const hours = Dates.getHours();
  const minute = Dates.getMinutes();
  const second = Dates.getSeconds();
  return `${hours < 10 ? `0${hours}` : hours}:${
    minute < 10 ? `0${minute}` : minute
  }:${second < 10 ? `0${second}` : second}`;
};
export const getDateHourStr = (date: any) => {
  const dateData = new Date(date);
  const dates = `${dateData.getFullYear()}-${(dateData.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${dateData.getDate().toString().padStart(2, '0')}`;
  const hour = `${dateData.getHours().toString().padStart(2, '0')}:${dateData
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return `${dates}T${hour}`;
};
export const getDateString = (date: any) => {
  const Dates = new Date(date);
  const day = Dates.getDate();
  const month = Dates.getMonth();
  const year = Dates.getFullYear();

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return `${day < 10 ? `0${day}` : day} ${monthNames[month]} ${year}`;
};

export const getDateStringShort = (date: any) => {
  const Dates = new Date(date);
  const day = Dates.getDate();
  const month = Dates.getMonth();
  const year = Dates.getFullYear();

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agus',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  return `${day < 10 ? `0${day}` : day} ${monthNames[month]} ${year}`;
};

import { Dispatch, SetStateAction } from 'react';

export const getError = (error: any) => {
  // if (error instanceof TRPCError) {
  //   if (error.code === "CLIENT_CLOSED_REQUEST") {
  //     throw new TRPCError({
  //       code: "CLIENT_CLOSED_REQUEST",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "CONFLICT") {
  //     throw new TRPCError({
  //       code: "CONFLICT",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "FORBIDDEN") {
  //     throw new TRPCError({
  //       code: "FORBIDDEN",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "METHOD_NOT_SUPPORTED") {
  //     throw new TRPCError({
  //       code: "METHOD_NOT_SUPPORTED",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "NOT_FOUND") {
  //     throw new TRPCError({
  //       code: "NOT_FOUND",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "NOT_IMPLEMENTED") {
  //     throw new TRPCError({
  //       code: "NOT_IMPLEMENTED",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "PARSE_ERROR") {
  //     throw new TRPCError({
  //       code: "PARSE_ERROR",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "PAYLOAD_TOO_LARGE") {
  //     throw new TRPCError({
  //       code: "PAYLOAD_TOO_LARGE",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "PRECONDITION_FAILED") {
  //     throw new TRPCError({
  //       code: "PRECONDITION_FAILED",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "TIMEOUT") {
  //     throw new TRPCError({
  //       code: "TIMEOUT",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "TOO_MANY_REQUESTS") {
  //     throw new TRPCError({
  //       code: "TOO_MANY_REQUESTS",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "UNAUTHORIZED") {
  //     throw new TRPCError({
  //       code: "UNAUTHORIZED",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "UNPROCESSABLE_CONTENT") {
  //     throw new TRPCError({
  //       code: "UNPROCESSABLE_CONTENT",
  //       message: message ? message : "-",
  //     });
  //   }
  //   if (error.code === "BAD_REQUEST") {
  //     throw new TRPCError({
  //       code: "BAD_REQUEST",
  //       message: message ? message : "-",
  //     });
  //   }
  //   throw new TRPCError({
  //     code: "INTERNAL_SERVER_ERROR",
  //     message: "Internal Server Error",
  //   });
  // }
  return error;
};

// export const Limitation = {
//   free: {
//     chat: parseInt(env.LIMITATION_CHAT_FREE),
//     notes: parseInt(env.LIMITATION_NOTES_FREE),
//     vision: parseInt(env.LIMITATION_VISION_FREE),
//     quiz: parseInt(env.LIMITATION_QUIZ_FREE),
//   },
//   premium: {
//     chat: parseInt(env.LIMITATION_CHAT_PREMIUM),
//     notes: parseInt(env.LIMITATION_NOTES_PREMIUM),
//     vision: parseInt(env.LIMITATION_VISION_PREMIUM),
//     quiz: parseInt(env.LIMITATION_QUIZ_PREMIUM),
//   },
// };

export const getDateTryoutString = (date: any) => {
  const Dates = new Date(date);
  const day = Dates.getDate();
  const month = Dates.getMonth();

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return `${day < 10 ? `0${day}` : day} ${monthNames[month]}`;
};
export const getDateForInput = (dateStr: any) => {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
export const replaceLatexNotation = (content: string) => {
  if (content) {
    return content
      .replace(/\\\[(.*?)\\\]/g, '$$$$ $1 $$$$') // Block math
      .replace(/\\\((.*?)\\\)/g, '$ $1 $'); // Inline math
  }
  return '';
};
export const base64ToFile = (base64: any, filename: any) => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  const blob = new Blob([u8arr], { type: mime });

  return new File([blob], filename, { type: mime });
};
export const hideVideoLink = async ({
  setUrl,
  link,
}: {
  link: string;
  setUrl: Dispatch<SetStateAction<string>>;
}) => {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', link);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      const blob = new Blob([xhr.response]);
      const url = URL.createObjectURL(blob);

      setUrl(url);
    };
    xhr.send();
  } catch (error) {
    error;
  }
};

export function constructMetadata({
  title = 'Bimbelio - Bimbel AI untuk PTN dan Kedinasan',
  description = 'Bimbelio revolutionises the learning experience with active AI-based learning tools.',
  image = '/logo.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const baseUrl = 'https://www.bimbelio.com';
  const imageUrl = new URL(image, baseUrl).toString();
  const iconUrl = new URL(icons, baseUrl).toString();

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: baseUrl,
      title,
      description,
      siteName: 'Bimbelio',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Bimbelio Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@syamiljihad',
    },
    icons: {
      icon: [
        {
          url: iconUrl,
        },
      ],
    },
    metadataBase: new URL(baseUrl),
    themeColor: '#FFF',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export const TncTryout = [
  {
    category: 'twk',
    value:
      '- TWK\n- Jumlah Soal: 30\n- Penilaian: Benar 5, Salah 0\n- Materi: Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, Sejarah Perjuangan Bangsa\n- Passing Grade: 65\n- Tujuan: Mengukur wawasan kebangsaan, nasionalisme, dan pemahaman terhadap ideologi negara',
  },
  {
    category: 'tiu',
    value:
      '- TIU\n- Jumlah Soal: 35\n- Penilaian: Benar 5, Salah 0\n- Materi: Kemampuan Verbal (sinonim, antonim, analogi), Kemampuan Numerik (aritmetika, seri angka), Kemampuan Logika (penalaran, silogisme)\n- Passing Grade: 80\n- Tujuan: Mengukur kemampuan berpikir logis, numerik, dan verbal',
  },
  {
    category: 'tkp',
    value:
      '- TKP\n- Jumlah Soal: 45\n- Penilaian: Skor 1-5 per jawaban (Tidak ada jawaban bernilai 0)\n- Materi: Integritas, Adaptasi, Pelayanan Publik, Kerjasama, Kepemimpinan, Pengendalian Diri\n- Passing Grade: 166\n- Tujuan: Mengukur karakteristik pribadi peserta terkait integritas, etika kerja, dan kemampuan sosial',
  },
];

export const Provinces = [
  {
    province: 'Aceh',
    district: [
      { regency: 'Banda Aceh' },
      { regency: 'Langsa' },
      { regency: 'Sabang' },
      { regency: 'Lhokseumawe' },
      { regency: 'Aceh Besar' },
      { regency: 'Aceh Barat' },
      { regency: 'Aceh Barat Daya' },
      { regency: 'Aceh Jaya' },
      { regency: 'Aceh Selatan' },
      { regency: 'Aceh Singkil' },
      { regency: 'Aceh Tamiang' },
      { regency: 'Aceh Tengah' },
      { regency: 'Aceh Tenggara' },
      { regency: 'Aceh Timur' },
      { regency: 'Aceh Utara' },
      { regency: 'Bener Meriah' },
      { regency: 'Bireuen' },
      { regency: 'Gayo Lues' },
      { regency: 'Nagan Raya' },
      { regency: 'Pidie' },
      { regency: 'Pidie Jaya' },
      { regency: 'Simeulue' },
    ],
  },
  {
    province: 'Bali',
    district: [
      { regency: 'Denpasar' },
      { regency: 'Badung' },
      { regency: 'Bangli' },
      { regency: 'Buleleng' },
      { regency: 'Gianyar' },
      { regency: 'Jembrana' },
      { regency: 'Karangasem' },
      { regency: 'Klungkung' },
      { regency: 'Tabanan' },
    ],
  },
  {
    province: 'Bangka Belitung',
    district: [
      { regency: 'Bangka' },
      { regency: 'Belitung' },
      { regency: 'Pangkal Pinang' },
      { regency: 'Belitung Timur' },
      { regency: 'Bangka Barat' },
      { regency: 'Bangka Tengah' },
      { regency: 'Bangka Selatan' },
    ],
  },
  {
    province: 'Banten',
    district: [
      { regency: 'Cilegon' },
      { regency: 'Lebak' },
      { regency: 'Pandeglang' },
      { regency: 'Serang' },
      { regency: 'Tangerang' },
      { regency: 'Tangerang Selatan' },
    ],
  },
  {
    province: 'Bengkulu',
    district: [
      { regency: 'Bengkulu' },
      { regency: 'Bengkulu Selatan' },
      { regency: 'Bengkulu Tengah' },
      { regency: 'Bengkulu Utara' },
      { regency: 'Kaur' },
      { regency: 'Kepahiang' },
      { regency: 'Lebong' },
      { regency: 'Mukomuko' },
      { regency: 'Rejang Lebong' },
      { regency: 'Seluma' },
    ],
  },
  {
    province: 'DKI Jakarta',
    district: [
      { regency: 'Jakarta Barat' },
      { regency: 'Jakarta Pusat' },
      { regency: 'Jakarta Selatan' },
      { regency: 'Jakarta Timur' },
      { regency: 'Jakarta Utara' },
      { regency: 'Kepulauan Seribu' },
    ],
  },
  {
    province: 'DI Yogyakarta',
    district: [
      { regency: 'Bantul' },
      { regency: 'Gunungkidul' },
      { regency: 'Kulon Progo' },
      { regency: 'Sleman' },
      { regency: 'Yogyakarta' },
    ],
  },
  {
    province: 'Gorontalo',
    district: [
      { regency: 'Boalemo' },
      { regency: 'Bone Bolango' },
      { regency: 'Gorontalo' },
      { regency: 'Gorontalo Utara' },
      { regency: 'Pohuwato' },
    ],
  },
  {
    province: 'Jambi',
    district: [
      { regency: 'Batanghari' },
      { regency: 'Bungo' },
      { regency: 'Jambi' },
      { regency: 'Kerinci' },
      { regency: 'Merangin' },
      { regency: 'Muaro Jambi' },
      { regency: 'Sarolangun' },
      { regency: 'Tanjung Jabung Barat' },
      { regency: 'Tanjung Jabung Timur' },
      { regency: 'Tebo' },
    ],
  },
  {
    province: 'Jawa Barat',
    district: [
      { regency: 'Bandung' },
      { regency: 'Bandung Barat' },
      { regency: 'Bekasi' },
      { regency: 'Bogor' },
      { regency: 'Ciamis' },
      { regency: 'Cianjur' },
      { regency: 'Cimahi' },
      { regency: 'Cirebon' },
      { regency: 'Depok' },
      { regency: 'Garut' },
      { regency: 'Indramayu' },
      { regency: 'Karawang' },
      { regency: 'Kuningan' },
      { regency: 'Majalengka' },
      { regency: 'Pangandaran' },
      { regency: 'Purwakarta' },
      { regency: 'Subang' },
      { regency: 'Sukabumi' },
      { regency: 'Sumedang' },
      { regency: 'Tasikmalaya' },
    ],
  },
  {
    province: 'Jawa Tengah',
    district: [
      { regency: 'Banjarnegara' },
      { regency: 'Banyumas' },
      { regency: 'Batang' },
      { regency: 'Blora' },
      { regency: 'Boyolali' },
      { regency: 'Brebes' },
      { regency: 'Cilacap' },
      { regency: 'Demak' },
      { regency: 'Grobogan' },
      { regency: 'Jepara' },
      { regency: 'Karanganyar' },
      { regency: 'Kebumen' },
      { regency: 'Kendal' },
      { regency: 'Klaten' },
      { regency: 'Kudus' },
      { regency: 'Magelang' },
      { regency: 'Pati' },
      { regency: 'Pekalongan' },
      { regency: 'Pemalang' },
      { regency: 'Purbalingga' },
      { regency: 'Purworejo' },
      { regency: 'Rembang' },
      { regency: 'Salatiga' },
      { regency: 'Semarang' },
      { regency: 'Sragen' },
      { regency: 'Sukoharjo' },
      { regency: 'Surakarta' },
      { regency: 'Tegal' },
      { regency: 'Temanggung' },
      { regency: 'Wonogiri' },
      { regency: 'Wonosobo' },
    ],
  },
  {
    province: 'Jawa Timur',
    district: [
      { regency: 'Bangkalan' },
      { regency: 'Banyuwangi' },
      { regency: 'Blitar' },
      { regency: 'Bojonegoro' },
      { regency: 'Bondowoso' },
      { regency: 'Gresik' },
      { regency: 'Jember' },
      { regency: 'Jombang' },
      { regency: 'Kediri' },
      { regency: 'Lamongan' },
      { regency: 'Lumajang' },
      { regency: 'Madiun' },
      { regency: 'Magetan' },
      { regency: 'Malang' },
      { regency: 'Mojokerto' },
      { regency: 'Nganjuk' },
      { regency: 'Ngawi' },
      { regency: 'Pacitan' },
      { regency: 'Pamekasan' },
      { regency: 'Pasuruan' },
      { regency: 'Ponorogo' },
      { regency: 'Probolinggo' },
      { regency: 'Sampang' },
      { regency: 'Sidoarjo' },
      { regency: 'Situbondo' },
      { regency: 'Sumenep' },
      { regency: 'Surabaya' },
      { regency: 'Trenggalek' },
      { regency: 'Tuban' },
      { regency: 'Tulungagung' },
    ],
  },
  {
    province: 'Kalimantan Barat',
    district: [
      { regency: 'Bengkayang' },
      { regency: 'Kapuas Hulu' },
      { regency: 'Kayong Utara' },
      { regency: 'Ketapang' },
      { regency: 'Kubu Raya' },
      { regency: 'Landak' },
      { regency: 'Melawi' },
      { regency: 'Mempawah' },
      { regency: 'Pontianak' },
      { regency: 'Sambas' },
      { regency: 'Sanggau' },
      { regency: 'Sekadau' },
      { regency: 'Sintang' },
      { regency: 'Singkawang' },
    ],
  },
  {
    province: 'Kalimantan Selatan',
    district: [
      { regency: 'Banjar' },
      { regency: 'Banjarbaru' },
      { regency: 'Banjarmasin' },
      { regency: 'Barito Kuala' },
      { regency: 'Hulu Sungai Selatan' },
      { regency: 'Hulu Sungai Tengah' },
      { regency: 'Hulu Sungai Utara' },
      { regency: 'Kotabaru' },
      { regency: 'Tabalong' },
      { regency: 'Tanah Bumbu' },
      { regency: 'Tanah Laut' },
      { regency: 'Tapin' },
    ],
  },
  {
    province: 'Kalimantan Tengah',
    district: [
      { regency: 'Barito Selatan' },
      { regency: 'Barito Timur' },
      { regency: 'Barito Utara' },
      { regency: 'Gunung Mas' },
      { regency: 'Kapuas' },
      { regency: 'Katingan' },
      { regency: 'Kotawaringin Barat' },
      { regency: 'Kotawaringin Timur' },
      { regency: 'Lamandau' },
      { regency: 'Murung Raya' },
      { regency: 'Palangka Raya' },
      { regency: 'Pulang Pisau' },
      { regency: 'Sukamara' },
      { regency: 'Seruyan' },
    ],
  },
  {
    province: 'Kalimantan Timur',
    district: [
      { regency: 'Balikpapan' },
      { regency: 'Berau' },
      { regency: 'Bontang' },
      { regency: 'Kutai Barat' },
      { regency: 'Kutai Kartanegara' },
      { regency: 'Kutai Timur' },
      { regency: 'Mahakam Ulu' },
      { regency: 'Paser' },
      { regency: 'Penajam Paser Utara' },
      { regency: 'Samarinda' },
    ],
  },
  {
    province: 'Kalimantan Utara',
    district: [
      { regency: 'Bulungan' },
      { regency: 'Malinau' },
      { regency: 'Nunukan' },
      { regency: 'Tana Tidung' },
      { regency: 'Tarakan' },
    ],
  },
  {
    province: 'Kepulauan Riau',
    district: [
      { regency: 'Bintan' },
      { regency: 'Karimun' },
      { regency: 'Kepulauan Anambas' },
      { regency: 'Lingga' },
      { regency: 'Natuna' },
      { regency: 'Batam' },
      { regency: 'Tanjung Pinang' },
    ],
  },
  {
    province: 'Lampung',
    district: [
      { regency: 'Bandar Lampung' },
      { regency: 'Lampung Barat' },
      { regency: 'Lampung Selatan' },
      { regency: 'Lampung Tengah' },
      { regency: 'Lampung Timur' },
      { regency: 'Lampung Utara' },
      { regency: 'Mesuji' },
      { regency: 'Metro' },
      { regency: 'Pesawaran' },
      { regency: 'Pesisir Barat' },
      { regency: 'Pringsewu' },
      { regency: 'Tanggamus' },
      { regency: 'Tulang Bawang' },
      { regency: 'Tulang Bawang Barat' },
      { regency: 'Way Kanan' },
    ],
  },
  {
    province: 'Maluku',
    district: [
      { regency: 'Ambon' },
      { regency: 'Buru' },
      { regency: 'Buru Selatan' },
      { regency: 'Kepulauan Aru' },
      { regency: 'Maluku Barat Daya' },
      { regency: 'Maluku Tengah' },
      { regency: 'Maluku Tenggara' },
      { regency: 'Seram Bagian Barat' },
      { regency: 'Seram Bagian Timur' },
    ],
  },
  {
    province: 'Maluku Utara',
    district: [
      { regency: 'Halmahera Barat' },
      { regency: 'Halmahera Selatan' },
      { regency: 'Halmahera Tengah' },
      { regency: 'Halmahera Timur' },
      { regency: 'Halmahera Utara' },
      { regency: 'Kepulauan Sula' },
      { regency: 'Pulau Morotai' },
      { regency: 'Pulau Taliabu' },
      { regency: 'Ternate' },
      { regency: 'Tidore Kepulauan' },
    ],
  },
  {
    province: 'Nusa Tenggara Barat',
    district: [
      { regency: 'Bima' },
      { regency: 'Dompu' },
      { regency: 'Kota Bima' },
      { regency: 'Kota Mataram' },
      { regency: 'Lombok Barat' },
      { regency: 'Lombok Tengah' },
      { regency: 'Lombok Timur' },
      { regency: 'Lombok Utara' },
      { regency: 'Sumbawa' },
      { regency: 'Sumbawa Barat' },
    ],
  },
  {
    province: 'Nusa Tenggara Timur',
    district: [
      { regency: 'Alor' },
      { regency: 'Belu' },
      { regency: 'Ende' },
      { regency: 'Flores Timur' },
      { regency: 'Kupang' },
      { regency: 'Lembata' },
      { regency: 'Malaka' },
      { regency: 'Manggarai' },
      { regency: 'Manggarai Barat' },
      { regency: 'Manggarai Timur' },
      { regency: 'Nagekeo' },
      { regency: 'Ngada' },
      { regency: 'Rote Ndao' },
      { regency: 'Sabu Raijua' },
      { regency: 'Sikka' },
      { regency: 'Sumba Barat' },
      { regency: 'Sumba Barat Daya' },
      { regency: 'Sumba Tengah' },
      { regency: 'Sumba Timur' },
      { regency: 'Timor Tengah Selatan' },
      { regency: 'Timor Tengah Utara' },
    ],
  },
  {
    province: 'Papua',
    district: [
      { regency: 'Asmat' },
      { regency: 'Biak Numfor' },
      { regency: 'Jayapura' },
      { regency: 'Jayawijaya' },
      { regency: 'Keerom' },
      { regency: 'Mamberamo Raya' },
      { regency: 'Mamberamo Tengah' },
      { regency: 'Merauke' },
      { regency: 'Mimika' },
      { regency: 'Nabire' },
      { regency: 'Paniai' },
      { regency: 'Pegunungan Bintang' },
      { regency: 'Sarmi' },
      { regency: 'Supiori' },
      { regency: 'Waropen' },
      { regency: 'Yahukimo' },
      { regency: 'Yalimo' },
    ],
  },
  {
    province: 'Papua Barat',
    district: [
      { regency: 'Fakfak' },
      { regency: 'Kaimana' },
      { regency: 'Manokwari' },
      { regency: 'Manokwari Selatan' },
      { regency: 'Pegunungan Arfak' },
      { regency: 'Sorong' },
      { regency: 'Sorong Selatan' },
      { regency: 'Tambrauw' },
      { regency: 'Teluk Bintuni' },
      { regency: 'Teluk Wondama' },
    ],
  },
  {
    province: 'Papua Barat Daya',
    district: [{ regency: 'Sorong' }, { regency: 'Tambrauw' }],
  },
  {
    province: 'Papua Pegunungan',
    district: [
      { regency: 'Jayawijaya' },
      { regency: 'Lanny Jaya' },
      { regency: 'Nduga' },
    ],
  },
  {
    province: 'Papua Selatan',
    district: [{ regency: 'Merauke' }, { regency: 'Asmat' }],
  },
  {
    province: 'Papua Tengah',
    district: [{ regency: 'Puncak Jaya' }, { regency: 'Deiyai' }],
  },
  {
    province: 'Riau',
    district: [
      { regency: 'Bengkalis' },
      { regency: 'Dumai' },
      { regency: 'Indragiri Hilir' },
      { regency: 'Indragiri Hulu' },
      { regency: 'Kampar' },
      { regency: 'Kepulauan Meranti' },
      { regency: 'Kuantan Singingi' },
      { regency: 'Pekanbaru' },
      { regency: 'Pelalawan' },
      { regency: 'Rokan Hilir' },
      { regency: 'Rokan Hulu' },
      { regency: 'Siak' },
    ],
  },
  {
    province: 'Sulawesi Barat',
    district: [
      { regency: 'Majene' },
      { regency: 'Mamasa' },
      { regency: 'Mamuju' },
      { regency: 'Mamuju Tengah' },
      { regency: 'Pasangkayu' },
    ],
  },
  {
    province: 'Sulawesi Selatan',
    district: [
      { regency: 'Bantaeng' },
      { regency: 'Barru' },
      { regency: 'Bone' },
      { regency: 'Bulukumba' },
      { regency: 'Enrekang' },
      { regency: 'Gowa' },
      { regency: 'Jeneponto' },
      { regency: 'Luwu' },
      { regency: 'Luwu Timur' },
      { regency: 'Luwu Utara' },
      { regency: 'Makassar' },
      { regency: 'Maros' },
      { regency: 'Palopo' },
      { regency: 'Parepare' },
      { regency: 'Pinrang' },
      { regency: 'Selayar' },
      { regency: 'Sidenreng Rappang' },
      { regency: 'Sinjai' },
      { regency: 'Soppeng' },
      { regency: 'Takalar' },
      { regency: 'Tana Toraja' },
      { regency: 'Toraja Utara' },
      { regency: 'Wajo' },
    ],
  },
  {
    province: 'Sulawesi Tengah',
    district: [
      { regency: 'Banggai' },
      { regency: 'Banggai Kepulauan' },
      { regency: 'Banggai Laut' },
      { regency: 'Buol' },
      { regency: 'Donggala' },
      { regency: 'Morowali' },
      { regency: 'Morowali Utara' },
      { regency: 'Palu' },
      { regency: 'Parigi Moutong' },
      { regency: 'Poso' },
      { regency: 'Sigi' },
      { regency: 'Tojo Una-Una' },
      { regency: 'Toli-Toli' },
    ],
  },
  {
    province: 'Sulawesi Tenggara',
    district: [
      { regency: 'Bau-Bau' },
      { regency: 'Bombana' },
      { regency: 'Buton' },
      { regency: 'Buton Selatan' },
      { regency: 'Buton Tengah' },
      { regency: 'Buton Utara' },
      { regency: 'Kendari' },
      { regency: 'Kolaka' },
      { regency: 'Kolaka Timur' },
      { regency: 'Kolaka Utara' },
      { regency: 'Konawe' },
      { regency: 'Konawe Kepulauan' },
      { regency: 'Konawe Selatan' },
      { regency: 'Konawe Utara' },
      { regency: 'Muna' },
      { regency: 'Muna Barat' },
      { regency: 'Wakatobi' },
    ],
  },
  {
    province: 'Sulawesi Utara',
    district: [
      { regency: 'Bitung' },
      { regency: 'Bolaang Mongondow' },
      { regency: 'Bolaang Mongondow Selatan' },
      { regency: 'Bolaang Mongondow Timur' },
      { regency: 'Bolaang Mongondow Utara' },
      { regency: 'Kepulauan Sangihe' },
      { regency: 'Kepulauan Siau Tagulandang Biaro' },
      { regency: 'Kepulauan Talaud' },
      { regency: 'Kotamobagu' },
      { regency: 'Manado' },
      { regency: 'Minahasa' },
      { regency: 'Minahasa Selatan' },
      { regency: 'Minahasa Tenggara' },
      { regency: 'Minahasa Utara' },
      { regency: 'Tomohon' },
    ],
  },
  {
    province: 'Sumatra Barat',
    district: [
      { regency: 'Agam' },
      { regency: 'Bukittinggi' },
      { regency: 'Dharmasraya' },
      { regency: 'Kepulauan Mentawai' },
      { regency: 'Lima Puluh Kota' },
      { regency: 'Padang' },
      { regency: 'Padang Panjang' },
      { regency: 'Padang Pariaman' },
      { regency: 'Pariaman' },
      { regency: 'Pasaman' },
      { regency: 'Pasaman Barat' },
      { regency: 'Payakumbuh' },
      { regency: 'Pesisir Selatan' },
      { regency: 'Sawahlunto' },
      { regency: 'Sijunjung' },
      { regency: 'Solok' },
      { regency: 'Solok Selatan' },
      { regency: 'Tanah Datar' },
    ],
  },
  {
    province: 'Sumatra Selatan',
    district: [
      { regency: 'Banyuasin' },
      { regency: 'Empat Lawang' },
      { regency: 'Lahat' },
      { regency: 'Lubuklinggau' },
      { regency: 'Muara Enim' },
      { regency: 'Musi Banyuasin' },
      { regency: 'Musi Rawas' },
      { regency: 'Musi Rawas Utara' },
      { regency: 'Ogan Ilir' },
      { regency: 'Ogan Komering Ilir' },
      { regency: 'Ogan Komering Ulu' },
      { regency: 'Ogan Komering Ulu Selatan' },
      { regency: 'Ogan Komering Ulu Timur' },
      { regency: 'Pagar Alam' },
      { regency: 'Palembang' },
      { regency: 'Prabumulih' },
    ],
  },
  {
    province: 'Sumatra Utara',
    district: [
      { regency: 'Asahan' },
      { regency: 'Batu Bara' },
      { regency: 'Binjai' },
      { regency: 'Dairi' },
      { regency: 'Deli Serdang' },
      { regency: 'Gunungsitoli' },
      { regency: 'Humbang Hasundutan' },
      { regency: 'Karo' },
      { regency: 'Labuhanbatu' },
      { regency: 'Labuhanbatu Selatan' },
      { regency: 'Labuhanbatu Utara' },
      { regency: 'Langkat' },
      { regency: 'Mandailing Natal' },
      { regency: 'Medan' },
      { regency: 'Nias' },
      { regency: 'Nias Barat' },
      { regency: 'Nias Selatan' },
      { regency: 'Nias Utara' },
      { regency: 'Padang Lawas' },
      { regency: 'Padang Lawas Utara' },
      { regency: 'Pematang Siantar' },
      { regency: 'Samosir' },
      { regency: 'Serdang Bedagai' },
      { regency: 'Sibolga' },
      { regency: 'Simalungun' },
      { regency: 'Tanjung Balai' },
      { regency: 'Tapanuli Selatan' },
      { regency: 'Tapanuli Tengah' },
      { regency: 'Tapanuli Utara' },
      { regency: 'Tebing Tinggi' },
      { regency: 'Toba' },
    ],
  },
];
