'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { Check, Link2, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { TocItem } from './render';

/** Tambah hitungan baca sekali per sesi browser (bukan setiap render/refresh). */
export function ViewCounter({ postId }: { postId: string }) {
  useEffect(() => {
    const key = `blog-viewed:${postId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {}
    api
      .post('/blog/incrementViews', undefined, { params: { id: postId } })
      .catch(() => {});
  }, [postId]);
  return null;
}

/** Bagikan lewat share sheet perangkat; di desktop salin tautan. */
export function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Dibatalkan pengguna: tidak perlu tindakan.
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Tautan artikel disalin');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Tautan tidak dapat disalin');
    }
  };
  const Icon = copied
    ? Check
    : typeof navigator !== 'undefined' && 'share' in navigator
      ? Share2
      : Link2;
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={share}
    >
      <Icon />
      Bagikan
    </Button>
  );
}

/** Daftar isi dengan penanda seksi yang sedang dibaca. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;
  return (
    <nav
      aria-label="Daftar isi"
      className="flex flex-col gap-3"
    >
      <p className="text-sm font-bold text-ink">Daftar isi</p>
      <ol className="flex flex-col border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l-2 py-1.5 text-sm transition-colors',
                item.level === 3 ? 'pl-6' : 'pl-3',
                active === item.id
                  ? 'border-brand font-semibold text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink',
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
