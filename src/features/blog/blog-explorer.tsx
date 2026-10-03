'use client';

import { EmptyState } from '@/components/patterns/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Newspaper, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PostCard } from './post-card';
import type { BlogSummary } from './types';

type Sort = 'recent' | 'popular' | 'updated';
const SORT_LABEL: Record<Sort, string> = {
  recent: 'Terbaru',
  popular: 'Terpopuler',
  updated: 'Baru diperbarui',
};

/** Pencarian, filter tag, dan urutan artikel (data sudah dirender server). */
export function BlogExplorer({ posts }: { posts: BlogSummary[] }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>('recent');

  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) =>
      p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)),
    );
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([t]) => t);
  }, [posts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = posts.filter(
      (p) =>
        (!tag || p.tags.includes(tag)) &&
        (!q ||
          `${p.title} ${p.description} ${p.tags.join(' ')}`
            .toLowerCase()
            .includes(q)),
    );
    const key: Record<Sort, (p: BlogSummary) => number> = {
      recent: (p) => +new Date(p.publishedAt ?? p.createdAt),
      popular: (p) => p.views,
      updated: (p) => +new Date(p.updatedAt),
    };
    return [...list].sort((a, b) => key[sort](b) - key[sort](a));
  }, [posts, query, tag, sort]);

  const reset = () => {
    setQuery('');
    setTag(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-sm sm:flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle"
            aria-hidden
          />
          <Input
            type="search"
            aria-label="Cari artikel"
            placeholder="Cari artikel"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={sort}
          onValueChange={(v) => setSort(v as Sort)}
        >
          <SelectTrigger
            className="sm:ml-auto sm:w-48"
            aria-label="Urutkan"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABEL) as Sort[]).map((s) => (
              <SelectItem
                key={s}
                value={s}
              >
                {SORT_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {topTags.length > 0 && (
        <div
          role="group"
          aria-label="Filter tag"
          className="flex flex-wrap gap-2"
        >
          {topTags.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tag === t}
              onClick={() => setTag(tag === t ? null : t)}
              className={cn(
                'inline-flex h-9 items-center rounded-full border-[1.5px] px-3.5 font-mono text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none',
                tag === t
                  ? 'border-ink bg-ink text-white'
                  : 'border-line-strong bg-surface text-ink hover:border-ink',
              )}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      <p
        className="font-mono text-xs font-medium text-ink-muted"
        aria-live="polite"
      >
        {visible.length} artikel
      </p>

      {visible.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="Tidak ada artikel yang cocok"
          description="Coba kata kunci lain atau hapus filter tag."
          action={
            <Button
              variant="outline"
              onClick={reset}
            >
              Hapus filter
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              priority={i < 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}
