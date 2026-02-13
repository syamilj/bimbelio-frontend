'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BetaBannerProps {
  dismissible?: boolean;
  className?: string;
}

export function BetaBanner({
  dismissible = true,
  className,
}: BetaBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const storageKey = 'bimarena-quiz-beta-banner-dismissed';

  useEffect(() => {
    if (dismissible) {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed === 'true') {
        setIsVisible(false);
      }
    }
  }, [dismissible]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (dismissible) {
      localStorage.setItem(storageKey, 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <Alert
      className={cn(
        'border-2 border-sky-100 bg-gradient-to-r from-sky-50/80 to-blue-50/50 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-sky-600" />
        </div>

        <div className="flex-1 min-w-0">
          <AlertDescription className="text-sm text-slate-700">
            <span className="font-semibold text-sky-700">Beta Feature:</span>{' '}
            Fitur Quiz masih dalam tahap testing dan pengembangan. Kami sedang
            menghadirkan pengalaman belajar terbaik untuk Anda. Feedback dan
            saran Anda sangat berarti!
          </AlertDescription>
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="shrink-0 p-1 rounded-full hover:bg-sky-100 transition-colors group"
            aria-label="Tutup banner"
          >
            <X className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </button>
        )}
      </div>
    </Alert>
  );
}
