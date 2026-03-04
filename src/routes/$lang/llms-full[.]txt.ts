import {createFileRoute} from "@tanstack/react-router";
import {getLLMText} from "@/lib/get-llm-text";
import {source} from "@/lib/source.ts";

export const Route = createFileRoute("/$lang/llms-full.txt")({
  server: {
    handlers: {
      GET: async ({params}) => {
        const scan = source
          .getPages()
          .filter((page) => {
            if (page.locale !== params.lang) return false;

            const hasMarkdownText = typeof page.data.getText === "function";
            const hasOpenApiData =
              typeof (page.data as {getAPIPageProps?: unknown}).getAPIPageProps === "function" &&
              typeof (page.data as {getSchema?: unknown}).getSchema === "function";

            return hasMarkdownText || hasOpenApiData;
          })
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
