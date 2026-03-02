import {createFileRoute} from "@tanstack/react-router";
import {getBaseUrl} from "@/lib/base-url";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = getBaseUrl();
        const sitemapUrl = new URL("/sitemap.xml", baseUrl).toString();

        const robots = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}`;

        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      },
    },
  },
});
