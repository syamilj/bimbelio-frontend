import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
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
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface">
      <div className="relative aspect-[1200/630] bg-paper">
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
          <p className="text-sm font-semibold text-brand-strong">
            #{post.tags[0]}
          </p>
        )}
        <h3 className="line-clamp-2 text-lg leading-snug font-bold text-ink">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-ink-muted">
          {post.description}
        </p>
        <p className="mt-auto pt-2 text-xs text-ink-muted">
          <time dateTime={post.publishedAt ?? post.createdAt}>
            {formatPostDate(post.publishedAt ?? post.createdAt)}
          </time>
          , {post.readingMinutes} menit baca
        </p>
      </div>
    </article>
  );
}
