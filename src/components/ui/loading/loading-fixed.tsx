import { Loader2 } from 'lucide-react';

export const LoadingFixed = () => {
  return (
    <div className="flex w-full h-full fixed top-0 left-0 justify-center items-center z-[100000000] bg-white">
      <Loader2 className="animate-spin w-4 h-4" />
    </div>
  );
};
