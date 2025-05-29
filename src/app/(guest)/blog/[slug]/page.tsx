'use client';

import BlogClient from '@/app/(guest)/blog/_components/BlogContent';
import { useGet, UseGetDataType } from '@/lib/fetch-helper/useGet';
import { BlogPost } from '@/types/database';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { Fragment } from 'react';

// // 1) fetch blog
// async function getBlogBySlug(slug: string) {
//   return prisma.blogPost.findUnique({ where: { slug } });
// }

// // 2) generateStaticParams
// export async function generateStaticParams() {
//   const allBlogs = await prisma.blogPost.findMany({ select: { slug: true } });
//   return allBlogs.map((b) => ({ slug: b.slug }));
// }

// // 3) generateMetadata
// export async function generateMetadata(
//   props: BlogPageProps,
// ): Promise<Metadata> {
//   const params = await props.params;
//   const blog = await getBlogBySlug(params.slug);
//   if (!blog) {
//     return {
//       title: 'Blog Not Found | TutorSNBT',
//       description: 'Maaf, artikel tidak ditemukan.',
//       openGraph: {
//         title: 'Blog Not Found | TutorSNBT',
//         description: 'Maaf, artikel tidak ditemukan.',
//       },
//       twitter: { card: 'summary_large_image' },
//     };
//   }
//   return {
//     title: `${blog.title} | TutorSNBT Blog`,
//     description:
//       blog.description ?? `Baca tentang ${blog.title} di TutorSNBT Artikel`,
//     openGraph: {
//       title: `${blog.title} | TutorSNBT Artikel`,
//       description:
//         blog.description ?? `Baca tentang ${blog.title} di TutorSNBT Artikel`,
//       images: [blog.thumbnail],
//       type: 'article',
//     },
//     twitter: { card: 'summary_large_image' },
//   };
// }

// 4) page.tsx
export default function BlogServerPage() {
  const params = useParams();
  const { data: blog, isLoading }: UseGetDataType<BlogPost> = useGet(
    '/blog/getBlogBySlug',
    {
      params: { slug: params.slug },
      useEffectDependencies: [params],
    },
  );

  // const params = await props.params;
  // const blog = await getBlogBySlug(params.slug);

  if (isLoading) {
    return (
      <div className="flex w-full h-[90vh] justify-center items-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

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
    // ... dll
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
