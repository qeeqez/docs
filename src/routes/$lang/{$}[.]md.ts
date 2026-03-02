import {createFileRoute} from "@tanstack/react-router";
import {llmsHandler} from "@/lib/server/llms-handler";

export const Route = createFileRoute("/$lang/{$}.md")({
  server: {
    handlers: {
      GET: llmsHandler,
    },
  },
});
