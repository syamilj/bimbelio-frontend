import { siteConfig } from '@/config/site';
import { getPost, getPosts, relatedPosts } from '@/features/blog/api';
import {
  ShareButton,
  TableOfContents,
  ViewCounter,
} from '@/features/blog/article-client';
import { formatPostDate, formatViews } from '@/features/blog/format';
import { PostCard } from '@/features/blog/post-card';
import { readingMinutes, renderArticle } from '@/features/blog/render';
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
      images: post.thumbnail
        ? [{ url: post.thumbnail, width: 1200, height: 630, alt: post.title }]
        : undefined,
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
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-10 sm:px-6 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <ViewCounter postId={post.id} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article className="flex min-w-0 flex-col gap-8">
          <header className="flex flex-col gap-5">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink"
            >
              <ArrowLeft
                className="size-4"
                aria-hidden
              />
              Semua artikel
            </Link>
            {post.tags?.length > 0 && (
              <p className="flex flex-wrap gap-x-3 text-sm font-semibold text-brand-strong">
                {post.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </p>
            )}
            <h1 className="max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-balance text-ink sm:text-4xl">
              {post.title}
            </h1>
            <p className="max-w-2xl text-lg text-pretty text-ink-muted">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
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
            <div className="relative aspect-[1200/630] overflow-hidden rounded-lg border border-line bg-paper">
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
            <details className="rounded-md border border-line bg-surface p-4 lg:hidden">
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
            className="prose prose-lg max-w-none prose-slate prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-brand-strong prose-img:rounded-md"
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
            className="text-2xl font-extrabold tracking-tight text-ink"
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
