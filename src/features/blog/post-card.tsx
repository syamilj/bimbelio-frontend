import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { BlogCategory } from './category';
import { formatPostDate } from './format';
import type { BlogSummary } from './types';

export function PostCard({
  post,
  priority,
}: {
  post: BlogSummary;
  priority?: boolean;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-surface transition-colors focus-within:border-brand hover:border-brand">
      <div className="relative aspect-[1200/630] bg-brand-soft">
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}
        {post.isEditorPick && (
          <Badge
            variant="highlight"
            className="absolute top-3 left-3"
          >
            Pilihan editor
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {post.tags[0] && (
          <BlogCategory
            tag={post.tags[0]}
            className="mb-1"
          />
        )}
        <h3 className="line-clamp-2 font-display text-lg leading-snug font-bold tracking-display text-ink">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:rounded-md focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-ink-muted">
          {post.description}
        </p>
        <p className="mt-auto pt-2 font-mono text-xs font-medium text-ink-muted">
          <time dateTime={post.publishedAt ?? post.createdAt}>
            {formatPostDate(post.publishedAt ?? post.createdAt)}
          </time>
          , {post.readingMinutes} menit baca
        </p>
      </div>
    </article>
  );
}
