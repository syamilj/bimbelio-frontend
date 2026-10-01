import { siteConfig } from '@/config/site';
import { getPlans } from '@/features/billing/api';
import { getPosts } from '@/features/blog/api';
import { serverGetSafe } from '@/lib/api/server';
import type { MetadataRoute } from 'next';

export const revalidate = 3600;

const STATIC: {
  path: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: number;
}[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/price', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/tryout', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/calendar', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/scholarship', changeFrequency: 'monthly', priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, plans, links] = await Promise.all([
    getPosts(),
    getPlans(),
    serverGetSafe<{ slug: string; updatedAt: string }[]>(
      '/link/public/sitemap-slugs',
      [],
      { revalidate: 3600 },
    ),
  ]);

  return [
    ...STATIC.map((s) => ({
      url: `${siteConfig.url}${s.path}`,
      changeFrequency: s.changeFrequency,
      priority: s.priority,
    })),
    ...posts.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...plans.map((p) => ({
      url: `${siteConfig.url}/price/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...links.map((l) => ({
      url: `${siteConfig.url}/link/${l.slug}`,
      lastModified: new Date(l.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];
}
