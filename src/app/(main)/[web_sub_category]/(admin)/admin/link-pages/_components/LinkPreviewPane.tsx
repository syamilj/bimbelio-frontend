'use client';

import {
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Music4,
  Twitter,
  Youtube,
} from 'lucide-react';
import { Inter, Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import { memo, useMemo } from 'react';

import { cn } from '@/lib/utils';
import { LinkButton, LinkPageDetail } from '@/types/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

interface LinkPreviewPaneProps {
  page?: LinkPageDetail | null;
  buttons: LinkButton[];
  className?: string;
}

const socialIconMap: Record<string, any> = {
  instagram: Instagram,
  tiktok: Music4,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  whatsapp: MessageCircle,
  website: Globe,
  custom: ExternalLink,
};

const phoneChrome =
  'relative mx-auto flex w-full max-w-sm flex-col rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl ring-1 ring-black/5 backdrop-blur';

const halftone = `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`;

const resolveBackground = (
  page?: LinkPageDetail | null,
): React.CSSProperties => {
  if (!page) {
    return {
      backgroundColor: '#101828',
      backgroundImage: halftone,
      backgroundSize: '18px 18px',
    };
  }

  if (page.backgroundType === 'IMAGE' && page.backgroundImage) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(5,5,5,0.75), rgba(5,5,5,0.4)), url(${page.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (page.backgroundType === 'COLOR') {
    return {
      backgroundColor: page.backgroundColor || '#101828',
      backgroundImage: halftone,
      backgroundSize: '18px 18px',
    };
  }

  if (page.backgroundType === 'GRADIENT') {
    return {
      backgroundImage: page.backgroundColor
        ? `radial-gradient(circle at top, ${page.backgroundColor}, rgba(3,7,18,0.9))`
        : 'linear-gradient(120deg, #4338CA, #2563EB)',
    };
  }

  return {
    backgroundColor: page.backgroundColor || '#101828',
    backgroundImage: halftone,
    backgroundSize: '18px 18px',
  };
};

const groupBySection = (buttons: LinkButton[]) => {
  const sorted = [...buttons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const map = new Map<string, LinkButton[]>();
  const order: string[] = [];

  sorted.forEach((btn) => {
    const label = btn.sectionLabel?.trim() || '';
    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(btn);
  });

  return order.map((label) => ({
    key: label || 'default',
    label: label || null,
    buttons: map.get(label)!,
  }));
};

const ButtonPreview = memo(function ButtonPreview({
  button,
}: {
  button: LinkButton;
}) {
  const type = button.type || 'PRIMARY';
  const baseColor = button.color || '#ffffff';
  const baseTextColor = button.textColor || '#000000';
  const radius = button.borderRadius || '99999px';

  let finalBg = baseColor;
  let finalTxt = baseTextColor;
  let borderStyle = 'none';
  let shadow = '0 2px 4px rgba(0,0,0,0.1)';

  if (type === 'OUTLINE') {
    finalBg = 'transparent';
    finalTxt = baseColor;
    borderStyle = `2px solid ${baseColor}`;
    shadow = 'none';
  } else if (type === 'SECONDARY') {
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

  if (type === 'PRIMARY' && !button.color) {
    finalBg = 'rgba(255, 255, 255, 0.95)';
    finalTxt = '#000000';
  }

  return (
    <div
      className="group relative flex w-full items-center justify-center overflow-hidden px-6 py-4 transition-transform active:scale-[0.98]"
      style={{
        backgroundColor: finalBg,
        color: finalTxt,
        borderRadius: radius,
        border: borderStyle,
        boxShadow: shadow,
      }}
    >
      <div className="relative flex w-full items-center justify-center">
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
              <span className="text-lg">⭐️</span>
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
    </div>
  );
});

export const LinkPreviewPane = memo(function LinkPreviewPane({
  page,
  buttons,
  className,
}: LinkPreviewPaneProps) {
  const groups = useMemo(() => groupBySection(buttons), [buttons]);
  const socialEntries = Object.entries(page?.socialLinks || {}).filter(
    ([, url]) => Boolean(url),
  );
  const style = useMemo(() => resolveBackground(page), [page]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Live Preview</p>
        <p>Simulates how visitors see your link page.</p>
      </div>
      <div className="rounded-[40px] border border-muted-foreground/20 bg-muted/20 p-4">
        <div className={phoneChrome}>
          <div
            className={cn(
              'rounded-[26px] border border-white/10 bg-gradient-to-b from-black/60 to-black/20 p-4 text-white h-[600px] overflow-y-auto no-scrollbar',
              inter.variable,
              playfair.variable,
              'font-sans',
            )}
            style={style}
          >
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/0 via-black/5 to-black/20" />

            <div className="relative z-10 flex flex-col items-center text-center pt-8">
              {page?.profileImage && (
                <div className="group relative mb-5 h-24 w-24 overflow-hidden rounded-full shadow-2xl ring-4 ring-white/20">
                  <Image
                    src={page.profileImage}
                    alt={page.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-md font-serif">
                {page?.title || 'Your Link Page'}
              </h1>

              {page?.description && (
                <p className="mt-2 max-w-[200px] text-sm font-medium leading-relaxed text-white/90 drop-shadow-sm">
                  {page.description}
                </p>
              )}

              {socialEntries.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {socialEntries.map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = socialIconMap[platform.toLowerCase()] || Globe;
                    return (
                      <div
                        key={platform}
                        className="group flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white"
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative z-10 mt-8 space-y-6 pb-8">
              {groups.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/30 px-4 py-6 text-center text-xs text-white/60">
                  No buttons yet.
                </div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.key}
                    className="space-y-3"
                  >
                    {group.label && (
                      <div className="px-1 pb-1 text-center">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 drop-shadow-sm">
                          {group.label}
                        </h2>
                      </div>
                    )}
                    <div className="space-y-3">
                      {group.buttons.map((btn) => (
                        <ButtonPreview
                          key={btn.id}
                          button={btn}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <footer className="relative z-10 mt-8 flex flex-col items-center gap-4 text-center pb-4">
              <div className="h-px w-12 bg-white/20" />
              <div className="text-[10px] font-medium text-white/50">
                <p>
                  © {new Date().getFullYear()} {page?.title}
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
});
