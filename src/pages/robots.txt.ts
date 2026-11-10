import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('Site URL is not configured.', { status: 500 });
  }

  const sitemapUrl = new URL('sitemap-index.xml', site);

  return new Response(`User-agent: *
Allow: /

Sitemap: ${sitemapUrl.href}
`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
