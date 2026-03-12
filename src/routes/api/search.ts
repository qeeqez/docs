import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async () => {
        const [{source}, {createFromSource}] = await Promise.all([import("@/lib/source.server"), import("fumadocs-core/search/server")]);
        const server = createFromSource(source, {
          language: "english",
        });
        return server.staticGET();
      },
    },
  },
});
