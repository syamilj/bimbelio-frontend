import { getPosts } from '@/features/blog/api';
import { BlogExplorer } from '@/features/blog/blog-explorer';
import { MarketingSection } from '@/features/marketing/section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Tips, strategi, dan informasi terbaru seputar UTBK-SNBT, ujian mandiri, dan sekolah kedinasan dari tim Bimbelio.',
  alternates: { canonical: '/blog' },
};

export const revalidate = 600;

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <MarketingSection
      headingLevel={1}
      title="Blog Bimbelio"
      description="Tips dan strategi lolos PTN dan kedinasan, ditulis oleh tim yang pernah ada di posisimu."
      className="pt-10 sm:pt-14"
    >
      <BlogExplorer posts={posts} />
    </MarketingSection>
  );
}
