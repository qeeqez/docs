import {createFileRoute} from "@tanstack/react-router";
import {getBaseUrl} from "@/lib/base-url";

export const Route = createFileRoute("/robots/txt")({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = getBaseUrl().toString();

        const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      },
    },
  },
});
