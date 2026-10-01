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
        success: <CircleCheck className="size-4 text-success" />,
        error: <CircleX className="size-4 text-danger" />,
        warning: <TriangleAlert className="size-4 text-marker-ink" />,
        info: <Info className="size-4 text-brand-strong" />,
        loading: (
          <LoaderCircle className="size-4 animate-spin text-ink-muted" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            'bg-surface! text-ink! border-line! rounded-md! shadow-overlay! font-sans! gap-3! items-start!',
          title: 'text-sm! font-semibold!',
          description: 'text-ink-muted! text-sm!',
          icon: 'mt-0.5!',
          actionButton: 'bg-brand-strong! text-brand-ink! rounded-sm!',
          cancelButton: 'bg-paper! text-ink! rounded-sm!',
          closeButton: 'bg-surface! border-line! text-ink-muted!',
        },
      }}
      {...props}
    />
  );
}
