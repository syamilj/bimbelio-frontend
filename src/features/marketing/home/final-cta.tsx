import { ContactButton } from '@/components/layout/site/contact';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/** Penutup beranda: satu ajakan utama. */
export function FinalCta() {
  return (
    <section className="bg-brand-strong text-brand-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl">
            Mulai persiapanmu hari ini
          </h2>
          <p className="text-lg">
            Pilih paket, ikuti jadwalnya, dan biarkan tutor, mentor, serta
            BimBot menemanimu sampai hari ujian.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="accent"
          >
            <Link href="/price">Lihat paket belajar</Link>
          </Button>
          <ContactButton
            size="lg"
            variant="outline"
            className="border-brand-ink/40 bg-transparent text-brand-ink hover:bg-brand-ink/10"
          />
        </div>
      </div>
    </section>
  );
}
