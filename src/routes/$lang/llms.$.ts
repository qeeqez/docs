import {createFileRoute} from "@tanstack/react-router";
import {llmsHandler} from "@/lib/server/llms-handler";

export const Route = createFileRoute("/$lang/llms/$")({
  server: {
    handlers: {
      GET: llmsHandler,
    },
  },
});
