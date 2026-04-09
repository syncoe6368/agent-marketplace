import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/agents', '/categories', '/pricing', '/compare', '/trending', '/changelog', '/legal/terms', '/legal/privacy', '/legal/guidelines', '/legal/dmca', '/'],
        disallow: ['/auth/', '/dashboard/', '/submit/', '/api/', '/admin/'],
      },
    ],
    sitemap: 'https://agenthub.syncoe.com/sitemap.xml',
  };
}
