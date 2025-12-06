'use client';

import dynamic from 'next/dynamic';

const BlogContent = dynamic(() => import('./BlogContent'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-16 text-center">
      <p>Loading...</p>
    </div>
  ),
});

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  value: string;
  thumbnail: string;
  views: number;
  createdAt: Date;
  tags: string[];
  publishedAt: Date | null;
  updatedAt: Date;
  isEditorPick: boolean | null;
  website_sub_category_id: string;
}

export default function BlogClientWrapper({ blog }: { blog: BlogPost }) {
  return <BlogContent blog={blog} />;
}
