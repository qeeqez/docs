import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/og/$")({
  server: {
    handlers: {
      GET: async (ctx) => {
        const {ogImageHandler} = await import("@/lib/server/og-handler.server");
        return ogImageHandler(ctx);
      },
    },
  },
});
