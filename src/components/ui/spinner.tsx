'use client';

import { cn } from '@/lib/utils';
import { useStorageSocket } from '@/supabaseClient';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import { Progress } from './progress';

export function Spinner({ width }: { width?: string }) {
  return (
    <Loader2
      className={` ${width ? `h-[${width}] w-[${width}]` : 'h-5 w-5'} animate-spin`}
    />
  );
}

export function SpinnerPage() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <Spinner />
    </div>
  );
}

export function SpinnerPageCentered({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-1000 flex h-full w-full items-center justify-center bg-white',
        className,
      )}
    >
      <Spinner />
    </div>
  );
}

// export function PageError({
//   className,
//   message,
// }: {
//   className?: string;
//   message?: any;
// }) {
//   return (
//     <div
//       className={cn(
//         'fixed left-0 top-0 z-1000 flex h-full w-full items-center justify-center bg-white',
//         className,
//       )}
//     >
//       {message ? JSON.stringify(message) : 'Page Error, Please Refresh'}
//     </div>
//   );
// }

export function SpinnerCentered() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner />
    </div>
  );
}

export function LoadingPopUp({ title }: { title?: string }) {
  return (
    <Dialog open={true}>
      <DialogContent
        className="overflow-hidden border-none bg-[#fff0] p-0 shadow-none"
        classOverlay="bg-[#ffffffe3]"
        hideClose
      >
        <div className="z-100000000 flex items-center justify-center p-6">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-[2rem] animate-spin" />
            <DialogTitle className="text-center text-[1.1rem] font-medium">
              {title ? title : 'Loading...'}{' '}
            </DialogTitle>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LoadingPageWithText({
  heading,
  loading,
}: {
  heading?: string;
  loading: boolean;
}) {
  return (
    <>
      {loading && (
        <div className="fixed left-0 top-0 z-201 flex h-full w-full select-none items-center justify-center bg-[#ffffff52] backdrop-blur-[6px]">
          <div className="flex flex-col items-center gap-[.5rem] text-center">
            <Loader2 className="h-16 w-16 animate-spin text-[#464646]" />
            {heading && (
              <p className="text-[1.3rem] text-[#464646]">{heading}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function LoadingComponentWithText({ heading }: { heading?: string }) {
  return (
    <div className="flex w-full select-none items-center justify-center h-[75vh]">
      <div className="flex flex-col items-center gap-[.5rem] text-center">
        <Loader2 className="h-16 w-16 animate-spin text-[#464646]" />
        <p className="text-[1.3rem] text-[#464646]">
          {heading ? heading : 'Loading'}
        </p>
      </div>
    </div>
  );
}

export function LoadingPageStorage({
  heading,
  loading,
}: {
  heading?: string;
  loading: boolean;
}) {
  const [percentage, setPercentage] = useState<number | undefined>(undefined);

  const { socketId, on, off, emit } = useStorageSocket();
  console.log({ storage: socketId });
  console.log({ percentage });

  useEffect(() => {
    console.log('Setting Loading Storage');
    // Listen ke notification:reminder
    on('loading', (data: { percentage: number }) => {
      console.log('loading diterima:', data);
      // setNotification(data);
      setPercentage(data.percentage);
      if (data.percentage === 100) {
        setPercentage(undefined);
      }
    });
    return () => {
      console.log('Cleaning up notification listener for userId:');
      off(`loading`);
      setPercentage(undefined);
    };
  }, []);

  return (
    <>
      {/* <Button
        className="fixed top-0 left-0 z-[99999]"
        onClick={() => {
          emit('join:loading', { loadingId: '123' });
        }}
      >
        Test Socket
      </Button> */}
      {loading && (
        <div className="fixed left-0 top-0 z-[9999] flex h-full w-full select-none items-center justify-center bg-[#ffffff52] backdrop-blur-[6px]">
          <div className="flex flex-col items-center gap-[.5rem] text-center">
            <Loader2 className="h-16 w-16 animate-spin text-[#464646]" />
            {percentage !== undefined && (
              <div className="w-64 mt-4">
                <Progress
                  value={percentage}
                  className="h-2 bg-gray-300"
                  classNameThumb="bg-gray-600"
                />
                {heading && (
                  <p className="text-[1.3rem] text-[#464646] mt-2">
                    {heading} {percentage.toFixed(1)}%
                  </p>
                )}
                {!heading && (
                  <p className="text-[1.3rem] text-[#464646] mt-2">
                    {percentage.toFixed(1)}%
                  </p>
                )}
              </div>
            )}
            {percentage === undefined && heading && (
              <p className="text-[1.3rem] text-[#464646] mt-2">{heading}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
