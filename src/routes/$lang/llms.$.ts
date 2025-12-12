import {createFileRoute, notFound} from "@tanstack/react-router";
import {source} from "@/lib/source";

export const Route = createFileRoute("/$lang/llms/$")({
  server: {
    handlers: {
      GET: async ({params}) => {
        const slugs = params._splat?.split("/") ?? [];
        const page = source.getPage(slugs, params.lang);
        if (!page) throw notFound();

        return new Response(await page.data.getText("raw"), {
          headers: {
            "Content-Type": "text/markdown",
          },
        });
      },
    },
  },
});
