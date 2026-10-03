import { serverGetSafe } from '@/lib/api/server';
import type { Instructor } from '@/types/database';
import { GraduationCap } from 'lucide-react';
import Image from 'next/image';

type TutorCard = Pick<
  Instructor,
  'name' | 'lastEducation' | 'description' | 'image'
> & { id: string };

// Tutor yang selalu ditampilkan (tidak dikelola lewat admin).
const FEATURED: TutorCard[] = [
  {
    id: 'okky',
    name: 'Kak Okky',
    lastEducation: 'Sastra Arab, UI 2019',
    description: 'Baca cepat, tangkap inti, jawab tepat!',
    image: '/tutors/okky.webp',
  },
  {
    id: 'syamil',
    name: 'Kak Syamil',
    lastEducation: 'Manajemen, UI 2019',
    description: 'PPU bukan tes wawasan, tapi strategi eliminasi!',
    image: '/tutors/syamil.webp',
  },
];

/** Daftar tutor (server). Gagal memuat → hanya tutor unggulan, tanpa merusak halaman. */
export async function TutorsSection() {
  const fromApi = await serverGetSafe<TutorCard[]>(
    '/instructor/getAllInstructor',
    [],
    {
      revalidate: 3600,
      tags: ['instructors'],
    },
  );
  const seen = new Set(
    fromApi.map((t) => t.name.toLowerCase().replace(/^kak\s+/, '')),
  );
  const tutors = [
    ...fromApi,
    ...FEATURED.filter(
      (t) => !seen.has(t.name.toLowerCase().replace(/^kak\s+/, '')),
    ),
  ];
  if (tutors.length === 0) return null;

  return (
    <div
      id="tutors"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-2xl font-bold tracking-display text-ink">
          Kenalan dengan tutormu
        </h3>
        <p className="text-ink-muted">
          Alumni PTN top yang paham strategi asli UTBK.
        </p>
      </div>
      <ul
        tabIndex={0}
        aria-label="Daftar tutor"
        className="-mx-5 scrollbar-none flex snap-x gap-4 overflow-x-auto px-5 pb-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5"
      >
        {tutors.map((t) => (
          <li
            key={t.id}
            className="flex w-48 shrink-0 snap-start flex-col gap-3 sm:w-auto"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-brand-soft">
              {t.image ? (
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, 192px"
                  className="object-cover object-top"
                />
              ) : (
                <GraduationCap
                  className="absolute inset-0 m-auto size-10 text-brand"
                  aria-hidden
                />
              )}
            </div>
            <div className="flex flex-col gap-1 px-1">
              <p className="font-display text-lg leading-tight font-bold tracking-display text-ink">
                {t.name}
              </p>
              <p className="font-mono text-xs font-medium text-ink-muted">
                {t.lastEducation}
              </p>
              {t.description && (
                <p className="mt-1 line-clamp-2 text-sm text-ink">
                  “{t.description}”
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
