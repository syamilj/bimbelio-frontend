import { BubbleLoader } from '@/components/patterns/bubble-loader';

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20">
      <BubbleLoader />
    </div>
  );
}
