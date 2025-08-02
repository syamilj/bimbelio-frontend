import { Loader2 } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="fixed left-0 top-0 z-100 flex h-full w-full items-center justify-center bg-[#00000036]">
      <Spinner />
    </div>
  );
}

function Spinner() {
  return <Loader2 className={'mr-2 h-20 w-20 animate-spin'} />;
}
