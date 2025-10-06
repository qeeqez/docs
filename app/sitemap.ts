import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://docs.rixl.com';
  const url = (path: string): string => new URL(path, baseUrl).toString();

  return [
    // Main pages
    {
      url: url('/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: url('/api'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    ...source.getPages().map((page) => {
      const { lastModified } = page.data;

      return {
        url: url(page.url),
        lastModified: lastModified ? new Date(lastModified) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    }),
  ];
}
