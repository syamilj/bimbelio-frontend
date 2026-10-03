import { siteConfig } from '@/config/site';
import { getPost, getPosts, relatedPosts } from '@/features/blog/api';
import {
  ShareButton,
  TableOfContents,
  ViewCounter,
} from '@/features/blog/article-client';
import { BlogCategory } from '@/features/blog/category';
import { formatPostDate, formatViews } from '@/features/blog/format';
import { PostCard } from '@/features/blog/post-card';
import { readingMinutes, renderArticle } from '@/features/blog/render';
import { PROSE_CLASS } from '@/features/marketing/prose';
import { SITE_CONTAINER } from '@/features/marketing/section';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 600;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post)
    return { title: 'Artikel tidak ditemukan', robots: { index: false } };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/blog/${post.slug}`,
      publishedTime: post.publishedAt ?? post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [
        {
          url:
            post.thumbnail ||
            `/api/og?${new URLSearchParams({ title: post.title, label: 'blog · bimbelio.com', tone: 'ink' })}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [{ html, toc }, posts] = await Promise.all([
    renderArticle(post.value),
    getPosts(),
  ]);
  const related = relatedPosts(posts, post);
  const published = post.publishedAt ?? post.createdAt;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.thumbnail ?? undefined,
    datePublished: published,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: 'Bimbelio', url: siteConfig.url },
    publisher: {
      '@type': 'Organization',
      name: 'Bimbelio',
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/logo.png` },
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    keywords: post.tags?.join(', '),
  };

  return (
    <div className={cn(SITE_CONTAINER, 'flex flex-col gap-16 py-10 lg:py-16')}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <ViewCounter postId={post.id} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
        <article className="flex min-w-0 flex-col gap-8">
          <header className="flex flex-col gap-5">
            <Link
              href="/blog"
              className="inline-flex w-fit items-center gap-1.5 rounded-xs text-sm font-semibold text-ink-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            >
              <ArrowLeft
                className="size-4"
                aria-hidden
              />
              Semua artikel
            </Link>
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <BlogCategory tag={post.tags[0]} />
                {post.tags.slice(1).map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs font-medium text-ink-muted"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
            <h1 className="max-w-[22ch] font-display text-4xl leading-[1.05] font-extrabold tracking-hero text-balance text-ink sm:text-5xl">
              {post.title}
            </h1>
            <p className="max-w-[60ch] text-lg text-pretty text-ink-muted">
              {post.description}
            </p>
            <div className="flex max-w-[46rem] flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-3 font-mono text-xs font-medium text-ink-muted">
              <span>Tim Bimbelio</span>
              <time dateTime={published}>{formatPostDate(published)}</time>
              <span>{readingMinutes(post.value)} menit baca</span>
              <span>{formatViews(post.views)} kali dibaca</span>
              <span className="ml-auto">
                <ShareButton
                  title={post.title}
                  text={post.description}
                />
              </span>
            </div>
          </header>

          {post.thumbnail && (
            <div className="relative aspect-[1200/630] max-w-[46rem] overflow-hidden rounded-lg bg-brand-soft">
              <Image
                src={post.thumbnail}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          {toc.length > 0 && (
            <details className="max-w-[46rem] rounded-md border border-line bg-surface p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-bold text-ink">
                Daftar isi
              </summary>
              <ol className="mt-3 flex flex-col gap-2 text-sm">
                {toc.map((item) => (
                  <li
                    key={item.id}
                    className={item.level === 3 ? 'pl-4' : undefined}
                  >
                    <a
                      href={`#${item.id}`}
                      className="text-ink-muted hover:text-ink"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}

          <div
            className={cn(PROSE_CLASS, 'prose-lg max-w-[70ch]')}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>

        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={toc} />
            </div>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section
          aria-labelledby="terkait"
          className="flex flex-col gap-6"
        >
          <h2
            id="terkait"
            className="font-display text-3xl font-bold tracking-display text-ink"
          >
            Baca juga
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <PostCard
                key={p.id}
                post={p}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
