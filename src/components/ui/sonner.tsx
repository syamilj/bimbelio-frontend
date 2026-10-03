'use client';

import {
  CircleCheck,
  CircleX,
  Info,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/** Satu-satunya <Toaster> aplikasi; dipasang di root layout. */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      gap={8}
      icons={{
        success: <CircleCheck className="size-4 text-lime" />,
        error: <CircleX className="size-4 text-pink" />,
        warning: <TriangleAlert className="size-4 text-lime" />,
        info: <Info className="size-4 text-brand-muted" />,
        loading: <LoaderCircle className="size-4 animate-spin text-white/70" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'bg-ink! text-white! border-ink! rounded-md! shadow-float! font-sans! gap-3! items-start!',
          title: 'text-sm! font-semibold!',
          description: 'text-white/75! text-sm!',
          icon: 'mt-0.5!',
          actionButton: 'bg-lime! text-ink! rounded-full! font-semibold!',
          cancelButton: 'bg-white/10! text-white! rounded-full!',
          closeButton: 'bg-ink! border-white/20! text-white/80!',
        },
      }}
      {...props}
    />
  );
}
