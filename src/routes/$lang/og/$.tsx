import {createFileRoute} from "@tanstack/react-router";
import {ogImageHandler} from "@/lib/server/og-handler";

export const Route = createFileRoute("/$lang/og/$")({
  server: {
    handlers: {
      GET: ogImageHandler,
    },
  },
});
