import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL('https://website.niri.workers.dev');
  const sitemapUrl = new URL('sitemap-index.xml', siteUrl);

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${sitemapUrl.href}
`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
};
