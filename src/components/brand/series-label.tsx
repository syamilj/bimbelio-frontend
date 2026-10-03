import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/**
 * Label seri berikon (brand book hlm. 57): pil dengan ikon Lucide di dalam
 * lingkaran aksen. Pil putih di permukaan gelap, pil Tinta di latar terang.
 * Dipakai untuk kategori blog, jenis konten, dan label TO.
 */
export function SeriesLabel({
  icon: Icon,
  children,
  episode,
  tone = 'ink',
  className,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  /** Nomor episode, mis. 8 → "#08". */
  episode?: number;
  tone?: 'ink' | 'light';
  className?: string;
}) {
  return (
    <span
      data-slot="series-label"
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-full py-1 pr-3.5 pl-1 text-sm font-semibold whitespace-nowrap',
        tone === 'ink' ? 'bg-ink text-white' : 'bg-white text-ink',
        className,
      )}
    >
      <span className="inline-flex size-6 items-center justify-center rounded-full bg-highlight text-highlight-ink">
        <Icon
          className="size-3.5"
          strokeWidth={2.25}
          aria-hidden
        />
      </span>
      {children}
      {episode !== undefined && (
        <span className="tabular-nums">
          #{String(episode).padStart(2, '0')}
        </span>
      )}
    </span>
  );
}
