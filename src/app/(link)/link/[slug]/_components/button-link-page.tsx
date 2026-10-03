'use client';

import { cn } from '@/lib/utils';
import { utm } from '@/lib/utm/_core';
import { getLinkPageSlug } from '@/lib/utm/url';
import { Link2 } from 'lucide-react';
import Image from 'next/image';

interface LinkButton {
  id: string;
  title: string;
  subtitle?: string | null;
  sectionLabel?: string | null;
  url: string;
  color?: string | null;
  textColor?: string | null;
  borderRadius?: string | null;
  icon?: string | null;
  iconType?: string | null;
  type?: 'PRIMARY' | 'SECONDARY' | 'OUTLINE' | 'TEXT' | 'THUMBNAIL' | null;
  order?: number | null;
  thumbnail?: string | null;
}

/**
 * Tombol halaman link. Warna & radius dari pengaturan admin (data, bukan token)
 * tetap dihormati; tanpa pengaturan, tombol memakai gaya merek: pil putih + Tinta.
 */
export const ButtonLinkPage = ({ button }: { button: LinkButton }) => {
  const type = button.type || 'PRIMARY';
  const custom: React.CSSProperties = {};
  if (button.borderRadius) custom.borderRadius = button.borderRadius;
  if (button.color) {
    if (type === 'OUTLINE') {
      custom.color = button.color;
      custom.borderColor = button.color;
    } else if (type !== 'TEXT') custom.backgroundColor = button.color;
  }
  if (button.textColor && type !== 'OUTLINE') custom.color = button.textColor;

  return (
    <a
      href={button.url}
      target="_blank"
      rel="noopener noreferrer"
      data-link-button
      data-button-id={button.id}
      data-button-title={button.title}
      className={cn(
        'relative flex min-h-14 w-full items-center justify-center rounded-full px-14 py-3 text-center transition-transform focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none active:scale-[0.98]',
        type === 'PRIMARY' && 'bg-white text-ink shadow-float',
        type === 'THUMBNAIL' && 'bg-white text-ink shadow-float',
        type === 'SECONDARY' && 'bg-ink text-white',
        type === 'OUTLINE' && 'border-2 border-white text-white',
        type === 'TEXT' && 'text-white underline-offset-4 hover:underline',
      )}
      style={custom}
      onClick={() => {
        const slug = getLinkPageSlug();
        if (slug) utm.trackButtonClick(slug, button.id);
      }}
    >
      {(button.thumbnail || button.icon) && (
        <span className="absolute left-3 flex size-9 items-center justify-center overflow-hidden rounded-full bg-paper text-brand">
          {button.thumbnail ? (
            <Image
              src={button.thumbnail}
              alt=""
              width={36}
              height={36}
              sizes="36px"
              className="size-full object-cover"
            />
          ) : (
            <Link2
              className="size-4"
              aria-hidden
            />
          )}
        </span>
      )}
      <span className="flex flex-col items-center">
        <span className="text-base font-semibold">{button.title}</span>
        {button.subtitle && (
          <span className="mt-0.5 text-sm opacity-80">{button.subtitle}</span>
        )}
      </span>
    </a>
  );
};
