import {createFileRoute} from "@tanstack/react-router";
import {getLLMText} from "@/lib/get-llm-text";
import {source} from "@/lib/source.ts";

export const Route = createFileRoute("/$lang/llms-full.txt")({
  server: {
    handlers: {
      GET: async ({params}) => {
        const scan = source
          .getPages()
          .filter((page) => page.locale === params.lang && typeof page.data.getText === "function")
          .map((page) => getLLMText(page as Parameters<typeof getLLMText>[0]));
        const scanned = await Promise.all(scan);
        return new Response(scanned.join("\n\n"), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      },
    },
  },
});
