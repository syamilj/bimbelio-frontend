import { cn } from '@/lib/utils';

/**
 * Coretan: komentar tangan Lio/mentor (Shantell Sans 700, miring −3° s.d. −6°).
 * Satu kalimat pendek, ikut alur isi, tidak pernah menimpa teks. Maks. 1 per
 * layar di aplikasi, 2 di marketing, tidak dipakai di admin.
 * Warna: Biru di latar terang, aksen di permukaan Biru/Tinta.
 */
export function Scribble({
  className,
  arrow,
  children,
  ...props
}: React.ComponentProps<'p'> & {
  /** Panah tangan yang menunjuk ke arah konten. */
  arrow?: 'up' | 'left' | 'down';
}) {
  return (
    <p
      data-slot="scribble"
      className={cn(
        'inline-flex w-fit -rotate-4 items-end gap-2 font-hand text-xl leading-tight font-bold text-brand in-data-[surface]:text-highlight',
        className,
      )}
      {...props}
    >
      {arrow === 'left' && <Arrow className="mb-1 -scale-x-100 rotate-12" />}
      <span>{children}</span>
      {arrow === 'up' && <Arrow className="-mb-1 -rotate-60" />}
      {arrow === 'down' && <Arrow className="mb-1 rotate-50" />}
    </p>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={cn('size-9 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 30 C14 14 28 10 41 16" />
      <path d="M33 9 L42 16 L33 22" />
    </svg>
  );
}
