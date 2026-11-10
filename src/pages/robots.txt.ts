import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site ?? 'https://website.niri.workers.dev');
  const robotsContent = `User-agent: *\\nAllow: /\\n\\nSitemap: ${sitemapUrl.href}\\n`;

  return new Response(robotsContent, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
