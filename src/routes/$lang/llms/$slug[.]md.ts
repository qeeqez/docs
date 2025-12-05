import {source} from "@/lib/source.ts";
import {createFileRoute, notFound} from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/llms/$slug.md")({
  server: {
    handlers: {
      GET: async ({params}) => {
        const slugArray = params._splat.split("/");
        const page = source.getPage(slugArray, params.lang);
        if (!page) throw notFound();
        const markdown = page.data.body.toString();
        return new Response(markdown, {
          headers: {
            "Content-Type": "text/markdown",
          },
        });
      },
    },
  },
});
