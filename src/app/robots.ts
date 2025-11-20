import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.bimbelio.com'; // Should ideally come from env

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/*/admin/', '/*/user/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
