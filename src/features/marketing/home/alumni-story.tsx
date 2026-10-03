import { Highlight } from '@/components/brand/highlight';
import { MonoLabel } from '@/components/brand/mono-label';
import { SeriesLabel } from '@/components/brand/series-label';
import { cn } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { SITE_CONTAINER, sectionTitleClass } from '../section';

const STORIES = [
  {
    title: 'Dulu kami juga begitu',
    body: 'Tim kami dari UI, UGM, ITB, STAN, dan kampus top lain. Kami pernah bingung memilih SNBT, mandiri, atau kedinasan, jadi kami tahu apa yang kamu butuhkan.',
  },
  {
    title: 'Satu akun, semua jalur',
    body: 'Tidak perlu daftar banyak bimbel. Satu akun Bimbelio mencakup SNBT, ujian mandiri (UI, UGM, ITB, dan lainnya), sampai SKD kedinasan (STAN, STIS, IPDN).',
  },
];

/**
 * Cerita alumni: tim Bimbelio sendiri adalah alumni PTN & kedinasan. Foto
 * sementara dari paket merek (Pexels, lihat public/photos/KREDIT.md) sampai ada
 * foto & cerita siswa asli dengan izin tertulis.
 */
export function AlumniStorySection() {
  return (
    <section
      id="about"
      data-accent="pink"
      aria-labelledby="alumni-judul"
      className="bg-surface py-16 sm:py-24"
    >
      <div
        className={cn(
          SITE_CONTAINER,
          'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
        )}
      >
        <figure className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-brand-soft">
            <Image
              src="/photos/belajar-laptop-kampus.webp"
              alt="Mahasiswi belajar dengan laptop di taman kampus"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2">
            <MonoLabel>foto ilustrasi</MonoLabel>
          </figcaption>
        </figure>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <SeriesLabel icon={GraduationCap}>Cerita Alumni</SeriesLabel>
            <h2
              id="alumni-judul"
              className={cn(sectionTitleClass, 'text-ink')}
            >
              Kami pernah di <Highlight>posisimu.</Highlight>
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            {STORIES.map((story) => (
              <div
                key={story.title}
                className="flex flex-col gap-2 border-l-[3px] border-brand pl-5"
              >
                <h3 className="font-display text-xl font-bold tracking-display text-ink">
                  {story.title}
                </h3>
                <p className="text-ink-muted">{story.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
