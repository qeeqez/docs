import {generateOGImage} from "@/lib/og";
import {source} from "@/lib/source.ts";
import {createFileRoute, notFound} from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/og/$slug")({
  server: {
    handlers: {
      GET: async ({params}) => {
        const slugArray = params.slug.split("/");
        const page = source.getPage(slugArray, params.lang);

        if (!page) {
          throw notFound();
        }

        const imageResponse = await generateOGImage(page);

        return imageResponse;
      },
    },
  },
});
