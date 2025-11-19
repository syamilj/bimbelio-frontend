import { env } from '@/env.mjs';
import axios from 'axios';
import { Metadata } from 'next';
import { Fragment } from 'react';
import BlogClient from '../_components/BlogContent';

async function getBlogBySlug(slug: string) {
  try {
    const response = await axios.get(
      `${env.NEXT_PUBLIC_API_URL}/blog/getBlogBySlug`,
      {
        params: { slug },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const blog = await getBlogBySlug((await params).slug);

  return {
    title: blog?.title,
    description: blog?.description,
    openGraph: {
      title: blog?.title,
      description: blog?.description,
      images: [
        {
          url: blog?.thumbnail || '',
          width: 1200,
          height: 630,
          alt: blog?.title,
        },
      ],
    },
  };
}

export default async function BlogServerPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const blog = await getBlogBySlug((await params).slug);

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Blog post not found</h1>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    image: blog.thumbnail,
    datePublished: blog.createdAt,
  };

  return (
    <Fragment>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogClient blog={blog} />
    </Fragment>
  );
}
