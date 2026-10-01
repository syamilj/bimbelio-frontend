import { serverGet, serverGetSafe } from '@/lib/api/server';
import 'server-only';
import { readingMinutes } from './render';
import type { BlogPost, BlogSummary } from './types';

const toSummary = ({ value, ...post }: BlogPost): BlogSummary => ({
  ...post,
  tags: post.tags ?? [],
  readingMinutes: readingMinutes(value),
});

/** Semua artikel terbit, terbaru dulu. */
export async function getPosts(): Promise<BlogSummary[]> {
  const posts = await serverGetSafe<BlogPost[]>('/blog/getBlog', [], {
    revalidate: 600,
    tags: ['blog'],
  });
  return posts
    .map(toSummary)
    .sort(
      (a, b) =>
        +new Date(b.publishedAt ?? b.createdAt) -
        +new Date(a.publishedAt ?? a.createdAt),
    );
}

export async function getPost(slug: string) {
  return serverGet<BlogPost>('/blog/getBlogBySlug', {
    params: { slug },
    revalidate: 600,
    tags: ['blog', `blog:${slug}`],
  });
}

/** Artikel terkait: tag yang sama dulu, lalu terbaru. */
export function relatedPosts(
  posts: BlogSummary[],
  current: BlogPost,
  limit = 4,
) {
  const tags = new Set(current.tags ?? []);
  return posts
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({ post: p, score: p.tags.filter((t) => tags.has(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}
