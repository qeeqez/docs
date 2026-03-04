import {createFileRoute, notFound} from "@tanstack/react-router";
import {getLLMText} from "@/lib/get-llm-text";
import {source} from "@/lib/source";

export const Route = createFileRoute("/$lang/{$}.md")({
  server: {
    handlers: {
      GET: async ({params}) => {
        const splat = params._splat ?? "";
        const slugs = splat ? splat.split("/") : [];
        const page = source.getPage(slugs, params.lang);

        if (!page || typeof page.data.getText !== "function") throw notFound();

        const content = await getLLMText(page as Parameters<typeof getLLMText>[0]);
        return new Response(content, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
          },
        });
      },
    },
  },
});
