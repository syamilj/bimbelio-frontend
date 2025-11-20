import { MetadataRoute } from 'next';
import { env } from '@/env.mjs';

const BASE_URL = 'https://www.bimbelio.com'; // Should ideally come from env but hardcoded for now based on existing sitemap
const API_URL = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/try-out`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Dynamic Routes (Link Pages)
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${API_URL}/link/public/sitemap-slugs`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      const payload = await response.json();
      const slugs = payload.data as Array<{ slug: string; updatedAt: string }>;

      dynamicRoutes = slugs.map((item) => ({
        url: `${BASE_URL}/link/${item.slug}`,
        lastModified: new Date(item.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch sitemap slugs:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
