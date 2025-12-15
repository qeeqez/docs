import {source} from "@/lib/source";
import {notFound} from "@tanstack/react-router";

export const llmsHandler = async ({params}: {params: {lang: string; _splat?: string}}) => {
  const slugs = params._splat?.split("/") ?? [];
  const page = source.getPage(slugs, params.lang);
  if (!page) throw notFound();

  return new Response(await page.data.getText("raw"), {
    headers: {
      "Content-Type": "text/markdown",
    },
  });
};
