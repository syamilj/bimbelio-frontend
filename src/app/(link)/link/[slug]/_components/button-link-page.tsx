'use client';

import { utm } from '@/lib/utm/_core';
import { getLinkPageSlug } from '@/lib/utm/url';
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

export const ButtonLinkPage = ({ button }: { button: LinkButton }) => {
  const type = button.type || 'PRIMARY';
  const baseColor = button.color || '#ffffff';
  const baseTextColor = button.textColor || '#000000';
  const radius = button.borderRadius || '99999px'; // Slightly tighter radius

  let finalBg = baseColor;
  let finalTxt = baseTextColor;
  let borderStyle = 'none';
  let shadow = '0 2px 4px rgba(0,0,0,0.1)';

  if (type === 'OUTLINE') {
    finalBg = 'transparent';
    finalTxt = baseColor; // Use the main color for text/border
    borderStyle = `2px solid ${baseColor}`;
    shadow = 'none';
  } else if (type === 'SECONDARY') {
    // Secondary usually implies a different style, but here we just use the color
    // If color is not provided, maybe fallback to glass
    if (!button.color) {
      finalBg = 'rgba(255, 255, 255, 0.15)';
      finalTxt = '#ffffff';
      borderStyle = '1px solid rgba(255, 255, 255, 0.2)';
    }
  } else if (type === 'TEXT') {
    finalBg = 'transparent';
    finalTxt = baseTextColor || '#ffffff';
    shadow = 'none';
  }

  // Fallback for glass effect if no color set on PRIMARY
  if (type === 'PRIMARY' && !button.color) {
    finalBg = 'rgba(255, 255, 255, 0.95)';
    finalTxt = '#000000';
  }
  return (
    <a
      key={button.id}
      href={button.url}
      target="_blank"
      rel="noopener noreferrer"
      data-link-button
      data-button-id={button.id}
      data-button-title={button.title}
      className="group relative flex w-full items-center justify-center overflow-hidden px-6 py-4 transition-transform active:scale-[0.98]"
      style={{
        backgroundColor: finalBg,
        color: finalTxt,
        borderRadius: radius,
        border: borderStyle,
        boxShadow: shadow,
      }}
      onClick={() => {
        const slug = getLinkPageSlug();
        if (slug) {
          console.log('📄 Link Page SLUG:', slug);

          utm.trackButtonClick(slug, button.id);
        }
      }}
    >
      <div className="relative flex w-full items-center justify-center">
        {/* Thumbnail/Icon Left */}
        {(button.thumbnail || button.icon) && (
          <div className="absolute left-0 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black/5 object-cover">
            {button.thumbnail ? (
              <Image
                src={button.thumbnail}
                alt=""
                width={32}
                height={32}
                sizes="32px"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg">
                {/* Icon logic here if needed */}⭐️
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          <span className="text-base font-semibold tracking-wide sm:text-lg">
            {button.title}
          </span>
          {button.subtitle && (
            <span className="mt-0.5 text-sm opacity-80 font-medium">
              {button.subtitle}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};
