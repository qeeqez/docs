import {createFileRoute} from "@tanstack/react-router";
import {getLLMText} from "@/lib/get-llm-text";

export const Route = createFileRoute("/$lang/llms/full")({
  server: {
    handlers: {
      GET: async ({params}) => {
        const content = await getLLMText(params.lang);

        return new Response(content, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      },
    },
  },
});
