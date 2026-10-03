import { BubbleLoader } from '@/components/patterns/bubble-loader';

export default function Loading() {
  return (
    <div
      data-surface="ink"
      className="flex min-h-dvh items-center justify-center"
    >
      <BubbleLoader label="Memuat halaman…" />
    </div>
  );
}
